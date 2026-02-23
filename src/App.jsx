import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import AudioPlayer from './components/AudioPlayer'
import Layout from './components/Layout'
import PhotoGallery from './components/PhotoGallery'
import SlideStage from './components/SlideStage'
import WelcomeScreen from './components/WelcomeScreen'

function App() {
  const audioPlayerRef = useRef(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [slides, setSlides] = useState([])

  const slideCandidates = useMemo(
    () => [
      ...Array.from({ length: 92 }, (_, index) => {
        const number = index + 1
        return {
          src: `/images/${number}.webp`,
          caption: `Magic Yearbook ${number}`,
        }
      }),
    ],
    [],
  )

  useEffect(() => {
    let cancelled = false

    const isImageAvailable = (src) =>
      new Promise((resolve) => {
        const image = new Image()
        image.onload = () => resolve(true)
        image.onerror = () => resolve(false)
        image.src = src
      })

    const resolveSlides = async () => {
      const checks = await Promise.all(
        slideCandidates.map(async (slide) => ({
          slide,
          exists: await isImageAvailable(slide.src),
        })),
      )

      if (cancelled) return
      setSlides(checks.filter((item) => item.exists).map((item) => item.slide))
    }

    resolveSlides()

    return () => {
      cancelled = true
    }
  }, [slideCandidates])

  const handleEnter = () => {
    const audio = audioPlayerRef.current
    if (audio) {
      audio.muted = false
      audio.volume = 0
      audio.loop = true
      audio.play().catch(() => {})
    }
    setHasStarted(true)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    setIsPlaying((prev) => !prev)
  }

  const toggleMute = () => {
    setIsMuted((prev) => !prev)
  }

  return (
    <Layout>
      <AudioPlayer audioRef={audioPlayerRef} src="/music/bgm.mp3" isPlaying={isPlaying} isMuted={!hasStarted || isMuted} />
      {slides.length > 0 ? (
        <>
          <SlideStage
            slides={slides}
            isPlaying={isPlaying}
            isMuted={isMuted}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
          />
          <PhotoGallery slides={slides} />
        </>
      ) : (
        <div className="flex h-screen w-full items-center justify-center bg-black px-6 text-center text-white/75">
          Tidak ada gambar yang terdeteksi di <code>/public/images</code>.
        </div>
      )}

      <AnimatePresence>{!hasStarted && <WelcomeScreen onEnter={handleEnter} />}</AnimatePresence>
    </Layout>
  )
}

export default App
