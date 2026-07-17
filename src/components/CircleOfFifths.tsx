import { useState } from 'react'
import { audio } from '../audio/AudioEngine'
import { circleOfFifthsMajors } from '../lib/theory'

/** 五度圈：点击调性查看主音阶并试听主和弦 */
export default function CircleOfFifths() {
  const data = circleOfFifthsMajors()
  const [sel, setSel] = useState(data[0])

  const choose = (d: (typeof data)[number]) => {
    setSel(d)
    audio.playNotes([`${d.tonic}3`, `${d.tonic}4`].filter(Boolean) as string[], '1n')
  }

  return (
    <div>
      <div className="viz-label">五度圈 · 点击调性</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
        }}
      >
        {data.map((d) => (
          <button
            key={d.tonic}
            className="card hoverable"
            style={{
              padding: '10px 6px',
              textAlign: 'center',
              borderColor: sel.tonic === d.tonic ? 'var(--accent)' : 'var(--border)',
            }}
            onClick={() => choose(d)}
          >
            <div className="mono" style={{ fontWeight: 700, color: 'var(--accent)' }}>{d.tonic}</div>
            <div className="faint" style={{ fontSize: 11 }}>{d.scale.join(' ')}</div>
          </button>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 12, marginTop: 12 }}>
        当前选中：<span className="accent mono">{sel.tonic} major</span> · 顺时针每步升一个纯五度（多一个升号）。
      </p>
    </div>
  )
}
