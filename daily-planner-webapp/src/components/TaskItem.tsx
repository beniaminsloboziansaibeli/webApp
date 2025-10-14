import React, { useState } from 'react'
import { Task } from '../types'
import { motion } from 'framer-motion'
import useReducedMotion from '../lib/useReducedMotion'
import { Trash2, Edit2 } from 'lucide-react'

type TaskItemProps = {
  task: Task
  onToggle: () => void
  onDelete: () => void
  onEdit: (patch: Partial<Task>) => void
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  const [editing, setEditing] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(task.title)

  const save = () => {
    onEdit({ title })
    setEditing(false)
  }

  const reduced = useReducedMotion()

  return (
    <motion.div
      layout
      initial={reduced ? undefined : { opacity: 0, y: 10, scale: 0.995 }}
      animate={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? undefined : { opacity: 0, y: -8 }}
      whileHover={reduced ? undefined : { scale: 1.02, y: -4 }}
      transition={reduced ? undefined : { type: 'spring', stiffness: 320, damping: 28 }}
      className={`p-3 flex items-center justify-between ${task.completed ? 'bg-green-50' : 'bg-white'} floating glass-task`}
    >
  <div className="flex items-center gap-3">
  <button onClick={onToggle} aria-label="complete" className={`w-10 h-10 rounded-full flex items-center justify-center border ${task.completed ? 'bg-green-500 text-white shadow' : 'bg-white'}`}>{task.completed ? '✓' : ''}</button>
        <div>
          {editing ? (
            <div className="flex gap-2">
              <input className="p-1 border rounded" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
              <button onClick={save} className="px-2 bg-primary text-white rounded">Save</button>
            </div>
          ) : (
            <div>
              <div className="font-medium text-sm flex items-center gap-2">
                <span className={`priority-dot ${task.priority} ${task.priority === 'high' ? 'pulse' : ''}`} title={`${task.priority} priority`} aria-hidden="true"></span>
                {task.title}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                <span>{task.time ?? '—'}</span>
                <motion.span initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} className={`px-2 py-0.5 rounded text-[11px] time-badge`}>{(() => {
                  if (!task.time) return '—'
                  const h = parseInt(task.time.split(':')[0], 10)
                  if (h < 12) return 'Morning'
                  if (h < 18) return 'Afternoon'
                  return 'Evening'
                })()}</motion.span>
                <span className={`px-2 py-0.5 rounded text-[11px] ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.priority}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
  <button onClick={() => setEditing((s: boolean) => !s)} className="p-2 rounded btn-glass"><Edit2 size={16} /></button>
  <button onClick={() => { if (confirm('Delete task?')) onDelete() }} className="p-2 rounded btn-glass text-red-500"><Trash2 size={16} /></button>
      </div>
    </motion.div>
  )
}

export default TaskItem
