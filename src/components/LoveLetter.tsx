/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";

interface Story {
  id: number;
  date: string;
  title: string;
  content: string;
}

const REAL_STORIES: Story[] = [
  {
    id: 1,
    date: "8 Maret 2025",
    title: "Pertama Chat",
    content: "Hari ini pertama kali kita chat. Aku tidak menyangka akan ada seseorang yang bisa membuatku tertawa hanya dengan kata-kata. Kamu tiba-tiba muncul di hidupku seperti kejutan yang tidak pernah aku minta.",
  },
  {
    id: 2,
    date: "15 Maret 2025",
    title: "Awal dari Segalanya",
    content: "Kita sudah chat sudah seminggu. Setiap hari aku menantikan notification dari HP. Rasanya seperti menunggu hadiah ulang tahun tapi setiap hari.",
  },
  {
    id: 3,
    date: "April 2025",
    title: "Momen Tawa Pertama",
    content: "Pertama kali kita ketawa bareng. Entah kenapa hal receh dari kamu bisa buat aku ketawa-ngakak. Mungkin karena kamu memang unik.",
  },
  {
    id: 4,
    date: "Mei 2025",
    title: "Distance Awal",
    content: "Jarak bikin kangen. Mencari waktu untuk ketemu kamu. Setiap malam chat jadi satu-satunya yang aku tunggu.",
  },
  {
    id: 5,
    date: "Juni 2025",
    title: "Jalan Pertama USU",
    content: "Akhirnya kita ketemu! Jalan dari USU ke Kopi Helvet. Kamu lebih cakep dari foto. Aku deg-degan kaya mau ujian.",
  },
  {
    id: 6,
    date: "Juni 2025",
    title: "Kopi Helvet",
    content: "First date kita di Kopi Helvet. Aku sangat gugup. Kita ngobrol sampe mall tutup. Aku tidak mau pulang.",
  },
  {
    id: 7,
    date: "Juli 2025",
    title: "Mallinson",
    content: "Kita jalan lagi ke Mallinson. Kamu punya senyum yang bagus. Setiap lihat senyum itu, aku lupa cara bernapas.",
  },
  {
    id: 8,
    date: "Agustus 2025",
    title: "Rayuan Millenial",
    content: "Rayuan Millenialmu itu receh tapi bikin aku ketawa. Kamu memang bisa buat aku happy.",
  },
  {
    id: 9,
    date: "September 2025",
    title: "Chat Tanpa Bales",
    content: "Hari pertama tidak bales chat kamu. Aku sebenarnya mau bales tapi takut keliatan terlalu excited.",
  },
  {
    id: 10,
    date: "Oktober 2025",
    title: "Malam Pertama Staycation",
    content: "Pertama kita staycation bareng. Hotel biasa tapi karena kamu ada, jadi special. Aku tidak bisa tidur karena terlalu excited.",
  },
  {
    id: 11,
    date: "November 2025",
    title: "Mengalah",
    content: "Kita pernah berantem. Tapi kamu selalu bisa buat aku realize bahwa aku love kamu.",
  },
  {
    id: 12,
    date: "Desember 2025",
    title: "Ultah Kamu",
    content: "Ultahmu. Pertama aku rayain ultah orang. Aku happy bisa hadir di momen itu.",
  },
  {
    id: 13,
    date: "Januari 2026",
    title: "Tahun Baru",
    content: "Masuk tahun baru bareng kamu. Resolusiku: jangan pernah kehilangan kamu.",
  },
  {
    id: 14,
    date: "Februari 2026",
    title: "Valentine",
    content: "Pertama Valentine bareng. Aku tidak siap sama sekali tapi kamu bikin hari itu jadi tidak sama seperti Valentine yang lain.",
  },
  {
    id: 15,
    date: "Maret 2026 - Sekarang",
    title: "Perjalanan Kita",
    content: "Satu tahun sudah kita lewatin bareng. Banyak cerita, banyak tawa, banyak juga air mata. Tapi yang pasti, aku sangat grateful bisa bareng kamu.",
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomStory(
  stories: Story[],
  shownIds: Set<number>
): Story | null {
  const available = stories.filter((s) => !shownIds.has(s.id));
  if (available.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}

export default function LoveLetter() {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [shownIds, setShownIds] = useState<Set<number>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const getNewStory = useCallback(() => {
    if (isTyping || isTransitioning) return;

    const newStory = getRandomStory(REAL_STORIES, shownIds);

    if (!newStory) {
      setShownIds(new Set());
      const shuffled = shuffleArray(REAL_STORIES);
      const randomIndex = Math.floor(Math.random() * shuffled.length);
      setCurrentStory(shuffled[randomIndex]);
      setShownIds(new Set([shuffled[randomIndex].id]));
    } else {
      setCurrentStory(newStory);
      setShownIds((prev) => new Set(prev).add(newStory.id));
    }

    setIsTransitioning(true);
    setIsVisible(false);
  }, [isTyping, isTransitioning, shownIds]);

  useEffect(() => {
    const shuffled = shuffleArray(REAL_STORIES);
    const initialStory = shuffled[0];
    setCurrentStory(initialStory);
    setShownIds(new Set([initialStory.id]));
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!currentStory || !isVisible) return;

    setIsTyping(true);
    setDisplayedText("");

    const text = currentStory.content;
    let index = 0;

    const typewriterInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typewriterInterval);
        setIsTyping(false);
        setIsTransitioning(false);
      }
    }, 50);

    return () => clearInterval(typewriterInterval);
  }, [currentStory, isVisible]);

  useEffect(() => {
    if (!currentStory) return;

    const fadeTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(fadeTimeout);
  }, [currentStory]);

  const handleRandom = () => {
    getNewStory();
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100 p-4">
      <div className="w-full max-w-2xl">
        <div
          className={`relative overflow-hidden rounded-3xl border border-white/40 bg-white/30 p-6 shadow-2xl backdrop-blur-xl sm:p-10 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-pink-100/20" />

          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <span className="rounded-full bg-rose-200/60 px-3 py-1 text-xs font-medium text-rose-700 sm:text-sm backdrop-blur-sm">
                {currentStory?.date || "Loading..."}
              </span>
              <span className="text-xs text-rose-600/80 sm:text-sm">
                {shownIds.size}/{REAL_STORIES.length} cerita
              </span>
            </div>

            <h2 className="mb-4 font-serif text-xl font-semibold text-rose-900 sm:text-2xl">
              {currentStory?.title || "Memuat..."}
            </h2>

            <div className="min-h-[180px] sm:min-h-[200px]">
              <p className="font-serif text-base leading-relaxed text-rose-800 sm:text-lg">
                {displayedText}
                {isTyping && (
                  <span className="inline-block h-4 w-2 animate-pulse bg-rose-400" />
                )}
              </p>
            </div>

            <div className="mt-6 flex justify-center sm:mt-8">
              <button
                onClick={handleRandom}
                disabled={isTyping || isTransitioning}
                className="group relative overflow-hidden rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-8 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100 sm:px-10 sm:text-base"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Acak Cerita
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-pink-400 to-rose-400 transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-rose-500/70 sm:text-sm">
            Cerita cinta kita • Dari hati yang berbeda
          </p>
        </div>
      </div>
    </div>
  );
}
