import { useState } from 'react'
import { audio } from '../audio/AudioEngine'
import { getChordInfo } from '../lib/theory'

interface Props {
  chord: string
  octave?: number
}

/** 和弦组成音展示 + 点击播放琶音 */
export default function ChordDiagram({ chord, octave = 3 }: Props) {
  const [playing, setPlaying] = useState(false)
  const info = getChordInfo(chord)
  const notes = info.notes.length ? info.notes.map((n) => `${n}${octave}`) : []

  const play = async () => {
    setPlaying(true)
    await audio.playNotes(notes, '1n')
    setTimeout(() => setPlaying(false), 600)
  }

  return (
    <div>
      <div className="viz-label">和弦试听 · {chord}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <button className="btn" onClick={play} disabled={!notes.length || playing}>
          ▶ {playing ? '播放中…' : '播放琶音'}
        </button>
        <span className="chip">{info.type || '—'}</span>
      </div>
      {notes.length ? (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {notes.map((n, i) => (
            <button key={i} className="chip" onClick={() => audio.playNote(n, '4n')}>
              {n}
            </button>
          ))}
        </div>
      ) : (
        <p className="faint">无法解析「{chord}」，试试 C / Am / G7 / Cmaj7 等。</p>
      )}
    </div>
  )
}
