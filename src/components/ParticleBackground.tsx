'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

interface ParticleBackgroundProps {
  type?: 'circle' | 'cobweb' | 'square' | 'fountain' | 'polygon';
  color?: string;
  bg?: boolean;
  num?: number;
}

export default function ParticleBackground({ 
  type = 'fountain', 
  color = '#ff69b4',
  bg = false,
  num = 60 
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initParticles = async () => {
      if (!isMounted || !containerRef.current) return;
      
      try {
        const particles = await import('particles-bg');
        const ParticlesBg = particles.default as unknown as new (el: HTMLElement, opts: unknown) => void;
        
        if (containerRef.current && isMounted) {
          new ParticlesBg(containerRef.current, {
            type,
            num,
            color,
            bg,
          });
        }
      } catch (error) {
        console.error('Failed to load particles-bg:', error);
      }
    };

    initParticles();

    return () => {
      isMounted = false;
    };
  }, [type, color, bg, num]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    />
  );
}