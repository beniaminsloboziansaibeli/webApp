import { Task, Goal } from '../types'

const TASKS_KEY = 'dp_tasks_v1'
const GOALS_KEY = 'dp_goals_v1'

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to load tasks', e)
    return []
  }
}

export const saveTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
}

export const loadGoals = (): Goal[] => {
  try {
    const raw = localStorage.getItem(GOALS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to load goals', e)
    return []
  }
}

export const saveGoals = (goals: Goal[]) => {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals))
}
