import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Camera, Upload, X, CheckCircle2, FileJson, Sparkles, BookOpen, Layers, HelpCircle, Download, Lightbulb, AlertTriangle, ArrowRight, RotateCcw, Zap } from 'lucide-react';
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

  const fileInputRef = useRef(null);

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

  // Generate dynamic, context-aware Socratic Hints based on user's query and syllabus
  const generateDynamicSocraticDiagnosis = (query, subject, chapter, subtopic, errorType) => {
    const cleanQuery = (query || "").trim();
    const isMetaQuery = /what to do next|how to start|help|what next|where to begin/i.test(cleanQuery);

    let errorTitle = errorType;
    let errorDescription = "";

    if (errorType === 'Conceptual Blindspot') {
      errorTitle = "Conceptual Misapplication";
      errorDescription = `Identified difficulty in mapping foundational principles of ${chapter} to problem constraints.`;
    } else if (errorType === 'Calculation Slip') {
      errorTitle = "Algebraic / Arithmetic Slip";
      errorDescription = `Calculations deviate during intermediate simplification steps in ${subtopic}.`;
    } else if (errorType === 'Formula Amnesia') {
      errorTitle = "Formula Misapplication";
      errorDescription = `Analyzed solution steps for formula application, base case conditions, or identity substitution.`;
    } else {
      errorTitle = "Execution Bottleneck";
      errorDescription = `Pacing bottleneck detected while transitioning between problem setup and computation.`;
    }

    // Dynamic Socratic hints stream
    let hints = [];
    if (isMetaQuery) {
      hints = [
        `First, identify the given parameters and boundary conditions in ${subtopic}.`,
        `Recall the key governing relation for ${subtopic} under ${chapter}. What variable needs isolating?`,
        `Substitute boundary values or test extreme cases to isolate candidate options.`
      ];
    } else if (cleanQuery.length > 0) {
      hints = [
        `Deconstruct "${cleanQuery.slice(0, 40)}${cleanQuery.length > 40 ? '...' : ''}" into core mathematical invariants.`,
        `Apply standard theorem for ${subtopic} in ${chapter}. Look for symmetry or cancellation opportunities.`,
        `Verify your result against physical/mathematical boundary constraints before finalizing.`
      ];
    } else {
      hints = [
        `Analyze the attached notebook snapshot for formula setup in ${chapter}.`,
        `Verify intermediate steps in ${subtopic} for sign errors or missing constants.`,
        `Substitute test values or boundary limits to confirm consistency.`
      ];
    }

    return {
      errorTitle,
      errorDescription,
      hints
    };
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
        setActiveHintStep(1);
        setSubmittedResult({
          ...payload.data,
          aiEngine: payload.aiEngine,
          isLiveAI: payload.isLiveAI
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
        setSubmittedResult({
          ticketId: `SOC-${Math.floor(100000 + Math.random() * 900000)}`,
          xpGained: 165,
          exam: targetExam,
          subject: selectedSubject,
          chapter: selectedChapter,
          subtopic: selectedSubtopic,
          errorTag: errorTag,
          transcribedText: questionText || (imagePreview ? "[Image Notebook Snapshot Attached]" : "Problem Query Submitted"),
          diagnosis: diagnosis,
          aiEngine: "Socratic Heuristic Engine (Backend Offline)",
          isLiveAI: false
        });
      }, 700);
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
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-brand-cyan animate-pulse" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Taxonomy Connected
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <span className={`w-2 h-2 rounded-full ${backendStatus.online ? (backendStatus.isLiveAI ? 'bg-emerald-400 animate-ping' : 'bg-brand-cyan') : 'bg-amber-400'}`} />
                  <span className="text-[11px] font-mono text-slate-300">
                    {backendStatus.online
                      ? (backendStatus.isLiveAI ? `Live Gemini 1.5 Flash (Online)` : `Backend API (Demo Mode)`)
                      : 'Autonomous Simulator (Backend Offline)'}
                  </span>
                </div>
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
                      className="w-full bg-[#050508] border border-white/15 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
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
                      className="w-full bg-[#050508] border border-white/15 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
                    >
                      {availableSubjects.map(subj => (
                        <option key={subj} value={subj}>{subj}</option>
                      ))}
                    </select>
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Class Level *</label>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full bg-[#050508] border border-white/15 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                </div>

                {/* Chapter & Subtopic Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Chapter *</label>
                    <select
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="w-full bg-[#050508] border border-white/15 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
                    >
                      {chaptersForSubjectAndClass.map(ch => (
                        <option key={ch.chapter} value={ch.chapter}>{ch.chapter}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Subtopic *</label>
                    <select
                      value={selectedSubtopic}
                      onChange={(e) => setSelectedSubtopic(e.target.value)}
                      className="w-full bg-[#050508] border border-white/15 text-white text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
                    >
                      {availableSubtopics.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* STEP 2: Camera & Notebook Attachment */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center text-[10px]">2</span>
                  Attach Notebook Photo / Camera Snapshot
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!imagePreview ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 rounded-2xl bg-[#050508] border border-dashed border-white/20 hover:border-brand-cyan text-center flex flex-col items-center justify-center gap-2 transition-all group"
                    >
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-cyan transition-colors" />
                      <span className="text-xs font-mono font-bold text-slate-300">Upload Image File</span>
                      <span className="text-[10px] text-slate-500">PNG, JPG up to 10MB</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-6 rounded-2xl bg-[#050508] border border-dashed border-white/20 hover:border-brand-violet text-center flex flex-col items-center justify-center gap-2 transition-all group"
                    >
                      <Camera className="w-6 h-6 text-slate-400 group-hover:text-brand-purple transition-colors" />
                      <span className="text-xs font-mono font-bold text-slate-300">Use Camera Snapshot</span>
                      <span className="text-[10px] text-slate-500">Click to snap photo</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative bg-[#050508] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={imagePreview} alt="Doubt notebook attachment" className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                      <div>
                        <div className="text-xs font-mono font-bold text-white">Notebook Photo Attached</div>
                        <div className="text-[10px] font-mono text-emerald-400">Ready for Multimodal Vision OCR</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setImageFile(null); }}
                      className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* STEP 3: Question Text & Error Tag */}
              <div>
                <div className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center text-[10px]">3</span>
                  Doubt Statement & Error Classification
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Question / Doubt Description</label>
                    <textarea
                      rows={3}
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      placeholder="Type your question (e.g. 'what to do next?' or specific math equation)..."
                      className="w-full bg-[#050508] border border-white/15 text-white text-xs font-sans rounded-xl p-3.5 focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Suspected Error Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Conceptual Blindspot', 'Calculation Slip', 'Speed Bottleneck', 'Formula Amnesia'].map(tag => (
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

            {/* SOCRATIC DIAGNOSTIC TICKET CARD (MATCHING USER SCREENSHOT AESTHETIC) */}
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
                  <div className="flex flex-wrap items-center justify-between pb-4 border-b border-white/10 mb-6 gap-2">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
                      <h4 className="text-sm sm:text-base font-mono font-bold text-white tracking-wide">
                        Socratic Diagnostic Ticket #{submittedResult.ticketId}{" "}
                        <span className="text-brand-purple font-mono">({`+${submittedResult.xpGained} XP`})</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {submittedResult.aiEngine && (
                        <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                          submittedResult.isLiveAI
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-brand-violet/10 text-brand-cyan border-brand-violet/20'
                        }`}>
                          {submittedResult.aiEngine}
                        </span>
                      )}
                      <button
                        onClick={() => setSubmittedResult(null)}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      >
                        <X className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* Context Specs Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#07070E] p-4 rounded-2xl border border-white/10 mb-6 font-mono text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1">Exam &amp; Subject Context:</span>
                      <span className="text-white font-bold">{submittedResult.exam} — {submittedResult.subject}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">AI Extracted Chapter &amp; Subtopic:</span>
                      <span className="text-brand-cyan font-bold">{submittedResult.subject} – {submittedResult.chapter} ({submittedResult.subtopic})</span>
                    </div>
                  </div>

                  {/* Transcribed Question Statement Box */}
                  <div className="bg-[#07070E] p-4 rounded-2xl border border-white/10 mb-6 font-mono text-xs">
                    <span className="text-slate-400 block mb-1">Transcribed Question Statement:</span>
                    <span className="text-white font-bold text-sm italic">"{submittedResult.transcribedText}"</span>
                  </div>

                  {/* AI Diagnosed Error Banner */}
                  <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4.5 mb-6">
                    <div className="text-xs font-mono font-bold text-rose-400 mb-1 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>AI Diagnosed Error: {submittedResult.diagnosis.errorTitle}</span>
                    </div>
                    <p className="text-xs font-sans text-slate-300">
                      {submittedResult.diagnosis.errorDescription}
                    </p>
                  </div>

                  {/* Progressive Socratic Hints Container with Stepper Tabs */}
                  <div className="bg-[#07070E] border border-brand-violet/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-brand-cyan">
                        <Lightbulb className="w-4 h-4 text-brand-purple" />
                        <span>Progressive Socratic Hints (Hint {activeHintStep} of {submittedResult.diagnosis.hints.length})</span>
                      </div>

                      {/* Interactive Step Buttons */}
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        {submittedResult.diagnosis.hints.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveHintStep(i + 1)}
                            className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                              activeHintStep === i + 1
                                ? 'bg-brand-violet text-white shadow-glow-violet'
                                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hint Content Text */}
                    <motion.div
                      key={activeHintStep}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#0F0F1A] p-4 rounded-xl border border-white/10 text-sm font-sans text-white leading-relaxed font-medium"
                    >
                      "{submittedResult.diagnosis.hints[activeHintStep - 1]}"
                    </motion.div>
                  </div>

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
