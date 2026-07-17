import { useState } from 'react'
import { audio } from '../audio/AudioEngine'
import { chordNotesAt } from '../lib/theory'

interface Props {
  chords: string[]
  keyName?: string
}

/** 和弦进行试听：顺序播放整段进行，也可单独点击某个和弦 */
export default function ProgressionPlayer({ chords, keyName }: Props) {
  const [playing, setPlaying] = useState(false)
  const resolved = chords.map((c) => chordNotesAt(c, 3))

  const play = async () => {
    setPlaying(true)
    await audio.playChords(resolved, '2n', 0.6)
    setPlaying(false)
  }

  return (
    <div>
      <div className="viz-label">和弦进行试听{keyName ? ` · ${keyName}` : ''}</div>
      <button className="btn" onClick={play} disabled={playing || !resolved.length} style={{ marginBottom: 12 }}>
        {playing ? '播放中…' : '▶ 播放进行'}
      </button>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {chords.map((c, i) => (
          <button key={i} className="chip" onClick={() => audio.playNotes(resolved[i], '2n')} title={`点击单独试听 ${c}`}>
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
