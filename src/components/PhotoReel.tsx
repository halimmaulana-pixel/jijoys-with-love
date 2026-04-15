'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface ReelPhoto {
  id: string;
  src: string;
  caption: string;
  sub?: string;
  person: 'az' | 'hm' | 'couple';
  kenBurns: 0 | 1 | 2 | 3 | 4 | 5;
}

// Ken Burns: [fromScale, toScale, fromX, toX, fromY, toY] (in %)
const KEN_BURNS = [
  { from: 'scale(1.0) translate(0%, 0%)',    to: 'scale(1.2) translate(-5%, -3%)' },
  { from: 'scale(1.2) translate(-5%, -3%)', to: 'scale(1.0) translate(0%, 0%)' },
  { from: 'scale(1.0) translate(3%, 0%)',   to: 'scale(1.18) translate(-3%, -4%)' },
  { from: 'scale(1.15) translate(4%, -4%)', to: 'scale(1.0) translate(-2%, 2%)' },
  { from: 'scale(1.0) translate(-3%, 3%)',  to: 'scale(1.22) translate(3%, -3%)' },
  { from: 'scale(1.2) translate(3%, -3%)',  to: 'scale(1.0) translate(-4%, 4%)' },
];

const reelPhotos: ReelPhoto[] = [
  { id: '1',  src: '/images/IMG_7337.JPEG',  caption: 'Kita berdua 🦋',          sub: 'Momen paling berarti',     person: 'couple', kenBurns: 0 },
  { id: '2',  src: '/images/IMG_8026.JPEG',  caption: 'AZ yang paling cantik ✨',  sub: 'Nggak ada yang ngalahin',  person: 'az',     kenBurns: 1 },
  { id: '3',  src: '/images/IMG_8028.JPEG',  caption: 'Bareng terus 💕',          sub: 'HM & AZ forever',          person: 'couple', kenBurns: 2 },
  { id: '4',  src: '/images/IMG_9977.JPEG',  caption: 'Gemesin poll 🐰',           sub: 'Tapi tetep yang terbaik',  person: 'az',     kenBurns: 3 },
  { id: '5',  src: '/images/IMG_3515.JPEG',  caption: 'Berdua aja cukup 🥹',      sub: 'Yang lain boleh iri',      person: 'couple', kenBurns: 4 },
  { id: '6',  src: '/images/IMG_8976.PNG',   caption: 'Imut banget sih 😍',        sub: 'Serius nggak ada duanya',  person: 'az',     kenBurns: 5 },
  { id: '7',  src: '/images/IMG_8027.JPEG',  caption: 'My everything 💗',          sub: 'Dari dulu sampai sekarang', person: 'az',    kenBurns: 0 },
  { id: '8',  src: '/images/IMG_7339.JPEG',  caption: 'Kenangan indah 🌸',         sub: 'Tiap momen sama kamu',    person: 'couple', kenBurns: 1 },
  { id: '9',  src: '/images/34A38B03-A205-4886-9204-8F0A4695E1C0.jpg', caption: 'Duo terbaik 🦋✨', sub: 'HM + AZ = meant to be', person: 'couple', kenBurns: 2 },
  { id: '10', src: '/images/IMG_3521.JPEG',  caption: 'Cantik + manis = AZ 💕',   sub: 'Bikin susah move on',      person: 'az',     kenBurns: 3 },
  { id: '11', src: '/images/1bbe7db9-e316-43dc-99b6-b0bdddb69056.jpg', caption: 'Together always 🌈', sub: 'Gabisa pisahkan', person: 'couple', kenBurns: 4 },
  { id: '12', src: '/images/IMG_8025.JPEG',  caption: 'Foto bareng favorit 🥰',   sub: 'Simpan selamanya',         person: 'couple', kenBurns: 5 },
  { id: '13', src: '/images/IMG_2135.JPEG',  caption: 'AZ = 4ever 💍',             sub: 'Best decision ever',       person: 'az',     kenBurns: 0 },
  { id: '14', src: '/images/IMG_7347.JPEG',  caption: 'Momen langka 📸',           sub: 'Yang selalu diingat',      person: 'couple', kenBurns: 1 },
  { id: '15', src: '/images/IMG_8024.JPEG',  caption: 'My one and only 🦋',        sub: 'Nggak butuh yang lain',   person: 'az',     kenBurns: 2 },
  { id: '16', src: '/images/3ab0cbad-eff5-4fa0-9eb9-433f9ceb1cac.jpg', caption: 'HM & AZ 💕', sub: 'Perfect couple poll', person: 'couple', kenBurns: 3 },
  { id: '17', src: '/images/IMG_3518.JPEG',  caption: 'Cantik poll 🥹',             sub: 'AZ mah spesial',           person: 'az',     kenBurns: 4 },
  { id: '18', src: '/images/IMG_8029.JPEG',  caption: 'Moment to remember 🌟',    sub: 'Simpan di hati selamanya', person: 'az',     kenBurns: 5 },
  { id: '19', src: '/images/IMG_7343.JPEG',  caption: 'Senyum AZ terbaik 😊',     sub: 'Bikin hari jadi cerah',    person: 'az',     kenBurns: 0 },
  { id: '20', src: '/images/IMG_8030.JPEG',  caption: 'Love you more 💗',          sub: 'Tiap hari makin sayang',   person: 'az',     kenBurns: 1 },
];

