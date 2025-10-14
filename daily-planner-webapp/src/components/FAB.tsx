import React from 'react'
import { motion } from 'framer-motion'
import { PlusIcon } from '@heroicons/react/24/solid'
import { pop } from '../lib/motion'
import useReducedMotion from '../lib/useReducedMotion'

type FABProps = { onClick?: () => void }

export default function FAB({ onClick }: FABProps) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      initial={reduced ? undefined : 'hidden'}
      animate={reduced ? undefined : 'visible'}
      variants={reduced ? undefined : pop}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      onClick={onClick}
      aria-label="Add"
      className="fixed right-4 bottom-24 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-soft btn-primary"
    >
      <PlusIcon className="w-6 h-6" />
    </motion.button>
  )
}
