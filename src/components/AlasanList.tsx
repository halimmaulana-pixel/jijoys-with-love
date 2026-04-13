"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlasanItem {
  id: number;
  content: string;
  isRevealed: boolean;
}

const STORAGE_KEY = "alasan-revealed";

// Template alasan - customize dengan kejadian asli kalian
const TEMPLATE_REASONS: string[] = [
  "Cara kamu ketawa yang selalu buat aku ikut ketawa",
  "Kamu sempre inget hal-hal kecil yang aku suka",
  "Kemampuanmu buat rayuan yang tidak kaku",
  "Moment pertama kita di USU yang незабываемый",
  "Kamu selalu tahu kapan butuh dimengerti",
  "Cara kamu olhar aku yang berbeda dari yang lain",
  "Kepresence kamu yang membuat hari-hari aku lebih bright",
  "Kesabaranmu waktu aku lagi banyak pikiran",
  "Kamu tidak pernah buat aku merasa jako beban",
  "Cara kamu motivasi aku tanpa merasa seperti ngegurui",
  "Kamu selalu ingat anniversaries penting",
  "Keberanianmu untuk jadi diri sendiri",
  "Cara kamu menanganiku waktu aku lagi bad mood",
  "Kamu support semua goal aku",
  "Kerendahan hati kamu yang sangat menyentuh",
  "Cara kamu forgive dan lupa kesalahan aku",
  "Kamu membuat aku merasa aman dan dipahami",
  "Humor kamu yang khas dan tidak tertandingi",
  "Kesungguhanmu dalam hubungan ini",
  "Cara kamu listen tanpa interrumping",
  "Kamu tidak pernah bored mendengarkan ceritaku",
  "Kepekaanmu terhadap perasaan aku",
  "Cara kamu membuatku merasa spesial setiap hari",
  "Kemampuan kamu untuk forgive",
  "Kamu selalu buat aku tertawa even pas lagi sedih",
  "Cara kamu respect pandangan aku",
  "Kejujuranmu yang membangun",
  "Kamu membuat aku ingin jadi lebih baik",
  "Dukunganmu waktu aku lagi struggle",
  " Kamu tidak pernah judgment random ideas aku",
  "Cara kamu manage conflict dengan dewasa",
  "Keikhlasanmu buat belajar hal baru bareng aku",
  "Kamu membuat setiap moment jadi berkesan",
  "Cara kamu apreisasi hal-hal kecil",
  "Kesetiaanmu yang tidak tergoyah",
  " kamu membuat aku merasa dicintai dengan murni",
  "Semua pequenas coisas yang kamu lakukan",
  "Cara kamu mengusulkan date yang sempurna",
  "Kamu selalu push aku buat jadi lebih baik",
  "Ketulusanmu tanpa expectation balikan",
  " cara kamu handle aku waktu lagi jealous",
  "kamu tidak pernah bored cerita hal yang sama",
  "kehangatan kamu yang selalu invite",
  "kamu membuat aku merasa como home",
  "sensitivity kamu yang tidak berlebihan",
  "kamu membuat aku merasa jadi diri sendiri",
  " cara kamu memandang future sama-sama",
  "kamu selalu ingat hal-hal kecil tentang aku",
  "energi positif kamu yang contagious",
  "kamu adalah besten terjadi dalam hidup aku",
  "Semua yang kamu adalah alasan aku jatuh cinta",
];

const pastelColors = [
  "from-pink-200 to-rose-200",
  "from-purple-200 to-violet-200",
  "from-blue-200 to-cyan-200",
  "from-cyan-200 to-teal-200",
  "from-green-200 to-emerald-200",
  "from-yellow-200 to-amber-200",
  "from-orange-200 to-amber-200",
  "from-rose-200 to-pink-200",
];

function getCardColor(index: number): string {
  return pastelColors[index % pastelColors.length];
}

function loadRevealedStates(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(parsed);
    }
  } catch {
    // handle error
  }
  return new Set();
}

function saveRevealedStates(revealed: Set<number>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...revealed]));
  } catch {
    // handle error
  }
}

export default function AlasanList() {
  const [items, setItems] = useState<AlasanItem[]>(() =>
    TEMPLATE_REASONS.map((content, index) => ({
      id: index + 1,
      content,
      isRevealed: false,
    }))
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const revealed = loadRevealedStates();
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        isRevealed: revealed.has(item.id),
      }))
    );
  }, []);

  const handleReveal = useCallback((id: number) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, isRevealed: true } : item
      );
      const revealedSet = new Set(updated.filter((i) => i.isRevealed).map((i) => i.id));
      saveRevealedStates(revealedSet);
      return updated;
    });
  }, []);

  const revealedCount = items.filter((i) => i.isRevealed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            50 Reasons Why I Like You
          </h1>
          <p className="text-gray-600 text-lg">
            Tap the card to reveal - <span className="font-bold text-pink-500">{revealedCount}/50</span> revealed
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <AlasanCard
                key={item.id}
                item={item}
                index={index}
                onReveal={handleReveal}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface AlasanCardProps {
  item: AlasanItem;
  index: number;
  onReveal: (id: number) => void;
}

function AlasanCard({ item, index, onReveal }: AlasanCardProps) {
  const colorClass = getCardColor(index);

  if (!item.isRevealed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: index * 0.03,
          duration: 0.4,
          ease: "easeOut",
        }}
        className="relative h-32 md:h-40 cursor-pointer group"
        onClick={() => onReveal(item.id)}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/40 shadow-lg group-hover:shadow-xl transition-shadow duration-300" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.03 + 0.2, type: "spring" }}
            className="text-4xl md:text-5xl font-bold text-pink-300/50"
          >
            {item.id}
          </motion.span>
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-pink-200/50 group-hover:border-pink-300/70 transition-colors duration-300" />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.03,
        duration: 0.4,
        ease: "easeOut",
      }}
      className="relative h-32 md:h-40 cursor-pointer"
      onClick={() => onReveal(item.id)}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorClass} shadow-lg`}
        />
        <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/40" />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <p className="text-center text-gray-700 font-medium text-sm md:text-base leading-relaxed">
            {item.content}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}