import { format, addDays, parseISO, isWithinInterval } from 'date-fns'
import { MoodRecord } from './storage'

// moods: Record<yyyy-MM-dd, MoodRecord>
export const aggregateMoods = (moods: Record<string,MoodRecord>, start: Date, end: Date) => {
  const res: Record<string, number> = {}
  Object.keys(moods).forEach(k => {
    try {
      const d = parseISO(k)
      if (isWithinInterval(d, { start, end })) {
        const e = moods[k]?.emoji
        if (e) res[e] = (res[e] || 0) + 1
      }
    } catch {}
  })
  return res
}

export const moodsForWeek = (moods: Record<string,MoodRecord>, refDate: Date = new Date()) => {
  const start = addDays(refDate, -6)
  const end = refDate
  return aggregateMoods(moods, start, end)
}

export default { aggregateMoods, moodsForWeek }
