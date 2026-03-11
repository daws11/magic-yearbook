import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const MotionArticle = motion.article
const MotionImage = motion.img
const MotionVideo = motion.video

function PhotoGallery({ slides }) {
  const [selectedIndex, setSelectedIndex] = useState(null)

  const layoutVariants = [
    'md:row-span-8 md:aspect-[1/1]',
    'md:row-span-6 md:aspect-[5/4]',
    'md:row-span-7 md:aspect-[1/1]',
    'md:row-span-9 md:aspect-[4/5]',
  ]

  const selectedSlide = selectedIndex !== null ? slides[selectedIndex] : null
  const isVideo = selectedSlide?.type === 'video'

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') setSelectedIndex(null)
      if (e.key === 'ArrowLeft') setSelectedIndex((i) => (i - 1 + slides.length) % slides.length)
      if (e.key === 'ArrowRight') setSelectedIndex((i) => (i + 1) % slides.length)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, slides.length])

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  const goPrev = (e) => {
    e.stopPropagation()
    setSelectedIndex((i) => (i - 1 + slides.length) % slides.length)
  }

  const goNext = (e) => {
    e.stopPropagation()
    setSelectedIndex((i) => (i + 1) % slides.length)
  }

  return (
    <section className="relative z-10 w-full bg-[#f2eee3] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:auto-rows-[48px] md:gap-7">
        {slides.map((slide, index) => {
          const isEven = index % 2 === 0
          const blockClass = layoutVariants[index % layoutVariants.length]
          const isVideo = slide.type === 'video'

          return (
            <MotionArticle
              key={slide.src}
              className={`aspect-4/3 overflow-hidden rounded-3xl bg-white/60 shadow-[0_16px_44px_rgba(22,22,22,0.15)] backdrop-blur-sm cursor-pointer ${blockClass}`}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: (index % 4) * 0.05 }}
              viewport={{ once: true, amount: 0.25 }}
              onClick={() => setSelectedIndex(index)}
            >
              {isVideo ? (
                <MotionVideo
                  src={slide.src}
                  className="h-full w-full object-contain"
                  initial={{ scale: 1.06, x: isEven ? -14 : 14 }}
                  whileInView={{ scale: 1, x: 0 }}
                  transition={{ duration: 1.05, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                  muted
                  loop
                  playsInline
                  autoPlay
                />
              ) : (
                <MotionImage
                  src={slide.src}
                  alt={slide.caption}
                  className="h-full w-full object-contain"
                  initial={{ scale: 1.06, x: isEven ? -14 : 14 }}
                  whileInView={{ scale: 1, x: 0 }}
                  transition={{ duration: 1.05, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                />
              )}
            </MotionArticle>
          )
        })}
        </div>
      </div>

      <AnimatePresence>
        {selectedIndex !== null && selectedSlide && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedIndex(null)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
              onClick={() => setSelectedIndex(null)}
              aria-label="Tutup"
            >
              <X className="h-8 w-8" />
            </button>

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  onClick={goPrev}
                  aria-label="Sebelumnya"
                >
                  <ChevronLeft className="h-10 w-10" />
                </button>
                <button
                  type="button"
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                  onClick={goNext}
                  aria-label="Selanjutnya"
                >
                  <ChevronRight className="h-10 w-10" />
                </button>
              </>
            )}

            <motion.div
              className="relative max-h-[90vh] max-w-[90vw]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {isVideo ? (
                <video
                  src={selectedSlide.src}
                  className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
                  autoPlay
                  loop
                  muted={false}
                  playsInline
                  controls
                />
              ) : (
                <img
                  src={selectedSlide.src}
                  alt={selectedSlide.caption}
                  className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
                />
              )}
              <p className="mt-2 text-center text-sm text-white/70">{selectedSlide.caption}</p>
            </motion.div>

            {slides.length > 1 && (
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
                {selectedIndex + 1} / {slides.length}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default PhotoGallery
