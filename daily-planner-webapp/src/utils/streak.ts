const STREAK_KEY = 'dp_streak_v1'

export const loadStreak = () => {
  try {
    const raw = localStorage.getItem(STREAK_KEY)
    return raw ? JSON.parse(raw) : { count: 0, last: null }
  } catch { return { count: 0, last: null } }
}

export const saveStreak = (s: any) => localStorage.setItem(STREAK_KEY, JSON.stringify(s))

export const bumpStreak = () => {
  const s = loadStreak()
  const today = new Date().toISOString().slice(0,10)
  if (s.last === today) return s
  if (s.last === null) s.count = 1
  else {
    // naive: if last was yesterday, increment, else reset
    const last = new Date(s.last)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const ystr = yesterday.toISOString().slice(0,10)
    if (s.last === ystr) s.count = (s.count || 0) + 1
    else s.count = 1
  }
  s.last = today
  saveStreak(s)
  return s
}
