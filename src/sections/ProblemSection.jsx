import React from 'react';
import { Clock, HelpCircle, GitCommit } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import WordReveal from '../components/WordReveal';
import { PROBLEM_CARDS } from '../data/mockData';

export default function ProblemSection() {
  const cardIcons = {
    "01": <Clock className="w-6 h-6 text-rose-400" />,
    "02": <HelpCircle className="w-6 h-6 text-amber-400" />,
    "03": <GitCommit className="w-6 h-6 text-cyan-400" />,
  };

  return (
    <section id="product" className="scene min-h-[260svh] relative z-10" data-scene>
      <div className="scene__viewport scene-inner px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-6">
              <span className="block">
                <WordReveal text="The problem isn't finding the answer." startIndex={0} />
              </span>
              <span className="text-slate-400 block mt-1">
                <WordReveal text="It's knowing why you got it wrong." startIndex={6} />
              </span>
            </h2>

            <p
              data-rev
              style={{ '--d': '80ms' }}
              className="text-base sm:text-lg text-slate-400"
            >
              JEE & NEET demand deep diagnostic reasoning. Traditional doubt solving and generic AI LLMs have created three systemic traps:
            </p>
          </div>

          {/* Horizontal / Cinematic Responsive Card Rail */}
          <div className="overflow-hidden w-full py-4">
            <div
              className="scene-track flex gap-6 md:gap-8 items-stretch justify-start md:justify-center mx-auto"
              data-track
            >
              {PROBLEM_CARDS.map((card, index) => (
                <div
                  key={card.id}
                  data-rev
                  style={{ '--d': `${index * 80}ms` }}
                  className="w-[85vw] sm:w-[380px] lg:w-[400px] flex-shrink-0"
                >
                  <TiltCard className={`h-full flex flex-col justify-between p-8 bg-gradient-to-b ${card.accentColor} border-white/10 ${card.borderColor}`}>
                    <div>
                      {/* Top Badge & Number */}
                      <div className="flex items-center justify-between mb-8">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-wider">
                          {card.stat}
                        </span>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                          {cardIcons[card.id]}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
                        {card.description}
                      </p>
                    </div>

                    {/* Bottom Tag */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        {card.tag}
                      </span>
                      <span className="text-slate-400">CRITICAL</span>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
