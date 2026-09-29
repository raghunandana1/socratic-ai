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

const DEFAULT_MASTERY_DATA = {
  "JEE Main": [
    { id: "math", subject: "Mathematics", name: "Mathematics — Calculus & Algebra", accuracy: 89, color: "#8B5CF6", level: "JEE Main Mastered", doubtsDiagnosed: 4, doubtsSolved: 3 },
    { id: "physics", subject: "Physics", name: "Physics — Mechanics & Electrodynamics", accuracy: 87, color: "#22D3EE", level: "Top Percentile", doubtsDiagnosed: 3, doubtsSolved: 3 },
    { id: "chem", subject: "Chemistry", name: "Chemistry — Physical & Inorganic", accuracy: 84, color: "#10B981", level: "Mastery Level 4", doubtsDiagnosed: 2, doubtsSolved: 2 }
  ],
  "JEE Advanced": [
    { id: "physics", subject: "Physics", name: "Physics — Rotational Dynamics & Optics", accuracy: 81, color: "#22D3EE", level: "JEE Advanced Ready", doubtsDiagnosed: 3, doubtsSolved: 2 },
    { id: "math", subject: "Mathematics", name: "Mathematics — Coordinate & Vectors", accuracy: 78, color: "#8B5CF6", level: "AIR < 1000 Target", doubtsDiagnosed: 2, doubtsSolved: 2 },
    { id: "chem", subject: "Chemistry", name: "Chemistry — Organic Mechanisms", accuracy: 83, color: "#10B981", level: "Advanced Diagnostic", doubtsDiagnosed: 2, doubtsSolved: 2 }
  ],
  "NEET UG": [
    { id: "bio", subject: "Biology", name: "Biology — Human Physiology & Genetics", accuracy: 96, color: "#10B981", level: "NEET Top Tier", doubtsDiagnosed: 5, doubtsSolved: 5 },
    { id: "chem", subject: "Chemistry", name: "Chemistry — Organic & Bio-molecules", accuracy: 92, color: "#8B5CF6", level: "Speed Mastered", doubtsDiagnosed: 3, doubtsSolved: 3 },
    { id: "physics", subject: "Physics", name: "Physics — Kinematics & Optics", accuracy: 91, color: "#22D3EE", level: "High Accuracy", doubtsDiagnosed: 2, doubtsSolved: 2 }
  ]
};


