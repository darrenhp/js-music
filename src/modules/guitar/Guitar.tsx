import Fretboard from '../../components/Fretboard'
import ChordChart from '../../components/ChordChart'
import ScaleShape from '../../components/ScaleShape'
import { audio } from '../../audio/AudioEngine'
import { SAMPLE_TAB } from '../../data/guitar'

const SCALE_DEMO = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']

export default function Guitar() {
  const playScale = async () => {
    for (const n of SCALE_DEMO) {
      await audio.playNote(n, '8n')
      await new Promise((r) => setTimeout(r, 260))
    }
  }

  return (
    <>
      <h1>吉他专区</h1>
      <p className="muted">从构造到实战：交互式指板、常用和弦图、CAGED 把位与 Tab 读法。</p>

      <div className="knowledge" style={{ marginTop: 20 }}>
        <section className="section">
          <h2>构造与调弦</h2>
          <p>
            标准调弦从 6 弦到 1 弦为 <span className="mono accent">E A D G B E</span>（低音到高音）。
            12 品处为八度重复点，理解这一点是记忆指板的关键。
          </p>
        </section>

        <section className="section">
          <h2>交互式指板</h2>
          <div className="viz-box">
            <Fretboard frets={12} showNamesInit />
          </div>
        </section>

        <section className="section">
          <h2>常用和弦图</h2>
          <div className="viz-box">
            <ChordChart />
          </div>
        </section>

        <section className="section">
          <h2>音阶把位图（CAGED 系统）</h2>
          <div className="viz-box">
            <ScaleShape />
          </div>
        </section>

        <section className="section">
          <h2>Tab 谱读法</h2>
          <p>Tab 用六条线代表六根弦，数字表示按下的品格（0 为空弦）。下面是一段 C 大调音阶片段：</p>
          <pre className="code">{SAMPLE_TAB}</pre>
          <button className="btn" onClick={playScale}>▶ 播放 C 大调音阶</button>
        </section>
      </div>
    </>
  )
}
