import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { v4 as uuidv4 } from 'uuid'
import { Task, Goal } from './types'
import { loadTasks, saveTasks, loadGoals, saveGoals, loadMoods, saveMoods } from './utils/storage'
import { parseQuickAdd } from './utils/parseQuickAdd'
import { initTelegram, sendDataToBot, getUserInfo } from './utils/telegram'
import Header from './components/Header'
import AddTaskForm from './components/AddTaskForm'
import TaskItem from './components/TaskItem'
import ProgressBar from './components/ProgressBar'
import Goals from './components/Goals'
import CalendarView from './components/CalendarView'
import AgendaView from './components/AgendaView'
import Confetti from 'react-confetti'
import { AnimatePresence, motion } from 'framer-motion'
import { differenceInCalendarDays, format } from 'date-fns'
import CompletionModal from './components/CompletionModal'
import EmotionModal from './components/EmotionModal'
import { playRandomSound } from './utils/audio'
import { bumpStreak, loadStreak } from './utils/streak'
import SettingsModal from './components/SettingsModal'
import { loadSettings, saveSettings, Settings as SettingsType } from './utils/settings'
import { applyTelegramTheme } from './utils/telegram'
import i18n from 'i18next'
import FAB from './components/FAB'
import BottomNav from './components/BottomNav'
import QuickAddModal from './components/QuickAddModal'

