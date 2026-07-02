"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Track } from "@/data/tracks";

type Props = {
  tracks: Track[];
};

function getSceneKind(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes("walk in the park")) return "park";
  if (lower.includes("underwater")) return "underwater";
  if (lower.includes("start your engines")) return "drive";
  if (lower.includes("alien")) return "alien";
  if (lower.includes("main menu")) return "menu";
  return "menu";
}

function Tile({
  x,
  y,
  w = 2,
  h = 2,
  fill
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  fill: string;
}) {
  return <rect x={x} y={y} width={w} height={h} fill={fill} />;
}

type TileSpec = readonly [number, number, number, number, string];

function PersonSprite({ x, y, shirt = "#2456d6", hat = "#d48a2e" }: { x: number; y: number; shirt?: string; hat?: string }) {
  const tiles = [
    [6, 0, 10, 3, "#1a120c"], [4, 3, 16, 3, hat], [6, 6, 12, 3, hat],
    [6, 9, 12, 8, "#f1bf86"], [8, 11, 3, 3, "#ffffff"], [14, 11, 3, 3, "#ffffff"], [9, 12, 2, 2, "#1e6cff"], [15, 12, 2, 2, "#1e6cff"],
    [4, 17, 16, 5, shirt], [2, 22, 5, 12, "#f1bf86"], [18, 22, 5, 12, "#f1bf86"],
    [7, 22, 10, 16, shirt], [7, 38, 4, 14, "#1b2d68"], [13, 38, 4, 14, "#1b2d68"],
    [5, 52, 6, 3, "#21140f"], [13, 52, 6, 3, "#21140f"],
    [3, 17, 3, 18, "#111111"], [19, 17, 3, 18, "#111111"], [6, 6, 12, 2, "#111111"], [4, 54, 16, 2, "#111111"]
  ] as const;
  return (
    <g className="pixel-walk-cycle" transform={`translate(${x} ${y})`}>
      {tiles.map(([tx, ty, tw, th, color], index) => <Tile key={index} x={tx} y={ty} w={tw} h={th} fill={color} />)}
    </g>
  );
}

function TreeSprite({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const leaves = [
    [14, 0, 10, 8, "#0c5d2a"], [6, 8, 26, 8, "#0f7f39"], [0, 16, 38, 10, "#159447"],
    [4, 26, 34, 8, "#0c6c33"], [12, 6, 8, 8, "#22b85a"], [24, 16, 8, 8, "#23c15f"],
    [8, 22, 8, 8, "#29d76a"], [18, 30, 12, 6, "#0b5428"]
  ] as const;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {leaves.map(([tx, ty, tw, th, color], index) => <Tile key={index} x={tx} y={ty} w={tw} h={th} fill={color} />)}
      <Tile x={16} y={34} w={8} h={28} fill="#7b421d" />
      <Tile x={12} y={42} w={4} h={14} fill="#5b2f14" />
      <Tile x={24} y={42} w={4} h={14} fill="#9b5a28" />
    </g>
  );
}

function MermaidSprite({ x, y, hair = "#ff4fa3" }: { x: number; y: number; hair?: string }) {
  const tiles = [
    [8, 0, 14, 10, hair], [4, 8, 22, 8, hair], [8, 14, 14, 10, "#f4bd8a"],
    [10, 17, 2, 2, "#1478ff"], [18, 17, 2, 2, "#1478ff"], [8, 24, 16, 10, "#7b4dff"],
    [4, 30, 6, 10, "#f4bd8a"], [24, 30, 6, 10, "#f4bd8a"], [10, 34, 16, 14, "#23d7b0"],
    [14, 48, 16, 8, "#18af91"], [20, 56, 18, 6, "#42f5cf"], [26, 62, 10, 4, "#18af91"],
    [4, 12, 4, 28, "#111111"], [24, 12, 4, 28, "#111111"]
  ] as const;
  return <g className="pixel-dance" transform={`translate(${x} ${y})`}>{tiles.map(([tx, ty, tw, th, color], i) => <Tile key={i} x={tx} y={ty} w={tw} h={th} fill={color} />)}</g>;
}

