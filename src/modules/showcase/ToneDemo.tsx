import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

const STEPS = 8
const MELODY = ['C4', 'D4', 'E4', 'G4', 'A4', 'G4', 'E4', 'D4']
const WAVES = ['sine', 'triangle', 'square', 'sawtooth'] as const

export default function ToneDemo() {
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const seqRef = useRef<Tone.Sequence | null>(null)
  const [wave, setWave] = useState<(typeof WAVES)[number]>('triangle')
  const [pattern, setPattern] = useState<boolean[]>(Array(STEPS).fill(false))
  const [cur, setCur] = useState(-1)

  useEffect(() => {
    return () => {
      Tone.Transport.stop()
      seqRef.current?.dispose()
      synthRef.current?.dispose()
    }
  }, [])

  function ensure() {
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth, { oscillator: { type: wave } }).toDestination()
      synthRef.current.volume.value = -12
    }
  }

  async function playNote(n: string) {
    await Tone.start()
    ensure()
    synthRef.current!.triggerAttackRelease(n, '8n')
  }

  async function playSeq() {
    await Tone.start()
    ensure()
    Tone.Transport.stop()
    seqRef.current?.dispose()
    const seq = new Tone.Sequence(
      (time, step: number) => {
        if (pattern[step]) synthRef.current!.triggerAttackRelease(MELODY[step], '8n', time)
        Tone.Draw.schedule(() => setCur(step), time)
      },
      [...Array(STEPS).keys()],
      '8n'
    )
    seqRef.current = seq
    Tone.Transport.bpm.value = 120
    seq.start(0)
    Tone.Transport.start()
  }

  function stop() {
    Tone.Transport.stop()
    seqRef.current?.dispose()
    seqRef.current = null
    setCur(-1)
  }

  return (
    <div className="demo">
      <div className="viz-label">Tone.js · 合成器试听 + 音序器</div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <label className="faint" style={{ fontSize: 13 }}>波形</label>
        <select
          className="input"
          style={{ width: 'auto' }}
          value={wave}
          onChange={(e) => {
            setWave(e.target.value as any)
            synthRef.current?.dispose()
            synthRef.current = null
          }}
        >
          {WAVES.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'].map((n) => (
          <button key={n} className="chip" onClick={() => playNote(n)}>{n}</button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <button className="btn" onClick={playSeq}>▶ 播放序列</button>
        <button className="btn ghost" onClick={stop}>■ 停止</button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {MELODY.map((n, i) => (
          <button
            key={i}
            onClick={() => setPattern((p) => p.map((v, j) => (j === i ? !v : v)))}
            className="choice"
            style={{
              flex: 1,
              padding: '14px 0',
              borderColor: cur === i ? 'var(--accent)' : pattern[i] ? 'var(--accent-dim)' : 'var(--border)',
              background: pattern[i] ? 'var(--accent-soft)' : 'var(--card)',
            }}
            title={n}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="faint" style={{ fontSize: 12, marginTop: 10 }}>
        点击琴键试听；点亮步骤后「播放序列」即循环音序器（基于 Tone.Transport）。
      </p>
      <pre className="code">{`import * as Tone from 'tone'
const synth = new Tone.PolySynth().toDestination()
await Tone.start()
synth.triggerAttackRelease('C4', '8n')`}</pre>
    </div>
  )
}
