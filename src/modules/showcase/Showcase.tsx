import { lazy, Suspense, useState } from 'react'

const ToneDemo = lazy(() => import('./ToneDemo'))
const TonalDemo = lazy(() => import('./TonalDemo'))
const VexFlowDemo = lazy(() => import('./VexFlowDemo'))
const MidiDemo = lazy(() => import('./MidiDemo'))
const WaveDemo = lazy(() => import('./WaveDemo'))
const MusicTheoryArticle = lazy(() => import('./MusicTheoryArticle'))
const MusicTheoryNerds = lazy(() => import('./MusicTheoryNerds'))
const LightnoteLessons = lazy(() => import('./LightnoteLessons'))

const TABS = [
  { id: 'mtp', label: '乐理长文 · 译', Component: MusicTheoryArticle },
  { id: 'mtn', label: '给极客的乐理 · 译', Component: MusicTheoryNerds },
  { id: 'ln', label: 'Lightnote 交互课', Component: LightnoteLessons },
  { id: 'tone', label: 'Tone.js', Component: ToneDemo },
  { id: 'tonal', label: 'Tonal.js', Component: TonalDemo },
  { id: 'vexflow', label: 'VexFlow', Component: VexFlowDemo },
  { id: 'midi', label: '@tonejs/midi', Component: MidiDemo },
  { id: 'wavesurfer', label: 'wavesurfer.js', Component: WaveDemo },
]

export default function Showcase() {
  const [tab, setTab] = useState(TABS[0].id)
  const Active = TABS.find((t) => t.id === tab)!.Component

  return (
    <>
      <h1>音乐库技术展柜</h1>
      <p className="muted">五个音乐 JS 库的真实可交互演示 + 三篇编译的乐理内容（《程序员的乐理课》原文 runjs.app；《给极客的乐理课》原文 eev.ee；Lightnote 交互课原文 lightnote.co，均带交互试听）。每个子页签按需懒加载，不拖慢首屏。</p>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', margin: '18px 0', flexWrap: 'wrap' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 14px',
              fontSize: 14,
              fontWeight: 600,
              color: tab === t.id ? 'var(--accent)' : 'var(--text-dim)',
              borderBottom: tab === t.id ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Suspense fallback={<div className="muted">加载演示中…</div>}>
        <Active />
      </Suspense>
    </>
  )
}
