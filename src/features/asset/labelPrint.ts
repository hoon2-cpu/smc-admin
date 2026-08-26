import QRCode from 'qrcode'
import type { AssetRow } from './types'

/** HTML 특수문자를 이스케이프합니다. (라벨 텍스트 안전 삽입) */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * 회사 로고(public/logo.png)를 data URL로 불러옵니다.
 * 새 인쇄 창은 앱 base 경로를 모르므로, 이미지를 data URL로 임베드합니다.
 *
 * @returns 로고 data URL, 파일이 없으면 null
 */
async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${import.meta.env.BASE_URL}logo.png`)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/**
 * 자산번호를 QR 코드 이미지(data URL)로 생성합니다.
 *
 * @param value - QR로 인코딩할 값(자산번호)
 * @returns PNG data URL
 */
function makeQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, { margin: 1, width: 200 })
}

/**
 * 자산 라벨(로고 + Code128 바코드)을 새 창에서 생성해 인쇄합니다. (TOSHIBA 라벨 등)
 * 팝업 차단을 피하려 클릭 시점에 창을 먼저 열고, 바코드 생성 후 내용을 채웁니다.
 *
 * @param asset - 인쇄할 자산
 */
export async function printAssetLabel(asset: AssetRow): Promise<void> {
  const win = window.open('', '_blank', 'width=460,height=520')
  if (!win) {
    window.alert('팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 시도해주세요.')
    return
  }
  win.document.write('<p style="font-family:sans-serif;padding:24px">라벨 생성 중…</p>')

  try {
    const value = asset.assetNumber || asset.name
    const qr = await makeQrDataUrl(value)
    const logo = await loadLogoDataUrl()
    // 로고 파일(public/logo.png)이 있으면 이미지, 없으면 텍스트 자리표시
    const logoHtml = logo
      ? `<img class="logo-img" src="${logo}" alt="the SMC" />`
      : `<div class="logo">the <b>SMC</b></div>`

    const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8" />
<title>자산 라벨 ${escapeHtml(asset.assetNumber)}</title>
<style>
  * { box-sizing: border-box; font-family: -apple-system, 'Malgun Gothic', sans-serif; }
  body { margin: 0; }
  /* 라벨 크기 기본값 — TOSHIBA 라벨지 실측(mm)에 맞게 조정 예정 */
  @page { size: 50mm 30mm; margin: 0; }
  .label { width: 50mm; height: 30mm; padding: 2mm; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1mm; }
  .logo { font-size: 11pt; letter-spacing: 0.5px; }
  .logo b { font-weight: 800; }
  .logo-img { height: 5mm; width: auto; object-fit: contain; }
  .qr { width: 17mm; height: 17mm; }
  .num { font-size: 8pt; font-weight: 700; letter-spacing: 0.3px; }
  @media screen {
    body { background: #f1f5f9; padding: 24px; text-align: center; }
    .label { background: #fff; border: 1px solid #ddd; margin: 0 auto; }
    .actions { margin-top: 16px; }
    .actions button { padding: 8px 18px; font-size: 14px; font-weight: 700;
      background: #2563eb; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
  }
  @media print { .actions { display: none; } }
</style></head><body>
  <div class="label">
    ${logoHtml}
    <img class="qr" src="${qr}" alt="QR" />
    <div class="num">${escapeHtml(asset.assetNumber) || '-'}</div>
  </div>
  <div class="actions"><button onclick="window.print()">인쇄</button></div>
  <script>window.onload = function () { setTimeout(function () { window.print() }, 300) }</script>
</body></html>`

    win.document.open()
    win.document.write(html)
    win.document.close()
  } catch (error) {
    console.error('[라벨 생성 실패]', error)
    win.document.body.innerHTML =
      '<p style="font-family:sans-serif;padding:24px;color:#b91c1c">QR 생성에 실패했습니다. 자산번호를 확인해주세요.</p>'
  }
}
