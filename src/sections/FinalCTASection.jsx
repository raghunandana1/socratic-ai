import React from 'react';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';
import WordReveal from '../components/WordReveal';

export default function FinalCTASection() {
  return (
    <section className="py-32 px-4 md:px-8 relative z-10 overflow-hidden scene-transition-overlap">
      {/* Background Orbs with Parallax */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-t from-brand-violet/20 via-brand-cyan/10 to-transparent rounded-full blur-[140px] pointer-events-none parallax-bg" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        
        <div
          data-rev
          style={{ '--d': '40ms' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-violet/10 border border-brand-violet/30 text-brand-cyan text-xs font-semibold tracking-wider uppercase mb-8 shadow-glow-violet backdrop-blur-md"
        >
          <BrainCircuit className="w-4 h-4 text-brand-cyan animate-pulse" />
          <span>Transform Your Exam Preparation</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight mb-8">
          <WordReveal text="Your next breakthrough" startIndex={0} /> <br />
          <WordReveal text="is one question away." className="text-gradient-animated" startIndex={3} />
        </h2>

        <p
          data-rev
          style={{ '--d': '100ms' }}
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
        >
          Stop collecting passive answer keys. Join thousands of JEE & NEET aspirants mastering deep mathematical and physical intuition.
        </p>

        <div
          data-rev
          style={{ '--d': '160ms' }}
          className="flex justify-center"
        >
          <MagneticButton
            variant="primary"
            className="text-lg px-9 py-4"
            onClick={() => {
              const el = document.querySelector('#doubt-portal');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Start Solving Now</span>
            <ArrowRight className="w-5 h-5" />
          </MagneticButton>
        </div>

      </div>
    </section>
  );
}
