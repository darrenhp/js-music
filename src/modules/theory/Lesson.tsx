import { Link, useParams } from 'react-router-dom'
import { getLesson } from '../../data/theory'
import { useProgress } from '../../store/useProgress'
import Visualization from '../../components/Visualization'

export default function Lesson() {
  const { id = '' } = useParams()
  const lesson = getLesson(id)
  const { state, completeLesson } = useProgress()

  if (!lesson) {
    return (
      <>
        <p>未找到该知识点。</p>
        <Link to="/theory" className="btn ghost">← 返回乐理</Link>
      </>
    )
  }

  const done = state.completedLessons.includes(lesson.id)

  return (
    <>
      <Link to="/theory" className="btn ghost" style={{ marginBottom: 16 }}>← 乐理列表</Link>
      <h1>{lesson.title}</h1>
      <p className="muted">{lesson.summary}</p>

      <div className="knowledge" style={{ marginTop: 20 }}>
        {/* 概念讲解 */}
        <section className="section">
          <h2>概念讲解</h2>
          {lesson.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <h3>{s.heading}</h3>
              {s.body.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </div>
          ))}
        </section>

        {/* 可交互示例（点击发声） */}
        <section className="section">
          <h2>可交互示例</h2>
          <p className="faint" style={{ fontSize: 12, marginBottom: 14 }}>
            💡 每个示例都可点击发声；首次发声前请先点击页面任意位置以解锁音频（浏览器自动播放策略）。
          </p>
          <div className="examples">
            {lesson.examples.map((ex, i) => (
              <div className="viz-box example" key={i}>
                <div className="example-title">{ex.title}</div>
                {ex.desc && <div className="example-desc">{ex.desc}</div>}
                <Visualization spec={ex} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ marginTop: 24 }}>
        {done ? (
          <span className="chip">✓ 已完成该知识点</span>
        ) : (
          <button className="btn" onClick={() => completeLesson(lesson.id)}>
            标记为已学 ✓
          </button>
        )}
      </div>
    </>
  )
}
