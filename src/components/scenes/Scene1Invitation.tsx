"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { ArrowRight } from "lucide-react";

export function Scene1Invitation() {
  const { nextScene, startAudio } = useExperience();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const content = defaultContent.scene1;

  const handleProceed = () => {
    startAudio();
    setIsTransitioning(true);
    setTimeout(() => {
      nextScene();
    }, 700);
  };

  return (
    <div className="relative z-20 w-full h-full flex flex-col items-center justify-between p-6 md:p-12 pointer-events-none">
      {/* Top spacer */}
      <div />

      {/* Main Center Editorial Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -20 : 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-2xl px-4 flex flex-col items-center"
      >
        {/* Subtle pill tag */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#681C35]/30 border border-[#D4AF75]/30 mb-6 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF75] animate-ping" />
          <span className="text-[11.5px] uppercase tracking-[0.2em] text-[#D4AF75] font-medium">
            {content.badge}
          </span>
        </div>

        {/* Headline in Cormorant Garamond */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light text-[#FFF0E4] leading-[1.15] tracking-tight mb-4 text-glow-ivory">
          {content.headline}
        </h1>

        {/* Supporting subtitle in Inter */}
        <p className="text-base sm:text-lg md:text-xl text-[#A995A6] font-light max-w-lg mb-10 leading-relaxed">
          {content.supporting}
        </p>

        {/* Primary Call to Action Button */}
        <button
          onClick={handleProceed}
          className="group pointer-events-auto relative inline-flex items-center space-x-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#681C35] to-[#481224] text-[#FFF0E4] border border-[#D4AF75]/50 shadow-[0_0_25px_rgba(212,175,117,0.25)] hover:shadow-[0_0_40px_rgba(212,175,117,0.45)] hover:border-[#D4AF75] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
        >
          <span className="font-serif text-lg tracking-wide text-[#FFF0E4] group-hover:text-[#D4AF75] transition-colors">
            {content.button}
          </span>
          <ArrowRight className="w-4 h-4 text-[#D4AF75] group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Bottom Hint */}
      <div className="text-center text-xs text-[#A995A6]/60 tracking-widest uppercase font-light pb-2">
        A private experience for your eyes only
      </div>
    </div>
  );
}
