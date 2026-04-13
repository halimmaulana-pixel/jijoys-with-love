'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const MOODS = [
  { id: 'happy', emoji: '😊', label: 'Bahagia' },
  { id: 'love', emoji: '🥰', label: 'Jatuh Cinta' },
  { id: 'miss', emoji: '🥺', label: 'Kangen' },
  { id: 'grateful', emoji: '🙏', label: 'Bersyukur' },
  { id: 'excited', emoji: '✨', label: 'Semangat' },
  { id: 'shy', emoji: '🌸', label: 'Malu-malu' },
];

const MOOD_MESSAGES: Record<string, string> = {
  happy: 'Kebahagiaan yang kamu rasakan itu nyata, dan aku ingin menjadi bagian darinya selamanya 🌟',
  love: 'Melihatmu jatuh cinta adalah hal terindah yang pernah aku rasakan. Dan aku jatuh cinta padamu setiap hari 🥰',
  miss: 'Rindu itu tanda betapa pentingnya kamu. Dan kamu sangat, sangat penting bagiku 🌸',
  grateful: 'Bersyukur adalah kekuatan terbesar. Dan aku bersyukur setiap hari bisa mengenalmu 🙏',
  excited: 'Energimu menular! Aku ikut semangat hanya karena kamu ada 🌈',
  shy: 'Bahkan rasa malu-malunya itu adorable banget. Aku suka versi kamu yang ini juga 🌷',
};

interface MoodSelectorProps {
  onMoodSelect?: (mood: string) => void;
}

export default function MoodSelector({ onMoodSelect }: MoodSelectorProps) {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleMoodClick = (moodId: string) => {
    setActiveMood(moodId);
    onMoodSelect?.(moodId);
    createBurst();
  };

  const createBurst = () => {
    const colors = ['#ff4d9e', '#c084fc', '#f59e0b', '#ff85bb', '#e879f9'];
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('div');
      spark.style.cssText = `
        position: fixed;
        width: ${6 + Math.random() * 10}px;
        height: ${6 + Math.random() * 10}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
        animation: sparkPop 0.6s ease forwards;
      `;
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
    >
      <div className="text-center mb-4">
        <span className="text-xs tracking-widest uppercase text-white/50">
          Bagaimana perasaanmu hari ini?
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.id}
            onClick={() => handleMoodClick(mood.id)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
              ${activeMood === mood.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/10'
              }
            `}
          >
            {mood.emoji} {mood.label}
          </motion.button>
        ))}
      </div>
      {activeMood && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/90 italic font-serif text-lg"
        >
          {MOOD_MESSAGES[activeMood]}
        </motion.p>
      )}
    </motion.div>
  );
}
