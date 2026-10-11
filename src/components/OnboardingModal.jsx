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
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl w-full bg-[#0D1527] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative rounded-2xl my-auto overflow-hidden"
          >
            {/* Modal Header Bar */}
            <div className="bg-[#0B132B] border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider font-sans">
                  Target Curriculum Track
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowOnboardingModal(false)}
                className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/15 transition-colors"
                title="Dismiss Selector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inner Content Screen */}
            <div className="p-6 sm:p-8 bg-[#0D1527]">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-semibold rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                  <span>SELECT TARGET TRACK</span>
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 font-sans">
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
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 group cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] text-white'
                          : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      <div>
                        {/* Top Icon & Status Tag */}
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2.5 rounded-xl border transition-colors ${
                            isSelected 
                              ? 'bg-cyan-500 text-black border-cyan-400' 
                              : 'bg-white/10 text-cyan-300 border-white/15 group-hover:bg-cyan-500 group-hover:text-black'
                          }`}>
                            <IconComponent className="w-5 h-5 text-current" />
                          </div>

                          {isSelected ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-400 text-black">
                              <Check className="w-3 h-3 stroke-[3]" />
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-slate-400">
                              {opt.id}
                            </span>
                          )}
                        </div>

                        {/* Title & Track */}
                        <h3 className="text-sm sm:text-base font-bold mb-1 text-white">
                          {opt.title}
                        </h3>

                        <div className="text-xs mb-2 text-cyan-400 font-medium">
                          {opt.tagline}
                        </div>
                        
                        {/* Description */}
                        <p className="text-xs leading-relaxed mb-4 text-slate-300">
                          {opt.desc}
                        </p>
                      </div>

                      {/* Footer Badge & Arrow */}
                      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-cyan-300 transition-colors">
                        <span>{opt.badge}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Note & Continue Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5 text-center sm:text-left">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline-block flex-shrink-0" />
                  <span>Switch curriculum tracks anytime from the top navbar.</span>
                </span>
                
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(false)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs transition-all shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_25px_rgba(56,189,248,0.5)] cursor-pointer"
                >
                  <span>Continue with {targetExam}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
