import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton';
import { useExam } from '../context/ExamContext';
import { PixelArrowRight, PixelMenu, PixelX, PixelChevronDown, PixelCheck } from './PixelIcon';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);

  const { targetExam, setTargetExam } = useExam();

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
    <header className="fixed top-0 left-0 right-0 z-40 px-3 md:px-6 py-2.5 transition-all duration-300">
      <div
        className="max-w-7xl mx-auto rounded-none transition-all duration-300 px-4 py-2 flex items-center justify-between relative"
      >
        {/* Chassis Background Bezel with Stepped Pixel Corners */}
        <div className="absolute inset-0 bg-[#DC2626] border-4 border-black shadow-[0_4px_0px_#000] pixel-cut-corners -z-10 pointer-events-none" />

        {/* Brand Logo & Target Exam Selector Badge */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 group focus:outline-none bg-[#0D1117] border-3 border-black px-3 py-1 shadow-[3px_3px_0px_#000] rounded-none hover:bg-black transition-colors"
          >
            <span className="w-2.5 h-2.5 bg-[#EF4444] border border-black shadow-[1px_1px_0px_#000]" />
            <span className="text-xs sm:text-sm font-bold tracking-tight text-[#EF4444] flex items-center gap-1.5 font-pixel">
              SOCRATIC<span className="text-white">AI</span>
            </span>
          </a>

          {/* Active Target Exam Selector Dropdown Badge — Tactile White Bezel Tab */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setExamDropdownOpen(!examDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-none bg-white border-3 border-black text-black text-[10px] font-pixel font-bold hover:bg-[#F59E0B] active:translate-x-0.5 active:translate-y-0.5 transition-all shadow-[3px_3px_0px_#000] cursor-pointer"
            >
              <span>{targetExam}</span>
              <PixelChevronDown className="w-2.5 h-2.5 text-black" />
            </button>

            {examDropdownOpen && (
              <>
                {/* Backdrop to close dropdown on click outside */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setExamDropdownOpen(false)} 
                />
                
                {/* Dropdown Menu Container */}
                <div className="absolute top-full left-0 mt-2 w-52 bg-[#1E232A] border-3 border-black rounded-none p-1.5 shadow-[5px_5px_0px_#000] z-50 pixel-cut-corners">
                  <div className="text-[9px] font-pixel text-slate-300 px-2 py-1.5 uppercase tracking-wider border-b-2 border-black mb-1 flex items-center justify-between bg-[#14181F]">
                    <span>Select Track</span>
                    <span className="w-1.5 h-1.5 bg-[#EF4444] animate-pulse" />
                  </div>
                  {exams.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => {
                        setTargetExam(ex);
                        setExamDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-none text-[10px] font-pixel font-bold flex items-center justify-between transition-all my-0.5 border ${
                        targetExam === ex
                          ? 'bg-[#F59E0B] text-black border-black shadow-[2px_2px_0px_#000]'
                          : 'text-slate-200 border-transparent hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{targetExam === ex ? `> ${ex}` : ex}</span>
                      {targetExam === ex && <PixelCheck className="w-3.5 h-3.5 text-black" />}
                    </button>
                  ))}
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
              className="text-[10px] font-pixel uppercase tracking-wider text-black hover:text-white transition-colors duration-150 py-1 flex items-center font-bold"
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
            className="!px-4 !py-2 !text-xs !bg-[#F59E0B] !text-black !border-3 !border-black !shadow-[3px_3px_0px_#000]"
          >
            <span>Solve Now</span>
            <PixelArrowRight className="w-3.5 h-3.5 text-black" />
          </MagneticButton>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 border-2 border-black bg-white/10 hover:bg-white/20"
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
