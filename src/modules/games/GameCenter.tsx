import { Link } from 'react-router-dom'
import { GAMES } from '../../data/games'
import { useProgress } from '../../store/useProgress'

export default function GameCenter() {
  const { state } = useProgress()
  return (
    <>
      <h1>互动小游戏</h1>
      <p className="muted">边玩边练耳。六个游戏均完整可玩，含计分、难度分级、错题回顾与历史最高分（localStorage 持久化）。</p>
      <div className="grid grid-3" style={{ marginTop: 18 }}>
        {GAMES.map((g) => {
          const hi = state.gameHighScores[g.id]
          return (
            <Link key={g.id} to={`/games/${g.id}`} className="game-card">
              <div className="gtitle">
                <span>{g.title}</span>
                {g.playable && <span className="chip" style={{ fontSize: 10 }}>可玩</span>}
              </div>
              <div className="gdesc">{g.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`diff ${g.diff}`}>{g.diff === 'easy' ? '易' : g.diff === 'mid' ? '中' : '难'}</span>
                <span className="hiscore">最高 {hi ?? '—'}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
