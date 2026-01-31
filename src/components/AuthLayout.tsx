"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-red-500 to-rose-400 text-white flex-col justify-center items-start px-16 relative overflow-hidden">
        {/* Floating Circles */}
        <motion.div
          className="absolute w-72 h-72 bg-white/10 rounded-full top-10 left-10"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-60 h-60 bg-white/10 rounded-full bottom-10 right-10"
          animate={{ y: [0, 25, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        {/* Content Animation Wrapper */}
        <motion.div
          className="z-10 ml-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl mb-4 animate-pulse">
              <Image
                src="/blood-donate.png"
                alt="Logo"
                width={200}
                height={200}
                className="object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold tracking-wide">Raktsetu</h1>
          </div>

          <p className="text-lg mb-8">
            Connecting lives through the gift of blood
          </p>

          <div className="flex gap-6 text-sm opacity-90">
            <span>❤️ Save Lives</span>
            <span>🩸 Donate Blood</span>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE (FORM AREA) */}
      <div className="w-full md:w-1/2 bg-[#fffaf7] flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
