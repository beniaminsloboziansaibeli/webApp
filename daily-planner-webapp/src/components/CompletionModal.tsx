import React from 'react'
import { motion } from 'framer-motion'

const CompletionModal: React.FC<{ open: boolean; onClose: () => void; message?: string }> = ({ open, onClose, message }) => {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ scale: 0.86, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }} className="z-10 w-11/12 max-w-sm card-glass p-6 text-center">
        <div className="text-4xl">🎉</div>
        <h3 className="mt-3 text-lg font-semibold">{message ?? 'Great job! You are on fire!'}</h3>
        <p className="text-sm soft-text mt-2">Keep the momentum — little wins build habit.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 btn-primary">Nice!</button>
      </motion.div>
    </div>
  )
}

export default CompletionModal
