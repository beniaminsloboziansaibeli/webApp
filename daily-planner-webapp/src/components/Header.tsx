import React from 'react'
import { motion } from 'framer-motion'
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
          <motion.div
            key={streak}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 text-sm font-medium shadow-sm"
            title="Streak"
          >
            🔥 {streak}
          </motion.div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            onClick={onOpenSettings}
            aria-label="Settings"
            className="p-2 rounded-lg bg-white/70 dark:bg-slate-700/60 hover:shadow-md"
            title="Settings"
          >
            <Settings size={18} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            onClick={onShare}
            aria-label="Share"
            className="p-2 rounded-lg bg-white/70 dark:bg-slate-700/60 hover:shadow-md"
            title="Share tasks"
          >
            <Share2 size={18} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            onClick={onExpand}
            aria-label="Expand"
            className="p-2 rounded-lg bg-white/70 dark:bg-slate-700/60 hover:shadow-md"
            title="Expand"
          >
            <Expand size={18} />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
