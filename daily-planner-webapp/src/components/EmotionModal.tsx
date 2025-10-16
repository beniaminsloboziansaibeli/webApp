import React from 'react'
import { motion, Variants } from 'framer-motion'
import useReducedMotion from '../lib/useReducedMotion'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
  onClose: () => void
  onSelect: (emoji: string | null) => void // null means skip
}

const EMOJIS = ['😄','🙂','😐','😞']

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { staggerChildren: 0.06 } }
}

const buttonVariant: Variants = {
  hidden: { y: 8, opacity: 0 },
  visible: { y: 0, opacity: 1 },
  tap: { scale: 0.92 }
}

const EmotionModal: React.FC<Props> = ({ open, onClose, onSelect }) => {
  const reduced = useReducedMotion()
  const { t } = useTranslation()
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/28" onClick={onClose} />
      <motion.div initial={reduced ? undefined : 'hidden'} animate={reduced ? undefined : 'visible'} variants={containerVariants} className="z-10 card-glass p-4 rounded-xl max-w-sm w-[92%] text-center">
  <h3 className="text-lg font-semibold mb-2">{t('how_feel')}</h3>
  <p className="text-sm text-muted mb-3">{t('chooseEmoji')}</p>
        <div className="flex justify-center gap-3 text-2xl mb-3">
          {EMOJIS.map((e, i) => (
            <motion.button key={e} onClick={() => onSelect(e)} className="p-2 rounded-full" variants={buttonVariant} whileTap={reduced ? undefined : 'tap'}>
              {e}
            </motion.button>
          ))}
        </div>
        <div className="flex justify-center">
          <button onClick={() => onSelect(null)} className="btn-glass px-4 py-2">{t('skip')}</button>
        </div>
      </motion.div>
    </div>
  )
}

export default EmotionModal
