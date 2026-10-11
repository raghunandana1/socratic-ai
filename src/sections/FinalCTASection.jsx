import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, BrainCircuit } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';

export default function FinalCTASection() {
  const sectionRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end end']
  });

  const spotlightY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [100, -20]);
  const spotlightScale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [0.85, 1.15]);

  return (
    <section ref={sectionRef} className="py-24 px-4 md:px-8 relative z-10 overflow-hidden bg-transparent">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-full bg-[#0D1527]/85 backdrop-blur-2xl border border-cyan-500/25 p-5 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.12)] relative rounded-2xl">
          
          {/* Chassis Top Bar */}
          <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
            <div className="bg-[#080D1A] border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
              SOCRATIC AI
            </div>
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#34d399]" />
              <span>SYS: READY</span>
            </div>
          </div>

          {/* Inner Dark Screen */}
          <div className="bg-[#080D1A]/90 border border-white/10 rounded-xl p-8 sm:p-14 shadow-[inset_0_2px_12px_rgba(0,0,0,0.7)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-semibold uppercase mb-6 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8] animate-pulse" />
              <span>START SOCRATIC LEARNING</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight mb-4 font-sans"
            >
              Your next breakthrough <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">is one question away.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8 font-normal leading-relaxed font-sans"
            >
              Stop collecting passive answer keys. Join thousands of JEE &amp; NEET aspirants mastering deep mathematical and physical intuition through graduated inquiry.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex justify-center"
            >
              <MagneticButton
                variant="primary"
                className="!px-8 !py-3.5 !text-sm !bg-gradient-to-r !from-cyan-500 !to-blue-600 !text-white !rounded-xl !border !border-cyan-400/30 !shadow-[0_4px_20px_rgba(37,99,235,0.4)] hover:!shadow-[0_6px_28px_rgba(56,189,248,0.5)]"
                onClick={() => {
                  const el = document.querySelector('#doubt-portal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Start Solving Now ➔</span>
              </MagneticButton>
            </motion.div>

            <div className="mt-8 text-xs font-medium text-slate-400">
              ★ Available for JEE Main, JEE Advanced &amp; NEET UG
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
