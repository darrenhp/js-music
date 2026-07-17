import { useState } from 'react'
import * as Tonal from 'tonal'

const EXAMPLES = ['Cmaj7', 'Am7', 'G7', 'C major', 'A minor', 'D dorian']

export default function TonalDemo() {
  const [input, setInput] = useState('Cmaj7')
  const chord = Tonal.Chord.get(input)
  const scale = Tonal.Scale.get(input)

  const hasChord = chord.notes.length > 0
  const hasScale = scale.notes.length > 0

  return (
    <div className="demo">
      <div className="viz-label">Tonal.js · 和弦 / 音阶解析</div>
      <input
        className="input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="输入如 Cmaj7 / A minor / G7"
      />
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {EXAMPLES.map((ex) => (
          <button key={ex} className="chip" onClick={() => setInput(ex)}>{ex}</button>
        ))}
      </div>

      {hasChord && (
        <div style={{ marginTop: 16 }}>
          <h3>和弦：{input}</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {chord.notes.map((n, i) => (
              <span key={i} className="chip">{n}</span>
            ))}
          </div>
          <p className="faint" style={{ fontSize: 13, marginTop: 8 }}>
            类型：{chord.type || '—'} · 音级数：{chord.intervals.join(' ')}
          </p>
        </div>
      )}

      {hasScale && (
        <div style={{ marginTop: 16 }}>
          <h3>音阶：{input}</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {scale.notes.map((n, i) => (
              <span key={i} className="chip">{n}</span>
            ))}
          </div>
        </div>
      )}

      {!hasChord && !hasScale && <p className="faint">无法解析「{input}」，试试示例里的写法。</p>}

      <pre className="code">{`import * as Tonal from 'tonal'
Tonal.Chord.get('Cmaj7').notes   // ['C','E','G','B']
Tonal.Scale.get('C major').notes // ['C','D','E','F','G','A','B']`}</pre>
    </div>
  )
}
