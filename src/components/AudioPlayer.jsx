import { useCallback, useEffect, useRef } from 'react'

const TARGET_VOLUME = 0.75

function AudioPlayer({ audioRef, src, isPlaying, isMuted }) {
  const fadeFrameRef = useRef(0)

  const stopFade = useCallback(() => {
    if (fadeFrameRef.current) {
      cancelAnimationFrame(fadeFrameRef.current)
      fadeFrameRef.current = 0
    }
  }, [])

  const fadeTo = useCallback((audio, targetVolume, durationMs, onDone) => {
    stopFade()
    const startVolume = Number.isFinite(audio.volume) ? audio.volume : 0
    const startedAt = performance.now()

    const tick = (now) => {
      const elapsed = now - startedAt
      const progress = Math.min(elapsed / durationMs, 1)
      audio.volume = startVolume + (targetVolume - startVolume) * progress

      if (progress < 1) {
        fadeFrameRef.current = requestAnimationFrame(tick)
        return
      }

      fadeFrameRef.current = 0
      if (onDone) onDone()
    }

    fadeFrameRef.current = requestAnimationFrame(tick)
  }, [stopFade])

  useEffect(() => {
    const audio = audioRef?.current
    if (!audio) return
    audio.muted = isMuted
  }, [isMuted])

  useEffect(() => {
    const audio = audioRef?.current
    if (!audio) return

    if (isPlaying) {
      audio.loop = true
      audio.volume = 0
      audio
        .play()
        .then(() => {
          fadeTo(audio, TARGET_VOLUME, 1100)
        })
        .catch(() => {
          // Ignore promise rejection when playback is blocked.
        })
      return () => stopFade()
    }

    fadeTo(audio, 0, 420, () => {
      audio.pause()
    })

    return () => stopFade()
  }, [fadeTo, isPlaying, stopFade])

  useEffect(
    () => () => {
      stopFade()
    },
    [stopFade],
  )

  return <audio ref={audioRef} src={src} preload="auto" playsInline />
}

export default AudioPlayer
