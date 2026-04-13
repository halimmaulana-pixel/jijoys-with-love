'use client';

import { useEffect, useRef, useState } from 'react';
import type { LatLngExpression, Icon, PolylineOptions } from 'leaflet';
import L from 'leaflet';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  icon: string;
}

interface MapContentProps {
  onLocationSelect?: (location: Location) => void;
  selectedLocationId?: string | null;
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

function createHeartIcon(isSelected: boolean): Icon {
  const size = isSelected ? 48 : 40;
  const heartSvg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF6B8A" stroke="#FF3D6B" stroke-width="1.5"/>
      <circle cx="8" cy="8" r="1.5" fill="white" opacity="0.8"/>
      <circle cx="10" cy="7" r="1" fill="white" opacity="0.6"/>
    </svg>
  `;
  
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(heartSvg)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    className: 'heart-marker',
  });
}

export default function TripMap({ onLocationSelect, selectedLocationId }: MapContentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeRef = useRef<L.Polyline | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current || mapRef.current || isInitialized) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      center: [3.5737, 98.6512],
      zoom: 12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    const routeCoords: LatLngExpression[] = LOCATIONS.map((loc) => [loc.lat, loc.lng]);

    const routeLine = L.polyline(routeCoords, {
      color: '#FF6B8A',
      weight: 4,
      opacity: 0.7,
      dashArray: '10, 15',
      lineCap: 'round',
      lineJoin: 'round',
    } as PolylineOptions).addTo(map);

    routeLine.bindPopup('❤️ Rute perjalanan kita');

    let dashOffset = 0;
    const animateRoute = () => {
      dashOffset += 1;
      routeLine.setStyle({ dashOffset: `${dashOffset}` } as L.PolylineOptions);
      requestAnimationFrame(animateRoute);
    };
    animateRoute();

    routeRef.current = routeLine;

    LOCATIONS.forEach((location) => {
      const marker = L.marker([location.lat, location.lng], {
        icon: createHeartIcon(false),
      }).addTo(map);

      const popupContent = `
        <div class="trip-popup" style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
          <div style="text-align: center; margin-bottom: 8px;">
            <span style="font-size: 32px;">${location.icon}</span>
          </div>
          <h3 style="margin: 0 0 8px 0; color: #BE185D; font-size: 16px; font-weight: 600; text-align: center;">
            ${location.name}
          </h3>
          <p style="margin: 0 0 12px 0; color: #9B6B7A; font-size: 13px; line-height: 1.5; text-align: center;">
            ${location.description}
          </p>
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              display: inline-block;
              width: 100%;
              padding: 10px 16px;
              background: linear-gradient(135deg, #FF6B8A, #FF3D6B);
              color: white;
              text-decoration: none;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 500;
              text-align: center;
              box-sizing: border-box;
            "
          >
            🗺️ Buka di Google Maps
          </a>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-popup',
        closeButton: true,
        maxWidth: 280,
      });

      marker.on('click', () => {
        if (onLocationSelect) {
          onLocationSelect(location);
        }

        markersRef.current.forEach((m) => {
          const isSelected = m === marker;
          m.setIcon(createHeartIcon(isSelected));
        });

        map.flyTo([location.lat, location.lng], 14, {
          duration: 1,
        });
      });

      markersRef.current.push(marker);
    });

    const bounds = L.latLngBounds(LOCATIONS.map((loc) => [loc.lat, loc.lng]));
    map.fitBounds(bounds.pad(0.2));

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isClient, onLocationSelect]);

  useEffect(() => {
    if (!mapRef.current || !selectedLocationId) return;

    const location = LOCATIONS.find((loc) => loc.id === selectedLocationId);
    if (location) {
      markersRef.current.forEach((marker) => {
        const isSelected = marker.getLatLng().lat === location.lat && 
                          marker.getLatLng().lng === location.lng;
        marker.setIcon(createHeartIcon(isSelected));
      });

      mapRef.current.flyTo([location.lat, location.lng], 14, {
        duration: 1,
      });

      const targetMarker = markersRef.current.find(
        (m) => m.getLatLng().lat === location.lat && m.getLatLng().lng === location.lng
      );
      if (targetMarker) {
        targetMarker.openPopup();
      }
    }
  }, [selectedLocationId]);

  useEffect(() => {
    if (!mapRef.current || selectedLocationId) return;

    const bounds = L.latLngBounds(LOCATIONS.map((loc) => [loc.lat, loc.lng]));
    mapRef.current.fitBounds(bounds.pad(0.2), { duration: 1 });
  }, [selectedLocationId]);

  if (!isClient) {
    return (
      <div className="w-full h-[400px] md:h-[500px] rounded-3xl bg-pink-100/50 flex items-center justify-center">
        <div className="text-rose-400 text-center">
          <div className="text-4xl mb-4 animate-pulse">💕</div>
          <p className="text-rose-400/80">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx global>{`
        .leaflet-container {
          font-family: system-ui, -apple-system, sans-serif;
          background: linear-gradient(180deg, #FFF5F7 0%, #FFF0F5 100%);
        }
        
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 4px 20px rgba(255, 107, 138, 0.2) !important;
          border-radius: 20px !important;
          overflow: hidden;
        }
        
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.9) !important;
          backdrop-filter: blur(10px);
          color: #FF6B8A !important;
          border: none !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
          font-size: 18px !important;
          transition: all 0.3s ease !important;
        }
        
        .leaflet-control-zoom a:hover {
          background: rgba(255, 107, 138, 0.1) !important;
          color: #FF3D6B !important;
        }
        
        .leaflet-control-zoom-in {
          border-radius: 20px 20px 0 0 !important;
        }
        
        .leaflet-control-zoom-out {
          border-radius: 0 0 20px 20px !important;
        }

        .leaflet-popup-content-wrapper {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 107, 138, 0.3);
          box-shadow: 0 8px 32px rgba(255, 107, 138, 0.2);
          padding: 0;
        }

        .leaflet-popup-content {
          margin: 16px;
        }

        .leaflet-popup-tip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 107, 138, 0.3);
        }

        .leaflet-popup-close-button {
          color: #FF6B8A !important;
          font-size: 24px !important;
          width: 28px !important;
          height: 28px !important;
          top: 8px !important;
          right: 8px !important;
          transition: color 0.3s ease !important;
        }

        .leaflet-popup-close-button:hover {
          color: #FF3D6B !important;
        }

        .heart-marker {
          filter: drop-shadow(0 4px 8px rgba(255, 107, 138, 0.4));
          transition: transform 0.3s ease;
        }

        .heart-marker:hover {
          transform: scale(1.1);
        }

        @keyframes pulse-marker {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .selected-marker {
          animation: pulse-marker 1.5s ease-in-out infinite;
        }
      `}</style>

      <div 
        ref={mapContainerRef} 
        className="w-full h-[400px] md:h-[500px]"
        style={{ minHeight: '400px' }}
      />
    </>
  );
}