import { useMemo, useState } from 'react'
import { audio } from '../audio/AudioEngine'
import { fretboardNotes } from '../lib/theory'
import * as Tonal from 'tonal'

interface Props {
  frets?: number
  highlightPCs?: string[]
  showNamesInit?: boolean
}

const STRING_LABELS = ['e', 'B', 'G', 'D', 'A', 'E'] // 1弦→6弦（视觉从上到下）

export default function Fretboard({ frets = 12, highlightPCs = [], showNamesInit = true }: Props) {
  const [showNames, setShowNames] = useState(showNamesInit)
  const board = useMemo(() => fretboardNotes(frets), [frets])

  return (
    <div>
      <div className="viz-label">交互式指板（点击发声）</div>
      <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center', marginBottom: 12, fontSize: 13 }}>
        <input type="checkbox" checked={showNames} onChange={(e) => setShowNames(e.target.checked)} />
        显示音名
      </label>
      <div className="fretboard" style={{ overflowX: 'auto' }}>
        {board.map((row, si) => (
          <div className="fret-string" key={si}>
            <span className="string-label">{STRING_LABELS[si]}</span>
            {row.map((note, fret) => {
              const pc = Tonal.Note.get(note).pc
              const hl = highlightPCs.includes(pc)
              const isMarker = [3, 5, 7, 9, 12].includes(fret)
              return (
                <div
                  key={fret}
                  className={`fret ${fret === 0 ? 'nut' : ''} ${hl ? 'hl' : ''} ${isMarker && !showNames ? 'dots' : ''}`}
                  onClick={() => audio.playNote(note, '8n')}
                  title={note}
                >
                  {showNames ? (hl ? pc : note.replace(/\d/, '')) : ''}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
