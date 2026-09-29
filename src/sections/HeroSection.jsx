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

          {/* Headline in Pixel Arcade Display Font with Solid Shadow */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.25] mb-6 font-pixel drop-shadow-[3px_3px_0px_#000]"
          >
            <span className="block">Don't get the answer.</span>
            <span className="block text-[#FBBF24] mt-2">
              Discover it.
            </span>
          </motion.h1>

          {/* Subtitle in Clean Pixel Display Font */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed max-w-2xl mb-8 font-medium"
          >
            SocraticAI doesn't dump solutions. It understands your mistake, adapts to your level, and guides you toward the answer through diagnostic reasoning.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
          >
            <MagneticButton
              variant="primary"
              onClick={() => {
                const el = document.querySelector('#doubt-portal');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Start Solving</span>
              <PixelArrowRight className="w-4 h-4 text-black" />
            </MagneticButton>

            <MagneticButton
              variant="secondary"
              onClick={() => {
                const el = document.querySelector('#how-it-works');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>See How It Works</span>
            </MagneticButton>
          </motion.div>

          {/* Social Proof / Status Indicators — Tactile Arcade Badges */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center gap-3 text-xs font-pixel pt-6 w-full max-w-xl"
          >
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000]">
              <span className="w-2.5 h-2.5 bg-[#10B981] border border-black" />
              <span className="text-[10px] font-bold">Track: {targetExam}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-white text-black border-3 border-black shadow-[3px_3px_0px_#000]">
              <span className="w-2.5 h-2.5 bg-[#F59E0B] border border-black" />
              <span className="text-[10px] font-bold">Zero Answer Dumping</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column — Retro Arcade Console Chassis */}
        <motion.div
          initial={{ opacity: 1, scale: 1, y: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 relative"
        >
          <motion.div style={{ y: cardParallaxY }}>
              {/* Outer Retro Red Console Chassis Bezel with Stepped Pixel Cutouts */}
            <div className="w-full bg-[#DC2626] border-4 border-black p-4 sm:p-5 shadow-[6px_6px_0px_#000] relative rounded-none pixel-cut-corners">
              
              {/* Chassis Top Header Bar */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-3 border-black">
                {/* Authentic 8-bit Pixel LEDs with Highlights */}
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
                </div>
                
                {/* Central Title Pill with Pixel Sprite */}
                <div className="bg-[#0D1117] border-2 border-black px-2.5 py-0.5 text-[9px] font-pixel text-[#EF4444] font-bold tracking-wider shadow-[2px_2px_0px_#000] flex items-center gap-1.5">
                  <PixelTerminal className="w-3 h-3 text-[#EF4444]" />
                  <span>LIVE DIAGNOSTIC</span>
                </div>

                {/* Blinking 8-Bit Status Indicator */}
                <div className="flex items-center gap-1.5 bg-white border-2 border-black px-2 py-0.5 text-[9px] font-pixel font-bold text-black shadow-[2px_2px_0px_#000]">
                  <span className="w-2 h-2 bg-[#10B981] border border-black animate-pulse shadow-[1px_1px_0px_#000]" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Inner Slate Monitor Screen */}
              <div className="bg-[#1E232A] border-3 border-black p-4 relative overflow-hidden shadow-[inset_0_0_16px_rgba(0,0,0,0.6)]">
                
                {/* Problem Question Box with Pixel Notches */}
                <div className="bg-[#262D36] border-2 border-black p-3.5 mb-3.5 shadow-[3px_3px_0px_#000]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-[#F59E0B] text-black px-2 py-0.5 border-2 border-black font-pixel text-[9px] font-bold flex items-center gap-1 shadow-[1px_1px_0px_#000]">
                      <PixelCpu className="w-2.5 h-2.5 text-black" />
                      <span>{heroProblem.topic}</span>
                    </span>
                    <span className="bg-white text-black px-2 py-0.5 border-2 border-black text-[9px] font-pixel font-bold shadow-[1px_1px_0px_#000]">
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
                      className="bg-[#262D36] border-3 border-black p-3.5 shadow-[3px_3px_0px_#000]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-pixel font-bold text-[#EF4444] uppercase tracking-wider flex items-center">
                          <span>&gt; {heroProblem.steps[activeStepIndex]?.title}</span>
                          <span className="pixel-cursor-block" />
                        </span>
                        <span className="text-[9px] font-pixel font-bold bg-white text-black border-2 border-black px-2 py-0.5 shadow-[1px_1px_0px_#000]">
                          {heroProblem.steps[activeStepIndex]?.badge}
                        </span>
                      </div>

                      {/* Solution / Hint Text in clean readable font */}
                      <p className="text-sm font-solution text-slate-100 leading-relaxed font-normal">
                        "{heroProblem.steps[activeStepIndex]?.hint}"
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Monitor Bottom Controls with Segmented Pixel Progress Bar */}
                <div className="mt-3.5 pt-3 border-t-2 border-black flex items-center justify-between text-xs">
                  {/* Chunky Segmented 8-Bit Progress Cells */}
                  <div className="flex items-center gap-1.5">
                    {heroProblem.steps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setIsAutoPlaying(false);
                          setActiveStepIndex(idx);
                        }}
                        className={`h-3 rounded-none border-2 border-black transition-all relative ${
                          activeStepIndex === idx
                            ? 'w-8 bg-[#F59E0B] shadow-[2px_2px_0px_#000]'
                            : 'w-4 bg-[#0D1117] hover:bg-[#262D36]'
                        }`}
                        aria-label={`Step ${idx + 1}`}
                      >
                        {activeStepIndex === idx && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FEF08A] opacity-90" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Pixel Auto/Pause Toggle Button */}
                  <button
                    onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-black border-2 border-black text-[9px] font-pixel font-bold shadow-[2px_2px_0px_#000] hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
