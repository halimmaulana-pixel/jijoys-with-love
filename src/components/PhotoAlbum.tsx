'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface AlbumPhoto {
  id: string;
  src: string;
  quote: string;
}

const albumPhotos: AlbumPhoto[] = [
  { id: '1', src: '/images/IMG_7337.JPEG', quote: 'Kita berdua 🦋' },
  { id: '2', src: '/images/IMG_8026.JPEG', quote: 'AZ yang paling cantik ✨' },
  { id: '3', src: '/images/IMG_8028.JPEG', quote: 'Bareng terus 💕' },
  { id: '4', src: '/images/IMG_9977.JPEG', quote: 'Gemesin poll 🐰' },
  { id: '5', src: '/images/IMG_3515.JPEG', quote: 'Berdua aja cukup 🥹' },
  { id: '6', src: '/images/IMG_8976.PNG', quote: 'Imut banget sih 😍' },
  { id: '7', src: '/images/IMG_8027.JPEG', quote: 'My everything 💗' },
  { id: '8', src: '/images/IMG_7339.JPEG', quote: 'Kenangan indah 🌸' },
  { id: '9', src: '/images/34A38B03-A205-4886-9204-8F0A4695E1C0.jpg', quote: 'Duo terbaik 🦋✨' },
  { id: '10', src: '/images/IMG_3521.JPEG', quote: 'Cantik + manis = AZ 💕' },
  { id: '11', src: '/images/1bbe7db9-e316-43dc-99b6-b0bdddb69056.jpg', quote: 'Together always 🌈' },
  { id: '12', src: '/images/IMG_8025.JPEG', quote: 'Foto bareng favorit 🥰' },
  { id: '13', src: '/images/IMG_2135.JPEG', quote: 'AZ = 4ever 💍' },
  { id: '14', src: '/images/IMG_7347.JPEG', quote: 'Momen langka 📸' },
  { id: '15', src: '/images/IMG_8024.JPEG', quote: 'My one and only 🦋' },
  { id: '16', src: '/images/3ab0cbad-eff5-4fa0-9eb9-433f9ceb1cac.jpg', quote: 'HM & AZ 💕' },
  { id: '17', src: '/images/IMG_3518.JPEG', quote: 'Cantik poll 🥹' },
  { id: '18', src: '/images/IMG_8029.JPEG', quote: 'Moment to remember 🌟' },
  { id: '19', src: '/images/IMG_7343.JPEG', quote: 'Senyum AZ terbaik 😊' },
  { id: '20', src: '/images/IMG_8030.JPEG', quote: 'Love you more 💗' },
  { id: '21', src: '/images/IMG_7347.JPEG', quote: 'Best decision ever 💕' },
  { id: '22', src: '/images/2BD519F0-1329-4A60-A6A9-DA437F61F813.jpg', quote: 'HM + AZ = forever' },
  { id: '23', src: '/images/52e38ca4-2c05-47fa-89f3-a9c1c9d05338.jpg', quote: 'My priority ❤️' },
  { id: '24', src: '/images/762e3d41-185d-4a77-81d1-2d91c38ba1b0.jpg', quote: 'Just us 💕' },
  { id: '25', src: '/images/B835C521-E3EF-4DB6-8F77-A583E9D82147.jpg', quote: 'My person 🥹' },
  { id: '26', src: '/images/7e43bbd0-29af-415f-a33d-bca62929dc0b.jpg', quote: 'Love this moment ✨' },
  { id: '27', src: '/images/c79ed6fa-4f54-4ea1-ae43-45bbf5d8a395.jpg', quote: 'My everything 💗' },
  { id: '28', src: '/images/0c2362be-bb08-4a0b-b858-c36bbcf70e1f.jpg', quote: 'Meant to be 🦋' },
  { id: '29', src: '/images/09271625-4A05-4A4F-87CA-960ABDA0F7AB.jpg', quote: 'Forever yours 💍' },
  { id: '30', src: '/images/IMG_2457.JPEG', quote: 'Best view ever 🌅' },
  { id: '31', src: '/images/IMG_2456.JPEG', quote: 'Making memories 📸' },
  { id: '32', src: '/images/IMG_2442.JPEG', quote: 'My favorite person 💕' },
  { id: '33', src: '/images/IMG_2441.JPEG', quote: 'Cannot without you 🥹' },
  { id: '34', src: '/images/IMG_2440.JPEG', quote: 'Love wins 🏆' },
  { id: '35', src: '/images/IMG_3520.JPEG', quote: 'My daily motivation ✨' },
  { id: '36', src: '/images/IMG_3519.JPEG', quote: 'My heart 💗' },
  { id: '37', src: '/images/IMG_3517.JPEG', quote: 'Love you AZ 🥹' },
  { id: '38', src: '/images/IMG_3516.JPEG', quote: 'My happy place 🏠' },
  { id: '39', src: '/images/IMG_3515.JPEG', quote: 'Love language 💕' },
  { id: '40', src: '/images/3ab0cbad-eff5-4fa0-9eb9-433f9ceb1cac-1.jpg', quote: 'One and only 🦋' },
];

export default function PhotoAlbum() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showThumbs, setShowThumbs] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const next = useCallback(() => {
    goTo((currentIndex + 1) % albumPhotos.length);
  }, [currentIndex, goTo]);

  const prev = useCallback(() => {
    goTo((currentIndex - 1 + albumPhotos.length) % albumPhotos.length);
  }, [currentIndex, goTo]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  const currentPhoto = albumPhotos[currentIndex];

  return (
    <div className="relative w-full h-screen max-h-[calc(100vh-180px)] overflow-hidden">
      {/* Full Screen Photo - Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background blur photos */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 p-1 opacity-30">
            {albumPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                  idx === currentIndex ? 'scale-105 ring-2 ring-pink-400' : 'scale-100'
                } ${idx === currentIndex ? 'opacity-100' : 'opacity-40'}`}
              >
                <Image
                  src={photo.src}
                  alt={`bg-${idx}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          
          {/* Main Photo - Full Screen */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full h-full max-w-4xl"
            >
              <Image
                src={currentPhoto.src}
                alt={currentPhoto.quote}
                fill
                className="object-contain rounded-2xl shadow-2xl"
                priority
              />
            </motion.div>
          </div>
          
          {/* Quote Overlay */}
          <motion.div
            key={`quote-${currentPhoto.id}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center px-6 py-3 bg-black/50 backdrop-blur-md rounded-full"
          >
            <p className="text-white text-xl md:text-2xl font-semibold">
              {currentPhoto.quote}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full transition-all"
      >
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Photo Counter */}
      <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full">
        <span className="text-white text-sm">{currentIndex + 1} / {albumPhotos.length}</span>
      </div>

      {/* Controls */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={() => setShowThumbs(!showThumbs)}
          className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full transition-all"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full transition-all"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v4m0 0h-4" />
          </svg>
        </button>
      </div>

      {/* Bottom Thumbnails */}
      <AnimatePresence>
        {showThumbs && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1 p-2 bg-black/50 backdrop-blur-md rounded-xl overflow-x-auto max-w-[90vw]"
          >
            {albumPhotos.map((photo, idx) => (
              <button
                key={photo.id}
                onClick={() => goTo(idx)}
                className={`relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                  idx === currentIndex ? 'ring-2 ring-pink-400 scale-110' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.quote}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 text-white/30 text-xs">
        ← swipe atau arrow keys →
      </div>
    </div>
  );
}