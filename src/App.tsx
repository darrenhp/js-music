import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './modules/home/Home'

// 较重路由按需懒加载，避免 tone/vexflow/tonal 等重型依赖拖慢首屏
const TheoryList = lazy(() => import('./modules/theory/TheoryList'))
const Lesson = lazy(() => import('./modules/theory/Lesson'))
const Guitar = lazy(() => import('./modules/guitar/Guitar'))
const GameCenter = lazy(() => import('./modules/games/GameCenter'))
const Games = lazy(() => import('./modules/games/Games'))
const Showcase = lazy(() => import('./modules/showcase/Showcase'))
const About = lazy(() => import('./modules/about/About'))

function Loading() {
  return <div className="muted" style={{ padding: 40 }}>加载中…</div>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="theory" element={<Suspense fallback={<Loading />}><TheoryList /></Suspense>} />
        <Route path="theory/:id" element={<Suspense fallback={<Loading />}><Lesson /></Suspense>} />
        <Route path="guitar" element={<Suspense fallback={<Loading />}><Guitar /></Suspense>} />
        <Route path="games" element={<Suspense fallback={<Loading />}><GameCenter /></Suspense>} />
        <Route path="games/:id" element={<Suspense fallback={<Loading />}><Games /></Suspense>} />
        <Route path="showcase" element={<Suspense fallback={<Loading />}><Showcase /></Suspense>} />
        <Route path="about" element={<Suspense fallback={<Loading />}><About /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
