/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, react-hooks/refs, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

type AnimationMode = 'chase' | 'scatter' | 'orbit' | 'bounce';

interface LetterState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  angle: number;
  orbitAngle: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

const LETTERS = 'JIJOY';
const LETTER_COUNT = LETTERS.length;

export default function ChasingLetters() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  
  const [mode, setMode] = useState<AnimationMode>('chase');
  const [isLoaded, setIsLoaded] = useState(false);

  const lettersRef = useRef<LetterState[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);

  const initializeLetters = useCallback(() => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const spacing = rect.width / (LETTER_COUNT + 1);

    lettersRef.current = Array.from({ length: LETTER_COUNT }, (_, i) => ({
      x: centerX + (i - (LETTER_COUNT - 1) / 2) * 60,
      y: centerY,
      targetX: centerX + (i - (LETTER_COUNT - 1) / 2) * 60,
      targetY: centerY,
      vx: 0,
      vy: 0,
      angle: 0,
      orbitAngle: (i / LETTER_COUNT) * Math.PI * 2,
    }));
  }, []);

  const spawnParticle = useCallback((x: number, y: number) => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    particlesRef.current.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 1,
      size: Math.random() * 3 + 1,
    });
  }, []);

  const updateLetters = useCallback((deltaTime: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    lettersRef.current.forEach((letter, index) => {
      switch (mode) {
        case 'chase':
          if (mouseRef.current.active) {
            const offsetX = (index - (LETTER_COUNT - 1) / 2) * 40;
            const offsetY = Math.sin(Date.now() / 500 + index) * 20;
            letter.targetX = mouseRef.current.x + offsetX;
            letter.targetY = mouseRef.current.y + offsetY;
          } else {
            letter.targetX = centerX + (index - (LETTER_COUNT - 1) / 2) * 60;
            letter.targetY = centerY;
          }
          letter.x += (letter.targetX - letter.x) * 0.08;
          letter.y += (letter.targetY - letter.y) * 0.08;
          letter.angle = (letter.targetX - letter.x) * 0.02;
          if (Math.random() < 0.1) {
            spawnParticle(letter.x, letter.y);
          }
          break;

        case 'scatter':
          letter.targetX = mouseRef.current.active 
            ? mouseRef.current.x + (Math.random() - 0.5) * 200
            : centerX + (Math.random() - 0.5) * 100;
          letter.targetY = mouseRef.current.active
            ? mouseRef.current.y + (Math.random() - 0.5) * 200
            : centerY + (Math.random() - 0.5) * 100;
          letter.x += (letter.targetX - letter.x) * 0.05;
          letter.y += (letter.targetY - letter.y) * 0.05;
          letter.angle = Math.sin(Date.now() / 200 + index) * 0.3;
          if (Math.random() < 0.15) {
            spawnParticle(letter.x, letter.y);
          }
          break;

        case 'orbit':
          letter.orbitAngle += 0.02;
          const radius = 80 + Math.sin(Date.now() / 1000 + index) * 30;
          const targetX = centerX + Math.cos(letter.orbitAngle + index * 0.5) * radius;
          const targetY = centerY + Math.sin(letter.orbitAngle + index * 0.5) * radius;
          letter.x += (targetX - letter.x) * 0.1;
          letter.y += (targetY - letter.y) * 0.1;
          letter.angle = Math.sin(letter.orbitAngle) * 0.2;
          if (Math.random() < 0.08) {
            spawnParticle(
              centerX + Math.cos(letter.orbitAngle) * radius * 0.5,
              centerY + Math.sin(letter.orbitAngle) * radius * 0.5
            );
          }
          break;

        case 'bounce':
          letter.vy += 0.5;
          letter.vx *= 0.99;
          letter.x += letter.vx;
          letter.y += letter.vy;

          if (letter.y > rect.height - 40) {
            letter.y = rect.height - 40;
            letter.vy = -Math.abs(letter.vy) * 0.7;
            letter.vx += (Math.random() - 0.5) * 4;
          }
          if (letter.x < 30) {
            letter.x = 30;
            letter.vx = Math.abs(letter.vx) * 0.8;
          }
          if (letter.x > rect.width - 30) {
            letter.x = rect.width - 30;
            letter.vx = -Math.abs(letter.vx) * 0.8;
          }

          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - letter.x;
            const dy = mouseRef.current.y - letter.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
              const force = (80 - dist) / 80;
              letter.vx -= (dx / dist) * force * 8;
              letter.vy -= (dy / dist) * force * 8;
            }
          }
          letter.angle = letter.vx * 0.05;
          if (Math.random() < 0.05) {
            spawnParticle(letter.x, letter.y);
          }
          break;
      }
    });
  }, [mode, spawnParticle]);

  const updateParticles = useCallback(() => {
    particlesRef.current = particlesRef.current
      .map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02,
        vx: p.vx * 0.98,
        vy: p.vy * 0.98,
      }))
      .filter(p => p.life > 0);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach(p => {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      gradient.addColorStop(0, `rgba(255, 182, 193, ${p.life * 0.8})`);
      gradient.addColorStop(1, `rgba(219, 112, 147, 0)`);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
      ctx.fill();
    });
  }, []);

  const animate = useCallback((time: number) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    updateLetters(deltaTime);
    updateParticles();
    draw();

  }, [updateLetters, updateParticles, draw]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', handleMouseMove);
    container?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove);
      container?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = rect.width;
        canvasRef.current.height = rect.height;
      }
      initializeLetters();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeLetters]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getModeLabel = (m: AnimationMode): string => {
    switch (m) {
      case 'chase': return 'Chase';
      case 'scatter': return 'Scatter';
      case 'orbit': return 'Orbit';
      case 'bounce': return 'Bounce';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      ref={containerRef}
      className="relative w-full h-[200px] rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,182,193,0.3) 0%, rgba(219,112,147,0.3) 50%, rgba(147,112,219,0.3) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(219,112,147,0.2), inset 0 0 60px rgba(255,255,255,0.1)',
      }}
    >
      <style jsx>{`
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(255,182,193,0.8)) drop-shadow(0 0 16px rgba(219,112,147,0.6)); }
          50% { filter: drop-shadow(0 0 12px rgba(255,182,193,1)) drop-shadow(0 0 24px rgba(219,112,147,0.8)); }
        }
        .glow-text {
          animation: glow-pulse 2s ease-in-out infinite;
        }
      `}</style>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {lettersRef.current.map((letter, index) => (
        <motion.div
          key={`tracking-${index}`}
          className="absolute pointer-events-none glow-text"
          style={{
            left: letter.x,
            top: letter.y,
            zIndex: 3,
            transform: `translate(-50%, -50%) rotate(${letter.angle * (180 / Math.PI)}deg)`,
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 0 10px rgba(255,182,193,0.8), 0 0 20px rgba(219,112,147,0.6), 0 0 30px rgba(147,112,219,0.4)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {LETTERS[index]}
        </motion.div>
      ))}

      <div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        style={{ zIndex: 10 }}
      >
        {(['chase', 'scatter', 'orbit', 'bounce'] as AnimationMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-xs rounded-full transition-all duration-300 ${
              mode === m
                ? 'bg-white/40 text-rose-600 shadow-lg'
                : 'bg-white/20 text-white/70 hover:bg-white/30'
            }`}
            style={{
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {getModeLabel(m)}
          </button>
        ))}
      </div>
    </motion.div>
  );
}