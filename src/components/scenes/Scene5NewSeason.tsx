"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { ArrowRight, SunMedium } from "lucide-react";

export function Scene5NewSeason() {
  const { nextScene } = useExperience();
  const content = defaultContent.scene5;

  const [showSecondLine, setShowSecondLine] = useState(false);
  const [showThirdLine, setShowThirdLine] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShowSecondLine(true), 1800);
    const t2 = setTimeout(() => setShowThirdLine(true), 3400);
    const t3 = setTimeout(() => setShowButton(true), 4800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-between p-6 md:p-12 pointer-events-none">
      <div />

      <div className="text-center max-w-3xl px-4 flex flex-col items-center">
        {/* Morning Sun badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D4AF75]/20 border border-[#D4AF75]/40 mb-6 backdrop-blur-md"
        >
          <SunMedium className="w-4 h-4 text-[#D4AF75] animate-spin" style={{ animationDuration: "20s" }} />
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF75] font-medium">
            {content.badge}
          </span>
        </motion.div>

        {/* First Line */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#FFF0E4] leading-[1.15] tracking-tight mb-4 text-glow-ivory"
        >
          {content.headline}
        </motion.h1>

        {/* Second Line */}
        {showSecondLine && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif italic text-2xl sm:text-4xl text-[#E9A5B5] font-light mb-6"
          >
            {content.subhead}
          </motion.h2>
        )}

        {/* Third Line Card */}
        {showThirdLine && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 sm:p-8 rounded-3xl glass-panel max-w-2xl border border-[#D4AF75]/35 box-glow-gold mb-10"
          >
            <p className="text-base sm:text-lg md:text-xl text-[#FFF0E4] font-light leading-relaxed">
              &ldquo;{content.followUp}&rdquo;
            </p>
          </motion.div>
        )}

        {/* Action Button */}
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onClick={nextScene}
            className="group pointer-events-auto relative inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF75] to-[#A67C43] text-[#170B16] font-medium shadow-[0_0_30px_rgba(212,175,117,0.4)] hover:shadow-[0_0_50px_rgba(212,175,117,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FFF0E4]"
          >
            <span className="font-serif text-lg tracking-wide text-[#170B16]">
              {content.button}
            </span>
            <ArrowRight className="w-4 h-4 text-[#170B16] group-hover:translate-x-1 transition-transform" />
          </motion.button>
        )}
      </div>

      <div className="text-center text-xs text-[#D4AF75]/50 tracking-widest uppercase font-light pb-2">
        A new dawn softly breaks for you
      </div>
    </div>
  );
}
