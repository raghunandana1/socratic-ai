import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import { GUIDANCE_SCENARIOS } from '../data/mockData';
import { useExam } from '../context/ExamContext';
import { PixelCheck, PixelRefresh, PixelArrowRight, PixelTerminal } from '../components/PixelIcon';

export default function GuidanceSection() {
  const { targetExam } = useExam();
  const [currentHintLevel, setCurrentHintLevel] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const orbY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-50, 70]);
  const cardY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [20, -20]);

  const scenario = GUIDANCE_SCENARIOS[targetExam] || GUIDANCE_SCENARIOS["JEE Main"];

  useEffect(() => {
    setCurrentHintLevel(1);
    setIsCompleted(false);
  }, [targetExam]);

  const handleNextHint = () => {
    if (currentHintLevel < scenario.hints.length) {
      setCurrentHintLevel(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentHintLevel(1);
    setIsCompleted(false);
  };

  return (
    <section ref={sectionRef} id="how-it-works" className="scroll-mt-28 py-20 px-4 md:px-8 relative z-10 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white text-black border-3 border-black text-[10px] font-pixel font-bold uppercase mb-4 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2 h-2 bg-[#EF4444] border border-black animate-pulse" />
            <span>HOW IT WORKS • {targetExam}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 font-pixel drop-shadow-[2px_2px_0px_#000]"
          >
            We don't solve it for you. <br />
            <span className="text-[#FBBF24]">We help you solve it yourself.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Experience how SocraticAI replaces direct answer-dumping with guided micro-questions tailored specifically for {targetExam} aspirants.
          </motion.p>
        </div>

        {/* Large Interactive Tutoring Console Chassis */}
        <div className="max-w-4xl mx-auto">
          <motion.div style={{ y: cardY }}>
            {/* Outer Retro Red Bezel */}
            <div className="bg-[#DC2626] border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_#000] relative rounded-none pixel-cut-corners">
            
              {/* Chassis Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
                <div className="flex items-center gap-2">
                  <div className="relative w-3.5 h-3.5 bg-[#EF4444] border-2 border-black shadow-[1px_1px_0px_#000]">
                    <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-80" />
                  </div>
                  <div className="relative w-3.5 h-3.5 bg-[#F59E0B] border-2 border-black shadow-[1px_1px_0px_#000]">
                    <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-80" />
                  </div>
                  <div className="relative w-3.5 h-3.5 bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_#000]">
                    <div className="absolute top-0 left-0 w-1 h-1 bg-white opacity-80" />
                  </div>
                  <span className="ml-2 text-[10px] font-pixel text-black font-bold hidden sm:inline">
                    {scenario.subject}
                  </span>
                </div>
                
                <div className="bg-[#0D1117] border-2 border-black px-2.5 py-0.5 text-[9px] font-pixel text-[#EF4444] font-bold tracking-wider shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
                  <PixelTerminal className="w-3 h-3 text-[#EF4444]" />
                  <span>SOCRATIC SESSION</span>
                </div>

                <button
                  onClick={handleReset}
                  className="text-[9px] font-pixel font-bold text-black flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  <PixelRefresh className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Inner Slate Monitor Screen */}
              <div className="bg-[#1E232A] border-3 border-black p-4 sm:p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
                
                {/* Target Problem Banner */}
                <div className="bg-[#262D36] border-2 border-black p-4 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[3px_3px_0px_#000]">
                  <div>
                    <span className="text-[9px] text-slate-300 uppercase tracking-wider font-pixel block mb-1">Target Problem:</span>
                    <div className="text-base sm:text-lg font-math font-bold text-white tracking-wide">
                      {scenario.problemText}
                    </div>
                  </div>
                  <div className="bg-white text-black border-2 border-black px-2.5 py-1 rounded-none text-[9px] font-pixel font-bold self-start md:self-auto shadow-[2px_2px_0px_#000]">
                    {scenario.badge}
                  </div>
                </div>

                {/* Progressive Socratic Hints Stream */}
                <div className="space-y-3.5 mb-6">
                  {scenario.hints.slice(0, currentHintLevel).map((hint) => (
                    <motion.div
                      key={hint.level}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-[#262D36] border-3 border-black p-4 relative shadow-[3px_3px_0px_#000]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-pixel font-bold text-[#EF4444] flex items-center gap-1.5 uppercase tracking-wide">
                          &gt; {hint.title}
                        </span>
                        <span className="text-[9px] font-pixel font-bold bg-[#F59E0B] text-black border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
                          {hint.chip}
                        </span>
                      </div>
                      
                      {/* Hint question in clean readable font */}
                      <p className="text-sm font-normal text-slate-100 mb-2 leading-relaxed font-solution">
                        "{hint.question}"
                      </p>
                      
                      {/* AI Guidance Note in clean readable font */}
                      <div className="text-xs text-slate-200 font-solution bg-[#1E232A] p-2.5 border-2 border-black">
                        Guidance Note: {hint.thought}
                      </div>
                    </motion.div>
                  ))}

                  {/* Final Discovery Card */}
                  {isCompleted && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-[#172D24] border-3 border-black p-5 text-center shadow-[4px_4px_0px_#000] pixel-cut-corners"
                    >
                      <div className="w-9 h-9 bg-[#10B981] border-2 border-black text-black mx-auto flex items-center justify-center mb-2.5 shadow-[2px_2px_0px_#000]">
                        <PixelCheck className="w-5 h-5 text-black" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white mb-2 font-pixel">{scenario.breakthrough.title}</h4>
                      <p className="text-sm sm:text-base text-emerald-200 max-w-lg mx-auto font-math font-solution mb-3 font-semibold">
                        {scenario.breakthrough.mathResult}
                      </p>
                      <span className="inline-block text-[10px] font-pixel font-bold text-black bg-[#F59E0B] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
                        {scenario.breakthrough.reward}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Chassis Action Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 border-t-2 border-black">
                  <div className="bg-white text-black border-2 border-black px-2.5 py-1 text-[9px] font-pixel font-bold shadow-[2px_2px_0px_#000]">
                    PROGRESS: <span className="text-[#1250D8]">{currentHintLevel} / {scenario.hints.length}</span>
                  </div>

                  {!isCompleted ? (
                    <MagneticButton
                      variant="primary"
                      onClick={handleNextHint}
                    >
                      <span className="flex items-center gap-2">
                        <span>{currentHintLevel === scenario.hints.length ? "Discover Solution" : "Reveal Next Socratic Hint"}</span>
                        <PixelArrowRight className="w-3.5 h-3.5 text-black" />
                      </span>
                    </MagneticButton>
                  ) : (
                    <MagneticButton
                      variant="secondary"
                      onClick={handleReset}
                    >
                      <span className="flex items-center gap-2">
                        <span>Try Again</span>
                        <PixelRefresh className="w-3.5 h-3.5 text-black" />
                      </span>
                    </MagneticButton>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
