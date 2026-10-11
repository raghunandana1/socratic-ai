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
        <div className="w-full bg-[#DC2626] border-4 border-black p-4 sm:p-6 shadow-[6px_6px_0px_#000] relative rounded-none">
          
          {/* Chassis Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b-3 border-black">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#EF4444] border-2 border-black shadow-[1px_1px_0px_#000]" />
              <span className="w-3 h-3 bg-white border-2 border-black shadow-[1px_1px_0px_#000]" />
              <span className="w-3 h-3 bg-[#10B981] border-2 border-black shadow-[1px_1px_0px_#000]" />
            </div>
            <div className="bg-[#0D1117] border-2 border-black px-2.5 py-0.5 text-[9px] font-pixel text-[#EF4444] font-bold shadow-[2px_2px_0px_#000]">
              SOCRATIC AI
            </div>
            <div className="text-[9px] font-pixel text-black font-bold">
              SYS: READY
            </div>
          </div>

          {/* Inner Slate Screen */}
          <div className="bg-[#1E232A] border-3 border-black p-6 sm:p-12 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-white text-black border-2 border-black text-[10px] font-pixel font-bold uppercase mb-6 shadow-[2px_2px_0px_#000] rounded-none"
            >
              <span className="w-2 h-2 bg-[#EF4444] border border-black animate-pulse" />
              <span>START SOCRATIC LEARNING</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 font-pixel drop-shadow-[2px_2px_0px_#000]"
            >
              Your next breakthrough <br />
              <span className="text-white">is one question away.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-100 max-w-xl mx-auto mb-8 font-medium leading-relaxed font-sans"
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
                className="px-8 py-3.5 text-xs sm:text-sm"
                onClick={() => {
                  const el = document.querySelector('#doubt-portal');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Start Solving Now ➔</span>
              </MagneticButton>
            </motion.div>

            <div className="mt-8 text-[9px] font-pixel text-slate-400">
              ★ Available for JEE Main, JEE Advanced &amp; NEET UG
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
