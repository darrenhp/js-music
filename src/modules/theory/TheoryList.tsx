import { Link } from 'react-router-dom'
import { THEORY_LESSONS } from '../../data/theory'
import { useProgress } from '../../store/useProgress'

export default function TheoryList() {
  const { state } = useProgress()
  return (
    <>
      <h1>乐理基础</h1>
      <p className="muted">系统化的乐理知识，每个知识点都配有多个可点击发声的互动示例。点击进入开始学习。</p>
      <div className="lesson-list" style={{ marginTop: 18 }}>
        {THEORY_LESSONS.map((l) => {
          const done = state.completedLessons.includes(l.id)
          return (
            <Link key={l.id} to={`/theory/${l.id}`} className={`lesson-item ${done ? 'done' : ''}`}>
              <div className="t">{l.title} {done && <span className="accent">✓</span>}</div>
              <div className="d">{l.summary}</div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
