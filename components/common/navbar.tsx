"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-2xl sm:text-3xl font-bold font-logo text-primary-600"
            >
              Notesey
            </motion.span>
          </Link>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            <motion.div whileHover={{ y: -2 }}>
              <Link
                href="/login"
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-all"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-gray-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden py-4">
            <div className="flex flex-col space-y-4 px-4">
              <Link
                href="/login"
                className="w-full py-2 text-center text-gray-600 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full py-2 bg-primary-600 text-white rounded-lg hover:opacity-90 transition-all text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
