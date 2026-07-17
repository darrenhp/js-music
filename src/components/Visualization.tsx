import Keyboard from './Keyboard'
import StaffCanvas from './StaffCanvas'
import IntervalPlayer from './IntervalPlayer'
import ChordDiagram from './ChordDiagram'
import CircleOfFifths from './CircleOfFifths'
import type { VizSpec } from '../data/theory'

/** 按知识点声明的可视化类型分发到对应组件 */
export default function Visualization({ spec }: { spec: VizSpec }) {
  switch (spec.type) {
    case 'keyboard':
      return <Keyboard highlight={spec.highlight} />
    case 'staff':
      return <StaffCanvas notes={spec.notes || ['C4', 'E4', 'G4']} />
    case 'interval':
      return <IntervalPlayer initial={spec.interval} />
    case 'chord':
      return <ChordDiagram chord={spec.chord || 'C'} />
    case 'circle':
      return <CircleOfFifths />
    default:
      return <p className="faint">该知识点暂无可交互示例。</p>
  }
}
