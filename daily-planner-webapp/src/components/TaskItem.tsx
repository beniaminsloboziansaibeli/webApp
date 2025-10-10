import React, { useState } from 'react'
import { Task } from '../types'
import { motion } from 'framer-motion'
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

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} whileHover={{ scale: 1.01 }} className={`p-3 rounded-lg border flex items-center justify-between ${task.completed ? 'bg-green-50' : 'bg-white'} floating`}>
      <div className="flex items-center gap-3">
        <button onClick={onToggle} aria-label="complete" className={`w-10 h-10 rounded-full flex items-center justify-center border ${task.completed ? 'bg-green-500 text-white shadow' : ''}`}>{task.completed ? '✓' : ''}</button>
        <div>
          {editing ? (
            <div className="flex gap-2">
              <input className="p-1 border rounded" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
              <button onClick={save} className="px-2 bg-primary text-white rounded">Save</button>
            </div>
          ) : (
            <div>
              <div className="font-medium text-sm">{task.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2"><span>{task.time ?? '—'}</span><span className={`px-2 py-0.5 rounded text-[11px] ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{task.priority}</span></div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setEditing((s: boolean) => !s)} className="p-2 rounded hover:bg-gray-100"><Edit2 size={16} /></button>
        <button onClick={() => { if (confirm('Delete task?')) onDelete() }} className="p-2 rounded hover:bg-gray-100"><Trash2 size={16} /></button>
      </div>
    </motion.div>
  )
}

export default TaskItem
