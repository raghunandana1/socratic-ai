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
      className={`rounded-none bg-[#1E232A] border-3 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all relative overflow-hidden group ${className}`}
    >
      {/* 4 Corner Square Arcade Rivets */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-[#DC2626] border border-black pointer-events-none z-20 group-hover:bg-[#F59E0B] transition-colors" />
      <div className="absolute top-0 right-0 w-2 h-2 bg-[#DC2626] border border-black pointer-events-none z-20 group-hover:bg-[#F59E0B] transition-colors" />
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#DC2626] border border-black pointer-events-none z-20 group-hover:bg-[#F59E0B] transition-colors" />
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[#DC2626] border border-black pointer-events-none z-20 group-hover:bg-[#F59E0B] transition-colors" />

      {/* Subtle CRT Scanline overlay */}
      <div className="absolute inset-0 crt-scanlines opacity-25 pointer-events-none z-10" />

      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}
