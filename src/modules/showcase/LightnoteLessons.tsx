import { useEffect, useRef, useState } from 'react'

/* ============================================================
 * 《音乐是怎么运作的》交互课 —— 编译自 Lightnote（lightnote.co）
 * 原站是 7 节交互式微课（How Music Works）。
 * 本页按同样的概念脉络用中文重述：声音 → 和声 → 五声音阶 →
 * 半音阶 → 和弦 → 调 → 调内和弦；全部交互组件为自研实现
 * （Web Audio API + Canvas 波形可视化）。
 * ============================================================ */

/* ---------------- 音频工具 ---------------- */

let sharedCtx: AudioContext | null = null
function getCtx(): AudioContext {
  if (!sharedCtx) sharedCtx = new AudioContext()
  if (sharedCtx.state === 'suspended') void sharedCtx.resume()
  return sharedCtx
}

function tone(
  freq: number,
  start = 0,
  dur = 0.6,
  vol = 0.22,
  type: OscillatorType = 'sine',
) {
  const ac = getCtx()
  const t = ac.currentTime + start
  const osc = ac.createOscillator()
  const env = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  env.gain.setValueAtTime(0, t)
  env.gain.linearRampToValueAtTime(vol, t + 0.02)
  env.gain.setValueAtTime(vol, t + dur - 0.05)
  env.gain.exponentialRampToValueAtTime(0.001, t + dur)
  osc.connect(env).connect(ac.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

function chordPlay(freqs: number[], dur = 1.4, vol = 0.16) {
  freqs.forEach((f) => tone(f, 0, dur, vol))
}

function seqPlay(freqs: number[], step = 0.38, dur = 0.36) {
  freqs.forEach((f, i) => tone(f, i * step, dur))
}

/* 半音阶：C4 起，index 0..12 */
const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B']
const C4 = 261.63
const freqOf = (semi: number) => C4 * Math.pow(2, semi / 12)

/* 大调 / 小调音阶的半音步距 */
const MAJOR_STEPS = [0, 2, 4, 5, 7, 9, 11]
const MINOR_STEPS = [0, 2, 3, 5, 7, 8, 10]

/* ============================================================
 * 第 1 课：声音是什么 —— 可调波形
 * ============================================================ */

function WaveLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [amp, setAmp] = useState(0.7)
  const [pitch, setPitch] = useState(2) // 显示用周期密度
  const phaseRef = useRef(0)

  useEffect(() => {
    let raf = 0
    const draw = () => {
      const cv = canvasRef.current
      if (cv) {
        const dpr = window.devicePixelRatio || 1
        const w = cv.clientWidth
        const h = cv.clientHeight
        if (cv.width !== w * dpr || cv.height !== h * dpr) {
          cv.width = w * dpr
          cv.height = h * dpr
        }
        const g = cv.getContext('2d')!
        g.setTransform(dpr, 0, 0, dpr, 0, 0)
        g.clearRect(0, 0, w, h)
        // 零线
        g.strokeStyle = 'rgba(156,163,178,0.25)'
        g.beginPath()
        g.moveTo(0, h / 2)
        g.lineTo(w, h / 2)
        g.stroke()
        // 波
        g.strokeStyle = '#F5A623'
        g.lineWidth = 2
        g.beginPath()
        for (let x = 0; x <= w; x++) {
          const cycles = pitch * (x / w) * Math.PI * 2 + phaseRef.current
          const y = h / 2 - Math.sin(cycles) * (h / 2 - 6) * amp
          x === 0 ? g.moveTo(x, y) : g.lineTo(x, y)
        }
        g.stroke()
      }
      phaseRef.current += 0.12
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [amp, pitch])

  return (
    <div className="ln-widget">
      <div className="viz-label">交互 · 一条会动的波：拖动滑块看「音量」和「音高」分别改的是什么</div>
      <canvas ref={canvasRef} className="ln-canvas" />
      <div className="ln-slider-row">
        <label>
          振幅（音量）{Math.round(amp * 100)}%
          <input
            type="range" min={0.05} max={1} step={0.01} value={amp}
            onChange={(e) => setAmp(Number(e.target.value))}
          />
        </label>
        <label>
          频率（音高）{(pitch * 110).toFixed(0)} Hz
          <input
            type="range" min={0.5} max={6} step={0.05} value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
          />
        </label>
        <button className="ln-btn" onClick={() => tone(pitch * 110, 0, 0.9, 0.2)}>
          ▶ 试听当前波形
        </button>
      </div>
      <p className="ln-faint">
        振幅只是把波「拉高拉矮」，频率只是把波「压密拉疏」——声音的全部秘密都藏在这条曲线的形状里。
      </p>
    </div>
  )
}

/* ============================================================
 * 第 2 课：和声 —— 猜哪对好听
 * ============================================================ */

const HARMONY_OPTIONS = [
  { id: 'a', label: '波 1', partner: 300, ratio: '3 : 2', nice: true },
  { id: 'b', label: '波 2', partner: 250, ratio: '5 : 4', nice: true },
  { id: 'c', label: '波 3', partner: 282.8, ratio: '√2 : 1（无理数）', nice: false },
] as const

function HarmonyQuiz() {
  const [picked, setPicked] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)

  const sumCanvas = (f2: number) => {
    // 静态合成波：200Hz 与 f2 相加，画 0.06s
    const w = 280
    const h = 60
    const n = 200
    const pts: string[] = []
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 0.06
      const y = h / 2 - (Math.sin(2 * Math.PI * 200 * t) + Math.sin(2 * Math.PI * f2 * t)) * (h / 8)
      pts.push(`${(i / n) * w},${y.toFixed(1)}`)
    }
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="ln-sumsvg" aria-hidden>
        <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="rgba(156,163,178,0.25)" />
        <polyline points={pts.join(' ')} fill="none" stroke="#F5A623" strokeWidth="1.5" />
      </svg>
    )
  }

  return (
    <div className="ln-widget">
      <div className="viz-label">交互 · 猜一猜：200 Hz 和下面哪个频率放在一起会好听？</div>
      <div className="ln-row">
        {HARMONY_OPTIONS.map((o) => (
          <button
            key={o.id}
            className="ln-btn"
            style={
              revealed
                ? o.nice
                  ? { borderColor: 'var(--ok)', color: 'var(--ok)' }
                  : { borderColor: 'var(--bad)', color: 'var(--bad)' }
                : picked === o.id
                  ? { borderColor: 'var(--accent)' }
                  : undefined
            }
            onClick={() => {
              setPicked(o.id)
              tone(200, 0, 1.6, 0.14)
              tone(o.partner, 0, 1.6, 0.14)
            }}
          >
            {o.label}（{o.partner.toFixed(0)} Hz）
          </button>
        ))}
      </div>
      {picked && (
        <div className="ln-answer">
          {sumCanvas(HARMONY_OPTIONS.find((o) => o.id === picked)!.partner)}
          <div>
            {revealed ? (
              <>
                频率比 <strong>{HARMONY_OPTIONS.find((o) => o.id === picked)!.ratio}</strong>
                {HARMONY_OPTIONS.find((o) => o.id === picked)!.nice
                  ? ' —— 简单整数比，两个波的叠加每隔固定时间就完全对齐一次，听起来协和。'
                  : ' —— 无理数比，两条波永远无法对齐，合成波没有可辨认的重复模式，听起来刺耳。'}
              </>
            ) : (
              '先听完三个选项，再点下方按钮揭晓答案。'
            )}
          </div>
        </div>
      )}
      <button className="ln-btn ln-btn-ghost" onClick={() => setRevealed(true)}>
        显示答案
      </button>
      <p className="ln-faint">
        关键洞察：耳朵喜欢的是<strong>频率之间的简单比例</strong>，而不是频率本身的绝对数值。
      </p>
    </div>
  )
}

