"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface GoldParticlesProps {
  count?: number;
  spread?: number;
  speed?: number;
  rising?: boolean;
}

// Pure deterministic pseudo-random generator to satisfy React 19 compiler purity requirements
function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999.123) * 10000;
  return x - Math.floor(x);
}

export function GoldParticles({
  count = 280,
  spread = 8,
  speed = 1,
  rising = true,
}: GoldParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions, deterministic velocities, and twinkling phases
  const [positions, phases, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phs = new Float32Array(count);
    const scls = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (pseudoRandom(i * 3 + 1) - 0.5) * spread;
      pos[i * 3 + 1] = (pseudoRandom(i * 3 + 2) - 0.5) * spread * 0.8;
      pos[i * 3 + 2] = (pseudoRandom(i * 3 + 3) - 0.5) * spread;

      phs[i] = pseudoRandom(i * 7 + 4) * Math.PI * 2;
      scls[i] = pseudoRandom(i * 11 + 5) * 0.7 + 0.3;
    }

    return [pos, phs, scls];
  }, [count, spread]);

  // Create soft round circular gold particle texture
  const particleTexture = useMemo(() => {
    if (typeof document === "undefined") return new THREE.Texture();
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      gradient.addColorStop(0, "rgba(255, 240, 228, 1)"); // Warm ivory core
      gradient.addColorStop(0.3, "rgba(212, 175, 117, 0.85)"); // Champagne gold
      gradient.addColorStop(0.7, "rgba(104, 28, 53, 0.3)"); // Velvet burgundy glow
      gradient.addColorStop(1, "rgba(23, 11, 22, 0)"); // Transparent edge
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.getAttribute("position") as THREE.BufferAttribute;
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      // Subtle swirling motion
      posAttr.array[i3 + 0] += Math.sin(time * 0.5 * speed + phase) * 0.003;
      posAttr.array[i3 + 2] += Math.cos(time * 0.4 * speed + phase) * 0.003;

      if (rising) {
        // Particles drift gently upwards
        posAttr.array[i3 + 1] += (0.004 + scales[i] * 0.004) * speed;
        // Wrap around when rising above bounds
        if (posAttr.array[i3 + 1] > spread * 0.5) {
          posAttr.array[i3 + 1] = -spread * 0.4;
        }
      } else {
        // Gentle oscillation
        posAttr.array[i3 + 1] += Math.sin(time * 0.7 * speed + phase) * 0.002;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        map={particleTexture}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
