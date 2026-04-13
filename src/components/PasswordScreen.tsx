/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CORRECT_ANSWER = 'USU';

interface PasswordScreenProps {
  onSuccess: () => void;
}

const LOVE_LETTER = `Kepada Jijoy sayangku,

Hari ini kau memulai UAS pertama.
Walau terasa berat, tapi ingat:
🌟 Kamu sudah pernah menghadapi Tantangan besar dalam hidup
🌟 Kau adalah yang paling kuat yang aku kenal
🌟 ISTIRAHAT Secukupnya, tapi TIDAK BERHENTI
🌟 HM selalui mendukungmu dari sini

Kau bisa!
Tidak ada yang lebih Bangga dari aku melihatmu berjuang.
USU akan kita rayakan bersama setelah semua selesai.

Semangat sayangku! 💕
Aku pride jadi punya kamu.

- HM`;

const ENCOURAGEMENT = [
  "Kau pasti bisa! 💪",
  "HM percaya sama Jijoy! 🌟",
  "Satu langkah lagi, kau pasti bisa! ✨",
  "Jangan lupa istirahat ya! 💕",
  "Semua akan berakhir dengan kebanggaan! 🎉",
  "Kau sudah sejauh ini, lanjutkan! 🚀",
  "HM selalui bangga sama kamu! ❤️",
];

export default function PasswordScreen({ onSuccess }: PasswordScreenProps) {
  const [answer, setAnswer] = useState('');
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (answer.trim().toUpperCase() === CORRECT_ANSWER) {
      setIsSuccess(true);
      setTimeout(() => {
        setShowLetter(true);
      }, 1000);
    } else {
      setIsError(true);
      setShowHint(true);
      setTimeout(() => {
        setIsError(false);
      }, 500);
    }
  };

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
  };

  const handleEnter = () => {
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-rose-200 via-pink-200 to-purple-200" />
      
      <AnimatePresence mode="wait">
        {!isEnvelopeOpen ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="text-center cursor-pointer"
            onClick={handleOpenEnvelope}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, -2, 2, 0],
              }}
              transition={{ 
                y: { repeat: Infinity, duration: 2 },
                rotate: { repeat: Infinity, duration: 3 },
              }}
              className="text-8xl mb-4"
            >
              💌
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-rose-600 text-xl font-medium"
            >
              Klik untuk buka surat 💕
            </motion.p>
          </motion.div>
        ) : !showLetter ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-6xl mb-6 text-center"
              >
                💕
              </motion.div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-rose-700">
                Welcome, Sayang! 💖
              </h1>
              
              <p className="text-center text-rose-600 mb-8 text-lg">
                &quot;Kita pertama kali ketemu di mana ya?&quot;
              </p>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => {
                          setAnswer(e.target.value);
                          if (isError) setIsError(false);
                        }}
                        placeholder="Tulis jawabanmu..."
                        className={`w-full px-6 py-4 bg-white/50 backdrop-blur-sm rounded-2xl border-2 transition-all duration-200 outline-none text-rose-700 placeholder-rose-400/70 text-lg
                          ${isError 
                            ? 'border-red-400 shake-animation' 
                            : 'border-rose-300 focus:border-rose-500 focus:shadow-lg focus:shadow-rose-200/50'
                          }`}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-rose-400 to-purple-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
                    >
                      Masuk 💍
                    </motion.button>

                    <AnimatePresence>
                      {showHint && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-center text-red-500 text-sm mt-2"
                        >
                          Hint: coba pikir lagi... dari mana kita bertemu? 🤔
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ type: 'spring', delay: 0.2 }}
                      className="text-6xl mb-4"
                    >
                      💕
                    </motion.div>
                    <p className="text-2xl font-bold text-rose-600">
                      Benar! 💕
                    </p>
                    <p className="text-rose-500 mt-2">Buka surat kamu...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, rotateX: 90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            className="max-w-lg w-full"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl p-8 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-4xl">💌</div>
              
              <h2 className="text-2xl font-bold text-center text-rose-600 mb-6 mt-4">
                Surat Untuk AZ 💕
              </h2>
              
              <div className="bg-rose-50 rounded-2xl p-6 mb-6">
                <p className="text-rose-700 whitespace-pre-line text-center leading-relaxed">
                  {LOVE_LETTER}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnter}
                className="w-full py-4 bg-gradient-to-r from-rose-400 to-pink-400 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 text-lg"
              >
                Buka Hati 💕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
