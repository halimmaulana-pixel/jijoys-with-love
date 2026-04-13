'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface RelationshipData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const START_DATE = new Date('2025-03-08T00:00:00');

function calculateTimeSinceStart(): RelationshipData {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds };
}

function FlipDigit({ value, label, prevValue }: { value: number; label: string; prevValue: number }) {
  const isChanged = value !== prevValue;
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-12 h-16 md:w-16 md:h-20 perspective-container">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={value}
            initial={isChanged ? { rotateX: -90, opacity: 0 } : false}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center rounded-lg"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,240,245,0.7))',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.8), 0 4px 12px rgba(255,182,193,0.3)',
              backfaceVisibility: 'hidden',
            }}
          >
            <span className="text-2xl md:text-3xl font-light text-rose-500 drop-shadow-sm">
              {value.toString().padStart(2, '0')}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-xs md:text-sm text-rose-400/80 font-medium">{label}</span>
    </div>
  );
}

export default function RelationshipCounter() {
  const [time, setTime] = useState<RelationshipData>(calculateTimeSinceStart);
  const [prevTime, setPrevTime] = useState<RelationshipData>(time);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevTime(time);
      setTime(calculateTimeSinceStart());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [time]);
  
  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0%, 100% { background-position: -200% center; }
          50% { background-position: 200% center; }
        }
        .shimmer-text {
          background: linear-gradient(
            90deg,
            #f472b6 0%,
            #f9a8d4 25%,
            #f472b6 50%,
            #f9a8d4 75%,
            #f472b6 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .glass-card {
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.25) 0%,
            rgba(255,240,245,0.15) 100%
          );
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow: 
            0 8px 32px rgba(255,182,193,0.2),
            inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .perspective-container {
          perspective: 200px;
        }
      `}</style>
      
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        <div className="glass-card rounded-3xl p-6 md:p-10">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-3xl md:text-4xl font-light shimmer-text mb-2">
              Hari ke-{time.days}
            </h2>
            <p className="text-sm md:text-base text-rose-400/70">
              8 Maret 2025 - Sekarang
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-2 md:gap-4">
            <FlipDigit value={Math.floor(time.days / 100)} label="Ratus" prevValue={Math.floor(prevTime.days / 100)} />
            <FlipDigit value={Math.floor((time.days % 100) / 10)} label="Puluh" prevValue={Math.floor((prevTime.days % 100) / 10)} />
            <FlipDigit value={time.days % 10} label="Hari" prevValue={prevTime.days % 10} />
            
            <span className="text-2xl md:text-3xl text-rose-300 mx-1 md:mx-2">:</span>
            
            <FlipDigit value={time.hours} label="Jam" prevValue={prevTime.hours} />
            
            <span className="text-2xl md:text-3xl text-rose-300 mx-1 md:mx-2">:</span>
            
            <FlipDigit value={time.minutes} label="Menit" prevValue={prevTime.minutes} />
            
            <span className="text-2xl md:text-3xl text-rose-300 mx-1 md:mx-2">:</span>
            
            <FlipDigit value={time.seconds} label="Detik" prevValue={prevTime.seconds} />
          </div>
          
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-sm md:text-base text-rose-400/60 italic">
              Setiap detik bersamamu adalah anugerah 💕
            </p>
          </div>
        </div>
      </div>
    </>
  );
}