function ParkScene() {
  const grass = Array.from({ length: 110 }, (_, i) => ({ x: (i * 17) % 320, y: 8 + ((i * 23) % 105) }));
  const flowers = Array.from({ length: 20 }, (_, i) => ({ x: 8 + ((i * 37) % 300), y: 12 + ((i * 19) % 102), c: i % 2 ? "#ff6bd6" : "#83d8ff" }));
  const pathDots = Array.from({ length: 32 }, (_, i) => ({ x: (i * 21) % 320, y: 124 + ((i * 13) % 48) }));
  return (
    <svg className="pixel-canvas" viewBox="0 0 320 180" role="img" aria-label="pixel park walk loop">
      <rect width="320" height="180" fill="#8bdc58" />
      {grass.map((g, i) => <Tile key={`g${i}`} x={g.x} y={g.y} w={3} h={5} fill={i % 3 ? "#45b93c" : "#b4ef58"} />)}
      {flowers.map((f, i) => (
        <g key={`f${i}`}>
          <Tile x={f.x + 1} y={f.y + 2} w={1} h={4} fill="#278a2f" />
          <Tile x={f.x} y={f.y} w={4} h={3} fill={f.c} />
        </g>
      ))}
      <path d="M0 121 C62 102 98 145 154 126 C206 109 237 118 320 95 L320 180 L0 180 Z" fill="#dca241" />
      <path d="M0 130 C62 111 98 154 154 135 C206 118 237 127 320 104" stroke="#b8782a" strokeWidth="3" fill="none" />
      {pathDots.map((d, i) => <Tile key={`d${i}`} x={d.x} y={d.y} w={3} h={2} fill={i % 2 ? "#bb7b2b" : "#f0bf62"} />)}
      <TreeSprite x={10} y={24} scale={1.25} />
      <TreeSprite x={270} y={22} scale={1.1} />
      <g className="pixel-slime-svg"><Tile x={236} y={132} w={16} h={8} fill="#111" /><Tile x={238} y={126} w={12} h={10} fill="#56e56f" /><Tile x={242} y={123} w={7} h={5} fill="#9affaa" /><Tile x={241} y={129} w={2} h={2} fill="#111" /><Tile x={249} y={129} w={2} h={2} fill="#111" /></g>
      <PersonSprite x={93} y={80} shirt="#2456d6" hat="#d6912e" />
    </svg>
  );
}

function UnderwaterScene() {
  const bubbles = Array.from({ length: 26 }, (_, i) => ({ x: 12 + ((i * 29) % 294), y: 12 + ((i * 37) % 142), s: 2 + (i % 3) }));
  return (
    <svg className="pixel-canvas" viewBox="0 0 320 180" role="img" aria-label="pixel underwater dance loop">
      <rect width="320" height="180" fill="#086bad" />
      <path d="M0 0 H320 V180 H0 Z" fill="url(#waterGrad)" />
      <defs><linearGradient id="waterGrad" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#23c7d9" /><stop offset="1" stopColor="#074b94" /></linearGradient></defs>
      <g className="pixel-rays"><path d="M30 0 L70 0 L18 180 L0 180 Z" fill="rgba(255,255,255,.16)" /><path d="M146 0 L174 0 L133 180 L101 180 Z" fill="rgba(255,255,255,.11)" /></g>
      {bubbles.map((b, i) => <rect key={i} x={b.x} y={b.y} width={b.s} height={b.s} fill="none" stroke="#bdf8ff" strokeWidth="1" />)}
      <rect y="154" width="320" height="26" fill="#cda360" />
      {Array.from({ length: 22 }, (_, i) => <Tile key={i} x={(i * 16) % 320} y={158 + ((i * 7) % 16)} w={7} h={3} fill={i % 2 ? "#b88648" : "#e2bc75"} />)}
      <g transform="translate(34 58)" className="pixel-float"><Tile x={8} y={0} w={16} h={12} fill="#73f1ff" /><Tile x={12} y={4} w={8} h={5} fill="#e9ffff" /><Tile x={9} y={12} w={14} h={34} fill="#f2d45d" /><Tile x={4} y={18} w={6} h={22} fill="#111" /><Tile x={24} y={18} w={6} h={22} fill="#111" /><Tile x={8} y={46} w={6} h={18} fill="#18466f" /><Tile x={20} y={46} w={6} h={18} fill="#18466f" /><Tile x={4} y={64} w={10} h={5} fill="#63e4ff" /><Tile x={19} y={64} w={10} h={5} fill="#63e4ff" /></g>
      <MermaidSprite x={167} y={72} hair="#ff4fa3" />
      <MermaidSprite x={236} y={82} hair="#b45dff" />
      <g className="pixel-shake"><Tile x={157} y={72} w={5} h={5} fill="#ffd83b" /><Tile x={158} y={77} w={2} h={10} fill="#7b421d" /><Tile x={224} y={82} w={5} h={5} fill="#ffd83b" /><Tile x={225} y={87} w={2} h={10} fill="#7b421d" /></g>
    </svg>
  );
}

