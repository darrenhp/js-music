import { useRef, useState } from 'react'

/* ============================================================
 * 《给极客的乐理课》——编译自 Eevee《Music theory for nerds》
 * （eev.ee/blog/2016/09/15/music-theory-for-nerds/，2016-09-15）
 * 原文的核心是三张表：十二半音频率表、音程比例表、调式旋转表。
 * 本页保留全部数据与推导脉络，配交互试听（Web Audio API）。
 * ============================================================ */

type Runner = (code: string) => string[]

function createRunner(): Runner {
  let ctx: AudioContext | null = null
  return (code: string) => {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    const ac = ctx
    const out = ac.destination
    const logs: string[] = []
    const note = (
      freq: number,
      start = 0,
      length = 0.5,
      type: OscillatorType = 'sine',
    ) => {
      const t = ac.currentTime + start
      const osc = ac.createOscillator()
      const env = ac.createGain()
      osc.type = type
      osc.frequency.value = freq
      env.gain.setValueAtTime(0, t)
      env.gain.linearRampToValueAtTime(0.25, t + 0.01)
      env.gain.exponentialRampToValueAtTime(0.001, t + length)
      osc.connect(env).connect(out)
      osc.start(t)
      osc.stop(t + length)
    }
    const fakeConsole = {
      log: (...args: unknown[]) =>
        logs.push(args.map((a) => String(a)).join(' ')),
    }
    try {
      // eslint-disable-next-line no-new-func
      new Function('ctx', 'out', 'note', 'console', `"use strict";\n${code}`)(
        ac,
        out,
        note,
        fakeConsole,
      )
    } catch (e) {
      logs.push('⚠ ' + (e as Error).message)
    }
    return logs
  }
}

/* ---------------- 通用小组件 ---------------- */

function TryButton({ run, code, label }: { run: Runner; code: string; label: string }) {
  const [count, setCount] = useState(0)
  return (
    <button
      className="mtn-run"
      onClick={() => {
        run(code)
        setCount((c) => c + 1)
      }}
    >
      ▶ {label}{count > 0 ? ` (${count})` : ''}
    </button>
  )
}

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mtn-widget">
      <div className="viz-label">{title}</div>
      {children}
    </div>
  )
}

/* ---------------- 交互：440 / 660 / 880 对比 ---------------- */

function OctaveCompare({ run }: { run: Runner }) {
  const items = [
    ['440 Hz', 'note(440, 0, 1.2);'],
    ['660 Hz（1.5×）', 'note(660, 0, 1.2);'],
    ['880 Hz（2×）', 'note(880, 0, 1.2);'],
    ['三个连播', '[440, 660, 880].forEach((f, i) => note(f, i * 0.9, 0.8));'],
  ] as const
  return (
    <Demo title="交互 · 频率翻倍听起来是「同一个音」（原文的三段音频示例）">
      <div className="mtn-row">
        {items.map(([label, code]) => (
          <TryButton key={label} run={run} code={code} label={label} />
        ))}
      </div>
      <p className="faint" style={{ fontSize: 12, margin: '8px 0 0' }}>
        440 和 880 的「亲缘感」明显强于 660 和它们任何一个——尽管 660 到 880 只差 220Hz，和 440 到 660 完全一样远。
      </p>
    </Demo>
  )
}

/* ---------------- 交互：十二半音试听 ---------------- */

const SEMITONES: [number, string][] = [
  [0, 'A'], [1, 'A♯/B♭'], [2, 'B'], [3, 'C'], [4, 'C♯/D♭'], [5, 'D'],
  [6, 'D♯/E♭'], [7, 'E'], [8, 'F'], [9, 'F♯/G♭'], [10, 'G'], [11, 'G♯/A♭'], [12, 'A'],
]

