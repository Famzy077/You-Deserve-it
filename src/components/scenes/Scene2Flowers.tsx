"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { ArrowRight } from "lucide-react";

export function Scene2Flowers() {
  const { nextScene } = useExperience();
  const content = defaultContent.scene2;

  // Staged emotional reveals
  const [showPauseText, setShowPauseText] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Reveal emotional pause after 2.2 seconds
    const timer1 = setTimeout(() => {
      setShowPauseText(true);
    }, 2200);

    // Reveal continue button after 4 seconds
    const timer2 = setTimeout(() => {
      setShowButton(true);
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-between p-6 md:p-12 pointer-events-none">
      <div />

      <div className="text-center max-w-3xl px-4 flex flex-col items-center">
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#FFF0E4] leading-[1.1] tracking-tight mb-6 text-glow-gold"
        >
          {content.headline}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg sm:text-xl md:text-2xl text-[#E9A5B5] font-light max-w-2xl mb-8 leading-relaxed italic font-serif"
        >
          {content.subhead}
        </motion.p>

        {/* Emotional Pause Follow-up Reveal */}
        {showPauseText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl glass-panel-subtle max-w-xl border border-[#D4AF75]/25 mb-10 shadow-2xl"
          >
            <p className="text-base sm:text-lg text-[#FFF0E4] font-light leading-relaxed">
              &ldquo;{content.pauseText}&rdquo;
            </p>
          </motion.div>
        )}

        {/* Continue Button */}
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onClick={nextScene}
            className="group pointer-events-auto relative inline-flex items-center space-x-3 px-8 py-3.5 rounded-full bg-[#170B16]/80 text-[#FFF0E4] border border-[#D4AF75]/40 hover:border-[#D4AF75] shadow-[0_0_20px_rgba(212,175,117,0.2)] hover:shadow-[0_0_35px_rgba(212,175,117,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
          >
            <span className="font-serif text-lg tracking-wide text-[#FFF0E4] group-hover:text-[#D4AF75] transition-colors">
              {content.button}
            </span>
            <ArrowRight className="w-4 h-4 text-[#D4AF75] group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>

      <div className="text-center text-xs text-[#A995A6]/50 tracking-widest uppercase font-light pb-2">
        A rose blooms not for an ending, but for its own enduring grace
      </div>
    </div>
  );
}
