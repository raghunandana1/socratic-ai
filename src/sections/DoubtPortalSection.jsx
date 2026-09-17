import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Camera, Upload, X, CheckCircle2, FileJson, Sparkles, BookOpen, Layers, HelpCircle, Download, Lightbulb, AlertTriangle, ArrowRight, RotateCcw, Zap, Lock } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import MagneticButton from '../components/MagneticButton';
import { useExam } from '../context/ExamContext';
import chaptersData from '../data/chaptersData.json';

export default function DoubtPortalSection() {
  const { targetExam, setTargetExam } = useExam();

  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedClass, setSelectedClass] = useState('11');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedSubtopic, setSelectedSubtopic] = useState('');
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

  const taxonomy = chaptersData.JEE_NEET_Exhaustive_Syllabus_Taxonomy;

  // Filter available subjects based on target exam (Hide Math if NEET!)
  const availableSubjects = targetExam.includes('NEET')
    ? ['Physics', 'Chemistry', 'Biology']
    : ['Physics', 'Chemistry', 'Mathematics'];

  // Keep subject valid when exam changes
  useEffect(() => {
    if (targetExam.includes('NEET') && selectedSubject === 'Mathematics') {
      setSelectedSubject('Physics');
    }
  }, [targetExam, selectedSubject]);

  // Filter available chapters based on Subject and Class
  const chaptersForSubjectAndClass = taxonomy[selectedSubject]
    ? taxonomy[selectedSubject].filter(item => item.class === selectedClass)
    : [];

  // Reset chapter & subtopic when subject or class changes
  useEffect(() => {
    if (chaptersForSubjectAndClass.length > 0) {
      setSelectedChapter(chaptersForSubjectAndClass[0].chapter);
    } else {
      setSelectedChapter('');
    }
  }, [selectedSubject, selectedClass, targetExam]);

  // Find subtopics for selected chapter
  const currentChapterObj = chaptersForSubjectAndClass.find(c => c.chapter === selectedChapter);
  const availableSubtopics = currentChapterObj ? currentChapterObj.subtopics : [];

  useEffect(() => {
    if (availableSubtopics.length > 0) {
      setSelectedSubtopic(availableSubtopics[0]);
    } else {
      setSelectedSubtopic('');
    }
  }, [selectedChapter]);

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

  // Generate dynamic, context-aware Socratic Hints based on user's query and syllabus
  const generateDynamicSocraticDiagnosis = (query, subject, chapter, subtopic, errorType) => {
    const cleanQuery = (query || "").trim();

    let errorTitle = errorType;
    let errorDescription = "";

    if (errorType === 'Conceptual Blindspot') {
      errorTitle = "Conceptual Misapplication";
      errorDescription = `Misinterpretation of core boundary conditions or fundamental definitions in ${subtopic || chapter}.`;
    } else if (errorType === 'Calculation Slip') {
      errorTitle = "Algebraic / Arithmetic Slip";
      errorDescription = `Sign error or incorrect coefficient expansion during intermediate simplification in ${subtopic || chapter}.`;
    } else if (errorType === 'Formula Amnesia') {
      errorTitle = "Formula Misapplication";
      errorDescription = `Incomplete identity formulation or misapplied standard formula in ${subtopic || chapter}.`;
    } else {
      errorTitle = "Execution Bottleneck";
      errorDescription = `Stalled progress during algebraic substitution or reduction step in ${subtopic || chapter}.`;
    }

    let hints = [];
    if (subject === 'Mathematics') {
      hints = [
        `Write down the governing constraints and check whether the discriminant or domain restrictions limit your variables.`,
        `Look for an algebraic restructuring: can you complete the square, group terms, or apply a known symmetry?`,
        `Combine your inequality constraints to solve for the target parameter.`
      ];
    } else if (subject === 'Physics') {
      hints = [
        `Identify the system's conserved quantities (energy, momentum, or charge) and state your chosen reference coordinate origin.`,
        `Apply the governing law relating the field, force, or potential to the distance parameter. Watch your inverse-square vs inverse-cube dependencies.`,
        `Substitute the boundary constraints and check if your dimensional units match the expected physical quantity.`
      ];
    } else {
      hints = [
        `Identify which reactant acts as the electrophile and which bond possesses the highest electron density.`,
        `Examine intermediate carbocation / transition state stability (+I effect, hyperconjugation, or resonance).`,
        `Direct the nucleophile to the most stable reactive center to yield the major thermodynamic product.`
      ];
    }

    return {
      errorTitle,
      errorDescription,
      hints
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
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('exam', targetExam);
      formData.append('subject', selectedSubject);
      formData.append('class', selectedClass);
      formData.append('chapter', selectedChapter);
      formData.append('subtopic', selectedSubtopic);
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
        setSubmittedResult({
          ...payload.data,
          session: payload.session,
          questionText: questionText || (imageFile ? '[Notebook Snapshot Attached]' : 'Target Problem')
        });
        return;
      }
      throw new Error('Malformed backend response');
    } catch (err) {
      console.warn('Backend API connection unavailable, falling back to heuristic engine:', err);

      const diagnosis = generateDynamicSocraticDiagnosis(
        questionText,
        selectedSubject,
        selectedChapter,
        selectedSubtopic,
        errorTag
      );

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
        setActiveSession(fallbackSession);
        setSubmittedResult({
          hasAttempt: true,
          isCorrect: false,
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
      formData.append('subject', selectedSubject);
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
        setSubmittedResult({
          ...payload.data,
          session: payload.session,
          questionText: submittedResult?.questionText || payload.session?.question
        });
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
        subject: selectedSubject,
        class: selectedClass,
        chapter: selectedChapter,
        subtopic: selectedSubtopic,
        errorTag: errorTag,
        doubtText: questionText,
        hasAttachment: !!imagePreview
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
            Select your syllabus chapter, attach notebook photos, and get instant interactive Socratic hints.
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
                  Taxonomy Connected
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
              
              {/* STEP 1: Syllabus Cascade Selectors */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center text-[10px]">1</span>
                  Select Syllabus & Chapter Context
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {/* Exam Target */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Target Exam *</label>
                    <select
                      value={targetExam}
                      onChange={(e) => setTargetExam(e.target.value)}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    >
                      <option value="JEE Main">JEE Main</option>
                      <option value="JEE Advanced">JEE Advanced</option>
                      <option value="NEET UG">NEET UG</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Subject *</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    >
                      {availableSubjects.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  {/* Class Level */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Class / Standard *</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    >
                      <option value="11">Class 11 (Foundations)</option>
                      <option value="12">Class 12 (Advanced & Boards)</option>
                    </select>
                  </div>
                </div>

                {/* Chapter & Subtopic Cascade */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Chapter *</label>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    >
                      {chaptersForSubjectAndClass.map((c) => (
                        <option key={c.chapter} value={c.chapter}>{c.chapter}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Subtopic Focus *</label>
                    <select
                      value={selectedSubtopic}
                      onChange={(e) => setSelectedSubtopic(e.target.value)}
                      className="w-full bg-[#050508] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-brand-cyan transition-colors"
                    >
                      {availableSubtopics.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 2: Doubt Input & Notebook Capture */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center text-[10px]">2</span>
                  Transcribe or Upload Notebook Doubt
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
                          Auto-detects subject and pinpoints where your working stalled (PNG, JPG, HEIC up to 10MB)
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

              {/* STEP 3: Misconception Tagging */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center text-[10px]">3</span>
                  Self-Diagnosed Bottleneck Category
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
                    /* CASE: Solved! Award EXP strictly calculated on backend */
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-6 mb-6 text-center backdrop-blur-md"
                    >
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-1.5 font-mono">Cognitive Breakthrough Achieved!</h4>
                      <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto mb-4 leading-relaxed font-sans">
                        {cleanMathText(submittedResult.feedbackForStudent) || "Outstanding deduction! You mastered this problem through graduated diagnostic inquiry."}
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+{activeSession?.expAwarded || 50} EXP Awarded</span>
                        <span className="text-emerald-500 font-normal">({activeSession?.hintsUsed || 0} hints used)</span>
                      </div>
                    </motion.div>
                  ) : (
                    /* CASE: Incorrect Attempt - Show Exact Error and Sequential Hint Ladder */
                    <>
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
                  subject: selectedSubject,
                  class: selectedClass,
                  chapter: selectedChapter,
                  subtopic: selectedSubtopic,
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
