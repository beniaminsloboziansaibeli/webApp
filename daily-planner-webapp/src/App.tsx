import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { Task, Goal } from './types'
import { loadTasks, saveTasks, loadGoals, saveGoals } from './utils/storage'
import { parseQuickAdd } from './utils/parseQuickAdd'
import { initTelegram, sendDataToBot, getUserInfo } from './utils/telegram'
import Header from './components/Header'
import AddTaskForm from './components/AddTaskForm'
import TaskItem from './components/TaskItem'
import ProgressBar from './components/ProgressBar'
import Goals from './components/Goals'
import Confetti from 'react-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { differenceInCalendarDays } from 'date-fns'
import CompletionModal from './components/CompletionModal'
import { playChime } from './utils/audio'
import { bumpStreak, loadStreak } from './utils/streak'
import SettingsModal from './components/SettingsModal'
import { loadSettings, saveSettings, Settings as SettingsType } from './utils/settings'
import { applyTelegramTheme } from './utils/telegram'
import i18n from 'i18next'

const App: React.FC = () => {
  const { t } = useTranslation()
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [userName, setUserName] = useState('')
  const [streak, setStreak] = useState<number>(0)
  const [settings, setSettings] = useState<SettingsType>(() => loadSettings())
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const tg = initTelegram()
    const info = getUserInfo()
    if (info?.name) setUserName(info.name)
    try { const s = loadStreak(); setStreak(s.count || 0) } catch {}
    try { const st = loadSettings(); setSettings(st); if (st.lang) { /* ensure i18n follows */ } } catch {}
    // expand if possible
    // Apply Telegram theme when available
    try { const tgWeb = (window as any).WebApp; if (tgWeb?.themeParams) { applyTelegramTheme(tgWeb.themeParams) } } catch {}
    try { const st = loadSettings(); if (st?.lang) i18n.changeLanguage(st.lang) } catch {}
    // eslint-disable-next-line
  }, [])

  useEffect(() => saveTasks(tasks), [tasks])
  useEffect(() => saveGoals(goals), [goals])

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1
      // sort by time then priority
      if (a.time && b.time) return a.time.localeCompare(b.time)
      if (a.time) return -1
      if (b.time) return 1
      const pr = { high: 0, medium: 1, low: 2 } as any
      return pr[a.priority] - pr[b.priority]
    })
  }, [tasks])

  const doneCount = tasks.filter((t) => t.completed).length

  const addTask = (title: string, time?: string, priority: Task['priority'] = 'low') => {
    const task: Task = { id: uuidv4(), title, time, priority, completed: false, createdAt: new Date().toISOString() }
    setTasks((s) => [task, ...s])
  }

  const quickAdd = (text: string) => {
    const { title, time } = parseQuickAdd(text)
    addTask(title, time)
  }

  const updateTask = (id: string, patch: Partial<Task>) => {
    setTasks((s: Task[]) => s.map((t: Task) => (t.id === id ? { ...t, ...patch } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks((s: Task[]) => s.filter((t: Task) => t.id !== id))
  }

  const completeTask = (id: string) => {
    updateTask(id, { completed: true })
    setShowConfetti(true)
    // try vibrate
    try { if (settings.vibrate) navigator.vibrate?.(200) } catch {}
    // play chime
    try { if (settings.sound) playChime() } catch {}
    // update streak and show modal
    const s = bumpStreak()
    setShowModal(true)
    setTimeout(() => setShowConfetti(false), 2500)
  }

  const shareWithBot = () => {
    sendDataToBot({ tasks, goals, date: new Date().toISOString() })
    alert(t('sendToBot'))
  }

  return (
    <div className="app-container min-h-screen p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <Header name={userName || 'Friend'} onShare={shareWithBot} />

      <main className="mt-4">
        <div className="bg-white shadow-md rounded-xl p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('tasksDone', { done: doneCount, total: tasks.length })}</h2>
            <div className="text-sm text-gray-500">Streak: <strong>Day 1</strong></div>
          </div>
          <ProgressBar value={tasks.length ? (doneCount / tasks.length) * 100 : 0} />

          <div className="mt-4">
            <AddTaskForm onAdd={(title: string, time?: string, priority?: Task['priority']) => addTask(title, time, priority)} onQuickAdd={(text: string) => quickAdd(text)} />
          </div>

          <div className="mt-4 space-y-2 max-h-[50vh] overflow-auto">
            <AnimatePresence>
              {sortedTasks.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center text-gray-500">
                  {t('noTasks')}
                </motion.div>
              )}
              {sortedTasks.map((task: Task, i: number) => (
                <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <TaskItem task={task} onToggle={() => completeTask(task.id)} onDelete={() => deleteTask(task.id)} onEdit={(patch: Partial<Task>) => updateTask(task.id, patch)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4">
          <Goals goals={goals} setGoals={setGoals} />
        </div>
      </main>
  <CompletionModal open={showModal} onClose={() => setShowModal(false)} />
  <SettingsModal open={settingsOpen} settings={settings} onClose={(next) => { if (next) { setSettings(next); saveSettings(next) } setSettingsOpen(false) }} />
  <button onClick={() => setSettingsOpen(true)} className="fixed bottom-6 right-4 p-3 rounded-full btn-primary shadow">⚙</button>
      <footer className="p-4 text-center text-xs text-gray-500">Daily Planner • Built for Telegram WebApps</footer>
    </div>
  )
}

export default App
