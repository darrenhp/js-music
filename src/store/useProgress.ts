import { useCallback, useEffect, useState } from 'react'

export type AccentName = 'amber' | 'purple' | 'mint'

export interface ProgressState {
  completedLessons: string[]
  quizWrong: Record<string, string[]>
  streakDays: number
  lastVisit: string
  gameHighScores: Record<string, number>
  accent: AccentName
}

const KEY = 'music-theory-progress'
const ACCENTS: Record<AccentName, { accent: string; soft: string; dim: string }> = {
  amber: { accent: '#F5A623', soft: 'rgba(245,166,35,0.14)', dim: 'rgba(245,166,35,0.45)' },
  purple: { accent: '#8B5CF6', soft: 'rgba(139,92,246,0.16)', dim: 'rgba(139,92,246,0.45)' },
  mint: { accent: '#34D399', soft: 'rgba(52,211,153,0.16)', dim: 'rgba(52,211,153,0.45)' },
}

const todayStr = () => new Date().toISOString().slice(0, 10)

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...defaultState(), ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return defaultState()
}

function defaultState(): ProgressState {
  return { completedLessons: [], quizWrong: {}, streakDays: 0, lastVisit: '', gameHighScores: {}, accent: 'amber' }
}

/** 应用强调色到 :root */
export function applyAccent(name: AccentName) {
  const r = document.documentElement
  r.style.setProperty('--accent', ACCENTS[name].accent)
  r.style.setProperty('--accent-soft', ACCENTS[name].soft)
  r.style.setProperty('--accent-dim', ACCENTS[name].dim)
}

export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => load())

  // 初次挂载：处理打卡天数
  useEffect(() => {
    setState((prev) => {
      const today = todayStr()
      if (prev.lastVisit === today) return prev
      let streak = 1
      if (prev.lastVisit) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        streak = prev.lastVisit === yesterday ? prev.streakDays + 1 : 1
      }
      const next = { ...prev, lastVisit: today, streakDays: streak }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  useEffect(() => {
    applyAccent(state.accent)
  }, [state.accent])

  const persist = useCallback((next: ProgressState) => {
    setState(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }, [])

  const completeLesson = useCallback(
    (id: string) => {
      setState((prev) => {
        if (prev.completedLessons.includes(id)) return prev
        const next = { ...prev, completedLessons: [...prev.completedLessons, id] }
        localStorage.setItem(KEY, JSON.stringify(next))
        return next
      })
    },
    []
  )

  const recordQuizWrong = useCallback((lessonId: string, qid: string) => {
    setState((prev) => {
      const cur = prev.quizWrong[lessonId] || []
      const next = { ...prev, quizWrong: { ...prev.quizWrong, [lessonId]: [...new Set([...cur, qid])] } }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setHighScore = useCallback((gameId: string, score: number) => {
    setState((prev) => {
      const best = prev.gameHighScores[gameId] || 0
      if (score <= best) return prev
      const next = { ...prev, gameHighScores: { ...prev.gameHighScores, [gameId]: score } }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const setAccent = useCallback((name: AccentName) => {
    persist({ ...state, accent: name })
  }, [state, persist])

  const reset = useCallback(() => {
    persist(defaultState())
  }, [persist])

  return { state, completeLesson, recordQuizWrong, setHighScore, setAccent, reset }
}
