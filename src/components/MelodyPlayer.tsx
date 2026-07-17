import { useState } from 'react'
import { audio } from '../audio/AudioEngine'
import StaffCanvas from './StaffCanvas'

interface Props {
  notes: string[]
  title?: string
}

/** 旋律/动机试听：五线谱显示 + 顺序播放，每个音符也可单独点击 */
export default function MelodyPlayer({ notes, title }: Props) {
  const [playing, setPlaying] = useState(false)

  const play = async () => {
    setPlaying(true)
    await audio.playSequence(notes, 0.36)
    setPlaying(false)
  }

  return (
    <div>
      {title && <div className="viz-label">{title}</div>}
      <button className="btn" onClick={play} disabled={playing} style={{ marginBottom: 12 }}>
        {playing ? '播放中…' : '▶ 播放旋律'}
      </button>
      <StaffCanvas notes={notes} />
    </div>
  )
}
