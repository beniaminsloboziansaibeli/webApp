import { Variants } from 'framer-motion'

export const cardEnter: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.995 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 28 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18 } }
}

export const press: Variants = {
  rest: { scale: 1 },
  press: { scale: 0.985, transition: { duration: 0.12 } }
}

export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 360, damping: 20 } }
}

export default { cardEnter, press, pop }
