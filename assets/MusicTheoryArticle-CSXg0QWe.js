import{r as h,j as e}from"./index-wufPRY5A.js";import"./midi-BLGmF6Tz.js";function N(){let n=null;return a=>{n||(n=new AudioContext),n.state==="suspended"&&n.resume();const t=n,r=t.destination,o=[],p=(i,l=0,x=.5,f="sine")=>{const d=t.currentTime+l,m=t.createOscillator(),j=t.createGain();m.type=f,m.frequency.value=i,j.gain.setValueAtTime(0,d),j.gain.linearRampToValueAtTime(.3,d+.01),j.gain.exponentialRampToValueAtTime(.001,d+x),m.connect(j).connect(r),m.start(d),m.stop(d+x)},c={log:(...i)=>o.push(i.map(l=>String(l)).join(" "))};try{new Function("ctx","out","note","console",`"use strict";
${a}`)(t,r,p,c)}catch(i){o.push("⚠ "+i.message)}return o}}function s({run:n,code:a,caption:t,runnable:r=!0}){const[o,p]=h.useState(null),[c,i]=h.useState(0);return e.jsxs("figure",{className:"mtp-fig",children:[e.jsxs("figcaption",{className:"mtp-figcap",children:[e.jsx("span",{children:t}),r&&e.jsxs("button",{className:"mtp-run",onClick:()=>{p(n(a)),i(l=>l+1)},children:["▶ 运行",c>0?` (${c})`:""]})]}),e.jsx("pre",{className:"code",style:{margin:0,borderRadius:"0 0 var(--radius-sm) var(--radius-sm)",borderTop:"none"},children:a}),o&&o.length>0&&e.jsx("div",{className:"mtp-console",children:o.map((l,x)=>e.jsx("div",{children:l},x))})]})}function b({run:n}){const[a,t]=h.useState(.01),[r,o]=h.useState(1),p=`// attack ${Math.round(a*1e3)}ms, decay ${r.toFixed(2)}s
const osc = ctx.createOscillator();
osc.frequency.value = 440;
const env = ctx.createGain();
const t = ctx.currentTime;
env.gain.setValueAtTime(0, t);
env.gain.linearRampToValueAtTime(0.3, t + ${a});
env.gain.exponentialRampToValueAtTime(0.001, t + ${a+r});
osc.connect(env).connect(out);
osc.start(t);
osc.stop(t + ${a+r});`;return e.jsxs("div",{className:"mtp-widget",children:[e.jsxs("div",{className:"viz-label",children:["交互 · attack ",Math.round(a*1e3),"ms / decay ",r.toFixed(2),"s"]}),e.jsxs("div",{className:"mtp-slider",children:[e.jsxs("label",{children:["attack（起音）",e.jsx("input",{type:"range",min:.005,max:.6,step:.005,value:a,onChange:c=>t(Number(c.target.value))})]}),e.jsxs("label",{children:["decay（衰减）",e.jsx("input",{type:"range",min:.2,max:2,step:.05,value:r,onChange:c=>o(Number(c.target.value))})]}),e.jsx("button",{className:"mtp-run",onClick:()=>n(p),children:"▶ 播放"})]}),e.jsx("p",{className:"faint",style:{fontSize:12,margin:"8px 0 0"},children:'把 attack 拖向 0.5 秒：音符从"被敲击"变成"被拉弓"，音高一个赫兹都没变。'})]})}function v({run:n}){const a=[1,2,3,4,5,6,7,8];return e.jsxs("div",{className:"mtp-widget",children:[e.jsx("div",{className:"viz-label",children:"交互 · 220Hz 的泛音列（点击试听）"}),e.jsx("div",{className:"mtp-bars",children:a.map(t=>e.jsx("button",{className:"mtp-bar",style:{height:24+(1-1/t)*96},onClick:()=>n(`note(${220*t}, 0, 0.8);`),title:`${t}× 泛音 · ${220*t}Hz`,children:e.jsxs("span",{className:"mtp-bar-label",children:[t,"×"]})},t))}),e.jsx("p",{className:"faint",style:{fontSize:12,margin:"8px 0 0"},children:'单独听都很无聊。重要的是它们作为一摞一起到达——"每个泛音相对多响"的配方决定了音色。'})]})}const u=[["C4",60],["D4",62],["E4",64],["F4",65],["G4",67],["A4",69],["B4",71],["C5",72],["D5",74],["E5",76],["F5",77],["G5",79],["A5",81],["B5",83]],y=[["C#4",61,0],["D#4",63,1],["F#4",66,3],["G#4",68,4],["A#4",70,5],["C#5",73,7],["D#5",75,8],["F#5",78,11],["G#5",80,12]];function F({run:n}){return e.jsxs("div",{className:"mtp-widget",children:[e.jsx("div",{className:"viz-label",children:"交互 · 每八度十二个音（点击试听）"}),e.jsxs("div",{className:"mtp-kbd",children:[u.map(([a,t])=>e.jsx("button",{className:"mtp-key-w",onClick:()=>n(`note(${g(t)}, 0, 0.6);`),children:a},a)),y.map(([a,t,r])=>e.jsx("button",{className:"mtp-key-b",style:{left:`calc(${(r+1)*(100/u.length)}% - 3.5%)`},onClick:()=>n(`note(${g(t)}, 0, 0.6);`),children:a},a))]}),e.jsx("p",{className:"faint",style:{fontSize:12,margin:"8px 0 0"},children:"黑键不特殊——只是没分到字母名的那些。"})]})}function g(n){return`440 * 2 ** ((${n} - 69) / 12)`}function k(){const n=h.useRef(null);n.current||(n.current=N());const a=n.current,t=[["声音就是一个随时间变化的数字","s1"],["音色是你没要求的那堆频率","s2"],['频率翻倍，得到"同一个音"',"s3"],["简单的比例好听，原因在此","s4"],["叠加五度，以及那个修不好的 bug","s5"],["十二平均律是折中方案","s6"],["为什么是十二个音，而不是全部","s7"],["和弦是三度叠置的音符","s8"],["一个调，白送七个和弦","s9"],["张力与解决","s10"],["记谱法是一种序列化格式","s11"],["综合运用","s12"],["我仍然不懂的东西","s13"]];return e.jsxs("div",{className:"mtp",children:[e.jsx("style",{children:`
.mtp { max-width: 780px; }
.mtp .mtp-para { color: var(--text-dim); margin: 0 0 1.1em; line-height: 1.8; }
.mtp .mtp-strong { color: var(--text); font-weight: 600; }
.mtp h2.mtp-h2 { font-size: 22px; margin: 44px 0 14px; padding-top: 10px; border-top: 1px solid var(--border); scroll-margin-top: 24px; }
.mtp h3 { font-size: 16px; margin: 26px 0 10px; color: var(--text); }
.mtp-fig { margin: 14px 0 20px; }
.mtp-figcap {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  font-family: var(--font-mono); font-size: 12px; color: var(--text-faint);
  background: #0c0e12; border: 1px solid var(--border); border-bottom: none;
  border-radius: var(--radius-sm) var(--radius-sm) 0 0; padding: 7px 12px;
}
.mtp-run {
  font-family: var(--font-mono); font-size: 12px; font-weight: 600;
  color: var(--accent); background: var(--accent-soft);
  border: 1px solid var(--accent-dim); border-radius: 999px;
  padding: 3px 12px; transition: background var(--dur) var(--ease);
  white-space: nowrap;
}
.mtp-run:hover { background: var(--accent); color: #0F1115; }
.mtp-console {
  font-family: var(--font-mono); font-size: 12px; line-height: 1.7;
  background: var(--bg); border: 1px solid var(--border); border-top: none;
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
  padding: 8px 14px; max-height: 220px; overflow-y: auto; color: var(--ok);
  white-space: pre-wrap;
}
.mtp-widget {
  background: var(--bg-elev); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 16px 18px; margin: 16px 0 20px;
}
.mtp-slider { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }
.mtp-slider label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-dim); }
.mtp-slider input[type="range"] { accent-color: var(--accent); width: 140px; }
.mtp-bars { display: flex; align-items: flex-end; gap: 10px; padding: 8px 4px 0; }
.mtp-bar {
  flex: 1; max-width: 64px; background: var(--accent-soft); border: 1px solid var(--accent-dim);
  border-radius: 6px 6px 0 0; display: flex; align-items: flex-start; justify-content: center;
  padding-top: 5px; transition: background var(--dur) var(--ease);
}
.mtp-bar:hover { background: var(--accent); }
.mtp-bar:hover .mtp-bar-label { color: #0F1115; }
.mtp-bar-label { font-family: var(--font-mono); font-size: 11px; color: var(--accent); }
.mtp-kbd { position: relative; display: flex; gap: 4px; height: 120px; }
.mtp-key-w {
  flex: 1; background: #E6E9EF; color: #0F1115; border-radius: 0 0 6px 6px;
  font-size: 11px; font-weight: 600; font-family: var(--font-mono);
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 6px;
  transition: background 80ms linear;
}
.mtp-key-w:hover { background: var(--accent); }
.mtp-key-b {
  position: absolute; top: 0; width: 7%; height: 62%; background: #1B2029;
  border: 1px solid var(--border); border-top: none; border-radius: 0 0 4px 4px;
  color: var(--text-dim); font-size: 10px; font-family: var(--font-mono);
  display: flex; align-items: flex-end; justify-content: center; padding-bottom: 5px;
  z-index: 2; transition: background 80ms linear;
}
.mtp-key-b:hover { background: var(--accent); color: #0F1115; }
.mtp-toc { display: flex; flex-wrap: wrap; gap: 6px; margin: 14px 0 8px; }
.mtp-toc a {
  font-size: 12px; color: var(--text-dim); border: 1px solid var(--border);
  border-radius: 999px; padding: 3px 11px; transition: all var(--dur) var(--ease);
}
.mtp-toc a:hover { color: var(--accent); border-color: var(--accent-dim); }
.mtp-meta { font-size: 13px; color: var(--text-faint); }
.mtp-note {
  border-left: 3px solid var(--accent); background: var(--accent-soft);
  padding: 10px 16px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--text); font-size: 14px; margin: 18px 0;
}
.mtp-list { color: var(--text-dim); margin: 0 0 1.1em; padding-left: 1.3em; line-height: 1.8; }
      `}),e.jsxs("header",{children:[e.jsx("h1",{children:"程序员的乐理课"}),e.jsxs("p",{className:"mtp-meta",children:["Luke Haas · 2026 年 8 月 17 日 · 原文"," ",e.jsx("a",{href:"https://runjs.app/blog/music-theory-for-programmers",target:"_blank",rel:"noreferrer",style:{color:"var(--accent)"},children:"runjs.app/blog/music-theory-for-programmers"})," ","· 中文翻译版"]}),e.jsxs("p",{className:"mtp-meta",children:["译注：原文所有代码示例都是纯 JavaScript + Web Audio API。本页每个代码块右上角都有「▶ 运行」按钮，点击即可在本页直接执行并听到结果、看到 console 输出——运行环境与原文的 ",e.jsx("span",{className:"mono",children:"note()"})," 辅助函数一字不差。"]}),e.jsx("nav",{className:"mtp-toc",children:t.map(([r,o])=>e.jsx("a",{href:`#${o}`,children:r},o))})]}),e.jsx("p",{className:"mtp-para",children:"我不会演奏任何乐器。我试过不止一次，每次都止步于「能弄出大致正确的声响」，却从不知道为什么那些声响是正确的。"}),e.jsxs("p",{className:"mtp-para",children:["问题从来不在练习，而在于每一份乐理教材都似乎跳过了「事情为什么是这样」的根本原因。这是一张五线谱，谱上有这些音，这是大调音阶，把指法背下来。为什么是",e.jsx("em",{children:"这些"}),"音？为什么是",e.jsx("em",{children:"这个"}),"模式？——因为约定俗成。"]}),e.jsxs("p",{className:"mtp-para",children:["用这种方式来教一个本质上源于物理和算术的系统，实在很奇怪。十二个音的存在有它的道理，大调音阶长成那样有它的道理，听起来协和的和弦之所以协和有它的道理——",e.jsx("span",{className:"mtp-strong",children:"而且这些道理都是可以计算的"}),"。"]}),e.jsx("p",{className:"mtp-para",children:"所以我想从零开始、从第一性原理学习音乐，而我开启这段旅程的方式是：写代码。"}),e.jsx("p",{className:"mtp-para",children:"本文就是这段旅程的结果。它从一个随时间变化的数字出发，如果你跟着读下去，你将推导出十二个音、用数组构建音阶与和弦，并写出一段听起来像真正的音乐的和弦进行。不需要任何乐器，也没有任何需要你「凭信念接受」的东西。记谱法确实会出现——但要到最后才出现，等到终于有了可以让它去「记」的东西之后。"}),e.jsx("h2",{className:"mtp-h2",id:"s1",children:"声音就是一个随时间变化的数字"}),e.jsx("p",{className:"mtp-para",children:"声音只是空气压力的振动。扬声器靠前后推动振膜发声，而计算机处理音频的一切，归根结底就是产出一份描述振膜位置的数字列表——每秒四万四千个。"}),e.jsx("p",{className:"mtp-para",children:"音频文件就是把这份列表写下来。合成器则是一边播放一边现编这份列表，只要你告诉浏览器你想要什么形状，它就会替你完成这部分。最简单的形状是正弦波，下面这个每秒重复 440 次："}),e.jsx(s,{run:a,caption:"一个 440Hz 的正弦波",code:`const osc = ctx.createOscillator();
osc.frequency.value = 440;

osc.connect(out);
osc.start();
osc.stop(ctx.currentTime + 1);`}),e.jsxs("p",{className:"mtp-para",children:[e.jsx("span",{className:"mono",children:"ctx"})," 和 ",e.jsx("span",{className:"mono",children:"out"})," 是我的封装而不是浏览器的。其余全部是浏览器原生的 ",e.jsx("a",{href:"https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",target:"_blank",rel:"noreferrer",style:{color:"var(--accent)"},children:"Web Audio API"}),"。要在别处运行这段代码，先写上："]}),e.jsx(s,{run:a,runnable:!1,code:`const ctx = new AudioContext();
const out = ctx.destination;`}),e.jsx("p",{className:"mtp-para",children:"那里唯一携带音乐含义的数字是 440，而它本身也是任意的。它是某人约定称为「A」的频率，是整个系统钉在音叉上的锚点。把它改成 300 再运行一次：你会得到一个不同的音高，一切照常——因为在这个层面还没有「音符」，只有一个数字。"}),e.jsx("p",{className:"mtp-para",children:"频率就是音高：数字越大，音越高。这就是全部的映射关系，也是音乐里最后一件如此简单的事。"}),e.jsx("h3",{children:"为什么刚才那个音有「咔哒」声"}),e.jsx("p",{className:"mtp-para",children:"你可能在结尾听到一声小小的「咔哒」。那不是浏览器的 bug，是物理在较真。"}),e.jsx("p",{className:"mtp-para",children:"振荡器停止时正处在波形中途，振膜停在冲程边缘的某处，然后瞬间弹回。压力的瞬间跳变，正是「咔哒声」的本体。"}),e.jsxs("p",{className:"mtp-para",children:["修复方法是再加一个随时间变化的数字，这次控制的是音量而非音高。音乐家把它的形状称为",e.jsx("strong",{children:"包络（envelope）"}),"："]}),e.jsx(s,{run:a,caption:"同一个音，加上包络",code:`const osc = ctx.createOscillator();
osc.frequency.value = 440;

const env = ctx.createGain();
const t = ctx.currentTime;
env.gain.setValueAtTime(0, t);
env.gain.linearRampToValueAtTime(0.3, t + 0.01);
env.gain.exponentialRampToValueAtTime(0.001, t + 1);

osc.connect(env).connect(out);
osc.start(t);
osc.stop(t + 1);`}),e.jsxs("p",{className:"mtp-para",children:["包络是一个音从静默回到静默的音量曲线。前端的爬升是",e.jsx("strong",{children:"起音（attack）"}),"，之后的回落是",e.jsx("strong",{children:"衰减（decay）"}),"。"]}),e.jsx("p",{className:"mtp-para",children:"十毫秒淡入，然后缓慢衰减到几乎无声——这就是「测试音」和「你愿意再听一遍的东西」之间的差别。"}),e.jsx(b,{run:a}),e.jsx("p",{className:"mtp-para",children:"把起音拖长到半秒左右，音符就不再是「到达」，而是「涌出」。它不再是被敲击的东西，而是被拉弓的东西——而音高一个赫兹都没有变。在这里，包络干的活比频率还多。"}),e.jsxs("p",{className:"mtp-para",children:["不过这是简化版。完整版是 ",e.jsx("strong",{children:"ADSR"}),"：起音（attack）、衰减（decay）、延音（sustain）、释放（release）。延音是按键按住期间音符保持的电平，释放是你松手后它消失的方式。"]}),e.jsx("p",{className:"mtp-para",children:"下面的函数是后续所有示例共用的辅助函数："}),e.jsx(s,{run:a,runnable:!1,code:`function note(freq, start = 0, length = 0.5, type = "sine") {
  const t = ctx.currentTime + start;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(0.3, t + 0.01);
  env.gain.exponentialRampToValueAtTime(0.001, t + length);
  osc.connect(env).connect(out);
  osc.start(t);
  osc.stop(t + length);
}`}),e.jsx("h2",{className:"mtp-h2",id:"s2",children:"音色是你没要求的那堆频率"}),e.jsx("p",{className:"mtp-para",children:"正弦波只有单一频率、别无他物，所以它听起来像听力测试，不像任何乐器。拨一根调到 440Hz 的吉他弦，你确实会得到一个每秒重复 440 次的波，但这根弦同时在以二分之一、三分之一、四分之一……的模式振动。这些是叠加在你所要求的频率之上的额外频率：880、1320、1760，一路向上。"}),e.jsxs("p",{className:"mtp-para",children:["这摞东西叫",e.jsx("strong",{children:"泛音列（harmonic series）"}),"。你要的那个音是",e.jsx("strong",{children:"基音（fundamental）"}),"，泛音列是这个频率乘以 1、2、3、4、5……的堆叠："]}),e.jsx(v,{run:a}),e.jsxs("p",{className:"mtp-para",children:["点这些柱子试试。单独听相当无聊。重要的是它们是打包到达的，而「每个泛音相对多响」的配方，决定了小提琴听起来像小提琴而不是小号。音乐家称之为",e.jsx("strong",{children:"音色（timbre）"}),"——两个音可以是同一个音。"]}),e.jsx("p",{className:"mtp-para",children:"浏览器自带四种现成配方："}),e.jsx(s,{run:a,caption:"四种波形，同一个音高",code:`["sine", "triangle", "square", "sawtooth"].forEach((type, i) => {
  note(220, i * 0.7, 0.6, type);
});`}),e.jsx("p",{className:"mtp-para",children:"同样 220Hz，四种截然不同的性格。方波只含奇次泛音，所以听起来空洞、略带电子味；锯齿波全部包含，听起来粗糙刺耳。示波器上显示的形状，就是泛音配方本身。"}),e.jsx("p",{className:"mtp-para",children:"记住泛音列——它即将解释本文接下来的全部内容。你演奏的每个音，都拖着一摞安静的高音随行，而这些音是哪些，由不得我们。这是算术，由振动的弦与空气柱的物理规律固定下来，任何围绕它们建造的乐器都得到同样的结果。"}),e.jsx("h2",{className:"mtp-h2",id:"s3",children:"频率翻倍，得到「同一个音」"}),e.jsx("p",{className:"mtp-para",children:"这里有五个音，每个都是前一个频率的两倍："}),e.jsx(s,{run:a,caption:"一个音，五次",code:`[110, 220, 440, 880, 1760].forEach((freq, i) =>
  note(freq, i * 0.45, 0.4),
);`}),e.jsxs("p",{className:"mtp-para",children:["它们音高不同，但听起来是",e.jsx("em",{children:"同一个音"}),"。不只是相似——是同一个。从未接触过的文明各自独立发现了这一点：频率翻倍得到的声音相似到值得拥有同一个名字。西方记谱法把上面这些频率都叫作 A，它们之间的距离叫",e.jsx("strong",{children:"八度（octave）"}),"。"]}),e.jsx("p",{className:"mtp-para",children:"这个命名并非任意，泛音列解释了原因。440 的每个泛音都已经在 220 的泛音列里：220 的列是 220、440、660、880、1100……而 440 的列是 440、880、1320、1760……高音没有添加任何低音本来没有的频率。它不是新的颜色，是同一个颜色、更亮。"}),e.jsx("p",{className:"mtp-para",children:"两个结论直接从中掉出来。"}),e.jsxs("p",{className:"mtp-para",children:[e.jsx("span",{className:"mtp-strong",children:"音高是乘法的，不是加法的。"}),"升高一个八度意味着乘以二，不是加多少。110 到 220 的间距是 110Hz，880 到 1760 的间距是 880Hz——它们听起来是完全相同的距离。频率空间是对数的，音乐里每个音程都是一个比例。"]}),e.jsxs("p",{className:"mtp-para",children:[e.jsx("span",{className:"mtp-strong",children:"我们只需解决一个八度。"}),"因为翻倍会回到同一个音，「应该存在哪些音高」这个问题的全部，就化归为「如何切分一个频率到它两倍之间的空间」。解决一次，答案就免费平铺整个可听域。"]}),e.jsx("p",{className:"mtp-para",children:"那么：怎么切分一个八度？"}),e.jsx("h2",{className:"mtp-h2",id:"s4",children:"简单的比例好听，原因在此"}),e.jsx("p",{className:"mtp-para",children:"天真的答案是均匀切分然后收工。没人这么干，因为我们并非平等地感知所有频率对。有的组合听起来安稳，有的组合听起来像失误，而你立刻就能听出区别。"}),e.jsx(s,{run:a,caption:"六个比例对着同一个音",code:`const ratios = [
  ["2/1   八度", 2],
  ["3/2   纯五度", 3 / 2],
  ["4/3   纯四度", 4 / 3],
  ["5/4   大三度", 5 / 4],
  ["16/15 半音", 16 / 15],
  ["√2    那个别扭的", Math.SQRT2],
];

ratios.forEach(([label, ratio], i) => {
  note(220, i * 1.4, 1.2);
  note(220 * ratio, i * 1.4, 1.2);
  console.log(label, "->", (220 * ratio).toFixed(2) + "Hz");
});`}),e.jsxs("p",{className:"mtp-para",children:["前四个听起来像",e.jsx("em",{children:"和弦"}),"。16/15 听起来像两个音在吵架。最后一个听起来像汽车警报。规律一旦看见就毫不隐晦：",e.jsx("span",{className:"mtp-strong",children:"分数越简单，越好听。"}),"2/1 八度，然后 3/2 五度，4/3 四度，5/4 大三度，到 16/15 时已经彻底崩坏。"]}),e.jsx("p",{className:"mtp-para",children:"对于「好听」这么主观的东西，这是个可疑地算术化的结果，而背后有两个物理原因。"}),e.jsx("p",{className:"mtp-para",children:"第一个还是泛音列。同时奏 220 和 330（3:2 比例）。第一个音产生 220、440、660、880、1100、1320；第二个产生 330、660、990、1320——它们精确共享 660 和 1320。相距五度的两个音其实不是两个分离的声音，是两摞大量重叠、互相强化的频率。再试 220 和 311（接近 √2）：任何泛音上都不对齐。你得到两摞毫无关系的频率。"}),e.jsxs("p",{className:"mtp-para",children:["第二个原因是",e.jsx("strong",{children:"粗糙度（roughness）"}),"。两个频率接近但不相同时，它们相位漂进漂出，你会听到音量脉动。这叫",e.jsx("strong",{children:"拍频（beating）"}),"，正是「走调的音」听起来走调的原因："]}),e.jsx(s,{run:a,caption:"拍频：从相距很远到完全一致",code:`[220, 226, 223, 221, 220.5, 220].forEach((freq, i) => {
  note(220, i * 1.3, 1.2);
  note(freq, i * 1.3, 1.2);
});`}),e.jsxs("p",{className:"mtp-para",children:["两个频率收敛时摆动变慢，重合时消失，其速率恰为频率之差。差六赫兹，每秒六个脉冲。当分数复杂时，两摞泛音里塞满了相差几赫兹的频率对，每一对都在打架。这就是",e.jsx("strong",{children:"不协和（dissonance）"}),"。"]}),e.jsx("p",{className:"mtp-para",children:"（原文此处有一个交互组件：在各比例之间切换，观察绿线——两个波相加的结果，正如你的耳膜相加它们那样。2:1 和 3:2 时合成形状几乎立即进入循环模式；16:15 要十五个周期才绕回来；√2 永远不会，因为 √2 是无理数，你的耳朵根本无从锁定模式。）"}),e.jsx("div",{className:"mtp-note",children:"协和是你的耳朵快速找到一个重复模式。全部奥秘，尽在于此。"}),e.jsx("h2",{className:"mtp-h2",id:"s5",children:"叠加五度，以及那个修不好的 bug"}),e.jsx("p",{className:"mtp-para",children:"现在可以真正开始构建了。我们知道简单比例是好比例，而除八度本身外，物理上最干净的比例是 3/2——五度。"}),e.jsx("p",{className:"mtp-para",children:"如果只用八度和五度来构建整套音乐字母表，会怎样？"}),e.jsx("p",{className:"mtp-para",children:"做显然的事：不断上叠五度，一出八度就减半。这大致是毕达哥拉斯干的事，而且一段时间内效果绝佳："}),e.jsx(s,{run:a,caption:"在一个八度内叠加五度",code:`let freq = 220;
const notes = [220];

for (let i = 0; i < 12; i++) {
  freq = (freq * 3) / 2;
  while (freq >= 440) freq = freq / 2;
  notes.push(freq);
  console.log(\`fifth \${i + 1}: \${freq.toFixed(3)}Hz\`);
}

notes.sort((a, b) => a - b).forEach((f, i) => note(f, i * 0.22, 0.3));`}),e.jsxs("p",{className:"mtp-para",children:["看第一个音和最后一个音。从 220 出发，叠了十二个五度，落在 222.99。不是 220——近到能听出它在",e.jsx("em",{children:"努力"}),"成为同一个音，远到没法用。"]}),e.jsx("p",{className:"mtp-para",children:"这个误差不是舍入误差，而是结构性的，去掉八度折叠更容易看清："}),e.jsx(s,{run:a,caption:"那个合不上的缺口",code:`const twelveFifths = (3 / 2) ** 12;
const sevenOctaves = 2 ** 7;

console.log("twelve fifths:", twelveFifths.toFixed(6));
console.log("seven octaves:", sevenOctaves.toFixed(6));
console.log("ratio:", (twelveFifths / sevenOctaves).toFixed(6));
console.log(
  "in cents:",
  (1200 * Math.log2(twelveFifths / sevenOctaves)).toFixed(2),
);

note(220, 0, 1.5);
note((220 * twelveFifths) / sevenOctaves, 0, 1.5);`}),e.jsxs("p",{className:"mtp-para",children:["十二个纯五度超出七个纯八度 1.0136 倍。这个缺口叫",e.jsx("strong",{children:"毕达哥拉斯逗号（Pythagorean comma）"}),"。音分（cents）是音高距离的度量单位，一个八度 1200 音分——代码里那个数字就是这么来的。23 音分大约是相邻两个钢琴键间距的四分之一，你在最后一对音里能听到缓慢而难听的拍。"]}),e.jsxs("p",{className:"mtp-para",children:["而且它无法修复，原因程序员一听就懂。叠五度意味着乘 3/2，n 个五度后是 3",e.jsx("sup",{children:"n"})," / 2",e.jsx("sup",{children:"n"}),"。叠八度是 2",e.jsx("sup",{children:"m"}),"。两者要相遇需要 3",e.jsx("sup",{children:"n"})," = 2",e.jsx("sup",{children:"n+m"}),"，即 3 的幂等于 2 的幂。3 和 2 都是素数。永远不会发生，对任何 n 都不会。"]}),e.jsx("p",{className:"mtp-para",children:"我们想要的系统——八度纯、五度纯、首尾闭合成环——不存在，从来就不存在。历史上每一种律制，都是关于「把误差倒在哪里」的不同选择。"}),e.jsx("h2",{className:"mtp-h2",id:"s6",children:"十二平均律是折中方案"}),e.jsxs("p",{className:"mtp-para",children:["现代答案粗暴而优雅：彻底放弃纯比例。把八度切成十二个",e.jsx("em",{children:"相等的乘法步长"}),"，接受「除八度外一切都不再精确」的现实。"]}),e.jsx("p",{className:"mtp-para",children:"一步是 2 的 12 次方根："}),e.jsx(s,{run:a,caption:"2 的 12 次方根",code:`const semitone = 2 ** (1 / 12);
console.log("one semitone =", semitone);

let freq = 220;
for (let i = 0; i < 13; i++) {
  note(freq, i * 0.2, 0.28);
  freq = freq * semitone;
}

console.log(
  "twelve steps later:",
  (220 * semitone ** 12).toFixed(10),
);`}),e.jsx("p",{className:"mtp-para",children:"十二步后精确落在 440——根号的性质使然。八度按构造完美，其余全部近似。"}),e.jsx("p",{className:"mtp-para",children:"显然的问题是：为什么是十二？这不是传统，你自己十五行代码就能找到答案。对每个合理的 n，把八度均分为 n 步，检查最接近的步长与真正 3/2 五度的差距："}),e.jsx(s,{run:a,caption:"暴力搜出「十二」这个数",code:`function bestFifth(n) {
  let error = Infinity;
  let step = 0;

  for (let candidate = 1; candidate < n; candidate++) {
    const off = Math.abs(2 ** (candidate / n) - 1.5);
    if (off < error) {
      error = off;
      step = candidate;
    }
  }

  return { step, error };
}

for (let n = 5; n <= 25; n++) {
  const { step, error } = bestFifth(n);
  const pct = (error / 1.5) * 100;
  console.log(
    \`\${n} 步: 最好的五度是第 \${step} 步, 偏差 \${pct.toFixed(3)}%\`,
  );
}

// 下面实际听一听这些误差。
[5, 7, 12, 19].forEach((n, i) => {
  const { step } = bestFifth(n);
  note(220, i * 1.7, 1.5);
  note(220 * 2 ** (step / n), i * 1.7, 1.5);
});`}),e.jsx("p",{className:"mtp-para",children:"最后四行演奏 5、7、12、19 等分各自能拿出的最好五度，都对着同一个 220Hz。前两个摇晃，第三个干净，第四个介于其间。你听到的是那列误差。"}),e.jsx("p",{className:"mtp-para",children:"十二是第一个把五度做到约千分之一误差的等分，比它小的任何数都差三倍以上。二十四打平，但只是因为二十四步等于每对音中间塞了个备用音，算不上竞争者。要到 29 和 41 五度才更好，而没人会造一个每八度 41 个键的键盘。它是最便宜地买到可信五度的音符数，而五度一旦接近，四度和三度也顺带跟上了。"}),e.jsx("p",{className:"mtp-para",children:"有多接近："}),e.jsx(s,{run:a,caption:"纯五度对照折中方案",code:`const pure = (220 * 3) / 2;
const tempered = 220 * 2 ** (7 / 12);

console.log("pure fifth:     ", pure.toFixed(4) + "Hz");
console.log("tempered fifth: ", tempered.toFixed(4) + "Hz");
console.log(
  "difference:     ",
  (1200 * Math.log2(tempered / pure)).toFixed(2),
  "cents",
);

note(220, 0, 1.5);
note(pure, 0, 1.5);
note(220, 2, 1.5);
note(tempered, 2, 1.5);`}),e.jsx("p",{className:"mtp-para",children:"低两音分。第二对里有个缓慢的拍，如果你仔细听——而地球每一架钢琴上的每一个五度里都有这个拍。我们集体决定：处处略错，好过一个调里完美、其余调没法用。"}),e.jsxs("p",{className:"mtp-para",children:["回报是：音符从此是",e.jsx("strong",{children:"整数"}),"。任取一音记为 0，其余音都是与它相距整数个半音。约定俗成的编号是 MIDI，其中 69 是我们的 440Hz A，转换只要一行："]}),e.jsx(s,{run:a,caption:"音符从此是整数",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);

console.log("60 (中央C):", midiToFreq(60).toFixed(2));
console.log("69 (其上方的A):", midiToFreq(69).toFixed(2));
console.log("81 (高八度):", midiToFreq(81).toFixed(2));

[60, 62, 64, 65, 67, 69, 71, 72].forEach((n, i) =>
  note(midiToFreq(n), i * 0.25, 0.4),
);`}),e.jsx("p",{className:"mtp-para",children:"最后一行是个大调音阶——而我们还没定义什么是音阶。它只是一个整数数组。从此本文的一切都用数组完成，我完全不再需要想频率的事。"}),e.jsx(F,{run:a}),e.jsx("p",{className:"mtp-para",children:"每八度十二个音，永远重复。那个键盘值得盯着看一会儿，因为它的布局是一个假装成结构的历史事故：每八度十二个等距的音，七个拿到了字母和大白键，五个拿到升号和小黑键——而拿到白键的七个，恰好就是你刚才演奏的音阶。底下的物理完全均匀，键盘不是。"}),e.jsx("h2",{className:"mtp-h2",id:"s7",children:"为什么是十二个音，而不是全部"}),e.jsx("p",{className:"mtp-para",children:"有十二个音不代表用十二个音。按顺序全部演奏一遍，效果惊人地不像音乐："}),e.jsx(s,{run:a,caption:"全部十二个，按顺序",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);

for (let n = 60; n <= 72; n++) {
  note(midiToFreq(n), (n - 60) * 0.18, 0.25);
}`}),e.jsx("p",{className:"mtp-para",children:"它听起来像音效，不像旋律。每一步都一样，没有哪个音突出，没有哪个音像「家」，你根本不知道自己在哪。它是尺子，不是旋律。"}),e.jsxs("p",{className:"mtp-para",children:["音乐选择的是",e.jsx("strong",{children:"子集"}),"。几乎总是十二个中的七个，而且刻意让音之间的间距不均匀——这恰恰是「凭耳朵就能分辨音符」的关键。这个子集就是音阶，而音阶最好的写法不是音符列表，而是音符之间的步长："]}),e.jsx(s,{run:a,caption:"音阶是一份间距列表",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);

const major = [2, 2, 1, 2, 2, 2, 1];

function buildScale(root, pattern) {
  return pattern.reduce(
    (notes, step) => [...notes, notes.at(-1) + step],
    [root],
  );
}

const cMajor = buildScale(60, major);
console.log("C major:", cMajor);

cMajor.forEach((n, i) => note(midiToFreq(n), i * 0.25, 0.4));`}),e.jsxs("p",{className:"mtp-para",children:["步长是 ",e.jsx("span",{className:"mono",children:"2 2 1 2 2 2 1"}),"，加起来恰好 12，模式精确闭合八度。这就是大调音阶，西方音乐中最耳熟的声音——一个七元素数组。"]}),e.jsx("p",{className:"mtp-para",children:"改一个数字，情绪就完全不同："}),e.jsx(s,{run:a,caption:"一个数字，就是快乐与悲伤的差别",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const build = (root, pattern) =>
  pattern.reduce(
    (notes, step) => [...notes, notes.at(-1) + step],
    [root],
  );

const patterns = {
  major: [2, 2, 1, 2, 2, 2, 1],
  naturalMinor: [2, 1, 2, 2, 1, 2, 2],
  majorPenta: [2, 2, 3, 2, 3],
  minorPenta: [3, 2, 2, 3, 2],
  blues: [3, 2, 1, 1, 3, 2],
};

let when = 0;
Object.entries(patterns).forEach(([name, pattern]) => {
  const scale = build(60, pattern);
  console.log(name.padEnd(13), scale.join(" "));
  scale.forEach((n, i) => note(midiToFreq(n), when + i * 0.22, 0.35));
  when += scale.length * 0.22 + 0.5;
});`}),e.jsx("p",{className:"mtp-para",children:"大调和自然小调是同一套七音思路、间距洗了个牌。五声音阶删掉两个音——这就是为什么在五声音阶里几乎弹不出错音，也是每个吉他初学者课程从它开始的原因。布鲁斯音阶又故意塞回一个别扭的音。"}),e.jsxs("p",{className:"mtp-para",children:["然后是让我坐直了的事。调式（modes）——我一直以为是要死记硬背的七个希腊名字——其实是",e.jsx("em",{children:"同一个数组旋转"}),"。把第一个步长从前面取下来接到后面，就得到下一个："]}),e.jsx(s,{run:a,caption:"调式就是数组旋转",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const build = (root, pattern) =>
  pattern.reduce(
    (notes, step) => [...notes, notes.at(-1) + step],
    [root],
  );

const major = [2, 2, 1, 2, 2, 2, 1];
const names = [
  "Ionian",
  "Dorian",
  "Phrygian",
  "Lydian",
  "Mixolydian",
  "Aeolian",
  "Locrian",
];

const rotate = (arr, by) =>
  arr.map((_, i) => arr[(i + by) % arr.length]);

names.forEach((name, i) => {
  const pattern = rotate(major, i);
  console.log(name.padEnd(11), pattern.join(" "));
  build(60, pattern).forEach((n, j) =>
    note(midiToFreq(n), i * 2 + j * 0.2, 0.3),
  );
});`}),e.jsx("p",{className:"mtp-para",children:"七个调式，一个数组，七次旋转。Ionian 就是大调，Aeolian 就是自然小调——「大调」和「小调」不是两个系统，是同一个东西的第 0 次旋转和第 5 次旋转。Lydian 听起来梦幻，Phrygian 听起来西班牙，Locrian 听起来坏掉，而这一切都来自「哪个缺口相对你的起始音坐在哪里」。"}),e.jsx("p",{className:"mtp-para",children:"这是我第一次不再觉得乐理是任意的。"}),e.jsx("h2",{className:"mtp-h2",id:"s8",children:"和弦是三度叠置的音符"}),e.jsx("p",{className:"mtp-para",children:"和弦是一个以上的音同时发声。这不算什么定义，因为大多数组合都难听。有用的问题是：哪些组合不难听。"}),e.jsxs("p",{className:"mtp-para",children:["从比例那节我们已知道答案：泛音相互重叠的音。在音阶里，符合描述的是相距两个音级的音——音乐家称之为",e.jsx("strong",{children:"三度（third）"}),"。所以取一个音阶，选一个起始音级，隔一个抓一个："]}),e.jsx(s,{run:a,caption:"三和弦就是 [0, 2, 4]",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const build = (root, p) =>
  p.reduce((n, s) => [...n, n.at(-1) + s], [root]);

const cMajor = build(60, [2, 2, 1, 2, 2, 2, 1]);
const triad = [0, 2, 4].map((i) => cMajor[i]);

console.log("scale:", cMajor.join(" "));
console.log("triad:", triad.join(" "));
console.log("gaps:", triad[1] - triad[0], "and", triad[2] - triad[1]);

triad.forEach((n) => note(midiToFreq(n), 0, 2));`}),e.jsxs("p",{className:"mtp-para",children:["这是一个 C 大三和弦。三个音，在构建音（音乐家称之为",e.jsx("strong",{children:"根音 root"}),"）上方 0、4、7 个半音处。换成频率比例是 1 : 1.26 : 1.50，非常接近 4 : 5 : 6。三个简单比例，泛音处处重叠。它听起来扎实，因为算术本身扎实。"]}),e.jsx("p",{className:"mtp-para",children:"三度要么 4 个半音（大三度），要么 3 个半音（小三度），两个叠起来都是 7 个半音：大三是 4 + 3，小三是 3 + 4。"}),e.jsx("p",{className:"mtp-para",children:"现在把中间那个音下移一个半音："}),e.jsx(s,{run:a,caption:"一个半音，截然不同的感受",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const chord = (shape, root, at) =>
  shape.forEach((s) => note(midiToFreq(root + s), at, 1.6));

const shapes = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
};

Object.entries(shapes).forEach(([name, shape], i) => {
  console.log(name.padEnd(11), shape.join(" "));
  chord(shape, 60, i * 2);
});`}),e.jsxs("p",{className:"mtp-para",children:["大变小，是一个音移动一个半音。这就是西方音乐两个情感极点之间的全部差别——",e.jsx("span",{className:"mono",children:"[0,4,7]"})," 对 ",e.jsx("span",{className:"mono",children:"[0,3,7]"}),"。减三和弦把两个间距都压扁，听起来悬而未决、焦虑；增三和弦都拉大，听起来像电影里「要出事了」。"]}),e.jsx("p",{className:"mtp-para",children:"发现这一点让我由衷地「恼火」，好的那种恼火。我曾默认大小调是深刻的范畴。它们是一个数组元素差一。"}),e.jsx("p",{className:"mtp-para",children:"再加第四个音，再高一个三度，得到七和弦——音乐从这里开始不像圣咏，而像你会特意去听的东西："}),e.jsx(s,{run:a,caption:"七和弦",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);

const shapes = {
  "major 7th": [0, 4, 7, 11],
  "minor 7th": [0, 3, 7, 10],
  "dominant 7th": [0, 4, 7, 10],
};

Object.entries(shapes).forEach(([name, shape], i) => {
  console.log(name.padEnd(13), shape.join(" "));
  shape.forEach((s) => note(midiToFreq(60 + s), i * 2.2, 1.8));
});`}),e.jsx("p",{className:"mtp-para",children:"大七是爵士咖啡馆和弦。小七顺滑、微带忧郁。属七有意思。Dominant（属）只是音阶第五级的老名字，而这个和弦马上要干很多活。"}),e.jsx("h2",{className:"mtp-h2",id:"s9",children:"一个调，白送七个和弦"}),e.jsx("p",{className:"mtp-para",children:"这是终于让和弦谱不再像天书的部分。"}),e.jsx("p",{className:"mtp-para",children:"从第一级开始没有什么特别的。对七个音级挨个做一遍、绕八度回卷，你会得到七个和弦，全部只用这个音阶的七个音构建："}),e.jsx(s,{run:a,caption:"一个音阶派生七个和弦",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const build = (root, p) =>
  p.reduce((n, s) => [...n, n.at(-1) + s], [root]);

const scale = build(60, [2, 2, 1, 2, 2, 2, 1]).slice(0, 7);
const names = ["C", "D", "E", "F", "G", "A", "B"];

const chordOn = (degree) =>
  [0, 2, 4].map((step) => {
    const i = degree + step;
    return scale[i % 7] + Math.floor(i / 7) * 12;
  });

names.forEach((name, degree) => {
  const notes = chordOn(degree);
  const shape = notes.map((n) => n - notes[0]);
  const quality =
    shape[1] - shape[0] === 4
      ? "major"
      : shape[2] - shape[0] === 6
        ? "diminished"
        : "minor";
  console.log(\`\${name} \${quality.padEnd(11)} \${notes.join(" ")}\`);
  notes.forEach((n) => note(midiToFreq(n), degree * 1.5, 1.3));
});`}),e.jsx("p",{className:"mtp-para",children:"没人挑选过这些性质。三个出来是大三，三个出来是小三，最后一个出来是减三——这个模式被音阶的不均匀间距强制决定。在相邻间距「先 4 后 3」的音级上起建，得到大三和弦；「先 3 后 4」，得到小三。"}),e.jsx("p",{className:"mtp-para",children:"音乐家把这七个写成罗马数字：大写大、小写小、减三加个小圈。"}),e.jsx("div",{className:"mtp-note",style:{textAlign:"center",fontSize:17,letterSpacing:"0.08em"},children:"I　ii　iii　IV　V　vi　vii°"}),e.jsxs("p",{className:"mtp-para",children:["这个记法在做一件有用的事，我过了很久才注意到它在做什么：它按「在音阶中的位置」描述和弦，而不按名字。V 和弦是「建立在第五音级上的和弦」，无论你在什么调——这是",e.jsx("strong",{children:"相对寻址"}),"。用罗马数字写的和弦谱是与调无关的源码，移调就是加一个常数："]}),e.jsx(s,{run:a,caption:"罗马数字是相对寻址",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const build = (root, p) =>
  p.reduce((n, s) => [...n, n.at(-1) + s], [root]);

function chordsInKey(root) {
  const scale = build(root, [2, 2, 1, 2, 2, 2, 1]).slice(0, 7);
  return (degree) =>
    [0, 2, 4].map((step) => {
      const i = degree - 1 + step;
      return scale[i % 7] + Math.floor(i / 7) * 12;
    });
}

// 同四个级数，在两个不同的调上演奏。
const progression = [1, 5, 6, 4];

[60, 65].forEach((key, k) => {
  const chord = chordsInKey(key);
  progression.forEach((numeral, i) => {
    chord(numeral).forEach((n) =>
      note(midiToFreq(n), k * 7 + i * 1.6, 1.5),
    );
  });
});`}),e.jsx("p",{className:"mtp-para",children:"同一形状，两个起始音，你的耳朵认出这是同一首音乐——这正是该记法存在的全部理由。"}),e.jsx("h2",{className:"mtp-h2",id:"s10",children:"张力与解决"}),e.jsx("p",{className:"mtp-para",children:"单个和弦只是一种声响。音乐是当你把它们排序后发生的事，而顺序有意义。有的序列感觉「到了」，有的感觉「是个问题」。"}),e.jsx("p",{className:"mtp-para",children:"整个系统里最强的拉力是 V 回 I，背后有两个具体原因。"}),e.jsx(s,{run:a,caption:"V 对 I 的拉力",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const play = (notes, at, len = 1.6) =>
  notes.forEach((n) => note(midiToFreq(n), at, len));

const C = [60, 64, 67]; // I
const G7 = [55, 59, 62, 65]; // V7

play(G7, 0, 1.8);
play(C, 2, 2.2);

console.log("B 是", 59, "而 C 是", 60, "- 相距一个半音");
console.log("F 是", 65, "而 E 是", 64, "- 相距一个半音");`}),e.jsxs("p",{className:"mtp-para",children:["第一，B 音在 V 和弦里，位于 I 根音下方一个半音。离目的地这么近的音，听起来像倚在门上。音乐家叫它",e.jsx("strong",{children:"导音（leading tone）"}),"，干的是悬念结尾的活。"]}),e.jsxs("p",{className:"mtp-para",children:["第二，属七和弦同时包含 B 和 F，它们相距六个半音。六半音是",e.jsx("strong",{children:"三全音（tritone）"}),"，恰好半个八度：2",e.jsx("sup",{children:"6/12"})," 是 2 的平方根——正是我们之前听到的那个无理比例。整个系统里最不稳定的音程，坐在和弦内部，当进行到 I 时，它的两个音各自向相反方向解决一个半音。张力不是比喻，是一个具体的无理比例被简单比例替换的过程。"]}),e.jsx("p",{className:"mtp-para",children:"整个「张力—释放」的语言都建立在这个机制上。下面是几个你听过一万遍的进行："}),e.jsx(s,{run:a,caption:"四个你已经认识的进行",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const build = (root, p) =>
  p.reduce((n, s) => [...n, n.at(-1) + s], [root]);

const scale = build(60, [2, 2, 1, 2, 2, 2, 1]).slice(0, 7);
const chord = (degree) =>
  [0, 2, 4].map((step) => {
    const i = degree - 1 + step;
    return scale[i % 7] + Math.floor(i / 7) * 12;
  });

const progressions = {
  "I  V  vi IV": [1, 5, 6, 4],
  "ii V  I": [2, 5, 1],
  "I  vi IV V": [1, 6, 4, 5],
  "vi IV I  V": [6, 4, 1, 5],
};

let when = 0;
Object.entries(progressions).forEach(([name, degrees]) => {
  console.log(
    name,
    "->",
    degrees.map((d) => chord(d).join("/")).join("  "),
  );
  degrees.forEach((d, i) => {
    chord(d).forEach((n) => note(midiToFreq(n), when + i * 1.1, 1));
  });
  when += degrees.length * 1.1 + 0.9;
});`}),e.jsx("p",{className:"mtp-para",children:"I V vi IV 是数量惊人的流行乐的根基四和弦。ii V I 是爵士的脊柱。vi IV I V 是第一个的四和弦转了个圈、从更悲伤的地方开始。"}),e.jsx("p",{className:"mtp-para",children:"改这些数组。1 到 7 里几乎任何数字序列都能成立，因为每个和弦都由同样七个音构建。一个调给了你一个「错误答案难以触及」的约束空间。结束在 1 听起来完整，结束在 5 听起来还有下一句，结束在 7 听起来出了事。"}),e.jsx("h2",{className:"mtp-h2",id:"s11",children:"记谱法是一种序列化格式"}),e.jsx("p",{className:"mtp-para",children:"前文没有一样东西需要五线谱。上面的一切都是整数数组和把数组变成频率的函数。"}),e.jsxs("p",{className:"mtp-para",children:["但记谱法存在，它是整个西方音乐文献的存储格式，而一旦你已经知道它编码的是什么，就会发现它其实是个相当合理的设计——带着一些非常古老的约束。它是一种",e.jsx("strong",{children:"序列化格式"}),"，写在印刷还很贵的年代，为「一边读、手上还忙着演奏的实时人类读者」优化，而且从未被修订，因为安装基数太大了。"]}),e.jsx("p",{className:"mtp-para",children:"这是 C 大调音阶，和之前同样的七个整数。纵轴是音高，但不是线性的。每条线、每个间是音阶上的一步，所以相邻位置有时差两个半音、有时差一个。这个轴是「自然音阶（diatonic）」的而非「半音（chromatic）」的：它按音阶步进而非全部十二音步进——也就是说，它展示的是伪装成音高的音级。这就是为什么大调音阶在纸上是一条无聊的直线爬升，听起来却像世上最自然的序列。这个格式为它预期的情况做了优化。"}),e.jsx("p",{className:"mtp-para",children:"谱号声明原点。一张五线谱的五条线没有任何东西把它钉在某个频率上，所以开头的符号告诉你你在哪。高音谱号是个程式化的 G，卷曲缠住代表 G 的那根线；低音谱号是程式化的 F，两个点夹着 F 线。这是一个把原点标在页边的坐标系——同一页面上同一形状，换谱号，低一个八度演奏。两个谱号覆盖了人类实际演唱演奏的范围，所以是两个不是二十个。"}),e.jsx("p",{className:"mtp-para",children:"变音记号是丢损编码的补丁。每八度七个纵向位置，要表示十二个音。升、降、还原记号是逃生舱，每一个都是「把这个位置本来表示的音移一下」的指令。"}),e.jsx("p",{className:"mtp-para",children:"调号是 DRY。一首曲子如果是 D 大调，它的音阶含 F# 和 C#，曲中每个 F 和 C 都得标升号。所以你在每行开头声明一次，一直有效直到另有说明。这是被提升到文件顶部的常量。注意那两个升号仍在被演奏，只是不再逐音书写。这也解释了为什么乐谱在你演奏任何东西之前就告诉你调性，为什么音乐家说一首曲子「在某个调里」——调在头部，不在正文。"}),e.jsx("p",{className:"mtp-para",children:"时值是 2 的幂。全音符、二分、四分、八分、十六分。每个是上一个的一半，记谱法把指数编码成视觉：空心符头，然后符干，然后每减半加一条符尾。这是二元指数的一元编码，一种非常中世纪的存数方式，一眼绝不可能看错。2 的幂走不了所有地方，所以还有一个算子：符头后的附点把长度乘以 1.5，双附点乘以 1.75。这是写作标点符号的二进制小数。"}),e.jsx("p",{className:"mtp-para",children:"但这些时值都不是时间。它们是拍，拍只在固定速度之后才变成秒："}),e.jsx(s,{run:a,caption:"在你指定之前，拍不是秒",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);

const bpm = 120;
const beat = 60 / bpm;

// [MIDI 音, 拍数]
const melody = [
  [60, 1],
  [62, 1],
  [64, 2],
  [65, 0.5],
  [67, 0.5],
  [69, 3],
];

let when = 0;
melody.forEach(([n, beats]) => {
  note(midiToFreq(n), when, beats * beat * 0.95);
  when += beats * beat;
});

console.log("total:", when.toFixed(2), "seconds at", bpm, "bpm");`}),e.jsx("p",{className:"mtp-para",children:"把 bpm 改成 200，同一数组是同一支曲子，更快。这个分离是乐谱可移植的全部原因：它存储相对时值，演奏者提供时钟。"}),e.jsx("p",{className:"mtp-para",children:"拍号给拍分组。4/4 是每小节四个四分拍，3/4 是三个，竖小节线是给眼睛在页面上定位用的。这主要是可读性特性，但也携带一个真实的音乐主张：每组第一拍是强拍。同样六个音按三分组和按两分组，是两首不同的音乐。"}),e.jsx("p",{className:"mtp-para",children:"这就是全部了。一个带原点和逃生舱的自然音阶纵轴，以 2 的负幂表示的时值，加上几个头部字段。乐谱页面上其余的一切都是叠加其上的演奏指示：多响、多连、用哪根手指。"}),e.jsx("h2",{className:"mtp-h2",id:"s12",children:"综合运用"}),e.jsx("p",{className:"mtp-para",children:"以上的一切放在一处。一个调、它的调内和弦、一个进行、这些和弦逐音拆成的琶音，和一条贴着音阶的旋律。约四十行，无库——这是我用代码做出的第一个我会称为「音乐」而非「演示」的东西："}),e.jsx(s,{run:a,caption:"一个调、一个进行、一支曲子",code:`const midiToFreq = (n) => 440 * 2 ** ((n - 69) / 12);
const build = (root, p) =>
  p.reduce((n, s) => [...n, n.at(-1) + s], [root]);

const key = 57; // A
const scale = build(key, [2, 1, 2, 2, 1, 2, 2]).slice(0, 7); // 自然小调
const bpm = 104;
const beat = 60 / bpm;

const chord = (degree) =>
  [0, 2, 4].map((step) => {
    const i = degree - 1 + step;
    return scale[i % 7] + Math.floor(i / 7) * 12;
  });

const progression = [1, 6, 3, 7];
const melody = [0, 2, 4, 2, 3, 2, 1, 0, 4, 3, 2, 1, 0, 2, 1, 0];

progression.forEach((degree, bar) => {
  const at = bar * 4 * beat;
  const notes = chord(degree);

  // 强拍上的低音。
  note(midiToFreq(notes[0] - 12), at, beat * 3.6, "triangle");

  // 琶音：上-下-上，跨小节。
  [0, 1, 2, 1, 0, 1, 2, 1].forEach((which, i) => {
    note(midiToFreq(notes[which]), at + i * beat * 0.5, beat * 0.45);
  });

  // 旋律，每小节四音，永远取自音阶。
  melody.slice(bar * 4, bar * 4 + 4).forEach((step, i) => {
    note(
      midiToFreq(scale[step % 7] + 12),
      at + i * beat,
      beat * 0.9,
      "triangle",
    );
  });
});`}),e.jsxs("p",{className:"mtp-para",children:["那里的每个数字都意味着我们推导过的东西。",e.jsx("span",{className:"mono",children:"57"})," 是 A，因为 2 的 12 次方根和一支音叉。",e.jsx("span",{className:"mono",children:"[2,1,2,2,1,2,2]"})," 是小调，因为它是大调转五圈。",e.jsx("span",{className:"mono",children:"[0,2,4]"})," 是和弦，因为相距两个音级的音泛音重叠。",e.jsx("span",{className:"mono",children:"[1,6,3,7]"})," 听起来像去了什么地方，因为张力坐在那里。"]}),e.jsxs("p",{className:"mtp-para",children:["把调改成 60，它就移调了。把音阶模式改成 ",e.jsx("span",{className:"mono",children:"[2,2,1,2,2,2,1]"}),"，同一支曲子变欢快。把旋律数组改成任何东西，它仍然合得上——因为它在索引音阶而非挑选频率，而这个约束正承担着乐理的全部职责。"]}),e.jsx("h2",{className:"mtp-h2",id:"s13",children:"我仍然不懂的东西"}),e.jsx("p",{className:"mtp-para",children:"相当多。本文覆盖的是音高，几乎不含其他——而音高可能是容易的那一半。"}),e.jsx("p",{className:"mtp-para",children:"节奏我几乎没碰，而读到的一切都暗示它比看起来深。声部进行（voice leading）——和弦间用最小距离移动而非跳来跳去的学问——是书面的音乐从「正确」变成「好听」的地方，我能陈述规则却听不出为什么有效。为什么旋律想落在它落的地方，对我也仍基本不透明。而上面这整套，只是一个传统的答案。大量音乐用别的方式切分八度，或者根本不把八度当作单位，它们都没有错。"}),e.jsx("p",{className:"mtp-para",children:"但我不再觉得自己在被要求背诵冷知识。十二个音是素数 2 与 3 之间谈成的舍入误差。音阶是为了让间距不均匀到可以导航而选出的子集。和弦是泛音本来就一致的音。调是相对寻址。记谱法是带头部的序列化格式。它们每一个都是正常的工程决策——很久以前、在约束之下做出的，而只要你去找，理由还在那里。"}),e.jsxs("p",{className:"mtp-para",children:["如果你想继续深入：让我动笔写这篇的两样东西是 Eevee 的"," ",e.jsx("a",{href:"https://eev.ee/blog/2016/09/15/music-theory-for-nerds/",target:"_blank",rel:"noreferrer",style:{color:"var(--accent)"},children:"Music Theory for Nerds"})," ","和 ",e.jsx("a",{href:"https://www.lightnote.co/",target:"_blank",rel:"noreferrer",style:{color:"var(--accent)"},children:"LightNote"}),"。API 方面，MDN 的 Web Audio 文档出奇地好。"]}),e.jsxs("p",{className:"mtp-para",children:["本文所有示例都是无依赖的纯 JavaScript，有浏览器引擎的地方都能跑。如果你想继续拽这根线，",e.jsx("a",{href:"https://runjs.app",target:"_blank",rel:"noreferrer",style:{color:"var(--accent)"},children:"RunJS"})," 是一个 JavaScript 游乐场，无需任何配置就能实验这样的代码，开箱即用 Web Audio API。把上面任何片段贴进去，顶部加上 ",e.jsx("span",{className:"mono",children:"const ctx = new AudioContext()"})," 和 ",e.jsx("span",{className:"mono",children:"const out = ctx.destination"}),"，继续。"]})]})}export{k as default};
