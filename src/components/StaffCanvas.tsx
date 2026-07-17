import { useEffect, useRef, useState } from 'react'
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow'
import { audio } from '../audio/AudioEngine'

function toVexKey(note: string): string {
  const m = note.match(/^([A-G][#b]?)(\d)$/)
  if (!m) return note
  return `${m[1]}/${m[2]}`
}

interface Props {
  notes: string[]
  title?: string
}

/** VexFlow 渲染五线谱，点击音符发声 */
export default function StaffCanvas({ notes, title }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [hover, setHover] = useState<number | null>(null)

  useEffect(() => {
    const div = ref.current
    if (!div) return
    div.innerHTML = ''
    const width = Math.max(360, notes.length * 64 + 80)
    const height = 150
    const renderer = new Renderer(div, Renderer.Backends.SVG)
    renderer.resize(width, height)
    const ctx = renderer.getContext()
    const stave = new Stave(10, 24, width - 16)
    stave.addClef('treble').addTimeSignature('4/4')
    stave.draw()

    const staveNotes = notes.map((n) => new StaveNote({ keys: [toVexKey(n)], duration: 'q' }))
    const voice = new Voice({ num_beats: notes.length, beat_value: 4 })
    voice.addTickables(staveNotes)
    new Formatter().joinVoices([voice]).format([voice], width - 60)
    voice.draw(ctx, stave)

    staveNotes.forEach((sn, i) => {
      const el = (sn as any).getSVGElement?.()
      if (el) {
        el.style.cursor = 'pointer'
        el.addEventListener('click', () => audio.playNote(notes[i], '4n'))
        el.addEventListener('mouseenter', () => setHover(i))
        el.addEventListener('mouseleave', () => setHover(null))
      }
    })
    // 清理
    return () => {
      div.innerHTML = ''
    }
  }, [notes])

  return (
    <div>
      {title && <div className="viz-label">{title}</div>}
      <div ref={ref} style={{ overflowX: 'auto' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {notes.map((n, i) => (
          <button
            key={i}
            className={`chip ${hover === i ? '' : ''}`}
            style={hover === i ? { background: 'var(--accent)', color: '#0F1115' } : undefined}
            onClick={() => audio.playNote(n, '4n')}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
