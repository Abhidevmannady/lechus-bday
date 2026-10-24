"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvasBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0b0d, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 1. Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const goldLight1 = new THREE.PointLight(0xd6b779, 2.5, 180);
    goldLight1.position.set(40, 30, 40);
    scene.add(goldLight1);

    const roseLight = new THREE.PointLight(0xb98e96, 2, 160);
    roseLight.position.set(-40, -25, 30);
    scene.add(roseLight);

    // 2. 3D Particle Galaxy / Starfield
    const particlesCount = 1400;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    const goldColor = new THREE.Color(0xd6b779);
    const ivoryColor = new THREE.Color(0xf5f0e8);
    const roseColor = new THREE.Color(0xb98e96);
    const whiteColor = new THREE.Color(0xffffff);
    const palette = [goldColor, ivoryColor, roseColor, whiteColor];

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      // Spherical / cylindrical distribution for galaxy depth
      const radius = 25 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 90;

      posArray[i3] = Math.cos(theta) * radius;
      posArray[i3 + 1] = y;
      posArray[i3 + 2] = Math.sin(theta) * radius - 20;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colorArray[i3] = c.r;
      colorArray[i3 + 1] = c.g;
      colorArray[i3 + 2] = c.b;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );
    particlesGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorArray, 3)
    );

    // Circular particle texture
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(255,245,225,0.8)");
      grad.addColorStop(0.7, "rgba(214,183,121,0.2)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 3. Orbiting 3D Golden Ring (Celestial Torus)
    const ringGeo = new THREE.TorusGeometry(38, 0.25, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd6b779,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const celestialRing = new THREE.Mesh(ringGeo, ringMat);
    celestialRing.rotation.x = Math.PI * 0.35;
    celestialRing.rotation.y = Math.PI * 0.15;
    scene.add(celestialRing);

    const secondaryRingGeo = new THREE.TorusGeometry(52, 0.18, 16, 100);
    const secondaryRingMat = new THREE.MeshStandardMaterial({
      color: 0xe8cf9a,
      roughness: 0.3,
      metalness: 0.9,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const secondaryRing = new THREE.Mesh(secondaryRingGeo, secondaryRingMat);
    secondaryRing.rotation.x = -Math.PI * 0.25;
    secondaryRing.rotation.y = Math.PI * 0.3;
    scene.add(secondaryRing);

    // 4. Floating 3D Crystals / Diamonds
    const crystals: THREE.Mesh[] = [];
    const crystalGeo = new THREE.OctahedronGeometry(1.6, 0);

    for (let i = 0; i < 22; i++) {
      const crystalMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0xd6b779 : 0xf5f0e8,
        roughness: 0.15,
        metalness: 0.9,
        wireframe: i % 3 === 0,
        transparent: true,
        opacity: 0.65,
      });

      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.position.set(
        (Math.random() - 0.5) * 120,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60
      );
      crystal.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const scale = 0.5 + Math.random() * 1.2;
      crystal.scale.set(scale, scale, scale);

      // Custom velocity attributes
      (crystal as unknown as { vRotX: number; vRotY: number; vFloat: number }).vRotX = (Math.random() - 0.5) * 0.015;
      (crystal as unknown as { vRotX: number; vRotY: number; vFloat: number }).vRotY = (Math.random() - 0.5) * 0.015;
      (crystal as unknown as { vRotX: number; vRotY: number; vFloat: number }).vFloat = Math.random() * Math.PI * 2;

      scene.add(crystal);
      crystals.push(crystal);
    }

    // 5. Smooth Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      targetX += (mouseX * 12 - targetX) * 0.035;
      targetY += (-mouseY * 8 - targetY) * 0.035;

      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 0, 0);

      // Rotate particle galaxy slowly
      particlesMesh.rotation.y = elapsedTime * 0.025;
      particlesMesh.rotation.x = Math.sin(elapsedTime * 0.015) * 0.05;

      // Rotate celestial rings
      celestialRing.rotation.z = elapsedTime * 0.04;
      celestialRing.rotation.y = Math.PI * 0.15 + Math.sin(elapsedTime * 0.03) * 0.1;

      secondaryRing.rotation.z = -elapsedTime * 0.03;
      secondaryRing.rotation.x = -Math.PI * 0.25 + Math.cos(elapsedTime * 0.02) * 0.08;

      // Animate floating 3D crystals
      crystals.forEach((crystal) => {
        const cData = crystal as unknown as { vRotX: number; vRotY: number; vFloat: number };
        crystal.rotation.x += cData.vRotX;
        crystal.rotation.y += cData.vRotY;
        crystal.position.y += Math.sin(elapsedTime * 1.2 + cData.vFloat) * 0.04;
      });

      // Pulse lights
      goldLight1.intensity = 2.2 + Math.sin(elapsedTime * 1.5) * 0.6;
      roseLight.intensity = 1.8 + Math.cos(elapsedTime * 1.2) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      // Dispose Three.js resources
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      particleTexture.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      secondaryRingGeo.dispose();
      secondaryRingMat.dispose();
      crystalGeo.dispose();
      crystals.forEach((c) => {
        if (c.material instanceof THREE.Material) c.material.dispose();
      });

      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