export function ExamProvider({ children }) {
  const [targetExam, setTargetExam] = useState(() => {
    return localStorage.getItem('socratic_target_exam') || 'JEE Main';
  });

  const [showOnboardingModal, setShowOnboardingModal] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('skip_modal')) {
      return false;
    }
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
  const [totalAttempts, setTotalAttempts] = useState(() => {
    const saved = localStorage.getItem('socratic_total_attempts');
    return saved ? parseInt(saved, 10) : 6;
  });
  const [correctAttempts, setCorrectAttempts] = useState(() => {
    const saved = localStorage.getItem('socratic_correct_attempts');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [lastOvertakeNotice, setLastOvertakeNotice] = useState(null);
  const [trackSwitchNotice, setTrackSwitchNotice] = useState(null);

  // Dynamic Subject Mastery & Session Activity
  const [subjectMastery, setSubjectMastery] = useState(() => {
    try {
      const saved = localStorage.getItem('socratic_subject_mastery');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_MASTERY_DATA;
  });

  const [sessionExp, setSessionExp] = useState(() => {
    try {
      const saved = sessionStorage.getItem('socratic_session_exp');
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return 120;
  });

  const [lastPortalActivity, setLastPortalActivity] = useState(null);

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

    setSessionExp(prev => {
      const next = prev + amount;
      try {
        sessionStorage.setItem('socratic_session_exp', next.toString());
      } catch (e) {}
      return next;
    });

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

  const recordDoubtActivity = ({ exam, subject, isSolved, hintsUsed = 1, expEarned = 5, errorType }) => {
    const currentExam = exam || targetExam || 'JEE Main';
    const subStr = (subject || '').toLowerCase();
    
    let normSubject = 'Physics';
    if (subStr.includes('bio') || subStr.includes('botan') || subStr.includes('zool') || subStr.includes('genet') || subStr.includes('physiol')) {
      normSubject = 'Biology';
    } else if (subStr.includes('chem') || subStr.includes('organic') || subStr.includes('reaction') || subStr.includes('acid')) {
      normSubject = 'Chemistry';
    } else if (subStr.includes('math') || subStr.includes('calculus') || subStr.includes('algebra') || subStr.includes('integral') || subStr.includes('vector') || subStr.includes('matrix')) {
      normSubject = 'Mathematics';
    } else if (subStr.includes('phys') || subStr.includes('mechanic') || subStr.includes('rotat') || subStr.includes('torque') || subStr.includes('optics') || subStr.includes('electro')) {
      normSubject = 'Physics';
    } else {
      normSubject = currentExam === 'NEET UG' ? 'Biology' : 'Physics';
    }

    setSubjectMastery(prevMastery => {
      const trackList = prevMastery[currentExam] || DEFAULT_MASTERY_DATA[currentExam] || DEFAULT_MASTERY_DATA['JEE Main'];
      
      const updatedList = trackList.map(item => {
        if (item.subject.toLowerCase() === normSubject.toLowerCase()) {
          const newDiagnosed = (item.doubtsDiagnosed || 0) + 1;
          const newSolved = isSolved ? (item.doubtsSolved || 0) + 1 : (item.doubtsSolved || 0);
          
          let accuracyDelta = 0;
          if (isSolved) {
            accuracyDelta = hintsUsed <= 1 ? 3 : hintsUsed === 2 ? 1 : 0;
          } else {
            accuracyDelta = 1;
          }
          const newAccuracy = Math.min(99, Math.max(50, item.accuracy + accuracyDelta));
          
          let newLevel = item.level;
          if (newAccuracy >= 95) newLevel = "Elite Mastered";
          else if (newAccuracy >= 90) newLevel = "Top Percentile";
          else if (newAccuracy >= 85) newLevel = "Proficient Tier";
          else if (newAccuracy >= 80) newLevel = "Calibrated Level 4";

          return {
            ...item,
            doubtsDiagnosed: newDiagnosed,
            doubtsSolved: newSolved,
            accuracy: newAccuracy,
            level: newLevel,
            lastUpdated: Date.now()
          };
        }
        return item;
      });

      const nextFull = {
        ...prevMastery,
        [currentExam]: updatedList
      };

      try {
        localStorage.setItem('socratic_subject_mastery', JSON.stringify(nextFull));
      } catch (e) {}

      return nextFull;
    });

    setLastPortalActivity({
      exam: currentExam,
      subject: normSubject,
      isSolved: Boolean(isSolved),
      expEarned: expEarned || 0,
      timestamp: Date.now()
    });

    if (expEarned && expEarned > 0) {
      addExp(expEarned);
    }
  };

  const liveAccuracy = Math.min(99, Math.max(45, Math.round((correctAttempts / Math.max(1, totalAttempts)) * 100)));

  const recordDiagnosticAttempt = (isCorrect, expEarned = 50) => {
    setTotalAttempts(prev => {
      const next = prev + 1;
      localStorage.setItem('socratic_total_attempts', next.toString());
      return next;
    });

    if (isCorrect) {
      setCorrectAttempts(prev => {
        const next = prev + 1;
        localStorage.setItem('socratic_correct_attempts', next.toString());
        return next;
      });
      addExp(expEarned);
    }
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
      accuracy: liveAccuracy,
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
        totalAttempts,
        correctAttempts,
        liveAccuracy,
        recordDiagnosticAttempt,
        currentUserRank,
        userAhead,
        userBehind,
        lastOvertakeNotice,
        trackSwitchNotice,
        addExp,
        getExamLeaderboard,
        subjectMastery,
        sessionExp,
        setSessionExp,
        lastPortalActivity,
        recordDoubtActivity
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
