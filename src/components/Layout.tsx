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
        <a
          className="github-link"
          href="https://github.com/darrenhp/js-music"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          <span>GitHub</span>
        </a>
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
