import { useState } from 'react'
import type { QuizQuestion } from '../data/theory'
import { audio } from '../audio/AudioEngine'

interface Props {
  lessonId: string
  questions: QuizQuestion[]
  onWrong?: (lessonId: string, qid: string) => void
}

export default function Quiz({ lessonId, questions, onWrong }: Props) {
  const [picked, setPicked] = useState<Record<string, number>>({})

  const choose = (q: QuizQuestion, idx: number) => {
    if (picked[q.id] !== undefined) return
    setPicked((p) => ({ ...p, [q.id]: idx }))
    const ok = idx === q.answer
    audio.blip(ok)
    if (!ok && onWrong) onWrong(lessonId, q.id)
  }

  return (
    <div className="quiz">
      {questions.map((q) => {
        const chosen = picked[q.id]
        return (
          <div className="quiz-q" key={q.id}>
            <div className="q">{q.q}</div>
            {q.options.map((opt, i) => {
              let cls = 'quiz-opt'
              if (chosen !== undefined) {
                if (i === q.answer) cls += ' correct'
                else if (i === chosen) cls += ' wrong'
              }
              return (
                <button key={i} className={cls} onClick={() => choose(q, i)} disabled={chosen !== undefined}>
                  {opt}
                </button>
              )
            })}
            {chosen !== undefined && (
              <div className={`quiz-feedback ${chosen === q.answer ? 'ok' : 'bad'}`}>
                {chosen === q.answer ? '✓ 答对了' : '✗ 答错了'} {q.explain && `· ${q.explain}`}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
