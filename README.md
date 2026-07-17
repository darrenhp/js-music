# js-music · 交互式音乐理论学习网站

> 源码仓库：[github.com/darrenhp/js-music](https://github.com/darrenhp/js-music)

面向零基础到进阶自学者的现代化、深色主题音乐理论学习单页应用（SPA）。
覆盖**系统性乐理知识、吉他专项、互动听辨小游戏、音乐 JS 库实时展柜**四大方向，
所有发声交互均绑定用户手势触发，进度通过 `localStorage` 持久化。

> 技术栈：React 18 + Vite 5 + TypeScript 5。
> 音频：Tone.js（合成与调度）、@tonejs/midi（MIDI 播放）；乐理计算：Tonal.js；
> 五线谱渲染：VexFlow；波形展示：wavesurfer.js。

---

## ✨ 特性速览

- **首页 / 学习地图** — 可视化知识树（乐理基础 → 和声进阶 → 吉他实战），含学习进度与连续打卡天数等游戏化元素。
- **乐理基础** — 9 个知识点，统一「讲解 → 可视化 → 即时小测验」三段式；音高/音程/和弦页含真实可点击发声示例。
- **吉他专区** — 交互式指板（点击发声 / 音名显隐切换）、常用和弦图、CAGED 把位图、Tab 谱读法。
- **互动小游戏** — 6 个全部完整可玩：音程听辨、和弦听辨、五线谱视奏、指板速记、节奏跟打、和弦进行听辨；统一计分 / 难度 / 错题回顾 / 历史最高分。
- **技术展柜** — Tone.js、Tonal.js、VexFlow、@tonejs/midi、wavesurfer.js 各一子页签，均真实调用对应库。
- **关于 / 资源** — 项目说明与外部学习资源推荐。
- **体验细节** — 深色主题 + 单一强调色（琥珀/紫/薄荷可切换）、移动端底部 Tab 栏、卡片展开 / hover / 判定微动画。

---

## 🚀 本地构建与启动

### 环境要求
- Node.js **≥ 20**（推荐 22 LTS），npm 9+
- 现代浏览器（Chrome / Edge / Firefox / Safari），需支持 Web Audio API

### 安装依赖
```bash
npm install
```

### 常用脚本

| 脚本 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（默认 `http://localhost:5173`），热更新 |
| `npm run build` | 类型检查 + 生产构建，产物输出到 `dist/`（base 为根路径 `/`） |
| `npm run build:pages` | 以 GitHub Pages 子路径 `/js-music/` 为 base 的生产构建（`GH_PAGES=1`） |
| `npm run preview` | 本地预览**生产构建**产物（`http://localhost:4173`） |
| `npm run typecheck` | 仅做 TypeScript 类型检查，不产出文件 |

### 典型流程
```bash
# 1) 本地开发
npm run dev

# 2) 提交前做类型检查 + 生产构建验证
npm run build

# 3) 本地像线上一样预览构建结果
npm run preview
```

> 首次点击任意发声按钮会解锁浏览器的 AudioContext（浏览器策略要求音频必须由用户手势触发）。

---

## 🌐 通过 GitHub Pages 部署

项目使用 **HashRouter**（`/#/theory` 形式），因此部署到 GitHub Pages 子路径后刷新**不会 404**，无需额外配置 `basename` 或 404 兜底页。

### 方式一：GitHub Actions 自动部署（推荐）

仓库已内置工作流 [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)，推送 `main` 分支或手动 `workflow_dispatch` 即自动构建并部署。

**首次运行的必要前置：**

`actions/configure-pages@v5` **不会**自动开通 Pages，且工作流 `permissions` 块无法授予
`administration` 权限（GitHub 的 schema 不认该键），因此**必须先在仓库里手动开通一次**：

1. 进入仓库 **Settings → Pages → Build and deployment → Source 选择「GitHub Actions」**，保存。
2. 之后任意一次 push 到 `main` 或手动 `workflow_dispatch` 都会自动构建并部署。

> 仅首次需要手动开通；开通后 CI 即可自行完成部署，无需再改任何配置。

部署成功后，站点地址为：

```
https://<你的用户名>.github.io/js-music/
```

### 方式二：手动部署

```bash
# 以 Pages 子路径构建
npm run build:pages

# 把 dist/ 内容推到 gh-pages 分支，或用 actions/deploy-pages 上传
```

> 注意：`build:pages` 会把资源路径写成 `/js-music/assets/...`。
> 若你把仓库改名为其他路径，需同步修改 `vite.config.ts` 里 `GH_PAGES` 时的 base 值。

---

## 📁 目录结构

```
js-music/
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── src/
│   ├── audio/AudioEngine.ts        # Tone.js 封装：手势解锁 / 键盘 / 拨弦 / 和弦 / 节拍器
│   ├── components/                 # 可复用可视化组件（Keyboard / StaffCanvas / Fretboard / ChordDiagram ...）
│   ├── data/                       # 数据驱动的知识点与游戏配置（theory / guitar / games）
│   ├── lib/theory.ts               # Tonal.js 封装的乐理计算
│   ├── modules/                    # 六大模块页面（home / theory / guitar / games / showcase / about）
│   ├── store/useProgress.ts        # localStorage 学习进度 / 打卡 / 最高分
│   ├── styles/                     # tokens.css（设计令牌）+ global.css
│   ├── App.tsx                     # 路由（HashRouter + 路由级懒加载）
│   └── main.tsx
├── vite.config.ts                  # base 条件切换 + 重型库 vendor 分包
└── package.json
```

---

## 📝 其他说明

- **路由懒加载**：theory / guitar / games / showcase / about 均 `React.lazy` 加载，tone / vexflow / tonal / midi / wavesurfer 拆为独立 vendor chunk，首屏仅加载首页与外壳。
- **`.nojekyll`**：仓库根目录含 `.nojekyll`，防止 GitHub Pages 用 Jekyll 处理下划线开头的资源目录。
- 所有交互式发声 demo 均要求用户先产生点击/触摸手势，以满足浏览器自动播放策略。
