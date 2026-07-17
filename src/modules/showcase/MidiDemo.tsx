import { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'

const SEED = [
  { name: 'C4', time: 0, duration: 0.5 },
  { name: 'E4', time: 0.5, duration: 0.5 },
  { name: 'G4', time: 1.0, duration: 0.5 },
  { name: 'C5', time: 1.5, duration: 0.5 },
  { name: 'B4', time: 2.0, duration: 0.5 },
  { name: 'G4', time: 2.5, duration: 1.0 },
]
const TOTAL = 3.5

export default function MidiDemo() {
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const [playing, setPlaying] = useState(false)
  const [cur, setCur] = useState(-1)

  // 用 @tonejs/midi 构建并解析 MIDI
  const midi = new Midi()
  const track = midi.addTrack()
  SEED.forEach((n) => track.addNote(n))
  const notes = midi.tracks[0].notes // 真实由库解析出的音符

  useEffect(() => {
    return () => {
      Tone.Transport.stop()
      synthRef.current?.dispose()
    }
  }, [])

  async function play() {
    await Tone.start()
    if (!synthRef.current) {
      synthRef.current = new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'triangle' } }).toDestination()
      synthRef.current.volume.value = -10
    }
    Tone.Transport.stop()
    Tone.Transport.cancel()
    let i = 0
    const synth = synthRef.current
    notes.forEach((n, idx) => {
      Tone.Transport.schedule((time) => {
        synth.triggerAttackRelease(n.name, n.duration, time)
        Tone.Draw.schedule(() => setCur(idx), time)
      }, n.time)
    })
    Tone.Transport.schedule(() => { setPlaying(false); setCur(-1); Tone.Transport.stop() }, TOTAL + 0.2)
    setPlaying(true)
    Tone.Transport.start()
    void i
  }

  return (
    <div className="demo">
      <div className="viz-label">@tonejs/midi · MIDI 解析 + 播放 + 可视化</div>
      <button className="btn" onClick={play} disabled={playing}>
        {playing ? '播放中…' : '▶ 播放 MIDI'}
      </button>

      <div style={{ marginTop: 16, position: 'relative', height: notes.length * 26 + 8, background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {notes.map((n, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${(n.time / TOTAL) * 100}%`,
              width: `${(n.duration / TOTAL) * 100}%`,
              top: idx * 26 + 4,
              height: 20,
              background: cur === idx ? 'var(--accent)' : 'var(--accent-dim)',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 6,
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              color: cur === idx ? '#0F1115' : 'var(--text)',
            }}
          >
            {n.name}
          </div>
        ))}
      </div>

      <p className="faint" style={{ fontSize: 12, marginTop: 8 }}>
        由库解析出 {notes.length} 个音符，时长合计 {TOTAL}s。点击播放即按时间戳调度（基于 Tone.Transport）。
      </p>
      <pre className="code">{`import { Midi } from '@tonejs/midi'
const midi = new Midi()
midi.addTrack().addNote({ name: 'C4', time: 0, duration: 0.5 })
midi.tracks[0].notes  // 解析后的音符`}</pre>
    </div>
  )
}