function DriveScene() {
  const windows = Array.from({ length: 48 }, (_, i) => ({ x: (i * 23) % 320, y: 18 + ((i * 31) % 55) }));
  return (
    <svg className="pixel-canvas" viewBox="0 0 320 180" role="img" aria-label="pixel night driving loop">
      <rect width="320" height="180" fill="#10152f" />
      <rect y="28" width="320" height="56" fill="#1c244c" />
      {windows.map((w, i) => <Tile key={i} x={w.x} y={w.y} w={5} h={7} fill={i % 3 ? "#ffe46a" : "#56d9ff"} />)}
      <polygon points="120,78 200,78 310,180 10,180" fill="#191a22" />
      <g className="pixel-road-lines"><Tile x={158} y={88} w={4} h={22} fill="#fff0a4" /><Tile x={158} y={125} w={4} h={35} fill="#fff0a4" /></g>
      <g className="pixel-traffic-svg"><Tile x={137} y={72} w={18} h={10} fill="#ff386f" /><Tile x={141} y={66} w={10} h={6} fill="#83eaff" /><Tile x={138} y={82} w={5} h={4} fill="#111" /><Tile x={151} y={82} w={5} h={4} fill="#111" /></g>
      <g className="pixel-traffic-svg traffic-delay"><Tile x={190} y={64} w={17} h={9} fill="#69ff82" /><Tile x={194} y={58} w={9} h={6} fill="#83eaff" /><Tile x={191} y={73} w={5} h={4} fill="#111" /><Tile x={203} y={73} w={5} h={4} fill="#111" /></g>
      <rect y="134" width="320" height="46" fill="#090b11" />
      <path d="M111 176 Q160 126 209 176" fill="none" stroke="#333747" strokeWidth="12" />
    </svg>
  );
}

function AlienScene() {
  const stars = Array.from({ length: 80 }, (_, i) => ({ x: (i * 41) % 320, y: (i * 29) % 180, s: i % 4 ? 1 : 2 }));
  const ship = (x: number, y: number, flip = false) => (
    <g className={flip ? "pixel-duel-right" : "pixel-duel-left"} transform={`translate(${x} ${y}) ${flip ? "scale(-1 1) translate(-46 0)" : ""}`}>
      {([
        [14, 0, 18, 6, "#111"], [10, 6, 26, 6, "#7dff89"], [4, 12, 38, 10, "#33d066"], [0, 22, 46, 8, "#168a3e"],
        [8, 30, 8, 8, "#00e5ff"], [30, 30, 8, 8, "#00e5ff"], [18, 18, 10, 6, "#d8ff4e"], [18, 30, 10, 8, "#111"]
      ] satisfies TileSpec[]).map(([tx, ty, tw, th, c], i) => <Tile key={i} x={tx} y={ty} w={tw} h={th} fill={flip && c === "#7dff89" ? "#ff4bd8" : flip && c === "#33d066" ? "#b65cff" : flip && c === "#168a3e" ? "#6c2caa" : c} />)}
    </g>
  );
  return (
    <svg className="pixel-canvas" viewBox="0 0 320 180" role="img" aria-label="pixel alien standoff duel">
      <rect width="320" height="180" fill="#07071e" />
      {stars.map((s, i) => <Tile key={i} x={s.x} y={s.y} w={s.s} h={s.s} fill={i % 5 ? "#ffffff" : "#7af7ff"} />)}
      {ship(54, 72)}
      {ship(220, 72, true)}
      <g className="pixel-duel-lasers"><Tile x={111} y={88} w={42} h={3} fill="#b6ff00" /><Tile x={167} y={96} w={42} h={3} fill="#ff2bd6" /></g>
      <g className="pixel-blink"><Tile x={154} y={86} w={12} h={12} fill="#fff36a" /><Tile x={149} y={90} w={22} h={4} fill="#00e5ff" /><Tile x={158} y={81} w={4} h={22} fill="#ff2bd6" /></g>
    </svg>
  );
}

