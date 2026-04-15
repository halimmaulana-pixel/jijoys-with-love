/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ModeMalam from '@/components/ModeMalam';
import PasswordScreen from '@/components/PasswordScreen';
import PhotoMosaic from '@/components/PhotoMosaic';
import PhotoReel from '@/components/PhotoReel';
import PhotoAlbum from '@/components/PhotoAlbum';
import TripMap from '@/components/TripMap';
import ParticleBackground from '@/components/ParticleBackground';
import MoodSelector from '@/components/MoodSelector';
import ChasingLetters from '@/components/ChasingLetters';
import LoveMeter from '@/components/LoveMeter';
import WishLetter from '@/components/WishLetter';

const FACTS = [
  { emoji: '🎂', text: 'Ultah Jijoy: 14 Des 2004', sub: '(21 tahun ♐️)' },
  { emoji: '🧇', text: 'Suka makan wafel + ayam 🍗', sub: '' },
  { emoji: '📍', text: 'Pertama ketemu: Parkiran Rektorat USU', sub: '' },
  { emoji: '💕', text: 'Date pertama: 26 Juni', sub: 'parkiran USU → Kopi Kuni' },
  { emoji: '😊', text: 'Panggilan: Jijoy', sub: '🐰' },
  { emoji: '♐️', text: 'Sagitarius', sub: 'fun & adventurous' },
  { emoji: '💕', text: 'HM loves Jijoy', sub: 'since 2025' },
];

const START_DATE = new Date('2025-06-26');
const ANNIVERSARY_DATE = new Date('2025-06-26');

function getNextAnniversary() {
  const now = new Date();
  const thisYear = new Date(now.getFullYear(), ANNIVERSARY_DATE.getMonth(), ANNIVERSARY_DATE.getDate());
  if (now > thisYear) {
    return new Date(now.getFullYear() + 1, ANNIVERSARY_DATE.getMonth(), ANNIVERSARY_DATE.getDate());
  }
  return thisYear;
}

function AnniversaryCountdown() {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [years, setYears] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextAnniversary = getNextAnniversary();
      const diff = nextAnniversary.getTime() - now.getTime();
      const yearsCount = nextAnniversary.getFullYear() - ANNIVERSARY_DATE.getFullYear();
      
      setYears(yearsCount);
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-pink-300 text-sm">🌹 Anniversary ke-{years} 🎉</p>
      <div className="flex gap-2 text-white">
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{countdown.days}</span>
          <span className="text-xs text-white/50">hari</span>
        </div>
        <span className="text-2xl">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{countdown.hours}</span>
          <span className="text-xs text-white/50">jam</span>
        </div>
        <span className="text-2xl">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{countdown.minutes}</span>
          <span className="text-xs text-white/50">menit</span>
        </div>
        <span className="text-2xl">:</span>
        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold">{countdown.seconds}</span>
          <span className="text-xs text-white/50">detik</span>
        </div>
      </div>
      <p className="text-white/50 text-sm">⏰ 26 Juni 2026</p>
    </div>
  );
}

function RelationshipCounter() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();
      const diff = now.getTime() - START_DATE.getTime();
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((diff % (1000 * 60)) / 1000));
    };
    updateCounter();
    const interval = setInterval(updateCounter, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
      <div className="text-center">
        <div className="text-3xl md:text-5xl font-bold text-rose-400">{days}</div>
        <div className="text-white/60 text-sm">hari</div>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-5xl font-bold text-pink-400">{hours}</div>
        <div className="text-white/60 text-sm">jam</div>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-5xl font-bold text-rose-300">{minutes}</div>
        <div className="text-white/60 text-sm">menit</div>
      </div>
      <div className="text-center">
        <div className="text-3xl md:text-5xl font-bold text-pink-200">{seconds}</div>
        <div className="text-white/60 text-sm">detik</div>
      </div>
    </div>
  );
}

function FloatingHearts() {
  const hearts = [...Array(20)].map((_, i) => {
    const startX = Math.random() * 100;
    const scale = Math.random() * 0.5 + 0.5;
    const opacity = Math.random() * 0.5 + 0.3;
    const endX = Math.random() * 100;
    const rotate = Math.random() * 360;
    const duration = Math.random() * 10 + 10;
    const left = Math.random() * 100;
    const emoji = ['💕', '💗', '💖', '🧡', '❤️'][Math.floor(Math.random() * 5)];
    return { i, startX, scale, opacity, endX, rotate, duration, left, emoji };
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <motion.div
          key={h.i}
          initial={{ 
            x: h.startX + 'vw', 
            y: '100vh',
            scale: h.scale,
            opacity: h.opacity,
          }}
          animate={{
            y: -100,
            x: h.endX + 'vw',
            rotate: h.rotate,
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute text-2xl"
          style={{ left: h.left + '%' }}
        >
          {h.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(true); // DEBUG: bypass password
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = () => {
    setIsUnlocked(true);
    localStorage.setItem('love-website-unlocked', 'true');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-900 via-pink-900 to-purple-900">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl"
        >
          💕
        </motion.div>
      </div>
    );
  }

  return (
    <ModeMalam>
      <FloatingHearts />
      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <PasswordScreen onSuccess={handleUnlock} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-transparent relative z-10"
          >
            <ParticleBackground particleCount={40} />
            <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  HM & Jijoy 💕
                </h1>
                <p className="text-white/60 text-lg">Since 26 Juni 2025</p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
              >
                <RelationshipCounter />
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="bg-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border border-pink-400/30"
              >
                <AnniversaryCountdown />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <MoodSelector />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h2 className="text-white text-xl font-semibold mb-2 text-center">
                  🗺️ Trip Kita 💕
                </h2>
                <p className="text-white/50 text-center text-sm mb-4">
                  Lokasi dari GPS foto 📍
                </p>
                <TripMap />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <ChasingLetters />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <LoveMeter />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <WishLetter />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                {FACTS.map((fact, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10"
                  >
                    <div className="text-2xl mb-1">{fact.emoji}</div>
                    <div className="text-white text-sm font-medium">{fact.text}</div>
                    {fact.sub && (
                      <div className="text-white/50 text-xs">{fact.sub}</div>
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* ── PHOTO ALBUM (FULLSCREEN) ── */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-white text-xl font-semibold mb-2 text-center">
                  🖼️ Photo Album 💕
                </h2>
                <p className="text-white/50 text-center text-sm mb-4">
                  ← → arrow · F = fullscreen · klik thumbnails
                </p>
                <PhotoAlbum />
              </motion.div>

              {/* ── PHOTO REEL ── */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-white text-xl font-semibold mb-2 text-center">
                  🎬 KenanganKita 💕
                </h2>
                <p className="text-white/50 text-center text-sm mb-4">
                  ▶ Play otomatis · ⌨ Arrow keys · F = fullscreen
                </p>
                <PhotoReel />
              </motion.div>

              {/* ── PHOTO MOSAIC (tetap ada di bawah) ── */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-white text-xl font-semibold mb-4 text-center mt-4">
                  📸 Semua Foto 💕
                </h2>
                <p className="text-white/50 text-center text-sm mb-4">
                  Klik foto untuk quote 💕
                </p>
                <PhotoMosaic />
              </motion.div>

              <footer className="text-center py-8 text-white/40">
                <p>Made with �� for Jijoy</p>
                <p className="text-sm">8 Maret 2025 - Sekarang</p>
              </footer>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ModeMalam>
  );
}