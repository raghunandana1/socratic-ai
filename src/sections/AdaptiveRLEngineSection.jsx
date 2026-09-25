import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Target, 
  ArrowUpRight, 
  BarChart3, 
  CheckCircle, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Sliders, 
  Award,
  TrendingUp,
  Brain
} from 'lucide-react';
import TiltCard from '../components/TiltCard';
import { SEPARATE_EXAM_DATA } from '../data/mockData';
import { useExam } from '../context/ExamContext';

export default function AdaptiveRLEngineSection() {
  const { targetExam, selectExam, solvedCount } = useExam();
  
  // Track being previewed in the difficulty engine
  const [selectedExam, setSelectedExam] = useState(targetExam || 'JEE Main');
  
  // Keep selectedExam in sync with global targetExam
  useEffect(() => {
    if (targetExam) {
      setSelectedExam(targetExam);
    }
  }, [targetExam]);

  const activeModelData = SEPARATE_EXAM_DATA[selectedExam] || SEPARATE_EXAM_DATA['JEE Main'];

  // Dynamic simulation parameters
  const [simulatedAccuracy, setSimulatedAccuracy] = useState(activeModelData.targetAccuracy);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(2); // default to Calibrated Pivot
  const [isSyncedWithAccount, setIsSyncedWithAccount] = useState(false);

  // When selected exam changes, update simulated accuracy baseline
  useEffect(() => {
    setSimulatedAccuracy(activeModelData.targetAccuracy);
    setActiveMilestoneIndex(2);
    setIsSyncedWithAccount(false);
  }, [selectedExam, activeModelData.targetAccuracy]);

  // Sync with live account stats
  const handleSyncLiveStats = () => {
    setIsSyncedWithAccount(true);
    const derivedAccuracy = Math.min(97, Math.max(72, 75 + Math.floor(solvedCount * 1.8)));
    setSimulatedAccuracy(derivedAccuracy);
  };

  // Dynamic modulation factor based on accuracy (0.15 to 1.15)
  const dynamicFactor = useMemo(() => {
    return Math.max(0.15, Math.min(1.15, (simulatedAccuracy - 50) / 45));
  }, [simulatedAccuracy]);

  // Dynamically calculated metrics
  const calibratedDifficulty = useMemo(() => {
    const raw = activeModelData.baseDifficulty * (0.8 + 0.28 * dynamicFactor);
    return Math.min(10.0, Math.max(3.0, raw)).toFixed(1);
  }, [activeModelData.baseDifficulty, dynamicFactor]);

  const dynamicPredictedScore = useMemo(() => {
    if (selectedExam === 'JEE Main') {
      const score = Math.round(180 + dynamicFactor * 90);
      const percentile = (97.0 + dynamicFactor * 2.9).toFixed(2);
      return `${Math.min(295, score)} / 300 (${Math.min(99.9, percentile)}%ile)`;
    } else if (selectedExam === 'JEE Advanced') {
      const score = Math.round(140 + dynamicFactor * 95);
      const air = Math.max(120, Math.round(2500 - dynamicFactor * 2000));
      return `${Math.min(330, score)} / 360 (Target AIR < ${air})`;
    } else {
      const score = Math.round(590 + dynamicFactor * 125);
      return `${Math.min(715, score)} / 720 (Top GMC Target)`;
    }
  }, [selectedExam, dynamicFactor]);

  const dynamicEntropy = useMemo(() => {
    return (0.048 - dynamicFactor * 0.032).toFixed(3);
  }, [dynamicFactor]);

  const dynamicScaffoldingRate = useMemo(() => {
    return Math.max(4, Math.round(48 - dynamicFactor * 38));
  }, [dynamicFactor]);

  // Dynamic coordinates for SVG Spline
  const svgWidth = 740;
  const svgHeight = 280;
  const xPositions = [70, 220, 370, 520, 670];

  const curvePoints = useMemo(() => {
    return activeModelData.milestones.map((m, i) => {
      const x = xPositions[i];
      const dynDiff = Math.min(10.0, Math.max(1.8, m.difficulty * (0.78 + 0.28 * dynamicFactor)));
      const y = 245 - (dynDiff / 10.5) * 200;
      return {
        ...m,
        x,
        y,
        dynDiff: dynDiff.toFixed(1)
      };
    });
  }, [activeModelData.milestones, dynamicFactor]);

  // Generate cubic bezier curve path through points
  const curvePaths = useMemo(() => {
    if (curvePoints.length < 2) return { line: '', area: '' };

    let d = `M ${curvePoints[0].x} ${curvePoints[0].y}`;
    for (let i = 0; i < curvePoints.length - 1; i++) {
      const p0 = i > 0 ? curvePoints[i - 1] : curvePoints[i];
      const p1 = curvePoints[i];
      const p2 = curvePoints[i + 1];
      const p3 = i !== curvePoints.length - 2 ? curvePoints[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 5.2;
      const cp1y = p1.y + (p2.y - p0.y) / 5.2;
      const cp2x = p2.x - (p3.x - p1.x) / 5.2;
      const cp2y = p2.y - (p3.y - p1.y) / 5.2;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }

    const area = `${d} L ${curvePoints[curvePoints.length - 1].x} 255 L ${curvePoints[0].x} 255 Z`;
    return { line: d, area };
  }, [curvePoints]);

  const activeMilestone = curvePoints[activeMilestoneIndex] || curvePoints[2];

  // Handle switching active site track and reloading page from beginning
  const handleActivateTrack = (examKey) => {
    selectExam(examKey);
  };

  return (
    <section id="adaptive-ai" className="py-24 px-4 md:px-8 relative z-10 bg-bg-card/30 border-y border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-violet/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-4 shadow-glow-cyan"
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>Dynamic PPO Diagnostic Policy</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-5"
          >
            Your difficulty curve <span className="text-gradient-animated">learns with you.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-400"
          >
            SocraticAI replaces fixed question banks with an adaptive Item-Response curve. Adjust your accuracy simulator or sync your live stats to see the AI dynamically modulate cognitive load in real-time.
          </motion.p>
        </div>

        {/* Separate Exam Stream Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <div className="bg-[#08080E] border border-white/10 p-1.5 rounded-2xl inline-flex gap-2 shadow-2xl">
            {Object.keys(SEPARATE_EXAM_DATA).map((examKey) => (
              <button
                key={examKey}
                onClick={() => setSelectedExam(examKey)}
                className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-300 relative ${
                  selectedExam === examKey
                    ? 'bg-brand-violet text-white shadow-glow-violet scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{examKey}</span>
                {targetExam === examKey && (
                  <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-brand-cyan" title="Currently Active Track" />
                )}
              </button>
            ))}
          </div>

          {/* If inspected curve differs from active track, offer 1-click switch & start from beginning */}
          {selectedExam !== targetExam ? (
            <button
              onClick={() => handleActivateTrack(selectedExam)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/40 text-brand-cyan text-xs font-mono font-bold transition-all shadow-glow-cyan"
            >
              <span>Activate {selectedExam} & Start from Beginning</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Active Target Exam Track</span>
            </div>
          )}
        </div>

        {/* Dynamic Simulator Control Bar */}
        <div className="max-w-5xl mx-auto mb-10 bg-[#090914] border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Slider Control */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-brand-cyan" />
                  Simulate Student Solve Accuracy
                </span>
                <span className="text-sm font-mono font-extrabold text-brand-cyan">
                  {simulatedAccuracy}% Concept Accuracy
                </span>
              </div>
              <input
                type="range"
                min="55"
                max="98"
                step="1"
                value={simulatedAccuracy}
                onChange={(e) => {
                  setSimulatedAccuracy(Number(e.target.value));
                  setIsSyncedWithAccount(false);
                }}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00F0FF]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>55% (Scaffolding Heavy)</span>
                <span>80% (Calibrated Pace)</span>
                <span>98% (Rank Decider Sprint)</span>
              </div>
            </div>

            {/* Quick Presets & Account Sync */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setSimulatedAccuracy(65);
                  setIsSyncedWithAccount(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  simulatedAccuracy === 65 && !isSyncedWithAccount
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Foundation (65%)
              </button>
              <button
                onClick={() => {
                  setSimulatedAccuracy(85);
                  setIsSyncedWithAccount(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  simulatedAccuracy === 85 && !isSyncedWithAccount
                    ? 'bg-brand-violet/30 border-brand-violet/50 text-brand-purple'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                Target (85%)
              </button>
              <button
                onClick={() => {
                  setSimulatedAccuracy(96);
                  setIsSyncedWithAccount(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                  simulatedAccuracy === 96 && !isSyncedWithAccount
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                AIR Decider (96%)
              </button>
              
              <button
                onClick={handleSyncLiveStats}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 transition-all ${
                  isSyncedWithAccount
                    ? 'bg-brand-cyan/20 border-brand-cyan/60 text-brand-cyan shadow-glow-cyan'
                    : 'bg-brand-cyan/5 border-brand-cyan/30 text-brand-cyan hover:bg-brand-cyan/10'
                }`}
                title="Sync with your current session solved count & XP"
              >
                <Zap className="w-3 h-3 text-brand-cyan" />
                <span>Sync My Stats ({solvedCount} Solved)</span>
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic SVG Difficulty Curve Visualization Card */}
        <div className="max-w-5xl mx-auto mb-12">
          <TiltCard className="bg-[#08080E] border-brand-cyan/30 p-5 sm:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
            
            {/* Card Header & Dynamic Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-cyan" />
                  <span className="text-sm font-mono font-bold text-white">
                    {activeModelData.curveType}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Real-time cognitive load progression through 5 diagnostic milestones
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-brand-violet/15 border border-brand-violet/30 text-brand-cyan">
                  Calibrated Level: <strong className="text-white">{calibratedDifficulty} / 10</strong>
                </span>
                <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Policy Entropy: {dynamicEntropy}
                </span>
              </div>
            </div>

            {/* SVG Visual Difficulty Curve */}
            <div className="w-full overflow-x-auto pb-2">
              <div className="min-w-[680px]">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto overflow-visible select-none"
                >
                  <defs>
                    {/* Dynamic Gradient Area Fill */}
                    <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeModelData.strokeColor} stopOpacity="0.32" />
                      <stop offset="60%" stopColor="#7928CA" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#050507" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Glowing Stroke Filter */}
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Horizontal Grid & Difficulty Zones */}
                  {[
                    { label: "10.0 (Olympiad / AIR Decider)", y: 55 },
                    { label: "7.5 (Advanced Multi-Concept)", y: 110 },
                    { label: "5.0 (Standard Exam Problem)", y: 165 },
                    { label: "2.5 (NCERT Foundation)", y: 220 }
                  ].map((grid, idx) => (
                    <g key={idx}>
                      <line
                        x1="50"
                        y1={grid.y}
                        x2="700"
                        y2={grid.y}
                        stroke="rgba(255, 255, 255, 0.07)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x="45"
                        y={grid.y + 3}
                        textAnchor="end"
                        fill="rgba(148, 163, 184, 0.55)"
                        fontSize="9"
                        fontFamily="monospace"
                      >
                        {grid.label}
                      </text>
                    </g>
                  ))}

                  {/* Baseline Axis */}
                  <line x1="50" y1="255" x2="700" y2="255" stroke="rgba(255, 255, 255, 0.15)" />

                  {/* Filled Area under Curve */}
                  <path
                    d={curvePaths.area}
                    fill="url(#curveGradient)"
                    className="transition-all duration-500 ease-out"
                  />

                  {/* Main Dynamic Spline Curve */}
                  <path
                    d={curvePaths.line}
                    fill="none"
                    stroke={activeModelData.strokeColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    filter="url(#neonGlow)"
                    className="transition-all duration-500 ease-out"
                  />

                  {/* Dynamic Milestone Points along the curve */}
                  {curvePoints.map((pt, i) => {
                    const isActive = activeMilestoneIndex === i;
                    return (
                      <g
                        key={pt.id}
                        onClick={() => setActiveMilestoneIndex(i)}
                        className="cursor-pointer group"
                      >
                        {/* Interactive hit area */}
                        <circle cx={pt.x} cy={pt.y} r="22" fill="transparent" />

                        {/* Animated concentric beacon if currently active node */}
                        {isActive && (
                          <>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="16"
                              fill="none"
                              stroke={activeModelData.strokeColor}
                              strokeWidth="1.5"
                              opacity="0.4"
                              className="animate-ping"
                            />
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="12"
                              fill="none"
                              stroke={activeModelData.strokeColor}
                              strokeWidth="2"
                              opacity="0.7"
                            />
                          </>
                        )}

                        {/* Milestone Node Center Circle */}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={isActive ? "7" : "5"}
                          fill={isActive ? "#FFFFFF" : activeModelData.strokeColor}
                          stroke="#08080E"
                          strokeWidth="2.5"
                          className="transition-all duration-300 group-hover:scale-125"
                        />

                        {/* Node Label on X-Axis */}
                        <text
                          x={pt.x}
                          y="273"
                          textAnchor="middle"
                          fill={isActive ? "#00F0FF" : "rgba(203, 213, 225, 0.75)"}
                          fontSize="10"
                          fontWeight={isActive ? "bold" : "normal"}
                          fontFamily="monospace"
                        >
                          {pt.stage}
                        </text>

                        {/* Floating Difficulty Tag Above Node */}
                        <g transform={`translate(${pt.x}, ${pt.y - 14})`}>
                          <rect
                            x="-22"
                            y="-14"
                            width="44"
                            height="16"
                            rx="5"
                            fill={isActive ? activeModelData.strokeColor : "#12121E"}
                            stroke="rgba(255,255,255,0.15)"
                          />
                          <text
                            x="0"
                            y="-3"
                            textAnchor="middle"
                            fill={isActive ? "#050507" : "#CBD5E1"}
                            fontSize="9"
                            fontWeight="bold"
                            fontFamily="monospace"
                          >
                            Lv {pt.dynDiff}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Milestone Inspection Panel */}
            <div className="mt-6 pt-5 border-t border-white/10 bg-[#06060B] rounded-2xl p-4 sm:p-5 border border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-brand-cyan/15 text-brand-cyan font-mono text-xs font-bold border border-brand-cyan/30">
                    {activeMilestone.stage}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white font-mono">
                    {activeMilestone.title}
                  </h4>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Calibrated Cognitive Index: <span className="text-brand-cyan font-bold">Level {activeMilestone.dynDiff} / 10</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-[#0B0B14] p-3 rounded-xl border border-white/5">
                  <div className="text-slate-400 text-[11px] mb-0.5">Tested Concept</div>
                  <div className="text-white font-semibold">{activeMilestone.concept}</div>
                </div>

                <div className="bg-[#0B0B14] p-3 rounded-xl border border-white/5">
                  <div className="text-slate-400 text-[11px] mb-0.5">Cognitive Skill</div>
                  <div className="text-brand-purple font-semibold">{activeMilestone.cognitiveSkill}</div>
                </div>

                <div className="bg-[#0B0B14] p-3 rounded-xl border border-white/5">
                  <div className="text-slate-400 text-[11px] mb-0.5">Scaffolding Mode</div>
                  <div className="text-emerald-400 font-semibold">{activeMilestone.scaffolding}</div>
                </div>
              </div>
            </div>

          </TiltCard>
        </div>

        {/* Dynamic Real-Time Diagnostic Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* Left: Dynamic Live Metric Tiles */}
          <div className="lg:col-span-6">
            <TiltCard className="h-full bg-[#08080E] border-brand-violet/30 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <span className="text-xs font-mono text-brand-cyan font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    {activeModelData.examName}
                  </span>
                  <span className="text-[11px] font-mono text-brand-purple bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
                    Isolated Calculation
                  </span>
                </div>

                <div className="mb-6">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Simulated Concept Accuracy
                  </div>
                  <div className="text-4xl font-mono font-extrabold text-white mb-2">
                    {simulatedAccuracy}%
                  </div>
                  <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-violet via-brand-cyan to-emerald-400 rounded-full transition-all duration-300"
                      style={{ width: `${simulatedAccuracy}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#050508] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">Dynamic Score Prediction</div>
                      <div className="text-lg font-bold text-brand-cyan font-mono mt-0.5">
                        {dynamicPredictedScore}
                      </div>
                    </div>
                    <Award className="w-6 h-6 text-brand-cyan/60" />
                  </div>

                  <div className="bg-[#050508] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">Calibrated RL Difficulty Rating</div>
                      <div className="text-base font-bold text-white font-mono mt-0.5">
                        Level {calibratedDifficulty} / 10 — {activeModelData.recommendedDifficulty}
                      </div>
                    </div>
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div className="bg-[#050508] p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-mono text-slate-400">Autonomous Scaffolding Rate</div>
                      <div className="text-sm font-bold text-brand-purple font-mono mt-0.5">
                        {dynamicScaffoldingRate}% Scaffolding Needed (Autonomous Growth)
                      </div>
                    </div>
                    <Brain className="w-5 h-5 text-brand-purple" />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Model Engine: Standalone PPO</span>
                <span className="text-emerald-400">100% Dynamic Calibration</span>
              </div>
            </TiltCard>
          </div>

          {/* Right: Subtopic Mastery Matrix dynamically scaling with accuracy */}
          <div className="lg:col-span-6">
            <TiltCard className="h-full bg-[#0A0A14] border-white/10 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand-cyan" />
                    {selectedExam} Subtopic Mastery Matrix
                  </span>
                  <span className="text-[11px] font-mono text-brand-cyan">
                    Dynamic Real-time
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {activeModelData.subtopics.map((topic) => {
                    const dynamicScore = Math.min(99, Math.max(50, Math.round(topic.score * (0.8 + 0.25 * dynamicFactor))));
                    return (
                      <div key={topic.name} className="bg-[#050508] p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
                          <span className="text-slate-200 font-bold">{topic.name}</span>
                          <span className="text-brand-cyan font-bold">{dynamicScore}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-violet to-brand-cyan rounded-full transition-all duration-300"
                            style={{ width: `${dynamicScore}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-1 text-[10px] font-mono text-slate-500">
                          <span>Exam Weight: {topic.weight || "25%"}</span>
                          <span className={dynamicScore >= 90 ? "text-emerald-400" : dynamicScore >= 75 ? "text-brand-cyan" : "text-amber-400"}>
                            {dynamicScore >= 90 ? "Mastery Achieved" : dynamicScore >= 75 ? "Target Calibrated" : "Reinforcement Active"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
                Subtopic parameters are computed independently for {selectedExam} without mixing with other exams.
              </div>
            </TiltCard>
          </div>

        </div>

      </div>
    </section>
  );
}
