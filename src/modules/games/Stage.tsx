import { useEffect, type ReactNode } from 'react'
import { useProgress } from '../../store/useProgress'
import type { GameId } from '../../data/games'

/** 通用游戏舞台：计分、关卡进度、历史最高分与重玩 */
export default function Stage({
  gameId, score, finished, round, total, onReplay, children,
}: {
  gameId: GameId
  score: number
  finished: boolean
  round: number
  total: number
  onReplay: () => void
  children: ReactNode
}) {
  const { state, setHighScore } = useProgress()
  useEffect(() => {
    if (finished) setHighScore(gameId, score)
  }, [finished, gameId, score, setHighScore])

  const best = state.gameHighScores[gameId] ?? 0
  const shownBest = Math.max(best, score)

  return (
    <div className="stage">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="faint">第 {Math.min(round, total)} / {total} 关</span>
        <span className="score">{score}</span>
        <span className="faint">最高 {shownBest}</span>
      </div>
      {finished ? (
        <div>
          <div className="score">{score}</div>
          <p className="muted">本局结束！历史最高 {shownBest} 分。</p>
          <button className="btn" onClick={onReplay}>再玩一次</button>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
