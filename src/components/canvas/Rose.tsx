"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface RoseProps {
  bloomProgress?: number; // 0 (bud) to 1 (full bloom)
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  tint?: string;
  glow?: boolean;
}

// Function to generate a curved, organic rose petal buffer geometry
function createPetalGeometry(width: number, length: number, cupDepth: number, tipCurl: number): THREE.BufferGeometry {
  const segmentsU = 16;
  const segmentsV = 20;
  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iv = 0; iv <= segmentsV; iv++) {
    const v = iv / segmentsV; // 0 (base) to 1 (tip)

    // Leaf profile width profile: narrow base, wide middle, tapering soft rounded tip
    const widthFactor = Math.sin(Math.pow(v, 0.7) * Math.PI) * (1 - 0.15 * Math.pow(v, 2));

    for (let iu = 0; iu <= segmentsU; iu++) {
      const u = (iu / segmentsU) * 2 - 1; // -1 to 1

      const x = u * (width * 0.5) * widthFactor;
      const y = v * length;

      // Cup curvature across width: parabolic curve inwards
      const cup = -Math.pow(u, 2) * cupDepth * widthFactor;

      // Longitudinal arch curve
      const arch = Math.sin(v * Math.PI) * (cupDepth * 0.4);

      // Tip curling backward when open
      let curl = 0;
      if (v > 0.65) {
        const curlProgress = (v - 0.65) / 0.35;
        curl = Math.pow(curlProgress, 2) * tipCurl;
      }

      const z = cup + arch + curl;

      vertices.push(x, y, z);
      uvs.push(iu / segmentsU, v);
    }
  }

  // Create triangular face indices
  for (let iv = 0; iv < segmentsV; iv++) {
    for (let iu = 0; iu < segmentsU; iu++) {
      const a = iv * (segmentsU + 1) + iu;
      const b = (iv + 1) * (segmentsU + 1) + iu;
      const c = (iv + 1) * (segmentsU + 1) + (iu + 1);
      const d = iv * (segmentsU + 1) + (iu + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

interface PetalConfig {
  whorl: number; // 0 (inner) to 4 (outer)
  angle: number; // azimuth rotation
  radius: number; // distance from center
  baseY: number; // height offset
  tiltClosed: number; // tilt angle when closed (rad)
  tiltOpen: number; // tilt angle when bloomed (rad)
  width: number;
  length: number;
  cupDepth: number;
  tipCurl: number;
  colorMix: number; // color variance
}

export function Rose({
  bloomProgress = 0,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  tint = "#681C35",
  glow = false,
}: RoseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);

  // Generate petal specifications across 5 whorls for natural organic spiraling
  const petalsData = useMemo(() => {
    const list: PetalConfig[] = [];
    const goldenAngle = 2.39996; // ~137.5 degrees

    // Whorl 0: Inner tight core bud (5 petals)
    for (let i = 0; i < 5; i++) {
      const angle = i * goldenAngle;
      list.push({
        whorl: 0,
        angle,
        radius: 0.05,
        baseY: 0.05,
        tiltClosed: 0.12,
        tiltOpen: 0.35,
        width: 0.45,
        length: 0.7,
        cupDepth: 0.18,
        tipCurl: 0.05,
        colorMix: 0.1,
      });
    }

    // Whorl 1: Middle-inner (6 petals)
    for (let i = 0; i < 6; i++) {
      const angle = (i + 0.3) * goldenAngle;
      list.push({
        whorl: 1,
        angle,
        radius: 0.12,
        baseY: 0.02,
        tiltClosed: 0.22,
        tiltOpen: 0.55,
        width: 0.65,
        length: 0.85,
        cupDepth: 0.25,
        tipCurl: 0.1,
        colorMix: 0.3,
      });
    }

    // Whorl 2: Mid bloom (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = (i + 0.6) * goldenAngle;
      list.push({
        whorl: 2,
        angle,
        radius: 0.22,
        baseY: -0.02,
        tiltClosed: 0.35,
        tiltOpen: 0.85,
        width: 0.85,
        length: 1.0,
        cupDepth: 0.32,
        tipCurl: 0.22,
        colorMix: 0.5,
      });
    }

    // Whorl 3: Outer petals (10 petals)
    for (let i = 0; i < 10; i++) {
      const angle = (i + 0.9) * goldenAngle;
      list.push({
        whorl: 3,
        angle,
        radius: 0.35,
        baseY: -0.06,
        tiltClosed: 0.48,
        tiltOpen: 1.15,
        width: 1.05,
        length: 1.15,
        cupDepth: 0.38,
        tipCurl: 0.35,
        colorMix: 0.7,
      });
    }

    // Whorl 4: Mature guard petals (8 petals)
    for (let i = 0; i < 8; i++) {
      const angle = (i + 0.4) * goldenAngle;
      list.push({
        whorl: 4,
        angle,
        radius: 0.48,
        baseY: -0.1,
        tiltClosed: 0.58,
        tiltOpen: 1.35,
        width: 1.25,
        length: 1.25,
        cupDepth: 0.42,
        tipCurl: 0.48,
        colorMix: 0.9,
      });
    }

    return list;
  }, []);

  // Pre-generate petal geometries for each whorl
  const petalGeometries = useMemo(() => {
    return [
      createPetalGeometry(0.45, 0.7, 0.18, 0.05),
      createPetalGeometry(0.65, 0.85, 0.25, 0.1),
      createPetalGeometry(0.85, 1.0, 0.32, 0.22),
      createPetalGeometry(1.05, 1.15, 0.38, 0.35),
      createPetalGeometry(1.25, 1.25, 0.42, 0.48),
    ];
  }, []);

  // Shared velvet materials with color gradient variations
  const materials = useMemo(() => {
    const baseColor = new THREE.Color(tint);
    const blushColor = new THREE.Color("#E9A5B5");
    const goldColor = new THREE.Color("#D4AF75");

    return petalGeometries.map((_, whorlIdx) => {
      // Lerp color: inner whorls are richer burgundy, outer whorls catch more blush/gold
      const mixRatio = whorlIdx / 4;
      const petalColor = baseColor.clone().lerp(blushColor, mixRatio * 0.45);

      return new THREE.MeshPhysicalMaterial({
        color: petalColor,
        roughness: 0.36,
        metalness: 0.08,
        clearcoat: 0.28,
        clearcoatRoughness: 0.22,
        sheen: 1.0,
        sheenColor: blushColor,
        sheenRoughness: 0.35,
        emissive: glow ? goldColor : new THREE.Color("#250818"),
        emissiveIntensity: glow ? 0.35 : 0.08,
        side: THREE.DoubleSide,
      });
    });
  }, [tint, glow, petalGeometries]);

  // Stem geometry & sepals
  const { stemGeometry, sepalGeometry, stemMaterial } = useMemo(() => {
    // Gentle S-curved stem
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.05, 0),
      new THREE.Vector3(0.04, -0.7, 0.03),
      new THREE.Vector3(-0.03, -1.5, -0.02),
      new THREE.Vector3(0.02, -2.4, 0.04),
    ]);
    const stemGeom = new THREE.TubeGeometry(curve, 32, 0.045, 12, false);

    // Sepal leaf (star at the base of petals)
    const sepalGeom = createPetalGeometry(0.22, 0.65, 0.1, 0.25);

    const stemMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#1C3820"),
      roughness: 0.55,
      metalness: 0.1,
    });

    return { stemGeometry: stemGeom, sepalGeometry: sepalGeom, stemMaterial: stemMat };
  }, []);

  // Subtle breathing animation
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle breathing drift
    groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.04;
    groupRef.current.rotation.y = rotation[1] + Math.sin(t * 0.4) * 0.05;
    groupRef.current.rotation.z = rotation[2] + Math.cos(t * 0.5) * 0.03;
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* Flower Petals */}
      <group ref={petalsRef}>
        {petalsData.map((p, idx) => {
          // Calculate interpolated tilt and position based on bloomProgress
          const currentTilt = THREE.MathUtils.lerp(p.tiltClosed, p.tiltOpen, bloomProgress);
          const currentRadius = p.radius * (1 + bloomProgress * 0.8);

          // Position around circle
          const px = Math.cos(p.angle) * currentRadius;
          const pz = Math.sin(p.angle) * currentRadius;

          return (
            <group
              key={idx}
              position={[px, p.baseY, pz]}
              rotation={[0, -p.angle + Math.PI / 2, 0]}
            >
              {/* Petal tilted on its base hinge */}
              <mesh
                geometry={petalGeometries[p.whorl]}
                material={materials[p.whorl]}
                rotation={[currentTilt, 0, (Math.sin(idx * 2.3) - 0.5) * 0.08]}
                castShadow
                receiveShadow
              />
            </group>
          );
        })}
      </group>

      {/* Sepals (5 calyx leaves under the bud) */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i * Math.PI * 2) / 5;
        const sepalTilt = THREE.MathUtils.lerp(0.8, 1.45, bloomProgress);
        return (
          <group
            key={`sepal-${i}`}
            position={[Math.cos(angle) * 0.12, -0.06, Math.sin(angle) * 0.12]}
            rotation={[0, -angle + Math.PI / 2, 0]}
          >
            <mesh
              geometry={sepalGeometry}
              material={stemMaterial}
              rotation={[-sepalTilt, 0, 0]}
              scale={0.8}
            />
          </group>
        );
      })}

      {/* Stem */}
      <mesh geometry={stemGeometry} material={stemMaterial} castShadow />

      {/* Subtle core warm light when blooming or glowing */}
      <pointLight
        position={[0, 0.2, 0]}
        color={glow ? "#D4AF75" : "#E9A5B5"}
        intensity={0.6 + bloomProgress * 1.2}
        distance={2.5}
        decay={2}
      />
    </group>
  );
}
