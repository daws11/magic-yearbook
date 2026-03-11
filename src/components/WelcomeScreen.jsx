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
        <p className="mb-3 text-sm tracking-[0.2em] text-white/70 md:text-base uppercase">
          Open Our Memories
        </p>
        <h1 className="mb-4 text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          Dear Malik Faza,<br />
          Thank you and stay in touch!
        </h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-white/80 md:text-base">
          We love you,<br />
          You came as a stranger and leave as a family
        </p>
        <button
          type="button"
          onMouseDown={onEnter}
          className="pulse-glow rounded-full border border-white/40 bg-white/12 px-9 py-3 text-sm font-semibold tracking-[0.28em] text-white uppercase transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        >
          Open Memories
        </button>
      </div>
    </MotionDiv>
  )
}

export default WelcomeScreen
