import { Link, useParams } from 'react-router-dom'
import { GAMES } from '../../data/games'
import IntervalGame from './IntervalGame'
import ChordGame from './ChordGame'
import SightReadingGame from './SightReadingGame'
import FretMemoryGame from './FretMemoryGame'
import RhythmTapGame from './RhythmTapGame'
import ProgressionGame from './ProgressionGame'

export default function Games() {
  const { id = '' } = useParams()
  const meta = GAMES.find((g) => g.id === id)

  if (!meta) {
    return (
      <>
        <p>未找到该游戏。</p>
        <Link to="/games" className="btn ghost">← 返回游戏中心</Link>
      </>
    )
  }

  return (
    <>
      <Link to="/games" className="btn ghost" style={{ marginBottom: 16 }}>← 游戏中心</Link>
      <h1 style={{ marginBottom: 18 }}>{meta.title}</h1>
      {meta.id === 'interval-id' && <IntervalGame />}
      {meta.id === 'chord-id' && <ChordGame />}
      {meta.id === 'sightread' && <SightReadingGame />}
      {meta.id === 'fret-memory' && <FretMemoryGame />}
      {meta.id === 'rhythm-tap' && <RhythmTapGame />}
      {meta.id === 'progression-id' && <ProgressionGame />}
    </>
  )
}