/* ============================================================
 * 第 3 课：五声音阶
 * ============================================================ */

const PENTA = [
  { n: 1, ratio: '1 : 1', freq: 200 },
  { n: 2, ratio: '9 : 8', freq: 225 },
  { n: 3, ratio: '5 : 4', freq: 250 },
  { n: 4, ratio: '3 : 2', freq: 300 },
  { n: 5, ratio: '5 : 3', freq: 333.3 },
] as const

function PentatonicLab() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <div className="ln-widget">
      <div className="viz-label">交互 · 五个音，怎么点都不难听（点击圆点试听）</div>
      <div className="ln-circles">
        {PENTA.map((p) => (
          <button
            key={p.n}
            className="ln-circle"
            style={active === p.n ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : undefined}
            onClick={() => {
              setActive(p.n)
              tone(p.freq, 0, 0.7)
            }}
            title={`${p.freq} Hz · 与第 1 音比例 ${p.ratio}`}
          >
            <span className="ln-circle-n">{p.n}</span>
            <span className="ln-circle-r">{p.ratio}</span>
          </button>
        ))}
        <button
          className="ln-circle ln-circle-oct"
          style={active === 0 ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)' } : undefined}
          onClick={() => {
            setActive(0)
            tone(400, 0, 0.7)
          }}
          title="400 Hz · 2:1 八度"
        >
          <span className="ln-circle-n">1′</span>
          <span className="ln-circle-r">2 : 1</span>
        </button>
      </div>
      <div className="ln-row" style={{ marginTop: 12 }}>
        {PENTA.slice(1).map((p) => (
          <button
            key={p.n}
            className="ln-btn ln-btn-ghost"
            onClick={() => {
              tone(200, 0, 1.4, 0.13)
              tone(p.freq, 0, 1.4, 0.13)
            }}
          >
            ▶ 200 Hz + {p.freq.toFixed(0)} Hz（{p.ratio}）
          </button>
        ))}
        <button
          className="ln-btn ln-btn-ghost"
          onClick={() => {
            tone(200, 0, 1.4, 0.13)
            tone(400, 0, 1.4, 0.13)
          }}
        >
          ▶ 200 Hz + 400 Hz（八度）
        </button>
      </div>
      <p className="ln-faint">
        比例越简单越协和：3:2、5:4、5:3 都悦耳；9:8 稍「紧」一点；2:1 则完全是「同一个音」的另一个高度。
        把 1′ 也算进来，五个音随便组合都能成曲——这就是五声音阶「不会错」的原因。
      </p>
    </div>
  )
}

