/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

type ModeType = 'day' | 'night';
type ModePreference = 'auto' | 'day' | 'night';

interface ModeMalamProps {
  children: React.ReactNode;
}

interface Star {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

function getCurrentTimeMode(): ModeType {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
}

function generateStars(count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 2 + Math.random() * 3,
    });
  }
  return stars;
}

export default function ModeMalam({ children }: ModeMalamProps) {
  const [mode, setMode] = useState<ModeType>('day');
  const [preference, setPreference] = useState<ModePreference>('auto');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const stars = useMemo(() => generateStars(30), []);

  const determineMode = useCallback((): ModeType => {
    if (preference !== 'auto') {
      return preference;
    }
    return getCurrentTimeMode();
  }, [preference]);

  useEffect(() => {
    const newMode = determineMode();
    if (newMode !== mode) {
      setIsTransitioning(true);
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setMode(newMode);
        });
      } else {
        setMode(newMode);
      }
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [preference, determineMode, mode]);

  useEffect(() => {
    const checkTime = setInterval(() => {
      if (preference === 'auto') {
        const newMode = getCurrentTimeMode();
        if (newMode !== mode) {
          setIsTransitioning(true);
          setMode(newMode);
          setTimeout(() => setIsTransitioning(false), 500);
        }
      }
    }, 60000);

    return () => clearInterval(checkTime);
  }, [preference, mode]);

  useEffect(() => {
    const saved = localStorage.getItem('mode-preference') as ModePreference | null;
    if (saved) {
      setPreference(saved);
    }
  }, []);

  const handlePreferenceChange = (newPref: ModePreference) => {
    setPreference(newPref);
    localStorage.setItem('mode-preference', newPref);
  };

  const isNight = mode === 'night';

  return (
    <>
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .star-fall {
          animation: fall linear infinite;
        }
        .star-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .star-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
      `}</style>

      <div
        className={`relative min-h-screen transition-all duration-500 ease-in-out ${
          isTransitioning ? 'opacity-90' : 'opacity-100'
        }`}
        style={{
          background: isNight
            ? 'linear-gradient(to bottom, #0f0c29, #302b63, #24243e)'
            : 'linear-gradient(135deg, #ffe4e6 0%, #fff1f2 50%, #fef3c7 100%)',
        }}
      >
        {isNight && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {stars.map((star) => (
              <div
                key={star.id}
                className="absolute star-fall text-white"
                style={{
                  left: `${star.left}%`,
                  top: '-20px',
                  animationDelay: `${star.delay}s`,
                  animationDuration: `${star.duration}s`,
                  fontSize: `${star.size}px`,
                }}
              >
                ✦
              </div>
            ))}
            <div
              className="absolute inset-0 star-shimmer"
              style={{
                background:
                  'radial-gradient(2px 2px at 20% 30%, white 100%, transparent), radial-gradient(2px 2px at 40% 70%, white 100%, transparent), radial-gradient(1px 1px at 60% 20%, white 100%, transparent), radial-gradient(2px 2px at 80% 50%, white 100%, transparent), radial-gradient(1px 1px at 10% 80%, white 100%, transparent), radial-gradient(2px 2px at 70% 90%, white 100%, transparent)',
                backgroundSize: '200px 200px',
              }}
            />
          </div>
        )}

        <div
          className="relative z-10"
          style={{
            background: isNight
              ? 'rgba(15, 12, 41, 0.7)'
              : 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: isNight
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: isNight
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(255, 182, 193, 0.2)',
          }}
        >
          {children}
        </div>

        <div
          className="fixed top-4 right-4 z-50 flex gap-2"
          style={{
            background: isNight
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            padding: '8px 12px',
            borderRadius: '20px',
            border: isNight
              ? '1px solid rgba(255, 255, 255, 0.15)'
              : '1px solid rgba(255, 182, 193, 0.3)',
          }}
        >
          {(['auto', 'day', 'night'] as ModePreference[]).map((pref) => (
            <button
              key={pref}
              onClick={() => handlePreferenceChange(pref)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                preference === pref
                  ? isNight
                    ? 'bg-white/20 text-white'
                    : 'bg-pink-200 text-pink-700'
                  : isNight
                  ? 'text-white/60 hover:text-white'
                  : 'text-pink-400/80 hover:text-pink-600'
              }`}
              style={{
                fontWeight: preference === pref ? 600 : 400,
              }}
            >
              {pref === 'auto' ? '🤖' : pref === 'day' ? '☀️' : '🌙'}
            </button>
          ))}
        </div>

        <div
          className="fixed bottom-4 right-4 z-50 text-xs px-3 py-1 rounded-full"
          style={{
            background: isNight
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.7)',
            color: isNight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(236, 72, 153, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {isNight ? 'Malam 🌙' : 'Siang ☀️'} • {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </>
  );
}