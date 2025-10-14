import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { pop } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'
import { Task } from '../types'

type Props = {
  open: boolean
  onClose: () => void
  onSave: (title: string, time?: string, priority?: Task['priority']) => void
}

const QuickAddModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [priority, setPriority] = useState<Task['priority']>('low')
  const reduced = useReducedMotion()
  if (!open) return null

  const save = () => {
    if (!title.trim()) return
    onSave(title.trim(), time || undefined, priority)
    setTitle('')
    setTime('')
    setPriority('low')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/28" />
      <motion.div initial={reduced ? undefined : 'hidden'} animate={reduced ? undefined : 'visible'} variants={reduced ? undefined : pop} className="z-10 w-full max-w-md mx-4 card-glass rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-2">Add task quickly</h3>
        <div className="space-y-3">
          <input aria-label="Task title" className="w-full p-3 border rounded-lg" placeholder="What do you want to do?" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className="flex gap-2">
            <input aria-label="Time" type="time" className="p-3 rounded-lg border w-32" value={time} onChange={(e) => setTime(e.target.value)} />
            <select aria-label="Priority" className="p-3 rounded-lg border flex-1" value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-glass px-4 py-2">Cancel</button>
          <button onClick={save} className="btn-primary px-4 py-2">Add</button>
        </div>
      </motion.div>
    </div>
  )
}

export default QuickAddModal
