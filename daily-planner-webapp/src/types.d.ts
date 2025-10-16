export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  time?: string // HH:MM
  date?: string // ISO date (YYYY-MM-DD) for scheduled/future tasks
  priority: Priority
  completed: boolean
  createdAt: string
  timeSpentMinutes?: number
}

export interface Goal {
  id: string
  title: string
  progress: number
  target: number
}
