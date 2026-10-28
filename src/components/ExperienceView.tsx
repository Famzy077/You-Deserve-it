"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useExperience } from "@/context/ExperienceContext";
import { HeaderControls } from "./ui/HeaderControls";
import { Scene1Invitation } from "./scenes/Scene1Invitation";
import { Scene2Flowers } from "./scenes/Scene2Flowers";
import { Scene3TributeGarden } from "./scenes/Scene3TributeGarden";
import { Scene4Letter } from "./scenes/Scene4Letter";
import { Scene5NewSeason } from "./scenes/Scene5NewSeason";
import { Scene6FinalMessage } from "./scenes/Scene6FinalMessage";
import { KeepsakeModal } from "./scenes/KeepsakeModal";
import { AnimatePresence, motion } from "framer-motion";

// Dynamically import SceneCanvas with SSR disabled to ensure WebGL context initializes cleanly on client
const SceneCanvas = dynamic(
  () => import("./canvas/SceneCanvas").then((mod) => mod.SceneCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-[#170B16] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#D4AF75]/30 border-t-[#D4AF75] animate-spin" />
      </div>
    ),
  }
);

export function ExperienceView() {
  const { scene, nextScene, prevScene } = useExperience();

  // Keyboard navigation support (ArrowRight / ArrowLeft / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "ArrowRight") {
        nextScene();
      } else if (e.key === "ArrowLeft") {
        prevScene();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextScene, prevScene]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#170B16] select-none">
      {/* Subtle Film Grain Overlay */}
      <div className="film-grain" />

      {/* Atmospheric Ambient Gradient Glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-transparent via-[#170B16]/40 to-[#170B16] z-10" />

      {/* 3D WebGL Canvas Layer */}
      <SceneCanvas />

      {/* Top Controls Header */}
      <HeaderControls />

      {/* Dynamic Scene Overlay Layer */}
      <div className="relative z-30 w-full h-full flex flex-col pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`scene-${scene}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full mt-10 h-full pointer-events-none"
          >
            {scene === 1 && <Scene1Invitation />}
            {scene === 2 && <Scene2Flowers />}
            {scene === 3 && <Scene3TributeGarden />}
            {scene === 4 && <Scene4Letter />}
            {scene === 5 && <Scene5NewSeason />}
            {scene === 6 && <Scene6FinalMessage />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Keepsake Reminder Modal */}
      <KeepsakeModal />
    </main>
  );
}
