// 乐理基础：数据驱动的知识点。每个知识点含详尽讲解（sections）与多个可播放示例（examples）。

export type VizType =
  | 'keyboard'
  | 'staff'
  | 'interval'
  | 'chord'
  | 'circle'
  | 'fretboard'
  | 'scale'
  | 'progression'
  | 'rhythm'
  | 'melody'
  | 'timbre'
  | 'loudness'
  | 'envelope'

export interface PlayableExample {
  title: string
  desc?: string
  type: VizType
  notes?: string[]
  highlight?: string[]
  pcs?: string[] // 指板高亮用的音级（不含八度）
  interval?: [string, string]
  chord?: string
  chords?: string[]
  keyName?: string
  scale?: string
  beats?: number
  pattern?: ('down' | 'up')[]
  bpm?: number
}

export interface Lesson {
  id: string
  title: string
  summary: string
  sections: { heading: string; body: string[] }[]
  examples: PlayableExample[]
}

export const THEORY_LESSONS: Lesson[] = [
  {
    id: 'theory-sound',
    title: '声音的物理基础（音高·响度·音色）',
    summary: '在学音名之前，先弄懂声音是什么：频率决定音高、振幅决定响度、谐波结构决定音色，外加包络对听感的影响。',
    sections: [
      {
        heading: '声音是一种机械波',
        body: [
          '声音的本质是「机械波」——物体振动推动周围空气分子来回挤压，形成疏密交替的压强波，以约 340 m/s 的速度在空气中传播。这列波传到耳朵，引起鼓膜振动，经内耳转成神经信号，我们才「听」到声音。因为需要介质传递，真空里没有声音。',
          '一段稳定的乐音，可以用三个相互独立的物理量完整描述：频率、振幅、谐波结构。它们分别对应我们听感上的音高、响度、音色。理解这三者，是学习一切乐理的物理起点。',
        ],
      },
      {
        heading: '频率 → 音高（Pitch）',
        body: [
          '频率指声波每秒振动的次数，单位赫兹（Hz，1 Hz = 每秒 1 次）。频率越高，音听起来越「高、尖」；越低越「低、沉」。人耳可听范围约 20 Hz ~ 20000 Hz。',
          '乐音里约定 A4 = 440 Hz 为国际基准音。关键规律：音高每升高一个八度，频率正好翻倍——A4=440 Hz、A5=880 Hz、A6=1760 Hz。所以八度上下的两个音听起来「像同一个音」，这也是十二平均律把八度均分为 12 份的物理依据。',
          '决定音高的只是波的「基频」（最低、最主要的那个频率成分），跟波形长什么样、有多响都无关。',
        ],
      },
      {
        heading: '振幅 → 响度（Loudness）',
        body: [
          '振幅指波峰偏离静止位置的幅度，反映振动携带的能量大小。振幅越大，声音越响。注意：改变响度不改变音高——频率不变，只是波「更高」了。',
          '人耳对响度的感受是「对数」的，所以我们用分贝(dB)来度量：每增加约 10 dB，主观上「响一倍」。乐谱里的 pp（很弱）、mf（中强）、ff（很强）等力度记号，本质就是在控制振幅。',
        ],
      },
      {
        heading: '谐波结构 → 音色（Timbre）',
        body: [
          '这是「为什么钢琴和小提琴弹同一个音，听起来却不一样」的答案。核心原理（傅里叶）：任何周期性声波，都可以拆解成一个基频 f，加上频率为 2f、3f、4f…… 的整数倍成分，这些叠加成分就是「泛音 / 谐波（overtones / harmonics）」。',
          '基频决定音高，而泛音的「有哪些、各自多强、相位如何」共同决定音色。正弦波只有基频，最纯净单薄；三角波、方波只含奇次泛音，方波能量更强所以更亮；锯齿波包含全部整数倍泛音，最饱满刺耳。同一个基频叠上不同的泛音谱，就是不同的乐器音色。',
        ],
      },
      {
        heading: '包络（ADSR）也塑造听感',
        body: [
          '除了稳态的泛音结构，声音「随时间怎么变化」同样重要，这由包络描述，经典模型是 ADSR：起音(Attack，从无到最响的快慢)、衰减(Decay)、延音(Sustain，持续阶段的音量)、释音(Release，松手后的余音)。',
          '钢琴、吉他是「瞬间起音 + 快速衰减、无延音」，管风琴、拉弦长音是「较慢起音 + 长延音」。即使基频与泛音完全相同，把包络换掉，听感也会天差地别——这也是合成器塑造音色的关键手段。',
        ],
      },
    ],
    examples: [
      {
        title: '频率决定音高：八度关系',
        desc: 'C4 与 C5 频率恰好翻倍（≈262Hz→523Hz），听感极为相似。',
        type: 'interval',
        interval: ['C4', 'C5'],
      },
      {
        title: '音区扫描：频率越高越尖',
        desc: '依次播放 C3→C4→C5→C6，每上一个八度频率翻倍，听音高如何抬升。',
        type: 'melody',
        notes: ['C3', 'C4', 'C5', 'C6'],
      },
      {
        title: '音色对比：四种波形（核心）',
        desc: '同一音高 C4，四种波形泛音结构不同，听感截然不同。',
        type: 'timbre',
        notes: ['C4'],
      },
      {
        title: '响度对比：振幅不同',
        desc: '同一音高 A4，弱/中/强三档音量，频率不变、只是振幅变化。',
        type: 'loudness',
        notes: ['A4'],
      },
      {
        title: '包络对比：持续音 vs 拨弦',
        desc: '同一音高 C4，起音与衰减不同，塑造出不同听感。',
        type: 'envelope',
        notes: ['C4'],
      },
    ],
  },

  {
    id: 'theory-pitch',
    title: '音高与五线谱',
    summary: '认识音名、唱名、十二平均律，以及五线谱上的高音谱号记谱与位置逻辑。',
    sections: [
      {
        heading: '什么是音高',
        body: [
          '音高指声音频率的高低。音乐上把连续的声音量化成离散的「音」。最小单位是半音（semitone）：把八度（频率恰好翻倍）均分为 12 等份，每份即一个半音。钢琴上相邻两个键（含黑键）之间就是半音；中间隔一个键（如 C→D）则是全音（whole tone，2 个半音）。',
          '十二平均律（12-TET）是现代西方音乐的基础——任意两个相邻半音的频率比固定为 2^(1/12) ≈ 1.0595。因为比值恒定，乐曲可以在任意调上演奏而基本不跑调，这也是转调、移调得以成立的前提。',
        ],
      },
      {
        heading: '音名与唱名',
        body: [
          '7 个基本音名用字母 C D E F G A B 表示，对应唱名 do re mi fa sol la si（首调唱名法）。在白键之间插入升号(#)/降号(b)得到黑键音：C#/Db、D#/Eb、F#/Gb、G#/Ab、A#/Bb。同一黑键常有两种叫法（等音 enharmonic），如 C# 与 Db 实际音高完全相同。',
          '为避免同名混淆，在音名后加数字表示八度分组，例如 C4 为「中央 C」（钢琴正中间偏左），C5 比它高一个八度，C3 比它低一个八度。',
        ],
      },
      {
        heading: '五线谱与谱号',
        body: [
          '五线谱由五条平行横线（加四条间）构成，位置越高表示音越高。高音谱号（G 谱号，𝄞）的螺旋中心缠绕在第二线上，该线即 G4。低音谱号（F 谱号，𝄢）的两点夹住第四线，即 F3，用于更低的音区。中音谱号用于中提琴等中音乐器。',
          '当音超出五线范围时，使用「加线」（ledger lines）向上或向下延伸，例如中央 C 在高音谱表位于下加一线处。',
        ],
      },
      {
        heading: '建立「位置 → 音名 → 听感」的联结',
        body: [
          '记住几个锚点有助于读谱：高音谱表下加一线 = C4（中央 C），第一间 = F4，第二线 = G4，第三间 = C5。对照键盘反复练习，让眼睛看到的谱面位置直接唤起耳朵的听感，是视唱练耳的基本功。',
        ],
      },
    ],
    examples: [
      {
        title: '点击钢琴听各音高',
        desc: '点击下方键盘的任意白键/黑键即可发声；高亮处为 C-E-G 三个音。',
        type: 'keyboard',
        highlight: ['C4', 'E4', 'G4'],
      },
      {
        title: '五线谱上的 C-E-G',
        desc: '高音谱表中 C4、E4、G4 的位置，点击音符即可发声。',
        type: 'staff',
        notes: ['C4', 'E4', 'G4'],
      },
      {
        title: 'C 大调音阶（上行）',
        desc: '从中央 C 起的 C 大调音阶，听音高如何逐级上行。',
        type: 'scale',
        scale: 'C major',
      },
      {
        title: '八度关系',
        desc: 'C4 与 C5 音名相同、频率翻倍，听感极为相似。',
        type: 'interval',
        interval: ['C4', 'C5'],
      },
    ],
  },

  {
    id: 'theory-interval',
    title: '音程',
    summary: '两个音之间的距离，用「度数 + 性质」描述，是和声与旋律的基石。',
    sections: [
      {
        heading: '度数（Number）',
        body: [
          '度数指两音在字母表上的跨度。C→E 经过 C、D、E 共三个字母，故为三度；C→G 为五度。超过八度后继续计数，如 C→C 再上一个 C 为九度（compound interval 复合音程）。',
        ],
      },
      {
        heading: '半音数与性质',
        body: [
          '半音数决定「性质」：0=纯一度(P1)，1=小二度(m2)，2=大二度(M2)，3=小三度(m3)，4=大三度(M3)，5=纯四度(P4)，6=增四度/减五度(tritone 三全音)，7=纯五度(P5)，8=小六度，9=大六度，10=小七度，11=大七度，12=纯八度。',
          '「纯」(Perfect) 用于一、四、五、八度；「大/小」(Major/Minor) 用于二、三、六、七度；在它们基础上再升降半音即「增」(Aug) /「减」(Dim)。',
        ],
      },
      {
        heading: '协和与不协和',
        body: [
          '纯八度、纯五度、纯四度、大/小三度、大/小六度较为协和，听起来融合稳定；大/小二度、大/小七度、三全音较不协和，制造紧张与倾向，需要进一步「解决」到协和音。',
        ],
      },
      {
        heading: '音程转位',
        body: [
          '把一个音移高一个八度后，音程性质互补：大↔小、增↔减、纯保持纯；度数相加等于 9（如大三度转位为大六度，纯五度转位为纯四度）。转位在分析和弦与旋律时非常有用。',
        ],
      },
    ],
    examples: [
      {
        title: '大三度 C–E',
        desc: '明亮、协和，是大三和弦的「色彩音」。',
        type: 'interval',
        interval: ['C4', 'E4'],
      },
      {
        title: '纯五度 C–G',
        desc: '空旷稳定，最协和的音程之一，常用于空五度持续音。',
        type: 'interval',
        interval: ['C4', 'G4'],
      },
      {
        title: '小二度 C–C#',
        desc: '极不协和，两音几乎「挤」在一起，制造尖锐撞击感。',
        type: 'interval',
        interval: ['C4', 'C#4'],
      },
      {
        title: '大六度 C–A',
        desc: '柔和、带一点思念感，常用于抒情旋律的跨度。',
        type: 'interval',
        interval: ['C4', 'A4'],
      },
      {
        title: '大七度 C–B',
        desc: '强烈倾向解决到八度（C–C），爵士属七和弦的张力来源之一。',
        type: 'interval',
        interval: ['C4', 'B4'],
      },
    ],
  },

  {
    id: 'theory-chord',
    title: '和弦（三和弦 / 七和弦）',
    summary: '三个或更多音按三度叠置。学会三和弦、七和弦的构成、色彩与转位。',
    sections: [
      {
        heading: '三和弦的构成',
        body: [
          '三和弦 = 根音 + 三音 + 五音，由两个三度叠置而成。大三和弦 = 大三度 + 小三度（根到三音为大三、三音到五音为小三），音响明亮（如 C-E-G）。小三和弦 = 小三度 + 大三度，音响偏暗/忧伤（如 C-Eb-G）。',
          '增三和弦 = 大三 + 大三（C-E-G#），减三和弦 = 小三 + 小三（C-Eb-Gb），二者都包含三全音，紧张不安，常作过渡或色彩音。',
        ],
      },
      {
        heading: '七和弦',
        body: [
          '在三和弦上方再叠一个三度，得到四个音的七和弦。属七和弦（C7 = 大+小+小）含三全音，强烈倾向解决到主和弦；大七和弦（Cmaj7 = 大+小+大）柔和平滑，是爵士的招牌音色；小七和弦（Cm7 = 小+大+小）慵懒内敛；半减七/减七用于更暗的色调。',
        ],
      },
      {
        heading: '和弦转位',
        body: [
          '三和弦有三个位置：原位（根音在最低）、第一转位（三音在最低）、第二转位（五音在最低）。转位只改变最低音（bass），组成音不变。转位让低音线条更平滑，避免大跳，也使和弦连接更连贯。',
        ],
      },
      {
        heading: '声部连接常识',
        body: [
          '好的声部连接遵循「共同音保持、其余声部就近移动」，并尽量避开平行五度/平行八度（古典和声规则）。流行与爵士对这些限制更自由，但「就近、平滑」仍是让进行好听的基本原则。',
        ],
      },
    ],
    examples: [
      {
        title: 'C 大三和弦',
        desc: '根+大三度+纯五度，明亮稳定，最基础的和弦。',
        type: 'chord',
        chord: 'C',
      },
      {
        title: 'Am 小三和弦',
        desc: '根+小三度+纯五度，忧伤内敛，流行抒情常用。',
        type: 'chord',
        chord: 'Am',
      },
      {
        title: 'G7 属七和弦',
        desc: '含三全音，强烈想解决到 C（V7→I）。',
        type: 'chord',
        chord: 'G7',
      },
      {
        title: 'Cmaj7 大七和弦',
        desc: '柔和平滑，爵士/灵魂乐常见色彩。',
        type: 'chord',
        chord: 'Cmaj7',
      },
      {
        title: 'Cdim 减三和弦',
        desc: '紧张不安，常用于过渡或悬疑段落。',
        type: 'chord',
        chord: 'Cdim',
      },
    ],
  },

  {
    id: 'theory-rhythm',
    title: '节奏与节拍',
    summary: '拍号、音符时值与节拍重音，让音乐有了可感的脉搏与律动。',
    sections: [
      {
        heading: '拍号（Time Signature）',
        body: [
          '拍号写在谱号之后，如 4/4、3/4、6/8。分子 = 每小节的拍数，分母 = 以几分音符为一拍（4 表示四分音符）。4/4 最常见（common time，常记为 𝄆）；3/4 是圆舞曲式的三拍（强-弱-弱）；6/8 是复合拍，感觉为两个大拍、每大拍内含三连音。',
        ],
      },
      {
        heading: '音符时值',
        body: [
          '从长到短：全音符(4 拍) → 二分音符(2 拍) → 四分音符(1 拍) → 八分音符(1/2 拍) → 十六分音符(1/4 拍)。音符尾部旗子越多，时值越短。附点使其延长原本的一半（附点四分音符 = 1.5 拍）。',
        ],
      },
      {
        heading: '休止符与连音',
        body: [
          '休止符表示 silence，时值与对应音符相同（全休止、四分休止等）。三连音把一拍平均分成三份，打破「二进位」习惯，制造流动的推进感；切分音则把重音移到弱拍，制造错位 groove。',
        ],
      },
      {
        heading: '节拍重音与稳定速度',
        body: [
          '每小节第一拍通常最强（强拍 downbeat），其后渐弱。用指挥图式或身体律动（点头、踏拍）帮助维持稳定速度（tempo）。稳定的节拍是所有「律动/groove」的根基，也是合奏的前提。',
        ],
      },
    ],
    examples: [
      {
        title: '4/4 拍 · 流行基石',
        desc: '强-弱-次强-弱，绝大多数流行/摇滚的脉搏。',
        type: 'rhythm',
        beats: 4,
        pattern: ['down', 'up', 'up', 'up'],
        bpm: 96,
      },
      {
        title: '3/4 拍 · 圆舞曲',
        desc: '强-弱-弱，三拍摇摆感，常用于华尔兹。',
        type: 'rhythm',
        beats: 3,
        pattern: ['down', 'up', 'up'],
        bpm: 108,
      },
      {
        title: '2/4 拍 · 进行曲',
        desc: '强-弱，整齐有力，军乐与进行曲常用。',
        type: 'rhythm',
        beats: 2,
        pattern: ['down', 'up'],
        bpm: 120,
      },
      {
        title: '6/8 拍 · 复合拍',
        desc: '两个大拍、每拍三连音，摇晃如摇篮。',
        type: 'rhythm',
        beats: 6,
        pattern: ['down', 'up', 'up', 'up', 'up', 'up'],
        bpm: 84,
      },
    ],
  },

  {
    id: 'theory-scale',
    title: '音阶（大调 / 小调 / 五声 / 调式）',
    summary: '音阶是旋律与即兴的素材库。掌握大调、自然/和声/旋律小调、五声与调式。',
    sections: [
      {
        heading: '大调音阶',
        body: [
          '公式：全 全 半 全 全 全 半（W-W-H-W-W-W-H）。半音出现在第 3-4 音、第 7-8 音之间。C 大调全用白键：C D E F G A B。大调整体明亮、稳定，是西方音乐最基础的声音。',
        ],
      },
      {
        heading: '自然小调',
        body: [
          '公式：全 半 全 全 半 全 全。A 自然小调（A B C D E F G）与 C 大调互为关系大小调——共享完全相同的音，但主音不同，于是色彩由明转暗。小调常用于抒情、忧伤的段落。',
        ],
      },
      {
        heading: '和声小调与旋律小调',
        body: [
          '和声小调把第 7 音升高半音（导音），制造向主音的强烈倾向，但会引入增二度跳进；旋律小调上行再升高第 6 音、下行还原，使旋律线条更顺滑。二者让小调更有「推动力」。',
        ],
      },
      {
        heading: '五声音阶',
        body: [
          '去掉小二度冲突音，保留 5 个音（如 C D E G A）。因为没有半音碰撞，怎么组合都「安全」，广泛用于民谣、布鲁斯、流行与中国风音乐。',
        ],
      },
      {
        heading: '调式（Modes）',
        body: [
          '从大调音阶不同音级起奏，得到七种教会调式：Ionian(即大调)、Dorian(小调感但第 6 音明亮)、Phrygian、Lydian(第 4 音升高、梦幻)、Mixolydian(大调感但第 7 音降低)、Aeolian(即自然小调)、Locrian。同一组音、不同主音 = 截然不同的情绪。',
        ],
      },
    ],
    examples: [
      {
        title: 'C 大调',
        desc: '明亮、无升降号，最基础的音阶。',
        type: 'scale',
        scale: 'C major',
      },
      {
        title: 'A 自然小调',
        desc: '与 C 大调同音，主音不同，色彩转暗。',
        type: 'scale',
        scale: 'A natural minor',
      },
      {
        title: 'C 五声音阶',
        desc: '安全无冲突，民谣/流行/东方音乐常用。',
        type: 'scale',
        scale: 'C major pentatonic',
      },
      {
        title: 'D 多利亚（调式）',
        desc: '小调感但第 6 音明亮，爵士即兴常见。',
        type: 'scale',
        scale: 'D dorian',
      },
      {
        title: 'G 大调',
        desc: '一个升号（F#），移调后的明亮大调。',
        type: 'scale',
        scale: 'G major',
      },
      {
        title: 'C 五声在指板上的位置',
        desc: '高亮 C 五声音级在吉他指板上的所有位置，点击任意处发声。',
        type: 'fretboard',
        pcs: ['C', 'D', 'E', 'G', 'A'],
      },
    ],
  },

  {
    id: 'theory-progression',
    title: '和声进行',
    summary: '和弦的连接规则与经典进行（如 I–V–vi–IV），理解张力与解决。',
    sections: [
      {
        heading: '级数标记',
        body: [
          '用罗马数字标记和弦在调内的位置：I(主,tonic)、ii、iii、IV(下属,subdominant)、V(属,dominant)、vi(关系小调)、vii°。大写表示大和弦，小写表示小和弦。在 C 大调中：I=C，IV=F，V=G，vi=Am。',
        ],
      },
      {
        heading: '和弦功能',
        body: [
          '主(I)稳定，给人「家」的感觉；下属(IV)推进、离开；属(V)制造紧张、强烈想回到主。T–S–D–T 是最基本的张力循环，几乎所有进行都可归结于此。',
        ],
      },
      {
        heading: '经典进行',
        body: [
          'I–V–vi–IV 是当代流行的「万能进行」（无数金曲共用）；I–vi–IV–V 是 50 年代 doo-wop / 抒情 ballad 常用；ii–V–I 是爵士与古典终止的标配；卡农进行 I–V–vi–iii–IV–I–IV–V 则出自帕赫贝尔。',
        ],
      },
      {
        heading: '终止式',
        body: [
          '正格终止 V→I 结束感最强；变格终止 IV→I 较柔和（似「阿门」）；半终止停在 V 制造悬念，等待后续解决。终止式决定了乐句/乐段的呼吸。',
        ],
      },
    ],
    examples: [
      {
        title: 'I–V–vi–IV（流行万能进行）',
        desc: 'C 大调：C → G → Am → F，明亮又带一点惆怅。',
        type: 'progression',
        keyName: 'C 大调',
        chords: ['C', 'G', 'Am', 'F'],
      },
      {
        title: 'I–vi–IV–V（抒情 ballad）',
        desc: 'C 大调：C → Am → F → G，温柔推进。',
        type: 'progression',
        keyName: 'C 大调',
        chords: ['C', 'Am', 'F', 'G'],
      },
      {
        title: 'I–IV–V–I（最朴实的循环）',
        desc: 'C 大调：C → F → G → C，稳定收束。',
        type: 'progression',
        keyName: 'C 大调',
        chords: ['C', 'F', 'G', 'C'],
      },
      {
        title: 'ii–V–I（爵士标配）',
        desc: 'C 大调：Dm → G → C，属和弦解决到主，经典终止。',
        type: 'progression',
        keyName: 'C 大调',
        chords: ['Dm', 'G', 'C'],
      },
    ],
  },

  {
    id: 'theory-key',
    title: '调性与移调',
    summary: '调性中心、关系大小调、转调与移调的基本方法。',
    sections: [
      {
        heading: '调性中心',
        body: [
          '调性（tonality）指音乐围绕一个中心音（主音 tonic）来组织。主音决定调名（C 大调、A 小调）。大调明亮坚定，小调柔和暗淡，这正是调式色彩的源头。一首曲子的「调」通常是听众潜意识里的「家」。',
        ],
      },
      {
        heading: '关系大小调',
        body: [
          '每个大调都有一个共享音阶的「关系小调」，位于其下方小三度处。C 大调 ↔ A 小调；G 大调 ↔ E 小调。两者谱号、升降号完全相同，只是主音不同——所以同一段旋律换个主音，情绪立刻反转。',
        ],
      },
      {
        heading: '转调（Modulation）',
        body: [
          '乐曲中途切换到新的主音即转调，能带来新鲜感或推动情绪。常用「共同和弦」平滑过渡（两调都包含的和弦）。与当前调相差一个升降号的「近关系调」转调最自然、最少痕迹。',
        ],
      },
      {
        heading: '移调（Transposition）',
        body: [
          '移调把所有音整体抬高/降低相同度数，用于适应不同人声或乐器的音域，或单纯改变调性色彩。移调不改变音程关系，只改变绝对高度——旋律的「形状」保持不变。',
        ],
      },
    ],
    examples: [
      {
        title: '原调：C 大调',
        desc: '听其明亮稳定的主调色彩。',
        type: 'scale',
        scale: 'C major',
      },
      {
        title: '关系小调：A 小调',
        desc: '同音、不同主音，色彩由明转暗。',
        type: 'scale',
        scale: 'A minor',
      },
      {
        title: '主题动机（旋律）',
        desc: '听这段短旋律的轮廓，体会调性内的走向。',
        type: 'melody',
        notes: ['C4', 'D4', 'E4', 'F4', 'E4', 'D4', 'C4'],
      },
      {
        title: 'C 大调 I–IV–V（可整体移高全音成 D 大调）',
        desc: 'C → F → G → C；若整体移高全音，则变成 D → G → A（D 大调）。',
        type: 'progression',
        keyName: 'C 大调',
        chords: ['C', 'F', 'G', 'C'],
      },
    ],
  },

  {
    id: 'theory-circle',
    title: '五度圈',
    summary: '按纯五度排列的调性圆盘，一眼看清调号、升降规律与近关系调。',
    sections: [
      {
        heading: '顺时针 = 升号递增',
        body: [
          '从 C（无升降）出发，每顺时针走一个纯五度，升号 +1：G(1#)、D(2#)、A(3#)、E(4#)、B(5#)……规律：升号出现顺序为 F# C# G# D# A#；最后一个升号的上方相邻音即该调主音。',
        ],
      },
      {
        heading: '逆时针 = 降号递增',
        body: [
          '每逆时针走一个纯五度（=下四度），降号 +1：F(1b)、Bb(2b)、Eb(3b)……降号出现顺序为 Bb Eb Ab Db Gb；最后一个降号的下方音即主音。顺时针与逆时针在远端（F#/Gb 等）汇合于等音调。',
        ],
      },
      {
        heading: '相对大小调',
        body: [
          '五度圈上相对位置（如 C 与 Am、G 与 Em）即关系大小调，共享同一调号。这让「一个大调配哪个小调」一目了然。',
        ],
      },
      {
        heading: '近关系调',
        body: [
          '与某调相邻（相差一个升降号）的调为近关系调，转调最自然。五度圈就是一张「调性地图」，把抽象的调号与亲缘关系可视化。',
        ],
      },
    ],
    examples: [
      {
        title: '点击调性听主音与主和弦',
        desc: '在五度圈上任意点击，听该调主音与组成音。',
        type: 'circle',
      },
      {
        title: '顺时针邻调：G',
        desc: '比 C 多一个升号（F#），明亮的大调邻居。',
        type: 'chord',
        chord: 'G',
      },
      {
        title: '逆时针邻调：F',
        desc: '比 C 多一个降号（Bb），柔和的降号邻居。',
        type: 'chord',
        chord: 'F',
      },
      {
        title: '顺时针两步：D 大调',
        desc: '两个升号（F#、C#），更「尖锐」明亮的大调。',
        type: 'scale',
        scale: 'D major',
      },
    ],
  },

  {
    id: 'theory-form',
    title: '曲式基础',
    summary: '乐句、乐段与常见曲式（二段式、三段式、回旋曲、变奏）。',
    sections: [
      {
        heading: '乐句与乐段',
        body: [
          '乐句（phrase）像一句话，常 2 或 4 小节，以「终止」收束；乐段（period）由两个乐句组成（常为 8 小节），典型如「问—答」：前句停在半终止（悬念），后句停在全终止（解决），共同表达一个完整乐思。',
        ],
      },
      {
        heading: '二段式 AB',
        body: [
          '两个对比主题 A、B。A 建立材料，B 提供对比。常用于二部曲式（如小步舞曲、进行曲、许多民谣）。',
        ],
      },
      {
        heading: '三段式 ABA',
        body: [
          'A 呈示、B 对比（常转调以拉开距离）、A 再现（回到原调），带来「回家」的满足感。歌曲的「主歌—副歌—主歌」即典型三段式思维。',
        ],
      },
      {
        heading: '回旋曲与变奏',
        body: [
          '回旋曲（Rondo）为 ABACA…… 反复的主题穿插新段落，适合作为欢快的终曲；主题与变奏（Theme & Variations）则保留主题轮廓，不断改变织体、节奏或调性，像对同一句话做不同演绎。',
        ],
      },
    ],
    examples: [
      {
        title: 'A 乐句动机',
        desc: '4 个音的短动机，乐句的「问句」。',
        type: 'melody',
        notes: ['C4', 'E4', 'G4', 'E4'],
      },
      {
        title: 'A–B–A 三段式',
        desc: '主题 → 对比 → 再现，听「出去再回来」的结构感。',
        type: 'melody',
        notes: ['C4', 'E4', 'G4', 'E4', 'D4', 'F4', 'A4', 'F4', 'C4', 'E4', 'G4', 'E4'],
      },
      {
        title: 'ABACA 回旋',
        desc: '主题反复穿插新段落，欢快终曲的典型。',
        type: 'melody',
        notes: ['C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', 'G4', 'C5', 'E5', 'C5', 'G4'],
      },
      {
        title: '乐句脉搏：4/4 拍',
        desc: '用节拍器感受乐句如何落在稳定的 4/4 脉搏上。',
        type: 'rhythm',
        beats: 4,
        pattern: ['down', 'up', 'up', 'up'],
        bpm: 100,
      },
    ],
  },
]

export function getLesson(id: string) {
  return THEORY_LESSONS.find((l) => l.id === id)
}