function MenuScene() {
  const sparkles = Array.from({ length: 36 }, (_, i) => ({ x: 12 + ((i * 41) % 296), y: 12 + ((i * 23) % 102), c: i % 3 ? "#ffffff" : "#fff36a" }));
  const sand = Array.from({ length: 44 }, (_, i) => ({ x: (i * 19) % 320, y: 130 + ((i * 11) % 46) }));
  return (
    <svg className="pixel-canvas" viewBox="0 0 320 180" role="img" aria-label="pixel floating main menu">
      <rect width="320" height="180" fill="#91e6ff" />
      <rect y="124" width="320" height="56" fill="#fff0b8" />
      {sparkles.map((s, i) => <g key={i}><Tile x={s.x} y={s.y} w={2} h={2} fill={s.c} /><Tile x={s.x - 2} y={s.y + 2} w={6} h={1} fill={s.c} /><Tile x={s.x + 1} y={s.y - 2} w={1} h={6} fill={s.c} /></g>)}
      {sand.map((s, i) => <Tile key={`sand${i}`} x={s.x} y={s.y} w={4} h={2} fill={i % 2 ? "#e4bf6b" : "#f9d987"} />)}
      <g className="pixel-cloud-svg">
        <Tile x={24} y={44} w={12} h={8} fill="#d7f8ff" /><Tile x={36} y={36} w={18} h={8} fill="#fff" /><Tile x={54} y={32} w={20} h={8} fill="#fff" /><Tile x={74} y={40} w={18} h={8} fill="#fff" /><Tile x={38} y={48} w={50} h={8} fill="#e8fbff" />
      </g>
      <g className="pixel-cloud-svg cloud-delay">
        <Tile x={220} y={38} w={12} h={8} fill="#d7f8ff" /><Tile x={232} y={30} w={18} h={8} fill="#fff" /><Tile x={250} y={26} w={20} h={8} fill="#fff" /><Tile x={270} y={34} w={18} h={8} fill="#fff" /><Tile x={234} y={42} w={50} h={8} fill="#e8fbff" />
      </g>
      <g className="pixel-float">
        <Tile x={102} y={116} w={116} h={8} fill="#92e86b" /><Tile x={108} y={124} w={104} h={8} fill="#63c85e" /><Tile x={116} y={132} w={88} h={8} fill="#8b5c2d" /><Tile x={126} y={140} w={68} h={8} fill="#70451f" /><Tile x={140} y={148} w={40} h={8} fill="#5c3518" />
        <Tile x={122} y={106} w={14} h={10} fill="#45d76d" /><Tile x={136} y={102} w={10} h={14} fill="#25a94a" /><Tile x={178} y={106} w={14} h={10} fill="#45d76d" /><Tile x={192} y={102} w={10} h={14} fill="#25a94a" />
      </g>
      <g className="pixel-blink">
        <rect x="89" y="50" width="142" height="42" fill="#111" />
        <rect x="94" y="55" width="132" height="32" fill="#fff8d9" />
        <Tile x={106} y={64} w={7} h={17} fill="#111" /><Tile x={113} y={64} w={10} h={4} fill="#111" /><Tile x={113} y={71} w={8} h={4} fill="#111" />
        <Tile x={130} y={64} w={4} h={17} fill="#111" /><Tile x={134} y={64} w={9} h={4} fill="#111" /><Tile x={134} y={71} w={8} h={4} fill="#111" /><Tile x={134} y={78} w={10} h={3} fill="#111" />
        <Tile x={151} y={64} w={4} h={17} fill="#111" /><Tile x={155} y={64} w={9} h={4} fill="#111" /><Tile x={155} y={71} w={8} h={4} fill="#111" /><Tile x={155} y={78} w={10} h={3} fill="#111" />
        <Tile x={172} y={64} w={4} h={17} fill="#111" /><Tile x={176} y={78} w={12} h={3} fill="#111" />
        <Tile x={194} y={64} w={4} h={17} fill="#111" /><Tile x={198} y={64} w={10} h={4} fill="#111" /><Tile x={198} y={71} w={8} h={4} fill="#111" />
      </g>
    </svg>
  );
}

function PixelLoop({ track }: { track: Track }) {
  const scene = getSceneKind(track.title);

  return (
    <div className={`pixel-player pixel-scene-${scene}`} aria-label={`${track.title} pixel loop`}>
      {scene === "park" ? <ParkScene /> : null}
      {scene === "underwater" ? <UnderwaterScene /> : null}
      {scene === "drive" ? <DriveScene /> : null}
      {scene === "alien" ? <AlienScene /> : null}
      {scene === "menu" ? <MenuScene /> : null}
    </div>
  );
}

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
              <>
                <PixelLoop track={activeTrack} />
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
              </>
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
