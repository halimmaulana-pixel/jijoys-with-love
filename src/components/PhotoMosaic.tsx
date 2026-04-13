'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

interface PhotoItem {
  id: string;
  src: string;
  person: 'az' | 'hm' | 'couple';
}

const photosData: PhotoItem[] = [
  { id: '1', src: '/images/IMG_8026.JPEG', person: 'az' },
  { id: '2', src: '/images/IMG_7343.JPEG', person: 'az' },
  { id: '3', src: '/images/IMG_7337.JPEG', person: 'couple' },
  { id: '4', src: '/images/IMG_9977.JPEG', person: 'az' },
  { id: '5', src: '/images/IMG_8976.PNG', person: 'az' },
  { id: '6', src: '/images/IMG_8101.PNG', person: 'az' },
  { id: '7', src: '/images/IMG_8028.JPEG', person: 'couple' },
  { id: '8', src: '/images/IMG_8027.JPEG', person: 'az' },
  { id: '9', src: '/images/IMG_3521.JPEG', person: 'az' },
  { id: '10', src: '/images/IMG_3520.JPEG', person: 'az' },
  { id: '11', src: '/images/IMG_3519.JPEG', person: 'az' },
  { id: '12', src: '/images/IMG_3518.JPEG', person: 'az' },
  { id: '13', src: '/images/IMG_3517.JPEG', person: 'az' },
  { id: '14', src: '/images/IMG_3516.JPEG', person: 'az' },
  { id: '15', src: '/images/IMG_3515.JPEG', person: 'couple' },
  { id: '16', src: '/images/IMG_2135.JPEG', person: 'az' },
  { id: '17', src: '/images/c79ed6fa-4f54-4ea1-ae43-45bbf5d8a395.jpg', person: 'hm' },
  { id: '18', src: '/images/B835C521-E3EF-4DB6-8F77-A583E9D82147.jpg', person: 'hm' },
  { id: '19', src: '/images/7e43bbd0-29af-415f-a33d-bca62929dc0b.jpg', person: 'hm' },
  { id: '20', src: '/images/762e3d41-185d-4a77-81d1-2d91c38ba1b0.jpg', person: 'az' },
  { id: '21', src: '/images/52e38ca4-2c05-47fa-89f3-a9c1c9d05338.jpg', person: 'hm' },
  { id: '22', src: '/images/3ab0cbad-eff5-4fa0-9eb9-433f9ceb1cac-1.jpg', person: 'az' },
  { id: '23', src: '/images/34A38B03-A205-4886-9204-8F0A4695E1C0.jpg', person: 'couple' },
  { id: '24', src: '/images/2BD519F0-1329-4A60-A6A9-DA437F61F813.jpg', person: 'az' },
  { id: '25', src: '/images/1bbe7db9-e316-43dc-99b6-b0bdddb69056.jpg', person: 'couple' },
  { id: '26', src: '/images/0c2362be-bb08-4a0b-b858-c36bbcf70e1f.jpg', person: 'hm' },
  { id: '27', src: '/images/09271625-4A05-4A4F-87CA-960ABDA0F7AB.jpg', person: 'az' },
  { id: '28', src: '/images/IMG_2442.JPEG', person: 'az' },
  { id: '29', src: '/images/IMG_2441.JPEG', person: 'az' },
  { id: '30', src: '/images/IMG_2440.JPEG', person: 'az' },
  { id: '31', src: '/images/IMG_2456.JPEG', person: 'az' },
  { id: '32', src: '/images/IMG_8029.JPEG', person: 'az' },
  { id: '33', src: '/images/IMG_7339.JPEG', person: 'couple' },
  { id: '34', src: '/images/IMG_2457.JPEG', person: 'az' },
  { id: '35', src: '/images/IMG_8030.JPEG', person: 'az' },
  { id: '36', src: '/images/IMG_8025.JPEG', person: 'couple' },
  { id: '37', src: '/images/IMG_8024.JPEG', person: 'az' },
  { id: '38', src: '/images/IMG_7347.JPEG', person: 'couple' },
  { id: '39', src: '/images/3afb1fd4-775b-4f88-962b-85488c65967a.jpg', person: 'az' },
  { id: '40', src: '/images/3ab0cbad-eff5-4fa0-9eb9-433f9ceb1cac.jpg', person: 'couple' },
  { id: '41', src: '/images/8bd6639b-35e0-48f5-9eb7-24ca858cd1d8.jpg', person: 'az' },
];

const quotes = {
  az: [
    "AZ mah yang paling cantik sedunia 🦋",
    "Cantik poll, tapi nggak boleh diliat orang lain 😂",
    "Imut+manis+cantik+nakal = AZ 🔥",
    "Mana ada yang lebih cakep dari AZ 🥹",
    "Serakah? Ya emang harusnya punya aku doang 💕",
    "AZ = 4ever 💍",
    "Gemesin banget dah 🐰",
    "Best decision: milih AZ ✨",
    "Nggak tau lagi deh, terlalu cakep 😍",
    "AZ mah special from the start 🌟",
    "Cantik + imut + lucu = AZ",
    "Yang lain boleh iri wkwk 😅",
    "Gabisa berhenti mencintai AZ 💕",
    "AZ makes everything better ✨",
    "My one and only 🦋",
  ],
  wira: [
    "'az' mah beruntung punya AZ 🌟",
    "Dari jomblo → punya AZ 🥳",
    "Thanks AZ sudah mau sama 'az' 🙏",
    "Lucky guy poll dia 😅",
    "'az' mah kebanggaan adalah AZ 💕",
    "Best thing in 'az''s life: AZ ✨",
    "'az' mah grateful poll 🫶",
    "Thanks for choosing him 🦋",
  ],
  couple: [
    "Cinta = 'az' + AZ forever 💕",
    "Best couple poll 🦋✨",
    "'az' & AZ = meant to be 💍",
    "Love you more than yesterday 💕",
    "Together forever dan always 🌈",
    "My heart belongs to AZ 🥹",
    "We are each other's person ✨",
    "Love that vibe with AZ 🦋",
    "AZ + 'az' = perfect couple 💕",
    "Gabisa pisahkan sama siapa pun 🥹",
  ],
};

