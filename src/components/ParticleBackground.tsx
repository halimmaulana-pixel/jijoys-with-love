/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';

interface ParticleBackgroundProps {
  particleCount?: number;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

export default function ParticleBackground({ 
  particleCount = 30
}: ParticleBackgroundProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles on client side only when component mounts
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  const hearts = ['💕', '💗', '💖', '🧡', '❤️'];

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-30px) translateX(10px); }
          50% { transform: translateY(-15px) translateX(-10px); }
          75% { transform: translateY(-40px) translateX(5px); }
        }
        @keyframes floatHeart {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(-100px) scale(1); opacity: 0; }
        }
      `}</style>

      {/* Floating dots */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#ff69b4',
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 2}px #ff69b4`,
          }}
        />
      ))}

      {/* Floating hearts rising up */}
      {hearts.map((emoji, i) => (
        <div
          key={`heart-${i}`}
          className="absolute"
          style={{
            left: `${(i + 1) * 10}%`,
            fontSize: 20,
            animation: `floatHeart ${12 + i * 0.5}s linear infinite`,
            animationDelay: `${i * 1.2}s`,
            opacity: 0.7,
          }}
        >
          {emoji}
        </div>
      ))}
    </div>
  );
}