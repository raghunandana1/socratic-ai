import React, { createContext, useContext, useState, useEffect } from 'react';

const ExamContext = createContext();

const BASE_LEADERBOARDS = {
  "JEE Main": [
    { id: "jm-1", rank: 1, name: "Ananya Sharma", handle: "ananya_jee", exp: 520, solved: 12, streak: 15, avatar: "👩‍🔬", accuracy: 94 },
    { id: "jm-2", rank: 2, name: "Rohan Verma", handle: "rohan_v", exp: 460, solved: 10, streak: 9, avatar: "👨‍💻", accuracy: 89 },
    { id: "jm-3", rank: 3, name: "Aarav Patel", handle: "aarav_p", exp: 390, solved: 9, streak: 12, avatar: "⚡", accuracy: 85 },
    { id: "jm-4", rank: 4, name: "Devansh Mehta", handle: "devansh_m", exp: 310, solved: 7, streak: 6, avatar: "🎯", accuracy: 81 },
    { id: "jm-5", rank: 5, name: "Tanvi Kulkarni", handle: "tanvi_k", exp: 240, solved: 6, streak: 8, avatar: "🧠", accuracy: 78 },
    { id: "jm-6", rank: 6, name: "Ishaan Gupta", handle: "ishaan_g", exp: 170, solved: 4, streak: 4, avatar: "📚", accuracy: 74 }
  ],
  "JEE Advanced": [
    { id: "ja-1", rank: 1, name: "Siddharth Rao", handle: "sid_adv", exp: 580, solved: 13, streak: 18, avatar: "🚀", accuracy: 96 },
    { id: "ja-2", rank: 2, name: "Kavya Nambiar", handle: "kavya_n", exp: 510, solved: 11, streak: 14, avatar: "🧬", accuracy: 92 },
    { id: "ja-3", rank: 3, name: "Aditya Roy", handle: "aditya_r", exp: 430, solved: 10, streak: 10, avatar: "⚛️", accuracy: 88 },
    { id: "ja-4", rank: 4, name: "Meera Sen", handle: "meera_s", exp: 350, solved: 8, streak: 7, avatar: "📐", accuracy: 83 },
    { id: "ja-5", rank: 5, name: "Vikram Malhotra", handle: "vikram_m", exp: 250, solved: 6, streak: 5, avatar: "🔭", accuracy: 79 },
    { id: "ja-6", rank: 6, name: "Pooja Reddy", handle: "pooja_r", exp: 160, solved: 4, streak: 3, avatar: "✨", accuracy: 75 }
  ],
  "NEET UG": [
    { id: "nu-1", rank: 1, name: "Dr. Isha Singhal", handle: "isha_neet", exp: 540, solved: 12, streak: 16, avatar: "🩺", accuracy: 95 },
    { id: "nu-2", rank: 2, name: "Farhan Qureshi", handle: "farhan_q", exp: 470, solved: 11, streak: 12, avatar: "🔬", accuracy: 91 },
    { id: "nu-3", rank: 3, name: "Ritika Das", handle: "ritika_d", exp: 400, solved: 9, streak: 11, avatar: "🌿", accuracy: 87 },
    { id: "nu-4", rank: 4, name: "Nikhil Joshi", handle: "nikhil_j", exp: 320, solved: 8, streak: 8, avatar: "🧪", accuracy: 82 },
    { id: "nu-5", rank: 5, name: "Ananya Pillai", handle: "ananya_p", exp: 230, solved: 6, streak: 6, avatar: "💡", accuracy: 77 },
    { id: "nu-6", rank: 6, name: "Suresh Menon", handle: "suresh_m", exp: 150, solved: 4, streak: 4, avatar: "🌱", accuracy: 72 }
  ]
};

