"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/context/ExperienceContext";
import { defaultContent } from "@/config/content";
import { Rose } from "./Rose";
import { GoldParticles } from "./GoldParticles";
import { InteractiveEnvelope } from "./InteractiveEnvelope";
import { NightGarden } from "./NightGarden";

// Camera and Lighting Choreographer
function CameraRig() {
  const { scene, activeTributeId, isEnvelopeOpen, pointer, isReducedMotion } = useExperience();

  // Target camera position and lookAt vector memoized
  const targetPos = useMemo(() => new THREE.Vector3(0, 0, 5.5), []);
  const targetLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame((state, delta) => {
    const aspect = state.viewport.aspect;
    const isMobile = aspect < 0.85;

    // Determine target composition based on current scene
    if (scene === 1) {
      targetPos.set(0, 0, isMobile ? 5.8 : 5.2);
      targetLook.set(0, 0, 0);
    } else if (scene === 2) {
      targetPos.set(0, -0.1, isMobile ? 3.9 : 3.4);
      targetLook.set(0, 0.15, 0);
    } else if (scene === 3) {
      if (activeTributeId === "effort") {
        targetPos.set(isMobile ? -1.0 : -1.4, 0.2, isMobile ? 3.8 : 3.2);
        targetLook.set(-2.2, -0.2, 0.4);
      } else if (activeTributeId === "strength") {
        targetPos.set(0, 0.35, isMobile ? 3.5 : 3.0);
        targetLook.set(0, 0.1, 0.7);
      } else if (activeTributeId === "worth") {
        targetPos.set(isMobile ? 1.0 : 1.4, 0.2, isMobile ? 3.8 : 3.2);
        targetLook.set(2.2, -0.2, 0.4);
      } else {
        targetPos.set(0, 0.6, isMobile ? 7.2 : 5.8);
        targetLook.set(0, 0.1, 0);
      }
    } else if (scene === 4) {
      targetPos.set(0, isMobile ? 0.05 : 0, isMobile ? 4.1 : 3.6);
      targetLook.set(0, isEnvelopeOpen ? (isMobile ? 0.25 : 0.35) : (isMobile ? -0.05 : 0), 0);
    } else if (scene === 5) {
      targetPos.set(0, 0.7, isMobile ? 5.6 : 4.8);
      targetLook.set(0, 0.25, 0);
    } else if (scene === 6) {
      targetPos.set(0, 0.2, isMobile ? 4.2 : 3.5);
      targetLook.set(0, 0.2, 0);
    }

    // Add subtle pointer parallax if reduced motion is disabled
    const parallaxX = isReducedMotion ? 0 : pointer.x * 0.2;
    const parallaxY = isReducedMotion ? 0 : pointer.y * 0.15;

    // Smooth lerp camera position
    const lerpSpeed = isReducedMotion ? delta * 5.0 : delta * 2.5;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetPos.x + parallaxX, lerpSpeed);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetPos.y + parallaxY, lerpSpeed);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetPos.z, lerpSpeed);

    currentLook.lerp(targetLook, lerpSpeed);
    state.camera.lookAt(currentLook);
  });

  return null;
}

// Dynamic lighting that responds to night vs golden sunrise
function DynamicLighting({ sunriseProgress }: { sunriseProgress: number }) {
  const ambientLightRef = useRef<THREE.AmbientLight>(null);
  const sunLightRef = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    if (ambientLightRef.current && sunLightRef.current) {
      // Interpolate ambient color from deep plum to warm champagne morning
      const nightAmbient = new THREE.Color("#240F22");
      const morningAmbient = new THREE.Color("#FCEFD8");
      const currentAmbient = nightAmbient.clone().lerp(morningAmbient, sunriseProgress);

      ambientLightRef.current.color = currentAmbient;
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(0.8, 1.4, sunriseProgress);

      // Sun light intensity
      sunLightRef.current.intensity = THREE.MathUtils.lerp(1.2, 2.4, sunriseProgress);
      sunLightRef.current.color = new THREE.Color("#FFF2DD").lerp(new THREE.Color("#FFD9A3"), sunriseProgress);
    }
  });

  return (
    <>
      <ambientLight ref={ambientLightRef} />
      {/* Key Directional Rim Light */}
      <directionalLight
        ref={sunLightRef}
        position={[3, 5, 4]}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Soft Velvet Fill Light */}
      <pointLight position={[-3, -1, 2]} color="#681C35" intensity={1.2} distance={8} />
      {/* Golden Rim Backlight */}
      <pointLight position={[0, 3, -3]} color="#D4AF75" intensity={1.5} distance={10} />
    </>
  );
}

