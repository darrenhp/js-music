const RESOURCES = [
  { ico: '📘', title: 'Teoria', desc: '免费交互式乐理教程（英）', link: 'https://www.teoria.com' },
  { ico: '🎸', title: 'Justin Guitar', desc: '零基础吉他系统课程', link: 'https://www.justinguitar.com' },
  { ico: '👂', title: 'EarMaster', desc: '练耳与节奏训练软件', link: 'https://www.earmaster.com' },
  { ico: '🎼', title: 'musictheory.net', desc: '经典乐理图文与练习', link: 'https://www.musictheory.net' },
  { ico: '💻', title: 'Tone.js', desc: 'Web Audio 合成与调度框架', link: 'https://tonejs.github.io' },
  { ico: '🔢', title: 'Tonal.js', desc: '音乐理论计算库', link: 'https://tonaljs.github.io' },
]

const LIBS = [
  ['Tone.js', '音频合成与调度'],
  ['Tonal.js', '乐理计算'],
  ['VexFlow', '五线谱渲染'],
  ['@tonejs/midi', 'MIDI 解析与播放'],
  ['wavesurfer.js', '波形可视化'],
  ['React + Vite', 'UI 框架与构建'],
]

export default function About() {
  return (
    <>
      <h1>关于 / 学习资源</h1>
      <section className="section">
        <h2>项目说明</h2>
        <p>
          JS Music 是一个面向零基础到进阶自学者的现代化音乐理论学习站。它把系统的乐理知识、
          吉他专项、互动小游戏，以及主流音乐 JS 库的真实演示整合进一个深色主题的单页应用。
        </p>
        <p className="muted">
          所有声音均由 <span className="mono accent">Tone.js</span> 在用户手势后实时合成，乐理计算由
          <span className="mono accent"> Tonal.js</span> 完成，谱面由 <span className="mono accent">VexFlow</span> 渲染。
          学习进度保存在浏览器 localStorage，刷新不丢失。
        </p>
      </section>

      <section className="section">
        <h2>用到的开源库</h2>
        <div className="grid grid-3">
          {LIBS.map(([n, d]) => (
            <div className="card" key={n}>
              <div className="mono accent" style={{ fontWeight: 700 }}>{n}</div>
              <div className="muted" style={{ fontSize: 13 }}>{d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>外部学习资源</h2>
        <div className="res-list">
          {RESOURCES.map((r) => (
            <a className="res-item" key={r.title} href={r.link} target="_blank" rel="noreferrer">
              <span className="ri-ico">{r.ico}</span>
              <span className="ri-body">
                <div className="ri-title">{r.title}</div>
                <div className="ri-desc">{r.desc}</div>
              </span>
              <span className="ri-link">{r.link.replace('https://', '')} ↗</span>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
