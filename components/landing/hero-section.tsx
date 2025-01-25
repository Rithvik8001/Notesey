"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 py-24 sm:py-32 bg-gradient-radial from-secondary-50 via-white to-primary-50">
      <BackgroundEffects />
      <HeroContent />
    </section>
  );
}

function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-1/2 -right-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-primary-200/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -bottom-1/2 -left-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-secondary-200/30 rounded-full blur-3xl"
      />
    </div>
  );
}

function HeroContent() {
  return (
    <div className="relative max-w-6xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6"
      >
        Making last-minute studying feel like a{" "}
        <span className="text-primary-600">superpower</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-0"
      >
        Your AI-powered study companion that helps you understand, memorize, and
        master any subject matter in record time.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-all text-center"
          >
            Get Started Free
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
