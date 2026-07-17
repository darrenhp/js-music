export interface QuizQuestion {
  id: string
  q: string
  options: string[]
  answer: number
  explain?: string
}

export type VizType = 'keyboard' | 'staff' | 'interval' | 'chord' | 'circle' | 'fretboard'

export interface VizSpec {
  type: VizType
  notes?: string[]
  highlight?: string[]
  interval?: [string, string]
  chord?: string
  root?: string
  scale?: string
}

export interface Lesson {
  id: string
  title: string
  summary: string
  sections: { heading: string; body: string[] }[]
  viz?: VizSpec
  quiz?: QuizQuestion[]
}

export const THEORY_LESSONS: Lesson[] = [
  {
    id: 'theory-pitch',
    title: '音高与五线谱',
    summary: '认识音名、唱名、十二平均律，以及五线谱上的高音谱号记谱。',
    sections: [
      {
        heading: '什么是音高',
        body: [
          '音乐里最小的音高单位是「半音」。把一个八度均分成 12 份，就得到十二平均律——钢琴上相邻两个键（含黑键）就是半音关系。',
          '音名用 7 个字母表示：C D E F G A B，对应唱名 do re mi fa sol la si。在它们之间插入升(#)/降(b)记号得到黑键音。',
        ],
      },
      {
        heading: '五线谱与高音谱号',
        body: [
          '五线谱由五条平行横线组成，音符落在线上或间上表示不同音高。高音谱号（G 谱号）的螺旋中心缠绕在「第二线」，即 G4（小字一组的 sol）。',
          '点击下方键盘或谱面音符可实时发声，建立「位置→音高→听感」的联结。',
        ],
      },
    ],
    viz: { type: 'keyboard', highlight: ['C4', 'E4', 'G4'] },
    quiz: [
      {
        id: 'q1',
        q: '钢琴上相邻的两个琴键（含黑键）之间是？',
        options: ['全音', '半音', '八度', '纯五度'],
        answer: 1,
        explain: '十二平均律中相邻键为半音（1 个半音）。',
      },
      {
        id: 'q2',
        q: '高音谱号第二线上的音是？',
        options: ['C4', 'G4', 'E4', 'A4'],
        answer: 1,
        explain: '高音谱号螺旋中心在第二线，对应 G4。',
      },
    ],
  },
  {
    id: 'theory-interval',
    title: '音程',
    summary: '两个音之间的距离，用「度数 + 性质」描述，是和声的基石。',
    sections: [
      {
        heading: '度数与半音数',
        body: [
          '度数 = 两音在字母表上的跨度（C→E 是三度）。半音数决定性质：0=纯一度，1=小二度，2=大二度，3=小三度，4=大三度，5=纯四度，7=纯五度，12=八度。',
          '下方组件可选取两个音，播放并标注其度数与半音数。',
        ],
      },
    ],
    viz: { type: 'interval', interval: ['C4', 'G4'] },
    quiz: [
      {
        id: 'q1',
        q: 'C 到 G 是？',
        options: ['纯四度', '纯五度', '大三度', '小七度'],
        answer: 1,
        explain: 'C→G 跨 5 个字母（五度），半音数为 7，是纯五度。',
      },
      {
        id: 'q2',
        q: '大三度的半音数是？',
        options: ['3', '4', '5', '2'],
        answer: 1,
        explain: '大三度 = 4 个半音（如 C→E）。',
      },
    ],
  },
  {
    id: 'theory-chord',
    title: '和弦（三和弦 / 七和弦）',
    summary: '三个或更多音按三度叠置。学会三和弦与常用七和弦的构成。',
    sections: [
      {
        heading: '三和弦',
        body: [
          '三和弦 = 根音 + 三音 + 五音（两个三度叠置）。大三和弦 = 大三度+小三度（明亮），小三和弦 = 小三度+大三度（忧伤）。',
        ],
      },
      {
        heading: '七和弦',
        body: [
          '在根音上方再叠一个三度得到七和弦。常用：属七(C7=大+小+小)、大七(Cmaj7=大+小+大)、小七(Cm7=小+大+小)。',
          '下方输入和弦名或用预设按钮，可听到琶音并看到组成音。',
        ],
      },
    ],
    viz: { type: 'chord', chord: 'C' },
    quiz: [
      {
        id: 'q1',
        q: 'C 大三和弦的组成音是？',
        options: ['C E G', 'C Eb G', 'C E Gb', 'C F G'],
        answer: 0,
        explain: 'C 大三和弦 = 根(C)+大三度(E)+纯五度(G)。',
      },
      {
        id: 'q2',
        q: '小三和弦的音程结构是？',
        options: ['大三+大三', '小三+大三', '大三+小三', '纯四+大三'],
        answer: 1,
        explain: '小三和弦 = 小三度 + 大三度（如 C Eb G）。',
      },
    ],
  },
  {
    id: 'theory-rhythm',
    title: '节奏与节拍',
    summary: '拍号、音符时值与节拍重音，让音乐有了脉搏。',
    sections: [
      { heading: '拍号', body: ['4/4 表示每小节 4 拍、以四分音符为一拍；3/4 则是圆舞曲的三拍子。'] },
      { heading: '音符时值', body: ['全音符=4 拍，二分=2 拍，四分=1 拍，八分=1/2 拍，十六分=1/4 拍。'] },
    ],
  },
  {
    id: 'theory-scale',
    title: '音阶（大调 / 小调 / 五声 / 调式）',
    summary: '音阶是旋律的素材库。掌握大调、自然/和声/旋律小调与五声音阶。',
    sections: [
      { heading: '大调音阶', body: ['大调公式：全 全 半 全 全 全 半（W W H W W W H）。C 大调音阶：C D E F G A B。'] },
      { heading: '自然小调', body: ['自然小调公式：全 半 全 全 半 全 全。A 小调与 C 大调互为关系大小调，共享相同音。'] },
      { heading: '五声音阶', body: ['去掉小二度冲突音，得到更「安全」的五个音，常用于民谣与流行。'] },
    ],
  },
  {
    id: 'theory-progression',
    title: '和声进行',
    summary: '和弦的连接规则与经典进行（如 I–V–vi–IV）。',
    sections: [
      { heading: '级数标记', body: ['用罗马数字标记和弦在调内的位置：I(主)、IV(下属)、V(属)、vi(关系小调)。'] },
      { heading: '经典进行', body: ['卡农进行 I–V–vi–iii–IV–I–IV–V；流行进行 I–V–vi–IV 几乎无处不在。'] },
    ],
  },
  {
    id: 'theory-key',
    title: '调性与移调',
    summary: '调性中心与转调、移调的基本方法。',
    sections: [
      { heading: '调性', body: ['一首曲子围绕一个中心音（主音）组织，即调性。大调明亮、小调暗淡。'] },
      { heading: '移调', body: ['把所有音整体抬高/降低相同度数，即移调，用于适应不同嗓音或乐器。'] },
    ],
  },
  {
    id: 'theory-circle',
    title: '五度圈',
    summary: '按纯五度排列的调性圆盘，一眼看清调号与近关系调。',
    sections: [
      { heading: '顺时针升号', body: ['从 C 出发每顺时针一步升一个纯五度（多一个升号）：G(1#) D(2#) A(3#)…'] },
      { heading: '逆时针降号', body: ['逆时针每步降纯五度（多一个降号）：F(1b) Bb(2b) Eb(3b)…'] },
    ],
    viz: { type: 'circle', root: 'C' },
  },
  {
    id: 'theory-form',
    title: '曲式基础',
    summary: '乐句、乐段与常见曲式（二段式、三段式、奏鸣曲式）。',
    sections: [
      { heading: '乐句与乐段', body: ['乐句如一句话（常 4 小节），乐段由若干乐句组成（常 8 小节），形成完整乐思。'] },
      { heading: '常见曲式', body: ['AB（二段式）、ABA（三段式/复三段）、Rondo(ABACA) 等。'] },
    ],
  },
]

export function getLesson(id: string) {
  return THEORY_LESSONS.find((l) => l.id === id)
}
