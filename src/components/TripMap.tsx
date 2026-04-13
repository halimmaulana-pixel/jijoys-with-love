/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  icon: string;
}

const LOCATIONS: Location[] = [
  {
    id: 'usu',
    name: 'Universitas Sumatera Utara',
    lat: 3.5585,
    lng: 98.6289,
    description: 'Tempat pertama kita bertemu~ Tempat di mana segalanya dimulai 💕',
    icon: '🎓',
  },
  {
    id: 'kopi-helvet',
    name: 'Kopi Helvet Medan',
    lat: 3.5889,
    lng: 98.6735,
    description: 'Tempat cozy kita menikmati kopi bersama ☕💕',
    icon: '☕',
  },
];

const MapContent = dynamic(() => import('./MapContent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] rounded-3xl bg-pink-100/50 flex items-center justify-center">
      <div className="text-rose-400 text-center">
        <div className="text-4xl mb-4 animate-pulse">💕</div>
        <p className="text-rose-400/80">Memuat peta...</p>
      </div>
    </div>
  ),
});

export default function TripMap() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocationId(location.id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-light text-rose-500 mb-3">
          🗺️ Perjalanan Kita
        </h2>
        <p className="text-rose-400/70 text-sm md:text-base">
          Klik marker untuk lihat detail lokasi
        </p>
      </div>

      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-pink-200/40 via-rose-200/40 to-pink-200/40 rounded-3xl blur-xl" />
        <div className="relative rounded-2xl overflow-hidden border border-pink-200/50">
          <MapContent
            onLocationSelect={handleLocationSelect}
            selectedLocationId={selectedLocationId}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setSelectedLocationId(loc.id)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 backdrop-blur-sm ${
              selectedLocationId === loc.id
                ? 'bg-rose-400 text-white shadow-lg'
                : 'bg-white/60 text-rose-500 hover:bg-rose-100/60 border border-rose-200/50'
            }`}
          >
            {loc.icon} {loc.name}
          </button>
        ))}
      </div>
    </div>
  );
}
