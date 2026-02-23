import { motion } from 'framer-motion'

const MotionDiv = motion.div

function WelcomeScreen({ onEnter }) {
  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-6 backdrop-blur-sm"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="max-w-xl text-center">
        <p className="mb-3 text-sm tracking-[0.2em] text-white/70 md:text-base">
          Blended with teamwork. Topped with achievement.
        </p>
        <h1 className="mb-4 text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          2025 was our signature bowl — bold, colorful, and made with heart.
        </h1>
        <p className="mx-auto mb-2 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
          Take a bite of the memories.
        </p>
        <p className="mb-8 text-xs tracking-[0.3em] text-white/60 uppercase">
          Magic Yearbook
        </p>
        <button
          type="button"
          onMouseDown={onEnter}
          className="pulse-glow rounded-full border border-white/40 bg-white/12 px-9 py-3 text-sm font-semibold tracking-[0.28em] text-white uppercase transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          Open Yearbook
        </button>
      </div>
    </MotionDiv>
  )
}

export default WelcomeScreen
