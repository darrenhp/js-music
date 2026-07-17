import { useEffect, useMemo, useState } from 'react'
import { audio } from '../../audio/AudioEngine'
import { fretboardNotes } from '../../lib/theory'
import Stage from './Stage'

const FRETS = 5
const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'] // 1弦→6弦（视觉从上到下）
const PC_POOL = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function FretMemoryGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [target, setTarget] = useState('')
  const [found, setFound] = useState<string[]>([])
  const [wrong, setWrong] = useState<string | null>(null)
  const [finished, setFinished] = useState(false)
  const TOTAL = 8

  const board = useMemo(() => fretboardNotes(FRETS), [])

  // 目标音在当前指板上的所有位置
  const targets = useMemo(() => {
    const set: { key: string; note: string }[] = []
    board.forEach((row, si) => {
      row.forEach((note, fret) => {
        const pc = note.replace(/\d/, '')
        if (pc === target) set.push({ key: `${si}-${fret}`, note })
      })
    })
    return set
  }, [board, target])

  // 每关换新目标音（避免与上一关重复）
  useEffect(() => {
    let next = pick(PC_POOL)
    if (next === target && PC_POOL.length > 1) next = pick(PC_POOL)
    setTarget(next)
    setFound([])
    setWrong(null)
    audio.click('G5')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round])

  const onCell = (si: number, fret: number, note: string) => {
    const key = `${si}-${fret}`
    if (found.includes(key)) return
    const pc = note.replace(/\d/, '')
    if (pc === target) {
      const nf = [...found, key]
      setFound(nf)
      audio.playNote(note, '8n')
      if (nf.length === targets.length) {
        setScore((s) => s + 10)
        audio.blip(true)
        setTimeout(() => {
          if (round >= TOTAL) setFinished(true)
          else {
            setRound((r) => r + 1)
          }
        }, 800)
      }
    } else {
      setWrong(key)
      audio.blip(false)
      setTimeout(() => setWrong(null), 350)
    }
  }

  return (
    <Stage
      gameId="fret-memory"
      score={score}
      finished={finished}
      round={round}
      total={TOTAL}
      onReplay={() => { setScore(0); setRound(1); setFinished(false); setFound([]); setWrong(null); setTarget('') }}
    >
      <p className="muted">
        找出指板上所有 <span className="num">{target || '—'}</span> 音的位置（前 {FRETS} 品）。
        已找到 <span className="num">{found.length}</span> / {targets.length}。
      </p>
      <div className="fretboard" style={{ overflowX: 'auto', marginTop: 12 }}>
        {board.map((row, si) => (
          <div className="fret-string" key={si}>
            <span className="string-label">{STRING_LABELS[si]}</span>
            {row.map((note, fret) => {
              const key = `${si}-${fret}`
              const isFound = found.includes(key)
              const isWrong = wrong === key
              const cls = `fret ${fret === 0 ? 'nut' : ''} ${isFound ? 'found' : ''} ${isWrong ? 'wrong' : ''}`
              return (
                <div
                  key={fret}
                  className={cls}
                  onClick={() => onCell(si, fret, note)}
                  title={note}
                >
                  {isFound ? target : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </Stage>
  )
}