/* ============================================================
 * 第 4 课：半音阶 + 钢琴对照 + 移调
 * ============================================================ */

function ChromaticLab() {
  const [lit, setLit] = useState<number | null>(null)
  const MELODY = [0, 4, 7, 12]

  return (
    <div className="ln-widget">
      <div className="viz-label">交互 · 十二个等距的音（点击试听）</div>
      <div className="ln-chrom">
        {[...Array(13)].map((_, i) => (
          <button
            key={i}
            className="ln-chrom-btn"
            style={lit === i ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent)' } : undefined}
            onClick={() => {
              setLit(i)
              tone(freqOf(i), 0, 0.6)
            }}
          >
            <span className="ln-chrom-n">{i === 12 ? 1 : i + 1}</span>
            <span className="ln-chrom-name">{NOTE_NAMES[i % 12]}</span>
          </button>
        ))}
      </div>
      <p className="ln-faint" style={{ marginTop: 10 }}>
        相邻两音的频率比完全相同（2<sup>1/12</sup>），这叫<strong>十二平均律</strong>。
        五声音阶的 1、2、3、5、6 号位被完整保留，其余七个音填进空隙。
      </p>
      <div className="viz-label" style={{ marginTop: 14 }}>
        交互 · 平均律的好处：同一段旋律从任何音开始都成立（点击移调试听）
      </div>
      <div className="ln-row">
        <button
          className="ln-btn"
          onClick={() => seqPlay(MELODY.map((s) => freqOf(s)))}
        >
          ▶ 从 C 开始：C–E–G–C
        </button>
        <button
          className="ln-btn"
          onClick={() => seqPlay(MELODY.map((s) => freqOf(s + 5)))}
        >
          ▶ 从 F 开始：F–A–C–F
        </button>
        <button
          className="ln-btn"
          onClick={() => seqPlay(MELODY.map((s) => freqOf(s + 9)))}
        >
          ▶ 从 A 开始：A–C♯–E–A
        </button>
      </div>
      <p className="ln-faint">
        三个版本「味道」一样——因为音与音之间的比例没有变，只是整体搬家。这就是移调（transposition）。
      </p>
    </div>
  )
}

/* ============================================================
 * 第 5 课：和弦构造器
 * ============================================================ */

