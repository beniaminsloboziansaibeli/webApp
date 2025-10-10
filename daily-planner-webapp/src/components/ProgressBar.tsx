import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const pct = Math.round(Math.min(100, Math.max(0, value)))
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mt-3 relative">
      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} className="h-3 bg-gradient-to-r from-green-400 to-green-600" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute right-0 -top-6 text-xs font-medium text-green-600">{pct}%</motion.div>
    </div>
  )
}

export default ProgressBar
