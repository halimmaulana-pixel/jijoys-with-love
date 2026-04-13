"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface LoveMeterProps {
  initialValue?: number;
}

export default function LoveMeter({ initialValue = 50 }: LoveMeterProps) {
  const [value, setValue] = useState(Math.min(100, Math.max(0, initialValue)));
  const [isMaxReached, setIsMaxReached] = useState(false);

  const triggerConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff85bb", "#ff4d9e", "#ff9dcb", "#ffb6d9"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ff85bb", "#ff4d9e", "#ff9dcb", "#ffb6d9"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleDecrease = () => {
    setValue((prev) => {
      const newValue = Math.max(0, prev - 10);
      if (newValue < 100) setIsMaxReached(false);
      return newValue;
    });
  };

  const handleIncrease = () => {
    setValue((prev) => {
      const newValue = Math.min(100, prev + 10);
      if (newValue >= 100) {
        setIsMaxReached(true);
        setTimeout(triggerConfetti, 300);
      }
      return newValue;
    });
  };

  const handleMax = () => {
    setValue(100);
    setIsMaxReached(true);
    triggerConfetti();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-md mx-auto p-8 rounded-3xl"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: "0 8px 32px rgba(255, 133, 187, 0.2)",
      }}
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-2xl font-bold mb-6"
        style={{ color: "#ff4d9e" }}
      >
        Love Meter
      </motion.h2>

      <div className="relative mb-8">
        <div className="h-16 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.2)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #ff85bb 0%, #ff4d9e 100%)",
              boxShadow: "0 0 20px rgba(255, 133, 187, 0.5)",
            }}
          />
        </div>

        <motion.div
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className="text-5xl font-bold"
            style={{
              color: "#fff",
              textShadow: "0 2px 10px rgba(255, 77, 158, 0.5)",
              fontSize: "42px",
            }}
          >
            {value}%
          </span>
        </motion.div>
      </div>

      <div className="flex gap-4 justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDecrease}
          className="px-6 py-3 rounded-xl font-semibold text-lg transition-all"
          style={{
            background: "rgba(255, 255, 255, 0.3)",
            color: "#ff4d9e",
            border: "1px solid rgba(255, 133, 187, 0.3)",
          }}
        >
          -10
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleIncrease}
          className="px-6 py-3 rounded-xl font-semibold text-lg transition-all"
          style={{
            background: "linear-gradient(135deg, #ff85bb 0%, #ff4d9e 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 15px rgba(255, 77, 158, 0.4)",
          }}
        >
          +10
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMax}
          className="px-6 py-3 rounded-xl font-semibold text-lg transition-all"
          style={{
            background: isMaxReached
              ? "linear-gradient(135deg, #ff9dcb 0%, #ff4d9e 100%)"
              : "linear-gradient(135deg, #ff85bb 0%, #ff4d9e 100%)",
            color: "#fff",
            border: "none",
            boxShadow: "0 4px 15px rgba(255, 77, 158, 0.4)",
          }}
        >
          MAX 💖
        </motion.button>
      </div>

      {isMaxReached && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6 text-lg font-medium"
          style={{ color: "#ff4d9e" }}
        >
          💕 Cintaku padamu 100%! 💕
        </motion.p>
      )}
    </motion.div>
  );
}