const facts = [
  "Ultah AZ: 14 Des 2004 (Sagitarius ♐️)",
  "Suka makan wafel + ayam",
  "Tempat fav: Links Cafe",
  "Date pertama: 26 Juni (parkiran USU → Kopi Kuni)",
  "Panggilan: AZ",
  "'az' loves AZ since 2025",
  "Sagitarius girl = fun & adventurous",
  "AZ makes 'az''s world better",
];

const getRandomQuote = (person: string): string => {
  const list = quotes[person as keyof typeof quotes] || quotes.az;
  return list[Math.floor(Math.random() * list.length)];
};

const getRandomFact = (): string => {
  return facts[Math.floor(Math.random() * facts.length)];
};

const sizeVariants = [
  'w-40 h-40 md:w-48 md:h-48',
  'w-48 h-56 md:w-56 md:h-64',
  'w-56 h-40 md:w-64 md:h-48',
  'w-32 h-32 md:w-40 md:h-40',
  'w-44 h-52 md:w-52 md:h-60',
  'w-36 h-44 md:w-44 md:h-52',
];

function FloatingPhoto({ 
  photo, 
  index, 
  onClick 
}: { 
  photo: PhotoItem; 
  index: number; 
  onClick: (p: PhotoItem) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [
    `${(index % 5) * 30 - 60}px`,
    `${(index % 5) * 30 + 60}px`
  ]);
  
  const rotate = useTransform(scrollYProgress, [0, 1], [
    (index % 3) * 6 - 6,
    (index % 3) * 6 + 6
  ]);
  
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.1, 0.9]);
  
  const sizeClass = sizeVariants[index % sizeVariants.length];
  
  const delay = index * 0.1;
  
  return (
    <motion.div
      ref={ref}
      style={{ y, rotate, scale }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.15, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
      className={`${sizeClass} absolute cursor-pointer group`}
      onClick={() => onClick(photo)}
    >
      <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl">
        <img
          src={photo.src}
          alt={photo.person}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-white text-xs font-medium">
            {photo.person === 'az' ? '💕 AZ' : photo.person === 'hm' ? '🔥 HM' : '🦋 Kita'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function ParticleBackground() {
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      emoji: ['💕', '💗', '💖', '🧡', '❤️', '🦋', '✨', '🌸'][i % 8],
    }));
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            x: `${p.x}%`, 
            y: '110%',
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: '-10%',
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            x: `${p.x + (Math.random() * 20 - 10)}%`,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute text-2xl"
          style={{ fontSize: p.size }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

export default function PhotoMosaic() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentFact, setCurrentFact] = useState('');

  const shuffledPhotos = useMemo(() => {
    return [...photosData].sort(() => Math.random() - 0.5);
  }, []);

  const positions = useMemo(() => {
    return shuffledPhotos.map((_, i) => ({
      left: `${(i % 5) * 20 + (Math.random() * 5)}%`,
      top: `${Math.floor(i / 5) * 25 + (Math.random() * 10)}%`,
    }));
  }, [shuffledPhotos]);

  const handlePhotoClick = useCallback((photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setCurrentQuote(getRandomQuote(photo.person));
    setCurrentFact(getRandomFact());
  }, []);

  const handleClose = useCallback(() => {
    setSelectedPhoto(null);
    setCurrentQuote('');
    setCurrentFact('');
  }, []);

  const handleNextQuote = useCallback(() => {
    if (selectedPhoto) {
      setCurrentQuote(getRandomQuote(selectedPhoto.person));
    }
  }, [selectedPhoto]);

  return (
    <>
      <ParticleBackground />
      
      <div className="relative min-h-[200vh] py-20">
        <div className="sticky top-0 h-screen overflow-hidden">
          {shuffledPhotos.map((photo, index) => (
            <motion.div
              key={`${photo.id}-${index}`}
              className="absolute"
              style={{
                left: positions[index].left,
                top: positions[index].top,
              }}
            >
              <FloatingPhoto
                photo={photo}
                index={index}
                onClick={handlePhotoClick}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              className="max-w-lg w-full bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.person}
                className="w-full aspect-video object-contain rounded-2xl mb-4"
              />
              <motion.p
                key={currentQuote}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-lg md:text-xl text-center font-medium mb-3"
              >
                {currentQuote || '💕'}
              </motion.p>
              {currentFact && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-pink-300 text-center text-sm mb-4"
                >
                  {currentFact}
                </motion.p>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleNextQuote}
                  className="bg-rose-500/80 hover:bg-rose-500 text-white px-4 py-2 rounded-full text-sm transition"
                >
                  Quote Lain 💕
                </button>
                <button
                  onClick={handleClose}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm transition"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}