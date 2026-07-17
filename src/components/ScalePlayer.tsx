import { useState } from 'react'
import { audio } from '../audio/AudioEngine'
import { scaleNotes } from '../lib/theory'
import Keyboard from './Keyboard'

interface Props {
  scale: string
  octave?: number
}

/** 音阶试听：高亮键盘 + 顺序播放上/下行 */
export default function ScalePlayer({ scale, octave = 3 }: Props) {
  const [playing, setPlaying] = useState(false)
  const root = scale.split(' ')[0]
  const asc = scaleNotes(scale, octave, 1)
  const notes = [...asc, `${root}${octave + 1}`]

  const play = async () => {
    setPlaying(true)
    await audio.playSequence(notes, 0.3)
    // 再下行一遍
    await audio.playSequence([...notes].reverse(), 0.26)
    setPlaying(false)
  }

  return (
    <div>
      <div className="viz-label">音阶试听 · {scale}</div>
      <button className="btn" onClick={play} disabled={playing} style={{ marginBottom: 12 }}>
        {playing ? '播放中…' : '▶ 播放音阶（上/下行）'}
      </button>
      <Keyboard highlight={notes} startOctave={octave} octaves={2} />
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {notes.map((n, i) => (
          <button key={i} className="chip" onClick={() => audio.playNote(n, '4n')}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
