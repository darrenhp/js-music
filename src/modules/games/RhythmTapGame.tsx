import { useEffect, useRef, useState } from 'react'
import { audio } from '../../audio/AudioEngine'
import Stage from './Stage'

const BPM = 96
const BEAT = 60000 / BPM // 每拍毫秒
const COUNT = 4 // 每关目标拍数
const TOL = 230 // 判定容差(ms)
const TOTAL = 6

function scoreRound(taps: number[], expected: number[]): number {
  const used = new Array(taps.length).fill(false)
  let hits = 0
  for (const e of expected) {
    let best = -1
    let bestd = 1e9
    for (let i = 0; i < taps.length; i++) {
      if (used[i]) continue
      const d = Math.abs(taps[i] - e)
      if (d < bestd) {
        bestd = d
        best = i
      }
    }
    if (best >= 0 && bestd <= TOL) {
      used[best] = true
      hits++
    }
  }
  return hits
}

export default function RhythmTapGame() {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState<'idle' | 'playing' | 'result'>('idle')
  const [pulse, setPulse] = useState(-1) // 当前闪动的拍
  const [tapCount, setTapCount] = useState(0)
  const [lastHits, setLastHits] = useState(0)
  const [finished, setFinished] = useState(false)

  const expectedRef = useRef<number[]>([])
  const tapRef = useRef<number[]>([])
  const timers = useRef<number[]>([])

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const startRound = () => {
    clearTimers()
    tapRef.current = []
    setTapCount(0)
    setPhase('playing')
    const t0 = performance.now() + 650 // 留出音频解锁时间
    const lead = BEAT // 1 拍预备拍
    const expected: number[] = []
    for (let i = 0; i < COUNT; i++) {
      const at = t0 + lead + i * BEAT
      expected.push(at)
      const delay = at - performance.now()
      const tid = window.setTimeout(() => {
        audio.click('C6')
        setPulse(i)
        window.setTimeout(() => setPulse(-1), BEAT * 0.45)
      }, delay)
      timers.current.push(tid)
    }
    expectedRef.current = expected
    const endDelay = t0 + lead + (COUNT - 1) * BEAT + BEAT * 0.85 - performance.now()
    const endTid = window.setTimeout(() => {
      const hits = scoreRound(tapRef.current, expected)
      setLastHits(hits)
      setScore((s) => s + hits * 2)
      setPhase('result')
    }, endDelay)
    timers.current.push(endTid)
  }

  const onTap = () => {
    if (phase !== 'playing') return
    audio.click('E5')
    tapRef.current.push(performance.now())
    setTapCount(tapRef.current.length)
  }

  // 空格键也可跟打
  useEffect(() => {
    if (phase !== 'playing') return
    const h = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        onTap()
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const next = () => {
    if (round >= TOTAL) {
      setFinished(true)
    } else {
      setRound((r) => r + 1)
      startRound()
    }
  }

  return (
    <Stage
      gameId="rhythm-tap"
      score={score}
      finished={finished}
      round={round}
      total={TOTAL}
      onReplay={() => { setScore(0); setRound(1); setFinished(false); setPhase('idle'); setLastHits(0) }}
    >
      {phase === 'idle' && (
        <>
          <p className="muted">跟着节拍器提示，在亮起的拍点上点击或按空格键。每拍命中得 2 分。</p>
          <button className="btn" onClick={startRound} style={{ fontSize: 18, padding: '14px 28px' }}>
            ▶ 开始跟打
          </button>
        </>
      )}
      {phase === 'playing' && (
        <>
          <p className="muted">听到“咔”声就点！已点 {tapCount} 下。</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', margin: '22px 0' }}>
            {Array.from({ length: COUNT }).map((_, i) => (
              <div
                key={i}
                className="rhythm-pad"
                style={pulse === i ? { background: 'var(--accent)', transform: 'scale(1.12)' } : undefined}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <button className="btn" onClick={onTap} style={{ fontSize: 18, padding: '16px 40px' }}>
            点击 / 空格 跟打
          </button>
        </>
      )}
      {phase === 'result' && (
        <>
          <div className="score">{lastHits} / {COUNT}</div>
          <p className="muted">本关命中 {lastHits} 拍（{lastHits * 2} 分）。</p>
          <button className="btn" onClick={next}>{round >= TOTAL ? '查看成绩' : '下一关'}</button>
        </>
      )}
    </Stage>
  )
}
