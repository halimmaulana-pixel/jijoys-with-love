/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  createdAt: number;
}

interface EnvelopeState {
  isOpen: boolean;
  hasOpened: boolean;
}

export default function Hero() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [envelope, setEnvelope] = useState<EnvelopeState>({ isOpen: false, hasOpened: false });
  const [isVisible, setIsVisible] = useState(false);
  const heartIdRef = useRef(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const addHeart = useCallback((x: number, y: number) => {
    const newHeart: Heart = {
      id: heartIdRef.current++,
      x,
      y,
      createdAt: Date.now(),
    };
    setHearts((prev) => [...prev.slice(-30), newHeart]);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.4) {
        addHeart(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [addHeart]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setHearts((prev) => prev.filter((h) => now - h.createdAt < 1500));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleEnvelopeClick = () => {
    if (!envelope.hasOpened) {
      setEnvelope({ isOpen: true, hasOpened: true });
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setEnvelope({ isOpen: true, hasOpened: true });
        });
      }
    }
  };

  const staggerDelay = 'delay-100';

  return (
    <>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heart-float {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(-40px) scale(0.5); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
        .animate-heart-float { animation: heart-float 1.5s ease-out forwards; }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-cream-50">
        <div className="absolute inset-0 animated-gradient" style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(255,182,193,0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(255,218,185,0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255,240,245,0.5) 0%, transparent 60%)',
        }} />

        <div className="absolute inset-0 animate-pulse-soft" style={{
          background: 'linear-gradient(45deg, rgba(255,192,203,0.1) 0%, rgba(255,240,245,0.1) 50%, rgba(255,182,193,0.1) 100%)',
        }} />

        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute pointer-events-none text-pink-400 animate-heart-float"
            style={{
              left: heart.x,
              top: heart.y,
              transform: 'translate(-50%, -50%)',
              fontSize: '16px',
              animationDuration: '1.5s',
            }}
          >
            💕
          </div>
        ))}

        <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h1
            className={`mb-12 text-5xl md:text-7xl font-light text-center bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent drop-shadow-sm ${isVisible ? staggerDelay : ''}`}
            style={{ animationDelay: isVisible ? '0.2s' : '0s' }}
          >
            Untuk AZ 💕
          </h1>

          <div
            className="relative cursor-pointer group"
            onClick={handleEnvelopeClick}
            style={{ animationDelay: isVisible ? '0.4s' : '0s' }}
          >
            <div className={`relative transition-all duration-700 ${envelope.isOpen ? 'scale-110' : 'scale-100 hover:scale-105'}`}>
              <svg
                viewBox="0 0 200 160"
                className="w-48 h-40 md:w-64 md:h-52 drop-shadow-xl"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(255,182,193,0.4))' }}
              >
                <defs>
                  <linearGradient id="envelopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE4E6" />
                    <stop offset="50%" stopColor="#FFF0F5" />
                    <stop offset="100%" stopColor="#FFE4E6" />
                  </linearGradient>
                  <linearGradient id="flapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCE7F3" />
                    <stop offset="100%" stopColor="#FBCFE8" />
                  </linearGradient>
                </defs>

                <rect
                  x="10"
                  y="40"
                  width="180"
                  height="110"
                  rx="8"
                  fill="url(#envelopeGradient)"
                  className="transition-all duration-500"
                  style={{
                    transform: envelope.isOpen ? 'translateY(10px)' : 'translateY(0)',
                    opacity: envelope.isOpen ? 0.7 : 1,
                  }}
                />

                <path
                  d="M100 40 L10 90 L10 140 Q10 150 20 150 L180 150 Q190 150 190 140 L190 90 L100 40"
                  fill="rgba(255,255,255,0.3)"
                  stroke="rgba(255,182,193,0.5)"
                  strokeWidth="1"
                />

                <path
                  d="M10 90 L100 140 L190 90"
                  fill="none"
                  stroke="rgba(255,182,193,0.6)"
                  strokeWidth="2"
                  className="transition-all duration-500"
                  style={{
                    transform: envelope.isOpen ? 'translateY(20px) rotateX(180deg)' : 'translateY(0)',
                    transformOrigin: '100px 90px',
                  }}
                />

                <g
                  className="transition-all duration-700 ease-out"
                  style={{
                    transform: envelope.isOpen ? 'translateY(-60px) rotateX(-180deg)' : 'translateY(0)',
                    transformOrigin: '100px 40px',
                    opacity: envelope.isOpen ? 0 : 1,
                  }}
                >
                  <path
                    d="M100 10 L10 70 L100 40 L190 70 Z"
                    fill="url(#flapGradient)"
                    stroke="rgba(255,182,193,0.7)"
                    strokeWidth="1"
                  />
                </g>

                {envelope.isOpen && (
                  <g className="transition-all duration-700 delay-200" style={{ opacity: envelope.isOpen ? 1 : 0 }}>
                    <text
                      x="100"
                      y="100"
                      textAnchor="middle"
                      className="text-2xl"
                      fill="#EC4899"
                      style={{ fontSize: '24px' }}
                    >
                      💌
                    </text>
                  </g>
                )}
              </svg>

              {!envelope.hasOpened && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-pink-400 text-sm animate-pulse whitespace-nowrap">
                  Klik untuk buka 💕
                </div>
              )}
            </div>

            <div className="absolute -inset-4 rounded-full bg-pink-200/20 blur-xl group-hover:bg-pink-300/30 transition-all duration-500" />
          </div>

          <p
            className={`mt-16 text-lg md:text-xl text-rose-400/80 text-center max-w-md ${isVisible ? staggerDelay : ''}`}
            style={{ animationDelay: isVisible ? '0.6s' : '0s' }}
          >
            Dengan cinta 💝
          </p>
        </div>

        <div className="absolute bottom-8 left-8 text-pink-300/40 text-sm">
          ✨ Move your mouse around ✨
        </div>
      </div>
    </>
  );
}