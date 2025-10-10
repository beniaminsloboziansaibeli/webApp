import React, { useState } from 'react'
import { Goal } from '../types'
import { v4 as uuidv4 } from 'uuid'

type GoalsProps = { goals: Goal[]; setGoals: (g: Goal[]) => void }

const Goals: React.FC<GoalsProps> = ({ goals, setGoals }: GoalsProps) => {
  const [title, setTitle] = useState<string>('')

  const add = () => {
    if (!title.trim() || goals.length >= 3) return
    const g: Goal = { id: uuidv4(), title: title.trim(), progress: 0, target: 1 }
    setGoals([g, ...goals])
    setTitle('')
  }

  const inc = (id: string) => setGoals(goals.map((g: Goal) => (g.id === id ? { ...g, progress: Math.min(g.target, g.progress + 1) } : g)))
  const del = (id: string) => setGoals(goals.filter((g: Goal) => g.id !== id))

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Goals</h3>
        <div className="text-sm text-gray-500">{goals.length}/3</div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex gap-2">
          <input value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} placeholder="Add goal (e.g. Drink water)" className="flex-1 p-2 rounded border" />
          <button onClick={add} className="px-4 py-2 bg-primary text-white rounded">Add</button>
        </div>
        <div className="space-y-2">
          {goals.map((g: Goal) => (
            <div key={g.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{g.title}</div>
                <div className="text-xs text-gray-500">{g.progress}/{g.target}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => inc(g.id)} className="px-2 py-1 bg-green-100 rounded">+1</button>
                <button onClick={() => del(g.id)} className="px-2 py-1 bg-red-100 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Goals
