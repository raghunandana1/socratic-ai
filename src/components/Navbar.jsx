import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { useExam } from '../context/ExamContext';
import { PixelArrowRight, PixelMenu, PixelX, PixelChevronDown, PixelCheck } from './PixelIcon';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);

  const { targetExam, setTargetExam, setShowOnboardingModal } = useExam();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Product', href: '#product' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Doubt Portal', href: '#doubt-portal' },
  ];

  const handleLinkClick = (href) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const exams = ['JEE Main', 'JEE Advanced', 'NEET UG'];

  return (
    <header data-mist-source="true" className="fixed top-0 left-0 right-0 z-40 px-3 md:px-6 py-2.5 transition-all duration-300">
      <div
        className="max-w-7xl mx-auto rounded-2xl transition-all duration-300 px-4 py-2 flex items-center justify-between relative"
      >
        {/* Modern 3D Glassmorphic Navigation Bar Chassis */}
        <div className="absolute inset-0 bg-[#0B132B]/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] -z-10 pointer-events-none" />

        {/* Brand Logo & Target Exam Selector Badge */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 group focus:outline-none bg-[#0D1527]/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-cyan-400 transition-all"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
            <span className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1 font-sans">
              SOCRATIC<span className="text-cyan-400">AI</span>
            </span>
          </a>

          {/* Active Target Exam Selector Dropdown Badge */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setExamDropdownOpen(!examDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold active:scale-95 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.4)] cursor-pointer"
            >
              <span className="text-cyan-300 font-medium">Track:</span>
              <span>{targetExam}</span>
              <PixelChevronDown className="w-3 h-3 text-cyan-400" />
            </button>

            {examDropdownOpen && (
              <>
                {/* Backdrop to close dropdown on click outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setExamDropdownOpen(false)} 
                />
                
                {/* Dropdown Menu Container */}
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#0D1527]/95 backdrop-blur-2xl border border-white/15 rounded-xl p-1.5 shadow-[0_20px_40px_rgba(0,0,0,0.8)] z-50">
                  <div className="text-[10px] text-slate-300 px-2 py-1.5 uppercase tracking-wider border-b border-white/10 mb-1 flex items-center justify-between font-semibold">
                    <span>Select Track</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#38bdf8]" />
                  </div>
                  {exams.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => {
                        setTargetExam(ex);
                        setExamDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all my-0.5 border ${
                        targetExam === ex
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'text-slate-200 border-transparent hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{ex}</span>
                      {targetExam === ex && <PixelCheck className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setExamDropdownOpen(false);
                      setShowOnboardingModal(true);
                    }}
                    className="w-full text-center mt-1 pt-1.5 border-t border-white/10 text-[10px] text-slate-400 hover:text-cyan-300 hover:underline block"
                  >
                    Open Track Overview Modal ➔
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.href);
              }}
              className="text-xs uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors duration-150 py-1 flex items-center font-semibold"
            >
              <span>{link.name}</span>
            </a>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <MagneticButton
            variant="primary"
            onClick={() => handleLinkClick('#doubt-portal')}
            className="!px-4 !py-2 !text-xs !bg-gradient-to-r !from-cyan-500 !to-blue-600 !text-white !rounded-xl !border !border-cyan-400/30 !shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:!shadow-[0_6px_25px_rgba(56,189,248,0.5)]"
          >
            <span>Solve Now</span>
            <PixelArrowRight className="w-3.5 h-3.5 text-white" />
          </MagneticButton>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <PixelX className="w-4 h-4 text-white" /> : <PixelMenu className="w-4 h-4 text-white" />}
        </button>
      </div>

      {/* Mobile Animated Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-20 left-4 right-4 pixel-panel rounded-none p-6 border-2 border-brand-violet/60 bg-[#0A0A0F]/95 backdrop-blur-2xl shadow-pixel-block flex flex-col gap-4"
          >
            <div className="pb-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">TARGET EXAM:</span>
              <div className="flex gap-1.5">
                {exams.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => {
                      setTargetExam(ex);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-2.5 py-1 rounded-none text-xs font-mono font-bold border ${
                      targetExam === ex ? 'bg-brand-violet text-white border-brand-violet' : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className="text-lg font-medium text-slate-200 hover:text-brand-cyan py-2 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-2">
              <MagneticButton
                variant="primary"
                className="w-full"
                onClick={() => handleLinkClick('#doubt-portal')}
              >
                <span>Try SocraticAI</span>
                <PixelArrowRight className="w-4 h-4 text-black" />
              </MagneticButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
