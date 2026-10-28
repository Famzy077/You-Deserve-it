"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { X, Copy, Check, Share2, Heart } from "lucide-react";
import confetti from "canvas-confetti";

export function KeepsakeModal() {
  const { isKeepsakeOpen, setIsKeepsakeOpen } = useExperience();
  const [copied, setCopied] = useState(false);
  const [canShare] = useState<boolean>(() => {
    return typeof window !== "undefined" && typeof navigator.share === "function";
  });
  const card = defaultContent.scene6.reminderCard;

  useEffect(() => {
    if (isKeepsakeOpen) {
      // Gentle gold & rose petal confetti burst
      try {
        confetti({
          particleCount: 45,
          spread: 65,
          origin: { y: 0.6 },
          colors: ["#D4AF75", "#E9A5B5", "#FFF0E4", "#681C35"],
        });
      } catch {
        // Safe ignore
      }
    }
  }, [isKeepsakeOpen]);

  const keepsakeFullText = `🌸 ${card.title} 🌸\n\n${card.body}\n\n` +
    card.bullets.map((b) => `• ${b}`).join("\n") +
    `\n\n${card.closing}`;

  // WhatsApp-formatted message with bold markers and emojis for Status/Chat
  const whatsappStatusText = `🌸 *${card.title}* 🌸\n\n${card.body}\n\n` +
    card.bullets.map((b) => `✨ ${b}`).join("\n\n") +
    `\n\n*"${card.closing}"* 🌹\n— Sent with love from Oluwafemi ❤️`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(keepsakeFullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappStatusText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: keepsakeFullText,
          url: window.location.href,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  if (!isKeepsakeOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#170B16]/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#FFF0E4] text-[#170B16] border-2 border-[#D4AF75] shadow-[0_25px_70px_rgba(0,0,0,0.7)] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={() => setIsKeepsakeOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full text-[#681C35]/60 hover:text-[#681C35] hover:bg-[#681C35]/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
            aria-label="Close reminder modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <Heart className="w-4 h-4 text-[#681C35] fill-[#681C35]" />
            <span className="text-xs uppercase tracking-widest text-[#681C35] font-semibold">
              A Keepsake For Your Journey
            </span>
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-[#681C35] font-medium mb-1">
            {card.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#170B16]/75 mb-4 italic font-serif">
            {card.body}
          </p>

          {/* Bullets */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9F3] border border-[#D4AF75]/40 mb-5 space-y-2.5 max-h-[38vh] overflow-y-auto">
            {card.bullets.map((b, idx) => (
              <div key={idx} className="flex items-start space-x-2.5">
                <span className="text-[#D4AF75] font-bold text-sm leading-none mt-1">✦</span>
                <p className="text-xs sm:text-sm text-[#241321] leading-relaxed font-normal">
                  {b}
                </p>
              </div>
            ))}
          </div>

          {/* Closing quote */}
          <p className="text-xs sm:text-sm font-serif italic text-[#681C35] text-center mb-5">
            &ldquo;{card.closing}&rdquo;
          </p>

          {/* Sharing Actions */}
          <div className="flex flex-col space-y-2.5">
            {/* Primary Action: Share to WhatsApp Status / Chat */}
            <button
              onClick={handleWhatsAppShare}
              className="w-full inline-flex items-center justify-center space-x-2.5 py-3.5 px-5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] active:scale-[0.99] text-white font-medium text-sm transition-all shadow-[0_4px_14px_rgba(37,211,102,0.35)] focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            >
              {/* WhatsApp Icon */}
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.18 8.18 0 0 1-5.83 2.41c-1.47 0-2.91-.39-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.32a8.204 8.204 0 0 1-1.26-4.38c0-4.54 3.7-8.25 8.23-8.25zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z" />
              </svg>
              <span>Share to WhatsApp Status</span>
            </button>

            {/* Secondary Row: Copy Reminder & Native Share */}
            <div className="flex items-center space-x-2.5">
              <button
                onClick={handleCopy}
                className="flex-1 inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-full bg-[#681C35] hover:bg-[#852144] text-[#FFF0E4] font-medium text-xs sm:text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#D4AF75]" />
                    <span>Copied to clipboard ❤️</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#D4AF75]" />
                    <span>Copy reminder</span>
                  </>
                )}
              </button>

              {canShare && (
                <button
                  onClick={handleNativeShare}
                  className="inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-full border border-[#681C35]/30 hover:border-[#681C35] text-[#681C35] font-medium text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF75]"
                >
                  <Share2 className="w-4 h-4 text-[#681C35]" />
                  <span>More</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
