"use client";

import React, { useRef, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

interface InteractiveEnvelopeProps {
  isOpen: boolean;
  onOpen: () => void;
  position?: [number, number, number];
}

// 8-Point Celestial Guiding Star geometry with beveled faceted relief
function createFacetedStarGeometry(outerRadius: number, innerRadius: number, depth: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const numRays = 16;

  for (let i = 0; i <= numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2 - Math.PI / 2;
    // 4 major cardinal rays, 4 diagonal rays, 8 inner valleys
    const isCardinal = i % 4 === 0;
    const isDiagonal = i % 2 === 0 && !isCardinal;
    const r = isCardinal ? outerRadius : isDiagonal ? outerRadius * 0.74 : innerRadius;

    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;

    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  return new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
}

// Circular scalloped gold wax seal backing with embossed rim
function createSealMedallionGeometry(radius: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const segments = 48;

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    // Gentle scalloped petals on the rim of the medallion
    const scallop = 0.04 * Math.sin(theta * 12);
    const r = radius * (1 + scallop);
    const x = Math.cos(theta) * r;
    const y = Math.sin(theta) * r;

    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.025,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
}

// Top triangular flap with curved shoulders
function createTopFlapGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const halfWidth = 1.7;
  const apexY = -1.35;

  shape.moveTo(-halfWidth, 0);
  shape.lineTo(halfWidth, 0);
  // Curved right shoulder
  shape.bezierCurveTo(halfWidth * 0.95, -0.4, 0.45, apexY + 0.15, 0.08, apexY);
  // Rounded pointed apex
  shape.quadraticCurveTo(0, apexY - 0.05, -0.08, apexY);
  // Curved left shoulder
  shape.bezierCurveTo(-0.45, apexY + 0.15, -halfWidth * 0.95, -0.4, -halfWidth, 0);

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.015,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.008,
    bevelThickness: 0.008,
  });
}

// Bottom fold flap
function createBottomFoldGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const halfWidth = 1.7;
  const bottomY = -1.1;

  shape.moveTo(-halfWidth, bottomY);
  shape.lineTo(halfWidth, bottomY);
  shape.lineTo(halfWidth * 0.92, -0.3);
  shape.quadraticCurveTo(0, 0.22, -halfWidth * 0.92, -0.3);
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.012,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.006,
    bevelThickness: 0.006,
  });
}

// Left side diagonal flap
function createLeftFoldGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-1.7, -1.1);
  shape.lineTo(-1.7, 1.1);
  shape.lineTo(-0.1, 0.0);
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.01,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.005,
    bevelThickness: 0.005,
  });
}

// Right side diagonal flap
function createRightFoldGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(1.7, -1.1);
  shape.lineTo(1.7, 1.1);
  shape.lineTo(0.1, 0.0);
  shape.closePath();

  return new THREE.ExtrudeGeometry(shape, {
    depth: 0.01,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.005,
    bevelThickness: 0.005,
  });
}

