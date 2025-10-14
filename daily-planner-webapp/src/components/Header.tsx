import React from 'react'
import { motion } from 'framer-motion'
import { pop, press } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'
import { Settings, Share2, Expand } from 'lucide-react'

type HeaderProps = {
  userName?: string
  streak?: number
  onOpenSettings: () => void
  onShare: () => void
  onExpand: () => void
}

export default function Header({
  userName,
  streak = 0,
  onOpenSettings,
  onShare,
  onExpand,
}: HeaderProps) {
  const reduced = useReducedMotion()

  return (
  <header className="w-full px-4 pt-6 pb-2 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Daily Planner
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-300">
            {userName ? `Salut, ${userName}!` : 'Salut! Ready for today?'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center mr-3">
          <motion.div key={streak} initial={reduced ? undefined : 'hidden'} animate={reduced ? undefined : 'visible'} variants={reduced ? undefined : pop} className="px-3 py-1 rounded-full card-glass text-amber-700 text-sm font-medium shadow-sm" title="Streak">
            🔥 {streak}
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
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
