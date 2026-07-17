import { useEffect, useMemo, useState } from 'react'
import { audio } from '../../audio/AudioEngine'
import Stage from './Stage'

const ROOTS = ['C', 'D', 'E', 'F', 'G', 'A']
const TYPES: { label: string; offsets: number[] }[] = [
  { label: '大三和弦', offsets: [0, 4, 7] },
  { label: '小三和弦', offsets: [0, 3, 7] },
  { label: '属七和弦', offsets: [0, 4, 7, 10] },
  { label: '大七和弦', offsets: [0, 4, 7, 11] },
]

const PC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
function rootToNum(pc: string): number {
  const m: Record<string, number> = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 }
  return m[pc]
}
function chordNotes(root: string, offsets: number[], oct = 3): string[] {
  return offsets.map((s) => PC_NAMES[(rootToNum(root) + s) % 12] + (oct + Math.floor((rootToNum(root) + s) / 12)))
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function ChordGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState<number | null>(null)
  const [wrong, setWrong] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const TOTAL = 10

  const { notes, answerIdx, choices } = useMemo(() => {
    const root = pick(ROOTS)
    const typeIdx = Math.floor(Math.random() * TYPES.length)
    const notes = chordNotes(root, TYPES[typeIdx].offsets)
    const others = TYPES.map((_, i) => i).filter((i) => i !== typeIdx)
    const distract: number[] = []
    while (distract.length < 3 && others.length) {
      distract.push(others.splice(Math.floor(Math.random() * others.length), 1)[0])
    }
    const choices = [typeIdx, ...distract].sort(() => Math.random() - 0.5)
    return { notes, answerIdx: typeIdx, choices }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const play = () => audio.playNotes(notes, '1n')

  useEffect(() => {
    audio.playNotes(notes, '1n')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const choose = (ci: number) => {
    if (correct !== null) return
    if (ci === answerIdx) {
      setCorrect(ci)
      setScore((s) => s + 10)
      audio.blip(true)
    } else {
      setWrong(ci)
      setCorrect(answerIdx)
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
      gameId="chord-id"
      score={score}
      finished={finished}
      round={round}
      total={TOTAL}
      onReplay={() => { setScore(0); setRound(1); setFinished(false); setCorrect(null); setWrong(null) }}
    >
      <p className="muted">听和弦音色，判断它属于哪种类型。</p>
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
              {TYPES[ci].label}
            </button>
          )
        })}
      </div>
    </Stage>
  )
}
