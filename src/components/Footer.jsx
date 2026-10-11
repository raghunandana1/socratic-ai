import React from 'react';
import { PixelGithub, PixelTwitter, PixelLinkedin } from './PixelIcon';

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-white/10 bg-[#060813]/90 backdrop-blur-2xl py-14 px-4 md:px-8 relative z-10 text-slate-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <a href="#" className="inline-flex items-center gap-2.5 mb-4 bg-[#0D1527]/90 border border-cyan-500/30 px-3.5 py-1.5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]" />
              <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1 font-sans">
                SOCRATIC<span className="text-cyan-400">AI</span>
              </span>
            </a>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              Autonomous multimodal diagnostic learning platform designed exclusively for JEE Main, JEE Advanced &amp; NEET UG aspirants.
            </p>
            <div className="text-[11px] font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-3 py-1 rounded-lg inline-block">
              OPERATIONAL • ZERO ANSWER DUMPING
            </div>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-6">
            © {new Date().getFullYear()} Socratic AI • All rights reserved.
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="md:col-span-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 inline-block">
            Platform
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#product" className="text-slate-400 hover:text-cyan-400 transition-colors">Why Socratic AI?</a></li>
            <li><a href="#how-it-works" className="text-slate-400 hover:text-cyan-400 transition-colors">Guided Learning Engine</a></li>
            <li><a href="#doubt-portal" className="text-slate-400 hover:text-cyan-400 transition-colors">Doubt Diagnosis Portal</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="md:col-span-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2 inline-block">
            Curriculum Tracks
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>• JEE Main Mathematics &amp; Physics</li>
            <li>• JEE Advanced Calculus &amp; Mechanics</li>
            <li>• NEET UG Organic Chemistry &amp; Biology</li>
          </ul>

          <div className="mt-5 flex items-center gap-3">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)]" aria-label="GitHub">
              <PixelGithub className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)]" aria-label="Twitter">
              <PixelTwitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-cyan-500/20 hover:border-cyan-400/40 text-slate-300 hover:text-cyan-300 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)]" aria-label="LinkedIn">
              <PixelLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
