import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { ExamProvider } from './context/ExamContext';
import OnboardingModal from './components/OnboardingModal';
import CustomCursor from './components/CustomCursor';
import MathCanvasBackground from './components/MathCanvasBackground';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import GuidanceSection from './sections/GuidanceSection';
import DoubtPortalSection from './sections/DoubtPortalSection';
import AdaptiveRLEngineSection from './sections/AdaptiveRLEngineSection';
import MasterySection from './sections/MasterySection';
import FinalCTASection from './sections/FinalCTASection';
import Footer from './components/Footer';

import { useExam } from './context/ExamContext';
import { motion, AnimatePresence } from 'framer-motion';

function MainAppContent() {
  const { targetExam, trackSwitchNotice } = useExam();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Initialize Lenis smooth kinetic scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      window.lenis = null;
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050507] text-[#F8FAFC] font-sans selection:bg-brand-violet/30 selection:text-brand-cyan overflow-x-hidden bg-noise">
      {/* Onboarding Target Exam Selection Modal */}
      <OnboardingModal />

      {/* Track Switch Re-initialization Toast Banner */}
      <AnimatePresence>
        {trackSwitchNotice && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-[#090912]/95 border border-brand-cyan/40 shadow-glow-cyan backdrop-blur-2xl flex items-center gap-3 text-xs font-mono pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
            <span className="text-white font-bold">
              {trackSwitchNotice.exam} Curriculum
            </span>
            <span className="text-slate-400 border-l border-white/15 pl-3 text-[11px]">
              Loaded from Beginning
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background ambient canvas particle field */}
      <MathCanvasBackground />

      {/* Mouse radial glow spotlight */}
      <CustomCursor />

      {/* Top scroll progress indicator */}
      <ScrollProgress />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Landing Page Sections — Keyed to targetExam for clean re-mount from beginning */}
      <main key={targetExam} className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <GuidanceSection />
        <DoubtPortalSection />
        <AdaptiveRLEngineSection />
        <MasterySection />
        <FinalCTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ExamProvider>
      <MainAppContent />
    </ExamProvider>
  );
}
