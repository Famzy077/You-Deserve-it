"use client";

import React from "react";
import { useExperience, SceneNumber } from "@/context/ExperienceContext";
import { Volume2, VolumeX, Wind, Lens } from "lucide-react";

export function HeaderControls() {
  const {
    scene,
    setScene,
    isAudioPlaying,
    toggleAudio,
    isReducedMotion,
    toggleReducedMotion,
  } = useExperience();

  const scenesList: SceneNumber[] = [1, 2, 3, 4, 5, 6];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8 md:py-6 flex items-center justify-between pointer-events-none">
      {/* Brand / Title Indicator */}
      <div className="flex items-center space-x-3 pointer-events-auto">
        <div className="w-8 h-8 rounded-full border border-[#D4AF75]/40 flex items-center justify-center bg-[#170B16]/60 backdrop-blur-md">
          <span className="text-[#D4AF75] text-xs font-serif font-semibold">🌹</span>
        </div>
        <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF75]/80 font-medium hidden sm:inline-block">
          You Deserve Your Flowers
        </span>
      </div>

      {/* Center Scene Navigation Dots */}
      <nav aria-label="Experience scenes" className="pointer-events-auto flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#170B16]/60 backdrop-blur-md border border-[#D4AF75]/20">
        {scenesList.map((s) => (
          <button
            key={s}
            onClick={() => setScene(s)}
            aria-label={`Jump to scene ${s}`}
            aria-current={scene === s ? "step" : undefined}
            className={`transition-all duration-300 rounded-full ${
              scene === s
                ? "w-6 h-2 bg-[#D4AF75] shadow-[0_0_8px_rgba(212,175,117,0.8)]"
                : "w-2 h-2 bg-[#D4AF75]/30 hover:bg-[#D4AF75]/60"
            }`}
          />
        ))}
      </nav>

      {/* Right Controls: Audio & Reduced Motion */}
      <div className="flex items-center space-x-2 pointer-events-auto">
        {/* Reduced Motion Toggle */}
        <button
          onClick={toggleReducedMotion}
          title={isReducedMotion ? "Enable smooth motion" : "Reduce motion"}
          aria-label={isReducedMotion ? "Enable smooth motion" : "Reduce motion"}
          className={`p-2.5 rounded-full transition-all duration-200 border ${
            isReducedMotion
              ? "bg-[#D4AF75]/20 border-[#D4AF75] text-[#D4AF75]"
              : "bg-[#170B16]/60 border-[#D4AF75]/20 text-[#FFF0E4]/70 hover:text-[#D4AF75] hover:border-[#D4AF75]/50"
          } backdrop-blur-md`}
        >
          {isReducedMotion ? <Wind className="w-4 h-4" /> : <Lens className="w-4 h-4" />}
        </button>

        {/* Ambient Sound Toggle */}
        <button
          onClick={toggleAudio}
          title={isAudioPlaying ? "Mute ambient music" : "Play ambient music"}
          aria-label={isAudioPlaying ? "Mute ambient music" : "Play ambient music"}
          className={`px-3 py-2 rounded-full flex items-center space-x-2 transition-all duration-200 border ${
            isAudioPlaying
              ? "bg-[#681C35]/50 border-[#D4AF75] text-[#D4AF75] shadow-[0_0_12px_rgba(212,175,117,0.3)]"
              : "bg-[#170B16]/60 border-[#D4AF75]/20 text-[#FFF0E4]/70 hover:text-[#D4AF75] hover:border-[#D4AF75]/50"
          } backdrop-blur-md`}
        >
          {isAudioPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-[#D4AF75] animate-pulse" />
              <span className="text-xs text-[#D4AF75] font-medium hidden md:inline">Music on</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="text-xs text-[#A995A6] font-medium hidden md:inline">Sound</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
