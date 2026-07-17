import Keyboard from './Keyboard'
import StaffCanvas from './StaffCanvas'
import IntervalPlayer from './IntervalPlayer'
import ChordDiagram from './ChordDiagram'
import CircleOfFifths from './CircleOfFifths'
import Fretboard from './Fretboard'
import ScalePlayer from './ScalePlayer'
import ProgressionPlayer from './ProgressionPlayer'
import RhythmDemo from './RhythmDemo'
import MelodyPlayer from './MelodyPlayer'
import TimbreDemo from './TimbreDemo'
import LoudnessDemo from './LoudnessDemo'
import EnvelopeDemo from './EnvelopeDemo'
import type { PlayableExample } from '../data/theory'

/** 按示例声明的类型分发到对应可播放组件 */
export default function Visualization({ spec }: { spec: PlayableExample }) {
  switch (spec.type) {
    case 'keyboard':
      return <Keyboard highlight={spec.highlight} />
    case 'staff':
      return <StaffCanvas notes={spec.notes || ['C4', 'E4', 'G4']} />
    case 'interval':
      return <IntervalPlayer initial={spec.interval} />
    case 'chord':
      return <ChordDiagram chord={spec.chord || 'C'} />
    case 'circle':
      return <CircleOfFifths />
    case 'fretboard':
      return <Fretboard highlightPCs={spec.pcs || []} />
    case 'scale':
      return <ScalePlayer scale={spec.scale || 'C major'} />
    case 'progression':
      return <ProgressionPlayer chords={spec.chords || []} keyName={spec.keyName} />
    case 'rhythm':
      return <RhythmDemo beats={spec.beats || 4} pattern={spec.pattern || ['down', 'up', 'up', 'up']} bpm={spec.bpm} />
    case 'melody':
      return <MelodyPlayer notes={spec.notes || []} title={spec.title} />
    case 'timbre':
      return <TimbreDemo note={spec.notes?.[0]} />
    case 'loudness':
      return <LoudnessDemo note={spec.notes?.[0]} />
    case 'envelope':
      return <EnvelopeDemo note={spec.notes?.[0]} />
    default:
      return <p className="faint">该知识点暂无可交互示例。</p>
  }
}
