'use client';

import { useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

interface Milestone {
  id: number;
  date: string;
  title: string;
  details: string;
}

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
  isLast: boolean;
}

const milestones: Milestone[] = [
  {
    id: 1,
    date: '8 Maret 2025',
    title: 'Pertama chat 💬',
    details: 'Momen pertama kita mulai komunikasi. Awal dari segalanya, titik awal perjalanan indah kita.',
  },
  {
    id: 2,
    date: 'Juni 2025',
    title: 'Jalan pertama - USU → Kopi Helvet 🚶',
    details: 'Jalan kaki dari USU ke Kopi Helvet. Wajah kamu yang pertama kali aku lihat di bawah cahaya lampu jalan itu, masih terbingkit di benakku.',
  },
  {
    id: 3,
    date: '14 Desember 2025',
    title: 'Ultah AZ 🎂',
    details: 'Ultah pertama kita bersama. Hadiah sederhana yang kubuat dengan hati, dan senyummu yang membuat hari itu tak terlupakan.',
  },
  {
    id: 4,
    date: '8 Maret 2026',
    title: '1 Tahun bersama 💕',
    details: 'Satu tahun penuh kenangan, tawa, tangis, dan cinta. Setiap momen bersamamu adalah anugerah terindah dalam hidupku.',
  },
];

function MilestoneItem({ milestone, index, isLast }: MilestoneItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="relative flex gap-4 md:gap-6">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.4, delay: index * 0.15, type: 'spring', stiffness: 200 }}
          className="relative z-10 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 shadow-lg shadow-pink-300/50"
        >
          <div className="absolute inset-0 rounded-full bg-rose-300 animate-ping opacity-30" />
        </motion.div>
        
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={isInView ? { height: '100%' } : { height: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
            className="w-0.5 md:w-1 bg-gradient-to-b from-pink-300 via-rose-300 to-pink-200 mt-2"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,182,193,0.8), rgba(244,163,155,0.5), rgba(255,182,193,0.3))',
            }}
          />
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.1 }}
        className="flex-1 pb-6 md:pb-8"
      >
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left group"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="relative p-4 md:p-6 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-md"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,240,245,0.2) 100%)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: '0 8px 32px rgba(255,182,193,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-pink-100/30 to-rose-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 text-xs md:text-sm font-medium text-rose-500 bg-rose-100/50 rounded-full mb-2 md:mb-3">
                {milestone.date}
              </span>
              
              <h3 className="text-lg md:text-xl font-medium text-rose-800 group-hover:text-rose-700 transition-colors">
                {milestone.title}
              </h3>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm md:text-base text-rose-600/80 leading-relaxed">
                      {milestone.details}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`mt-2 text-rose-400/60 text-xs md:text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                {isExpanded ? '▲ Tutup' : '▼ Selengkapnya'}
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function MilestoneTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  return (
    <section className="relative py-12 md:py-20 px-4 md:px-8 overflow-hidden">
      <style jsx>{`
        @keyframes float-bg {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        .animate-float-bg {
          animation: float-bg 8s ease-in-out infinite;
        }
      `}</style>

      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-cream-50" />
      
      <div className="absolute top-20 left-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-pink-200/20 blur-3xl animate-float-bg" />
      <div className="absolute bottom-20 right-10 w-40 h-40 md:w-56 md:h-56 rounded-full bg-rose-200/20 blur-3xl animate-float-bg" style={{ animationDelay: '2s' }} />
      
      <div ref={containerRef} className="relative z-10 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-light bg-gradient-to-r from-pink-400 via-rose-400 to-pink-300 bg-clip-text text-transparent mb-3">
            Timeline Cinta Kita 💕
          </h2>
          <p className="text-rose-400/70 text-sm md:text-base">
            Klik setiap momen untuk melihat detail
          </p>
        </motion.div>

        <div className="space-y-0">
          {milestones.map((milestone, index) => (
            <MilestoneItem
              key={milestone.id}
              milestone={milestone}
              index={index}
              isLast={index === milestones.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
