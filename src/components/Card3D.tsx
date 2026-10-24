"use client";

import React, { useRef, useState } from "react";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glareOpacity?: number;
  perspective?: number;
}

export default function Card3D({
  children,
  className = "",
  maxTilt = 12,
  scale = 1.02,
  glareOpacity = 0.25,
  perspective = 1000,
}: Card3DProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [transform, setTransform] = useState<string>("");
  const [glarePosition, setGlarePosition] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform(
      `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    );
    setGlarePosition(null);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {children}

      {/* Dynamic Specular Glare Reflection Overlay */}
      {isHovered && glarePosition && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(214, 183, 121, ${glareOpacity}), rgba(255, 255, 255, ${glareOpacity * 0.8}) 20%, transparent 80%)`,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
}
