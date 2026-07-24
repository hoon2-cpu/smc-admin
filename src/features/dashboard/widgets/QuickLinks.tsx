import { PlusCircle, ShoppingCart, Package, Wrench, QrCode, FileText } from 'lucide-react'
import { Card } from '@/components/ui'
import './QuickLinks.css'

/** 바로가기 버튼 하나의 정의. */
interface QuickLinkDef {
  label: string
  sub?: string
  tone: string
  Icon: typeof PlusCircle
}

/** 바로가기 버튼 목록. (이미지 ④ 하단 '바로가기') */
const LINKS: QuickLinkDef[] = [
  { label: '자산 등록', tone: 'blue', Icon: PlusCircle },
  { label: '자산 신청', tone: 'green', Icon: ShoppingCart },
  { label: '소모품 신청', tone: 'orange', Icon: Package },
  { label: '유지보수 신청', tone: 'purple', Icon: Wrench },
  { label: 'QR 출력', sub: '자산 QR코드 출력', tone: 'amber', Icon: QrCode },
  { label: '보고서 조회', tone: 'teal', Icon: FileText },
]

/**
 * 자주 쓰는 기능으로 이동하는 바로가기 버튼 묶음.
 * (실제 이동 경로는 각 기능 구현 단계에서 연결합니다.)
 *
 * @returns 바로가기 카드
 */
export default function QuickLinks() {
  return (
    <Card title="바로가기">
      <div className="quick-links">
        {LINKS.map(({ Icon, label, sub, tone }) => (
          <button key={label} type="button" className={`quick-link tone-${tone}`}>
            <Icon size={24} />
            <span className="quick-label">{label}</span>
            {sub && <span className="quick-sub">{sub}</span>}
          </button>
        ))}
      </div>
    </Card>
  )
}
