import { useEffect, useMemo, useState } from 'react'
import { audio } from '../../audio/AudioEngine'
import type { GameId } from '../../data/games'
import Stage from './Stage'

const LOWS = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4']
const INTERVALS: { semi: number; label: string }[] = [
  { semi: 1, label: '小二度' },
  { semi: 2, label: '大二度' },
  { semi: 3, label: '小三度' },
  { semi: 4, label: '大三度' },
  { semi: 5, label: '纯四度' },
  { semi: 7, label: '纯五度' },
  { semi: 8, label: '小六度' },
  { semi: 9, label: '大六度' },
  { semi: 11, label: '大七度' },
  { semi: 12, label: '纯八度' },
]

function notePlusSemis(note: string, semi: number): string {
  const m = note.match(/^([A-G][#b]?)(\d)$/)!
  const pcNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const pcMap: Record<string, number> = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 }
  let total = pcMap[m[1]] + semi
  let oct = parseInt(m[2])
  while (total >= 12) { total -= 12; oct++ }
  while (total < 0) { total += 12; oct-- }
  return pcNames[total] + oct
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function IntervalGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState<number | null>(null)
  const [wrong, setWrong] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const TOTAL = 10

  const { low, high, answerIdx, choices } = useMemo(() => {
    const low = pick(LOWS)
    const iv = pick(INTERVALS)
    const high = notePlusSemis(low, iv.semi)
    const answerIdx = INTERVALS.indexOf(iv)
    // 3 个干扰项
    const others = INTERVALS.map((_, i) => i).filter((i) => i !== answerIdx)
    const distract = []
    while (distract.length < 3 && others.length) {
      const idx = others.splice(Math.floor(Math.random() * others.length), 1)[0]
      distract.push(idx)
    }
    const choices = [answerIdx, ...distract].sort(() => Math.random() - 0.5)
    return { low, high, answerIdx, choices }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const play = () => audio.playInterval(low, high)

  useEffect(() => {
    play()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const choose = (choiceIdx: number) => {
    if (correct !== null) return
    if (choiceIdx === answerIdx) {
      setCorrect(choiceIdx)
      setScore((s) => s + 10)
      audio.blip(true)
    } else {
      setWrong(choiceIdx)
      setCorrect(answerIdx)
      audio.blip(false)
    }
    setTimeout(() => {
      if (round >= TOTAL) {
        setFinished(true)
      } else {
        setCorrect(null)
        setWrong(null)
        setRound((r) => r + 1)
      }
    }, 900)
  }

  return (
    <Stage
      gameId="interval-id"
      score={score}
      finished={finished}
      round={round}
      total={TOTAL}
      onReplay={() => { setScore(0); setRound(1); setFinished(false); setCorrect(null); setWrong(null) }}
    >
      <p className="muted">听下面两个音，判断它们的音程。</p>
      <button className="btn" onClick={play} style={{ fontSize: 18, padding: '14px 28px' }}>▶ 再听一次</button>
      <div className="choice-grid">
        {choices.map((ci) => {
          let cls = 'choice'
          if (correct !== null) {
            if (ci === answerIdx) cls += ' correct'
            else if (ci === wrong) cls += ' wrong'
          }
          return (
            <button key={ci} className={cls} onClick={() => choose(ci)} disabled={correct !== null}>
              {INTERVALS[ci].label}
            </button>
          )
        })}
      </div>
    </Stage>
  )
}
