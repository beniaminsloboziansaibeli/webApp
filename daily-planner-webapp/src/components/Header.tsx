import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { pop, press } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'
import { Settings, Share2, Expand, Sun, Moon } from 'lucide-react'

type HeaderProps = {
  userName?: string
  streak?: number
  todayMood?: string
  onOpenSettings: () => void
  onShare: () => void
  onExpand: () => void
  theme?: 'dark' | 'light'
  onToggleTheme?: () => void
}

export default function Header({
  userName,
  streak = 0,
  todayMood,
  onOpenSettings,
  onShare,
  onExpand,
  theme = 'dark',
  onToggleTheme,
}: HeaderProps) {
  const reduced = useReducedMotion()
  const { t } = useTranslation()

  return (
  <header className="w-full px-4 pt-6 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold" style={{ background: 'linear-gradient(90deg,#7ee8fa,#4cc9f0)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            {t('appTitle')}
          </h1>
          <p className="text-sm text-muted">
            {userName ? t('greeting', { name: userName }) : t('greeting', { name: '' })}
          </p>
        </div>
        {/** today's mood badge placeholder (left side) */}
        {todayMood && (
          <div className="ml-3 text-xl">{todayMood}</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center mr-3">
          <div className="flex items-center gap-2">
            <motion.div key={streak} initial={reduced ? undefined : 'hidden'} animate={reduced ? undefined : 'visible'} variants={reduced ? undefined : pop} className="px-3 py-1 rounded-full card-glass text-amber-700 text-sm font-medium shadow-sm" title="Streak">
              🔥 {streak}
            </motion.div>
            {/** render mood if provided via props */}
            {todayMood && (
              <div className="px-2 py-1 rounded-md bg-white/10 backdrop-blur-sm text-lg">{todayMood}</div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button onClick={() => onToggleTheme?.()} aria-label="Toggle theme" className="p-2 rounded-lg btn-glass" title="Toggle theme" whileTap={reduced ? undefined : 'press'} variants={reduced ? undefined : press} initial={reduced ? undefined : 'rest'}>
            {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>

          <motion.button onClick={onOpenSettings} aria-label="Settings" className="p-2 rounded-lg btn-glass" title="Settings" whileTap={reduced ? undefined : 'press'} variants={reduced ? undefined : press} initial={reduced ? undefined : 'rest'}>
            <Settings size={18} />
          </motion.button>

          <motion.button onClick={onShare} aria-label="Share" className="p-2 rounded-lg btn-glass" title="Share tasks" whileTap={reduced ? undefined : 'press'} variants={reduced ? undefined : press} initial={reduced ? undefined : 'rest'}>
            <Share2 size={18} />
          </motion.button>

          <motion.button onClick={onExpand} aria-label="Expand" className="p-2 rounded-lg btn-glass" title="Expand" whileTap={reduced ? undefined : 'press'} variants={reduced ? undefined : press} initial={reduced ? undefined : 'rest'}>
            <Expand size={18} />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
