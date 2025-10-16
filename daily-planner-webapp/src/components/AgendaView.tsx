import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { motion } from 'framer-motion'
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

  return (
    <div className="mt-4">
      <WeeklyMood moods={moods} />
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrent(subWeeks(current,1))} className="p-2 rounded btn-glass">‹</button>
          <div className="text-lg font-semibold">Week of {format(start, 'PPP')}</div>
          <button onClick={() => setCurrent(addWeeks(current,1))} className="p-2 rounded btn-glass">›</button>
        </div>
        <div>
          <button onClick={() => setCurrent(new Date())} className="px-3 py-1 rounded btn-primary text-white">Today</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <motion.div key={day.toISOString()} className="p-3 rounded-lg glass-task min-h-[120px]" onDragOver={onDragOver} onDrop={(e) => onDropTo(e, day)} aria-label={`Column for ${format(day,'EEEE')}`} whileTap={reduced ? undefined : { scale: 0.995 }}>
            <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
              <div>{format(day,'EEE d')}</div>
              <div className="text-lg">{moods?.[format(day,'yyyy-MM-dd')]?.emoji}</div>
            </div>
            <div className="space-y-2">
              {tasksFor(day).length === 0 ? <div className="text-sm text-gray-400">{t('noTasks')}</div> : tasksFor(day).map(t => (
                <div key={t.id} draggable onDragStart={(e) => onDragStart(e,t.id)}>
                  <TaskItem task={t} onToggle={() => onUpdate(t.id,{completed: !t.completed})} onDelete={() => onDelete(t.id)} onEdit={(patch) => onUpdate(t.id,patch)} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
