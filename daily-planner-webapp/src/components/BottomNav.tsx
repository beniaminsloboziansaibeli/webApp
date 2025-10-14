import React from 'react'
import { HomeIcon, CalendarIcon, Squares2X2Icon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { press } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'

type BottomNavProps = {
  active?: 'today' | 'calendar' | 'agenda' | 'settings'
  onNavigate?: (view: string) => void
}

export default function BottomNav({ active='today', onNavigate }: BottomNavProps) {
  const items = [
    { key: 'today', icon: <HomeIcon className="w-5 h-5" />, label: 'Today' },
    { key: 'calendar', icon: <CalendarIcon className="w-5 h-5" />, label: 'Calendar' },
    { key: 'agenda', icon: <Squares2X2Icon className="w-5 h-5" />, label: 'Agenda' },
    { key: 'settings', icon: <Cog6ToothIcon className="w-5 h-5" />, label: 'Settings' }
  ]

  const reduced = useReducedMotion()

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-xl rounded-2xl px-3 py-2 flex justify-between items-center card-glass" style={{ backdropFilter: 'blur(10px)' }}>
      {items.map(it => (
        <motion.button key={it.key} onClick={() => onNavigate?.(it.key)} className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg min-w-[64px] ${active === it.key ? 'bg-primary/10 text-primary' : 'text-muted'}`} whileTap={reduced ? undefined : 'press'} variants={reduced ? undefined : press} initial={reduced ? undefined : 'rest'}>
          {it.icon}
          <span className="text-xs">{it.label}</span>
        </motion.button>
      ))}
    </nav>
  )
}
