import { NavLink } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { NAV } from '../nav'
import { useProgress } from '../store/useProgress'
import AccentSwitcher from './AccentSwitcher'

export default function Layout() {
  const { state, setAccent } = useProgress()
  const total = 9 // 乐理知识点总数（用于进度估算）
  const done = state.completedLessons.filter((id) => id.startsWith('theory-')).length
  const pct = Math.round((done / total) * 100)

  const SidebarContent = (
    <>
      <div className="logo">
        <div className="logo-mark">♪</div>
        <div className="logo-text">JS Music</div>
      </div>
      <nav className="nav">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className="ico">{n.icon}</span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="progress-card">
          <div className="row">
            <span>乐理进度</span>
            <span className="num">{pct}%</span>
          </div>
          <div className="progress-bar">
            <i style={{ width: `${pct}%` }} />
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <span>连续打卡</span>
            <span className="num">🔥 {state.streakDays} 天</span>
          </div>
        </div>
        <AccentSwitcher current={state.accent} onChange={setAccent} />
      </div>
    </>
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">{SidebarContent}</aside>

      <main className="content">
        <div className="content-inner fade-up">
          <Outlet />
        </div>
      </main>

      <nav className="bottombar">
        <div className="bottombar-items">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => `bottombar-item ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: 18 }}>{n.icon}</span>
              <span>{n.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
