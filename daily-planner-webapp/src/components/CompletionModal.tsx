import React from 'react'
import { motion } from 'framer-motion'

const CompletionModal: React.FC<{ open: boolean; onClose: () => void; message?: string }> = ({ open, onClose, message }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-6 rounded-xl shadow-lg z-10 text-center w-11/12 max-w-sm">
        <div className="text-2xl">🎉</div>
        <h3 className="mt-2 font-bold">{message ?? 'Great job! You are on fire!'}</h3>
        <p className="text-sm text-gray-500 mt-2">Keep the streak going — small wins add up.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 btn-primary rounded">Nice!</button>
      </motion.div>
    </div>
  )
}

export default CompletionModal
