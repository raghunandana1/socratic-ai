import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Camera, Upload, X, CheckCircle2, FileJson, Sparkles, BookOpen, Layers, HelpCircle, Download, Lightbulb, AlertTriangle, ArrowRight, RotateCcw, Zap, Lock, TrendingUp } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import { useExam } from '../context/ExamContext';

function CognitiveMasteryCurveCard({
  metrics,
  hintsUsed = 0,
  feedbackForStudent,
  targetExam = 'JEE Main'
}) {
  const percentage = metrics?.percentage || (hintsUsed === 0 ? 98 : hintsUsed === 1 ? 88 : hintsUsed === 2 ? 76 : hintsUsed === 3 ? 64 : 52);
  const percentile = metrics?.percentile || (hintsUsed === 0 ? "Top 2% Percentile (Mastery Tier)" : hintsUsed === 1 ? "Top 8% Percentile (Advanced Tier)" : "Top 18% Percentile (Proficient Tier)");
  const status = metrics?.status || (hintsUsed === 0 ? "Exceptional First-Principle Breakthrough" : hintsUsed === 1 ? "Rapid Guided Adaptation" : "Solid Concept Retrieval");
  const retention = metrics?.retentionScore || (hintsUsed === 0 ? 96 : hintsUsed === 1 ? 91 : hintsUsed === 2 ? 84 : 75);
  const conceptGrasp = metrics?.conceptGrasp || Math.min(99, percentage + 2);
  const executionPrecision = metrics?.executionPrecision || Math.min(98, percentage - 3);
  const socraticAutonomy = metrics?.socraticAutonomy || Math.max(25, 100 - hintsUsed * 16);

  // SVG Geometry for 72h Retention Curve
  // Width: 480, Height: 150
  // Y coordinate mapping: 100% -> Y=20, 0% -> Y=130
  const getY = (val) => 130 - (val / 100) * 110;
  const yStart = getY(percentage);
  const yMid1 = getY(Math.max(percentage - 4, retention + 2));
  const yMid2 = getY(retention + 1);
  const yEnd = getY(retention);

  // Socratic path: starts at yStart, remains high over 72h
  const socraticPath = `M 40 ${yStart} C 120 ${yStart}, 180 ${yMid1}, 260 ${yMid1} C 330 ${yMid2}, 380 ${yEnd}, 440 ${yEnd}`;
  const socraticArea = `${socraticPath} L 440 130 L 40 130 Z`;

  // Passive forgetting curve: starts at 100% (Y=20), drops to 33% at 24h, 20% at 48h, 15% at 72h
  const passivePath = `M 40 20 C 100 20, 160 93, 240 102 C 320 110, 380 112, 440 113.5`;

  // Circular gauge calculations (r=30, circ=188.5)
  const radius = 30;
  const circ = 2 * Math.PI * radius;
  const strokeOffset = circ - (percentage / 100) * circ;

  const scrollToLeaderboard = () => {
    const el = document.querySelector('#leaderboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="pixel-panel rounded-none border-2 border-emerald-500/50 p-5 sm:p-7 mb-6 shadow-pixel-block-emerald relative overflow-hidden bg-[#090915]"
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-emerald-400 pointer-events-none" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-400 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-brand-cyan pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-cyan pointer-events-none" />

      {/* CRT scanlines overlay */}
      <div className="absolute inset-0 crt-scanlines opacity-15 pointer-events-none" />

      {/* Breakthrough Badge & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          {/* Circular Percentage Meter */}
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 76 76">
              <circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-white/10"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="38"
                cy="38"
                r={radius}
                className="stroke-emerald-400"
                strokeWidth="6"
                strokeLinecap="square"
                fill="none"
                initial={{ strokeDashoffset: circ }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                style={{ strokeDasharray: circ }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono font-black text-xl text-white leading-none">
                {percentage}%
              </span>
              <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                MASTERY
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-[2px_2px_0px_#000] rounded-none">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                [ COGNITIVE_BREAKTHROUGH ]
              </span>
              <span className="px-2 py-0.5 bg-brand-violet/20 border-2 border-brand-violet/50 text-brand-cyan font-mono text-xs font-semibold shadow-[2px_2px_0px_#000] rounded-none">
                [ {percentile} ]
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white font-mono leading-tight">
              {status}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-solution mt-1 leading-relaxed">
              {feedbackForStudent || "Outstanding deduction! You mastered this problem through graduated diagnostic inquiry."}
            </p>
          </div>
        </div>

        {/* Retention Tier Badge */}
        <div className="px-3.5 py-2 bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 shadow-pixel-block rounded-none self-stretch sm:self-auto justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <div className="text-left">
            <div className="text-emerald-200 leading-none">[{retention}% 72H RETENTION]</div>
            <div className="text-[10px] text-emerald-400/80 font-normal mt-0.5">({hintsUsed} {hintsUsed === 1 ? 'hint' : 'hints'} used)</div>
          </div>
        </div>
      </div>

      {/* SVG Cognitive Retention Curve Visual */}
      <div className="py-6 border-b border-white/10 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-brand-cyan" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Cognitive Retention Curve vs Passive Decay (72h Horizon)
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-brand-cyan font-bold">
              <span className="w-2.5 h-2.5 bg-brand-cyan shadow-[0_0_8px_#06B6D4]" />
              Socratic Active Recall ({retention}%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-3 h-1 bg-rose-400" />
              Passive Answer Dumping (15%)
            </span>
          </div>
        </div>

        <div className="relative w-full h-40 bg-[#06060E]/90 rounded-none border-2 border-white/15 p-2 overflow-hidden shadow-pixel-block">
          <svg className="w-full h-full" viewBox="0 0 480 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id="socraticCurveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[20, 56, 93, 130].map((y, idx) => (
              <line
                key={idx}
                x1="40"
                y1={y}
                x2="460"
                y2={y}
                stroke="rgba(255,255,255,0.07)"
                strokeDasharray="3 4"
              />
            ))}

            {/* Y Axis percentage markers */}
            <text x="32" y="24" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">100%</text>
            <text x="32" y="60" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">70%</text>
            <text x="32" y="97" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">40%</text>
            <text x="32" y="133" fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="end">10%</text>

            {/* Passive Forgetting Curve (Ebbinghaus Decay) */}
            <path
              d={passivePath}
              fill="none"
              stroke="#F43F5E"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.8"
            />

            {/* Socratic Area Fill */}
            <motion.path
              d={socraticArea}
              fill="url(#socraticCurveGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />

            {/* Socratic Curve Line */}
            <motion.path
              d={socraticPath}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* Socratic Node Markers */}
            <rect x="36" y={yStart - 4} width="8" height="8" fill="#06B6D4" stroke="#06060E" strokeWidth="2" />
            <rect x="256" y={yMid1 - 4} width="8" height="8" fill="#06B6D4" stroke="#06060E" strokeWidth="2" />
            <rect x="436" y={yEnd - 4} width="8" height="8" fill="#10B981" stroke="#06060E" strokeWidth="2" />

            {/* Timeline X Labels */}
            <text x="40" y="145" fill="#94A3B8" fontSize="9" fontFamily="monospace">Breakthrough (0h)</text>
            <text x="170" y="145" fill="#94A3B8" fontSize="9" fontFamily="monospace">24h</text>
            <text x="300" y="145" fill="#94A3B8" fontSize="9" fontFamily="monospace">48h</text>
            <text x="440" y="145" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="end">72h ({retention}% Recall)</text>
          </svg>
        </div>
      </div>

      {/* Multi-Dimensional Competency Breakdown — Segmented Energy Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-5 border-b border-white/10 relative z-10 font-mono text-xs">
        <div className="bg-[#05050A] p-3.5 border-2 border-white/15 shadow-pixel-block">
          <div className="flex justify-between text-slate-300 mb-1.5 text-[11px]">
            <span>CONCEPTUAL_GRASP</span>
            <span className="text-brand-cyan font-bold">[{conceptGrasp}%]</span>
          </div>
          <div className="h-2.5 w-full bg-white/10 overflow-hidden border border-white/10 p-0.5">
            <div className="h-full bg-brand-cyan pixel-energy-bar transition-all duration-1000" style={{ width: `${conceptGrasp}%` }} />
          </div>
        </div>

        <div className="bg-[#05050A] p-3.5 border-2 border-white/15 shadow-pixel-block">
          <div className="flex justify-between text-slate-300 mb-1.5 text-[11px]">
            <span>EXECUTION_PRECISION</span>
            <span className="text-purple-400 font-bold">[{executionPrecision}%]</span>
          </div>
          <div className="h-2.5 w-full bg-white/10 overflow-hidden border border-white/10 p-0.5">
            <div className="h-full bg-purple-400 pixel-energy-bar transition-all duration-1000" style={{ width: `${executionPrecision}%` }} />
          </div>
        </div>

        <div className="bg-[#05050A] p-3.5 border-2 border-white/15 shadow-pixel-block">
          <div className="flex justify-between text-slate-300 mb-1.5 text-[11px]">
            <span>SOCRATIC_AUTONOMY</span>
            <span className="text-emerald-400 font-bold">[{socraticAutonomy}%]</span>
          </div>
          <div className="h-2.5 w-full bg-white/10 overflow-hidden border border-white/10 p-0.5">
            <div className="h-full bg-emerald-400 pixel-energy-bar transition-all duration-1000" style={{ width: `${socraticAutonomy}%` }} />
          </div>
        </div>
      </div>

      {/* Diagnostic Mastery Summary & Retention Horizon */}
      <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="text-xs font-sans text-slate-300">
          <div className="font-mono font-bold text-white flex items-center gap-2 mb-1">
            <span className="text-emerald-400 font-bold">[{percentage}% COGNITIVE MASTERY CONFIRMED]</span>
            <span className="text-slate-600">•</span>
            <span className="text-brand-cyan font-mono">{targetExam} Syllabus Standard</span>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Self-derived Socratic reasoning stabilizes neural synaptic retention at <strong className="text-white">[{retention}% recall]</strong> over next 72 hours.
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.querySelector('#doubt-portal');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-4 py-2 bg-brand-violet text-white text-xs font-mono font-bold flex items-center gap-2 transition-all border-2 border-brand-violet shadow-pixel-block-violet pixel-block-btn self-stretch sm:self-auto justify-center rounded-none"
        >
          <span>[ DIAGNOSE ANOTHER DOUBT ➔ ]</span>
        </button>
      </div>
    </motion.div>
  );
}

export default function DoubtPortalSection() {
  const { 
    targetExam, 
    setTargetExam,
    addExp,
    recordDoubtActivity
  } = useExam();

  const [errorTag, setErrorTag] = useState('Conceptual Blindspot');
  const [questionText, setQuestionText] = useState('');

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);
  const [activeHintStep, setActiveHintStep] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, model: '', isLiveAI: false });

  // Sequential Unlock & Retry Session State
  const [activeSession, setActiveSession] = useState(null);
  const [retryText, setRetryText] = useState('');
  const [retryImageFile, setRetryImageFile] = useState(null);
  const [retryImagePreview, setRetryImagePreview] = useState(null);
  const [isSubmittingRetry, setIsSubmittingRetry] = useState(false);
  const [partialNotice, setPartialNotice] = useState(null);

  const fileInputRef = useRef(null);
  const retryFileInputRef = useRef(null);
  const awardedSessionsRef = useRef(new Set());

  // Resolves backend API URL (Localhost in dev, Render in production)
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/+$/, '');

  // Monitor Live Backend Status
  useEffect(() => {
    let isMounted = true;
    async function checkBackend() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/health`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setBackendStatus({
              online: true,
              model: data.gemini?.model || 'gemini-1.5-flash',
              isLiveAI: Boolean(data.gemini?.isKeyConfigured)
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setBackendStatus({ online: false, model: '', isLiveAI: false });
        }
      }
    }
    checkBackend();
    const interval = setInterval(checkBackend, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

// Helper to convert any raw LaTeX or formula syntax into natural, human-readable text
  function cleanMathText(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
    .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, '$1√($2)')
    .replace(/\\implies/g, '➔')
    .replace(/\\iff/g, '⟺')
    .replace(/\\to/g, '→')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\infty/g, '∞')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\vec\{([^}]+)\}/g, '$1_vector')
    .replace(/\\hat\{([^}]+)\}/g, '$1_unit')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\$+/g, '')
    .replace(/\\int_\{?([^}^_]+)\}?\^\{?([^}]+)\}?/g, '∫[$1 to $2]')
    .replace(/\\int/g, '∫')
    .replace(/\\sum_\{?([^}^_]+)\}?\^\{?([^}]+)\}?/g, '∑[$1 to $2]')
    .replace(/\\sum/g, '∑')
    .trim();
}

  // Heuristic detector for fallback subject & chapter
  const detectSubjectAndChapter = (text) => {
    const t = (text || '').toLowerCase();
    
    // Biology detection (especially prioritized for NEET UG)
    if (
      t.includes('cell') || t.includes('genetic') || t.includes('dna') || t.includes('rna') ||
      t.includes('nephron') || t.includes('cardiac') || t.includes('heart') || t.includes('enzyme') ||
      t.includes('photosynthesis') || t.includes('respiration') || t.includes('neuron') || t.includes('synap') ||
      t.includes('biology') || t.includes('plant') || t.includes('hormone') || t.includes('mitosis') ||
      t.includes('meiosis') || t.includes('botan') || t.includes('zool') || t.includes('axon')
    ) {
      return {
        subject: 'Biology',
        chapter: (t.includes('genet') || t.includes('dna')) ? 'Genetics & Molecular Basis' : (t.includes('cell') || t.includes('mitosis')) ? 'Cell Structure & Division' : 'Human Physiology',
        subtopic: (t.includes('synap') || t.includes('neuron') || t.includes('axon')) ? 'Action Potential & Synaptic Transmission' : (t.includes('genet') || t.includes('dna')) ? 'Mendelian Inheritance' : 'Cellular Physiology'
      };
    }

    // Chemistry detection
    if (
      t.includes('reaction') || t.includes('carbocation') || t.includes('acid') || t.includes('base') ||
      t.includes('aldehyde') || t.includes('electrophil') || t.includes('nucleophil') || t.includes('benzene') ||
      t.includes('molar') || t.includes('equilibrium') || t.includes('hybridization') || t.includes('thermodynamic')
    ) {
      return {
        subject: 'Chemistry',
        chapter: (t.includes('carbocation') || t.includes('electrophil')) ? 'Organic Mechanisms' : 'Physical & Inorganic Chemistry',
        subtopic: t.includes('carbocation') ? 'Carbocation Rearrangements & Intermediates' : 'Chemical Equilibrium & Kinetics'
      };
    }

    // Mathematics detection
    if (
      t.includes('integral') || t.includes('derivative') || t.includes('quadratic') || t.includes('roots') ||
      t.includes('matrix') || t.includes('determinant') || t.includes('calculus') || t.includes('vector') ||
      t.includes('trig') || t.includes('limit') || t.includes('pen') || t.includes('distribute') ||
      t.includes('ways') || t.includes('identical') || t.includes('permutation') || t.includes('combination') ||
      t.includes('arrange') || t.includes('select') || t.includes('red') || t.includes('blue') || t.includes('person')
    ) {
      return {
        subject: 'Mathematics',
        chapter: (t.includes('pen') || t.includes('distribute') || t.includes('identical') || t.includes('ways') || t.includes('permutation') || t.includes('combination'))
          ? 'Permutations & Combinations'
          : t.includes('integral') ? 'Definite Integrals'
          : t.includes('quadratic') ? 'Quadratic Equations'
          : 'Calculus & Algebra',
        subtopic: (t.includes('pen') || t.includes('distribute') || t.includes('identical'))
          ? 'Distribution of Identical Objects (Stars & Bars)'
          : t.includes('integral') ? 'Integration by Parts'
          : 'Algebraic & Combinatorial Constraints'
      };
    }

    // Physics detection
    if (
      t.includes('torque') || t.includes('angular') || t.includes('inertia') || t.includes('rotat') ||
      t.includes('force') || t.includes('momentum') || t.includes('velocity') || t.includes('kinetic') ||
      t.includes('optics') || t.includes('lens') || t.includes('circuit') || t.includes('friction')
    ) {
      return {
        subject: 'Physics',
        chapter: (t.includes('torque') || t.includes('inertia') || t.includes('angular')) ? 'Rotational Mechanics' : 'Mechanics & Dynamics',
        subtopic: (t.includes('torque') || t.includes('angular')) ? 'Torque & Angular Acceleration' : 'Conservation Laws'
      };
    }

    if (targetExam === 'NEET UG') {
      return {
        subject: 'Biology',
        chapter: 'Human Physiology & Genetics',
        subtopic: 'Physiological Regulation & Homeostasis'
      };
    }

    return {
      subject: 'Mathematics',
      chapter: 'Algebraic & Discrete Mathematics',
      subtopic: 'System of Constraints & Problem Solving'
    };
  };

  // Generate dynamic Socratic Hints based on user's query and auto-detected context
  const generateDynamicSocraticDiagnosis = (query, errorType) => {
    const detected = detectSubjectAndChapter(query);
    let errorTitle = errorType || "Conceptual Blindspot";
    let errorDescription = `Identified discrepancy in fundamental principles within ${detected.subtopic}.`;

    if (errorType === 'Calculation Slip') {
      errorTitle = "Algebraic / Arithmetic Slip";
      errorDescription = `Sign error or coefficient slip during intermediate calculation in ${detected.chapter}.`;
    } else if (errorType === 'Formula Amnesia') {
      errorTitle = "Formula Misapplication";
      errorDescription = `Incomplete identity formulation or misapplied standard equation in ${detected.subtopic}.`;
    } else if (errorType === 'Execution Bottleneck' || errorType === 'Execution Slip') {
      errorTitle = "Execution Step Error";
      errorDescription = `Stalled progress during algebraic substitution or boundary reduction step in ${detected.chapter}.`;
    }

    let hints = [];
    if (detected.subject === 'Biology') {
      hints = [
        "Recall the physiological membrane potential changes during depolarization (voltage-gated Na+ influx vs K+ efflux).",
        "Trace the specific biochemical cascade or regulatory receptor involved at this stage.",
        "Consider what refractory period or enzymatic feedback mechanism governs the directional transmission.",
        "Synthesize the physiological outcome by applying the all-or-none principle."
      ];
    } else if (detected.subject === 'Physics') {
      hints = [
        "Identify the system's conserved quantities (energy, momentum, or charge) and state your chosen coordinate origin.",
        "Apply the governing law relating the field, force, or torque to the distance parameter.",
        "Recall that torque is r * F * sin(theta), where theta is the angle between the position vector and the force vector.",
        "Equate the net torque to I * alpha and solve for the target angular acceleration."
      ];
    } else if (detected.subject === 'Chemistry') {
      hints = [
        "Identify which reactant acts as the electrophile and which bond possesses the highest electron density.",
        "Examine intermediate carbocation / transition state stability (+I effect, hyperconjugation, or resonance).",
        "Consider the attacking nucleophile and steric hindrance around the reactive center.",
        "Direct the nucleophile to the most stable reactive center to form the major thermodynamic product."
      ];
    } else if (detected.chapter.includes('Permutations')) {
      hints = [
        "State the constraint: Each of the 4 persons gets 6 pens in total, so R_i + B_i = 6 for each person i.",
        "Express B_i in terms of R_i: B_i = 6 - R_i. Substitute into B_1 + B_2 + B_3 + B_4 = 14.",
        "Check non-negative integer bounds: 0 <= R_i <= 6 and 0 <= B_i <= 6 (which implies 0 <= R_i <= 6).",
        "Find the coefficient of x^10 in generating functions or use stars-and-bars with upper bound constraints."
      ];
    } else {
      hints = [
        "Write down the governing constraints and check whether domain restrictions or boundary values limit your variables.",
        "Look for an algebraic restructuring: can you complete the square, group terms, or apply a known symmetry?",
        "Recall the discriminant formula D = b^2 - 4*a*c and examine the sign requirements for real roots.",
        "Combine your inequality constraints to isolate and solve for the target parameter."
      ];
    }

    return {
      detectedSubject: detected.subject,
      detectedChapter: detected.chapter,
      detectedSubtopic: detected.subtopic,
      errorTitle,
      errorDescription,
      hints
    };
  };

  // Compute Cognitive Performance Metrics & Retention Curve parameters
  const computeMasteryMetrics = (hintsUsed = 0, attemptsCount = 1, isSolved = false) => {
    if (!isSolved) {
      const inProgressPercentage = Math.min(65, 35 + (attemptsCount - 1) * 15);
      return {
        percentage: inProgressPercentage,
        status: "In Progress — Guided Refinement",
        percentile: "Top 45% Iteration Rate",
        conceptGrasp: Math.min(75, 45 + attemptsCount * 10),
        executionPrecision: 55,
        socraticAutonomy: Math.max(30, 85 - hintsUsed * 12),
        retentionScore: 68
      };
    }

    let percentage = 98;
    let percentile = "Top 2% Percentile (Mastery Tier)";
    let status = "Exceptional First-Principle Breakthrough";
    let retention = 96;

    if (hintsUsed === 1) {
      percentage = 88;
      percentile = "Top 8% Percentile (Advanced Tier)";
      status = "Rapid Guided Adaptation";
      retention = 91;
    } else if (hintsUsed === 2) {
      percentage = 76;
      percentile = "Top 18% Percentile (Proficient Tier)";
      status = "Solid Concept Retrieval";
      retention = 84;
    } else if (hintsUsed === 3) {
      percentage = 64;
      percentile = "Top 35% Percentile (Progressing Tier)";
      status = "Scaffolded Progression";
      retention = 75;
    } else if (hintsUsed >= 4) {
      percentage = 52;
      percentile = "Top 55% Percentile (Foundational Tier)";
      status = "Full Step-by-Step Scaffolding";
      retention = 68;
    }

    return {
      percentage,
      percentile,
      status,
      conceptGrasp: Math.min(99, percentage + 2),
      executionPrecision: Math.min(98, percentage - 3),
      socraticAutonomy: Math.max(25, 100 - hintsUsed * 16),
      retentionScore: retention
    };
  };

  const handleRetryImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setRetryImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setRetryImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!questionText.trim() && !imageFile) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('exam', targetExam);
      formData.append('errorTag', errorTag);
      formData.append('questionText', questionText);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/doubts/diagnose`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Backend responded with ${res.status}`);
      }

      const payload = await res.json();
      if (payload.success && payload.data) {
        setIsSubmitting(false);
        setActiveSession(payload.session || null);
        const currentLevel = payload.session?.currentHintLevel || 1;
        setActiveHintStep(currentLevel > 0 ? currentLevel : 1);

        const metrics = payload.session?.masteryMetrics || payload.data?.masteryMetrics || computeMasteryMetrics(payload.session?.hintsUsed || 0, payload.session?.attemptsCount || 1, payload.data.isCorrect);

        if (payload.data.isCorrect) {
          const sessId = payload.session?.sessionId;
          if (sessId && !awardedSessionsRef.current.has(sessId)) {
            awardedSessionsRef.current.add(sessId);
            const expToAward = payload.session?.expAwarded || (payload.session?.hintsUsed === 0 ? 50 : 40);
            recordDoubtActivity({
              exam: targetExam,
              subject: payload.data.detectedSubject || "Physics",
              isSolved: true,
              hintsUsed: payload.session?.hintsUsed || 0,
              expEarned: expToAward,
              errorType: errorTag
            });
          }
        } else if (payload.data.isPartial && payload.session?.deltaExp > 0) {
          recordDoubtActivity({
            exam: targetExam,
            subject: payload.data.detectedSubject || "Physics",
            isSolved: false,
            hintsUsed: payload.session?.hintsUsed || 1,
            expEarned: payload.session.deltaExp,
            errorType: errorTag
          });
          setPartialNotice({
            amount: payload.session.deltaExp,
            reason: payload.data.partialCreditReason || "Initial problem attempt logged — +5 Effort EXP credited!"
          });
          setTimeout(() => setPartialNotice(null), 7000);
        }

        setSubmittedResult({
          ...payload.data,
          detectedSubject: payload.data.detectedSubject || "Physics",
          detectedChapter: payload.data.detectedChapter || "Rotational Mechanics",
          detectedSubtopic: payload.data.detectedSubtopic || "Torque & Angular Acceleration",
          session: payload.session,
          masteryMetrics: metrics,
          questionText: questionText || (imageFile ? '[Notebook Snapshot Attached]' : 'Target Problem')
        });
        return;
      }
      throw new Error('Malformed backend response');
    } catch (err) {
      console.warn('Backend API connection unavailable, falling back to heuristic engine:', err);

      const diagnosis = generateDynamicSocraticDiagnosis(questionText, errorTag);

      setTimeout(() => {
        setIsSubmitting(false);
        setActiveHintStep(1);
        const fallbackSession = {
          sessionId: `SOC-SESS-${Math.floor(100000 + Math.random() * 900000)}`,
          question: questionText || (imagePreview ? "[Notebook Snapshot Attached]" : "Problem Query Submitted"),
          attemptsCount: 1,
          currentHintLevel: 1,
          hintsUsed: 1,
          solved: false,
          expAwarded: 5,
          partialExpTotal: 5,
          deltaExp: 5
        };
        recordDoubtActivity({
          exam: targetExam,
          subject: diagnosis.detectedSubject,
          isSolved: false,
          hintsUsed: 1,
          expEarned: 5,
          errorType: errorTag
        });
        setPartialNotice({
          amount: 5,
          reason: "Initial attempt recorded! +5 Effort EXP credited."
        });
        setTimeout(() => setPartialNotice(null), 7000);

        const fallbackMetrics = computeMasteryMetrics(1, 1, false);
        setActiveSession(fallbackSession);
        setSubmittedResult({
          hasAttempt: true,
          isCorrect: false,
          isPartial: true,
          partialCreditReason: "Initial framework and attempt recorded",
          deltaExp: 5,
          partialExpTotal: 5,
          detectedSubject: diagnosis.detectedSubject,
          detectedChapter: diagnosis.detectedChapter,
          detectedSubtopic: diagnosis.detectedSubtopic,
          firstIncorrectStep: "Step 1: Constraint interpretation",
          reasoningSteps: ["Step 1: Set up problem framework"],
          errorTitle: diagnosis.errorTitle,
          errorDescription: diagnosis.errorDescription,
          feedbackForStudent: "Review your currently unlocked Socratic hint below, then submit your next attempt to unlock further guidance.",
          unlockedHints: [diagnosis.hints[0]],
          currentHint: diagnosis.hints[0],
          totalHints: 4,
          lockedCount: 3,
          session: fallbackSession,
          masteryMetrics: fallbackMetrics,
          questionText: questionText || (imagePreview ? "[Notebook Snapshot Attached]" : "Problem Query Submitted")
        });
      }, 500);
    }
  };

  const handleRetrySubmit = async (e) => {
    e.preventDefault();
    if (!retryText.trim() && !retryImageFile) return;

    setIsSubmittingRetry(true);
    try {
      const formData = new FormData();
      if (activeSession?.sessionId) {
        formData.append('sessionId', activeSession.sessionId);
      }
      formData.append('exam', targetExam);
      formData.append('questionText', retryText);
      if (retryImageFile) {
        formData.append('image', retryImageFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/doubts/diagnose`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Backend responded with ${res.status}`);
      }

      const payload = await res.json();
      if (payload.success && payload.data) {
        setIsSubmittingRetry(false);
        setActiveSession(payload.session || null);
        const currentLevel = payload.session?.currentHintLevel || 1;
        setActiveHintStep(currentLevel > 0 ? currentLevel : 1);

        const metrics = payload.session?.masteryMetrics || payload.data?.masteryMetrics || computeMasteryMetrics(payload.session?.hintsUsed || 1, payload.session?.attemptsCount || 2, payload.data.isCorrect);

        if (payload.data.isCorrect) {
          const sessId = payload.session?.sessionId;
          if (sessId && !awardedSessionsRef.current.has(sessId)) {
            awardedSessionsRef.current.add(sessId);
            const delta = payload.session?.deltaExp || Math.max(10, (payload.session?.expAwarded || 30) - (payload.session?.partialExpTotal || 0));
            recordDoubtActivity({
              exam: targetExam,
              subject: payload.data.detectedSubject || submittedResult?.detectedSubject || "Physics",
              isSolved: true,
              hintsUsed: payload.session?.hintsUsed || currentLevel,
              expEarned: delta,
              errorType: errorTag
            });
          }
        } else if (payload.session?.deltaExp > 0 || payload.data.isPartial) {
          const delta = payload.session?.deltaExp || 5;
          recordDoubtActivity({
            exam: targetExam,
            subject: payload.data.detectedSubject || submittedResult?.detectedSubject || "Physics",
            isSolved: false,
            hintsUsed: payload.session?.hintsUsed || currentLevel,
            expEarned: delta,
            errorType: errorTag
          });
          setPartialNotice({
            amount: delta,
            reason: payload.data.partialCreditReason || `Attempt #${payload.session?.attemptsCount || 2} effort credit credited! Hint ${currentLevel} unlocked.`
          });
          setTimeout(() => setPartialNotice(null), 7000);
        }

        setSubmittedResult(prev => ({
          ...prev,
          ...payload.data,
          detectedSubject: payload.data.detectedSubject || prev?.detectedSubject,
          detectedChapter: payload.data.detectedChapter || prev?.detectedChapter,
          detectedSubtopic: payload.data.detectedSubtopic || prev?.detectedSubtopic,
          session: payload.session,
          masteryMetrics: metrics,
          questionText: submittedResult?.questionText || payload.session?.question
        }));
        setRetryText('');
        setRetryImageFile(null);
        setRetryImagePreview(null);
        return;
      }
      throw new Error('Malformed retry response');
    } catch (err) {
      console.warn('Retry backend unavailable, simulating fallback evaluation:', err);

      setTimeout(() => {
        setIsSubmittingRetry(false);
        const nextLevel = Math.min(4, (activeSession?.currentHintLevel || 1) + 1);
        const currentPartial = (activeSession?.partialExpTotal || 0);
        const delta = currentPartial < 10 ? 5 : 0;
        const newPartialTotal = currentPartial + delta;
        if (delta > 0) {
          recordDoubtActivity({
            exam: targetExam,
            subject: submittedResult?.detectedSubject || "Physics",
            isSolved: false,
            hintsUsed: nextLevel,
            expEarned: delta,
            errorType: errorTag
          });
          setPartialNotice({
            amount: delta,
            reason: `Attempt #${(activeSession?.attemptsCount || 1) + 1} effort credit awarded! Hint ${nextLevel} unlocked.`
          });
          setTimeout(() => setPartialNotice(null), 7000);
        }

        const updatedSession = {
          ...activeSession,
          attemptsCount: (activeSession?.attemptsCount || 1) + 1,
          currentHintLevel: nextLevel,
          hintsUsed: nextLevel,
          solved: false,
          partialExpTotal: newPartialTotal,
          deltaExp: delta,
          expAwarded: newPartialTotal
        };
        const fallbackMetrics = computeMasteryMetrics(nextLevel, updatedSession.attemptsCount, false);
        setActiveSession(updatedSession);
        setActiveHintStep(nextLevel);

        const allFallbackHints = [
          "Identify the known physical/mathematical invariants and boundary conditions.",
          "Recall the governing formula or conservation relation for this system. What variable needs isolating?",
          "Check your algebraic expansion for sign reversals or missing constants.",
          "Carry out the final reduction and test extreme boundary limits to verify consistency."
        ];

        setSubmittedResult(prev => ({
          ...prev,
          session: updatedSession,
          masteryMetrics: fallbackMetrics,
          isPartial: true,
          partialCreditReason: `Attempt #${updatedSession.attemptsCount} partial equation submitted`,
          deltaExp: delta,
          partialExpTotal: newPartialTotal,
          unlockedHints: allFallbackHints.slice(0, nextLevel),
          currentHint: allFallbackHints[nextLevel - 1],
          lockedCount: 4 - nextLevel,
          feedbackForStudent: `Attempt #${updatedSession.attemptsCount} evaluated. A new Socratic Hint (Hint ${nextLevel}) has been unlocked to guide your next step.`
        }));

        setRetryText('');
        setRetryImageFile(null);
        setRetryImagePreview(null);
      }, 500);
    }
  };

  const handleExportJSON = () => {
    const payload = {
      timestamp: new Date().toISOString(),
      studentSession: {
        exam: targetExam,
        detectedSubject: submittedResult?.detectedSubject || "Auto-detected",
        detectedChapter: submittedResult?.detectedChapter || "Auto-detected",
        detectedSubtopic: submittedResult?.detectedSubtopic || "Auto-detected",
        errorTag: errorTag,
        doubtText: questionText,
        hasAttachment: !!imagePreview,
        session: activeSession
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `socratic_doubt_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <section id="doubt-portal" className="scroll-mt-28 py-20 px-4 md:px-8 relative z-10 bg-transparent font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white text-black border-3 border-black text-[10px] font-pixel font-bold uppercase mb-4 shadow-[3px_3px_0px_#000]"
          >
            <span className="w-2 h-2 bg-[#EF4444] border border-black animate-pulse" />
            <span>AI DOUBT PORTAL</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 font-pixel drop-shadow-[2px_2px_0px_#000]"
          >
            Submit a Doubt &amp; <br />
            <span className="text-white">Get Socratic Diagnosis.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg text-slate-100 font-sans leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Snap your notebook working or type your doubt. Socratic AI automatically identifies the subject, chapter, and topic, diagnosing your exact slip point without giving away the answer.
          </motion.p>
        </div>

        {/* Main Portal Console Chassis */}
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-[#DC2626] border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_#000] relative rounded-none">
            
            {/* Chassis Top Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b-3 border-black gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#EF4444] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-[#FFFFFF] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="w-3 h-3 bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_#000]" />
                <span className="text-[10px] font-pixel text-black font-bold uppercase ml-1">
                  Vision OCR &amp; Syllabus Detection
                </span>
              </div>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="text-[9px] font-pixel font-bold text-black flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-slate-100 transition-all"
              >
                <FileJson className="w-3.5 h-3.5 text-black" />
                <span>Export Session</span>
              </button>
            </div>

            {/* Inner Slate Screen */}
            <div className="bg-[#1E232A] border-3 border-black p-4 sm:p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
              {/* Form */}
              <form onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* STEP 1: Doubt Input & Notebook Capture */}
                <div>
                  <div className="text-[10px] font-pixel font-bold text-[#EF4444] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-[#FFFFFF] text-black border-2 border-black text-[9px] font-pixel font-bold shadow-[1px_1px_0px_#000]">01</span>
                    Upload Working Snapshot or Enter Query
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                        <label className="block text-xs font-solution text-slate-300 font-normal">
                          Describe where your derivation stalled (or upload your notebook working below):
                        </label>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] font-pixel text-[#FFFFFF]">Quick Load:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setQuestionText("A uniform disc of mass 2kg and radius 0.5m is subjected to a tangential force of 10N. My angular acceleration calculation slips at inertia substitution.");
                              setErrorTag("Calculation Slip");
                            }}
                            className="text-[8px] font-pixel px-2 py-0.5 bg-[#262D36] hover:bg-[#343D49] text-white border border-black shadow-[1px_1px_0px_#000] transition-colors"
                          >
                            Physics
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuestionText("Why does secondary butyl carbocation rearrange to tertiary butyl carbocation via hydride shift before nucleophilic attack?");
                              setErrorTag("Conceptual Blindspot");
                            }}
                            className="text-[8px] font-pixel px-2 py-0.5 bg-[#262D36] hover:bg-[#343D49] text-white border border-black shadow-[1px_1px_0px_#000] transition-colors"
                          >
                            Chemistry
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuestionText("Evaluating integral x * e^(2x) dx using integration by parts, but my boundary term coefficient keeps doubling.");
                              setErrorTag("Execution Slip");
                            }}
                            className="text-[8px] font-pixel px-2 py-0.5 bg-[#262D36] hover:bg-[#343D49] text-white border border-black shadow-[1px_1px_0px_#000] transition-colors"
                          >
                            Mathematics
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setQuestionText("During neuronal transmission, what causes the rapid refractory period and prevents retrograde propagation along the axon?");
                              setErrorTag("Formula Amnesia");
                            }}
                            className="text-[8px] font-pixel px-2 py-0.5 bg-[#262D36] hover:bg-[#343D49] text-white border border-black shadow-[1px_1px_0px_#000] transition-colors"
                          >
                            Biology
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        placeholder="e.g. I worked through the problem up to step 3, but my discriminant gives no real roots. Where is my algebraic sign slipping?"
                        rows={3}
                        className="w-full bg-[#262D36] border-2 border-black rounded-none p-3.5 text-sm font-solution text-white placeholder:text-slate-400 focus:outline-none focus:border-[#FFFFFF] transition-colors resize-none shadow-[2px_2px_0px_#000]"
                      />
                    </div>

                    {/* Notebook Image Upload Area */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />

                      {!imagePreview ? (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-3 border-dashed border-black bg-[#262D36] hover:bg-[#2d3540] rounded-none p-6 text-center cursor-pointer transition-colors group shadow-[3px_3px_0px_#000]"
                        >
                          <div className="w-11 h-11 rounded-none bg-[#FFFFFF] border-2 border-black flex items-center justify-center mx-auto mb-2 text-black shadow-[2px_2px_0px_#000]">
                            <Camera className="w-5 h-5 text-black" />
                          </div>
                          <div className="text-xs font-pixel font-bold text-white mb-1">
                            Click to attach or snap notebook photo
                          </div>
                          <div className="text-xs text-slate-300 font-solution font-normal">
                            Auto-detects subject, chapter &amp; subtopic via Vision OCR (PNG, JPG, HEIC up to 10MB)
                          </div>
                        </div>
                      ) : (
                        <div className="relative rounded-none overflow-hidden border-2 border-black bg-[#262D36] p-3 flex items-center gap-4 shadow-[3px_3px_0px_#000]">
                          <img
                            src={imagePreview}
                            alt="Uploaded Doubt"
                            className="w-20 h-20 object-cover rounded-none border-2 border-black"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-pixel font-bold text-white truncate">
                              {imageFile?.name || "Notebook Snapshot"}
                            </div>
                            <div className="text-[11px] font-pixel text-[#10B981] flex items-center gap-1 mt-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Ready for Analysis</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            className="p-2 rounded-none bg-white text-black hover:bg-rose-100 transition-colors border-2 border-black shadow-[2px_2px_0px_#000]"
                          >
                            <X className="w-4 h-4 text-black" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* STEP 2: Misconception Tagging (Optional) */}
                <div>
                  <div className="text-[10px] font-pixel font-bold text-[#EF4444] uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-[#FFFFFF] text-black border-2 border-black text-[9px] font-pixel font-bold shadow-[1px_1px_0px_#000]">02</span>
                    Potential Misconception (Optional)
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      'Conceptual Blindspot',
                      'Calculation Slip',
                      'Formula Amnesia',
                      'Execution Slip'
                    ].map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setErrorTag(tag)}
                        className={`py-2 px-2.5 rounded-none text-[9px] font-pixel font-bold transition-all border-2 border-black ${
                          errorTag === tag
                            ? 'bg-[#FFFFFF] text-black shadow-[2px_2px_0px_#000]'
                            : 'bg-white text-black hover:bg-slate-100 shadow-[2px_2px_0px_#000]'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3 border-t-2 border-black flex justify-between items-center">
                  {submittedResult && (
                    <button
                      type="button"
                      onClick={() => setSubmittedResult(null)}
                      className="text-[9px] font-pixel font-bold text-[#EF4444] hover:underline flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Ask Another Doubt</span>
                    </button>
                  )}

                  <MagneticButton
                    variant="primary"
                    className="px-7 py-3 ml-auto"
                  >
                    <span>{isSubmitting ? "Processing..." : "Submit Doubt for Diagnosis ➔"}</span>
                  </MagneticButton>
                </div>

              </form>

            {/* SOCRATIC DIAGNOSTIC TICKET CARD */}
            <AnimatePresence>
              {submittedResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.4 }}
                  className="mt-10 bg-[#0F0F1D] border-2 border-brand-violet/60 rounded-none p-6 sm:p-8 shadow-pixel-block-violet relative overflow-hidden"
                >
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-2.5 h-2.5 bg-brand-cyan" />
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-cyan" />
                  <div className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-brand-violet" />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-brand-violet" />

                  {/* Top Ambient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-purple" />

                  {/* Ticket Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 bg-brand-cyan animate-pulse" />
                      <h4 className="text-xs sm:text-sm font-mono font-bold text-white tracking-wider">
                        Active Diagnostic Session #{activeSession?.sessionId || "01"}
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        setSubmittedResult(null);
                        setActiveSession(null);
                      }}
                      className="p-1.5 rounded-none hover:bg-white/10 text-slate-400 hover:text-white transition-colors pixel-btn border border-white/10"
                      title="Close Ticket"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI Auto-Detected Concept Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3.5 rounded-none bg-[#090915] border-2 border-brand-violet/40 shadow-pixel-block">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-brand-cyan" />
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        Detected Syllabus Mapping:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-0.5 rounded-none bg-brand-violet/20 border border-brand-violet/40 text-brand-purple font-bold">
                        {submittedResult.detectedSubject || "Physics"}
                      </span>
                      <span className="text-slate-500 font-bold">➔</span>
                      <span className="px-2.5 py-0.5 rounded-none bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-bold">
                        {submittedResult.detectedChapter || "Rotational Mechanics"}
                      </span>
                      {submittedResult.detectedSubtopic && (
                        <>
                          <span className="text-slate-500 font-bold">➔</span>
                          <span className="px-2.5 py-0.5 rounded-none bg-white/5 border border-white/10 text-slate-200">
                            {submittedResult.detectedSubtopic}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Transcribed Problem Statement */}
                  <div className="bg-[#07070E] p-4 rounded-none border-2 border-white/15 mb-6 text-xs shadow-pixel-block">
                    <span className="text-slate-400 font-mono block mb-1 uppercase tracking-wider text-[10px]">Problem Statement:</span>
                    <span className="text-white font-medium text-sm font-solution font-math leading-relaxed block mt-1">
                      "{cleanMathText(submittedResult.questionText || activeSession?.question)}"
                    </span>
                  </div>

                  {/* SPECIAL CASE: Problem Uploaded with No Student Attempt */}
                  {submittedResult.hasAttempt === false ? (
                    <div className="bg-white/10 border-2 border-white/40 rounded-none p-5 mb-6 text-center shadow-pixel-block">
                      <div className="w-10 h-10 rounded-none bg-white/20 text-white mx-auto flex items-center justify-center mb-3 border-2 border-white/50">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h5 className="text-sm font-mono font-bold text-white mb-1.5">No Student Attempt Detected</h5>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-4 font-solution">
                        {cleanMathText(submittedResult.feedbackForStudent) || "We extracted your question statement, but couldn't detect your own handwritten work or solution attempt. Socratic AI guides you through your errors — please give it a try first!"}
                      </p>
                      
                      {/* Immediate attempt input */}
                      <form onSubmit={handleRetrySubmit} className="max-w-lg mx-auto text-left space-y-3">
                        <textarea
                          value={retryText}
                          onChange={(e) => setRetryText(e.target.value)}
                          placeholder="Type your initial reasoning or equations here to start diagnosis..."
                          rows={2}
                          className="w-full bg-[#050508] border-2 border-white/20 rounded-none p-3 text-xs sm:text-sm font-solution text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan shadow-pixel-block"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingRetry || !retryText.trim()}
                          className="w-full py-2.5 rounded-none bg-brand-violet text-white text-xs font-mono font-bold flex items-center justify-center gap-2 disabled:opacity-50 pixel-block-btn shadow-pixel-block-violet"
                        >
                          <span>{isSubmittingRetry ? "Evaluating Attempt..." : "Submit Initial Attempt ➔"}</span>
                        </button>
                      </form>
                    </div>
                  ) : submittedResult.isCorrect ? (
                    /* CASE: Solved! Render full Cognitive Mastery & Retention Curve + EXP Leaderboard Connection */
                    <CognitiveMasteryCurveCard
                      metrics={submittedResult.masteryMetrics || computeMasteryMetrics(activeSession?.hintsUsed || 0, activeSession?.attemptsCount || 1, true)}
                      hintsUsed={activeSession?.hintsUsed || 0}
                      feedbackForStudent={cleanMathText(submittedResult.feedbackForStudent)}
                      targetExam={targetExam}
                    />
                  ) : (
                    /* Clean Socratic Hint Display */
                    <>
                      {/* SOCRATIC HINTS CARD */}
                      <div className="bg-[#07070E] border-3 border-black p-5 sm:p-6 mb-6 shadow-[4px_4px_0px_#000]">
                        <div className="flex flex-wrap items-center justify-between mb-4 border-b-2 border-black pb-3 gap-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm font-pixel font-bold text-white">
                            <Lightbulb className="w-4 h-4 text-white" />
                            <span>SOCRATIC HINT &bull; STEP {activeHintStep} OF 4</span>
                          </div>
                          {submittedResult.detectedSubject && (
                            <span className="text-[10px] font-pixel bg-white text-black px-2 py-0.5 border border-black font-bold">
                              {submittedResult.detectedSubject} &bull; {submittedResult.detectedChapter || "General"}
                            </span>
                          )}
                        </div>

                        {/* Hint Step Selector Tabs */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                          {[1, 2, 3, 4].map((level) => {
                            const isActive = activeHintStep === level;
                            const hintText = (submittedResult.hints && submittedResult.hints[level - 1]) || 
                              (submittedResult.unlockedHints && submittedResult.unlockedHints[level - 1]) || 
                              submittedResult.currentHint;

                            if (!hintText) return null;

                            return (
                              <button
                                key={level}
                                type="button"
                                onClick={() => setActiveHintStep(level)}
                                className={`py-2 px-3 text-xs font-pixel font-bold border-2 border-black transition-all ${
                                  isActive
                                    ? 'bg-white text-black shadow-[2px_2px_0px_#000]'
                                    : 'bg-[#1E232A] text-white hover:bg-slate-700 shadow-[2px_2px_0px_#000]'
                                }`}
                              >
                                <span>Hint {level}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Detailed Socratic Hint Content Box */}
                        <motion.div
                          key={activeHintStep}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#1E232A] p-5 sm:p-6 border-3 border-black text-sm sm:text-base text-white leading-relaxed shadow-[inset_0_0_12px_rgba(0,0,0,0.5)]"
                        >
                          <div className="text-[10px] font-pixel font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                            <span>Detailed Socratic Guidance (Hint #{activeHintStep}):</span>
                          </div>
                          
                          <div className="text-slate-100 font-solution text-sm sm:text-base leading-relaxed pl-1 space-y-2">
                            <p className="whitespace-pre-wrap">
                              "{cleanMathText(
                                (submittedResult.hints && submittedResult.hints[activeHintStep - 1]) ||
                                (submittedResult.unlockedHints && submittedResult.unlockedHints[activeHintStep - 1]) ||
                                submittedResult.currentHint ||
                                submittedResult.feedbackForStudent
                              )}"
                            </p>
                          </div>

                          {submittedResult.feedbackForStudent && activeHintStep === 1 && (
                            <div className="mt-4 pt-3 border-t-2 border-black/40 text-xs font-solution text-slate-200 leading-relaxed italic bg-[#14181F] p-3 border border-white/10">
                              <strong className="text-white not-italic font-pixel text-[10px] block mb-1">Guidance Focus:</strong>
                              {cleanMathText(submittedResult.feedbackForStudent)}
                            </div>
                          )}
                        </motion.div>
                      </div>

                      {/* MANDATORY RETRY DRAWER TO UNLOCK NEXT HINT */}
                      <div className="bg-[#0A0A15] border-2 border-brand-violet/40 rounded-none p-5 shadow-pixel-block">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                            <RotateCcw className="w-3.5 h-3.5 text-brand-cyan" />
                            <span>Submit Attempt #{((activeSession?.attemptsCount || 1) + 1)} to Progress</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            Revise your working to unlock next hint
                          </span>
                        </div>

                        <form onSubmit={handleRetrySubmit} className="space-y-3">
                          <textarea
                            value={retryText}
                            onChange={(e) => setRetryText(e.target.value)}
                            placeholder="Type your revised equation, step, or working (or upload a new notebook photo below)..."
                            rows={2}
                            className="w-full bg-[#050508] border-2 border-white/20 rounded-none p-3 text-xs sm:text-sm font-solution text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan transition-colors shadow-pixel-block"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div>
                              <input
                                type="file"
                                ref={retryFileInputRef}
                                onChange={handleRetryImageUpload}
                                accept="image/*"
                                className="hidden"
                              />
                              {!retryImagePreview ? (
                                <button
                                  type="button"
                                  onClick={() => retryFileInputRef.current?.click()}
                                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#090912] border-2 border-white/20 hover:border-brand-cyan transition-all pixel-block-btn shadow-pixel-block"
                                >
                                  <Camera className="w-3.5 h-3.5 text-brand-cyan" />
                                  <span>Snap / Attach Photo</span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-none border-2 border-emerald-500/30">
                                  <span>Photo Attached</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRetryImageFile(null);
                                      setRetryImagePreview(null);
                                    }}
                                    className="text-slate-400 hover:text-rose-400"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>

                            <MagneticButton
                              variant="primary"
                              className="px-6 py-2 ml-auto text-xs"
                            >
                              <span>{isSubmittingRetry ? "Evaluating Attempt..." : `[ SUBMIT ATTEMPT #${((activeSession?.attemptsCount || 1) + 1)} ➔ ]`}</span>
                            </MagneticButton>
                          </div>
                        </form>
                      </div>
                    </>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

            </div>
          </div>
        </div>

      </div>

      {/* Export Data Specs Modal */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-xl w-full bg-[#0A0A12] border-2 border-brand-violet/60 rounded-none p-6 shadow-pixel-block-violet relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-brand-cyan" />
                  Backend Export Data Schema
                </span>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-none border border-white/10 hover:border-brand-cyan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#050508] rounded-none p-4 font-mono text-xs text-brand-cyan overflow-x-auto max-h-60 mb-6 border-2 border-white/20 shadow-pixel-block">
                <pre>{JSON.stringify({
                  exam: targetExam,
                  detectedSubject: submittedResult?.detectedSubject || "Auto-detected by Vision OCR",
                  detectedChapter: submittedResult?.detectedChapter || "Auto-detected by Vision OCR",
                  detectedSubtopic: submittedResult?.detectedSubtopic || "Auto-detected by Vision OCR",
                  errorTag: errorTag,
                  questionText: questionText || "Sample question statement"
                }, null, 2)}</pre>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleExportJSON}
                  className="px-4 py-2 rounded-none bg-brand-violet text-white text-xs font-mono font-bold flex items-center gap-2 shadow-pixel-block-violet pixel-block-btn"
                >
                  <Download className="w-4 h-4" />
                  <span>Download JSON Payload</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
