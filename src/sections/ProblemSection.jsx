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
    "01": <PixelWarning className="w-5 h-5 text-cyan-400" />,
    "02": <PixelTerminal className="w-5 h-5 text-cyan-400" />,
    "03": <PixelCpu className="w-5 h-5 text-cyan-400" />,
  };

  return (
    <section ref={sectionRef} id="product" className="scroll-mt-28 py-20 px-4 md:px-8 relative z-10 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-semibold uppercase mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
            <span>THE PROBLEM</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4 font-sans"
          >
            The problem isn't finding the answer. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">It's knowing why you got it wrong.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl mx-auto font-normal"
          >
            JEE & NEET demand deep diagnostic reasoning. Traditional coaching and generic AI LLMs have created three systemic traps:
          </motion.p>
        </div>

        {/* 3 Modern 3D Glass Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {PROBLEM_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <div data-mist-source="true" className="h-full bg-[#0D1527]/85 backdrop-blur-2xl border border-white/10 rounded-2xl p-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] hover:border-cyan-400/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_25px_rgba(56,189,248,0.15)] transition-all flex flex-col justify-between overflow-hidden group">
                {/* 3D Glass Header Bar */}
                <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#0B132B]/60">
                  <span className="bg-cyan-500/15 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-semibold">
                    [0{index + 1}] {card.stat}
                  </span>
                  <div className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                    {cardIcons[card.id]}
                  </div>
                </div>

                {/* Card Screen Body */}
                <div className="p-6 bg-[#0D1527]/60 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2.5 font-sans tracking-wide">
                      {card.title}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal font-sans">
                      {card.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <span className="inline-block bg-white/5 text-slate-300 px-3 py-1 rounded-lg border border-white/10 text-xs font-semibold">
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
