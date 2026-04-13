'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ModeMalam from '@/components/ModeMalam';
import PasswordScreen from '@/components/PasswordScreen';
import PhotoMosaic from '@/components/PhotoMosaic';
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
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + 'vw', 
            y: '100vh',
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            y: -100,
            x: Math.random() * 100 + 'vw',
            rotate: Math.random() * 360,
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute text-2xl"
          style={{ left: Math.random() * 100 + '%' }}
        >
          {['💕', '💗', '💖', '🧡', '❤️'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  );
}

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unlocked = localStorage.getItem('love-website-unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
    setIsLoading(false);
  }, []);

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <MoodSelector />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-white text-xl font-semibold mb-4 text-center">
                  📸 Kenangan Kita 💕
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