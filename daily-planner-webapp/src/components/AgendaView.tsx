import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Clock } from 'lucide-react'
import { cardEnter } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'
import { Task } from '../types'
import WeeklyMood from './WeeklyMood'
import { MoodRecord } from '../utils/storage'
import TaskItem from './TaskItem'

type AgendaViewProps = {
  tasks: Task[]
  onUpdate: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
  moods?: Record<string,MoodRecord>
}

export default function AgendaView({ tasks, onUpdate, onDelete, moods }: AgendaViewProps) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState<Date>(new Date())
  const start = startOfWeek(current)
  const days = useMemo(() => {
    const arr: Date[] = []
    for (let i = 0; i < 7; i++) arr.push(addDays(start, i))
    return arr
  }, [start])

  const tasksFor = (d: Date) => tasks.filter(t => t.date === format(d, 'yyyy-MM-dd')).sort((a,b) => (a.time || '').localeCompare(b.time || ''))

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDropTo = (e: React.DragEvent, day: Date) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/plain')
    if (!id) return
    try {
      onUpdate(id, { date: format(day, 'yyyy-MM-dd') })
    } catch (err) { console.warn(err) }
  }

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }

  const reduced = useReducedMotion()

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  return (
    <div className="mt-4">
      <WeeklyMood moods={moods} />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrent(subWeeks(current,1))} className="p-2 rounded btn-glass">‹</button>
          <div className="text-lg font-semibold">{t('week_of')} {format(start, 'PPP')}</div>
          <button onClick={() => setCurrent(addWeeks(current,1))} className="p-2 rounded btn-glass">›</button>
        </div>
        <div>
          <button onClick={() => setCurrent(new Date())} className="px-3 py-1 rounded btn-primary text-white">{t('today')}</button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div />
        <div className="flex items-center gap-2">
          <button onClick={() => {
            const next: Record<string, boolean> = {}
            days.forEach(d => { next[format(d,'yyyy-MM-dd')] = true })
            setExpanded(next)
          }} className="px-3 py-1 rounded btn-glass">{t('expand_all')}</button>
          <button onClick={() => setExpanded({})} className="px-3 py-1 rounded btn-glass">{t('collapse_all')}</button>
        </div>
      </div>

      <div className="space-y-3">
        {days.map(day => {
          const key = format(day,'yyyy-MM-dd')
          const dayTasks = tasksFor(day)
          const isExpanded = !!expanded[key]
          return (
            <motion.div key={key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="p-3 rounded-lg glass-task">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{format(day,'EEEE, MMM d')}</div>
                  <div className="text-lg">{moods?.[key]?.emoji}</div>
                </div>
                <div className="text-sm text-gray-500">{dayTasks.length > 0 ? `${dayTasks.length} ${t('tasks_count')}` : t('no_tasks_short')}</div>
              </div>

              <div className="mt-3">
                <button onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))} className="w-full text-left p-3 rounded btn-glass">
                  {!isExpanded ? (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">{dayTasks.length > 0 ? dayTasks.slice(0,2).map(t => <span key={t.id} className="mr-2">{t.time ? `${t.time} ` : ''}{t.title}</span>) : <span className="text-gray-400">{t('noTasks')}</span>}</div>
                      <div className="text-xs text-gray-500">{t('expand')}</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {dayTasks.length === 0 ? <div className="text-sm text-gray-400">{t('noTasks')}</div> : dayTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-2 rounded glass-soft">
                              <div className="text-sm flex items-center gap-2">
                                {task.time ? <span className="text-xs text-gray-400">{task.time}</span> : null}
                                <span>{task.title}</span>
                                {typeof task.timeSpentMinutes === 'number' && (
                                  <span className="ml-2 px-2 py-0.5 rounded text-[11px] bg-white/6 text-sm flex items-center gap-1"><Clock size={12} /> {task.timeSpentMinutes}m</span>
                                )}
                              </div>
                              <div className="text-sm">
                                {task.completed ? <Check size={16} className="text-green-400" /> : <ArrowRight size={16} className="text-gray-400" />}
                              </div>
                            </div>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
