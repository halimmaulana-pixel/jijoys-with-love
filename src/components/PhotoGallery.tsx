/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoItem {
  id: string;
  src: string;
  quote?: string;
  date?: string;
  location?: string;
  category: 'az' | 'couple' | 'hm';
}

const parseFilenameDate = (filename: string): string | undefined => {
  const match = filename.match(/IMG_(\d{4})/);
  if (match) {
    const year = parseInt(match[1]);
    if (year >= 2019 && year <= 2026) {
      return `${year}`;
    }
  }
  const fullMatch = filename.match(/(\d{4})(\d{2})(\d{2})/);
  if (fullMatch) {
    const [, year, month, day] = fullMatch;
    return `${day}/${month}/${year}`;
  }
  return undefined;
};

const parseIOSDate = (filename: string): string | undefined => {
  const match = filename.match(/_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
  if (match) {
    const [, year, month, day, hour, minute] = match;
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
  return undefined;
};

const quotes = {
  az: [
    "AZ kok yang paling cantik siiih 😍",
    "Yang lain kebagian apa coba, wkwk",
    "Cantik poll, sett ✨",
    "Imut poll, gemes poll 🥹",
    "Serakah? Ya jelas dong, wkwk",
    "AZ mah udah paling cakep dari sonanya 💅",
    "Mana ada yang lebih cakep dari AZ 🙈",
    "Gemesnya keterlaluan 😭",
    "Cantik + imut + manis = AZ 🔥",
    "Wkwk AZ itu kayak edition limited",
    "Yang lain boleh ngiri, wkwk",
    "Ini cantik siapa coba 🧐",
    "AZ mah special indeed ✨",
    "Gemesin poll jijoy 🥰",
    "Cantik poll tapi ganggu, wkwk",
    "Serakah itu namanya cinta 🔥",
    "AZ = semua yang aku mau 💕",
    "Manis poll, terus makan 💋",
    "Imut + nakal = AZ 👀",
    "Bestie paling gemes 🌟",
  ],
  couple: [
    "Cinta = AZ + HM forever 💕",
    "Kita mah gatau yang lain 😅",
    "HM mah spoiled poll sama AZ 💖",
    "Best decision: milih AZ ✨",
    "Gabisa jauh-jauh dari AZ 🥹",
    "Jodoh mah yang ini doang 💍",
    "Cinta kita gitu, wkwk 😘",
    "AZ + HM = 4ever 💕",
    "Yang lain nyoba apa cobа ☺️",
    "Gabisa tinggalin AZ 🙈",
    "Perang dunia ketiga kalo sama AZ 🌸",
    "Cintaku mah AZ doang 💖",
    "Dulu sama siapa? Mau kok 😀",
    "HM mah sayang poll sama AZ 💕",
    "Pantang mundur, maju terus 💪",
    "GBU selalu ya 💕",
    "Love that vibe with AZ ✨",
    "Always be together 💑",
    "Kita mah gatau yang lain 🌈",
    "My person is AZ 🥹",
  ],
  hm: [
    "HM mah beruntung punya AZ 🌟",
    "Dulu jomblo, sekarang ada AZ 😂",
    "Lucky guy polls 🥳",
    "HM mah sadar kalo dandan sama AZ 💅",
    "Thanks to AZ for choosing him 😎",
    "Ini dia yang AZ milih 😏",
    "HM lucky poll 🙏",
    "Yang sabar ya sama HM 😅",
    "Happy because of AZ ✨",
    "Best thing in HM's life: AZ 💕",
  ],
  facts: [
    "AZ Sagitarius! ♐️",
    "Suka makan wafel 🧇",
    "Tempat kesukaan: Links 📍",
    "Sagitarius girls are the best ✨",
    "Wafel lovers unite! 🧇",
    "Links > anywhere else 🌟",
    "♐️ Sagitarius represent!",
  ],
};

const getRandomQuote = (category: 'az' | 'couple' | 'hm'): string => {
  const list = quotes[category];
  return list[Math.floor(Math.random() * list.length)];
};

const getRandomFact = (): string | null => {
  if (Math.random() < 0.3) {
    const list = quotes.facts;
    return list[Math.floor(Math.random() * list.length)];
  }
  return null;
};

const photos: PhotoItem[] = [
  { id: '1', src: '/images/IMG_8026.JPEG', category: 'az', date: '8 Maret 2025' },
  { id: '2', src: '/images/IMG_7343.JPEG', category: 'az', date: 'Februari 2025' },
  { id: '3', src: '/images/IMG_7337.JPEG', category: 'couple' },
  { id: '4', src: '/images/IMG_9977.JPEG', category: 'az' },
  { id: '5', src: '/images/IMG_8976.PNG', category: 'az' },
  { id: '6', src: '/images/IMG_8101.PNG', category: 'az' },
  { id: '7', src: '/images/IMG_8028.JPEG', category: 'couple' },
  { id: '8', src: '/images/IMG_8027.JPEG', category: 'az' },
  { id: '9', src: '/images/IMG_3521.JPEG', category: 'az' },
  { id: '10', src: '/images/IMG_3520.JPEG', category: 'az' },
  { id: '11', src: '/images/IMG_3519.JPEG', category: 'az' },
  { id: '12', src: '/images/IMG_3518.JPEG', category: 'az' },
  { id: '13', src: '/images/IMG_3517.JPEG', category: 'az' },
  { id: '14', src: '/images/IMG_3516.JPEG', category: 'az' },
  { id: '15', src: '/images/IMG_3515.JPEG', category: 'couple' },
  { id: '16', src: '/images/IMG_2135.JPEG', category: 'az' },
  { id: '17', src: '/images/c79ed6fa-4f54-4ea1-ae43-45bbf5d8a395.jpg', category: 'hm' },
  { id: '18', src: '/images/B835C521-E3EF-4DB6-8F77-A583E9D82147.jpg', category: 'hm' },
  { id: '19', src: '/images/7e43bbd0-29af-415f-a33d-bca62929dc0b.jpg', category: 'hm' },
  { id: '20', src: '/images/762e3d41-185d-4a77-81d1-2d91c38ba1b0.jpg', category: 'az' },
  { id: '21', src: '/images/52e38ca4-2c05-47fa-89f3-a9c1c9d05338.jpg', category: 'hm' },
  { id: '22', src: '/images/3ab0cbad-eff5-4fa0-9eb9-433f9ceb1cac-1.jpg', category: 'az' },
  { id: '23', src: '/images/34A38B03-A205-4886-9204-8F0A4695E1C0.jpg', category: 'couple' },
  { id: '24', src: '/images/2BD519F0-1329-4A60-A6A9-DA437F61F813.jpg', category: 'az' },
  { id: '25', src: '/images/1bbe7db9-e316-43dc-99b6-b0bdddb69056.jpg', category: 'couple' },
  { id: '26', src: '/images/0c2362be-bb08-4a0b-b858-c36bbcf70e1f.jpg', category: 'hm' },
  { id: '27', src: '/images/09271625-4A05-4A4F-87CA-960ABDA0F7AB.jpg', category: 'az' },
  { id: '28', src: '/images/IMG_2442.JPEG', category: 'az' },
  { id: '29', src: '/images/IMG_2441.JPEG', category: 'az' },
  { id: '30', src: '/images/IMG_2440.JPEG', category: 'az' },
  { id: '31', src: '/images/IMG_2456.JPEG', category: 'az' },
  { id: '32', src: '/images/IMG_8029.JPEG', category: 'az' },
  { id: '33', src: '/images/IMG_7339.JPEG', category: 'couple' },
  { id: '34', src: '/images/IMG_2457.JPEG', category: 'az' },
  { id: '35', src: '/images/IMG_8030.JPEG', category: 'az' },
  { id: '36', src: '/images/IMG_8025.JPEG', category: 'couple' },
  { id: '37', src: '/images/IMG_8024.JPEG', category: 'az' },
  { id: '38', src: '/images/IMG_7347.JPEG', category: 'couple' },
  { id: '39', src: '/images/3afb1fd4-775b-4f88-962b-85488c65967a.jpg', category: 'az' },
  { id: '40', src: '/images/3ab0cbad-eff5-4fa0-9eb9-433f9ceb1cac.jpg', category: 'couple' },
  { id: '41', src: '/images/8bd6639b-35e0-48f5-9eb7-24ca858cd1d8.jpg', category: 'az' },
  { id: '42', src: '/images/92DA2912-6CDB-4D3D-A7FB-6BDB2D4B5E59.jpg', category: 'hm' },
  { id: '43', src: '/images/35E0DDEC-EE6C-4B33-AE97-C30A4C89B6F5.jpg', category: 'az' },
  { id: '44', src: '/images/1F6B9A0D-E0D4-47B1-B1E6-9FE83EEEF0E6.jpg', category: 'couple' },
  { id: '45', src: '/images/3D0E5C65-8E3C-4AD5-A2DF-9EA0D6A0B6E4.jpg', category: 'az' },
  { id: '46', src: '/images/5B8C3D2E-9E1D-4CE7-A0E2-8F9D7C6B5A3E.jpg', category: 'hm' },
  { id: '47', src: '/images/6D7E9F0A-1E2D-4CE0-A9E1-9F0D8C7B6A5E.jpg', category: 'couple' },
  { id: '48', src: '/images/7E8F0D1B-2E3D-4DE1-A0E2-9F1D8C7B6A5E.jpg', category: 'az' },
  { id: '49', src: '/images/8F9E1D2C-3E4D-4EE2-A1E3-9F2D8C7B6A5E.jpg', category: 'az' },
  { id: '50', src: '/images/9F0E2D3D-4E5D-4FE3-A2E4-9F3D8C7B6A5E.jpg', category: 'hm' },
];

const photosWithQuotes = photos.map((photo, index) => {
  let category: 'az' | 'couple' | 'hm' = photo.category;
  
  if (index === 0) {
    category = 'az';
  } else if (index % 3 === 0) {
    category = 'couple';
  } else if (index % 4 === 0) {
    category = 'hm';
  } else {
    category = photo.category;
  }
  
  return {
    ...photo,
    category,
    quote: getRandomQuote(category),
    fact: getRandomFact(),
  };
});

export default function PhotoGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photosWithQuotes.length);
  }, []);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photosWithQuotes.length) % photosWithQuotes.length);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextPhoto();
      } else if (e.key === 'ArrowLeft') {
        prevPhoto();
      } else if (e.key === 'i') {
        setShowInfo(!showInfo);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPhoto, prevPhoto, showInfo]);

  const currentPhoto = photosWithQuotes[currentIndex];

  return (
    <div 
      className="relative w-full h-screen max-h-[80vh] cursor-pointer"
      onClick={nextPhoto}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full h-full"
        >
          <img
            src={currentPhoto.src}
            alt={`Photo ${currentPhoto.id}`}
            className="w-full h-full object-contain bg-black"
          />
          
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent"
            >
              <p className="text-white text-xl md:text-2xl font-medium text-center drop-shadow-lg italic">
                {currentPhoto.quote}
              </p>
              {currentPhoto.fact && (
                <p className="text-pink-300 text-center mt-2 text-sm">
                  {currentPhoto.fact}
                </p>
              )}
              {currentPhoto.date && (
                <p className="text-white/60 text-center text-xs mt-1">
                  {currentPhoto.date}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="absolute top-4 right-4 flex gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); setShowInfo(!showInfo); }}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs transition"
        >
          {showInfo ? 'Hide' : 'Show'} (i)
        </button>
      </div>

      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition cursor-pointer"
           onClick={(e) => { e.stopPropagation(); prevPhoto(); }}>
        <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 opacity-0 hover:opacity-100 transition cursor-pointer"
           onClick={(e) => { e.stopPropagation(); nextPhoto(); }}>
        <svg className="w-10 h-10 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
        {photosWithQuotes.slice(0, 10).map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition ${
              idx === currentIndex % 10 ? 'bg-pink-500' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
