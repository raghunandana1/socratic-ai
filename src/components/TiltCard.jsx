import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function TiltCard({ children, className = "", maxTilt = 6 }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
      className={`rounded-2xl bg-[#0D1527]/80 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.2)] transition-all relative overflow-hidden group ${className}`}
    >
      {/* 3D Glass Surface Specular Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 via-white/[0.04] to-cyan-400/[0.08] pointer-events-none z-10 opacity-70 group-hover:opacity-100 transition-opacity" />

      <div className="relative z-20 h-full">
        {children}
      </div>
    </motion.div>
  );
}
