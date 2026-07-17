import { useState } from 'react'
import { audio } from '../audio/AudioEngine'

type Osc = 'sine' | 'triangle' | 'square' | 'sawtooth'

interface WaveInfo {
  osc: Osc
  label: string
  harmonics: string
  feel: string
}

const WAVES: WaveInfo[] = [
  { osc: 'sine', label: '正弦波', harmonics: '仅基频，无泛音', feel: '最纯净单薄，像音叉/口哨' },
  { osc: 'triangle', label: '三角波', harmonics: '奇次泛音，衰减快', feel: '柔和圆润，接近长笛' },
  { osc: 'square', label: '方波', harmonics: '奇次泛音，能量强', feel: '明亮有穿透，像单簧管/复古游戏音' },
  { osc: 'sawtooth', label: '锯齿波', harmonics: '全部整数倍泛音', feel: '饱满刺耳，像铜管/弦乐合成' },
]

const W = 120
const H = 56
const MID = H / 2
const AMP = 20

/** 生成一个周期 ×2 的波形路径（不同振荡器形状） */
function wavePath(osc: Osc): string {
  const pts: string[] = []
  const steps = 96
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * W
    const phase = (i / steps) * 2 * Math.PI * 2 // 两个周期
    let y = 0
    switch (osc) {
      case 'sine':
        y = Math.sin(phase)
        break
      case 'triangle':
        y = (2 / Math.PI) * Math.asin(Math.sin(phase))
        break
      case 'square':
        y = Math.sin(phase) >= 0 ? 1 : -1
        break
      case 'sawtooth': {
        const t = (phase / (2 * Math.PI)) % 1
        y = 2 * t - 1
        break
      }
    }
    pts.push(`${x.toFixed(1)},${(MID - y * AMP).toFixed(1)}`)
  }
  return 'M' + pts.join(' L')
}

/** 音色对比：同一音高（C4）用四种波形播放，直观听到泛音结构差异 */
export default function TimbreDemo({ note = 'C4' }: { note?: string }) {
  const [active, setActive] = useState<Osc | null>(null)

  const play = async (osc: Osc) => {
    setActive(osc)
    await audio.playWith(note, osc, '2n')
    setTimeout(() => setActive(null), 700)
  }

  return (
    <div>
      <div className="viz-label">音色对比 · 同一音高 {note} · 四种波形</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {WAVES.map((w) => (
          <button
            key={w.osc}
            onClick={() => play(w.osc)}
            className="viz-box"
            style={{
              cursor: 'pointer',
              textAlign: 'left',
              border: active === w.osc ? '1px solid var(--accent)' : '1px solid var(--border)',
              background: active === w.osc ? 'var(--accent-soft)' : 'var(--card)',
              transition: 'all .15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <strong style={{ fontSize: 14 }}>{w.label}</strong>
              <span style={{ fontSize: 12, color: 'var(--accent)' }}>▶</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" style={{ display: 'block' }}>
              <line x1="0" y1={MID} x2={W} y2={MID} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
              <path d={wavePath(w.osc)} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" />
            </svg>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 6 }}>{w.harmonics}</div>
            <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>{w.feel}</div>
          </button>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 12, marginTop: 10 }}>
        四个按钮弹的都是同一个音高（基频相同），但泛音结构不同 —— 这正是「音色」的物理本质。
      </p>
    </div>
  )
}
