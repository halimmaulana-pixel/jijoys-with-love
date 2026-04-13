/* eslint-disable react-hooks/purity, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GuestbookEntry {
  id: string;
  message: string;
  fromName: string;
  createdAt: Date;
}

interface GuestbookDB {
  insert(entry: GuestbookEntry): Promise<void>;
  getAll(): Promise<GuestbookEntry[]>;
}

const STORAGE_KEY = 'love-website-guestbook';

const localStorageDB: GuestbookDB = {
  async insert(entry: GuestbookEntry): Promise<void> {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  },
  async getAll(): Promise<GuestbookEntry[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const entries = JSON.parse(data) as GuestbookEntry[];
    return entries.map((e) => ({
      ...e,
      createdAt: new Date(e.createdAt),
    }));
  },
};

export default function BukuTamu() {
  const [messages, setMessages] = useState<GuestbookEntry[]>([]);
  const [message, setMessage] = useState('');
  const [fromName, setFromName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      const entries = await localStorageDB.getAll();
      const sorted = entries.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sorted);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !fromName.trim()) return;

    setIsSubmitting(true);
    try {
      const newEntry: GuestbookEntry = {
        id: crypto.randomUUID(),
        message: message.trim(),
        fromName: fromName.trim(),
        createdAt: new Date(),
      };

      await localStorageDB.insert(newEntry);
      setMessages((prev) => [newEntry, ...prev]);
      setMessage('');
      setFromName('');
    } catch (error) {
      console.error('Failed to submit message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl" />
        
        <div className="relative p-8">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-semibold text-center text-pink-600 mb-2"
          >
            Buku Tamu
          </motion.h2>
          <p className="text-center text-pink-400/80 mb-8">
            Kirim pesan cinta untuk AZ
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-8">
            <div>
              <input
                type="text"
                placeholder="Nama kamu..."
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-pink-200/50 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300/50 transition-all duration-200"
              />
            </div>
            <div>
              <textarea
                placeholder="Tulis pesan cinta untuk AZ..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-pink-200/50 text-pink-700 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300/50 focus:border-pink-300/50 transition-all duration-200 resize-none"
              />
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting || !message.trim() || !fromName.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-medium shadow-lg shadow-pink-300/30 hover:shadow-pink-400/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Pesan 💕'}
            </motion.button>
          </form>

          <div className="border-t border-pink-200/30 pt-6">
            <h3 className="text-lg font-medium text-pink-600 mb-4">
              Pesan dari mereka yang sayang AZ
            </h3>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-pink-300 border-t-pink-500 rounded-full"
                />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-pink-300/70 py-8">
                Belum ada pesan. Jadilah yang pertama! ✨
              </p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                <AnimatePresence mode="popLayout">
                  {messages.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-pink-100/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-pink-600">
                          {entry.fromName}
                        </span>
                        <span className="text-xs text-pink-400/70">
                          {formatDate(entry.createdAt)}
                        </span>
                      </div>
                      <p className="text-pink-700/80 leading-relaxed">
                        {entry.message}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
