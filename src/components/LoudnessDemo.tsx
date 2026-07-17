import { useState } from 'react'
import { audio } from '../audio/AudioEngine'

interface Level {
  key: string
  label: string
  db: number
  amp: number // 相对振幅（用于波形高度示意，0~1）
}

const LEVELS: Level[] = [
  { key: 'soft', label: '弱（pp）', db: -26, amp: 0.25 },
  { key: 'mid', label: '中（mf）', db: -14, amp: 0.55 },
  { key: 'loud', label: '强（ff）', db: -4, amp: 1 },
]

const W = 260
const H = 70
const MID = H / 2

/** 生成振幅为 amp 的正弦波路径（同频率、不同高度 = 响度差异） */
function ampWave(amp: number): string {
  const pts: string[] = []
  const steps = 120
  const maxAmp = 28
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W
    const phase = (i / steps) * 2 * Math.PI * 4
    const y = MID - Math.sin(phase) * maxAmp * amp
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return 'M' + pts.join(' L')
}

/** 响度演示：同一音高不同音量（振幅），频率不变、波高变化 */
export default function LoudnessDemo({ note = 'A4' }: { note?: string }) {
  const [active, setActive] = useState<string | null>(null)

  const play = async (lv: Level) => {
    setActive(lv.key)
    await audio.playVolume(note, lv.db, '2n')
    setTimeout(() => setActive(null), 700)
  }

  return (
    <div>
      <div className="viz-label">响度对比 · 同一音高 {note} · 振幅不同</div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: 'block', marginBottom: 12 }}>
        <line x1="0" y1={MID} x2={W} y2={MID} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
        {LEVELS.map((lv) => (
          <path
            key={lv.key}
            d={ampWave(lv.amp)}
            fill="none"
            stroke={active === lv.key ? 'var(--accent)' : 'var(--text-faint)'}
            strokeWidth={active === lv.key ? 2.4 : 1.2}
            opacity={active && active !== lv.key ? 0.3 : 1}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {LEVELS.map((lv) => (
          <button
            key={lv.key}
            className="btn ghost"
            onClick={() => play(lv)}
            style={{
              flex: 1,
              minWidth: 90,
              borderColor: active === lv.key ? 'var(--accent)' : undefined,
              color: active === lv.key ? 'var(--accent)' : undefined,
            }}
          >
            ▶ {lv.label}
          </button>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 12, marginTop: 10 }}>
        三个按钮音高完全相同（波形疏密不变），只是振幅（波峰高度）不同 —— 振幅越大越响。分贝(dB)是对数刻度，更贴近人耳感受。
      </p>
    </div>
  )
}