function SemitoneWalk({ run }: { run: Runner }) {
  const [lit, setLit] = useState<number | null>(null)
  return (
    <Demo title="交互 · 从 A4 到 A5 的十二个半音（点击任一音试听）">
      <div className="mtn-row">
        {SEMITONES.map(([semi, name]) => (
          <button
            key={semi}
            className="mtn-chip"
            style={lit === semi ? { background: 'var(--accent)', color: '#0F1115' } : undefined}
            onClick={() => {
              run(`note(440 * 2 ** (${semi} / 12), 0, 0.7);`)
              setLit(semi)
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <TryButton
          run={run}
          label="按顺序连播十二个"
          code={`for (let i = 0; i <= 12; i++) {
  note(440 * 2 ** (i / 12), i * 0.22, 0.28);
  console.log(i + " semitones: " + (440 * 2 ** (i / 12)).toFixed(2) + " Hz");
}`}
        />
      </div>
    </Demo>
  )
}

/* ---------------- 交互：音程比例试听 ---------------- */

const INTERVALS: [number, string, string, string | null][] = [
  // [半音数, 比例显示, 中文名, 近似分数]
  [0, '1.000 = 1:1', '同度', null],
  [1, '1.059', '半音（小二度）', null],
  [2, '1.122 ≈ 9:8', '全音（大二度）', '9:8'],
  [3, '1.189', '小三度', null],
  [4, '1.260 ≈ 5:4', '大三度', '5:4'],
  [5, '1.335 ≈ 4:3', '纯四度', '4:3'],
  [6, '1.414', '三全音', null],
  [7, '1.498 ≈ 3:2', '纯五度', '3:2'],
  [8, '1.587', '小六度', null],
  [9, '1.682 ≈ 5:3', '大六度', '5:3'],
  [10, '1.782', '小七度', null],
  [11, '1.888 ≈ 17:9', '大七度', '17:9'],
  [12, '2 = 2:1', '八度', '2:1'],
]

function IntervalTable({ run }: { run: Runner }) {
  return (
    <div className="mtn-widget">
      <div className="viz-label">交互 · 十二平均律 vs 简单分数（点击行：先奏 220，再奏 220×比例，感受差别）</div>
      <table className="mtn-table">
        <thead>
          <tr>
            <th>半音</th><th>频率比</th><th>名称</th><th>贴近的分数</th><th />
          </tr>
        </thead>
        <tbody>
          {INTERVALS.map(([semi, ratio, name, frac]) => (
            <tr
              key={semi}
              className="mtn-clickable"
              onClick={() =>
                run(
                  `note(220, 0, 1.4);\nnote(220 * 2 ** (${semi} / 12), 0, 1.4);`,
                )
              }
            >
              <td className="mono">{semi}</td>
              <td className="mono">{ratio}</td>
              <td>{name}</td>
              <td className="mono">{frac ? `${frac} ✓` : '—'}</td>
              <td className="mtn-td-play">▶</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="faint" style={{ fontSize: 12, margin: '8px 0 0' }}>
        带 ✓ 的七个（不算八度）分数越简单越好听——这七个音，恰好就是大调音阶。
      </p>
    </div>
  )
}

/* ---------------- 交互：调式旋转 ---------------- */

const MODE_COLS: { roman: string; root: string; pattern: [number, number, number, number, number, number, number] }[] = [
  { roman: 'I', root: 'C', pattern: [2, 2, 1, 2, 2, 2, 1] },
  { roman: 'II', root: 'D', pattern: [2, 1, 2, 2, 2, 2, 1] },
  { roman: 'III', root: 'E', pattern: [1, 2, 2, 2, 2, 1, 2] },
  { roman: 'IV', root: 'F', pattern: [2, 2, 2, 2, 1, 2, 2] },
  { roman: 'V', root: 'G', pattern: [2, 2, 2, 1, 2, 2, 2] },
  { roman: 'VI', root: 'A', pattern: [2, 1, 2, 2, 1, 2, 2] },
  { roman: 'VII', root: 'B', pattern: [1, 2, 2, 1, 2, 2, 2] },
]

// modes 网格：行 = 半音偏移，列 = 调式（原文那张著名的大表）
const MODE_GRID: (string | null)[][] = [
  // offset: I    II   III  IV   V    VI   VII
  ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
  [null, null, 'F', null, null, null, 'C'],
  ['D', 'E', null, 'G', 'A', 'B', null],
  [null, 'F', 'G', null, null, 'C', 'D'],
  ['E', null, null, 'A', 'B', null, null],
  ['F', 'G', 'A', null, 'C', 'D', 'E'],
  [null, null, null, 'B', null, null, 'F'],
  ['G', 'A', 'B', 'C', 'D', 'E', null],
  [null, null, 'C', null, null, 'F', 'G'],
  ['A', 'B', null, 'D', 'E', null, null],
  [null, 'C', 'D', null, 'F', 'G', 'A'],
  ['B', null, null, 'E', null, null, null],
  ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
]

function ModeRotator({ run }: { run: Runner }) {
  const [active, setActive] = useState(0)
  const { roman, root, pattern } = MODE_COLS[active]
  const midi = { C: 60, D: 62, E: 64, F: 65, G: 67, A: 69, B: 71 } as const
  const rootMidi = (midi as Record<string, number>)[root]
  const code = `// ${roman} 号调式（从 ${root} 开始），步长 ${pattern.join('-')}
const pattern = [${pattern.join(', ')}];
let n = ${rootMidi};
[n].concat(pattern.slice(0, -1).map((s) => (n += s))).forEach((m, i) =>
  note(440 * 2 ** ((m - 69) / 12), i * 0.24, 0.35),
);`
  return (
    <div className="mtn-widget">
      <div className="viz-label">交互 · wwhwwwh 旋转七次 = 七个教会调式（点列头试听）</div>
      <table className="mtn-table mtn-modes">
        <thead>
          <tr>
            <th>半音</th>
            {MODE_COLS.map((m, i) => (
              <th
                key={m.roman}
                className="mtn-clickable"
                style={
                  active === i
                    ? { color: 'var(--accent)', borderColor: 'var(--accent)' }
                    : undefined
                }
                onClick={() => {
                  setActive(i)
                  run(code)
                }}
              >
                {m.roman}（{m.root}）
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MODE_GRID.map((row, ri) => (
            <tr key={ri}>
              <td className="mono">{ri}</td>
              {row.map((cell, ci) => (
                <td key={ci} className={cell ? 'mtn-cell' : ''} style={
                  cell && (ci === 0 || ci === 5)
                    ? { color: 'var(--accent)', fontWeight: 700 }
                    : undefined
                }>
                  {cell ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 10 }}>
        <TryButton run={run} label={`试听 ${roman} 号调式`} code={code} />
      </div>
      <p className="faint" style={{ fontSize: 12, margin: '8px 0 0' }}>
        高亮的 I 列读出来就是 C 大调，VI 列读出来就是 A 自然小调——同一摞音、同一个 wwhwwwh 手环，只是从不同的位置开始数。
      </p>
    </div>
  )
}

/* ---------------- 交互：大小调与和弦 ---------------- */

function MajorMinorCompare({ run }: { run: Runner }) {
  return (
    <Demo title="交互 · 同一个根音，大调与小调差三个半音；大三和弦与小三和弦差一个">
      <div className="mtn-row">
        <TryButton
          run={run}
          label="C 大调音阶"
          code={`// C D E F G A B C（wwhwwwh）
[60, 62, 64, 65, 67, 69, 71, 72].forEach((m, i) =>
  note(440 * 2 ** ((m - 69) / 12), i * 0.24, 0.35),
);`}
        />
        <TryButton
          run={run}
          label="C 大三和弦 {0,4,7}"
          code={`[60, 64, 67].forEach((m) => note(440 * 2 ** ((m - 69) / 12), 0, 1.6));`}
        />
        <TryButton
          run={run}
          label="A 小三和弦 {0,3,7}"
          code={`[57, 60, 64].forEach((m) => note(440 * 2 ** ((m - 69) / 12), 0, 1.6));`}
        />
        <TryButton
          run={run}
          label="C 大 → C 小（中间音下移半音）"
          code={`[60, 64, 67].forEach((m) => note(440 * 2 ** ((m - 69) / 12), 0, 1.4));
[60, 63, 67].forEach((m) => note(440 * 2 ** ((m - 69) / 12), 1.8, 1.4));`}
        />
      </div>
      <p className="faint" style={{ fontSize: 12, margin: '8px 0 0' }}>
        C 大三和弦（C-E-G）和 A 小三和弦（A-C-E）共享 C 和 E——它们本就是同一套音的不同分组。
      </p>
    </Demo>
  )
}

/* ---------------- 交互：黑键五声音阶 ---------------- */

function BlackKeys({ run }: { run: Runner }) {
  // MIDI 61,63,66,68,70,73 = C#4 D#4 F#4 G#4 A#4 C#5
  return (
    <Demo title="交互 · 只用钢琴黑键 = 五声音阶，怎么按都不难听">
      <div className="mtn-row">
        <TryButton
          run={run}
          label="黑键五声（顺序）"
          code={`[61, 63, 66, 68, 70, 73].forEach((m, i) =>
  note(440 * 2 ** ((m - 69) / 12), i * 0.25, 0.4),
);`}
        />
        <TryButton
          run={run}
          label="黑键乱按一气"
          code={`[66, 61, 70, 63, 68, 73, 66, 70, 61, 68, 63, 66].forEach((m, i) =>
  note(440 * 2 ** ((m - 69) / 12), i * 0.2, 0.35),
);`}
        />
      </div>
      <p className="faint" style={{ fontSize: 12, margin: '8px 0 0' }}>
        任意两个音至少相距一个全音——原文作者的朋友们说，在这个音阶里「不可能弹出难听的音」。
      </p>
    </Demo>
  )
}

/* ---------------- 数据表 ---------------- */

const FREQ_TABLE = [
  ['0', '440.00 Hz', 'A'], ['1', '466.16 Hz', 'A♯/B♭'], ['2', '493.88 Hz', 'B'],
  ['3', '523.25 Hz', 'C'], ['4', '554.36 Hz', 'C♯/D♭'], ['5', '587.33 Hz', 'D'],
  ['6', '622.25 Hz', 'D♯/E♭'], ['7', '659.26 Hz', 'E'], ['8', '698.46 Hz', 'F'],
  ['9', '739.99 Hz', 'F♯/G♭'], ['10', '783.99 Hz', 'G'], ['11', '830.61 Hz', 'G♯/A♭'],
  ['12', '880.00 Hz', 'A'],
]

const MAJOR_SCALES = [
  ['A 大调', 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
  ['A# 大调', 'A#', 'C', 'D', 'D#', 'F', 'G', 'A', 'A#'],
  ['B 大调', 'B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'],
  ['C 大调', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'],
  ['C# 大调', 'C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C', 'C#'],
  ['D 大调', 'D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
  ['D# 大调', 'D#', 'F', 'G', 'G#', 'A#', 'C', 'D', 'D#'],
]

const RELATIVE_PAIRS = [
  ['A 大调', 'F# 小调', 'C# D E F# G# A B C#'],
  ['A# 大调', 'G 小调', 'C D D# F G A A# C'],
  ['B 大调', 'G# 小调', 'C# D# E F# G# A# B C#'],
  ['C 大调', 'A 小调', 'C D E F G A B C'],
  ['C# 大调', 'A# 小调', 'C# D# F F# G# A# C C#'],
  ['D 大调', 'B 小调', 'C# D E F# G A B C#'],
  ['D# 大调', 'C 小调', 'C D D# F G G# A# C'],
]

/* ---------------- 文章 ---------------- */

export default function MusicTheoryNerds() {
  const runRef = useRef<Runner | null>(null)
  if (!runRef.current) runRef.current = createRunner()
  const run = runRef.current

  const toc = [
    ['声音与波', 'n1'],
    ['音符与八度', 'n2'],
    ['西方音乐中的音程', 'n3'],
    ['音阶', 'n4'],
    ['乐谱与调号', 'n5'],
    ['关于和弦', 'n6'],
    ['结语', 'n7'],
    ['延伸阅读', 'n8'],
  ]

  return (
    <div className="mtn">
      <style>{`
.mtn { max-width: 780px; }
.mtn .mtn-para { color: var(--text-dim); margin: 0 0 1.1em; line-height: 1.8; }
.mtn .mtn-strong { color: var(--text); font-weight: 600; }
.mtn h2.mtn-h2 { font-size: 22px; margin: 44px 0 14px; padding-top: 10px; border-top: 1px solid var(--border); scroll-margin-top: 24px; }
.mtn-widget {
  background: var(--bg-elev); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px 18px; margin: 16px 0 20px;
}
.mtn-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.mtn-run {
  font-family: var(--font-mono); font-size: 12px; font-weight: 600;
  color: var(--accent); background: var(--accent-soft);
  border: 1px solid var(--accent-dim); border-radius: 999px;
  padding: 5px 14px; white-space: nowrap; transition: background var(--dur) var(--ease);
}
.mtn-run:hover { background: var(--accent); color: #0F1115; }
.mtn-chip {
  font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);
  background: var(--bg); border: 1px solid var(--border); border-radius: 6px;
  padding: 4px 8px; transition: all var(--dur) var(--ease);
}
.mtn-chip:hover { color: var(--accent); border-color: var(--accent-dim); }
.mtn-table {
  width: 100%; border-collapse: collapse; font-size: 13px;
  font-family: var(--font-mono);
}
.mtn-table th, .mtn-table td { padding: 4px 10px; text-align: left; border: none; }
.mtn-table thead th { color: var(--text-faint); font-size: 11px; border-bottom: 1px solid var(--border); }
.mtn-table tbody tr { border-bottom: 1px solid var(--border); }
.mtn-clickable { cursor: pointer; transition: background var(--dur) var(--ease); }
.mtn-clickable:hover { background: var(--accent-soft); }
.mtn-td-play { color: var(--accent); font-size: 11px; }
.mtn-modes tbody td { color: var(--text-faint); font-size: 12px; }
.mtn-modes .mtn-cell { color: var(--text-dim); font-weight: 600; }
.mtn-modes thead th { border-bottom: 1px solid var(--border); border-top: 1px solid transparent; cursor: pointer; }
.mtn-modes thead th:hover { color: var(--accent); }
.mtn-toc { display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0 8px; }
.mtn-toc a {
  font-size: 12px; color: var(--text-dim); border: 1px solid var(--border);
  border-radius: 999px; padding: 3px 11px; transition: all var(--dur) var(--ease);
}
.mtn-toc a:hover { color: var(--accent); border-color: var(--accent-dim); }
.mtn-meta { font-size: 13px; color: var(--text-faint); }
.mtn-note {
  border-left: 3px solid var(--accent); background: var(--accent-soft);
  padding: 10px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text); font-size: 14px; margin: 18px 0;
}
.mtn-pre {
  font-family: var(--font-mono); font-size: 12.5px; line-height: 1.75;
  background: #0c0e12; border: 1px solid var(--border); border-radius: var(--radius-sm);
  padding: 10px 14px; overflow-x: auto; color: var(--text-dim);
  white-space: pre; margin: 14px 0 18px;
}
.mtn-scaletbl { width: auto; }
.mtn-scaletbl td:first-child { color: var(--text-faint); white-space: nowrap; }
.mtn-reading { list-style: none; padding: 0; margin: 14px 0 18px; display: flex; flex-direction: column; gap: 12px; }
.mtn-reading li { border-left: 2px solid var(--border); padding-left: 14px; line-height: 1.7; }
.mtn-reading a { color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent); }
.mtn-reading a:hover { border-bottom-style: solid; }
.mtn-reading-desc { color: var(--text-faint); display: block; font-size: 13px; margin-top: 2px; }
      `}</style>

      <header>
        <h1>给极客的乐理课</h1>
        <p className="mtn-meta">
          编译自 Eevee · 2016 年 9 月 15 日 · 原文{' '}
          <a
            href="https://eev.ee/blog/2016/09/15/music-theory-for-nerds/"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent)' }}
          >
            eev.ee/blog/2016/09/15/music-theory-for-nerds
          </a>{' '}
          · 中文编译版（保留全部数据表与推导脉络，并配交互试听）
        </p>
        <p className="mtn-meta">
          原作者的自我定位是「只上过二年级竖笛课、学会吹四个音的人」。这篇 2016 年的博文流传很广，因为它做了一件正经乐理教材很少做的事：完全不用乐理黑话，只用频率、比例和一点乘方，把西方乐理的骨架推一遍。点击文中任何按钮即可用 Web Audio API 直接听到对应的例子。
        </p>
        <nav className="mtn-toc">
          {toc.map(([label, id]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>
      </header>

      <p className="mtn-para">
        原文开篇是一连串坦白：作者不会音乐，只知道音名是字母、字母有时带升降号，知道八度是频率翻倍，知道四样和弦能写一首流行歌——仅此而已。剩下的部分在ta看来一直完全是任意的：为什么十二个音只用七个字母表示？调号是从哪来的？为什么维基百科的乐理条目不通读全部其他条目就读不懂？
      </p>
      <p className="mtn-para">
        后来有一天这些东西终于「咔哒」一声对上了。作者意识到问题出在：所有人解释音乐用的都是乐谱，而乐谱本身在你不知道它为什么长这样之前毫无道理可言。这篇文章就是从零开始、用波和数学重新推导的结果。
      </p>

      {/* ============ 1 ============ */}
      <h2 className="mtn-h2" id="n1">声音与波</h2>
      <p className="mtn-para">
        音乐是一种声音，声音是一种压力波。
      </p>
      <p className="mtn-para">
        想象敲鼓：鼓皮有弹性，敲下去时先向内凹陷，再向外弹回，再向内，如此往复直到能量耗尽。盯着鼓皮中心一个点看，它的运动轨迹和拎起弹簧顶部后松手的下端一模一样。鼓皮向外弹时推开空气，被推的空气再推前面的空气，形成一圈 3D 涟漪向外扩散；鼓皮向内收时留下近似真空，周围空气涌来填补，又留下新的低压……最终每个空气分子都在原地附近来回漂移，像鼓皮、像弹簧。
      </p>
      <p className="mtn-para">
        这列压力波最终抵达你的耳膜，耳膜以和鼓皮完全相同的方式振动，你把它理解为音乐——或者噪音，取决于你的口味。
      </p>
      <p className="mtn-para">
        把它画成图就是一条随时间变化的曲线：时间从零向右增长，曲线是介质偏离原位的距离。完全的寂静是一条贴着零的直线。你听到的一切声音都是这样一条曲线，仅此而已——在 Audacity 里把一首歌放大到足够细，看到的就是一条（更复杂的）波。
      </p>
      <p className="mtn-para">
        波由三样东西定义：<span className="mtn-strong">频率</span>、<span className="mtn-strong">振幅</span>、<span className="mtn-strong">波形</span>。波形决定了你听到的是吉他还是小提琴——音乐家称之为<strong>音色（timbre）</strong>。
      </p>
      <p className="mtn-para">
        <strong>振幅</strong>是波的最高点与最低点之间的距离（也有人取最高点到零的一半）。振幅决定音量：物理上它就是介质最远挪了多远——轻敲鼓，鼓皮只动一点点，声音很小；猛敲，动得大，声音就响。
      </p>
      <p className="mtn-para">
        <strong>频率</strong>字面上就是波的「频繁程度」：每个波越窄，频率越高。音乐家称之为<strong>音高（pitch）</strong>。频率以 Hz（赫兹）计量，就是「每秒多少次」的意思：半个钟摆周期从一个波的同相位点走到下一个波的同一位置，就是 2 Hz。上面那个示例音是 440 Hz。
      </p>
      <div className="mtn-note">
        人耳有一条贯穿全部乐理的关键性质：<span className="mtn-strong">频率翻倍或减半，听起来是某种意义上的「同一个音」</span>。明明变高了或变低了，但「感觉」非常相似。可以猜到物理原因（泛音重叠），但不妨先把它当作一条任意公理接受下来。
      </div>
      <OctaveCompare run={run} />
      <p className="mtn-para">
        原文在此处放了三段录音：440 Hz、660 Hz（1.5×）和 880 Hz（2×）。第一个和第三个的亲缘感远强于第二个与任何一个——尽管按「距离」算 660 离 880 和离 440 一样远。
      </p>

      {/* ============ 2 ============ */}
      <h2 className="mtn-h2" id="n2">音符与八度</h2>
      <p className="mtn-para">
        音乐的麻烦在于：一半是任意的约定，一半真有物理依据，而你光看表面分不出哪半是哪半。
      </p>
      <p className="mtn-para">
        从耳朵那条公理出发：频率翻倍听起来「相同」。那么对任意起始频率 f，可以生成无穷多个「相同」的音：½f、2f、¼f、4f……（当然只有一部分落在人耳听觉范围内。）这一组频率共享某种公共性质，把它们合起来称为一个<strong>音符（note）</strong>。
      </p>
      <p className="mtn-para">
        说 440 Hz 产生叫「A」的音，那么 880、220、1760、110 Hz……也都叫 A。一个直接推论：<span className="mtn-strong">所有互不相同的音符都必然落在 440 到 880 Hz 之间</span>——任何别的音高都可以翻倍/减半折进这个区间。这样一个区间叫<strong>八度（octave）</strong>，每个音符在任一八度内恰好出现一次。
      </p>
      <p className="mtn-para">
        这是好消息：只需在一个小区间（形如 f 到 2f）里选好音高，翻倍减半就能铺满整个人耳听觉范围。那么，怎么选？
      </p>
      <p className="mtn-para">
        天真的方案：从 f 到 2f 等差切分，取 f、1.1f、1.2f、1.3f……均匀分布，区分度最大。但行不通——f 到 1.1f 的差距几乎是 1.9f 到 2f 的两倍。人耳按<strong>比例</strong>分辨音高：前者是 10% 的提升，后者只有 5%。
      </p>
      <p className="mtn-para">需要的是<strong>等比</strong>而非等差的一组音高。要 n 个音，就需要一个数，自乘 n 次能从 f 走到 2f：</p>
      <pre className="mtn-pre">f × x × x × … × x = 2f
xⁿ = 2
x = ⁿ√2</pre>
      <p className="mtn-para">
        答案是 2 的 n 次方根——一个保证无理数（n &gt; 1 时）的别扭数字。
      </p>

      {/* ============ 3 ============ */}
      <h2 className="mtn-h2" id="n3">西方音乐中的音程</h2>
      <p className="mtn-para">
        西方音乐有十二个不同的音高。这有点任意——十二有不错的数学性质，但绝非唯一选择。你可以造一套十一个音、十七个、一百个或五个音的音符系统，世界上其他地方的音乐确实有这么做 的。
      </p>
      <p className="mtn-para">
        所以西方音乐相邻音高之比是 2 的 12 次方根，¹²√2 ≈ 1.0594631。从 440 Hz 出发不断乘它，到 880 Hz 之前恰好经过十二个音高：
      </p>
      <SemitoneWalk run={run} />
      <p className="mtn-para">
        没人真的愿意跟这些数字打交道——这套系统发明时也没人知道这些数字是多少。音乐实际上是用<strong>比例</strong>定义的：两个音高之比叫<strong>音程（interval）</strong>，一个 ¹²√2 的音程叫<strong>半音（semitone）</strong>。这样所有可怕的无理数都被赶走，可以几乎只用整数交谈。
      </p>
      <div className="mtn-note">
        （这里真正发生的事是：我们在<strong>对数尺度</strong>上工作。对数听起来吓人，但意思只是——我们说「加」的时候，指「乘」。）
      </div>
      <p className="mtn-para">
        现在回到耳朵的偏好：它特别喜欢<strong>小整数比</strong>。频率翻倍之所以听起来相似，正因为它是 2:1——能拿到的最小、最整的比。¹²√2 虽然无理，却凑巧近似制造出好几个漂亮的比例（作者也不知道为什么偏偏是十二有这效果，但这大概就是西方音乐选中十二的原因）。下表是十二个音相对第一个音的频率比，有几个非常接近简单分数：
      </p>
      <IntervalTable run={run} />
      <p className="mtn-para">
        不算八度，这里有<span className="mtn-strong">七个</span>相当好的分数。
      </p>
      <p className="mtn-para">
        嗯。七。好显眼的数字。
      </p>

      {/* ============ 4 ============ */}
      <h2 className="mtn-h2" id="n4">音阶</h2>
      <p className="mtn-para">
        惊喜：那七个好分数，组成了<strong>大调音阶</strong>。从 C 开始就是 C 大调音阶——那些「自然音」。用 ♯ 表示升半音、♭ 表示降半音，可以给十二个音全部命名：
      </p>
      <table className="mtn-table mtn-scaletbl">
        <thead>
          <tr><th>半音</th><th>频率比</th><th>音名</th><th>名称</th></tr>
        </thead>
        <tbody>
          {[
            ['0', '1.000 = 1:1', 'C', '同度'], ['1', '1.059', 'C♯ 或 D♭', '半音；小二度'],
            ['2', '1.122 ≈ 9:8', 'D', '全音；大二度'], ['3', '1.189', 'D♯ 或 E♭', '小三度'],
            ['4', '1.260 ≈ 5:4', 'E', '大三度'], ['5', '1.335 ≈ 4:3', 'F', '纯四度'],
            ['6', '1.414', 'F♯ 或 G♭', '（三全音）'], ['7', '1.498 ≈ 3:2', 'G', '纯五度'],
            ['8', '1.587', 'G♯ 或 A♭', '小六度'], ['9', '1.682 ≈ 5:3', 'A', '大六度'],
            ['10', '1.782', 'A♯ 或 B♭', '小七度'], ['11', '1.888 ≈ 17:9', 'B', '大七度'],
            ['12', '2 = 2:1', 'C', '八度'],
          ].map(([semi, ratio, name, label]) => (
            <tr key={semi}>
              <td className="mono">{semi}</td><td className="mono">{ratio}</td>
              <td style={{ fontWeight: 600 }}>{name}</td><td>{label}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mtn-para">
        现代音名约定从哪来的作者不敢确定，但ta「不会感到意外」——如果就是从这张表来的。
      </p>
      <p className="mtn-para">
        音程命名的由来也清楚了：<strong>纯五度</strong>是音阶第一个音到第五个音的距离；<strong>八度</strong>跨八个音；最小的音程叫半音，因为多数相邻音隔两步，那两步的距离就成了「全音」。
      </p>
      <p className="mtn-para">
        相邻音的间距可以写成 <span className="mono">wwhwwwh</span>（w = 全音，h = 半音）。八度是循环的，所以这个序列转着圈读可以读出七种变体，取决于从哪开始。得到的音阶统称<strong>自然音阶（diatonic scales）</strong>，起点选择叫<strong>调式（mode）</strong>。下面是全部七种，列首用罗马数字标注；每一列的起始音被特意选过，使得整列都是「自然音」：
      </p>
      <ModeRotator run={run} />
      <p className="mtn-para">
        上表高亮了两列：I 列给出<strong>大调</strong>，VI 列给出<strong>自然小调</strong>。其余音程名称由此解释：小三是小调里第一个音到第三个音的跨度，大三大调同理；四度五度两调相同（二度其实也相同，所以作者也不知道「小二度」这名字哪来的）。
      </p>
      <p className="mtn-para">
        只要有同样的间距模式，从任何音出发都能构造大调或小调音阶。十二个音一共能产出二十四个大小调，全画出来会是一张巨大而无聊的图，下面是几个大调：
      </p>
      <table className="mtn-table mtn-scaletbl">
        <tbody>
          {MAJOR_SCALES.map(([name, ...notes]) => (
            <tr key={name}>
              <td>{name}</td>
              {notes.map((n, i) => (
                <td key={i} style={{ whiteSpace: 'pre', color: n.endsWith('#') ? 'var(--accent)' : undefined }}>{n.padEnd(3)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mtn-para">
        把这些大调旋转到从 C 开始，再放一组同样写法的小调：
      </p>
      <table className="mtn-table mtn-scaletbl">
        <thead>
          <tr><th>大调</th><th>等价小调</th><th>同一摞音（从 C 排）</th></tr>
        </thead>
        <tbody>
          {RELATIVE_PAIRS.map(([major, minor, notes]) => (
            <tr key={major}>
              <td>{major}</td><td>{minor}</td><td className="mono" style={{ whiteSpace: 'pre' }}>{notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mtn-para">
        嗯——由于八度回绕，<span className="mtn-strong">每个大调都等价于从它的倒数第二个音（第六级）开始的小调</span>。它们互称<strong>关系大小调（relative major/minor）</strong>。既然音符完全一样，为什么还要区分 C 大调和 A 小调？后面回答。
      </p>
      <MajorMinorCompare run={run} />

      {/* ============ 5 ============ */}
      <h2 className="mtn-h2" id="n5">乐谱与调号</h2>
      <p className="mtn-para">
        如果你了解五线谱，你可能已经注意到：谱上没有写升号降号音的位置。如果你不了解五线谱——嗯，谱上确实没有那些位置。
      </p>
      <p className="mtn-para">
        要写其他音，就把它们放在同一根线/间上，旁边加 ♯ 或 ♭。D 大调含 F♯ 和 C♯，谱上就写成 F 和 C，外加散落各处的 ♯。这样很麻烦，于是改用<strong>调号（key signature）</strong>：开头一次写好几个 ♯ 或 ♭ 在特定位置，此后凡是裸音符都自动算升/降。
      </p>
      <p className="mtn-para">
        方便吗？如果你的曲子主要用一个音阶的七个音，谱面只留七个位置、必要时调整含义，确实更紧凑……吧？但音高之间的关系被完全遮蔽了——光看谱面根本说不出这是什么调，只能靠背。上例里有 C 和 F 的升号，这凭什么告诉你「D 大调」？
      </p>
      <p className="mtn-para">
        作者提这茬其实是为了讲记谱法的一个别扭之处。再看 C♯ 大调：
      </p>
      <pre className="mtn-pre">C# 大调:   C#      D#      F   F#      G#      A#      C   C#</pre>
      <p className="mtn-para">
        两对音用了同一个字母——C 和 C♯、F 和 F♯——它们在五线谱上会挤在同一个位置，前面那套方案就崩了。
      </p>
      <p className="mtn-para">
        解决办法是「捏造」音名：C 比 B 高半音，也可以写作 B♯；F 比 E 高半音，也可以写作 E♯。C♯ 大调实际这样写：
      </p>
      <pre className="mtn-pre">C# 大调:   C#      D#     (E#) F#      G#      A#     (B#) C#</pre>
      <p className="mtn-para">
        现在七个字母恰好各用一次。作者承认自己没有完全理解这套设计：你脑子里得先把 C 翻译成 C♯，再把 C♯ 翻译成乐器上实际的演奏——图什么呢？唯一想得出的理由还是「紧凑」：每八度表达七个音而不是十二个。
      </p>

      {/* ============ 6 ============ */}
      <h2 className="mtn-h2" id="n6">关于和弦</h2>
      <p className="mtn-para">
        大小调成对出现、音符完全相同，那要两个都干嘛？更麻烦的是它们连调号都一样，凭什么断言一首曲子「是」C 大调「而不是」A 小调？
      </p>
      <p className="mtn-para">
        很多人用「情绪不同」「感觉不同」来解释，但那只是把问题挪了个位置。作者收集到的真正答案有两层。
      </p>
      <p className="mtn-para">
        <span className="mtn-strong">其一：音乐是针对「调」写的，而调不只是音阶，还包括常用和弦等一整套东西。</span>和弦是多个音一起（或几乎一起）发声。可构造的和弦很多，最大的两个玩家是大三和弦和小三和弦：取音阶的第一、三、五个音。C 大三和弦（记作「C」，有点混淆）由 C、E、G 组成；A 小三和弦（记作「Am」）由 A、C、E 组成。
      </p>
      <p className="mtn-para">
        用半音说：大三和弦 = 根音、根音上方 4 半音、根音上方 7 半音，即 <span className="mono">{'{0, 4, 7}'}</span>；小三和弦 = <span className="mono">{'{0, 3, 7}'}</span>。两者的首尾音都相距七半音——纯五度，那个约 3:2 的漂亮比例。同根音的大小和弦听感相似，但小三和弦中间的音低一点，常显得更「戏剧化」或「忧郁」。
      </p>
      <p className="mtn-para">
        顺带一提，同一起始音的大调和小调音阶也非常像——只有三个音在大调里高半音：
      </p>
      <pre className="mtn-pre">C 大调:    C    D    E  F    G    A    B  C
C 小调:    C    D    D#     F    G    G#   A#     C</pre>
      <p className="mtn-para">
        每个大小调音阶都能这样长出七个和弦（取决于从哪级开始）；C 大调的第二级和弦是 D-F-A，即 D 小三和弦——和 D 小调音阶的第一个和弦一模一样。和弦常用罗马数字标记：大写大、小写小。大调音阶的七个和弦是 I、ii、iii、IV、V、vi、vii；小调是 i、ii、III、iv、v、VI、VII。「I」就是「从第一个音上建的和弦」。这让你能抛开具体调、只谈<strong>和弦进行</strong>。
      </p>
      <p className="mtn-para">
        <span className="mtn-strong">其二：纯粹是惯例。</span>西方音乐按某些约定写作，熟稔约定的人能认出用了哪个。C 大调的曲子常以 C 或 C 大三和弦开头/收尾；A 小调的常以 A 或 Am 开头/收尾。就作者所能判断的而言，两套音符本身没有任何本质区别，这些约定也没有硬性约束力。遵守约定好处和任何惯例一样：同行能看懂你。比如「转调」只有在能确指原调时才有意义。
      </p>
      <p className="mtn-para">
        所有这些约定都有无数变体，彼此混乱地重叠、给同一个东西起了多个互相打架的名字——因为它们描述的是人类的意图，不是客观的波形。和声小调把小调第七个音抬半音；旋律小调只在「上行」时调整几个音；增和弦把最高音抬半音，减和弦降半音……
      </p>
      <p className="mtn-para">
        <strong>五度圈</strong>是把这些大小调摆成一圈的图：按「每次走七半音」的顺序（C→G→D→……）命名排列，每个调恰好只含升号或只含降号，且个数各不相同。至于为什么这么凑巧，作者猜有个模算术的解释，但ta不会。
      </p>
      <p className="mtn-para">
        还有一个漂亮的收尾：整数比好听，大概是因为<strong>叠加后的波每隔一段就对齐一次</strong>。一个纯五度（A4 + E5，用不那么纯的 ¹²√2 算出来）相加，因为接近 3:2，会得到一组每六个周期重复一次的合成波——它本身又像一个波。
      </p>
      <p className="mtn-para">
        （A4 是第 4 个八度里的 A。第 4 八度从中央 C 开始，这些编号按钢琴布局命名；调音的常用参照是把 A4 定为 440 Hz。）
      </p>
      <p className="mtn-para">
        最后，「同名」的音也未必是同一个音——取决于乐器怎么调律；有些律制让某些和弦精确成整数比而非近似。比 E♯ 更「假」的音也存在，比如 G𝄪（「G 重升」），作者表示这玩意儿ta更愿意叫「A」。
      </p>

      {/* ============ 7 ============ */}
      <h2 className="mtn-h2" id="n7">结语</h2>
      <p className="mtn-para">
        原文的结语吐槽毫不留情：这大概是世上最烂的一套术语和记谱法。作者研究这些只是因为想写点曲子，而完全不懂一个学科时寸步难行——搞懂之后至少不再悬着。
      </p>
      <p className="mtn-para">
        结论是：<span className="mtn-strong">凡是不能纯粹用数学和波形表达的东西，基本是任意的。</span>十二个音里随便挑一摞就能做音乐。有人指出只用钢琴黑键得到五声音阶，怎么弹都不会难听——因为任意两音至少相距一个全音：
      </p>
      <BlackKeys run={run} />
      <p className="mtn-para">
        你也可以用这十二个音之外的音高，很多爵士、非西方音乐正是如此。把整个和弦/调的体系当成一套「规则」，就像研究文艺复兴绘画然后宣布「艺术就长这样」——不是的。想干嘛干嘛，好听就行。共识似乎是：音乐的真正核心是经营<strong>对比</strong>——和其他所有艺术形式一样。
      </p>
      {/* ============ 8 ============ */}
      <h2 className="mtn-h2" id="n8">延伸阅读</h2>
      <p className="mtn-para">
        如果你还没打算就此抛弃整个西方音乐传统，下面是作者在 Twitter 上实时研究这些内容时，大家推荐给ta的一批资料（中文名为编译者所加，均指向原文给出的链接）：
      </p>
      <ul className="mtn-reading">
        <li>
          <a href="https://web.archive.org/web/20160722080401/http://math.ucr.edu/home/baez/week234.html" target="_blank" rel="noreferrer">
            《本周数学物理新发现》（This Week's Finds in Mathematical Physics）
          </a>
          <span className="mtn-reading-desc">—— John Baez 著，从群论视角谈音阶与和声</span>
        </li>
        <li>
          <a href="http://tobyfox.net/Tutorials/musicdef.html" target="_blank" rel="noreferrer">
            《音乐》教程（Music）
          </a>
          <span className="mtn-reading-desc">—— Toby Fox（《Undertale》的作曲者兼作者本人）写的短文，主要罗列作曲时的种种考量</span>
        </li>
        <li>
          <a href="https://www.amazon.com/Musimathics-Mathematical-Foundations-Music-Press/dp/0262516551" target="_blank" rel="noreferrer">
            《音乐数学：音乐的数学基础》（Musimathics: The Mathematical Foundations of Music）
          </a>
          <span className="mtn-reading-desc">—— 好几个人都推荐的书（33 美元），作者自己还没买</span>
        </li>
        <li>
          <a href="http://howmusicreallyworks.com/" target="_blank" rel="noreferrer">
            《音乐到底是怎么回事》（How Music Really Works）
          </a>
          <span className="mtn-reading-desc">—— 开篇就夸口全书不用乐谱记号，前六章免费；书评说对作曲尤其有帮助</span>
        </li>
        <li>
          <a href="http://andrewduncan.net/cmt/" target="_blank" rel="noreferrer">
            《组合乐理》（Combinatorial Music Theory）
          </a>
          <span className="mtn-reading-desc">—— 像是一个忘了怎么不用重数学记号讲东西的数学家写的乐理</span>
        </li>
        <li>
          <a href="https://www.amazon.com/Geometry-Musical-Rhythm-What-Makes/dp/1466512024" target="_blank" rel="noreferrer">
            《音乐节奏的几何学：什么让节奏「好」？》（The Geometry of Musical Rhythm: What Makes a 'Good' Rhythm Good?）
          </a>
          <span className="mtn-reading-desc">—— 书名基本把内容交代完了</span>
        </li>
        <li>
          <a href="http://music.stackexchange.com/questions/43095/tonality-and-rules/43108#43108" target="_blank" rel="noreferrer">
            Music Stack Exchange 上的一个回答
          </a>
          <span className="mtn-reading-desc">—— 谈到理解「乐理为什么长这样」的各种尝试</span>
        </li>
        <li>
          <a href="https://www.amazon.com/dp/0195336674/" target="_blank" rel="noreferrer">
            《音乐的几何学》（A Geometry of Music）
          </a>
          <span className="mtn-reading-desc">—— 上面的 Stack Exchange 回答推荐的入门首选</span>
        </li>
      </ul>
      <p className="mtn-para">
        有趣的是：上一篇《程序员的乐理课》（Luke Haas, 2026）的作者，正是在这篇文章的启发下动笔的——你在展柜里看到的两篇长文，是一根传了十年的接力棒。
      </p>
    </div>
  )
}
