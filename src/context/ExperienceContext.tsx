"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { ambientSound } from "@/lib/audio";

export type SceneNumber = 1 | 2 | 3 | 4 | 5 | 6;

interface ExperienceContextType {
  scene: SceneNumber;
  setScene: (scene: SceneNumber) => void;
  nextScene: () => void;
  prevScene: () => void;
  restartExperience: () => void;

  // Scene 3 Tribute state
  activeTributeId: string | null;
  setActiveTributeId: (id: string | null) => void;
  discoveredTributes: string[];
  markTributeDiscovered: (id: string) => void;

  // Scene 4 Envelope state
  isEnvelopeOpen: boolean;
  openEnvelope: () => void;

  // Audio state
  isAudioPlaying: boolean;
  toggleAudio: () => void;
  startAudio: () => void;

  // Accessibility & Preferences
  isReducedMotion: boolean;
  toggleReducedMotion: () => void;

  // Scene 6 Keepsake modal
  isKeepsakeOpen: boolean;
  setIsKeepsakeOpen: (open: boolean) => void;

  // Pointer position for subtle parallax
  pointer: { x: number; y: number };
}

const ExperienceContext = createContext<ExperienceContextType | null>(null);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const [scene, setSceneState] = useState<SceneNumber>(1);
  const [activeTributeId, setActiveTributeId] = useState<string | null>(null);
  const [discoveredTributes, setDiscoveredTributes] = useState<string[]>([]);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  // Default audio to active as requested
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(true);
  const [isKeepsakeOpen, setIsKeepsakeOpen] = useState<boolean>(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const hasUserMuted = useRef(false);

  // Initialize preference lazily without triggering synchronous setState in effect
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Attempt autoplay immediately and attach gesture handler for browsers that require user gesture
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Try immediate start
    ambientSound.start().then((started) => {
      if (started) {
        setIsAudioPlaying(true);
      }
    });

    // 2. Fallback on first gesture anywhere on the screen
    const handleFirstGesture = () => {
      if (!hasUserMuted.current) {
        ambientSound.start();
        setIsAudioPlaying(true);
      }
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });
    window.addEventListener("click", handleFirstGesture, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
  }, []);

  // Subscribe to media query changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Subtle pointer parallax listener
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Normalize from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setPointer({ x, y });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const setScene = useCallback((targetScene: SceneNumber) => {
    setSceneState(targetScene);
  }, []);

  const nextScene = useCallback(() => {
    setSceneState((prev) => {
      if (prev < 6) return (prev + 1) as SceneNumber;
      return prev;
    });
  }, []);

  const prevScene = useCallback(() => {
    setSceneState((prev) => {
      if (prev > 1) return (prev - 1) as SceneNumber;
      return prev;
    });
  }, []);

  const restartExperience = useCallback(() => {
    setSceneState(1);
    setActiveTributeId(null);
    setIsEnvelopeOpen(false);
    setIsKeepsakeOpen(false);
  }, []);

  const markTributeDiscovered = useCallback((id: string) => {
    setDiscoveredTributes((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const openEnvelope = useCallback(() => {
    setIsEnvelopeOpen(true);
  }, []);

  const startAudio = useCallback(() => {
    hasUserMuted.current = false;
    ambientSound.start();
    setIsAudioPlaying(true);
  }, []);

  const toggleAudio = useCallback(() => {
    if (ambientSound.getStatus()) {
      hasUserMuted.current = true;
      ambientSound.stop();
      setIsAudioPlaying(false);
    } else {
      hasUserMuted.current = false;
      ambientSound.start();
      setIsAudioPlaying(true);
    }
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setIsReducedMotion((prev) => !prev);
  }, []);

  return (
    <ExperienceContext.Provider
      value={{
        scene,
        setScene,
        nextScene,
        prevScene,
        restartExperience,
        activeTributeId,
        setActiveTributeId,
        discoveredTributes,
        markTributeDiscovered,
        isEnvelopeOpen,
        openEnvelope,
        isAudioPlaying,
        toggleAudio,
        startAudio,
        isReducedMotion,
        toggleReducedMotion,
        isKeepsakeOpen,
        setIsKeepsakeOpen,
        pointer,
      }}
    >
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within an ExperienceProvider");
  }
  return context;
}
