import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Stethoscope, ArrowRight, X } from 'lucide-react';
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
      tagline: 'Engineering Aspirants',
      icon: <Zap className="w-5 h-5 text-black" />,
      desc: 'Focus on speed, formula isolation, NTA pattern concept diagnosis, and step-wise accuracy.',
      badge: 'Speed & Concept Precision'
    },
    {
      id: 'JEE Advanced',
      title: 'JEE Advanced',
      tagline: 'IIT Aspirants',
      icon: <Target className="w-5 h-5 text-black" />,
      desc: 'Focus on multi-concept physics, complex calculus, rotational mechanics, and AIR rank mastery.',
      badge: 'Multi-Concept Depth'
    },
    {
      id: 'NEET UG',
      title: 'NEET UG',
      tagline: 'Medical Aspirants',
      icon: <Stethoscope className="w-5 h-5 text-black" />,
      desc: 'Focus on high-accuracy NCERT biology reasoning, reaction mechanisms, and rapid medical physics.',
      badge: 'NCERT & Speed Accuracy'
    }
  ];

  return (
    <AnimatePresence>
      {showOnboardingModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="max-w-3xl w-full bg-[#DC2626] border-4 border-black p-3 sm:p-5 shadow-[8px_8px_0px_#000] relative rounded-none my-auto"
          >
            {/* Chassis Top Bar */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b-3 border-black">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#EF4444] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-[#FFFFFF] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_#000]" />
              </div>
              <div className="bg-[#0D1117] border-2 border-black px-3 py-0.5 text-[9px] font-pixel text-[#FFFFFF] font-bold shadow-[2px_2px_0px_#000]">
                TARGET EXAM TRACK SELECTOR
              </div>
              <button
                type="button"
                onClick={() => setShowOnboardingModal(false)}
                className="p-1 border-2 border-black bg-white text-black hover:bg-slate-200 transition-colors shadow-[1px_1px_0px_#000]"
                title="Dismiss Selector"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Inner Slate Screen */}
            <div className="bg-[#1E232A] border-3 border-black p-4 sm:p-7 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
              {/* Header */}
              <div className="text-center mb-5 sm:mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white text-black border-2 border-black text-[9px] font-pixel font-bold uppercase mb-2 shadow-[2px_2px_0px_#000] rounded-none">
                  <span className="w-1.5 h-1.5 bg-[#EF4444] animate-pulse" />
                  <span>SELECT TARGET TRACK</span>
                </div>
                
                <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight mb-2 font-pixel">
                  Choose Your Target Exam
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto font-sans font-medium">
                  Customizes syllabus diagnosis, difficulty calibration, and progressive Socratic hint ladders.
                </p>
              </div>

              {/* 3 Exam Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-5">
                {examOptions.map((opt) => {
                  const isSelected = targetExam === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => selectExam(opt.id)}
                      className={`p-4 rounded-none border-3 border-black text-left flex flex-col justify-between transition-all duration-150 group cursor-pointer ${
                        isSelected
                          ? 'bg-[#FFFFFF] text-black shadow-[4px_4px_0px_#000] -translate-y-1'
                          : 'bg-[#262D36] text-white hover:bg-[#313945] hover:-translate-y-0.5 shadow-[3px_3px_0px_#000]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className={`p-2 rounded-none border-2 border-black ${
                            isSelected ? 'bg-black text-white' : 'bg-white text-black shadow-[2px_2px_0px_#000]'
                          }`}>
                            {opt.icon}
                          </div>
                          <span className={`text-[9px] font-pixel font-bold uppercase px-2 py-0.5 border-2 border-black ${
                            isSelected ? 'bg-black text-white' : 'bg-white text-black shadow-[1px_1px_0px_#000]'
                          }`}>
                            {isSelected ? '✓ ACTIVE' : opt.id}
                          </span>
                        </div>

                        <h3 className={`text-sm sm:text-base font-bold font-pixel mb-1 ${
                          isSelected ? 'text-black' : 'text-white'
                        }`}>
                          {opt.title}
                        </h3>

                        <div className={`text-[10px] font-pixel mb-2 ${
                          isSelected ? 'text-slate-700' : 'text-slate-300'
                        }`}>
                          {opt.tagline}
                        </div>
                        
                        <p className={`text-xs leading-relaxed mb-3 font-sans ${
                          isSelected ? 'text-slate-800' : 'text-slate-200'
                        }`}>
                          {opt.desc}
                        </p>
                      </div>

                      <div className={`pt-2.5 border-t-2 border-black flex items-center justify-between text-[9px] font-pixel font-bold ${
                        isSelected ? 'text-black' : 'text-white'
                      }`}>
                        <span>{opt.badge}</span>
                        <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${
                          isSelected ? 'text-black' : 'text-white'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Note */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-[9px] text-slate-300 font-pixel">
                <span>★ You can switch curriculum tracks from the top navbar at any time.</span>
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(false)}
                  className="hover:underline text-white font-bold"
                >
                  Continue with {targetExam} ➔
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
