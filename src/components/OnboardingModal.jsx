import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Stethoscope, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export default function OnboardingModal() {
  const { showOnboardingModal, selectExam } = useExam();

  if (!showOnboardingModal) return null;

  const examOptions = [
    {
      id: 'JEE Main',
      title: 'JEE Main',
      tagline: 'Engineering Aspirants',
      icon: <Zap className="w-6 h-6 text-brand-cyan" />,
      desc: 'Focus on speed, formula application, NTA pattern concept isolation, and accuracy.',
      color: 'from-brand-cyan/20 to-brand-violet/10 border-brand-cyan/40 shadow-glow-cyan',
      badge: 'Speed & Concept Accuracy'
    },
    {
      id: 'JEE Advanced',
      title: 'JEE Advanced',
      tagline: 'IIT Aspirants',
      icon: <Target className="w-6 h-6 text-brand-purple" />,
      desc: 'Focus on deep multi-concept physics, complex calculus, rotational dynamics, and AIR rank optimization.',
      color: 'from-brand-violet/20 to-brand-purple/10 border-brand-violet/40 shadow-glow-violet',
      badge: 'Deep Multi-Concept Depth'
    },
    {
      id: 'NEET UG',
      title: 'NEET UG',
      tagline: 'Medical Aspirants',
      icon: <Stethoscope className="w-6 h-6 text-brand-emerald" />,
      desc: 'Focus on high-accuracy NCERT biology reasoning, organic reaction mechanisms, and rapid speed physics.',
      color: 'from-emerald-500/20 to-brand-cyan/10 border-emerald-500/40 shadow-glow-emerald',
      badge: 'NCERT & High Accuracy'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl w-full bg-[#DC2626] border-4 border-black p-3 sm:p-5 shadow-[6px_6px_0px_#000] relative rounded-none"
        >
          {/* Chassis Top Bar */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b-3 border-black">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#EF4444] border-2 border-black shadow-[1px_1px_0px_#000]" />
              <span className="w-3 h-3 bg-[#F59E0B] border-2 border-black shadow-[1px_1px_0px_#000]" />
              <span className="w-3 h-3 bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_#000]" />
            </div>
            <div className="bg-[#0D1117] border-2 border-black px-2.5 py-0.5 text-[9px] font-pixel text-[#EF4444] font-bold shadow-[2px_2px_0px_#000]">
              TARGET GOAL SELECTOR
            </div>
            <div className="text-[9px] font-pixel text-black font-bold">
              READY
            </div>
          </div>

          {/* Inner Slate Screen */}
          <div className="bg-[#1E232A] border-3 border-black p-5 sm:p-7 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black border-2 border-black text-[9px] font-pixel font-bold uppercase mb-2 shadow-[2px_2px_0px_#000] rounded-none">
                <span className="w-1.5 h-1.5 bg-[#EF4444] animate-pulse" />
                <span>SELECT TARGET TRACK</span>
              </div>
              
              <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight mb-2 font-pixel">
                Choose Your Exam
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto font-sans font-medium">
                Configures diagnostic models, dynamic difficulty curves, and guided hint policies.
              </p>
            </div>

            {/* 3 Exam Selection Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
              {examOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => selectExam(opt.id)}
                  className="p-4 rounded-none border-3 border-black text-left flex flex-col justify-between bg-[#262D36] hover:bg-[#313945] hover:translate-y-[-2px] transition-all duration-150 group cursor-pointer shadow-[3px_3px_0px_#000]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-none bg-[#F59E0B] border-2 border-black text-black shadow-[2px_2px_0px_#000]">
                        {opt.icon}
                      </div>
                      <span className="text-[9px] font-pixel font-bold uppercase text-black bg-white px-2 py-0.5 border-2 border-black shadow-[1px_1px_0px_#000]">
                        {opt.id}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold font-pixel text-white mb-1.5 group-hover:text-[#FBBF24] transition-colors">
                      {opt.title}
                    </h3>
                    
                    <p className="text-xs text-slate-200 leading-relaxed mb-3 font-solution">
                      {opt.desc}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t-2 border-black flex items-center justify-between text-[9px] font-pixel text-[#F59E0B] font-bold">
                    <span>{opt.badge}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B] group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Note */}
            <div className="text-center text-[9px] text-slate-400 font-pixel">
              ★ You can switch curriculum tracks from the top navbar at any time.
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
