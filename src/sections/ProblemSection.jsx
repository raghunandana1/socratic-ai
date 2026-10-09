import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import { PROBLEM_CARDS } from '../data/mockData';
import { PixelWarning, PixelTerminal, PixelCpu } from '../components/PixelIcon';

export default function ProblemSection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const yCard1 = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-18, 18]);
  const yCard2 = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 0]);
  const yCard3 = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [18, -18]);
  const orbY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-40, 60]);

  const cardParallaxOffsets = [yCard1, yCard2, yCard3];

  const cardIcons = {
    "01": <PixelWarning className="w-5 h-5 text-black" />,
    "02": <PixelTerminal className="w-5 h-5 text-black" />,
    "03": <PixelCpu className="w-5 h-5 text-black" />,
  };

  return (
    <section ref={sectionRef} id="product" className="scroll-mt-28 py-20 px-4 md:px-8 relative z-10 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white text-black border-3 border-black text-[10px] font-pixel font-bold uppercase mb-4 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2 h-2 bg-[#EF4444] border border-black animate-pulse" />
            <span>THE PROBLEM</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 font-pixel drop-shadow-[2px_2px_0px_#000]"
          >
            The problem isn't finding the answer. <br className="hidden sm:inline" />
            <span className="text-white">It's knowing why you got it wrong.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed max-w-2xl mx-auto font-medium"
          >
            JEE & NEET demand deep diagnostic reasoning. Traditional coaching and generic AI LLMs have created three systemic traps:
          </motion.p>
        </div>

        {/* 3 Arcade Console Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEM_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <div className="h-full bg-[#DC2626] border-4 border-black p-0 shadow-[5px_5px_0px_#000] flex flex-col justify-between overflow-hidden pixel-cut-corners">
                {/* Console Bezel Header Bar */}
                <div className="p-3.5 sm:p-4 flex items-center justify-between border-b-3 border-black bg-[#DC2626]">
                  <span className="bg-white text-black px-2.5 py-1 border-2 border-black font-pixel text-[10px] font-bold shadow-[2px_2px_0px_#000]">
                    [0{index + 1}] {card.stat}
                  </span>
                  <div className="p-2 bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000]">
                    {cardIcons[card.id]}
                  </div>
                </div>

                {/* Console Screen Body */}
                <div className="p-5 sm:p-6 bg-[#1E232A] flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white mb-2.5 font-pixel tracking-wide">
                      {card.title}
                    </h3>
                    <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-medium font-sans">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t-2 border-black">
                    <span className="inline-block bg-white text-black px-2 py-0.5 border-2 border-black text-[9px] font-pixel font-bold shadow-[1px_1px_0px_#000]">
                      {card.tag}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
