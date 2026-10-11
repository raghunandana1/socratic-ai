import React, { useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Flame, Award, Zap, CheckCircle, Sparkles } from 'lucide-react';
import { useExam } from '../context/ExamContext';

export default function MasterySection() {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const {
    targetExam,
    subjectMastery,
    sessionExp,
    streakDays,
    lastPortalActivity
  } = useExam();

  const [activeExamCategory, setActiveExamCategory] = useState(targetExam || "JEE Main");
  const [xpCount, setXpCount] = useState(sessionExp || 120);

  // Sync active exam category when user changes target exam
  useEffect(() => {
    if (targetExam) {
      setActiveExamCategory(targetExam);
    }
  }, [targetExam]);

  // Smoothly animate the session reward counter whenever new XP is awarded in the portal
  useEffect(() => {
    const target = sessionExp ?? 120;
    if (!isInView) {
      setXpCount(target);
      return;
    }
    let current = xpCount;
    const diff = target - current;
    if (diff === 0) return;
    const step = diff > 0 ? Math.max(1, Math.ceil(diff / 12)) : Math.min(-1, Math.floor(diff / 12));
    const timer = setInterval(() => {
      current += step;
      if ((diff > 0 && current >= target) || (diff < 0 && current <= target)) {
        setXpCount(target);
        clearInterval(timer);
      } else {
        setXpCount(current);
      }
    }, 25);
    return () => clearInterval(timer);
  }, [isInView, sessionExp]);

  const categories = subjectMastery ? Object.keys(subjectMastery) : ["JEE Main", "JEE Advanced", "NEET UG"];
  const currentSubjects = (subjectMastery && subjectMastery[activeExamCategory]) || [];
  const totalDoubtsLogged = currentSubjects.reduce((acc, s) => acc + (s.doubtsDiagnosed || 0), 0);

  return (
    <section ref={ref} className="py-20 px-4 md:px-8 relative z-10 bg-transparent font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white text-black border-3 border-black text-[10px] font-pixel font-bold uppercase mb-4 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2 h-2 bg-[#10B981] border border-black animate-pulse" />
            <span>CONTINUOUS MASTERY TRACKING</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 font-pixel drop-shadow-[2px_2px_0px_#000]"
          >
            Every correct answer <br />
            <span className="text-white">makes the system smarter.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Track real cognitive growth. Select an exam target below to view its independently calculated mastery metrics.
          </motion.p>
        </div>

        {/* Dashboard Mastery Console Chassis */}
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-[#DC2626] border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_#000] relative rounded-none">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#EF4444] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-white border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="text-[10px] font-pixel text-black font-bold uppercase ml-1">
                  Mastery Console
                </span>
              </div>
              <div className="bg-[#0D1117] border-2 border-black px-2.5 py-0.5 text-[9px] font-pixel text-[#EF4444] font-bold shadow-[2px_2px_0px_#000]">
                LEVEL 4 CALIBRATED
              </div>
            </div>

            {/* Inner Slate Screen */}
            <div className="bg-[#1E232A] border-3 border-black p-4 sm:p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
              {/* Dynamic Live Portal Event Banner */}
              {lastPortalActivity && (Date.now() - (lastPortalActivity.timestamp || 0) < 90000) && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0C1B14] border-2 border-[#10B981] p-2.5 mb-5 flex flex-wrap items-center justify-between gap-2 shadow-[2px_2px_0px_#000]"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#10B981] animate-ping" />
                    <span className="text-[10px] font-pixel text-white">
                      PORTAL SYNC ACTIVE: Evaluated <strong className="text-white uppercase">{lastPortalActivity.subject}</strong> doubt
                      {lastPortalActivity.isSolved ? ' (Breakthrough Solved)' : ' (Diagnostic Step Recorded)'}
                    </span>
                  </div>
                  <span className="text-[9px] font-pixel bg-[#10B981] text-black px-2 py-0.5 font-bold shadow-[1px_1px_0px_#000]">
                    +{lastPortalActivity.expEarned} XP LOGGED
                  </span>
                </motion.div>
              )}

              {/* Top Stat Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b-2 border-black mb-6">
                
                {/* XP Counter Card */}
                <div className="bg-[#262D36] p-4 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-pixel text-slate-300 uppercase tracking-wider mb-1">
                      Session Reward
                    </div>
                    <div className="text-3xl font-pixel font-bold text-white tracking-tight">
                      +{xpCount} XP
                    </div>
                    <div className="text-[10px] text-slate-300 font-solution mt-1">
                      Live Portal Effort &amp; Solves Credited
                    </div>
                  </div>
                  <div className="w-11 h-11 bg-white border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                    <Zap className="w-5 h-5 text-black" />
                  </div>
                </div>

                {/* Streak Card */}
                <div className="bg-[#262D36] p-4 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-pixel text-slate-300 uppercase tracking-wider mb-1">
                      Consistency Streak
                    </div>
                    <div className="text-2xl font-pixel font-bold text-white tracking-tight">
                      {streakDays}-Day Streak
                    </div>
                    <div className="text-[10px] text-slate-300 font-solution mt-1">
                      Top 2% Aspirant Momentum
                    </div>
                  </div>
                  <div className="w-11 h-11 bg-[#EF4444] border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_#000]">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>

              </div>

              {/* Exam Category Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-2">
                <span className="text-[9px] font-pixel text-slate-300 uppercase">
                  Target Track:
                </span>
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveExamCategory(cat)}
                      className={`px-3 py-1 rounded-none text-[9px] font-pixel font-bold border-2 border-black transition-all ${
                        activeExamCategory === cat
                          ? 'bg-white text-black shadow-[2px_2px_0px_#000]'
                          : 'bg-[#262D36] text-white hover:bg-slate-700 shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Mastery Progress Bars */}
              <div className="space-y-3">
                {currentSubjects.map((subject, idx) => {
                  const isRecentlyUpdated = lastPortalActivity &&
                    lastPortalActivity.subject.toLowerCase() === subject.subject.toLowerCase() &&
                    (activeExamCategory === lastPortalActivity.exam) &&
                    (Date.now() - (lastPortalActivity.timestamp || 0) < 90000);

                  return (
                    <div
                      key={subject.id || subject.name}
                      className={`bg-[#262D36] p-3.5 border-2 transition-all ${
                        isRecentlyUpdated
                          ? 'border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                          : 'border-black shadow-[2px_2px_0px_#000]'
                      }`}
                    >
                      <div className="flex flex-wrap justify-between items-center mb-1.5 gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs sm:text-sm font-solution">{subject.name}</span>
                          <span className="text-[9px] font-pixel px-2 py-0.5 bg-white text-black border-2 border-black shadow-[1px_1px_0px_#000]">
                            {subject.level}
                          </span>
                          {isRecentlyUpdated && (
                            <span className="text-[8px] font-pixel px-1.5 py-0.5 bg-[#10B981] text-black font-bold border border-black animate-pulse">
                              JUST UPDATED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-solution text-slate-300">
                            {subject.doubtsDiagnosed || 0} doubts analyzed
                          </span>
                          <span className="text-xs sm:text-sm font-pixel font-bold text-white">
                            [{isInView ? subject.accuracy : 0}%]
                          </span>
                        </div>
                      </div>

                      <div className="w-full h-3 bg-black overflow-hidden p-0.5 border-2 border-black">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: isInView ? `${subject.accuracy}%` : 0 }}
                          transition={{ duration: 1.2, delay: 0.2 + idx * 0.15, ease: "easeOut" }}
                          className="h-full bg-[#DC2626]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Verification Note */}
              <div className="mt-6 pt-3.5 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 text-[9px] text-slate-300 font-pixel">
                <span className="flex items-center gap-1.5 text-[#10B981]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{activeExamCategory} REAL-TIME SCORE VECTOR: ACTIVE ({totalDoubtsLogged} DOUBTS LOGGED)</span>
                </span>
                <span className="text-white">REAL-TIME SYNCED WITH DOUBT PORTAL</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
