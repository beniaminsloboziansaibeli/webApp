import { useEffect, useState } from 'react'
import { loadSettings } from '../utils/settings'

export default function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    try { const s = loadSettings(); return !!s.reducedMotion } catch { return false }
  })

  useEffect(() => {
    const onStorage = () => {
      try { const s = loadSettings(); setReduced(!!s.reducedMotion) } catch { }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return reduced
}
