import { useMemo, useState } from 'react'
import { audio } from '../audio/AudioEngine'
import { intervalBetween } from '../lib/theory'

const NOTE_OPTS = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']

interface Props {
  initial?: [string, string]
}

export default function IntervalPlayer({ initial = ['C4', 'G4'] }: Props) {
  const [low, setLow] = useState(initial[0])
  const [high, setHigh] = useState(initial[1])

  const info = useMemo(() => intervalBetween(low, high), [low, high])

  const play = () => audio.playInterval(low, high)

  return (
    <div>
      <div className="viz-label">音程试听器</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <select className="input" style={{ width: 'auto' }} value={low} onChange={(e) => setLow(e.target.value)}>
          {NOTE_OPTS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="faint mono">→</span>
        <select className="input" style={{ width: 'auto' }} value={high} onChange={(e) => setHigh(e.target.value)}>
          {NOTE_OPTS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button className="btn" onClick={play}>▶ 播放音程</button>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <span className="chip">度数：{info.name}</span>
        <span className="chip">半音数：{info.semitones}</span>
        <span className="chip">性质：{info.quality}</span>
      </div>
    </div>
  )
}
