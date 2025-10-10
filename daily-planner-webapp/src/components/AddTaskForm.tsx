import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { cardEnter } from '../lib/motion'

type AddTaskFormProps = {
  onAdd: (title: string, time?: string, priority?: 'low' | 'medium' | 'high') => void
  onQuickAdd: (text: string) => void
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAdd, onQuickAdd }: AddTaskFormProps) => {
  const { t } = useTranslation()
  const [title, setTitle] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low')

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), time || undefined, priority)
    setTitle('')
    setTime('')
    setPriority('low')
  }

  return (
  <motion.form onSubmit={submit} initial="hidden" animate="visible" variants={cardEnter} className="space-y-3 card-glass p-3 rounded-lg">
      <div className="flex gap-2">
  <input aria-label="Task title" className="flex-1 p-3 rounded-lg border" placeholder={t('placeholderQuickAdd') as string} value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
  <input aria-label="Time" type="time" className="w-28 p-3 rounded-lg border" value={time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)} />
  <select aria-label="Priority" className="p-3 rounded-lg border" value={priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as any)}>
          <option value="low">{t('low')}</option>
          <option value="medium">{t('medium')}</option>
          <option value="high">{t('high')}</option>
        </select>
      </div>
      <div className="flex gap-2">
  <motion.button whileTap={{ scale: 0.98 }} type="submit" className="flex-1 py-3 btn-primary rounded-lg">{t('addTask')}</motion.button>
  <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => onQuickAdd(title)} className="px-3 py-3 border rounded-lg btn-glass">Quick</motion.button>
      </div>
    </motion.form>
  )
}

export default AddTaskForm
