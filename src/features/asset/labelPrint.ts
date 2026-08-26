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
 * 자산 라벨(QR + 자산정보)을 새 창에서 생성해 인쇄합니다.
 * QR에는 자산번호를 인코딩해, 나중에 스캔으로 조회에 활용할 수 있습니다.
 *
 * 팝업 차단을 피하려고 클릭(사용자 제스처) 시점에 창을 먼저 열고,
 * QR 생성이 끝나면 내용을 채운 뒤 자동으로 인쇄 창을 띄웁니다.
 *
 * @param asset - 인쇄할 자산
 */
export async function printAssetLabel(asset: AssetRow): Promise<void> {
  const win = window.open('', '_blank', 'width=440,height=600')
  if (!win) {
    window.alert('팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 시도해주세요.')
    return
  }
  win.document.write('<p style="font-family:sans-serif;padding:24px">라벨 생성 중…</p>')

  try {
    const payload = asset.assetNumber || asset.name
    const qrDataUrl = await QRCode.toDataURL(payload, { margin: 1, width: 240 })
    const acquisition =
      asset.acquisitionType === '렌탈' ? `렌탈 · ${escapeHtml(asset.rentalCompany)}` : '구매'

    const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8" />
<title>자산 라벨 ${escapeHtml(asset.assetNumber)}</title>
<style>
  * { box-sizing: border-box; font-family: -apple-system, 'Malgun Gothic', sans-serif; }
  body { margin: 0; }
  /* 60mm x 40mm 라벨 기준 (프린터/라벨지에 맞게 조정 가능) */
  @page { size: 60mm 40mm; margin: 0; }
  .label { width: 60mm; height: 40mm; padding: 3mm; display: flex; gap: 3mm; align-items: center; }
  .label img { width: 32mm; height: 32mm; }
  .info { min-width: 0; }
  .info .num { font-size: 12pt; font-weight: 800; }
  .info .name { font-size: 9pt; font-weight: 600; margin-top: 1mm; word-break: break-all; }
  .info .sub { font-size: 8pt; color: #555; margin-top: 1mm; }
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
    <img src="${qrDataUrl}" alt="QR" />
    <div class="info">
      <div class="num">${escapeHtml(asset.assetNumber) || '-'}</div>
      <div class="name">${escapeHtml(asset.name)}</div>
      <div class="sub">${escapeHtml(asset.category)} · ${acquisition}</div>
      <div class="sub">The SMC</div>
    </div>
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
      '<p style="font-family:sans-serif;padding:24px;color:#b91c1c">QR 생성에 실패했습니다.</p>'
  }
}