function ChordLab() {
  const [root, setRoot] = useState(0)
  const [quality, setQuality] = useState<'major' | 'minor'>('major')

  const steps = quality === 'major' ? [0, 4, 7] : [0, 3, 7]
  const freqs = steps.map((s) => freqOf(root + s))
  const name = `${NOTE_NAMES[root]} ${quality === 'major' ? '大' : '小'}三和弦`

  return (
    <div className="ln-widget">
      <div className="viz-label">交互 · 选一个根音，看看大三 / 小三和弦是怎么「数」出来的</div>
      <div className="ln-chrom">
        {[...Array(12)].map((_, i) => (
          <button
            key={i}
            className="ln-chrom-btn"
            style={
              steps.includes(((i - root) % 12 + 12) % 12)
                ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent)' }
                : undefined
            }
            onClick={() => {
              setRoot(i)
              const st = quality === 'major' ? [0, 4, 7] : [0, 3, 7]
              chordPlay(st.map((s) => freqOf(i + s)))
            }}
          >
            <span className="ln-chrom-n">{i + 1}</span>
            <span className="ln-chrom-name">{NOTE_NAMES[i]}</span>
          </button>
        ))}
      </div>
      <div className="ln-row" style={{ marginTop: 12 }}>
        <button
          className="ln-btn"
          style={quality === 'major' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
          onClick={() => setQuality('major')}
        >
          大三和弦（上数 4 再数 3）
        </button>
        <button
          className="ln-btn"
          style={quality === 'minor' ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
          onClick={() => setQuality('minor')}
        >
          小三和弦（上数 3 再数 4）
        </button>
        <button className="ln-btn ln-btn-ghost" onClick={() => chordPlay(freqs)}>
          ▶ 弹当前和弦
        </button>
      </div>
      <p className="ln-faint">
        当前：<strong className="num">{name}</strong> = {steps.map((s) => NOTE_NAMES[(root + s) % 12]).join(' + ')}
        （{steps.join(' / ')} 半音）。大三明亮、小三忧郁，差别只在中间那个音挪了半格。
      </p>
    </div>
  )
}

/* ============================================================
 * 第 6 课：调 · 音阶生成器
 * ============================================================ */

function KeyLab() {
  const [tonic, setTonic] = useState(0)
  const [mode, setMode] = useState<'major' | 'minor'>('major')
  const steps = mode === 'major' ? MAJOR_STEPS : MINOR_STEPS

  return (
    <div className="ln-widget">
      <div className="viz-label">交互 · 调 = 从 12 个音里挑 7 个。选主音和大小调，看高亮模式整体平移</div>
      <div className="ln-row">
        {(['major', 'minor'] as const).map((m) => (
          <button
            key={m}
            className="ln-btn"
            style={mode === m ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
            onClick={() => setMode(m)}
          >
            {m === 'major' ? '大调' : '小调'}
          </button>
        ))}
        <button
          className="ln-btn ln-btn-ghost"
          onClick={() => seqPlay([...steps, 12].map((s) => freqOf(tonic + s)))}
        >
          ▶ 弹这个音阶
        </button>
      </div>
      <div className="ln-chrom" style={{ marginTop: 12 }}>
        {[...Array(12)].map((_, i) => (
          <button
            key={i}
            className="ln-chrom-btn"
            style={
              steps.includes(((i - tonic) % 12 + 12) % 12)
                ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent)' }
                : i === tonic
                  ? { opacity: 0.55 }
                  : undefined
            }
            onClick={() => setTonic(i)}
            title="点击设为主音"
          >
            <span className="ln-chrom-n">{i + 1}</span>
            <span className="ln-chrom-name">{NOTE_NAMES[i]}</span>
          </button>
        ))}
      </div>
      <p className="ln-faint" style={{ marginTop: 10 }}>
        当前调：<strong className="num">{NOTE_NAMES[tonic]} {mode === 'major' ? '大' : '小'}调</strong>
        。大调挑第 1、3、5、6、8、10、12 号音；小调挑第 1、3、4、6、8、9、11 号音。换个主音，
        整个高亮图案只是平移——「调」的本质就是一套平移不变的选音模板。
      </p>
    </div>
  )
}

/* ============================================================
 * 第 7 课：调内和弦
 * ============================================================ */

const DIATONIC = [
  { roman: 'I', label: 'C 大三和弦', semis: [0, 4, 7] },
  { roman: 'ii', label: 'Dm 小三和弦', semis: [2, 5, 9] },
  { roman: 'iii', label: 'Em 小三和弦', semis: [4, 7, 11] },
  { roman: 'IV', label: 'F 大三和弦', semis: [5, 9, 0] },
  { roman: 'V', label: 'G 大三和弦', semis: [7, 11, 2] },
  { roman: 'vi', label: 'Am 小三和弦', semis: [9, 0, 4] },
] as const

function DiatonicLab() {
  const [lit, setLit] = useState<number | null>(null)
  const SCALE = MAJOR_STEPS // C 大调七个音（含八度 12）
  return (
    <div className="ln-widget">
      <div className="viz-label">交互 · C 大调里能用的六个三和弦：音符必须全部取自音阶（点击弹奏）</div>
      <div className="ln-chrom" style={{ marginBottom: 14 }}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="ln-chrom-btn ln-chrom-static"
            style={SCALE.includes(i) || i === 0 ? { borderColor: 'var(--accent-dim)' } : { opacity: 0.35 }}
          >
            <span className="ln-chrom-n">{i + 1}</span>
            <span className="ln-chrom-name">{NOTE_NAMES[i]}</span>
          </div>
        ))}
      </div>
      <div className="ln-row" style={{ flexWrap: 'wrap', gap: 10 }}>
        {DIATONIC.map((c, idx) => (
          <button
            key={c.roman}
            className="ln-btn"
            style={lit === idx ? { borderColor: 'var(--accent)', background: 'var(--accent-soft)', color: 'var(--accent)' } : undefined}
            onClick={() => {
              setLit(idx)
              chordPlay(c.semis.map((s) => freqOf(s)))
            }}
          >
            {c.roman} · {c.label}
          </button>
        ))}
        <button
          className="ln-btn ln-btn-ghost"
          onClick={() => {
            DIATONIC.forEach((c, i) => {
              const t0 = i * 0.9
              c.semis.forEach((s) => tone(freqOf(s), t0, 0.85, 0.1))
              setTimeout(() => setLit(i), t0 * 1000)
              setTimeout(() => setLit(null), t0 * 1000 + 850)
            })
          }}
        >
          ▶ 六个连播
        </button>
      </div>
      <p className="ln-faint" style={{ marginTop: 10 }}>
        判定标准只有一条：<strong>和弦的三个音都必须落在调内</strong>。于是 C 大调里 C、F、G 恰好是大三和弦，
        D、E、A 恰好是小三和弦——这不是巧合，是音阶间隔与和弦间隔共同决定的结果。
      </p>
    </div>
  )
}

