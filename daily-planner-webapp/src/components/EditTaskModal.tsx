import React, { useEffect, useState } from 'react'
import { Task } from '../types'
import { useTranslation } from 'react-i18next'

type EditTaskModalProps = {
  open: boolean
  task?: Task | null
  onClose: () => void
  onSave: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
}

export default function EditTaskModal({ open, task, onClose, onSave, onDelete }: EditTaskModalProps) {
  const { t } = useTranslation()
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('low')
  const [timeSpent, setTimeSpent] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setTime(task.time || '')
      setPriority(task.priority || 'low')
      setTimeSpent(task.timeSpentMinutes)
    }
  }, [task])

  if (!open || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md p-4 rounded-t-xl md:rounded-xl card-glass">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{t('edit_task')}</h3>
          <button onClick={onClose} className="text-sm text-gray-500 btn-glass px-2 py-1">{t('close')}</button>
        </div>

        <div className="space-y-3">
          <input aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded" />
          <div className="flex gap-2">
            <input aria-label={t('time')} type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-3 border rounded flex-1" />
            <select aria-label={t('priority')} value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} className="p-3 border rounded w-28">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <label className="text-sm">{t('duration_minutes')}</label>
              <input type="number" min={0} value={timeSpent ?? ''} onChange={(e) => setTimeSpent(e.target.value === '' ? undefined : Number(e.target.value))} className="w-24 p-2 border rounded" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => onSave(task.id, { title, time, priority, timeSpentMinutes: timeSpent })} className="px-3 py-2 rounded btn-primary text-white">{t('save')}</button>
              <button onClick={onClose} className="px-3 py-2 rounded btn-glass">{t('cancel')}</button>
            </div>
            <button onClick={() => { if (confirm(t('confirm_delete_task'))) { onDelete(task.id); onClose() } }} className="text-sm text-red-600">{t('delete')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
