'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  opacity: number;
}

interface ParticleBackgroundProps {
  particleCount?: number;
  color?: string;
}

export default function ParticleBackground({ 
  particleCount = 60,
  color = '#ff69b4'
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    // Animation loop
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
        if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      // Draw connecting lines between nearby particles
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = color;
            ctx.globalAlpha = (1 - dist / 150) * 0.3;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [dimensions, particleCount, color]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    />
  );
}