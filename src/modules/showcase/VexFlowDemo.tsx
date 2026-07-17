import { useState } from 'react'
import StaffCanvas from '../../components/StaffCanvas'

const EXAMPLES = ['C4,E4,G4', 'E4,G4,C5', 'C4,D4,E4,F4', 'G4,B4,D5']

export default function VexFlowDemo() {
  const [text, setText] = useState('C4,E4,G4')
  const notes = text.split(',').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="demo">
      <div className="viz-label">VexFlow · 五线谱实时渲染</div>
      <input
        className="input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="用逗号分隔，如 C4,E4,G4"
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {EXAMPLES.map((ex) => (
          <button key={ex} className="chip" onClick={() => setText(ex)}>{ex}</button>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <StaffCanvas notes={notes.length ? notes : ['C4']} />
      </div>
      <pre className="code">{`import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow'
// 实时把音名数组渲染为可点击的五线谱`}</pre>
    </div>
  )
}
