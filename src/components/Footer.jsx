import React from 'react';
import { PixelGithub, PixelTwitter, PixelLinkedin } from './PixelIcon';

export default function Footer() {
  return (
    <footer id="footer" className="border-t-4 border-black bg-[#DC2626] py-12 px-4 md:px-8 relative z-10 text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <a href="#" className="inline-flex items-center gap-2.5 mb-4 bg-[#0D1117] border-3 border-black px-3 py-1.5 shadow-[3px_3px_0px_#000] pixel-cut-corners">
              <span className="w-2.5 h-2.5 bg-[#EF4444] border border-black shadow-[1px_1px_0px_#000]" />
              <span className="text-xs sm:text-sm font-bold tracking-tight text-[#EF4444] flex items-center gap-1.5 font-pixel">
                SOCRATIC<span className="text-white">AI</span>
              </span>
            </a>
            <p className="text-[9px] text-black max-w-sm leading-relaxed mb-4 font-pixel">
              Autonomous multimodal diagnostic learning platform designed exclusively for JEE Main, JEE Advanced &amp; NEET UG aspirants.
            </p>
            <div className="text-[9px] font-pixel font-bold text-black bg-white border-2 border-black px-2.5 py-1 inline-block shadow-[2px_2px_0px_#000]">
              OPERATIONAL • ZERO ANSWER DUMPING
            </div>
          </div>
          <div className="text-[9px] text-black font-pixel font-bold mt-6">
            © {new Date().getFullYear()} Socratic AI • All rights reserved.
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="md:col-span-3">
          <h4 className="text-[10px] font-pixel font-bold text-black uppercase tracking-wider mb-4 border-b-2 border-black pb-1 inline-block">
            Platform
          </h4>
          <ul className="space-y-2.5 text-[9px] font-pixel font-bold">
            <li><a href="#product" className="text-black hover:text-white transition-colors">Why Socratic AI?</a></li>
            <li><a href="#how-it-works" className="text-black hover:text-white transition-colors">Guided Learning Engine</a></li>
            <li><a href="#doubt-portal" className="text-black hover:text-white transition-colors">Doubt Diagnosis Portal</a></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="md:col-span-4">
          <h4 className="text-[10px] font-pixel font-bold text-black uppercase tracking-wider mb-4 border-b-2 border-black pb-1 inline-block">
            Curriculum Tracks
          </h4>
          <ul className="space-y-2 text-[9px] font-pixel font-bold text-black">
            <li>• JEE Main Mathematics &amp; Physics</li>
            <li>• JEE Advanced Calculus &amp; Mechanics</li>
            <li>• NEET UG Organic Chemistry &amp; Biology</li>
          </ul>

          <div className="mt-5 flex items-center gap-2.5">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white shadow-[2px_2px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 rounded-none" aria-label="GitHub">
              <PixelGithub className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white shadow-[2px_2px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 rounded-none" aria-label="Twitter">
              <PixelTwitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white shadow-[2px_2px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 rounded-none" aria-label="LinkedIn">
              <PixelLinkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
