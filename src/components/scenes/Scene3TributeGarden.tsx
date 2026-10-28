"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { Check, X, ArrowRight, Heart } from "lucide-react";

export function Scene3TributeGarden() {
  const {
    nextScene,
    activeTributeId,
    setActiveTributeId,
    discoveredTributes,
    markTributeDiscovered,
  } = useExperience();

  const content = defaultContent.scene3;
  const activeTribute = content.elements.find((el) => el.id === activeTributeId);

  const handleSelect = (id: string) => {
    setActiveTributeId(id);
    markTributeDiscovered(id);
  };

  const handleCloseModal = () => {
    setActiveTributeId(null);
  };

  const allDiscovered = content.elements.every((el) => discoveredTributes.includes(el.id));

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-4 md:p-10 pointer-events-none">
      {/* Top Header */}
      <div className="text-center pt-8 md:pt-6 max-w-xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#681C35]/40 border border-[#D4AF75]/30 mb-3 backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 text-[#D4AF75]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF75] font-medium">
            {content.badge}
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#FFF0E4] font-light tracking-tight mb-2 text-glow-ivory">
          {content.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#A995A6] max-w-md">
          {content.subtitle}
        </p>
      </div>

      {/* Center Interactive Tribute Overlay Modal */}
      <AnimatePresence>
        {activeTribute && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#170B16]/75 backdrop-blur-md pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-[#D4AF75]/40 box-glow-gold flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-5 right-5 p-2 rounded-full text-[#A995A6] hover:text-[#FFF0E4] hover:bg-[#681C35]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
                aria-label="Close tribute message"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Tag & Title */}
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-[#D4AF75]/20 text-[#D4AF75] border border-[#D4AF75]/30">
                  {activeTribute.tag}
                </span>
                <span className="text-xs uppercase tracking-widest text-[#E9A5B5] font-medium">
                  Appreciation
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-[#FFF0E4] font-normal mb-4 text-glow-ivory">
                {activeTribute.title}
              </h3>

              {/* Tribute Message Body */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#170B16]/60 border border-[#D4AF75]/15 mb-6">
                <p className="text-base sm:text-lg text-[#FFF0E4] font-light leading-relaxed font-serif italic">
                  &ldquo;{activeTribute.message}&rdquo;
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleCloseModal}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#681C35] to-[#8E2849] text-[#FFF0E4] border border-[#D4AF75]/40 hover:border-[#D4AF75] font-medium transition-all shadow-[0_0_15px_rgba(212,175,117,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
              >
                I hold this close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Selector Dock & Continue Button */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center pb-4 pointer-events-auto">
        {/* 3 Flower Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-5 px-3 py-2 rounded-2xl bg-[#170B16]/80 backdrop-blur-md border border-[#D4AF75]/25">
          {content.elements.map((el) => {
            const isDiscovered = discoveredTributes.includes(el.id);
            const isSelected = activeTributeId === el.id;

            return (
              <button
                key={el.id}
                onClick={() => handleSelect(el.id)}
                className={`flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-200 border ${
                  isSelected
                    ? "bg-[#681C35] border-[#D4AF75] text-[#FFF0E4] shadow-[0_0_15px_rgba(212,175,117,0.35)]"
                    : isDiscovered
                    ? "bg-[#170B16]/70 border-[#D4AF75]/40 text-[#FFF0E4]/90 hover:border-[#D4AF75]"
                    : "bg-[#170B16]/40 border-white/10 text-[#A995A6] hover:border-[#D4AF75]/30 hover:text-[#FFF0E4]"
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isDiscovered ? "bg-[#D4AF75]" : "bg-white/20"
                  }`}
                />
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  {el.title}
                </span>
                {isDiscovered && (
                  <Check className="w-3.5 h-3.5 text-[#D4AF75]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Continue Button to Scene 4 */}
        <motion.button
          onClick={nextScene}
          className={`inline-flex items-center space-x-3 px-8 py-3.5 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF75] ${
            allDiscovered
              ? "bg-gradient-to-r from-[#681C35] to-[#8E2849] border border-[#D4AF75] text-[#FFF0E4] shadow-[0_0_25px_rgba(212,175,117,0.3)] animate-pulse"
              : "bg-[#170B16]/80 border border-[#D4AF75]/30 text-[#FFF0E4]/90 hover:border-[#D4AF75]"
          }`}
        >
          <span className="font-serif text-base sm:text-lg tracking-wide text-[#FFF0E4]">
            {content.button}
          </span>
          <ArrowRight className="w-4 h-4 text-[#D4AF75]" />
        </motion.button>
      </div>
    </div>
  );
}
