import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

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
  <motion.form onSubmit={submit} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-2">
      <div className="flex gap-2">
  <input className="flex-1 p-2 rounded-lg border" placeholder={t('placeholderQuickAdd') as string} value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} />
  <input type="time" className="w-28 p-2 rounded-lg border" value={time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)} />
  <select className="p-2 rounded-lg border" value={priority} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as any)}>
          <option value="low">{t('low')}</option>
          <option value="medium">{t('medium')}</option>
          <option value="high">{t('high')}</option>
        </select>
      </div>
      <div className="flex gap-2">
  <motion.button whileTap={{ scale: 0.98 }} type="submit" className="flex-1 py-2 btn-primary rounded-lg shadow">{t('addTask')}</motion.button>
  <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={() => onQuickAdd(title)} className="px-3 py-2 border rounded-lg">Quick</motion.button>
      </div>
    </motion.form>
  )
}

export default AddTaskForm
