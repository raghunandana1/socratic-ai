import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import MagneticButton from '../components/MagneticButton';
import TiltCard from '../components/TiltCard';
import { HERO_PROBLEMS } from '../data/mockData';
import { useExam } from '../context/ExamContext';
import { PixelArrowRight, PixelRefresh, PixelCpu, PixelTerminal } from '../components/PixelIcon';

export default function HeroSection() {
  const { targetExam } = useExam();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });

  const orbVioletY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 140]);
  const orbCyanY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, 90]);
  const cardParallaxY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -35]);

  const heroProblem = HERO_PROBLEMS[targetExam] || HERO_PROBLEMS["JEE Main"];

  useEffect(() => {
    setActiveStepIndex(0);
  }, [targetExam]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % heroProblem.steps.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroProblem]);

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-4 md:px-8 overflow-hidden bg-transparent">
      {/* Background Subtle Pixel Grid & Ambient Vignette */}
      <div className="absolute inset-0 bg-pixel-grid-dense opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center z-10">
        
        {/* Left Column — Text & CTAs */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 flex flex-col items-start text-left"
        >
          {/* Eyebrow — Tactile White Arcade Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white border-3 border-black text-black text-[10px] sm:text-xs font-pixel font-bold uppercase mb-6 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2 h-2 bg-[#EF4444] border border-black shadow-[1px_1px_0px_#000] animate-pulse" />
            <span>SOCRATIC AI • {targetExam}</span>
          </motion.div>

          {/* Modern 3D Gradient Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-6 font-sans"
          >
            <span className="block bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">Don't get the answer.</span>
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mt-2">
              Discover it.
            </span>
          </motion.h1>

          {/* Subtitle in Crisp Typography */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-300 font-sans leading-relaxed max-w-2xl mb-8 font-normal"
          >
            SocraticAI doesn't dump solutions. It understands your mistake, adapts to your level, and guides you toward the answer through diagnostic reasoning.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            data-mist-source="true"
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <MagneticButton
              variant="primary"
              onClick={() => {
                const el = document.querySelector('#doubt-portal');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="!px-6 !py-3 !text-sm !bg-gradient-to-r !from-cyan-500 !to-blue-600 !text-white !rounded-xl !border !border-cyan-400/30 !shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:!shadow-[0_6px_28px_rgba(56,189,248,0.5)]"
            >
              <span>Start Solving</span>
              <PixelArrowRight className="w-4 h-4 text-white" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => {
                const el = document.querySelector('#how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="!px-6 !py-3 !text-sm !bg-white/5 !text-white !rounded-xl !border !border-white/15 hover:!bg-white/10"
            >
              <span>See How It Works</span>
            </MagneticButton>
          </motion.div>

          {/* Social Proof / Status Indicators — Modern 3D Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center gap-3 text-xs pt-6 w-full max-w-xl"
          >
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 shadow-[0_2px_10px_rgba(0,0,0,0.4)] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>Track: {targetExam}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 text-slate-300 border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.4)] font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
              <span>Zero Answer Dumping</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column — Modern 3D Glass Diagnostic Console */}
        <motion.div
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          <motion.div style={{ y: cardParallaxY }}>
            {/* Outer 3D Glass Console Chassis */}
            <div data-mist-source="true" className="w-full bg-[#0D1527]/85 backdrop-blur-2xl border border-cyan-500/25 p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.12)] relative rounded-2xl">
              
              {/* Chassis Top Header Bar */}
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                  <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                </div>
                
                {/* Central Title Pill */}
                <div className="bg-[#080D1A] border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300 rounded-full flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  <PixelTerminal className="w-3 h-3 text-cyan-400" />
                  <span>LIVE DIAGNOSTIC</span>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Inner Dark Monitor Screen */}
              <div className="bg-[#080D1A]/90 border border-white/10 rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-[inset_0_2px_12px_rgba(0,0,0,0.7)]">
                
                {/* Problem Question Box */}
                <div className="bg-[#0F172A] border border-white/10 rounded-xl p-4 mb-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-cyan-500/15 text-cyan-300 px-2.5 py-0.5 rounded-lg border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5">
                      <PixelCpu className="w-3 h-3 text-cyan-400" />
                      <span>{heroProblem.topic}</span>
                    </span>
                    <span className="text-slate-400 text-xs font-medium">
                      Problem
                    </span>
                  </div>
                  
                  {/* Mathematical equation in clean readable font */}
                  <div className="font-math text-base sm:text-lg font-bold text-white tracking-wide py-1">
                    {heroProblem.equation}
                  </div>
                </div>

                {/* Socratic Step / Hint Card */}
                <div className="min-h-[140px] relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStepIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="bg-[#0F172A] border border-cyan-500/30 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider flex items-center">
                          <span>&gt; {heroProblem.steps[activeStepIndex]?.title}</span>
                          <span className="pixel-cursor-block" />
                        </span>
                        <span className="text-[10px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                          {heroProblem.steps[activeStepIndex]?.badge}
                        </span>
                      </div>

                      {/* Solution / Hint Text in clean readable font */}
                      <p className="text-sm font-solution text-slate-200 leading-relaxed font-normal">
                        "{heroProblem.steps[activeStepIndex]?.hint}"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Monitor Bottom Controls with Segmented Progress Bar */}
                <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                  {/* Smooth Segmented Progress Cells */}
                  <div className="flex items-center gap-2">
                    {heroProblem.steps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setActiveStepIndex(idx);
                        }}
                        className={`h-2 rounded-full transition-all relative cursor-pointer ${
                          activeStepIndex === idx
                            ? 'w-8 bg-cyan-400 shadow-[0_0_10px_#38bdf8]'
                            : 'w-4 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Step ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Auto/Pause Toggle Button */}
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-all border border-white/10 cursor-pointer"
                  >
                    <PixelRefresh className={`w-3 h-3 ${isAutoPlaying ? 'animate-spin' : ''}`} />
                    <span>{isAutoPlaying ? 'Auto' : 'Paused'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
