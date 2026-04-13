'use client';

interface ParticleBackgroundProps {
  particleCount?: number;
}

export default function ParticleBackground({ 
  particleCount = 30
}: ParticleBackgroundProps) {
  // Generate random particle positions
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDuration: Math.random() * 10 + 15,
    animationDelay: Math.random() * 5,
    size: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.2,
  }));

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            backgroundColor: '#ff69b4',
            opacity: p.opacity,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
            boxShadow: `0 0 ${p.size * 2}px #ff69b4`,
          }}
        />
      ))}
      {/* Floating hearts */}
      {Array.from({ length: 10 }, (_, i) => (
        <div
          key={`heart-${i}`}
          className="absolute animate-float-heart"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 20 + 10}px`,
            animationDuration: `${Math.random() * 8 + 12}s`,
            animationDelay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.6 + 0.3,
          }}
        >
          {['💕', '💗', '💖', '🧡', '❤️'][i % 5]}
        </div>
      ))}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-30px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-40px) translateX(5px);
          }
        }
        @keyframes floatHeart {
          0% {
            transform: translateY(100vh) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100px) scale(1);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
        .animate-float-heart {
          animation: floatHeart linear infinite;
        }
      `}</style>
    </div>
  );
}