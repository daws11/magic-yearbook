import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from 'lucide-react'

function Controls({
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onNext,
  onPrev,
}) {
  return (
    <div className="pointer-events-auto flex items-center justify-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-white shadow-xl backdrop-blur-md">
      <button
        type="button"
        onClick={onPrev}
        className="rounded-full border border-white/30 bg-white/10 p-1.5 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label="Previous slide"
      >
        <SkipBack size={16} />
      </button>
      <button
        type="button"
        onClick={onTogglePlay}
        className="rounded-full bg-white p-2 text-black transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </button>
      <button
        type="button"
        onClick={onNext}
        className="rounded-full border border-white/30 bg-white/10 p-1.5 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label="Next slide"
      >
        <SkipForward size={16} />
      </button>
      <button
        type="button"
        onClick={onToggleMute}
        className="rounded-full border border-white/30 bg-white/10 p-1.5 transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
    </div>
  )
}

export default Controls
