import { useState, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  icon: (active: boolean) => ReactNode
}

interface BottomTabBarProps {
  tabs: Tab[]
  activeTab: string
  centerTabId: string
  onChange: (id: string) => void
}

export function BottomTabBar({ tabs, activeTab, centerTabId, onChange }: BottomTabBarProps) {
  const [tapCount, setTapCount] = useState(0)

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-6 border-t border-border bg-surface px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const isCenter = tab.id === centerTabId

        if (isCenter) {
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onChange(tab.id)
                setTapCount((n) => n + 1)
              }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex h-16 w-16 items-center justify-center rounded-full shadow-soft-lg transition-all duration-300 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)] ${
                isActive
                  ? '-translate-y-7 scale-110 bg-brand text-white'
                  : '-translate-y-4 scale-100 bg-brand-soft text-brand-strong'
              }`}
            >
              <span key={tapCount}>{tab.icon(isActive)}</span>
            </button>
          )
        }

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? 'page' : undefined}
            className={`flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors duration-200 ${
              isActive ? 'bg-brand-soft text-brand-strong' : 'text-ink-muted'
            }`}
          >
            {tab.icon(isActive)}
            <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}