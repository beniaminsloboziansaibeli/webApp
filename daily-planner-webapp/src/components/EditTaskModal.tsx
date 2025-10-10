import React, { useEffect, useState } from 'react'
import { Task } from '../types'

type EditTaskModalProps = {
  open: boolean
  task?: Task | null
  onClose: () => void
  onSave: (id: string, patch: Partial<Task>) => void
  onDelete: (id: string) => void
}

export default function EditTaskModal({ open, task, onClose, onSave, onDelete }: EditTaskModalProps) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('low')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setTime(task.time || '')
      setPriority(task.priority || 'low')
    }
  }, [task])

  if (!open || !task) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md p-4 rounded-t-xl md:rounded-xl card-glass">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <button onClick={onClose} className="text-sm text-gray-500 btn-glass px-2 py-1">Close</button>
        </div>

        <div className="space-y-3">
          <input aria-label="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded" />
          <div className="flex gap-2">
            <input aria-label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="p-3 border rounded flex-1" />
            <select aria-label="Priority" value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} className="p-3 border rounded w-28">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button onClick={() => onSave(task.id, { title, time, priority })} className="px-3 py-2 rounded btn-primary text-white">Save</button>
              <button onClick={onClose} className="px-3 py-2 rounded btn-glass">Cancel</button>
            </div>
            <button onClick={() => { if (confirm('Delete task?')) { onDelete(task.id); onClose() } }} className="text-sm text-red-600">Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}
