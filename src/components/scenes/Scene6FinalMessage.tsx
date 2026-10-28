"use client";

import React from "react";
import { motion } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { RotateCcw, Bookmark, Flower2 } from "lucide-react";

export function Scene6FinalMessage() {
  const { restartExperience, setIsKeepsakeOpen } = useExperience();
  const content = defaultContent.scene6;

  return (
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-between p-6 md:p-12 pointer-events-none">
      <div />

      <div className="text-center max-w-3xl px-4 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#681C35]/30 border border-[#D4AF75]/40 mb-6 backdrop-blur-md"
        >
          <Flower2 className="w-3.5 h-3.5 text-[#D4AF75]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF75] font-medium">
            {content.badge}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#FFF0E4] leading-[1.2] tracking-tight mb-6 text-glow-ivory"
        >
          {content.headline}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-2xl text-[#E9A5B5] font-serif italic mb-8 max-w-xl leading-relaxed"
        >
          {content.subhead}
        </motion.p>

        {/* Final Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="p-5 sm:p-7 rounded-3xl glass-panel max-w-lg border border-[#D4AF75]/40 box-glow-gold mb-10 text-center"
        >
          <p className="font-serif text-xl sm:text-2xl text-[#D4AF75] font-normal tracking-wide">
            {content.finalQuote}
          </p>
        </motion.div>

        {/* Two Controls: Experience it again & Keep this reminder close */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto"
        >
          {/* Keep reminder close */}
          <button
            onClick={() => setIsKeepsakeOpen(true)}
            className="group relative inline-flex items-center space-x-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#681C35] to-[#8E2849] text-[#FFF0E4] border border-[#D4AF75]/60 hover:border-[#D4AF75] shadow-[0_0_20px_rgba(212,175,117,0.3)] hover:shadow-[0_0_35px_rgba(212,175,117,0.5)] transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
          >
            <Bookmark className="w-4 h-4 text-[#D4AF75]" />
            <span className="font-serif text-base sm:text-lg tracking-wide text-[#FFF0E4]">
              {content.buttonKeepReminder}
            </span>
          </button>

          {/* Experience it again */}
          <button
            onClick={restartExperience}
            className="inline-flex items-center space-x-2.5 px-6 py-3.5 rounded-full bg-[#170B16]/70 hover:bg-[#170B16] text-[#FFF0E4]/80 hover:text-[#FFF0E4] border border-[#D4AF75]/25 hover:border-[#D4AF75]/60 transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
          >
            <RotateCcw className="w-4 h-4 text-[#D4AF75]" />
            <span>{content.buttonRepeat}</span>
          </button>
        </motion.div>
      </div>

      <div className="text-center text-xs text-[#A995A6]/40 tracking-widest uppercase font-light pb-2">
        Rooting for you in every season and every dream
      </div>
    </div>
  );
}
