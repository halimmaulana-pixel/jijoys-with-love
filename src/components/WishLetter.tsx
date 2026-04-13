/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

function PetalRain({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!active) return;

    const newPetals: Petal[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      size: 12 + Math.random() * 12,
      rotation: Math.random() * 360,
    }));

    setPetals(newPetals);

    const timeout = setTimeout(() => setPetals([]), 6000);
    return () => clearTimeout(timeout);
  }, [active]);

  if (!active || petals.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            x: `${petal.x}vw`,
            y: -20,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            y: "110vh",
            opacity: 0,
            rotate: petal.rotation + 360,
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            ease: "linear",
          }}
          className="absolute"
          style={{
            width: petal.size,
            height: petal.size,
            background: "linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%)",
            borderRadius: "50% 0 50% 50%",
            boxShadow: "0 2px 8px rgba(244, 168, 212, 0.4)",
          }}
        />
      ))}
    </div>
  );
}

function FloatingPetals({ active }: { active: boolean }) {
  const [floatingPetals, setFloatingPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (!active) return;

    const petals: Petal[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 4 + Math.random() * 3,
      size: 10 + Math.random() * 8,
      rotation: Math.random() * 360,
    }));

    setFloatingPetals(petals);
  }, [active]);

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {floatingPetals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            x: `${petal.x}vw`,
            y: "110vh",
            opacity: 0,
            rotate: 0,
          }}
          animate={{
            y: "-10vh",
            opacity: [0, 1, 1, 0],
            rotate: petal.rotation,
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute"
          style={{
            width: petal.size,
            height: petal.size,
            background: "linear-gradient(135deg, #fce7f3 0%, #f9a8d4 100%)",
            borderRadius: "50% 0 50% 50%",
            boxShadow: "0 2px 6px rgba(244, 168, 212, 0.3)",
          }}
        />
      ))}
    </div>
  );
}

export default function WishLetter() {
  const [message, setMessage] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 1500);
  };

  const handleReset = () => {
    setMessage("");
    setIsSent(false);
  };

  return (
    <>
      <PetalRain active={isSent} />
      <FloatingPetals active={isSent} />

      <div className="flex min-h-[60vh] w-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/30 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-pink-100/20 to-rose-100/20" />

            <div className="relative z-10">
              <h2 className="mb-6 text-center font-serif text-2xl font-semibold text-rose-800 sm:text-3xl">
                💌 Wish Letter
              </h2>

              <AnimatePresence mode="wait">
                {!isSent ? (
                  <motion.div
                    key="input"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tuliskan perasaanmu untuk diri sendiri... &#10;Masukkan keinginan, harapan, atau pesan cinta untukmu..."
                      className="mb-6 h-40 w-full resize-none rounded-2xl border border-white/40 bg-white/40 p-4 font-serif text-base text-rose-800 placeholder-rose-400/60 backdrop-blur-sm focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200/50 sm:h-48 sm:p-5 sm:text-lg"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    />

                    <div className="flex justify-center">
                      <motion.button
                        onClick={handleSend}
                        disabled={!message.trim() || isSending}
                        className="group relative overflow-hidden rounded-full bg-gradient-to-r from-rose-400 to-pink-500 px-10 py-3 text-base font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          {isSending ? (
                            <>
                              <motion.span
                                className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                              />
                              Mengirim...
                            </>
                          ) : (
                            <>
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                              Kirim Wish
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-pink-400 to-rose-400 transition-transform duration-500 group-hover:translate-x-0" />
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <div className="mb-6 text-center">
                      <p className="mb-4 font-serif text-lg text-rose-600">
                        ✨ Pesan telah tersimpan di hati ✨
                      </p>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="relative rounded-2xl border border-rose-200/50 bg-gradient-to-br from-rose-50/50 to-pink-50/50 p-6 sm:p-8"
                    >
                      <div className="absolute -top-3 left-4 text-4xl text-rose-300">
                        &quot;
                      </div>
                      <p
                        className="font-serif text-xl leading-relaxed text-rose-800 sm:text-2xl"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {message}
                      </p>
                      <div className="absolute -bottom-3 right-4 text-4xl text-rose-300">
                        &quot;
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-6 flex justify-center"
                    >
                      <motion.button
                        onClick={handleReset}
                        className="group relative overflow-hidden rounded-full border border-rose-300 bg-white/40 px-8 py-2.5 font-medium text-rose-600 backdrop-blur-sm transition-all duration-300 hover:bg-rose-50 hover:text-rose-700"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <svg
                            className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-180"
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
                          Tulis Lagi
                        </span>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-rose-500/70">
            Dari hati · Untukmu
          </p>
        </motion.div>
      </div>
    </>
  );
}