export function InteractiveEnvelope({
  isOpen,
  onOpen,
  position = [0, 0, 0],
}: InteractiveEnvelopeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flapHingeRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Group>(null);
  const starSealRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);

  // Eye-Catching Warm Ivory & Alabaster Palette for maximum elegance and contrast
  const envelopeIvoryMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFF2E6"), // Luminous Warm Ivory / Pearl Alabaster
      roughness: 0.42,
      metalness: 0.05,
    });
  }, []);

  // Rich Velvet Burgundy interior lining visible when opened
  const envelopeLiningMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#681C35"), // Velvet Burgundy
      roughness: 0.6,
      metalness: 0.08,
    });
  }, []);

  // Champagne Gold foil trims along the flap edges
  const goldFoilTrimMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#D4AF75"), // Champagne Gold
      roughness: 0.25,
      metalness: 0.85,
    });
  }, []);

  // Radiant Champagne Gold for the Star Wax Seal
  const starGoldMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#FFE2A6"), // Gleaming warm gold
      roughness: 0.18,
      metalness: 0.92,
      emissive: new THREE.Color(hovered ? "#D4AF75" : "#A67C43"),
      emissiveIntensity: hovered ? 0.65 : 0.35,
    });
  }, [hovered]);

  const sealBackingMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#C59A56"), // Deep burnished gold base
      roughness: 0.3,
      metalness: 0.8,
    });
  }, []);

  // Lined parchment letter paper inside
  const linedPaperTexture = useMemo(() => {
    if (typeof document === "undefined") return new THREE.Texture();
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 360;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#FFF7EE";
      ctx.fillRect(0, 0, 512, 360);

      // Gold ruled lines
      ctx.strokeStyle = "rgba(212, 175, 117, 0.45)";
      ctx.lineWidth = 1.5;

      for (let y = 50; y < 340; y += 28) {
        ctx.beginPath();
        ctx.moveTo(35, y);
        ctx.lineTo(477, y);
        ctx.stroke();
      }

      // Small gold crest
      ctx.fillStyle = "#D4AF75";
      ctx.beginPath();
      ctx.arc(256, 30, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  const paperMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: linedPaperTexture,
      roughness: 0.55,
      metalness: 0.04,
    });
  }, [linedPaperTexture]);

  // Geometries
  const flapGeometry = useMemo(() => createTopFlapGeometry(), []);
  const bottomGeometry = useMemo(() => createBottomFoldGeometry(), []);
  const leftGeometry = useMemo(() => createLeftFoldGeometry(), []);
  const rightGeometry = useMemo(() => createRightFoldGeometry(), []);
  const sealBackingGeometry = useMemo(() => createSealMedallionGeometry(0.38), []);
  const starGeometry = useMemo(() => createFacetedStarGeometry(0.32, 0.11, 0.035), []);

  const { viewport } = useThree();

  // Responsive scale ensuring the envelope (width 3.4) fits with comfortable margins on any screen width
  const responsiveScale = useMemo(() => {
    const targetEnvelopeWidth = 3.4;
    // On narrow portrait screens, reserve ~22% total side margins
    const desiredWidth = viewport.width * 0.78;
    const computedScale = desiredWidth / targetEnvelopeWidth;
    // Cap at 1.05 for desktop and floor at 0.48 for narrow mobile
    return Math.min(1.05, Math.max(0.48, computedScale));
  }, [viewport.width]);

  // Animation interpolation targets
  const flapAngle = useRef(0);
  const letterY = useRef(0);
  const letterZ = useRef(0);
  const sealScale = useRef(1);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural floating greeting card slant
    const baseRotX = 0.08;
    const baseRotZ = -0.04;
    const hoverScale = (hovered && !isOpen ? 1.03 : 1.0) * responsiveScale;

    groupRef.current.position.y = position[1] + Math.sin(t * 1.4) * 0.03;
    groupRef.current.rotation.x = baseRotX;
    groupRef.current.rotation.z = baseRotZ;
    groupRef.current.rotation.y = Math.sin(t * 0.9) * 0.035 + (hovered && !isOpen ? 0.06 : 0);
    groupRef.current.scale.set(hoverScale, hoverScale, hoverScale);

    // Star seal breathing pulsation when unopened
    if (starSealRef.current && !isOpen) {
      const pulse = 1.0 + Math.sin(t * 3.0) * 0.06;
      starSealRef.current.scale.set(pulse, pulse, pulse);
      starSealRef.current.rotation.z = Math.sin(t * 0.8) * 0.08;
    }

    // Target animation values
    const targetFlap = isOpen ? -Math.PI * 0.98 : 0;
    const targetLetterY = isOpen ? 1.5 : 0.05;
    const targetLetterZ = isOpen ? 0.22 : -0.01;
    const targetSealScale = isOpen ? 0.001 : 1.0;

    flapAngle.current = THREE.MathUtils.lerp(flapAngle.current, targetFlap, delta * 3.8);
    letterY.current = THREE.MathUtils.lerp(letterY.current, targetLetterY, delta * 2.6);
    letterZ.current = THREE.MathUtils.lerp(letterZ.current, targetLetterZ, delta * 2.6);
    sealScale.current = THREE.MathUtils.lerp(sealScale.current, targetSealScale, delta * 5.0);

    if (flapHingeRef.current) {
      flapHingeRef.current.rotation.x = flapAngle.current;
    }
    if (letterRef.current) {
      letterRef.current.position.y = letterY.current;
      letterRef.current.position.z = letterZ.current;
    }
    if (starSealRef.current && isOpen) {
      starSealRef.current.scale.setScalar(sealScale.current);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (!isOpen) onOpen();
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (!isOpen) onOpen();
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={responsiveScale}
    >
      {/* 1. Back Plate (Interior Velvet Burgundy Lining) */}
      <mesh material={envelopeLiningMat} position={[0, 0, -0.02]}>
        <planeGeometry args={[3.4, 2.2]} />
      </mesh>

      {/* 2. Lined Stationery Parchment Paper (nestled inside) */}
      <group ref={letterRef} position={[0, 0.05, -0.01]}>
        <mesh material={paperMaterial} position={[0, 0, 0]} castShadow>
          <planeGeometry args={[3.08, 2.05]} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[1.5, 1.52, 4]} />
          <meshBasicMaterial color="#D4AF75" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 3. Left Fold Flap (Warm Ivory) */}
      <mesh
        geometry={leftGeometry}
        material={envelopeIvoryMat}
        position={[0, 0, 0.01]}
        receiveShadow
      />

      {/* 4. Right Fold Flap (Warm Ivory) */}
      <mesh
        geometry={rightGeometry}
        material={envelopeIvoryMat}
        position={[0, 0, 0.015]}
        receiveShadow
      />

      {/* 5. Bottom Fold Flap (Warm Ivory) */}
      <mesh
        geometry={bottomGeometry}
        material={envelopeIvoryMat}
        position={[0, 0, 0.025]}
        receiveShadow
        castShadow
      />

      {/* Subtle Gold Foil Seam Outline along the bottom flap edge */}
      <mesh material={goldFoilTrimMat} position={[0, -0.3, 0.027]} scale={[1.4, 0.02, 1]}>
        <planeGeometry args={[2, 0.5]} />
      </mesh>

      {/* 6. Top Flap with Hinge at y = 1.1 (folds down over bottom flap) */}
      <group ref={flapHingeRef} position={[0, 1.1, 0.035]}>
        {/* Exterior Warm Ivory Triangular Flap */}
        <mesh
          geometry={flapGeometry}
          material={envelopeIvoryMat}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        />

        {/* Interior Velvet Burgundy underside of flap (visible when flipped open) */}
        <mesh
          geometry={flapGeometry}
          material={envelopeLiningMat}
          position={[0, 0, -0.005]}
          rotation={[0, Math.PI, 0]}
        />

        {/* 7. Center Celestial Star Wax Seal (Right in the middle of the envelope apex) */}
        <group
          ref={starSealRef}
          position={[0, -1.35, 0.05]}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOpen) onOpen();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            if (!isOpen) onOpen();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Base Circular Gold Medallion Backing */}
          <mesh geometry={sealBackingGeometry} material={sealBackingMat} castShadow receiveShadow />

          {/* Raised Beaded Gold Ring around star */}
          <mesh position={[0, 0, 0.032]}>
            <ringGeometry args={[0.26, 0.31, 32]} />
            <meshStandardMaterial color="#D4AF75" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* 8-Point Faceted Celestial Gold Star */}
          <mesh
            geometry={starGeometry}
            material={starGoldMat}
            position={[0, 0, 0.035]}
            castShadow
            receiveShadow
          />

          {/* Central Gem Core / Star Point Light */}
          <pointLight
            position={[0, 0, 0.25]}
            color="#FFE6B0"
            intensity={hovered ? 2.8 : 1.8}
            distance={2.5}
            decay={2}
          />
        </group>
      </group>

      {/* Focused Cinematic Key Lighting on the Envelope & Star */}
      <pointLight
        position={[1.5, 2.2, 2.8]}
        color="#FFF0E4"
        intensity={hovered ? 3.2 : 2.5}
        distance={6}
        decay={2}
      />
      <pointLight
        position={[-2.0, -0.5, 2.0]}
        color="#D4AF75"
        intensity={1.5}
        distance={5}
        decay={2}
      />
    </group>
  );
}