/* ============================================================
 * 页面主体
 * ============================================================ */

const TOC = [
  ['1 · 声音是什么', 'l1'],
  ['2 · 和声', 'l2'],
  ['3 · 五声音阶', 'l3'],
  ['4 · 半音阶', 'l4'],
  ['5 · 和弦', 'l5'],
  ['6 · 调', 'l6'],
  ['7 · 调内和弦', 'l7'],
] as const

export default function LightnoteLessons() {
  return (
    <div className="ln">
      <style>{`
.ln { max-width: 760px; line-height: 1.75; }
.ln h1 { font-size: 26px; margin: 0 0 6px; }
.ln-meta { color: var(--text-faint); font-size: 13px; margin: 0 0 8px; }
.ln-meta a { color: var(--accent); text-decoration: none; border-bottom: 1px dashed var(--accent); }
.ln-toc { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0 22px; }
.ln-toc a { color: var(--text-dim); text-decoration: none; font-size: 13px; padding: 4px 10px; border: 1px solid var(--border); border-radius: 999px; }
.ln-toc a:hover { color: var(--accent); border-color: var(--accent); }
.ln-lesson { color: var(--accent); font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.12em; }
.ln h2 { font-size: 21px; margin: 26px 0 4px; }
.ln-sub { color: var(--text-dim); font-size: 14px; margin: 0 0 12px; }
.ln-para { color: var(--text-dim); margin: 0 0 12px; }
.ln-faint { color: var(--text-faint); font-size: 13px; margin: 10px 0 0; }
.ln-widget { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin: 14px 0 22px; }
.ln-canvas { width: 100%; height: 120px; display: block; background: var(--bg-elev); border-radius: var(--radius-sm); }
.ln-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.ln-slider-row { display: flex; flex-wrap: wrap; gap: 18px; align-items: center; margin-top: 12px; font-size: 13px; color: var(--text-dim); }
.ln-slider-row input[type="range"] { display: block; width: 160px; accent-color: var(--accent); }
.ln-btn { padding: 8px 14px; font-size: 13px; font-weight: 600; color: var(--text-dim); background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; }
.ln-btn:hover { color: var(--text); border-color: var(--accent-dim); }
.ln-btn-ghost { background: transparent; }
.ln-answer { display: flex; gap: 14px; align-items: center; margin-top: 12px; color: var(--text-dim); font-size: 14px; }
.ln-sumsvg { width: 280px; flex: none; background: var(--bg-elev); border-radius: var(--radius-sm); }
.ln-circles { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
.ln-circle { width: 74px; height: 74px; border-radius: 50%; border: 2px solid var(--border); background: var(--bg-elev); cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.ln-circle:hover { border-color: var(--accent-dim); }
.ln-circle-n { font-size: 20px; font-weight: 700; color: var(--text); }
.ln-circle-r { font-size: 10px; color: var(--text-faint); font-family: var(--font-mono); }
.ln-circle-oct { border-style: dashed; }
.ln-chrom { display: grid; grid-template-columns: repeat(13, 1fr); gap: 4px; }
.ln-chrom-btn { padding: 8px 2px; background: var(--bg-elev); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 1px; }
.ln-chrom-btn:hover { border-color: var(--accent-dim); }
.ln-chrom-static { cursor: default; }
.ln-chrom-n { font-size: 10px; color: var(--text-faint); font-family: var(--font-mono); }
.ln-chrom-name { font-size: 12px; font-weight: 600; color: var(--text-dim); }
@media (max-width: 640px) { .ln-chrom { grid-template-columns: repeat(7, 1fr); } }
      `}</style>

      <header>
        <h1>音乐是怎么运作的 · 交互课</h1>
        <p className="ln-meta">
          编译自 Lightnote 的免费课程 <em>How Music Works</em> · 原文{' '}
          <a href="https://www.lightnote.co/" target="_blank" rel="noreferrer">
            lightnote.co
          </a>{' '}
          · 中文编译版：概念脉络与原课一致，全部交互组件为本站自研（Web Audio API + Canvas）
        </p>
        <p className="ln-meta">
          七节微课，零门槛：不用会任何乐器、不看任何乐谱，从「声音是一列波」一路推到「一首歌里能用哪些和弦」。
          每个知识点都配一个可以直接点的演示。
        </p>
        <nav className="ln-toc">
          {TOC.map(([label, id]) => (
            <a key={id} href={`#${id}`}>{label}</a>
          ))}
        </nav>
      </header>

      {/* ============ 1 ============ */}
      <div className="ln-lesson">LESSON 1</div>
      <h2 className="" id="l1">声音是什么</h2>
      <p className="ln-sub">一切从一列波开始。</p>
      <p className="ln-para">
        声音是空气的振动：某个东西（鼓皮、琴弦、声带）来回摆动，把空气一压一放地推向你的耳膜。
        画成图就是一条随时间起伏的曲线。这条曲线只有两个自由度决定了你听到「什么音」：
        <strong>起伏多高</strong>（振幅 → 音量）和<strong>起伏多密</strong>（频率 → 音高）。
        至于曲线的形状（正弦、锯齿、方波），决定了音色——也就是你听出这是钢琴还是口哨。
      </p>
      <p className="ln-para">
        还有一个常被忽略的事实：音高是<strong>连续</strong>的。A 到 G 那些音名只是我们人类从无穷多个
        频率里挑出来的少数代表。那么问题来了——该挑哪几个？
      </p>
      <WaveLab />

      {/* ============ 2 ============ */}
      <div className="ln-lesson">LESSON 2</div>
      <h2 className="" id="l2">和声</h2>
      <p className="ln-sub">为什么有些音放一起好听，有些难听。</p>
      <p className="ln-para">
        答案藏在比例里。两个音同时响，你听到的其实是两条波<strong>相加</strong>后的合成波。
        如果两个频率是简单整数比（比如 3:2），合成波每隔一段固定时间就精确重复一次——
        耳朵觉得这是「一个整体」；如果比例复杂到无理数（比如 √2），两条波永远对不齐，
        合成波没有可辨认的模式，听起来就是打架。
      </p>
      <HarmonyQuiz />

      {/* ============ 3 ============ */}
      <div className="ln-lesson">LESSON 3</div>
      <h2 className="" id="l3">五声音阶</h2>
      <p className="ln-sub">人类最早「挑音」的答案：五个音，怎么组合都不难听。</p>
      <p className="ln-para">
        音乐理论的一大半，其实是在回答一个问题：<strong>从无穷多个频率里挑哪一小撮来用？</strong>
        最古老的答案就是五声音阶。以 200 Hz 为第 1 音，其余四个音按简单比例取：
        9:8、5:4、3:2、5:3。这套音广泛出现在全世界的民谣、摇滚和儿歌里——
        因为任意挑两三个都协和，几乎不可能「弹错」。
      </p>
      <PentatonicLab />
      <p className="ln-para">
        注意起点完全随意：第 1 音取 200 Hz 还是 217 Hz 无所谓，重要的是<strong>其余音与它的比例</strong>。
        另外 2:1（八度）不算新音——它就是「同一个音」的高一个版本。
      </p>

      {/* ============ 4 ============ */}
      <div className="ln-lesson">LESSON 4</div>
      <h2 className="" id="l4">半音阶</h2>
      <p className="ln-sub">现代音乐的底层系统：十二个等距的音。</p>
      <p className="ln-para">
        五声音阶的音太少、间距也不均匀，不够用。于是有了半音阶：把一个八度切成十二个
        <strong>等比</strong>的台阶（相邻频率比恒为 2<sup>1/12</sup>），同时完整包含五声音阶的五个音。
        钢琴、吉他、木管……几乎所有现代乐器都按这套系统造。
      </p>
      <p className="ln-para">
        命名是这个体系最大的历史包袱：十二个音却只有七个字母（A–G），黑键各有升号（♯）降号（♭）两个名字，
        E 和 B 没有半音邻居……初学者的大半痛苦来自这套记号，而不是来自声音本身。
      </p>
      <ChromaticLab />

      {/* ============ 5 ============ */}
      <div className="ln-lesson">LESSON 5</div>
      <h2 className="" id="l5">和弦</h2>
      <p className="ln-sub">三个音叠在一起：大三 / 小三。</p>
      <p className="ln-para">
        和弦是「一组同时响且协和的音」。最常用的是三音和弦（三和弦），构造规则简单得像数楼梯：
        从任意一个音出发，<strong>往上数 4 个半音、再数 3 个半音</strong>得到大三和弦；
        把中间那个音降低半格（先数 3 再数 4）就是小三和弦。前者明亮，后者忧郁。
      </p>
      <ChordLab />

      {/* ============ 6 ============ */}
      <div className="ln-lesson">LESSON 6</div>
      <h2 className="" id="l6">调</h2>
      <p className="ln-sub">一首歌的「取音范围」。</p>
      <p className="ln-para">
        十二个音里并非任意组合都好听，所以每首歌会先圈定一个子集——这就是<strong>调（Key）</strong>。
        「这首歌是 C 大调」的全部含义就是：它用的音来自 C 大调音阶这七个音。大调小调不是玄学，
        只是两种不同的挑音模板：从任一音开始，按固定的一串间隔跳格子。
      </p>
      <KeyLab />

      {/* ============ 7 ============ */}
      <div className="ln-lesson">LESSON 7</div>
      <h2 className="" id="l7">调内和弦</h2>
      <p className="ln-sub">把第 5、6 课拼起来：一个调里能自然长出哪些和弦。</p>
      <p className="ln-para">
        规则只有一条：和弦的每个成员音都必须在调内。把这七个音逐个当根音去叠三和弦，
        会发现长出来的和弦恰好<strong>三个是大三、三个是小三</strong>——谁是大谁是小完全被音阶间隔决定，
        不由你选。习惯上用罗马数字标记：大写大三、小写小三。
      </p>
      <DiatonicLab />
      <p className="ln-para">
        到这里，整条线索闭环了：<strong>波 → 比例 → 挑音（音阶）→ 叠音（和弦）→ 圈音（调）→ 调内和弦</strong>。
        流行歌曲的绝大多数进行，就是这六个调内和弦的排列组合。
      </p>
      <p className="ln-faint">
        想继续学转位、七和弦、和声进行等内容，可前往 Lightnote 的付费课程；本页为免费七课的中文编译版，
        概念脉络与原课一致，文案与交互为本站原创。
      </p>
    </div>
  )
}
