import { useState } from 'react'
import Fretboard from './Fretboard'

const CAGED: { name: string; pcs: string[]; frets: number }[] = [
  { name: 'C', pcs: ['C', 'E', 'G'], frets: 0 },
  { name: 'A', pcs: ['A', 'C', 'E'], frets: 0 },
  { name: 'G', pcs: ['G', 'B', 'D'], frets: 3 },
  { name: 'E', pcs: ['E', 'G', 'B'], frets: 0 },
  { name: 'D', pcs: ['D', 'F', 'A'], frets: 0 },
]

/** CAGED 系统：选择把位，在指板上高亮该形状和弦音 */
export default function ScaleShape() {
  const [sel, setSel] = useState(CAGED[0])
  return (
    <div>
      <div className="viz-label">CAGED 把位系统</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        {CAGED.map((c) => (
          <button
            key={c.name}
            className="chip"
            style={sel.name === c.name ? { background: 'var(--accent)', color: '#0F1115' } : undefined}
            onClick={() => setSel(c)}
          >
            {c.name} 形（根在 {c.frets} 品）
          </button>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 13 }}>
        已高亮 <span className="accent mono">{sel.name}</span> 和弦音：{sel.pcs.join(' / ')}。切换形状观察它们在指板上的不同位置。
      </p>
      <Fretboard highlightPCs={sel.pcs} frets={12} />
    </div>
  )
}
