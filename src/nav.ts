export interface NavItem {
  to: string
  label: string
  icon: string
  desc: string
}

export const NAV: NavItem[] = [
  { to: '/', label: '首页', icon: '◆', desc: '学习地图与进度' },
  { to: '/theory', label: '乐理基础', icon: '♪', desc: '系统乐理知识' },
  { to: '/guitar', label: '吉他专区', icon: '🎸', desc: '指板与和弦' },
  { to: '/games', label: '互动游戏', icon: '⚡', desc: '听辨与速记' },
  { to: '/showcase', label: '技术展柜', icon: '🧪', desc: '音乐 JS 库演示' },
  { to: '/about', label: '关于', icon: 'ℹ', desc: '项目与资源' },
]
