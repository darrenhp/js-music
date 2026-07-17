import { useEffect, useMemo, useState } from 'react'
import { audio } from '../../audio/AudioEngine'
import Stage from './Stage'

// C 大调下 4 条常见进行（和弦以科学音高给出，便于同时发声）
const PROGS: { label: string; chords: string[][] }[] = [
  { label: 'I – V – vi – IV', chords: [['C4', 'E4', 'G4'], ['G3', 'B3', 'D4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4']] },
  { label: 'vi – IV – I – V', chords: [['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['C4', 'E4', 'G4'], ['G3', 'B3', 'D4']] },
  { label: 'I – vi – IV – V', chords: [['C4', 'E4', 'G4'], ['A3', 'C4', 'E4'], ['F3', 'A3', 'C4'], ['G3', 'B3', 'D4']] },
  { label: 'ii – V – I – vi', chords: [['D4', 'F4', 'A4'], ['G3', 'B3', 'D4'], ['C4', 'E4', 'G4'], ['A3', 'C4', 'E4']] },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function ProgressionGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState<number | null>(null)
  const [wrong, setWrong] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const TOTAL = 8

  const { idx, choices } = useMemo(() => {
    const idx = Math.floor(Math.random() * PROGS.length)
    const others = PROGS.map((_, i) => i).filter((i) => i !== idx)
    const distract: number[] = []
    while (distract.length < 3 && others.length) {
      distract.push(others.splice(Math.floor(Math.random() * others.length), 1)[0])
    }
    const choices = [idx, ...distract].sort(() => Math.random() - 0.5)
    return { idx, choices }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const play = () => audio.playChords(PROGS[idx].chords)

  useEffect(() => {
    audio.playChords(PROGS[idx].chords)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const choose = (ci: number) => {
    if (correct !== null) return
    if (ci === idx) {
      setCorrect(ci)
      setScore((s) => s + 10)
      audio.blip(true)
    } else {
      setWrong(ci)
      setCorrect(idx)
      audio.blip(false)
    }
    setTimeout(() => {
      if (round >= TOTAL) setFinished(true)
      else {
        setCorrect(null)
        setWrong(null)
        setRound((r) => r + 1)
      }
    }, 900)
  }

  return (
    <Stage
      gameId="progression-id"
      score={score}
      finished={finished}
      round={round}
      total={TOTAL}
      onReplay={() => { setScore(0); setRound(1); setFinished(false); setCorrect(null); setWrong(null) }}
    >
      <p className="muted">听一段和弦进行，判断它的级数走向（以 C 大调为例）。</p>
      <button className="btn" onClick={play} style={{ fontSize: 18, padding: '14px 28px' }}>▶ 再听一次</button>
      <div className="choice-grid">
        {choices.map((ci) => {
          let cls = 'choice'
          if (correct !== null) {
            if (ci === idx) cls += ' correct'
            else if (ci === wrong) cls += ' wrong'
          }
          return (
            <button key={ci} className={cls} onClick={() => choose(ci)} disabled={correct !== null}>
              {PROGS[ci].label}
            </button>
          )
        })}
      </div>
    </Stage>
  )
}