const DURATION = 5000; // ms per photo

export default function PhotoReel() {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbs, setShowThumbs] = useState(true);
  const [captionVisible, setCaptionVisible] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressStart = useRef<number>(Date.now());

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
    setCaptionVisible(false);
    progressStart.current = Date.now();
    setTimeout(() => setCaptionVisible(true), 800);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % reelPhotos.length);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + reelPhotos.length) % reelPhotos.length);
  }, [current, goTo]);

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    progressStart.current = Date.now();
    setCaptionVisible(false);
    setTimeout(() => setCaptionVisible(true), 800);

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - progressStart.current;
      setProgress(Math.min((elapsed / DURATION) * 100, 100));
    }, 16);

    intervalRef.current = setTimeout(() => {
      setCurrent(c => (c + 1) % reelPhotos.length);
      setProgress(0);
      progressStart.current = Date.now();
    }, DURATION);

    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, isPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') { e.preventDefault(); setIsPlaying(p => !p); }
      if (e.key === 'f' || e.key === 'F') setIsFullscreen(f => !f);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const photo = reelPhotos[current];
  const kb = KEN_BURNS[photo.kenBurns];

  const personColor = photo.person === 'couple'
    ? 'from-rose-500 to-pink-500'
    : photo.person === 'az'
    ? 'from-pink-500 to-fuchsia-500'
    : 'from-blue-500 to-indigo-500';

  const personLabel = photo.person === 'couple' ? '🦋 Kita' : photo.person === 'az' ? '💕 AZ' : '🔥 HM';

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-3xl shadow-2xl border border-white/20 select-none
        ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full aspect-video'}`}
      style={{ background: '#0a0a0a' }}
    >
      {/* ── PHOTO LAYER with Ken Burns ── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={photo.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Ken Burns CSS animation */}
          <div
            className="absolute inset-0"
            style={{
              animation: `kenBurns-${photo.kenBurns} ${DURATION}ms ease-in-out forwards`,
            }}
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Cinematic overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
          }} />
          {/* Cinematic bars */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-black" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-black" />
        </motion.div>
      </AnimatePresence>

      {/* ── CAPTION OVERLAY ── */}
      <AnimatePresence>
        {captionVisible && (
          <motion.div
            key={`caption-${photo.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute bottom-16 left-0 right-0 px-6 md:px-12 z-20"
          >
            {/* Person badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-2 bg-gradient-to-r ${personColor} text-white shadow-lg`}
            >
              {personLabel}
            </motion.span>

            {/* Main caption */}
            <motion.h3
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white text-xl md:text-3xl font-bold drop-shadow-lg leading-tight"
              style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}
            >
              {photo.caption}
            </motion.h3>

            {/* Sub caption */}
            {photo.sub && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/70 text-sm md:text-base mt-1 drop-shadow"
              >
                {photo.sub}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHOTO COUNTER ── */}
      <div className="absolute top-10 right-4 z-20 text-white/70 text-xs font-mono bg-black/40 px-2 py-1 rounded-full">
        {current + 1} / {reelPhotos.length}
      </div>

      {/* ── CONTROLS ── */}
      <div className="absolute bottom-9 left-0 right-0 z-20 px-4 flex items-center gap-3">
        {/* Prev */}
        <button
          onClick={prev}
          className="text-white/80 hover:text-white transition text-lg hover:scale-110 active:scale-95"
          title="Sebelumnya"
        >
          ⏮
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(p => !p)}
          className="text-white/90 hover:text-white transition text-xl hover:scale-110 active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>

        {/* Next */}
        <button
          onClick={next}
          className="text-white/80 hover:text-white transition text-lg hover:scale-110 active:scale-95"
          title="Berikutnya"
        >
          ⏭
        </button>

        {/* Progress Bar */}
        <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group">
          <motion.div
            className={`h-full bg-gradient-to-r ${personColor} rounded-full`}
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.05 }}
          />
        </div>

        {/* Thumbnails toggle */}
        <button
          onClick={() => setShowThumbs(t => !t)}
          className="text-white/60 hover:text-white transition text-sm hover:scale-110"
          title="Thumbnail"
        >
          {showThumbs ? '🎞️' : '🎞️'}
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => setIsFullscreen(f => !f)}
          className="text-white/60 hover:text-white transition text-sm hover:scale-110"
          title="Fullscreen"
        >
          {isFullscreen ? '⛶' : '⛶'}
        </button>
      </div>

      {/* ── THUMBNAIL STRIP ── */}
      <AnimatePresence>
        {showThumbs && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-[52px] left-0 right-0 z-20 px-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex gap-1.5 py-2 w-max mx-auto">
              {reelPhotos.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => goTo(i)}
                  className={`relative flex-shrink-0 w-10 h-7 rounded overflow-hidden transition-all duration-200
                    ${i === current
                      ? 'ring-2 ring-rose-400 ring-offset-1 ring-offset-black scale-110 opacity-100'
                      : 'opacity-40 hover:opacity-70 hover:scale-105'}`}
                >
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GLOBAL KEN BURNS KEYFRAMES ── */}
      <style jsx>{`
        @keyframes kenBurns-0 {
          from { transform: scale(1.0) translate(0%, 0%); }
          to   { transform: scale(1.2) translate(-5%, -3%); }
        }
        @keyframes kenBurns-1 {
          from { transform: scale(1.2) translate(-5%, -3%); }
          to   { transform: scale(1.0) translate(0%, 0%); }
        }
        @keyframes kenBurns-2 {
          from { transform: scale(1.0) translate(3%, 0%); }
          to   { transform: scale(1.18) translate(-3%, -4%); }
        }
        @keyframes kenBurns-3 {
          from { transform: scale(1.15) translate(4%, -4%); }
          to   { transform: scale(1.0) translate(-2%, 2%); }
        }
        @keyframes kenBurns-4 {
          from { transform: scale(1.0) translate(-3%, 3%); }
          to   { transform: scale(1.22) translate(3%, -3%); }
        }
        @keyframes kenBurns-5 {
          from { transform: scale(1.2) translate(3%, -3%); }
          to   { transform: scale(1.0) translate(-4%, 4%); }
        }
      `}</style>
    </div>
  );
}
