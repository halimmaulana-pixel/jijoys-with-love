'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LocationData {
  id: string;
  src: string;
  location: string;
  lat: number;
  lng: number;
  date: string;
  caption: string;
}

const tripLocations: LocationData[] = [
  { id: '1', src: '/images/IMG_7337.JPEG', location: 'Parapat, Lake Toba', lat: 2.5653, lng: 98.9357, date: '2025-07-01', caption: 'Trip Pertama ke Lake Toba 🏊' },
  { id: '2', src: '/images/IMG_7339.JPEG', location: 'Parapat, Lake Toba', lat: 2.5653, lng: 98.9357, date: '2025-07-01', caption: 'Lake Toba best view 🌊' },
  { id: '3', src: '/images/IMG_7343.JPEG', location: 'Parapat, Lake Toba', lat: 2.5653, lng: 98.9357, date: '2025-07-01', caption: 'Cantik poll 🔥' },
  { id: '4', src: '/images/IMG_7347.JPEG', location: 'Parapat, Lake Toba', lat: 2.5653, lng: 98.9357, date: '2025-07-01', caption: 'Malam di Lake Toba 🌙' },
  { id: '5', src: '/images/IMG_3515.JPEG', location: 'Medan', lat: 3.5634, lng: 98.5018, date: '2025-08-15', caption: 'Medan date pertama 💕' },
  { id: '6', src: '/images/IMG_3516.JPEG', location: 'Medan', lat: 3.5634, lng: 98.5018, date: '2025-08-15', caption: 'Nongkrong bareng 🍜' },
  { id: '7', src: '/images/IMG_3517.JPEG', location: 'Medan', lat: 3.5634, lng: 98.5018, date: '2025-08-15', caption: 'Happy moment ✨' },
  { id: '8', src: '/images/IMG_3518.JPEG', location: 'Medan', lat: 3.5634, lng: 98.5018, date: '2025-08-15', caption: 'Best day ever 🎉' },
  { id: '9', src: '/images/IMG_3519.JPEG', location: 'Medan', lat: 3.5634, lng: 98.5018, date: '2025-08-15', caption: 'Love this 🥹' },
  { id: '10', src: '/images/IMG_3520.JPEG', location: 'Medan', lat: 3.5634, lng: 98.5018, date: '2025-08-15', caption: 'Quality time 💗' },
  { id: '11', src: '/images/IMG_3521.JPEG', location: 'Medan', lat: 3.5634, lng: 98.5018, date: '2025-08-15', caption: 'Berdua terus 🦋' },
  { id: '12', src: '/images/IMG_8024.JPEG', location: 'Brastagi', lat: 3.1959, lng: 98.4094, date: '2025-07-05', caption: 'Brastagi cold 🍃' },
  { id: '13', src: '/images/IMG_8025.JPEG', location: 'Brastagi', lat: 3.1959, lng: 98.4094, date: '2025-07-05', caption: 'Brastagi trip 🏔️' },
  { id: '14', src: '/images/IMG_8026.JPEG', location: 'Brastagi', lat: 3.1959, lng: 98.4094, date: '2025-07-05', caption: 'Cantik poll 🔥' },
  { id: '15', src: '/images/IMG_8027.JPEG', location: 'Brastagi', lat: 3.1959, lng: 98.4094, date: '2025-07-05', caption: 'Wilderness vibes 🌿' },
  { id: '16', src: '/images/IMG_8028.JPEG', location: 'Brastagi', lat: 3.1959, lng: 98.4094, date: '2025-07-05', caption: 'Love the nature 💚' },
  { id: '17', src: '/images/IMG_8029.JPEG', location: 'Brastagi', lat: 3.1959, lng: 98.4094, date: '2025-07-05', caption: 'My AZ beautiful 🌸' },
  { id: '18', src: '/images/IMG_8030.JPEG', location: 'Brastagi', lat: 3.1959, lng: 98.4094, date: '2025-07-05', caption: 'Sweet moment 🍯' },
  { id: '19', src: '/images/IMG_2440.JPEG', location: 'USU Campus', lat: 3.5617, lng: 98.5118, date: '2026-04-09', caption: 'Campus date 📚' },
  { id: '20', src: '/images/IMG_2441.JPEG', location: 'USU Campus', lat: 3.5617, lng: 98.5118, date: '2026-04-09', caption: 'Belajar bareng 📖' },
  { id: '21', src: '/images/IMG_2442.JPEG', location: 'USU Campus', lat: 3.5617, lng: 98.5118, date: '2026-04-09', caption: 'Focus mode 🧠' },
  { id: '22', src: '/images/IMG_2456.JPEG', location: 'Merdeka Walk', lat: 3.5831, lng: 98.6735, date: '2026-04-09', caption: 'Merdeka Walk 🌆' },
  { id: '23', src: '/images/IMG_2457.JPEG', location: 'Merdeka Walk', lat: 3.5831, lng: 98.6735, date: '2026-04-09', caption: 'Jalan-jalan malem 🛍️' },
];

const uniqueLocations = [...new Map(tripLocations.map(l => [l.location, l])).values()];

export default function TripMap() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(tripLocations[0]);
  const [showMap, setShowMap] = useState(false);

  const locationPhotos = tripLocations.filter(l => l.location === selectedLocation?.location);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide">
        {uniqueLocations.map((loc) => (
          <button
            key={loc.location}
            onClick={() => setSelectedLocation(loc)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs md:text-sm transition-all ${
              selectedLocation?.location === loc.location
                ? 'bg-pink-500 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            📍 {loc.location.split(',')[0]}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {showMap ? (
          <motion.div
            key="map"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-48 md:h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden relative flex items-center justify-center"
          >
            <div className="text-center text-white/50">
              <p className="text-4xl mb-2">🗺️</p>
              <p>{selectedLocation?.location}</p>
              <p className="text-xs">📍 {selectedLocation?.lat.toFixed(4)}, {selectedLocation?.lng.toFixed(4)}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="photos"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="text-center">
              <p className="text-pink-300 text-sm font-medium">{selectedLocation?.location}</p>
              <p className="text-white/40 text-xs">{selectedLocation?.date} • {locationPhotos.length} foto</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
              {locationPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-lg"
                >
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                    <p className="text-white text-xs text-center font-medium">{photo.caption}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-center">
        <button
          onClick={() => setShowMap(!showMap)}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white text-sm transition-all"
        >
          {showMap ? '📷 Lihat Foto' : '🗺️ Lihat Peta'}
        </button>
      </div>
    </div>
  );
}