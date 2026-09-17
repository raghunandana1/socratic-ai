import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowUpRight, BarChart3, ShieldCheck } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import WordReveal from '../components/WordReveal';
import { SEPARATE_EXAM_DATA } from '../data/mockData';

export default function AdaptiveRLEngineSection() {
  const [selectedExam, setSelectedExam] = useState('JEE Main');
  const [accuracyProgress, setAccuracyProgress] = useState(0);

  const activeModelData = SEPARATE_EXAM_DATA[selectedExam];

  useEffect(() => {
    const target = activeModelData.targetAccuracy;
    setAccuracyProgress(0);
    const steps = 25;
    const duration = 800;
    const stepTime = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const val = Math.round((current / steps) * target);
      setAccuracyProgress(val);
      if (current >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [selectedExam]);

  return (
    <section id="adaptive-ai" className="scene min-h-[260svh] relative z-10 bg-bg-card/30 border-y border-white/5" data-scene>
      <div className="scene__viewport scene-inner px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full my-auto py-6">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div
              data-rev
              style={{ '--d': '40ms' }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-4 shadow-glow-cyan"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Independent Exam Diagnostic Models</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
              <WordReveal text="Your difficulty curve" startIndex={0} />{' '}
              <WordReveal text="learns with you." className="text-gradient-animated" startIndex={3} />
            </h2>

            <p
              data-rev
              style={{ '--d': '80ms' }}
              className="text-sm sm:text-base text-slate-400"
            >
              JEE Main, JEE Advanced, and NEET UG feature isolated RL diagnostic models with independent difficulty curves, accuracy benchmarks, and score predictions.
            </p>
          </div>

          {/* Separate Exam Stream Selector Tabs */}
          <div
            data-rev
            style={{ '--d': '120ms' }}
            className="flex justify-center mb-8"
          >
            <div className="bg-[#08080E] border border-white/10 p-1.5 rounded-2xl inline-flex gap-2 shadow-2xl">
              {Object.keys(SEPARATE_EXAM_DATA).map((examKey) => (
                <button
                  key={examKey}
                  onClick={() => setSelectedExam(examKey)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    selectedExam === examKey
                      ? 'bg-brand-violet text-white shadow-glow-violet scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {examKey}
                </button>
              ))}
            </div>
          </div>

          {/* Independent Exam Calculation Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">
            
            {/* Left: Exam Overview Metrics */}
            <div
              data-rev
              style={{ '--d': '160ms' }}
              className="lg:col-span-6"
            >
              <TiltCard className="h-full bg-[#08080E] border-brand-violet/30 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="text-xs text-brand-cyan font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      {activeModelData.examName}
                    </span>
                    <span className="text-[11px] text-brand-purple bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
                      Isolated Calculation
                    </span>
                  </div>

                  <div className="mb-5">
                    <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Target Concept Accuracy
                    </div>
                    <div className="text-3xl font-extrabold text-white mb-2">
                      {accuracyProgress}%
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-violet via-brand-cyan to-emerald-400 rounded-full"
                        style={{ width: `${accuracyProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-[#050508] p-3.5 rounded-xl border border-white/5">
                      <div className="text-[11px] text-slate-400">Predicted Benchmark Score</div>
                      <div className="text-base font-bold text-brand-cyan mt-0.5">
                        {activeModelData.predictedScore}
                      </div>
                    </div>

                    <div className="bg-[#050508] p-3.5 rounded-xl border border-white/5">
                      <div className="text-[11px] text-slate-400">Calibrated Question Difficulty</div>
                      <div className="text-sm font-bold text-white mt-0.5 flex items-center justify-between">
                        <span>{activeModelData.recommendedDifficulty}</span>
                        <ArrowUpRight className="w-4 h-4 text-brand-cyan" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
                  <span>Model Engine: Standalone PPO</span>
                  <span className="text-emerald-400">100% Isolated Metrics</span>
                </div>
              </TiltCard>
            </div>

            {/* Right: Independent Subtopic Mastery Breakdown */}
            <div
              data-rev
              style={{ '--d': '220ms' }}
              className="lg:col-span-6"
            >
              <TiltCard className="h-full bg-[#0A0A14] border-white/10 p-5 md:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <span className="text-xs text-slate-400 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-brand-cyan" />
                      {selectedExam} Subtopic Mastery Matrix
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Real-time Diagnostic
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {activeModelData.subtopics.map((topic) => (
                      <div key={topic.name} className="bg-[#050508] p-3 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-1.5 text-xs">
                          <span className="text-slate-200 font-bold">{topic.name}</span>
                          <span className="text-brand-cyan font-bold">{topic.score}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full transition-all duration-500"
                            style={{ width: `${topic.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 text-xs text-slate-400">
                  Subtopic parameters are computed independently for {selectedExam} without mixing with other exams.
                </div>
              </TiltCard>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
