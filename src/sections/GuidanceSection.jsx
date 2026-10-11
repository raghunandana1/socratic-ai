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
            <span className="text-white">We help you solve it yourself.</span>
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
            {/* Modern 3D Glass Tutoring Console Chassis */}
            <div className="bg-[#0D1527]/85 backdrop-blur-2xl border border-cyan-500/25 p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.12)] relative rounded-2xl">
            
              {/* Chassis Header Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                  <span className="ml-2 text-xs font-semibold text-cyan-300 hidden sm:inline">
                    {scenario.subject}
                  </span>
                </div>
                
                <div className="bg-[#080D1A] border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300 rounded-full flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  <PixelTerminal className="w-3 h-3 text-cyan-400" />
                  <span>SOCRATIC SESSION</span>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 transition-all cursor-pointer"
                >
                  <PixelRefresh className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Inner Dark Monitor Screen */}
              <div className="bg-[#080D1A]/90 border border-white/10 rounded-xl p-4 sm:p-6 shadow-[inset_0_2px_12px_rgba(0,0,0,0.7)]">
                
                {/* Target Problem Banner */}
                <div className="bg-[#0F172A] border border-white/10 rounded-xl p-4 sm:p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">Target Problem:</span>
                    <div className="text-base sm:text-lg font-math font-bold text-white tracking-wide">
                      {scenario.problemText}
                    </div>
                  </div>
                  <div className="bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-semibold self-start md:self-auto shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
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
                        <span className="text-[9px] font-pixel font-bold bg-white text-black border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
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
                      <span className="inline-block text-[10px] font-pixel font-bold text-black bg-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">
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
