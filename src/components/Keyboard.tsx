import { useState } from 'react'
import { audio } from '../audio/AudioEngine'

const WHITE = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
// 每个白键之后是否有黑键（按白键索引）
const BLACK_AFTER: (string | null)[] = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]

interface Props {
  startOctave?: number
  octaves?: number
  highlight?: string[]
  showLabels?: boolean
}

/** 可点击发声的钢琴键盘（Tone.js） */
export default function Keyboard({ startOctave = 3, octaves = 2, highlight = [], showLabels = true }: Props) {
  const [active, setActive] = useState<string | null>(null)

  const play = async (note: string) => {
    setActive(note)
    await audio.playNote(note, '4n')
    setTimeout(() => setActive(null), 180)
  }

  const whites: { note: string; gi: number }[] = []
  const blacks: { note: string; afterGi: number }[] = []
  for (let o = 0; o < octaves; o++) {
    const oct = startOctave + o
    WHITE.forEach((w, i) => {
      whites.push({ note: `${w}${oct}`, gi: o * 7 + i })
      const b = BLACK_AFTER[i]
      if (b) blacks.push({ note: `${b}${oct}`, afterGi: o * 7 + i })
    })
  }
  const whiteCount = whites.length

  return (
    <div className="kb" role="group" aria-label="钢琴键盘">
      {whites.map((w) => {
        const isHl = highlight.includes(w.note)
        return (
          <div
            key={w.note}
            className={`kb-white ${active === w.note ? 'active' : ''}`}
            style={isHl ? { background: 'var(--accent-soft)' } : undefined}
            onClick={() => play(w.note)}
            title={w.note}
            aria-label={w.note}
          >
            {showLabels && <span className="kb-label">{w.note}</span>}
          </div>
        )
      })}
      {blacks.map((b) => {
        const leftPct = ((b.afterGi + 1) / whiteCount) * 100
        return (
          <div
            key={b.note}
            className={`kb-black ${active === b.note ? 'active' : ''}`}
            style={{ left: `${leftPct}%` }}
            onClick={() => play(b.note)}
            title={b.note}
            aria-label={b.note}
          >
            {showLabels && <span className="kb-label">{b.note}</span>}
          </div>
        )
      })}
    </div>
  )
}
