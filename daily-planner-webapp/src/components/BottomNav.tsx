import React from 'react'
import { HomeIcon as HomeOutline, CalendarIcon, Squares2X2Icon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeSolid } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { press } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'
import { useTranslation } from 'react-i18next'

type BottomNavProps = {
  active?: 'home' | 'tasks' | 'calendar' | 'analytics'
  onNavigate?: (view: string) => void
}

export default function BottomNav({ active='home', onNavigate }: BottomNavProps) {
  const { t } = useTranslation()
  const items = [
    { key: 'home', icon: <HomeOutline className="w-6 h-6" />, label: 'home' },
    { key: 'tasks', icon: <Squares2X2Icon className="w-6 h-6" />, label: 'tasks' },
    { key: 'calendar', icon: <CalendarIcon className="w-6 h-6" />, label: 'calendar' },
    { key: 'analytics', icon: <Squares2X2Icon className="w-6 h-6" />, label: 'analytics' }
  ]

  const reduced = useReducedMotion()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-xl rounded-2xl px-3 py-2 flex justify-between items-center card-glass" style={{ backdropFilter: 'blur(10px)' }}>
      {items.map(it => {
        const isActive = active === it.key
        return (
          <motion.button key={it.key} onClick={() => onNavigate?.(it.key)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg min-w-[64px] ${isActive ? 'text-blue-400' : 'text-muted'}`} whileTap={reduced ? undefined : 'press'} variants={reduced ? undefined : press} initial={reduced ? undefined : 'rest'}>
            <div className="mb-0.5">
              {it.key === 'home' ? (isActive ? <HomeSolid className="w-6 h-6 text-blue-400" /> : <HomeOutline className="w-6 h-6" />) : it.icon}
            </div>
            <span className={`text-xs ${isActive ? 'text-blue-400 font-semibold' : ''}`}>{t(it.label)}</span>
          </motion.button>
        )
      })}
    </nav>
  )
}
