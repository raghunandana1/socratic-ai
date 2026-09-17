import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Flame, Zap, ArrowUpRight, Crown, Sparkles, CheckCircle2, ChevronRight, User } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import { useExam } from '../context/ExamContext';

export default function LeaderboardSection() {
  const { 
    targetExam, 
    userExp, 
    userName, 
    solvedCount, 
    streakDays, 
    currentUserRank, 
    userAhead, 
    userBehind,
    getExamLeaderboard 
  } = useExam();

  const [activeTab, setActiveTab] = useState(targetExam || 'JEE Main');

  // Exam categories: strictly JEE Main, JEE Advanced, NEET UG (No global)
  const categories = ['JEE Main', 'JEE Advanced', 'NEET UG'];

  const leaderboard = getExamLeaderboard(activeTab);
  const topThree = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);

  const currentUserInActiveTab = leaderboard.find(u => u.isCurrentUser);

  return (
    <section id="leaderboard" className="py-24 px-4 md:px-8 relative z-10 bg-[#07070D]/80 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-4 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Competitive EXP Arena</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4"
          >
            Aspirant EXP <span className="text-gradient-animated">Leaderboard.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg text-slate-400"
          >
            Rankings calibrated exclusively by Socratic doubt breakthroughs and hint efficiency. Earn more EXP by solving with fewer hints to overtake peers.
          </motion.p>
        </div>

        {/* Exam Category Filter Tabs (Strictly JEE Main, JEE Advanced, NEET UG) */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#0B0B14] border border-white/10 shadow-xl gap-1">
            {categories.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition-all relative ${
                    isActive
                      ? 'text-white shadow-glow-violet'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeLeaderboardTab"
                      className="absolute inset-0 rounded-xl bg-brand-violet"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{cat}</span>
                    {targetExam === cat && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Competitor Proximity Tracker (Who is in front of you) */}
        {currentUserInActiveTab && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-4xl mx-auto mb-10 p-4 rounded-2xl bg-gradient-to-r from-brand-violet/20 via-[#0E0E1F] to-brand-cyan/20 border border-brand-violet/40 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-violet/30 border border-brand-violet/50 flex items-center justify-center text-brand-cyan font-bold font-mono text-sm shadow-glow-violet">
                #{currentUserInActiveTab.rank}
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <span>Your Division Standing:</span>
                  <span className="text-brand-cyan">{currentUserInActiveTab.exp} Total EXP</span>
                </div>
                <div className="text-xs text-slate-300 font-sans">
                  {userAhead ? (
                    <span>
                      You are <strong className="text-amber-400">{userAhead.exp - currentUserInActiveTab.exp} EXP</strong> behind <strong className="text-white">@{userAhead.handle}</strong> (Rank #{userAhead.rank}). 1 clean breakthrough will overtake!
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      Division Leader! You are currently holding the #1 position in {activeTab}.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <a
              href="#doubt-portal"
              className="px-4 py-2 rounded-xl bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/30 text-brand-cyan text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
            >
              <span>Solve Doubts to Climb</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}

        {/* Podium Row: Top 3 Aspirants */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 items-end">
          
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="order-2 md:order-1"
            >
              <div className={`p-6 rounded-3xl bg-[#090914] border ${topThree[1].isCurrentUser ? 'border-brand-cyan ring-1 ring-brand-cyan/50 shadow-glow-cyan' : 'border-slate-400/30'} text-center relative overflow-hidden`}>
                <div className="w-12 h-12 rounded-full bg-slate-400/10 border border-slate-400/30 mx-auto flex items-center justify-center text-slate-300 text-xl mb-3">
                  🥈
                </div>
                <div className="text-xs font-mono text-slate-400 font-bold uppercase mb-1">Rank #2</div>
                <div className="text-base font-bold text-white mb-0.5 truncate flex items-center justify-center gap-1.5">
                  <span>{topThree[1].name}</span>
                  {topThree[1].isCurrentUser && <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.2 rounded">YOU</span>}
                </div>
                <div className="text-xs font-mono text-slate-500 mb-3">@{topThree[1].handle}</div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-400/10 text-slate-200 font-mono font-extrabold text-sm border border-slate-400/20">
                  <Zap className="w-3.5 h-3.5 text-slate-300" />
                  <span>{topThree[1].exp} EXP</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Gold / Apex) */}
          {topThree[0] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className={`p-8 rounded-3xl bg-gradient-to-b from-[#161324] to-[#0A0A16] border ${topThree[0].isCurrentUser ? 'border-brand-cyan ring-2 ring-brand-cyan/60 shadow-glow-cyan' : 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]'} text-center relative overflow-hidden scale-105 z-10`}>
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/50 mx-auto flex items-center justify-center text-amber-400 text-3xl mb-3 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  👑
                </div>
                <div className="inline-block text-[11px] font-mono text-amber-400 font-extrabold tracking-wider uppercase mb-1 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Apex Rank #1
                </div>
                <div className="text-lg font-extrabold text-white mb-0.5 truncate flex items-center justify-center gap-1.5">
                  <span>{topThree[0].name}</span>
                  {topThree[0].isCurrentUser && <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.2 rounded">YOU</span>}
                </div>
                <div className="text-xs font-mono text-slate-400 mb-4">@{topThree[0].handle}</div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-extrabold text-base border border-amber-500/40">
                  <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{topThree[0].exp} EXP</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="order-3"
            >
              <div className={`p-6 rounded-3xl bg-[#090914] border ${topThree[2].isCurrentUser ? 'border-brand-cyan ring-1 ring-brand-cyan/50 shadow-glow-cyan' : 'border-amber-700/30'} text-center relative overflow-hidden`}>
                <div className="w-12 h-12 rounded-full bg-amber-700/10 border border-amber-700/30 mx-auto flex items-center justify-center text-amber-600 text-xl mb-3">
                  🥉
                </div>
                <div className="text-xs font-mono text-slate-400 font-bold uppercase mb-1">Rank #3</div>
                <div className="text-base font-bold text-white mb-0.5 truncate flex items-center justify-center gap-1.5">
                  <span>{topThree[2].name}</span>
                  {topThree[2].isCurrentUser && <span className="text-[10px] bg-brand-cyan/20 text-brand-cyan px-1.5 py-0.2 rounded">YOU</span>}
                </div>
                <div className="text-xs font-mono text-slate-500 mb-3">@{topThree[2].handle}</div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-700/10 text-amber-400 font-mono font-extrabold text-sm border border-amber-700/20">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>{topThree[2].exp} EXP</span>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Full Rankings List Table */}
        <div className="max-w-4xl mx-auto">
          <TiltCard className="bg-[#08080E] border-white/10 p-4 sm:p-6 shadow-2xl rounded-3xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 px-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
              <span className="w-16">Rank</span>
              <span className="flex-1">Aspirant Candidate</span>
              <span className="hidden sm:inline-block w-28 text-center">Efficiency</span>
              <span className="w-28 text-right">Total EXP</span>
            </div>

            <div className="space-y-2.5">
              {leaderboard.map((student) => {
                const isUser = student.isCurrentUser;
                return (
                  <motion.div
                    key={student.id || student.handle}
                    layout
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                      isUser
                        ? 'bg-gradient-to-r from-brand-violet/25 via-[#0D0D1F] to-brand-cyan/20 border-brand-cyan shadow-glow-cyan'
                        : 'bg-[#050508] border-white/5 hover:border-white/15'
                    }`}
                  >
                    {/* Rank & Avatar */}
                    <div className="flex items-center gap-3 w-16">
                      <span className={`font-mono font-extrabold text-sm ${
                        student.rank === 1 ? 'text-amber-400' :
                        student.rank === 2 ? 'text-slate-300' :
                        student.rank === 3 ? 'text-amber-600' :
                        'text-slate-400'
                      }`}>
                        #{student.rank}
                      </span>
                      <span className="text-lg">{student.avatar}</span>
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm truncate ${isUser ? 'text-brand-cyan' : 'text-white'}`}>
                          {student.name}
                        </span>
                        {isUser && (
                          <span className="text-[10px] font-mono font-extrabold bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan px-2 py-0.5 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>@{student.handle}</span>
                        <span>•</span>
                        <span>{student.solved} Doubts Solved</span>
                      </div>
                    </div>

                    {/* Efficiency Metric */}
                    <div className="hidden sm:flex flex-col items-center w-28">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {student.accuracy}% Accuracy
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        🔥 {student.streak}d streak
                      </span>
                    </div>

                    {/* EXP Score Badge */}
                    <div className="w-28 text-right">
                      <span className={`inline-flex items-center gap-1 font-mono font-extrabold text-sm px-3 py-1 rounded-xl ${
                        isUser
                          ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-glow-cyan'
                          : 'bg-white/5 text-slate-200 border border-white/10'
                      }`}>
                        <Zap className="w-3.5 h-3.5 text-brand-purple" />
                        <span>{student.exp}</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </TiltCard>
        </div>

      </div>
    </section>
  );
}
