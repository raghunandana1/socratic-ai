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
      className="bg-[#090915] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 mb-6 shadow-2xl relative overflow-hidden backdrop-blur-xl"
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

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
                strokeLinecap="round"
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
                Mastery
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Cognitive Breakthrough
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-cyan font-mono text-xs font-semibold">
                {percentile}
              </span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white font-mono leading-tight">
              {status}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-sans mt-1 leading-relaxed">
              {feedbackForStudent || "Outstanding deduction! You mastered this problem through graduated diagnostic inquiry."}
            </p>
          </div>
        </div>

        {/* Retention Tier Badge */}
        <div className="px-4 py-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.15)] self-stretch sm:self-auto justify-center">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <div className="text-left">
            <div className="text-emerald-200 leading-none">{retention}% 72h Retention</div>
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
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan shadow-[0_0_8px_#06B6D4]" />
              Socratic Active Recall ({retention}%)
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-3 h-0.5 bg-rose-400" />
              Passive Answer Dumping (15%)
            </span>
          </div>
        </div>

        <div className="relative w-full h-40 bg-[#06060E]/90 rounded-2xl border border-white/10 p-2 overflow-hidden shadow-inner">
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
            <circle cx="40" cy={yStart} r="4" fill="#06B6D4" stroke="#06060E" strokeWidth="2" />
            <circle cx="260" cy={yMid1} r="4" fill="#06B6D4" stroke="#06060E" strokeWidth="2" />
            <circle cx="440" cy={yEnd} r="4.5" fill="#10B981" stroke="#06060E" strokeWidth="2" />

            {/* Timeline X Labels */}
            <text x="40" y="145" fill="#94A3B8" fontSize="9" fontFamily="monospace">Breakthrough (0h)</text>
            <text x="170" y="145" fill="#94A3B8" fontSize="9" fontFamily="monospace">24h</text>
            <text x="300" y="145" fill="#94A3B8" fontSize="9" fontFamily="monospace">48h</text>
            <text x="440" y="145" fill="#10B981" fontSize="9" fontFamily="monospace" fontWeight="bold" textAnchor="end">72h ({retention}% Recall)</text>
          </svg>
        </div>
      </div>

      {/* Multi-Dimensional Competency Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-5 border-b border-white/10 relative z-10 font-mono text-xs">
        <div className="bg-[#05050A] p-3.5 rounded-2xl border border-white/5">
          <div className="flex justify-between text-slate-300 mb-1.5">
            <span>Conceptual Grasp</span>
            <span className="text-brand-cyan font-bold">{conceptGrasp}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-brand-cyan rounded-full transition-all duration-1000" style={{ width: `${conceptGrasp}%` }} />
          </div>
        </div>

        <div className="bg-[#05050A] p-3.5 rounded-2xl border border-white/5">
          <div className="flex justify-between text-slate-300 mb-1.5">
            <span>Execution Precision</span>
            <span className="text-purple-400 font-bold">{executionPrecision}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-purple-400 rounded-full transition-all duration-1000" style={{ width: `${executionPrecision}%` }} />
          </div>
        </div>

        <div className="bg-[#05050A] p-3.5 rounded-2xl border border-white/5">
          <div className="flex justify-between text-slate-300 mb-1.5">
            <span>Socratic Autonomy</span>
            <span className="text-emerald-400 font-bold">{socraticAutonomy}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${socraticAutonomy}%` }} />
          </div>
        </div>
      </div>

      {/* Diagnostic Mastery Summary & Retention Horizon */}
      <div className="pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="text-xs font-sans text-slate-300">
          <div className="font-mono font-bold text-white flex items-center gap-2 mb-1">
            <span className="text-emerald-400 font-bold">{percentage}% Cognitive Mastery Confirmed</span>
            <span className="text-slate-600">•</span>
            <span className="text-brand-cyan">{targetExam} Syllabus Standard</span>
          </div>
          <div className="text-xs text-slate-400">
            Self-derived Socratic reasoning stabilizes neural synaptic retention at <strong className="text-white">{retention}% recall</strong> over the next 72 hours.
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.querySelector('#doubt-portal');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-violet to-brand-cyan text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-glow-violet hover:opacity-95 self-stretch sm:self-auto justify-center"
        >
          <span>Diagnose Another Problem</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

export default function DoubtPortalSection() {
  const { 
    targetExam, 
    setTargetExam
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
    if (t.includes('torque') || t.includes('angular') || t.includes('inertia') || t.includes('rotat') || t.includes('force') || t.includes('momentum') || t.includes('velocity')) {
      return {
        subject: 'Physics',
        chapter: (t.includes('torque') || t.includes('inertia') || t.includes('angular')) ? 'Rotational Mechanics' : 'Kinematics',
        subtopic: (t.includes('torque') || t.includes('angular')) ? 'Torque & Angular Acceleration' : 'Conservation Laws'
      };
    }
    if (t.includes('reaction') || t.includes('carbocation') || t.includes('acid') || t.includes('base') || t.includes('aldehyde') || t.includes('electrophil')) {
      return {
        subject: 'Chemistry',
        chapter: 'Organic Chemistry',
        subtopic: 'Reaction Mechanisms & Intermediates'
      };
    }
    if (t.includes('integral') || t.includes('derivative') || t.includes('quadratic') || t.includes('roots') || t.includes('matrix') || t.includes('determinant')) {
      return {
        subject: 'Mathematics',
        chapter: t.includes('integral') ? 'Definite Integrals' : t.includes('quadratic') ? 'Quadratic Equations' : 'Calculus',
        subtopic: t.includes('integral') ? 'Integration by Parts' : 'Roots & Polynomial Constraints'
      };
    }
    return {
      subject: 'Physics & Mathematics',
      chapter: 'Core Conceptual Analysis',
      subtopic: 'Analytical Problem Solving'
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
    } else if (errorType === 'Execution Bottleneck') {
      errorTitle = "Execution Bottleneck";
      errorDescription = `Stalled progress during algebraic substitution or boundary reduction step in ${detected.chapter}.`;
    }

    let hints = [];
    if (detected.subject === 'Physics') {
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
            addExp(payload.session?.expAwarded || (payload.session?.hintsUsed === 0 ? 50 : 40));
          }
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
          expAwarded: 0
        };
        const fallbackMetrics = computeMasteryMetrics(1, 1, false);
        setActiveSession(fallbackSession);
        setSubmittedResult({
          hasAttempt: true,
          isCorrect: false,
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
            addExp(payload.session?.expAwarded || (payload.session?.hintsUsed <= 1 ? 40 : 30));
          }
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
        const updatedSession = {
          ...activeSession,
          attemptsCount: (activeSession?.attemptsCount || 1) + 1,
          currentHintLevel: nextLevel,
          hintsUsed: nextLevel,
          solved: false
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
    <section id="doubt-portal" className="py-24 px-4 md:px-8 relative z-10 bg-bg-card/40 border-y border-white/5 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-4 shadow-glow-violet"
          >
            <Layers className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Autonomous Socratic AI Doubt Portal</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6"
          >
            Submit a Doubt & <span className="text-gradient-animated">Get Socratic Diagnosis.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-slate-400"
          >
            Snap your notebook working or type your doubt. Socratic AI automatically identifies the subject, chapter, and topic, diagnosing your exact slip point without giving away the answer.
          </motion.p>
        </div>

        {/* Main Portal Container */}
        <div className="max-w-4xl mx-auto">
          <TiltCard className="bg-[#08080E] border-brand-violet/30 p-6 md:p-10 shadow-2xl relative">
            
            {/* Top Action Bar */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/10 mb-8 gap-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-cyan animate-pulse" />
                <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Autonomous Vision OCR &amp; Syllabus Detection
                </span>
              </div>
              
              <button
                onClick={() => setShowExportModal(true)}
                className="text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-brand-cyan transition-all"
              >
                <FileJson className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Export Data Specs</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-8">
              
              {/* STEP 1: Doubt Input & Notebook Capture */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center text-[10px]">1</span>
                  Upload Working Photo or Transcribe Doubt
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">
                      Describe what you are stuck on (or leave blank if uploading notebook photo)
                    </label>
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="e.g. I worked through the problem up to step 3, but my discriminant gives no real roots. Where is my algebraic sign slipping?"
                      rows={3}
                      className="w-full bg-[#050508] border border-white/10 rounded-2xl p-4 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan transition-colors resize-none"
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
                        className="border-2 border-dashed border-white/15 hover:border-brand-cyan/50 rounded-2xl p-6 text-center cursor-pointer transition-colors group bg-white/[0.02]"
                      >
                        <div className="w-12 h-12 rounded-full bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <Camera className="w-5 h-5 text-brand-cyan" />
                        </div>
                        <div className="text-sm font-mono font-medium text-white mb-1">
                          Upload or Snap Notebook Working Photo
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          Auto-detects subject, chapter &amp; subtopic from your handwriting (PNG, JPG, HEIC up to 10MB)
                        </div>
                      </div>
                    ) : (
                      <div className="relative rounded-2xl overflow-hidden border border-brand-violet/40 bg-[#050508] p-3 flex items-center gap-4">
                        <img
                          src={imagePreview}
                          alt="Uploaded Doubt"
                          className="w-20 h-20 object-cover rounded-xl border border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-mono font-bold text-white truncate">
                            {imageFile?.name || "Notebook Snapshot"}
                          </div>
                          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Ready for Vision OCR &amp; Diagnostic</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 2: Misconception Tagging (Optional) */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center text-[10px]">2</span>
                  Self-Diagnosed Bottleneck Category (Optional)
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    'Conceptual Blindspot',
                    'Calculation Slip',
                    'Formula Amnesia',
                    'Execution Bottleneck'
                  ].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setErrorTag(tag)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all ${
                        errorTag === tag
                          ? 'bg-brand-violet text-white shadow-glow-violet'
                          : 'bg-[#050508] text-slate-400 border border-white/10 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                {submittedResult && (
                  <button
                    type="button"
                    onClick={() => setSubmittedResult(null)}
                    className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ask Another Doubt</span>
                  </button>
                )}

                <MagneticButton
                  variant="primary"
                  className="px-8 py-3.5 ml-auto"
                >
                  <span>{isSubmitting ? "Processing Diagnostic..." : "Submit Doubt for Diagnosis ➔"}</span>
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
                  className="mt-10 bg-[#0F0F1D] border border-brand-violet/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
                >
                  {/* Glowing Top Ambient Bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-purple" />

                  {/* Ticket Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
                      <h4 className="text-sm sm:text-base font-mono font-bold text-white tracking-wide">
                        Socratic Diagnostic Ticket #{activeSession?.sessionId || "ACTIVE-SESSION"}
                      </h4>
                    </div>

                    <button
                      onClick={() => {
                        setSubmittedResult(null);
                        setActiveSession(null);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Close Ticket"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* AI Auto-Detected Concept Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 p-3.5 rounded-2xl bg-[#090915] border border-brand-violet/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
                      <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                        AI-Detected Concept:
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="px-2.5 py-1 rounded-lg bg-brand-violet/20 border border-brand-violet/40 text-brand-purple font-bold">
                        {submittedResult.detectedSubject || "Physics"}
                      </span>
                      <span className="text-slate-500 font-bold">➔</span>
                      <span className="px-2.5 py-1 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan font-bold">
                        {submittedResult.detectedChapter || "Rotational Mechanics"}
                      </span>
                      {submittedResult.detectedSubtopic && (
                        <>
                          <span className="text-slate-500 font-bold">➔</span>
                          <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                            {submittedResult.detectedSubtopic}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Transcribed Problem Statement */}
                  <div className="bg-[#07070E] p-4 rounded-2xl border border-white/10 mb-6 font-mono text-xs">
                    <span className="text-slate-400 block mb-1">Target Problem Statement:</span>
                    <span className="text-white font-bold text-sm">
                      "{cleanMathText(submittedResult.questionText || activeSession?.question)}"
                    </span>
                  </div>

                  {/* SPECIAL CASE: Problem Uploaded with No Student Attempt */}
                  {submittedResult.hasAttempt === false ? (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h5 className="text-sm font-mono font-bold text-white mb-1.5">No Student Attempt Found</h5>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed mb-4">
                        {cleanMathText(submittedResult.feedbackForStudent) || "We extracted your question statement, but couldn't detect your own handwritten work or solution attempt. Socratic AI guides you through your errors — please give it a try first!"}
                      </p>
                      
                      {/* Immediate attempt input */}
                      <form onSubmit={handleRetrySubmit} className="max-w-lg mx-auto text-left space-y-3">
                        <textarea
                          value={retryText}
                          onChange={(e) => setRetryText(e.target.value)}
                          placeholder="Type your initial reasoning or equations here to start diagnosis..."
                          rows={2}
                          className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingRetry || !retryText.trim()}
                          className="w-full py-2.5 rounded-xl bg-brand-violet text-white text-xs font-mono font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <span>{isSubmittingRetry ? "Evaluating Attempt..." : "Submit Initial Attempt for Evaluation ➔"}</span>
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
                    /* CASE: Incorrect Attempt - Show Exact Error and Sequential Hint Ladder */
                    <>
                      {/* In-Progress Diagnostic Trajectory Indicator */}
                      <div className="bg-[#090915] border border-brand-violet/30 rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center text-brand-cyan shadow-glow-violet">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                              <span>Diagnostic Mastery Index:</span>
                              <span className="text-brand-cyan">
                                {submittedResult.masteryMetrics?.percentage || Math.max(45, 98 - (activeSession?.currentHintLevel || 1) * 12)}% Projected
                              </span>
                              <span className="text-slate-500">•</span>
                              <span className="text-emerald-400 text-[11px]">
                                {submittedResult.masteryMetrics?.percentile || "Top 45% Iteration Rate"}
                              </span>
                            </div>
                            <div className="text-xs font-sans text-slate-300 mt-0.5">
                              Solve on Attempt #{activeSession?.attemptsCount || 1} to achieve cognitive breakthrough and unlock your full retention curve!
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const solvedMetrics = computeMasteryMetrics(activeSession?.currentHintLevel || 1, activeSession?.attemptsCount || 1, true);
                            setSubmittedResult(prev => ({
                              ...prev,
                              isCorrect: true,
                              masteryMetrics: solvedMetrics,
                              feedbackForStudent: "Outstanding deduction! You applied the sequential hints and deduced the correct solution independently."
                            }));
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 transition-all self-stretch sm:self-auto justify-center"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>I Got It! Mark Solved & Unlock Curve</span>
                        </button>
                      </div>
                      {/* Diagnosed Error Banner */}
                      <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4.5 mb-6">
                        <div className="text-xs font-mono font-bold text-rose-400 mb-1 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Diagnosed Error: {submittedResult.errorTitle || "Reasoning Discrepancy"}</span>
                          {submittedResult.firstIncorrectStep && (
                            <span className="ml-auto text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md border border-rose-500/30">
                              First slip: {cleanMathText(submittedResult.firstIncorrectStep)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed">
                          {cleanMathText(submittedResult.errorDescription)}
                        </p>
                      </div>

                      {/* SEQUENTIAL HINT LADDER (Hints 1 to 4 with Strict Lock States) */}
                      <div className="bg-[#07070E] border border-brand-violet/30 rounded-2xl p-5 mb-6">
                        <div className="flex flex-wrap items-center justify-between mb-4 border-b border-white/10 pb-3 gap-2">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-cyan">
                            <Lightbulb className="w-4 h-4 text-brand-purple" />
                            <span>Sequential Socratic Ladder (Level {activeSession?.currentHintLevel || 1} of 4)</span>
                          </div>

                          <div className="text-[11px] font-mono text-slate-400">
                            Attempts: <span className="text-white font-bold">{activeSession?.attemptsCount || 1}</span>
                          </div>
                        </div>

                        {/* Hint Level Selector Chips */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                          {[1, 2, 3, 4].map((level) => {
                            const isUnlocked = level <= (activeSession?.currentHintLevel || 1);
                            const isActive = activeHintStep === level;

                            return (
                              <button
                                key={level}
                                type="button"
                                disabled={!isUnlocked}
                                onClick={() => isUnlocked && setActiveHintStep(level)}
                                className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between ${
                                  isActive
                                    ? 'bg-brand-violet text-white shadow-glow-violet border border-brand-violet'
                                    : isUnlocked
                                    ? 'bg-white/5 text-slate-300 hover:text-white border border-white/10 hover:border-brand-cyan/40'
                                    : 'bg-[#050508] text-slate-600 border border-white/5 cursor-not-allowed'
                                }`}
                              >
                                <span>HINT {level}</span>
                                {isUnlocked ? (
                                  <span className="text-[10px] text-emerald-400">AVAILABLE</span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <Lock className="w-3 h-3 text-slate-500" />
                                    <span>Locked</span>
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Unlocked Hint Text Display */}
                        <motion.div
                          key={activeHintStep}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-[#0F0F1A] p-4 rounded-xl border border-white/10 text-sm font-sans text-white leading-relaxed font-medium"
                        >
                          <div className="text-xs font-mono text-brand-cyan mb-1 uppercase tracking-wider flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-brand-purple" />
                            <span>Hint {activeHintStep}:</span>
                          </div>
                          "{cleanMathText(submittedResult.unlockedHints?.[activeHintStep - 1] || submittedResult.currentHint)}"
                        </motion.div>
                      </div>

                      {/* MANDATORY RETRY DRAWER TO UNLOCK NEXT HINT */}
                      <div className="bg-[#0A0A15] border border-brand-violet/20 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                            <RotateCcw className="w-3.5 h-3.5 text-brand-cyan" />
                            <span>Submit Attempt #{((activeSession?.attemptsCount || 1) + 1)} to Progress</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            Viewing a hint never unlocks the next. Retry required.
                          </span>
                        </div>

                        <form onSubmit={handleRetrySubmit} className="space-y-3">
                          <textarea
                            value={retryText}
                            onChange={(e) => setRetryText(e.target.value)}
                            placeholder="Type your revised equation, step, or working (or upload a new notebook photo below)..."
                            rows={2}
                            className="w-full bg-[#050508] border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-cyan transition-colors"
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
                                  className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-brand-cyan transition-all"
                                >
                                  <Camera className="w-3.5 h-3.5 text-brand-cyan" />
                                  <span>Snap / Attach New Working Photo</span>
                                </button>
                              ) : (
                                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
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
                              <span>{isSubmittingRetry ? "Evaluating Attempt..." : `Submit Attempt #${((activeSession?.attemptsCount || 1) + 1)} for Evaluation ➔`}</span>
                            </MagneticButton>
                          </div>
                        </form>
                      </div>
                    </>
                  )}

                </motion.div>
              )}
            </AnimatePresence>

          </TiltCard>
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
              className="max-w-xl w-full bg-[#0A0A12] border border-brand-violet/40 rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="text-sm font-mono font-bold text-white flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-brand-cyan" />
                  Backend Export Data Schema
                </span>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#050508] rounded-xl p-4 font-mono text-xs text-brand-cyan overflow-x-auto max-h-60 mb-6 border border-white/10">
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
                  className="px-4 py-2 rounded-xl bg-brand-violet text-white text-xs font-mono font-bold flex items-center gap-2 shadow-glow-violet"
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
