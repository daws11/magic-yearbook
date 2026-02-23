import { motion } from 'framer-motion'

const MotionArticle = motion.article
const MotionImage = motion.img

function PhotoGallery({ slides }) {
  const layoutVariants = [
    'md:row-span-8 md:aspect-[1/1]',
    'md:row-span-6 md:aspect-[5/4]',
    'md:row-span-7 md:aspect-[1/1]',
    'md:row-span-9 md:aspect-[4/5]',
  ]

  return (
    <section className="relative z-10 w-full bg-[#f2eee3] px-4 py-10 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:auto-rows-[48px] md:gap-7">
        {slides.map((slide, index) => {
          const isEven = index % 2 === 0
          const blockClass = layoutVariants[index % layoutVariants.length]

          return (
            <MotionArticle
              key={slide.src}
              className={`aspect-4/3 overflow-hidden rounded-3xl bg-white/60 shadow-[0_16px_44px_rgba(22,22,22,0.15)] backdrop-blur-sm ${blockClass}`}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: (index % 4) * 0.05 }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <MotionImage
                src={slide.src}
                alt={slide.caption}
                className="h-full w-full object-contain"
                initial={{ scale: 1.06, x: isEven ? -14 : 14 }}
                whileInView={{ scale: 1, x: 0 }}
                transition={{ duration: 1.05, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              />
            </MotionArticle>
          )
        })}
        </div>
      </div>
    </section>
  )
}

export default PhotoGallery
