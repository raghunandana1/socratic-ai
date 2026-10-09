import React from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '../hooks/useMagnetic';

export default function MagneticButton({
  children,
  onClick,
  className = "",
  variant = "primary"
}) {
  const { ref, position } = useMagnetic(0.2);

  const baseStyles = "relative inline-flex items-center justify-center font-bold rounded-none transition-all duration-75 group cursor-pointer select-none pixel-cut-corners";
  
  const variants = {
    primary: "bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:bg-slate-100 hover:shadow-[5px_5px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_#000] px-7 py-3 text-xs md:text-sm font-pixel font-bold tracking-wider uppercase",
    secondary: "bg-white text-black border-3 border-black shadow-[4px_4px_0px_#000] hover:bg-slate-100 hover:shadow-[5px_5px_0px_#000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0px_#000] px-6 py-3 text-xs md:text-sm font-pixel font-bold tracking-wider uppercase",
    ghost: "bg-[#1E232A] text-white hover:text-black hover:bg-white border-2 border-black shadow-[2px_2px_0px_#000] px-4 py-2 text-xs font-pixel font-bold transition-all active:translate-x-0.5 active:translate-y-0.5"
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.1 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {/* 8-bit Top/Left Pixel Highlight Strip */}
      <span className="absolute top-0 left-0 right-0 h-0.5 bg-white/50 pointer-events-none" />
      <span className="absolute top-0 left-0 bottom-0 w-0.5 bg-white/50 pointer-events-none" />
      
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
