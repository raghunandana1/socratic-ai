import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, CheckCircle2, RotateCcw } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import WordReveal from '../components/WordReveal';
import { GUIDANCE_SCENARIOS } from '../data/mockData';
import { useExam } from '../context/ExamContext';

export default function GuidanceSection() {
  const { targetExam } = useExam();
  const [currentHintLevel, setCurrentHintLevel] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

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
    <section className="scene min-h-[260svh] relative z-10" data-scene>
      <div className="scene__viewport scene-inner px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full my-auto py-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div
              data-rev
              style={{ '--d': '40ms' }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-purple text-xs font-semibold tracking-wider uppercase mb-4 shadow-glow-violet"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Interactive Tutoring Engine — {targetExam}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
              <WordReveal text="We don't solve it for you." startIndex={0} /> <br />
              <WordReveal text="We help you solve it yourself." className="text-gradient-animated" startIndex={7} />
            </h2>

            <p
              data-rev
              style={{ '--d': '80ms' }}
              className="text-sm sm:text-base text-slate-400"
            >
              Experience how SocraticAI replaces direct answer-dumping with guided micro-questions tailored specifically for {targetExam} aspirants.
            </p>
          </div>

          {/* Large Interactive Tutoring Demo Card */}
          <div
            data-rev
            style={{ '--d': '140ms' }}
            className="max-w-4xl mx-auto"
          >
            <TiltCard className="bg-[#0A0A10] border-white/10 p-5 md:p-8 shadow-2xl relative">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-cyan font-bold">
                    S
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Socratic Diagnostic Session</div>
                    <div className="text-xs text-slate-400">{scenario.subject}</div>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              </div>

              {/* Target Problem Banner */}
              <div className="bg-[#050508] rounded-xl p-4 border border-white/10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider block mb-1">Target Problem:</span>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    <span className="text-brand-cyan">{scenario.problemText}</span>
                  </div>
                </div>
                <div className="bg-brand-violet/10 text-brand-purple border border-brand-violet/20 px-3.5 py-1.5 rounded-full text-xs font-semibold self-start md:self-auto">
                  {scenario.badge}
                </div>
              </div>

              {/* Progressive Socratic Hints Stream */}
              <div className="space-y-3 mb-6">
                {scenario.hints.slice(0, currentHintLevel).map((hint) => (
                  <motion.div
                    key={hint.level}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="bg-[#0F0F1A] border border-brand-violet/30 rounded-xl p-4 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-brand-cyan">
                        {hint.title}
                      </span>
                      <span className="text-[11px] bg-brand-violet/20 text-brand-purple px-2.5 py-0.5 rounded-full">
                        {hint.chip}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-slate-100 font-medium mb-1.5 leading-relaxed">
                      "{hint.question}"
                    </p>
                    <div className="text-xs text-slate-400 italic">
                      💡 AI Guidance note: {hint.thought}
                    </div>
                  </motion.div>
                ))}

                {/* Final Discovery Card */}
                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-5 text-center backdrop-blur-md"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-1">{scenario.breakthrough.title}</h4>
                    <p className="text-sm sm:text-base text-slate-200 max-w-lg mx-auto mb-2">
                      {scenario.breakthrough.mathResult}
                    </p>
                    <span className="inline-block text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {scenario.breakthrough.reward}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  Hint Progress: <span className="text-brand-cyan font-bold">{currentHintLevel} / {scenario.hints.length}</span>
                </div>

                {!isCompleted ? (
                  <MagneticButton
                    variant="primary"
                    onClick={handleNextHint}
                  >
                    <span>{currentHintLevel === scenario.hints.length ? "Discover Solution ➔" : "Reveal Next Socratic Hint ➔"}</span>
                  </MagneticButton>
                ) : (
                  <MagneticButton
                    variant="secondary"
                    onClick={handleReset}
                  >
                    <span>Try Again</span>
                    <RotateCcw className="w-4 h-4" />
                  </MagneticButton>
                )}
              </div>

            </TiltCard>
          </div>

        </div>
      </div>
    </section>
  );
}
