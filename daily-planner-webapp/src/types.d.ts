export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  time?: string // HH:MM
  priority: Priority
  completed: boolean
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  progress: number
  target: number
}
