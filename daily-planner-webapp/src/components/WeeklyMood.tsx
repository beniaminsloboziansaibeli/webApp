import React from 'react'
import analytics from '../utils/analytics'
import { MoodRecord } from '../utils/storage'
import useReducedMotion from '../lib/useReducedMotion'

type Props = { moods?: Record<string, MoodRecord> }

export default function WeeklyMood({ moods }: Props) {
  const reduced = useReducedMotion()
  if (!moods) return null
  const agg = analytics.moodsForWeek(moods)
  const entries = Object.entries(agg).sort((a,b) => b[1]-a[1])
  if (entries.length === 0) return <div className="text-sm text-gray-500">No mood data this week</div>
  return (
    <div className="p-3 rounded-xl card-glass mb-3">
      <div className="text-sm font-medium mb-2">Weekly mood</div>
      <div className="flex items-center gap-2">
        {entries.map(([emoji, count]) => (
          <div key={emoji} className="px-3 py-1 rounded-full bg-white/6 flex items-center gap-2">
            <div className="text-lg">{emoji}</div>
            <div className="text-xs text-gray-400">{count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
