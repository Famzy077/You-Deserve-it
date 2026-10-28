"use client";

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { ArrowRight, Star, Heart } from "lucide-react";

export function Scene4Letter() {
  const { isEnvelopeOpen, openEnvelope, nextScene } = useExperience();
  const letterContainerRef = useRef<HTMLDivElement>(null);
  const content = defaultContent.scene4;

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-10 pointer-events-none">
      {/* Top Banner */}
      <div className="text-center pt-8 md:pt-4 max-w-lg mx-auto flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#681C35]/30 border border-[#D4AF75]/30 mb-2 backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 text-[#E9A5B5]" />
          <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF75] font-medium">
            {content.badge}
          </span>
        </div>
      </div>

      {/* Direct Star Center Hotspot for instant natural touch/click */}
      {!isEnvelopeOpen && (
        <div
          onClick={openEnvelope}
          title="Click the golden star to open"
          aria-label="Click the golden star to open"
          className="absolute inset-0 flex items-center justify-center pointer-events-auto cursor-pointer z-20"
          style={{ touchAction: "manipulation" }}
        >
          {/* Circular interactive target right over the star */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full flex items-center justify-center group">
            {/* Subtle interactive hover shimmer aura around the star */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#D4AF75]/0 group-hover:border-[#D4AF75]/60 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(212,175,117,0.5)] transition-all duration-300 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Main Interaction: Floating Star Prompt at bottom OR Opened Letter Modal in center */}
      <div className={`flex-1 flex ${!isEnvelopeOpen ? "items-end justify-center pb-8" : "items-center justify-center"} p-2 sm:p-4 z-30`}>
        <AnimatePresence mode="wait">
          {!isEnvelopeOpen ? (
            /* Subtle floating hint directing attention to the 3D star seal */
            <motion.div
              key="envelope-closed-prompt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              onClick={openEnvelope}
              className="text-center flex flex-col items-center pointer-events-auto cursor-pointer"
            >
              <div className="inline-flex items-center space-x-2.5 px-6 py-2.5 rounded-full bg-[#170B16]/80 text-[#FFF0E4] border border-[#D4AF75]/40 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,117,0.25)] hover:border-[#D4AF75] hover:shadow-[0_0_30px_rgba(212,175,117,0.45)] transition-all duration-300 transform hover:scale-105">
                <Star className="w-4 h-4 text-[#D4AF75] fill-[#D4AF75]/60" />
                <span className="font-serif text-base tracking-wide text-[#FFF0E4]">
                  {content.envelopePrompt}
                </span>
                <Star className="w-4 h-4 text-[#D4AF75] fill-[#D4AF75]/60" />
              </div>
            </motion.div>
          ) : (
            /* Opened Letter Container with Editorial Parchment Styling */
            <motion.div
              key="envelope-opened-letter"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl max-h-[75vh] sm:max-h-[78vh] flex flex-col rounded-3xl bg-[#FFF0E4] text-[#170B16] border-2 border-[#D4AF75] shadow-[0_20px_60px_rgba(0,0,0,0.65)] overflow-hidden pointer-events-auto"
            >
              {/* Gold decorative header ribbon */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#D4AF75]/20 via-[#FFF0E4] to-[#D4AF75]/20 border-b border-[#D4AF75]/40 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs tracking-widest text-[#681C35] font-semibold uppercase">
                    A Personal Letter
                  </span>
                </div>
                <span className="text-xs text-[#681C35]/70 italic font-serif">
                  For your heart alone
                </span>
              </div>

              {/* Scrollable Letter Body */}
              <div
                ref={letterContainerRef}
                className="overflow-y-auto px-6 sm:px-10 py-8 space-y-5 selection:bg-[#E9A5B5] selection:text-[#170B16]"
              >
                {/* Salutation */}
                <h3 className="font-serif text-2xl sm:text-3xl text-[#681C35] font-normal italic">
                  {content.letter.salutation}
                </h3>

                {/* Paragraphs */}
                <div className="space-y-4 font-sans text-sm sm:text-base leading-relaxed text-[#2C1929] font-normal">
                  {content.letter.paragraphs.map((p, idx) => (
                    <motion.p
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 + idx * 0.1 }}
                    >
                      {p}
                    </motion.p>
                  ))}
                </div>

                {/* Signoff & Signature */}
                <div className="pt-6 border-t border-[#D4AF75]/30 flex flex-col items-start space-y-1">
                  <p className="font-serif italic text-base text-[#681C35]">
                    {content.letter.signoff}
                  </p>
                  <p className="font-handwriting text-3xl sm:text-4xl text-[#681C35] tracking-wide pt-1">
                    {content.letter.signature}
                  </p>
                </div>
              </div>

              {/* Footer Continue Action */}
              <div className="px-6 py-4 bg-[#FFF0E4] border-t border-[#D4AF75]/30 flex items-center justify-end">
                <button
                  onClick={nextScene}
                  className="group inline-flex items-center space-x-2.5 px-6 py-3 rounded-full bg-[#681C35] hover:bg-[#852144] text-[#FFF0E4] font-medium text-sm transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
                >
                  <span>{content.button}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF75] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-xs text-[#A995A6]/40 tracking-widest uppercase font-light">
        Every word was written with pride and sincere appreciation
      </div>
    </div>
  );
}