const App: React.FC = () => {
  const { t } = useTranslation()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks()) // asumezi util persistence
  const [goals, setGoals] = useState<Goal[]>(() => loadGoals())
  const [showConfetti, setShowConfetti] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [emotionOpen, setEmotionOpen] = useState(false)
  const [moods, setMoods] = useState<Record<string,any>>(() => {
    try { return loadMoods() } catch { return {} }
  })
  const [lastMoodChange, setLastMoodChange] = useState<{date: string, prev?: string} | null>(null)
  const [undoVisible, setUndoVisible] = useState(false)
  const [userName, setUserName] = useState('')
  const [streak, setStreak] = useState<number>(() => {
    try {
      const s = loadStreak() as any
      return (s && typeof s.count === 'number') ? s.count : 0
    } catch { return 0 }
  }) // util func
  const [settings, setSettings] = useState<SettingsType>(() => loadSettings())
  const [view, setView] = useState<'today' | 'calendar' | 'agenda'>('today')

  useEffect(() => {
    const tg = initTelegram()
    const info = getUserInfo()
    if (info?.name) setUserName(info.name)
    // expand if possible
    // Apply Telegram theme when available
    try {
      const tgWeb = (window as any).WebApp || (window as any).Telegram?.WebApp
      if (tgWeb?.themeParams) { applyTelegramTheme(tgWeb.themeParams) }
      // try to expand Telegram WebApp to use full space on mobile
      if (tgWeb && typeof tgWeb.expand === 'function') {
        try { tgWeb.expand() } catch (err) { console.warn('Telegram expand failed', err) }
      }
    } catch (e) { console.warn('applyTelegramTheme/init failed', e) }
    try { const st = loadSettings(); if (st?.lang) i18n.changeLanguage(st.lang) } catch {}
    // apply theme from saved settings (default is dark)
    try { const st = loadSettings(); if (st?.theme) { document.documentElement.setAttribute('data-theme', st.theme) } else { document.documentElement.setAttribute('data-theme', 'dark') } } catch {}
    // eslint-disable-next-line
  }, [])

  useEffect(() => saveTasks(tasks), [tasks])
  useEffect(() => saveGoals(goals), [goals])
  // When settings change, persist and apply theme immediately
  useEffect(() => {
    try { saveSettings(settings) } catch {}
    try { if (settings?.theme) document.documentElement.setAttribute('data-theme', settings.theme) } catch {}
  }, [settings])

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

  const addTask = (title: string, time?: string, priority: Task['priority'] = 'low', date?: string) => {
    const task: Task = { id: uuidv4(), title, time, priority, completed: false, createdAt: new Date().toISOString(), date }
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
  const [modalMessage, setModalMessage] = useState<string | undefined>(undefined)

  const completeTask = (id: string) => {
    updateTask(id, { completed: true })
    setShowConfetti(true)
    // vibration if enabled
    try { if (settings?.vibrate) navigator.vibrate?.(200) } catch {}
  // play random success sound (respect settings volume)
  try { playRandomSound(settings?.volume) } catch {}

    // pick a random motivational message
    const base = [
      'Nice! That one is out of the way. 🎯',
      "Boom — you're crushing it! 💥",
      'Another win. Keep the flow going! 🔥',
      'Lovely! That was satisfying. ✨',
      "You're unstoppable today! 🚀"
    ]
    const priorityMsgs: Record<string,string[]> = {
      high: ['High priority DONE — legend! 🦸‍♂️','You tackled a big one — respect! 👏'],
      medium: ['Solid work — medium task cleared! ✅','Nice rhythm — keep going! 🎵'],
      low: ['Small win — celebrate! 🥳','Nice and tidy — small wins add up!']
    }
    const extra = priorityMsgs[((): string => {
      try { const p = tasks.find(t => t.id === id)?.priority; return p ?? 'low' } catch { return 'low' }
    })()]
    const pool = [...base, ...(extra || [])]
    const picked = pool[Math.floor(Math.random() * pool.length)]
    setModalMessage(picked)
    setShowModal(true)

    // update streak and reflect it
    const s = bumpStreak()
    try { setStreak(s.count || 0) } catch {}

    setTimeout(() => setShowConfetti(false), 2500)
    // open emotion modal to capture mood for today
    setEmotionOpen(true)
  }

  const shareWithBot = () => {
    sendDataToBot({ tasks, goals, date: new Date().toISOString() })
    alert(t('sendToBot'))
  }

  const handleOpenSettings = () => setSettingsOpen(true)

  const handleShare = () => {
    const payload = { type: 'tasks_share', tasks, ts: Date.now() }
    const tg = (window as any).Telegram?.WebApp
    if (tg && typeof tg.sendData === 'function') {
      try {
        tg.sendData(JSON.stringify(payload))
        // visual feedback
        console.info('Shared to Telegram WebApp (sendData).')
      } catch (err) {
        console.warn('sendData failed, fallback to clipboard', err)
        navigator.clipboard?.writeText(JSON.stringify(payload))
      }
    } else {
      // fallback to clipboard
      navigator.clipboard?.writeText(JSON.stringify(payload))
      alert('Tasks copied to clipboard (fallback).')
    }
  }

  const handleExpand = () => {
    const tg = (window as any).Telegram?.WebApp
    if (tg && typeof tg.expand === 'function') {
      try {
        tg.expand()
      } catch (err) {
        console.warn('expand failed', err)
      }
    } else if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else {
      // no-op
    }
  }

  return (
    <div className="app-container min-h-screen p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
  <Header userName={userName || 'Friend'} streak={streak} todayMood={moods[format(new Date(),'yyyy-MM-dd')]} onShare={shareWithBot} onOpenSettings={handleOpenSettings} onExpand={handleExpand} />

      <main className="mt-4">
  <div className="card-glass shadow-md rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => setView('today')} className={`px-3 py-1 rounded ${view === 'today' ? 'btn-primary text-white' : 'btn-glass'}`}>Today</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1 rounded ${view === 'calendar' ? 'btn-primary text-white' : 'btn-glass'}`}>Calendar</button>
            <button onClick={() => setView('agenda')} className={`px-3 py-1 rounded ${view === 'agenda' ? 'btn-primary text-white' : 'btn-glass'}`}>Agenda</button>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('tasksDone', { done: doneCount, total: tasks.length })}</h2>
            <div className="text-sm text-gray-500">Streak: <strong>Day 1</strong></div>
          </div>
          <ProgressBar value={tasks.length ? (doneCount / tasks.length) * 100 : 0} />

          {view === 'today' ? (
            <>
              <div className="mt-4">
                <AddTaskForm onAdd={(title: string, time?: string, priority?: Task['priority']) => addTask(title, time, priority)} onQuickAdd={(text: string) => quickAdd(text)} />
              </div>

              <div className="mt-4 space-y-2 max-h-[50vh] overflow-auto">
                <AnimatePresence>
                  {sortedTasks.filter(t => !t.date || t.date === format(new Date(), 'yyyy-MM-dd')).length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center text-gray-500">
                      {t('noTasks')}
                    </motion.div>
                  )}
                  {sortedTasks.filter(t => !t.date || t.date === format(new Date(), 'yyyy-MM-dd')).map((task: Task, i: number) => (
                    <motion.div key={task.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                      <TaskItem task={task} onToggle={() => completeTask(task.id)} onDelete={() => deleteTask(task.id)} onEdit={(patch: Partial<Task>) => updateTask(task.id, patch)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : view === 'calendar' ? (
            <CalendarView tasks={tasks} onAdd={addTask} onUpdate={updateTask} onDelete={deleteTask} moods={moods} />
          ) : (
            <AgendaView tasks={tasks} onUpdate={updateTask} onDelete={deleteTask} moods={moods} />
          )}
        </div>

        <div className="mt-4">
          <Goals goals={goals} setGoals={setGoals} />
        </div>
      </main>
  <CompletionModal open={showModal} onClose={() => setShowModal(false)} message={modalMessage} />
  <EmotionModal open={emotionOpen} onClose={() => setEmotionOpen(false)} onSelect={(emoji) => {
    // persist mood for today
    const key = format(new Date(), 'yyyy-MM-dd')
  const next = { ...moods }
  const prev = next[key]
  if (emoji) next[key] = { emoji, ts: new Date().toISOString() }
  else delete next[key]
  setMoods(next)
  try { saveMoods(next) } catch {}
  // record for undo
  setLastMoodChange({ date: key, prev })
  setUndoVisible(true)
    // auto-hide undo after 6s
    setTimeout(() => setUndoVisible(false), 6000)
    setEmotionOpen(false)
  }} />
  {undoVisible && lastMoodChange && (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
      <div className="px-4 py-2 rounded-lg card-glass flex items-center gap-3">
        <div className="text-sm">{t('moodSaved')}</div>
        <button onClick={() => {
          const next = { ...moods }
          if (lastMoodChange.prev) next[lastMoodChange.date] = lastMoodChange.prev
          else delete next[lastMoodChange.date]
          setMoods(next)
          try { saveMoods(next) } catch {}
          setUndoVisible(false)
        }} className="btn-primary px-3 py-1">{t('undo')}</button>
      </div>
    </div>
  )}
  <SettingsModal open={settingsOpen} settings={settings} onClose={(next) => { if (next) { setSettings(next); saveSettings(next) } setSettingsOpen(false) }} />
  <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} onSave={(title: string, time?: string, priority?: Task['priority']) => addTask(title, time, priority)} />
  <FAB onClick={() => setQuickAddOpen(true)} />
  <BottomNav active={view} onNavigate={(v) => { if (v === 'settings') setSettingsOpen(true); else setView(v as any) }} />
      <footer className="p-4 text-center text-xs text-gray-500">Daily Planner • Built for Telegram WebApps</footer>
    </div>
  )
}

export default App

// End of App
