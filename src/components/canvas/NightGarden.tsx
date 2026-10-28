"use client";

import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Rose } from "./Rose";
import { TributeElement } from "@/config/content";

interface NightGardenProps {
  tributes: TributeElement[];
  activeTributeId: string | null;
  onSelectTribute: (id: string) => void;
  discoveredTributes: string[];
  sunriseProgress: number; // 0 (night) to 1 (full golden sunrise)
}

export function NightGarden({
  tributes,
  activeTributeId,
  onSelectTribute,
  discoveredTributes,
  sunriseProgress = 0,
}: NightGardenProps) {
  const gardenRef = useRef<THREE.Group>(null);

  // Positions for the three tribute flowers
  const flowerPositions: [number, number, number][] = [
    [-2.2, -0.2, 0.4], // Effort (Left)
    [0.0, 0.1, 0.7],    // Strength (Center)
    [2.2, -0.2, 0.4],  // Worth (Right)
  ];

  useFrame((state) => {
    if (!gardenRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle gentle sway of entire garden
    gardenRef.current.position.y = Math.sin(t * 0.6) * 0.02;
  });

  return (
    <group ref={gardenRef}>
      {/* 3 Main Interactive Tribute Flowers */}
      {tributes.map((tribute, idx) => {
        const isSelected = activeTributeId === tribute.id;
        const isDiscovered = discoveredTributes.includes(tribute.id);
        const pos = flowerPositions[idx] || [0, 0, 0];

        // If discovered or selected or sunrise, blooms open
        const bloom = isSelected ? 0.95 : isDiscovered ? 0.75 : 0.25 + sunriseProgress * 0.7;

        return (
          <group
            key={tribute.id}
            position={pos}
            onClick={(e) => {
              e.stopPropagation();
              onSelectTribute(tribute.id);
            }}
          >
            {/* The 3D Rose */}
            <Rose
              bloomProgress={bloom}
              scale={isSelected ? 1.05 : 0.88}
              tint={tribute.color}
              glow={isSelected || isDiscovered}
            />

            {/* Glowing Ground Pedestal / Light disc underneath */}
            <mesh position={[0, -1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.8, 32]} />
              <meshBasicMaterial
                color={tribute.color}
                transparent
                opacity={isSelected ? 0.45 : isDiscovered ? 0.25 : 0.1}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing orb in center when clicked */}
            {isSelected && (
              <pointLight
                position={[0, 0.4, 0]}
                color={tribute.color}
                intensity={2.0}
                distance={3.5}
                decay={2}
              />
            )}
          </group>
        );
      })}

      {/* Surrounding background garden blooms (adds lush cinematic depth) */}
      {[
        [-3.6, -0.6, -1.2],
        [-1.4, -0.8, -1.6],
        [1.4, -0.8, -1.6],
        [3.6, -0.6, -1.2],
        [-0.8, -1.0, -2.5],
        [0.8, -1.0, -2.5],
      ].map((bgPos, i) => (
        <group key={`bg-bloom-${i}`} position={bgPos as [number, number, number]} scale={0.55}>
          <Rose
            bloomProgress={0.4 + sunriseProgress * 0.55}
            tint={i % 2 === 0 ? "#681C35" : "#E9A5B5"}
            scale={0.65}
          />
        </group>
      ))}

      {/* Ground Mist / Subtle glowing plane */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          color={new THREE.Color("#170B16").lerp(new THREE.Color("#4A1526"), sunriseProgress * 0.7)}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}
