"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Track } from "@/data/tracks";

type Props = {
  tracks: Track[];
};

export function AudioLibrary({ tracks }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const frameRef = useRef<number | null>(null);

  const activeTrack = tracks[activeIndex];

  function selectTrack(track: Track) {
    const nextIndex = tracks.findIndex((item) => item.src === track.src);
    const isCurrentTrack = nextIndex === activeIndex;

    if (isCurrentTrack && playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }

    if (isCurrentTrack) {
      updateProgress();
      setPlaying(true);
      requestAnimationFrame(() => audioRef.current?.play());
      return;
    }

    setActiveIndex(nextIndex);
    setProgress(0);
    setPlaying(true);
    requestAnimationFrame(() => audioRef.current?.play());
  }

  function playNext() {
    if (!tracks.length) return;
    const nextIndex = (activeIndex + 1) % tracks.length;
    setActiveIndex(nextIndex);
    setProgress(0);
    setDuration(0);
    setPlaying(true);
    requestAnimationFrame(() => audioRef.current?.play());
  }

  function updateProgress() {
    const player = audioRef.current;
    if (!player) return;
    setProgress(player.currentTime);
    setDuration(Number.isFinite(player.duration) ? player.duration : 0);
  }

  useEffect(() => {
    if (!playing) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    function tick() {
      updateProgress();
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [playing, activeIndex]);

  function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remaining = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remaining}`;
  }

  function scrubTo(value: number) {
    const player = audioRef.current;
    if (!player || !Number.isFinite(value)) return;
    player.currentTime = value;
    setProgress(value);
  }

  return (
    <main className="player-shell">
      <section className="player-stage">
        <div className="relative w-full">
          <div className="neon-haze neon-haze-cyan" />
          <div className="neon-haze neon-haze-pink" />
          <div className="neon-haze neon-haze-lime" />

          <section className="relative min-w-0">
            {activeTrack ? (
              <audio
                key={activeTrack.src}
                onCanPlay={updateProgress}
                onDurationChange={updateProgress}
                onEnded={playNext}
                onLoadedData={updateProgress}
                onLoadedMetadata={updateProgress}
                onPause={() => setPlaying(false)}
                onPlay={() => setPlaying(true)}
                onTimeUpdate={updateProgress}
                ref={audioRef}
                src={activeTrack.src}
              />
            ) : null}

            {activeTrack ? (
              <div className="top-scrubber">
                <div className="top-scrubber-meta">
                  <span className="truncate">{activeTrack.title}</span>
                  <span className="track-time">
                    {duration > 0 ? `-${formatTime(Math.max(duration - progress, 0))}` : ""}
                  </span>
                </div>
                <input
                  aria-label={`Scrub ${activeTrack.title}`}
                  className="scrub-range"
                  disabled={duration <= 0}
                  max={duration || 0}
                  min={0}
                  onChange={(event) => scrubTo(Number(event.currentTarget.value))}
                  onInput={(event) => scrubTo(Number(event.currentTarget.value))}
                  step="0.01"
                  style={{ "--scrub-percent": `${duration > 0 ? (progress / duration) * 100 : 0}%` } as CSSProperties}
                  type="range"
                  value={progress}
                />
              </div>
            ) : null}

            <div className="track-list">
              {tracks.length ? (
                tracks.map((track) => {
                  const isActive = activeTrack?.src === track.src;
                  return (
                    <button
                      className={`track-card ${isActive ? "track-card-active" : ""}`}
                      key={track.src}
                      onClick={() => selectTrack(track)}
                      type="button"
                    >
                      <span className="relative grid w-full grid-cols-[1fr_auto] items-center gap-4 text-left">
                        <span className="min-w-0">
                          <span className="block truncate text-lg font-semibold tracking-tight sm:text-xl">{track.title}</span>
                        </span>

                        <span className="track-time">
                          {isActive && duration > 0 ? `-${formatTime(Math.max(duration - progress, 0))}` : ""}
                        </span>
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="track-card px-4 py-16 text-center text-[#111111]/55">
                  Drop WAV files into <span className="text-[#111111]">public/audio</span>, then run the site again.
                </div>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
