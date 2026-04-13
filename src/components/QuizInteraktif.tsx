'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctAnswer: string;
}

interface QuizState {
  currentQuestion: number;
  answers: Record<number, string>;
  showFeedback: boolean;
  isCorrect: boolean;
  isComplete: boolean;
  score: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Tanggal pertama chat? 💬',
    options: [
      { id: 'a', text: '7 Maret 2025' },
      { id: 'b', text: '8 Maret 2025' },
      { id: 'c', text: '9 Maret 2025' },
      { id: 'd', text: '10 Maret 2025' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 2,
    question: 'Bulan jalan pertama? 👫',
    options: [
      { id: 'a', text: 'Mei' },
      { id: 'b', text: 'Juni' },
      { id: 'c', text: 'Juli' },
      { id: 'd', text: 'Agustus' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 3,
    question: 'Tanggal ultah? 🎂',
    options: [
      { id: 'a', text: '14 Desember 2004' },
      { id: 'b', text: '15 Desember 2004' },
      { id: 'c', text: '14 November 2004' },
      { id: 'd', text: '15 November 2004' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 4,
    question: 'Nama tempat pertama? 📍',
    options: [
      { id: 'a', text: 'USU' },
      { id: 'b', text: 'Mebid' },
      { id: 'c', text: 'Deli' },
      { id: 'd', text: 'Centre Point' },
    ],
    correctAnswer: 'a',
  },
  {
    id: 5,
    question: 'Minuman favorit? ☕',
    options: [
      { id: 'a', text: 'Kopi hitam' },
      { id: 'b', text: 'Kopi susu' },
      { id: 'c', text: 'Thai tea' },
      { id: 'd', text: 'Jus alpukat' },
    ],
    correctAnswer: 'b',
  },
];

const triggerConfetti = (): void => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = (): void => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#ff6b9d', '#c44569', '#f8b500', '#6dd5ed'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#ff6b9d', '#c44569', '#f8b500', '#6dd5ed'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

const initialState: QuizState = {
  currentQuestion: 0,
  answers: {},
  showFeedback: false,
  isCorrect: false,
  isComplete: false,
  score: 0,
};

export default function QuizInteraktif() {
  const [quizState, setQuizState] = useState<QuizState>(initialState);

  const calculateScore = useCallback((answers: Record<number, string>): number => {
    return Object.entries(answers).reduce((score, [qId, answerId]) => {
      const questionId = parseInt(qId, 10);
      const question = quizQuestions.find((q) => q.id === questionId);
      return score + (question?.correctAnswer === answerId ? 1 : 0);
    }, 0);
  }, []);

  const handleAnswer = (answerId: string): void => {
    const currentQ = quizQuestions[quizState.currentQuestion];
    const isCorrectAnswer = currentQ.correctAnswer === answerId;

    const newAnswers = {
      ...quizState.answers,
      [currentQ.id]: answerId,
    };

    if (isCorrectAnswer) {
      const newScore = quizState.score + 1;
      setQuizState((prev) => ({
        ...prev,
        answers: newAnswers,
        showFeedback: true,
        isCorrect: true,
        score: newScore,
      }));
    } else {
      setQuizState((prev) => ({
        ...prev,
        answers: newAnswers,
        showFeedback: true,
        isCorrect: false,
      }));
    }

    setTimeout(() => {
      if (quizState.currentQuestion < quizQuestions.length - 1) {
        setQuizState((prev) => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          showFeedback: false,
          isCorrect: false,
        }));
      } else {
        const finalScore = calculateScore(newAnswers);
        if (finalScore === quizQuestions.length) {
          triggerConfetti();
        }
        setQuizState((prev) => ({
          ...prev,
          answers: newAnswers,
          isComplete: true,
          score: finalScore,
        }));
      }
    }, 1200);
  };

  const handleRetry = (): void => {
    setQuizState(initialState);
  };

  const { currentQuestion, showFeedback, isCorrect, isComplete, score } = quizState;
  const currentQ = quizQuestions[currentQuestion];
  const totalQuestions = quizQuestions.length;

  if (isComplete) {
    const isPerfectScore = score === totalQuestions;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="text-6xl mb-6"
            >
              {isPerfectScore ? '💕🎉' : '💭'}
            </motion.div>

            <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 text-pink-700">
              {isPerfectScore ? 'Selamat!' : 'Hasil Quiz'}
            </h1>

            <p className="text-center text-pink-600 mb-2 text-lg">
              {isPerfectScore
                ? 'Kamu menjawab semua pertanyaan dengan benar!'
                : `Kamu menjawab ${score} dari ${totalQuestions} pertanyaan dengan benar.`}
            </p>

            <AnimatePresence>
              {isPerfectScore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 p-4 bg-pink-100/50 rounded-2xl"
                >
                  <p className="text-pink-700 font-medium">
                    untuk AZ 💖
                  </p>
                  <p className="text-pink-600 text-sm mt-2">
                    Kamu yang terbaik! Terima kasih sudah membuatku bahagia. Setiap momen denganmu adalah anugerah. Aku sayang kamu! ❤️
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {!isPerfectScore && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-4 bg-blue-100/50 rounded-2xl"
              >
                <p className="text-blue-700 font-medium">
                  Coba lagi ya! 💪
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  Pastikan kamu mengingat semua momen spesial kita!
                </p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRetry}
              className="mt-6 w-full py-4 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg"
            >
              {isPerfectScore ? 'Main Lagi 💕' : 'Coba Lagi 🔄'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/40">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-4xl mb-4 text-center"
          >
            💕
          </motion.div>

          <h1 className="text-xl md:text-2xl font-bold text-center mb-2 text-pink-700">
            Quiz Kita 💖
          </h1>

          <p className="text-center text-pink-600 mb-6 text-sm">
            Pertanyaan {currentQuestion + 1} dari {totalQuestions}
          </p>

          <div className="mb-6">
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-medium text-pink-700 mb-6 text-center">
                {currentQ.question}
              </p>

              <div className="space-y-3">
                {currentQ.options.map((option) => {
                  const isSelected = quizState.answers[currentQ.id] === option.id;
                  const showCorrect = showFeedback && option.id === currentQ.correctAnswer;
                  const showWrong = showFeedback && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={option.id}
                      whileHover={!showFeedback ? { scale: 1.02 } : {}}
                      whileTap={!showFeedback ? { scale: 0.98 } : {}}
                      onClick={() => !showFeedback && handleAnswer(option.id)}
                      disabled={showFeedback}
                      className={`w-full px-6 py-4 rounded-2xl text-left font-medium transition-all duration-200 border-2
                        ${showCorrect
                          ? 'bg-green-100/80 border-green-400 text-green-700'
                          : showWrong
                            ? 'bg-red-100/80 border-red-400 text-red-700'
                            : isSelected
                              ? 'bg-pink-100/80 border-pink-400 text-pink-700'
                              : 'bg-white/40 border-white/40 text-pink-700 hover:bg-pink-100/60 hover:border-pink-300'
                        }
                        ${showFeedback ? 'cursor-default' : 'cursor-pointer'}
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${showCorrect
                            ? 'bg-green-400 text-white'
                            : showWrong
                              ? 'bg-red-400 text-white'
                              : 'bg-pink-200 text-pink-700'
                          }
                        `}>
                          {option.id.toUpperCase()}
                        </span>
                        {option.text}
                        {showCorrect && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            ✓
                          </motion.span>
                        )}
                        {showWrong && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto"
                          >
                            ✗
                          </motion.span>
                        )}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}