export function ExamProvider({ children }) {
  const [targetExam, setTargetExam] = useState(() => {
    return localStorage.getItem('socratic_target_exam') || 'JEE Main';
  });

  const [showOnboardingModal, setShowOnboardingModal] = useState(() => {
    return !localStorage.getItem('socratic_target_exam');
  });

  // User Profile & EXP State
  const [userExp, setUserExp] = useState(() => {
    const saved = localStorage.getItem('socratic_user_exp');
    return saved ? parseInt(saved, 10) : 210;
  });

  const [solvedCount, setSolvedCount] = useState(() => {
    const saved = localStorage.getItem('socratic_solved_count');
    return saved ? parseInt(saved, 10) : 5;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('socratic_user_name') || 'You (Aspirant)';
  });

  const [streakDays, setStreakDays] = useState(12);
  const [lastOvertakeNotice, setLastOvertakeNotice] = useState(null);
  const [trackSwitchNotice, setTrackSwitchNotice] = useState(null);

  const selectExam = (exam) => {
    setTargetExam(exam);
    localStorage.setItem('socratic_target_exam', exam);
    setShowOnboardingModal(false);

    // Scroll page to the very beginning immediately
    if (typeof window !== 'undefined') {
      try {
        if (window.lenis) {
          window.lenis.scrollTo(0, { immediate: true });
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        // Secondary tick to ensure scroll persists after DOM layout
        setTimeout(() => {
          if (window.lenis) {
            window.lenis.scrollTo(0, { immediate: true });
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }, 40);
      } catch (e) {
        window.scrollTo(0, 0);
      }
    }

    setTrackSwitchNotice({
      exam,
      timestamp: Date.now()
    });
    setTimeout(() => {
      setTrackSwitchNotice(prev => (prev?.exam === exam ? null : prev));
    }, 3200);
  };

  const addExp = (amount) => {
    if (!amount || amount <= 0) return;
    setUserExp(prev => {
      const nextExp = prev + amount;
      localStorage.setItem('socratic_user_exp', nextExp.toString());
      
      // Check if user passed anyone in the current exam track
      const currentTrack = BASE_LEADERBOARDS[targetExam] || BASE_LEADERBOARDS['JEE Main'];
      const passedPeer = currentTrack.find(p => p.exp >= prev && p.exp < nextExp);
      if (passedPeer) {
        setLastOvertakeNotice({
          overtakenPeer: passedPeer.name,
          newRankScore: nextExp
        });
        setTimeout(() => setLastOvertakeNotice(null), 7000);
      }
      return nextExp;
    });

    setSolvedCount(prev => {
      const nextCount = prev + 1;
      localStorage.setItem('socratic_solved_count', nextCount.toString());
      return nextCount;
    });
  };

  // Compute live leaderboard with current user inserted and dynamically sorted
  const getExamLeaderboard = (examCategory) => {
    const category = ['JEE Main', 'JEE Advanced', 'NEET UG'].includes(examCategory)
      ? examCategory
      : targetExam;

    const baseList = BASE_LEADERBOARDS[category] || BASE_LEADERBOARDS['JEE Main'];
    
    // User entry in this track
    const userEntry = {
      id: "current-user",
      name: userName,
      handle: "you_aspirant",
      exp: userExp,
      solved: solvedCount,
      streak: streakDays,
      avatar: "⚡",
      accuracy: 94,
      isCurrentUser: true
    };

    const combined = [...baseList, userEntry];
    combined.sort((a, b) => b.exp - a.exp);
    
    // Recalculate 1-indexed ranks
    return combined.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  };

  const currentRankList = getExamLeaderboard(targetExam);
  const currentUserRank = currentRankList.find(u => u.isCurrentUser)?.rank || 4;
  const userAhead = currentRankList.find(u => u.rank === currentUserRank - 1) || null;
  const userBehind = currentRankList.find(u => u.rank === currentUserRank + 1) || null;

  return (
    <ExamContext.Provider
      value={{
        targetExam,
        setTargetExam: selectExam,
        selectExam,
        showOnboardingModal,
        setShowOnboardingModal,
        userExp,
        userName,
        setUserName,
        solvedCount,
        streakDays,
        currentUserRank,
        userAhead,
        userBehind,
        lastOvertakeNotice,
        trackSwitchNotice,
        addExp,
        getExamLeaderboard
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}
