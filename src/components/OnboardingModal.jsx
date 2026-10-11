import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Stethoscope, ArrowRight, X, Check, Sparkles } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export default function OnboardingModal() {
  const { showOnboardingModal, setShowOnboardingModal, selectExam, targetExam } = useExam();

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (showOnboardingModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [showOnboardingModal]);

  const examOptions = [
    {
      id: 'JEE Main',
      title: 'JEE Main',
      tagline: 'Engineering Track',
      Icon: Zap,
      desc: 'Focus on speed, formula isolation, NTA pattern concept diagnosis, and step-wise accuracy.',
      badge: 'Speed & Concept Precision'
    },
    {
      id: 'JEE Advanced',
      title: 'JEE Advanced',
      tagline: 'IIT Track',
      Icon: Target,
      desc: 'Focus on multi-concept physics, complex calculus, rotational mechanics, and AIR rank depth.',
      badge: 'Multi-Concept Depth'
    },
    {
      id: 'NEET UG',
      title: 'NEET UG',
      tagline: 'Medical Track',
      Icon: Stethoscope,
      desc: 'Focus on high-accuracy NCERT biology reasoning, organic reaction mechanisms, and rapid speed physics.',
      badge: 'NCERT & Speed Accuracy'
    }
  ];

  return (
    <AnimatePresence>
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl w-full bg-[#0D1117] border-4 border-black shadow-[10px_10px_0px_#000] relative rounded-none my-auto overflow-hidden"
          >
            {/* Arcade Chassis Header Bezel */}
            <div className="bg-[#DC2626] border-b-4 border-black px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-white border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-black border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_#000]" />
              </div>

              <div className="bg-[#0D1117] border-2 border-black px-3 py-1 text-[10px] font-pixel text-white font-bold shadow-[2px_2px_0px_#000] tracking-wider uppercase">
                TARGET EXAM TRACK SELECTOR
              </div>

              <button
                type="button"
                onClick={() => setShowOnboardingModal(false)}
                className="p-1 border-2 border-black bg-white text-black hover:bg-slate-200 transition-colors shadow-[2px_2px_0px_#000]"
                title="Dismiss Selector"
              >
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            {/* Inner Content Screen */}
            <div className="bg-[#14181F] p-5 sm:p-7">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black border-2 border-black text-[9px] font-pixel font-bold uppercase mb-2 shadow-[2px_2px_0px_#000] rounded-none">
                  <span className="w-1.5 h-1.5 bg-[#DC2626] animate-pulse" />
                  <span>SELECT TARGET TRACK</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 font-pixel">
                  Choose Your Target Exam
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto font-sans font-medium leading-relaxed">
                  Configures syllabus diagnosis, difficulty calibration, and progressive Socratic hint ladders.
                </p>
              </div>

              {/* 3 Exam Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
                {examOptions.map((opt) => {
                  const isSelected = targetExam === opt.id;
                  const IconComponent = opt.Icon;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectExam(opt.id)}
                      className={`p-4 rounded-none border-3 border-black text-left flex flex-col justify-between transition-all duration-150 group cursor-pointer bg-[#1E232A] text-white hover:bg-white hover:text-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:-translate-y-1 ${
                        isSelected ? 'border-white/80' : ''
                      }`}
                    >
                      <div>
                        {/* Top Icon & Status Tag */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 rounded-none border-2 border-black bg-white text-black group-hover:bg-black group-hover:text-white shadow-[2px_2px_0px_#000] transition-colors">
                            <IconComponent className="w-5 h-5 text-current" />
                          </div>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-pixel font-bold uppercase px-2 py-0.5 bg-black text-white border-2 border-black shadow-[1px_1px_0px_#000]">
                              <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-[9px] font-pixel font-bold uppercase px-2 py-0.5 bg-[#2A313C] text-white group-hover:bg-black group-hover:text-white border-2 border-black shadow-[1px_1px_0px_#000] transition-colors">
                              {opt.id}
                            </span>
                          )}
                        </div>

                        {/* Title & Track */}
                        <h3 className="text-sm sm:text-base font-bold font-pixel mb-1 text-white group-hover:text-black transition-colors">
                          {opt.title}
                        </h3>

                        <div className="text-[10px] font-pixel mb-2.5 text-slate-400 group-hover:text-slate-700 transition-colors">
                          {opt.tagline}
                        </div>
                        
                        {/* Description */}
                        <p className="text-xs leading-relaxed mb-4 font-sans text-slate-300 group-hover:text-slate-800 transition-colors">
                          {opt.desc}
                        </p>
                      </div>

                      {/* Footer Badge & Arrow */}
                      <div className="pt-2.5 border-t-2 border-white/10 group-hover:border-black flex items-center justify-between text-[9px] font-pixel font-bold text-slate-300 group-hover:text-black transition-colors">
                        <span>{opt.badge}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-black group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Note & Continue Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t-2 border-black/40 text-[9px] text-slate-300 font-pixel">
                <span className="flex items-center gap-1 text-center sm:text-left">
                  <Sparkles className="w-3.5 h-3.5 text-white inline-block flex-shrink-0" />
                  <span>Switch curriculum tracks anytime from the top navbar.</span>
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-slate-200 border-2 border-black shadow-[2px_2px_0px_#000] font-pixel text-[9px] font-bold transition-all"
                >
                  <span>Continue with {targetExam}</span>
                  <ArrowRight className="w-3 h-3 text-black" />
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
