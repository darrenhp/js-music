export type GameId =
  | 'interval-id'
  | 'chord-id'
  | 'sightread'
  | 'fret-memory'
  | 'rhythm-tap'
  | 'progression-id'

export interface GameMeta {
  id: GameId
  title: string
  desc: string
  diff: 'easy' | 'mid' | 'hard'
  /** 是否完整可玩（完整实现） */
  playable: boolean
}

export const GAMES: GameMeta[] = [
  { id: 'interval-id', title: '音程听辨', desc: '听两个音，选出正确音程。训练耳朵对距离的敏感度。', diff: 'easy', playable: true },
  { id: 'chord-id', title: '和弦听辨', desc: '听和弦音色，判断是大/小/属七/大七等。', diff: 'mid', playable: true },
  { id: 'sightread', title: '五线谱视奏挑战', desc: '看谱面音符，快速点出对应音名。', diff: 'hard', playable: true },
  { id: 'fret-memory', title: '指板速记', desc: '给定音名，在指板上快速点出所有位置。', diff: 'mid', playable: true },
  { id: 'rhythm-tap', title: '节奏跟打', desc: '跟随节拍器提示，按时点击保持节奏。', diff: 'easy', playable: true },
  { id: 'progression-id', title: '和弦进行听辨', desc: '听一段进行，判断级数走向（如 I–V–vi–IV）。', diff: 'hard', playable: true },
]
