"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBirthdayCakeProps {
  isBlown: boolean;
  isBlowing?: boolean;
  recipientName?: string;
}

export default function ThreeBirthdayCake({
  isBlown,
  isBlowing = false,
  recipientName = "LECHU",
}: ThreeBirthdayCakeProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const isBlownRef = useRef(isBlown);
  const isBlowingRef = useRef(isBlowing);

  useEffect(() => {
    isBlownRef.current = isBlown;
  }, [isBlown]);

  useEffect(() => {
    isBlowingRef.current = isBlowing;
  }, [isBlowing]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 360;
    const height = container.clientHeight || 340;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 9.5);
    camera.lookAt(0, 0.8, 0);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Root Cake Group for Rotation
    const cakeGroup = new THREE.Group();
    scene.add(cakeGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.65);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecc7, 1.2);
    dirLight.position.set(5, 12, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    scene.add(dirLight);

    const backRimLight = new THREE.DirectionalLight(0xd6b779, 0.9);
    backRimLight.position.set(-5, 4, -6);
    scene.add(backRimLight);

    // Materials
    const goldPlatterMat = new THREE.MeshStandardMaterial({
      color: 0xd6b779,
      metalness: 0.88,
      roughness: 0.22,
    });

    const cakeBaseMat = new THREE.MeshStandardMaterial({
      color: 0x16161c,
      roughness: 0.55,
      metalness: 0.15,
    });

    const cakeTopTierMat = new THREE.MeshStandardMaterial({
      color: 0x1e1e26,
      roughness: 0.5,
      metalness: 0.18,
    });

    const goldTrimMat = new THREE.MeshStandardMaterial({
      color: 0xe8cf9a,
      metalness: 0.92,
      roughness: 0.18,
    });

    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xf5f0e8,
      roughness: 0.35,
      metalness: 0.25,
    });

    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffbb33,
      transparent: true,
      opacity: 0.92,
    });

    // 1. Platter / Pedestal Base
    const platterGeo = new THREE.CylinderGeometry(3.6, 3.8, 0.22, 64);
    const platter = new THREE.Mesh(platterGeo, goldPlatterMat);
    platter.position.y = -0.5;
    platter.receiveShadow = true;
    platter.castShadow = true;
    cakeGroup.add(platter);

    const platterPedestalGeo = new THREE.CylinderGeometry(2.2, 2.7, 0.3, 48);
    const platterPedestal = new THREE.Mesh(platterPedestalGeo, goldPlatterMat);
    platterPedestal.position.y = -0.75;
    cakeGroup.add(platterPedestal);

    // 2. Bottom Tier (Large Cylinder)
    const tier1Geo = new THREE.CylinderGeometry(3.1, 3.1, 1.4, 64);
    const tier1 = new THREE.Mesh(tier1Geo, cakeBaseMat);
    tier1.position.y = 0.3;
    tier1.receiveShadow = true;
    tier1.castShadow = true;
    cakeGroup.add(tier1);

    // Gold Ribbons on Tier 1
    const tier1TrimGeo = new THREE.TorusGeometry(3.12, 0.05, 16, 64);
    const tier1TrimTop = new THREE.Mesh(tier1TrimGeo, goldTrimMat);
    tier1TrimTop.rotation.x = Math.PI / 2;
    tier1TrimTop.position.y = 0.98;
    cakeGroup.add(tier1TrimTop);

    const tier1TrimBot = new THREE.Mesh(tier1TrimGeo, goldTrimMat);
    tier1TrimBot.rotation.x = Math.PI / 2;
    tier1TrimBot.position.y = -0.38;
    cakeGroup.add(tier1TrimBot);

    // Decorative Gold Pearls around Tier 1 base
    const pearlGeo = new THREE.SphereGeometry(0.08, 12, 12);
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeo, goldTrimMat);
      pearl.position.set(Math.cos(angle) * 3.14, -0.36, Math.sin(angle) * 3.14);
      cakeGroup.add(pearl);
    }

    // 3. Top Tier (Smaller Cylinder)
    const tier2Geo = new THREE.CylinderGeometry(2.1, 2.1, 1.25, 64);
    const tier2 = new THREE.Mesh(tier2Geo, cakeTopTierMat);
    tier2.position.y = 1.6;
    tier2.receiveShadow = true;
    tier2.castShadow = true;
    cakeGroup.add(tier2);

    const tier2TrimGeo = new THREE.TorusGeometry(2.12, 0.045, 16, 64);
    const tier2TrimTop = new THREE.Mesh(tier2TrimGeo, goldTrimMat);
    tier2TrimTop.rotation.x = Math.PI / 2;
    tier2TrimTop.position.y = 2.22;
    cakeGroup.add(tier2TrimTop);

    // Frosting Drip Accents
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const dripHeight = 0.25 + (i % 3) * 0.12;
      const dripGeo = new THREE.CylinderGeometry(0.05, 0.02, dripHeight, 8);
      const drip = new THREE.Mesh(dripGeo, goldTrimMat);
      drip.position.set(
        Math.cos(angle) * 2.11,
        2.2 - dripHeight / 2,
        Math.sin(angle) * 2.11
      );
      cakeGroup.add(drip);
    }

    // 4. Candles & Candle Glow Lights
    const candleCount = 3;
    const candleRadius = 1.1;
    const candleBodies: THREE.Mesh[] = [];
    const candleFlames: THREE.Mesh[] = [];
    const candleLights: THREE.PointLight[] = [];

    const candleGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.95, 16);
    const wickGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x222222 });

    // Flame teardrop geometry
    const flameGeo = new THREE.ConeGeometry(0.12, 0.35, 16);
    flameGeo.translate(0, 0.175, 0);

    for (let i = 0; i < candleCount; i++) {
      const angle = (i / candleCount) * Math.PI * 2 + Math.PI / 6;
      const cx = Math.cos(angle) * candleRadius;
      const cz = Math.sin(angle) * candleRadius;

      // Candle Stick
      const candle = new THREE.Mesh(candleGeo, candleMat);
      candle.position.set(cx, 2.7, cz);
      candle.castShadow = true;
      cakeGroup.add(candle);
      candleBodies.push(candle);

      // Candle Wick
      const wick = new THREE.Mesh(wickGeo, wickMat);
      wick.position.set(cx, 3.24, cz);
      cakeGroup.add(wick);

      // Flame
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.set(cx, 3.32, cz);
      cakeGroup.add(flame);
      candleFlames.push(flame);

      // Dynamic Candle Point Light
      const pLight = new THREE.PointLight(0xffaa22, 1.8, 6);
      pLight.position.set(cx, 3.45, cz);
      cakeGroup.add(pLight);
      candleLights.push(pLight);
    }

    // 5. Smoke Particles for Extinguished State
    const smokeCount = 45;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePos = new Float32Array(smokeCount * 3);
    const smokeVelocity: { x: number; y: number; z: number; life: number }[] = [];

    for (let i = 0; i < smokeCount; i++) {
      smokePos[i * 3] = (Math.random() - 0.5) * 0.4;
      smokePos[i * 3 + 1] = 3.3 + Math.random() * 0.3;
      smokePos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      smokeVelocity.push({
        x: (Math.random() - 0.5) * 0.012,
        y: 0.015 + Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.012,
        life: Math.random(),
      });
    }

    smokeGeo.setAttribute("position", new THREE.BufferAttribute(smokePos, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xcccccc,
      size: 0.14,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    cakeGroup.add(smokeParticles);

    // 6. Interactive Drag & Rotate Support
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let rotationVelocityX = 0.005; // Gentle baseline idle spin
    let rotationVelocityY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = clientX - previousMouseX;
      const deltaY = clientY - previousMouseY;

      cakeGroup.rotation.y += deltaX * 0.012;
      cakeGroup.rotation.x = Math.max(
        -0.2,
        Math.min(0.4, cakeGroup.rotation.x + deltaY * 0.006)
      );

      rotationVelocityX = deltaX * 0.004;
      rotationVelocityY = deltaY * 0.002;

      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    domElement.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 360;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Inertia & slow idle spin
      if (!isDragging) {
        rotationVelocityX *= 0.96;
        rotationVelocityY *= 0.96;
        cakeGroup.rotation.y += 0.004 + rotationVelocityX;
        cakeGroup.rotation.x += (0.1 - cakeGroup.rotation.x) * 0.05;
      }

      const currentBlown = isBlownRef.current;
      const currentBlowing = isBlowingRef.current;

      // Handle Candles State
      candleFlames.forEach((flame, idx) => {
        const light = candleLights[idx];
        if (currentBlown) {
          // Flame gone
          flame.scale.set(0.001, 0.001, 0.001);
          flame.visible = false;
          light.intensity = THREE.MathUtils.lerp(light.intensity, 0, 0.15);
        } else {
          flame.visible = true;
          // Flickering flame scale and skew
          const flicker = Math.sin(time * 18 + idx * 3) * 0.1 + 0.95;
          const flickerX = Math.cos(time * 14 + idx * 2) * 0.06;

          if (currentBlowing) {
            flame.scale.set(0.6 * flicker, 0.5 * flicker, 0.6 * flicker);
            flame.rotation.z = 0.35;
            light.intensity = 0.8 * flicker;
          } else {
            flame.scale.set(1 * flicker, (1 + flickerX * 2) * flicker, 1 * flicker);
            flame.rotation.z = flickerX;
            light.intensity = 1.6 + Math.sin(time * 12 + idx) * 0.4;
          }
        }
      });

      // Handle Smoke particles when extinguished
      if (currentBlown) {
        smokeMat.opacity = Math.min(0.6, smokeMat.opacity + 0.02);
        const pos = smokeGeo.attributes.position.array as Float32Array;

        for (let i = 0; i < smokeCount; i++) {
          const v = smokeVelocity[i];
          pos[i * 3] += v.x;
          pos[i * 3 + 1] += v.y;
          pos[i * 3 + 2] += v.z;

          v.life += 0.015;
          if (v.life > 1.0) {
            v.life = 0;
            // Respawn near candle wick
            const cIdx = i % candleCount;
            const candle = candleBodies[cIdx];
            pos[i * 3] = candle.position.x + (Math.random() - 0.5) * 0.1;
            pos[i * 3 + 1] = 3.3;
            pos[i * 3 + 2] = candle.position.z + (Math.random() - 0.5) * 0.1;
          }
        }
        smokeGeo.attributes.position.needsUpdate = true;
      } else {
        smokeMat.opacity = Math.max(0, smokeMat.opacity - 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      domElement.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      domElement.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);

      // Dispose Geometries & Materials
      platterGeo.dispose();
      platterPedestalGeo.dispose();
      tier1Geo.dispose();
      tier1TrimGeo.dispose();
      pearlGeo.dispose();
      tier2Geo.dispose();
      tier2TrimGeo.dispose();
      candleGeo.dispose();
      wickGeo.dispose();
      flameGeo.dispose();
      smokeGeo.dispose();

      goldPlatterMat.dispose();
      cakeBaseMat.dispose();
      cakeTopTierMat.dispose();
      goldTrimMat.dispose();
      candleMat.dispose();
      flameMat.dispose();
      wickMat.dispose();
      smokeMat.dispose();

      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="relative w-80 h-80 sm:w-96 sm:h-96 cursor-grab active:cursor-grabbing select-none"
        title="Click & drag to rotate 3D cake"
      />
      {/* 3D Drag Hint */}
      <span className="text-[10px] uppercase font-mono tracking-widest text-[#D6B779]/60 -mt-2">
        ✦ Drag in 3D to rotate ✦
      </span>
    </div>
  );
}