// 3D Scene Content
function SceneContent() {
  const {
    scene,
    activeTributeId,
    setActiveTributeId,
    discoveredTributes,
    markTributeDiscovered,
    isEnvelopeOpen,
    openEnvelope,
  } = useExperience();

  // Pure declarative derived sunrise progress (no effect needed)
  const sunriseVal = scene === 6 ? 1.0 : scene === 5 ? 0.7 : 0;

  // Handle tribute selection
  const handleSelectTribute = (id: string) => {
    setActiveTributeId(id);
    markTributeDiscovered(id);
  };

  return (
    <>
      <CameraRig />
      <DynamicLighting sunriseProgress={sunriseVal} />

      {/* Floating Gold Particles (persist across all scenes with graceful variation) */}
      <GoldParticles
        count={scene >= 5 ? 420 : 260}
        spread={10}
        speed={scene === 2 || scene === 5 ? 1.4 : 0.8}
        rising={true}
      />

      {/* Scene 1 & 2: Center Solitary Rose */}
      {(scene === 1 || scene === 2) && (
        <Rose
          bloomProgress={scene === 1 ? 0.08 : 0.88}
          scale={1.15}
          tint="#681C35"
          glow={scene === 2}
        />
      )}

      {/* Scene 3: Night Garden with 3 Tribute Flowers */}
      {scene === 3 && (
        <NightGarden
          tributes={defaultContent.scene3.elements}
          activeTributeId={activeTributeId}
          onSelectTribute={handleSelectTribute}
          discoveredTributes={discoveredTributes}
          sunriseProgress={0}
        />
      )}

      {/* Scene 4: Interactive 3D Envelope */}
      {scene === 4 && (
        <InteractiveEnvelope
          isOpen={isEnvelopeOpen}
          onOpen={openEnvelope}
          position={[0, 0, 0]}
        />
      )}

      {/* Scene 5 & 6: Sunrise Golden Rose Garden */}
      {(scene === 5 || scene === 6) && (
        <group>
          {/* Main Glorious Golden Morning Rose */}
          <Rose
            bloomProgress={1.0}
            scale={1.2}
            tint="#852144"
            glow={true}
            position={[0, 0, 0]}
          />
          {/* Garden surrounding in sunrise bloom */}
          <NightGarden
            tributes={defaultContent.scene3.elements}
            activeTributeId={null}
            onSelectTribute={() => {}}
            discoveredTributes={["effort", "strength", "worth"]}
            sunriseProgress={sunriseVal}
          />
        </group>
      )}
    </>
  );
}

// Fallback visual component if WebGL is unavailable or fails
function WebGLFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Animated gradient mesh simulating the plum & burgundy 3D atmosphere */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#681C35]/30 via-[#D4AF75]/15 to-transparent blur-3xl animate-pulse" />
      <div className="relative z-10 flex flex-col items-center">
        {/* Stylized CSS 3D blooming rose emblem */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#D4AF75]/30 animate-spin" style={{ animationDuration: "25s" }} />
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#681C35] via-[#E9A5B5] to-[#D4AF75] shadow-[0_0_50px_rgba(212,175,117,0.3)] animate-bounce" style={{ animationDuration: "6s" }} />
          <span className="text-4xl absolute">🌹</span>
        </div>
      </div>
    </div>
  );
}

export function SceneCanvas() {
  const [hasWebGL] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    try {
      const canvas = document.createElement("canvas");
      return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
      return false;
    }
  });

  if (hasWebGL === false) {
    return <WebGLFallback />;
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45, near: 0.1, far: 50 }}
        dpr={[1, Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2)]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
