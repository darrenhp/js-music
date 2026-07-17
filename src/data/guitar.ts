export interface GuitarChord {
  name: string
  frets: number[] // 6 弦到 1 弦，-1 表示不弹，0 表示空弦，数字表示品格
  fingers?: number[]
}

export const GUITAR_CHORDS: GuitarChord[] = [
  { name: 'C', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  { name: 'G', frets: [3, 2, 0, 0, 0, -1], fingers: [3, 2, 0, 0, 0, 0] },
  { name: 'D', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 2, 3, 1] },
  { name: 'Em', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  { name: 'Am', frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  { name: 'E', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  { name: 'A', frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  { name: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1] },
  { name: 'Dm', frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
  { name: 'C7', frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0] },
]

/** 把和弦指法转换为实际发声音名（标准调弦） */
export const TUNING = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] // 6→1 弦
export function chordToNotes(c: GuitarChord): string[] {
  return c.frets.map((fret, i) => {
    if (fret < 0) return ''
    const open = TUNING[i]
    return shiftNote(open, fret)
  }).filter(Boolean) as string[]
}

function shiftNote(note: string, semis: number): string {
  const map: Record<string, number> = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 }
  const m = note.match(/^([A-G][#b]?)(\d)$/)
  if (!m) return note
  const pc = m[1]
  const oct = parseInt(m[2])
  let total = map[pc] + semis
  let newOct = oct
  while (total >= 12) { total -= 12; newOct++ }
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  return names[total] + newOct
}

/** 一段示例 Tab（C 大调音阶片段），用等宽字符渲染 */
export const SAMPLE_TAB = `e |----------------0-1-2-3-|
B |------------0-1-2-3---|
G |--------0-1-2-3-------|
D |--0-1-2-3-------------|
A |----------------------|
E |----------------------|`
