import { Link } from 'react-router-dom'
import { useProgress } from '../../store/useProgress'
import { THEORY_LESSONS } from '../../data/theory'

const MAP = [
  {
    label: '乐理基础',
    desc: '音高 · 节奏 · 音阶 · 音程 · 和弦',
    to: '/theory',
    lessons: THEORY_LESSONS.map((l) => ({ id: l.id, t: l.title })),
  },
  { label: '和声进阶', desc: '和声进行 · 调性 · 五度圈 · 曲式', to: '/theory', lessons: [] },
  { label: '吉他实战', desc: '指板 · 和弦图 · 把位 · 扫弦', to: '/guitar', lessons: [] },
]

export default function Home() {
  const { state } = useProgress()
  const doneTheory = state.completedLessons.filter((id) => id.startsWith('theory-')).length
  const pct = Math.round((doneTheory / THEORY_LESSONS.length) * 100)

  return (
    <>
      <div className="hero">
        <svg className="hero-wave" width="220" height="120" viewBox="0 0 220 120" fill="none">
          <path d="M0 60 Q20 20 40 60 T80 60 T120 60 T160 60 T200 60" stroke="var(--accent)" strokeWidth="2" opacity="0.6" />
          <path d="M0 80 Q20 40 40 80 T80 80 T120 80 T160 80 T200 80" stroke="var(--accent)" strokeWidth="1.5" opacity="0.35" />
        </svg>
        <h1>用耳朵与代码学音乐</h1>
        <p className="sub">
          面向零基础到进阶自学者的现代化音乐理论站。系统乐理、吉他专项、互动小游戏，以及 Tone.js / Tonal.js / VexFlow 等音乐 JS 库的实时演示。
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 18, flexWrap: 'wrap' }}>
          <Link to="/theory" className="btn">开始学习 →</Link>
          <Link to="/games" className="btn ghost">挑战小游戏</Link>
        </div>
      </div>

      <div className="section">
        <div className="section-head">
          <h2>学习地图</h2>
          <span className="faint">已点亮 {doneTheory}/{THEORY_LESSONS.length} 个乐理知识点</span>
        </div>
        <div className="map-tree">
          {MAP.map((branch, i) => (
            <div className="map-branch" key={branch.label}>
              <Link to={branch.to} className="map-node" style={{ flex: 1, textDecoration: 'none' }}>
                <div className="mn-t">{branch.label}</div>
                <div className="mn-d">{branch.desc}</div>
              </Link>
              {i < MAP.length - 1 && <div className="map-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <div className="num" style={{ fontSize: 30 }}>{pct}%</div>
          <div className="muted">乐理学习进度</div>
        </div>
        <div className="card">
          <div className="num" style={{ fontSize: 30 }}>🔥 {state.streakDays}</div>
          <div className="muted">连续打卡天数</div>
        </div>
        <div className="card">
          <div className="num" style={{ fontSize: 30 }}>{Object.keys(state.gameHighScores).length}</div>
          <div className="muted">已挑战游戏数</div>
        </div>
      </div>
    </>
  )
}
