import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { ExamProvider } from './context/ExamContext';
import OnboardingModal from './components/OnboardingModal';
import MistBackground3D from './components/MistBackground3D';
import ScrollProgress from './components/ScrollProgress';
import Navbar from './components/Navbar';
import HeroSection from './sections/HeroSection';
import ProblemSection from './sections/ProblemSection';
import GuidanceSection from './sections/GuidanceSection';
import DoubtPortalSection from './sections/DoubtPortalSection';
import MasterySection from './sections/MasterySection';
import FinalCTASection from './sections/FinalCTASection';
import Footer from './components/Footer';

import { useExam } from './context/ExamContext';

function MainAppContent() {
  const { targetExam } = useExam();

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

    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(() => {
        lenis.scrollTo(window.location.hash, { immediate: true });
      }, 50);
    }

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
    <div className="relative min-h-screen bg-[#060809] text-[#F8FAFC] font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* Onboarding Target Exam Selection Modal */}
      <OnboardingModal />

      {/* Interactive 3D Pixel-Art Mist Background */}
      <MistBackground3D />

      {/* Top scroll progress indicator */}
      <ScrollProgress />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Landing Page Sections — Rendered over the 3D Pixel Mist background */}
      <main key={targetExam} className="relative z-10">
        <HeroSection />
        <ProblemSection />
        <GuidanceSection />
        <DoubtPortalSection />
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
