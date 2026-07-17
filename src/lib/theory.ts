import * as Tonal from 'tonal'

/** 乐理计算封装：基于 Tonal.js */

export function getChordInfo(name: string) {
  const c = Tonal.Chord.get(name)
  return c
}

export function getScaleInfo(name: string) {
  return Tonal.Scale.get(name)
}

/** 解析和弦组成音（科学音高，如 C3...），便于键盘/指板高亮 */
export function chordNotesAt(name: string, octave = 3): string[] {
  const info = Tonal.Chord.get(name)
  if (!info.notes.length) return []
  return info.notes.map((pc) => {
    const note = Tonal.Note.get(pc)
    // 选一个 >= octave 的八度
    let oct = octave
    if (note.oct === null) {
      return `${pc}${oct}`
    }
    return `${pc}${oct}`
  })
}

/** 音阶组成音（含八度循环，给定起始音与八度数） */
export function scaleNotes(name: string, startOctave = 3, octaves = 1): string[] {
  const info = Tonal.Scale.get(name)
  if (!info.notes.length) return []
  const out: string[] = []
  for (let o = 0; o < octaves; o++) {
    info.notes.forEach((pc) => out.push(`${pc}${startOctave + o}`))
  }
  return out
}

/** 音程信息：给定两个音名（含八度），返回 semitones / 名称 */
export function intervalBetween(a: string, b: string) {
  const iv = Tonal.Interval.distance(a, b)
  const info = Tonal.Interval.get(iv)
  return { name: iv, semitones: info.semitones, quality: (info as any).quality, num: info.num }
}

/** 五度圈：返回 12 个调（顺时针升号），每个含 key 与主和弦 */
export function circleOfFifthsMajors() {
  const pcs = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F']
  return pcs.map((pc) => ({
    tonic: pc,
    major: `${pc} major`,
    chord: `${pc}`,
    scale: Tonal.Scale.get(`${pc} major`).notes,
  }))
}

/** 指板音名：返回 6 弦 x frets 的二维音名数组（标准调弦 E2 A2 D3 G3 B3 E4） */
export const GUITAR_TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] as const
export function fretboardNotes(frets = 12): string[][] {
  // 从上到下为 1 弦(高E) ... 6 弦(低E)；这里按视觉行顺序返回
  const order = [...GUITAR_TUNING].reverse() // 1弦 到 6弦
  return order.map((open) => {
    const row: string[] = []
    for (let f = 0; f <= frets; f++) {
      row.push(Tonal.Note.transpose(open, Tonal.Interval.fromSemitones(f)))
    }
    return row
  })
}

/** 给定音名集合（音级），返回指板上匹配的位置坐标 {string, fret, note} */
export function locateOnFretboard(targetPCs: string[], frets = 12) {
  const board = fretboardNotes(frets)
  const res: { string: number; fret: number; note: string }[] = []
  board.forEach((row, si) => {
    row.forEach((note, fret) => {
      if (targetPCs.includes(Tonal.Note.get(note).pc)) {
        res.push({ string: si + 1, fret, note })
      }
    })
  })
  return res
}

/** CAGED 五种指型的根音起始品格（以 C 大调为例的常用把位，简化模型） */
export const CAGED_SHAPES = [
  { name: 'C', rootFret: 0, baseString: 5 },
  { name: 'A', rootFret: 0, baseString: 5 },
  { name: 'G', rootFret: 3, baseString: 6 },
  { name: 'E', rootFret: 0, baseString: 6 },
  { name: 'D', rootFret: 0, baseString: 4 },
] as const
