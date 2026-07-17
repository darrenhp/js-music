import { useEffect, useRef, useState } from 'react'
import { audio } from '../audio/AudioEngine'

interface Props {
  beats: number
  pattern: ('down' | 'up')[]
  bpm?: number
}

/** 节拍器式节奏演示：按拍号播放重音模式，并点亮对应拍点 */
export default function RhythmDemo({ beats, pattern, bpm = 96 }: Props) {
  const [cur, setCur] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const timers = useRef<number[]>([])

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  useEffect(() => () => clear(), [])

  const play = () => {
    if (playing) {
      clear()
      setCur(null)
      setPlaying(false)
      return
    }
    setPlaying(true)
    const interval = 60 / bpm
    for (let i = 0; i < beats; i++) {
      const kind = pattern[i] || 'up'
      const t = i * interval * 1000
      timers.current.push(
        window.setTimeout(() => {
          audio.click(kind === 'down' ? 'C6' : 'G5')
        }, t),
      )
      timers.current.push(window.setTimeout(() => setCur(i), t))
    }
    timers.current.push(
      window.setTimeout(() => {
        setCur(null)
        setPlaying(false)
      }, beats * interval * 1000),
    )
  }

  return (
    <div>
      <div className="viz-label">节拍演示 · {bpm} BPM</div>
      <button className="btn" onClick={play} style={{ marginBottom: 12 }}>
        {playing ? '■ 停止' : '▶ 播放节拍'}
      </button>
      <div className="beats">
        {Array.from({ length: beats }).map((_, i) => (
          <div key={i} className={`beat ${pattern[i] === 'down' ? 'down' : ''} ${cur === i ? 'on' : ''}`}>
            {i + 1}
          </div>
        ))}
      </div>
      <div className="faint" style={{ fontSize: 12 }}>
        重音模式：{pattern.slice(0, beats).map((p) => (p === 'down' ? '●' : '○')).join(' ')}
      </div>
    </div>
  )
}
