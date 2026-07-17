import { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'

function makeWav(seconds = 2, sr = 44100): string {
  const len = Math.floor(seconds * sr)
  const buf = new ArrayBuffer(44 + len * 2)
  const view = new DataView(buf)
  const writeStr = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i))
  }
  writeStr(0, 'RIFF')
  view.setUint32(4, 36 + len * 2, true)
  writeStr(8, 'WAVE')
  writeStr(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sr, true)
  view.setUint32(28, sr * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeStr(36, 'data')
  view.setUint32(40, len * 2, true)
  for (let i = 0; i < len; i++) {
    const t = i / sr
    const f = 220 + (t / seconds) * 660 // 220Hz → 880Hz 扫频
    const s = Math.sin(2 * Math.PI * f * t) * 0.4
    view.setInt16(44 + i * 2, s * 32767, true)
  }
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return 'data:audio/wav;base64,' + btoa(bin)
}

export default function WaveDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WaveSurfer | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 84,
      waveColor: '#9AA3B2',
      progressColor: '#F5A623',
      url: makeWav(2.2),
      barWidth: 2,
      barGap: 1,
    })
    wsRef.current = ws
    return () => {
      ws.destroy()
      wsRef.current = null
    }
  }, [])

  return (
    <div className="demo">
      <div className="viz-label">wavesurfer.js · 波形展示 + 播放控制</div>
      <div ref={containerRef} style={{ marginTop: 8 }} />
      <p className="faint" style={{ fontSize: 12, marginTop: 10 }}>
        波形为程序生成的 220→880Hz 扫频 WAV（data URL，无需联网）。点击波形任意位置即可播放 / 拖动进度。
      </p>
      <pre className="code">{`import WaveSurfer from 'wavesurfer.js'
WaveSurfer.create({ container, waveColor:'#9AA3B2', progressColor:'#F5A623', url })`}</pre>
    </div>
  )
}
