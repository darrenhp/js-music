import { useState } from 'react'
import { audio } from '../audio/AudioEngine'

const W = 240
const H = 70
const BASE = H - 10

interface EnvInfo {
  key: string
  label: string
  desc: string
  path: string
  play: (note: string) => Promise<void>
}

// ADSR 包络轮廓（示意）：起音→衰减→延音→释音
const SUSTAIN_PATH = `M6 ${BASE} L28 12 L52 30 L150 32 L${W - 6} ${BASE}` // 慢起、有延音
const PLUCK_PATH = `M6 ${BASE} L18 10 L${W - 6} ${BASE}` // 瞬间起音、快速衰减，无延音

const ENVS: EnvInfo[] = [
  {
    key: 'sustain',
    label: '持续音（长延音）',
    desc: '起音后能量维持，像管风琴/拉弦长音',
    path: SUSTAIN_PATH,
    play: (note) => audio.playNote(note, '2n'),
  },
  {
    key: 'pluck',
    label: '拨弦（快速衰减）',
    desc: '瞬间起音后迅速衰减，像吉他/钢琴的拨弹',
    path: PLUCK_PATH,
    play: (note) => audio.pluckNotes([note]),
  },
]

/** 包络演示：同音高、同波形，起振/衰减不同，听感也不同 */
export default function EnvelopeDemo({ note = 'C4' }: { note?: string }) {
  const [active, setActive] = useState<string | null>(null)

  const play = async (env: EnvInfo) => {
    setActive(env.key)
    await env.play(note)
    setTimeout(() => setActive(null), 800)
  }

  return (
    <div>
      <div className="viz-label">包络（ADSR）· 同一音高 {note} · 起振/衰减不同</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {ENVS.map((env) => (
          <button
            key={env.key}
            onClick={() => play(env)}
            className="viz-box"
            style={{
              cursor: 'pointer',
              textAlign: 'left',
              border: active === env.key ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: active === env.key ? 'var(--accent-soft)' : 'var(--card)',
              transition: 'all .15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <strong style={{ fontSize: 14 }}>{env.label}</strong>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>▶</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: 'block' }}>
              <line x1="0" y1={BASE} x2={W} y2={BASE} stroke="var(--border)" strokeWidth="1" />
              <path d={env.path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>{env.desc}</div>
          </button>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 12, marginTop: 10 }}>
        包络描述音量随时间的变化（起音 Attack→衰减 Decay→延音 Sustain→释音 Release）。即使基频与泛音相同，不同包络也会带来完全不同的听感。
      </p>
    </div>
  )
}
