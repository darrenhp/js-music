import type { AccentName } from '../store/useProgress'

const OPTIONS: { name: AccentName; color: string }[] = [
  { name: 'amber', color: '#F5A623' },
  { name: 'purple', color: '#8B5CF6' },
  { name: 'mint', color: '#34D399' },
]

export default function AccentSwitcher({ current, onChange }: { current: AccentName; onChange: (n: AccentName) => void }) {
  return (
    <div className="accent-switch" role="group" aria-label="主题色切换">
      {OPTIONS.map((o) => (
        <span
          key={o.name}
          className="accent-dot"
          data-on={current === o.name}
          style={{ background: o.color }}
          onClick={() => onChange(o.name)}
          aria-label={o.name}
          role="button"
        />
      ))}
    </div>
  )
}
