'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthday: boolean;
  isPast: boolean;
}

interface FlipDigitProps {
  value: number;
  label: string;
  prevValue: number;
  isDoubleDigit?: boolean;
}

const BIRTHDAY_MONTH = 11;
const BIRTHDAY_DAY = 14;

function getNextBirthday(): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  let birthday = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
  
  if (now > birthday) {
    birthday = new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY, 0, 0, 0, 0);
  }
  
  return birthday;
}

function isBirthdayToday(): boolean {
  const now = new Date();
  return now.getMonth() === BIRTHDAY_MONTH && now.getDate() === BIRTHDAY_DAY;
}

function calculateCountdown(): CountdownData {
  const now = new Date();
  const birthday = getNextBirthday();
  
  if (isBirthdayToday()) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: true, isPast: false };
  }
  
  const diff = birthday.getTime() - now.getTime();
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isBirthday: false, isPast: true };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, isBirthday: false, isPast: false };
}

function FlipDigit({ value, label, prevValue, isDoubleDigit = false }: FlipDigitProps) {
  const isChanged = value !== prevValue;
  const displayValue = isDoubleDigit ? value.toString().padStart(2, '0') : value.toString();
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-10 h-12 md:w-14 md:h-16 perspective-container">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={displayValue}
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
            <span className="text-xl md:text-2xl font-light text-rose-500 drop-shadow-sm">
              {displayValue}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 md:mt-2 text-[10px] md:text-xs text-rose-400/80 font-medium">{label}</span>
    </div>
  );
}

export default function CountdownUltah() {
  const [countdown, setCountdown] = useState<CountdownData>(calculateCountdown);
  const [prevCountdown, setPrevCountdown] = useState<CountdownData>(countdown);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPrevCountdown(countdown);
      setCountdown(calculateCountdown());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [countdown]);
  
  const formatDays = (days: number): number[] => {
    if (days >= 100) {
      return [Math.floor(days / 100), Math.floor((days % 100) / 10), days % 10];
    }
    return [Math.floor(days / 10), days % 10];
  };
  
  const dayDigits = formatDays(countdown.days);
  
  if (countdown.isBirthday) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        <div 
          className="glass-card rounded-3xl p-6 md:p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,240,245,0.25) 100%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h2 className="text-3xl md:text-5xl font-light text-rose-500 mb-4 drop-shadow-sm">
              HAPPY BIRTHDAY! 🎂💕
            </h2>
            <p className="text-lg md:text-xl text-rose-400/80">
              Selamat ulang tahun yang ke-🎉
            </p>
          </motion.div>
        </div>
      </div>
    );
  }
  
  if (countdown.isPast) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-8">
        <div 
          className="glass-card rounded-3xl p-6 md:p-10 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,240,245,0.25) 100%)',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <h2 className="text-2xl md:text-3xl font-light text-rose-500 mb-3 drop-shadow-sm">
             Ultah Berikutnya
            </h2>
            <p className="text-base md:text-lg text-rose-400/70">
              14 Desember tahun depan 💕
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl md:text-3xl"
              >
                🎂
              </motion.span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
                className="text-2xl md:text-3xl"
              >
                💕
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
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
        <div className="glass-card rounded-3xl p-5 md:p-10">
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-2xl md:text-3xl font-light shimmer-text mb-1">
              Countdown Ultah
            </h2>
            <p className="text-xs md:text-sm text-rose-400/70">
              14 Desember
            </p>
          </div>
          
          <div className="flex justify-center items-center gap-1.5 md:gap-3">
            {dayDigits.length === 3 ? (
              <FlipDigit value={dayDigits[0]} label="Ratus" prevValue={formatDays(prevCountdown.days)[0]} />
            ) : null}
            {dayDigits.length >= 2 && (
              <FlipDigit 
                value={dayDigits.length === 3 ? dayDigits[1] : dayDigits[0]} 
                label={dayDigits.length === 3 ? "Puluh" : "Hari"} 
                prevValue={dayDigits.length === 3 ? formatDays(prevCountdown.days)[1] : formatDays(prevCountdown.days)[0]} 
              />
            )}
            <FlipDigit 
              value={dayDigits[dayDigits.length - 1]} 
              label={dayDigits.length === 2 ? "Hari" : ""} 
              prevValue={formatDays(prevCountdown.days)[dayDigits.length - 1]} 
              isDoubleDigit={dayDigits.length === 1}
            />
            
            <span className="text-xl md:text-2xl text-rose-300 mx-0.5 md:mx-1">:</span>
            
            <FlipDigit value={countdown.hours} label="Jam" prevValue={prevCountdown.hours} isDoubleDigit />
            
            <span className="text-xl md:text-2xl text-rose-300 mx-0.5 md:mx-1">:</span>
            
            <FlipDigit value={countdown.minutes} label="Menit" prevValue={prevCountdown.minutes} isDoubleDigit />
            
            <span className="text-xl md:text-2xl text-rose-300 mx-0.5 md:mx-1">:</span>
            
            <FlipDigit value={countdown.seconds} label="Detik" prevValue={prevCountdown.seconds} isDoubleDigit />
          </div>
          
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs md:text-sm text-rose-400/60 italic">
              Menanti hari specialmu 💕
            </p>
          </div>
        </div>
      </div>
    </>
  );
}