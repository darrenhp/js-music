import { useEffect, useMemo, useState } from 'react'
import { audio } from '../../audio/AudioEngine'
import Stage from './Stage'

// 高音谱表上的音（C4 一线下加线 → A5 上加线）
const POOL = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5']
// 以 E4（下加线为第一线？实为五线谱最底一线）为基准的“半音级”步数
const STEP: Record<string, number> = {
  C4: -2, D4: -1, E4: 0, F4: 1, G4: 2, A4: 3, B4: 4,
  C5: 5, D5: 6, E5: 7, F5: 8, G5: 9, A5: 10,
}
const SPACING = 16
const HALF = SPACING / 2
const BASE_Y = 120 // 最底一线 (E4) 的 y
const NOTE_X = 120
const W = 210
const H = 180

function MiniStaff({ note }: { note: string }) {
  const step = STEP[note]
  const y = BASE_Y - step * HALF
  const lines = [0, 1, 2, 3, 4].map((i) => BASE_Y - i * SPACING)
  // 加线：C4（step -2）与 A5（step 10）落在加线上
  const ledger: number[] = step === -2 || step === 10 ? [y] : []
  return (
    <svg
      width={W}
      height={H}
      style={{ background: 'var(--surface-2, #11141b)', borderRadius: 12, border: '1px solid var(--border)' }}
    >
      <text x={12} y={BASE_Y + 6} fontSize={40} fill="var(--text-faint)" fontFamily="serif">𝄞</text>
      {lines.map((ly, i) => (
        <line key={i} x1={44} x2={W - 18} y1={ly} y2={ly} stroke="var(--border)" strokeWidth={1} />
      ))}
      {ledger.map((ly, i) => (
        <line key={'l' + i} x1={NOTE_X - 22} x2={NOTE_X + 22} y1={ly} y2={ly} stroke="var(--text-faint)" strokeWidth={1.5} />
      ))}
      <ellipse cx={NOTE_X} cy={y} rx={8} ry={6} fill="var(--accent)" />
    </svg>
  )
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function SightReadingGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [correct, setCorrect] = useState<number | null>(null)
  const [wrong, setWrong] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const TOTAL = 10

  const { note, answerIdx, choices } = useMemo(() => {
    const note = pick(POOL)
    const answerIdx = POOL.indexOf(note)
    const others = POOL.map((_, i) => i).filter((i) => i !== answerIdx)
    const distract: number[] = []
    while (distract.length < 3 && others.length) {
      distract.push(others.splice(Math.floor(Math.random() * others.length), 1)[0])
    }
    const choices = [answerIdx, ...distract].sort(() => Math.random() - 0.5)
    return { note, answerIdx, choices }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const choose = (ci: number) => {
    if (correct !== null) return
    if (ci === answerIdx) {
      setCorrect(ci)
      setScore((s) => s + 10)
      audio.playNote(note, '4n')
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
      gameId="sightread"
      score={score}
      finished={finished}
      round={round}
      total={TOTAL}
      onReplay={() => { setScore(0); setRound(1); setFinished(false); setCorrect(null); setWrong(null) }}
    >
      <p className="muted">看五线谱上的音符，选出它的音名（不靠听，纯读谱）。</p>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 18px' }}>
        <MiniStaff note={note} />
      </div>
      <div className="choice-grid">
        {choices.map((ci) => {
          let cls = 'choice'
          if (correct !== null) {
            if (ci === answerIdx) cls += ' correct'
            else if (ci === wrong) cls += ' wrong'
          }
          return (
            <button key={ci} className={cls} onClick={() => choose(ci)} disabled={correct !== null}>
              {POOL[ci]}
            </button>
          )
        })}
      </div>
    </Stage>
  )
}
