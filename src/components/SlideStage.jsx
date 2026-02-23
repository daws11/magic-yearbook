import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Controls from './Controls'

const AUTOPLAY_MS = 5000
const MotionDiv = motion.div
const MotionImage = motion.img

function SlideStage({ slides, isPlaying, isMuted, onTogglePlay, onToggleMute }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentSlide = slides[currentIndex]

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    if (!isPlaying) return undefined
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, AUTOPLAY_MS)
    return () => window.clearInterval(interval)
  }, [isPlaying, slides.length])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <MotionDiv
          key={`ambient-${currentSlide.src}`}
          className="absolute inset-0 scale-110 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(${currentSlide.src})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.62 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_18%,rgba(0,0,0,0.45)_75%)]" />

      <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-20 md:px-8">
        <div className="relative h-full w-full max-w-6xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <MotionImage
                key={currentSlide.src}
                src={currentSlide.src}
                alt={currentSlide.caption}
                className="float-drift h-full max-h-[74vh] w-auto max-w-full rounded-xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1.03 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.95, ease: 'easeOut' }}
              />
            </AnimatePresence>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-3 md:pb-4">
            <Controls
              isPlaying={isPlaying}
              isMuted={isMuted}
              onTogglePlay={onTogglePlay}
              onToggleMute={onToggleMute}
              onNext={goNext}
              onPrev={goPrev}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

export default SlideStage
