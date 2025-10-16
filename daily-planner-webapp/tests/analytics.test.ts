import { moodsForWeek } from '../src/utils/analytics'
import { describe, it, expect } from 'vitest'

describe('moodsForWeek', () => {
  it('aggregates emojis over last 7 days', () => {
    const today = new Date()
    const d = (n: number) => {
      const dt = new Date(today)
      dt.setDate(dt.getDate() - n)
      return dt.toISOString().slice(0,10)
    }
    const moods: Record<string, any> = {}
    moods[d(0)] = { emoji: '😄' }
    moods[d(1)] = { emoji: '😄' }
    moods[d(2)] = { emoji: '😐' }
    moods[d(8)] = { emoji: '😞' } // outside week

    const agg = moodsForWeek(moods, today)
    expect(agg['😄']).toBe(2)
    expect(agg['😐']).toBe(1)
    expect(agg['😞']).toBe(undefined)
  })
})
