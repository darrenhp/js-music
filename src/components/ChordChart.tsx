import { GUITAR_CHORDS, chordToNotes } from '../data/guitar'
import { audio } from '../audio/AudioEngine'

function ChordSvg({ frets, name }: { frets: number[]; name: string }) {
  const W = 64, H = 84, pad = 10
  const sx = (i: number) => pad + (i * (W - 2 * pad)) / 5
  const sy = (f: number) => pad + (f * (H - 2 * pad)) / 4
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* 横线（品丝） */}
      {[0, 1, 2, 3, 4].map((f) => (
        <line key={f} x1={pad} y1={sy(f)} x2={W - pad} y2={sy(f)} stroke="#3a4150" strokeWidth={1} />
      ))}
      {/* 竖线（弦） */}
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <line key={s} x1={sx(s)} y1={pad} x2={sx(s)} y2={H - pad} stroke="#3a4150" strokeWidth={1} />
      ))}
      {/* 点 */}
      {frets.map((fr, sIdx) => {
        const x = sx(sIdx)
        if (fr < 0) {
          return <text key={sIdx} x={x} y={pad - 2} fill="#5C6675" fontSize={9} textAnchor="middle">×</text>
        }
        const y = fr === 0 ? sy(0) : sy(fr - 0.5)
        if (fr === 0) {
          return <circle key={sIdx} cx={x} cy={sy(0)} r={3} fill="none" stroke="var(--accent)" strokeWidth={1.5} />
        }
        return <circle key={sIdx} cx={x} cy={y} r={4} fill="var(--accent)" />
      })}
    </svg>
  )
}

export default function ChordChart() {
  return (
    <div>
      <div className="viz-label">常用和弦图（点击播放）</div>
      <div className="chordgrid">
        {GUITAR_CHORDS.map((c) => (
          <div
            key={c.name}
            className="chord-cell"
            onClick={() => audio.pluckNotes(chordToNotes(c))}
            title={`播放 ${c.name}`}
          >
            <div className="name">{c.name}</div>
            <ChordSvg frets={c.frets} name={c.name} />
          </div>
        ))}
      </div>
    </div>
  )
}
