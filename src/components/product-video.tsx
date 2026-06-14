import { useEffect, useRef, useState, useCallback } from "react";
import { Play, Pause, Maximize, Minimize } from "lucide-react";

function fmt(t: number) {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ProductVideo({ src, poster }: { src: string; poster?: string | null }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFull, setIsFull] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [active, setActive] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showControls = hovering && active;

  const bumpActive = useCallback(() => {
    setActive(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setActive(false), 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  useEffect(() => {
    const onFs = () => setIsFull(document.fullscreenElement === wrapRef.current);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const toggleFull = () => {
    if (!document.fullscreenElement) wrapRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Number(e.target.value);
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-full bg-black overflow-hidden rounded-[24px] group select-none"
      onMouseEnter={() => { setHovering(true); bumpActive(); }}
      onMouseLeave={() => { setHovering(false); setActive(false); if (idleTimer.current) clearTimeout(idleTimer.current); }}
      onMouseMove={bumpActive}
      onTouchStart={() => { setHovering(true); bumpActive(); }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster ?? undefined}
        className="w-full h-full object-contain bg-black cursor-pointer"
        playsInline
        onClick={toggle}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />

      <div
        className={`absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-200 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 text-white">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center cursor-pointer"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <span className="text-xs tabular-nums w-12">{fmt(current)}</span>

          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.01}
            value={current}
            onChange={onSeek}
            className="flex-1 h-1 accent-white cursor-pointer"
            aria-label="Seek"
          />

          <span className="text-xs tabular-nums w-12 text-right">{fmt(duration)}</span>

          <button
            type="button"
            onClick={toggleFull}
            aria-label={isFull ? "Exit fullscreen" : "Fullscreen"}
            className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur flex items-center justify-center cursor-pointer"
          >
            {isFull ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
