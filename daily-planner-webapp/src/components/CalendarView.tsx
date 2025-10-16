import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths, addWeeks } from 'date-fns'
import { motion } from 'framer-motion'
import { cardEnter } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'
import { Task } from '../types'
import { MoodRecord } from '../utils/storage'
import TaskItem from './TaskItem'
import AddTaskForm from './AddTaskForm'
import EditTaskModal from './EditTaskModal'

type CalendarViewProps = {
  tasks: Task[]
  onAdd: (title: string, time?: string, priority?: Task['priority'], date?: string) => void
  onUpdate: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
  moods?: Record<string,MoodRecord>
}

export default function CalendarView({ tasks, onAdd, onUpdate, onDelete, moods }: CalendarViewProps) {
  const { t } = useTranslation()
  const [current, setCurrent] = useState<Date>(new Date())
  const [selected, setSelected] = useState<Date>(new Date())
  const [reportOpen, setReportOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'month' | 'week'>('month')
  const [showPast, setShowPast] = useState<boolean>(true)
  const [showMoods, setShowMoods] = useState<boolean>(true)
  const [editing, setEditing] = useState<Task | null>(null)

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const weeks = useMemo(() => {
    const days = [] as Date[]
    let day = startDate
    while (day <= endDate) {
      days.push(day)
      day = addDays(day, 1)
    }
    const rows: Date[][] = []
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7))
    return rows
  }, [startDate, endDate])

  // Week view helper (returns a single-row 7-day window around current week)
  const weekOnly = useMemo(() => {
    const start = startOfWeek(current)
    const days: Date[] = []
    let d = start
    for (let i = 0; i < 7; i++) { days.push(d); d = addDays(d, 1) }
    return [days]
  }, [current])

  const tasksForDate = (d: Date) => {
    const key = format(d, 'yyyy-MM-dd')
    return tasks.filter(t => t.date === key)
  }

  const filteredWeeks = mode === 'month' ? weeks : weekOnly

  const reduced = useReducedMotion()

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => setMode('month')} className={`px-3 py-2 rounded ${mode === 'month' ? 'btn-primary text-white' : 'btn-glass'}`}>Month</button>
          <button onClick={() => setMode('week')} className={`px-3 py-2 rounded ${mode === 'week' ? 'btn-primary text-white' : 'btn-glass'}`}>Week</button>
          <button onClick={() => mode === 'month' ? setCurrent(subMonths(current, 1)) : setCurrent(addWeeks(current, -1))} className="p-2 rounded btn-glass" aria-label="Previous">‹</button>
          <div className="text-lg font-semibold">{mode === 'month' ? format(current, 'MMMM yyyy') : format(current, 'MMM d, yyyy')}</div>
          <button onClick={() => mode === 'month' ? setCurrent(addMonths(current, 1)) : setCurrent(addWeeks(current, 1))} className="p-2 rounded btn-glass" aria-label="Next">›</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => { setCurrent(new Date()); setSelected(new Date()) }} className="px-3 py-1 rounded btn-primary text-white">Today</button>
            <label className="ml-2 text-sm flex items-center gap-2"><input type="checkbox" checked={showPast} onChange={() => setShowPast(s => !s)} /> Show past</label>
          </div>
          <div className="flex items-center gap-3">
            <label className="ml-2 text-sm flex items-center gap-2"><input type="checkbox" checked={showMoods} onChange={() => setShowMoods(s => !s)} /> Show moods</label>
            {/** small mood legend */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">😄</div>
              <div className="flex items-center gap-1">🙂</div>
              <div className="flex items-center gap-1">😐</div>
              <div className="flex items-center gap-1">😞</div>
            </div>
          </div>
          <div className="calendar-legend">
            <div className="item"><span className="priority-dot high pulse" title="High priority" aria-label="High priority"></span><span>High</span></div>
            <div className="item"><span className="priority-dot medium" title="Medium priority" aria-label="Medium priority"></span><span>Medium</span></div>
            <div className="item"><span className="priority-dot low" title="Low priority" aria-label="Low priority"></span><span>Low</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {filteredWeeks.map((week, wi) => (
          <React.Fragment key={wi}>
                {week.map((day) => {
              const inMonth = isSameMonth(day, current)
              const isSel = isSameDay(day, selected)
              const dayTasks = tasksForDate(day)
              const showDay = showPast ? true : (day >= startOfWeek(new Date()))
              return (
                <motion.div key={day.toISOString()} onClick={() => { setSelected(day); setReportOpen(true) }} whileHover={reduced ? undefined : { y: -4 }} whileTap={reduced ? undefined : { scale: 0.98 }} transition={reduced ? undefined : { type: 'spring', stiffness: 300, damping: 26 }} className={`relative p-3 rounded-lg cursor-pointer ${inMonth ? 'glass-task' : 'opacity-40'} ${isSel ? 'ring-2 ring-offset-2 ring-indigo-400' : ''}`} aria-label={`Day ${format(day,'d')}`}>
                  <div className={`w-full h-8 flex items-center justify-center ${isSel ? 'font-semibold' : ''}`}>{format(day,'d')}</div>
                  <div className="mt-2 space-y-1">
                    {dayTasks.slice(0,2).map(t => (
                      <div key={t.id} className="text-[11px] truncate flex items-center gap-2" onClick={(e) => { e.stopPropagation(); setEditing(t) }}>
                        <span className={`priority-dot ${t.priority} ${t.priority === 'high' ? 'pulse' : ''}`} title={`${t.priority} priority`} aria-label={`${t.priority} priority`} />
                        <span className="truncate">{t.time ? `${t.time} ` : ''}{t.title}</span>
                      </div>
                    ))}
                    {/* mood indicator for the day */}
                    {showMoods && moods && moods[format(day,'yyyy-MM-dd')] && (
                      <div className="absolute top-1 right-2 text-lg">{moods[format(day,'yyyy-MM-dd')]?.emoji || moods[format(day,'yyyy-MM-dd')]}</div>
                    )}
                    {dayTasks.length > 2 && <div className="text-[11px] text-gray-400">+{dayTasks.length - 2} {t('more')}</div>}
                  </div>
                </motion.div>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Modal: day mini-report */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setReportOpen(false)} />
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="z-10 w-11/12 max-w-2xl card-glass p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{t('mini_report')} — {format(selected,'PPP')}</div>
                <div className="text-sm text-gray-400">{tasksForDate(selected).length} {t('tasks_planned')}</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-500">{moods && moods[format(selected,'yyyy-MM-dd')] ? moods[format(selected,'yyyy-MM-dd')]?.emoji : '—'}</div>
                <button onClick={() => setReportOpen(false)} className="px-3 py-1 btn-glass">{t('close')}</button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium mb-2">{t('planned')}</div>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {tasksForDate(selected).length === 0 ? <div className="text-sm text-gray-500">{t('no_planned_tasks')}</div> : tasksForDate(selected).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded glass-task">
                      <div className="text-sm"><strong>{t.time ? `${t.time} ` : ''}</strong>{t.title}</div>
                      <div className="text-sm">{t.priority}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">{t('completed')}</div>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {tasksForDate(selected).filter(t => t.completed).length === 0 ? <div className="text-sm text-gray-500">{t('no_completed_tasks')}</div> : tasksForDate(selected).filter(t => t.completed).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-2 rounded glass-task">
                      <div className="text-sm">{t.time ? `${t.time} ` : ''}{t.title}</div>
                      <div className="text-sm">✓</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{t('time_spent')}</div>
                <div className="text-lg font-medium">
                  {(() => {
                    const total = tasksForDate(selected).reduce((s, t) => s + (t.timeSpentMinutes ?? 0), 0)
                    const h = Math.floor(total / 60)
                    const m = total % 60
                    return total > 0 ? `${h > 0 ? `${h}h ` : ''}${m}m` : '—'
                  })()}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">{t('completion')}</div>
                <div className="text-lg font-medium">
                  {(() => {
                    const all = tasksForDate(selected).length
                    const done = tasksForDate(selected).filter(t => t.completed).length
                    return all === 0 ? '—' : `${Math.round((done / all) * 100)}%`
                  })()}
                </div>
                <div className="w-full bg-white/6 rounded h-2 mt-2 overflow-hidden">
                  <motion.div className="h-2 bg-gradient-to-r from-green-400 to-blue-400" initial={{ width: 0 }} animate={{ width: `${(() => {
                    const all = tasksForDate(selected).length
                    const done = tasksForDate(selected).filter(t => t.completed).length
                    return all === 0 ? 0 : Math.round((done / all) * 100)
                  })()}%` }} transition={{ type: 'spring', stiffness: 260, damping: 24 }} />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <AddTaskForm onAdd={(title, time, priority) => onAdd(title, time, priority, format(selected,'yyyy-MM-dd'))} onQuickAdd={() => {}} />
            </div>
          </motion.div>
        </div>
      )}
      <EditTaskModal open={!!editing} task={editing} onClose={() => setEditing(null)} onSave={(id,patch) => { onUpdate(id,patch); setEditing(null) }} onDelete={(id) => { onDelete(id); setEditing(null) }} />
    </div>
  )
}
