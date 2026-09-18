import crypto from 'crypto';

/**
 * In-Memory Session Store for Socratic AI Problem Solving Sessions
 *
 * Session Schema:
 * {
 *   sessionId: string,
 *   createdAt: number,
 *   lastActiveAt: number,
 *   exam: string,
 *   subject: string,
 *   chapter: string,
 *   subtopic: string,
 *   questionText: string,
 *   attempts: [
 *     {
 *       attemptNumber: number,
 *       doubtText: string,
 *       hasImage: boolean,
 *       timestamp: number,
 *       isCorrect: boolean,
 *       feedback: string
 *     }
 *   ],
 *   currentHintLevel: number, // 0 if not attempted, 1 to 4
 *   hintsUsed: number,
 *   solved: boolean,
 *   expAwarded: number,
 *   allHints: string[], // 4 generated hints
 *   identifiedError: {
 *     errorTitle: string,
 *     errorDescription: string
 *   }
 * }
 */

const sessions = new Map();

// Session expiry: 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function cleanupOldSessions() {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActiveAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

// Run cleanup periodically every hour
const cleanupTimer = setInterval(cleanupOldSessions, 60 * 60 * 1000);
if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

export function calculateExp(hintsUsed) {
  // XP SYSTEM:
  // Correct with 0 hints used: +50 EXP
  // Correct with 1 hint used: +40 EXP
  // Correct with 2 hints used: +30 EXP
  // Correct with 3 hints used: +20 EXP
  // Correct with 4 hints used: +10 EXP
  if (hintsUsed <= 0) return 50;
  if (hintsUsed === 1) return 40;
  if (hintsUsed === 2) return 30;
  if (hintsUsed === 3) return 20;
  return 10;
}

export function calculateMasteryMetrics(hintsUsed, attemptsCount, isSolved) {
  if (!isSolved) {
    const inProgressPercentage = Math.min(65, 35 + (attemptsCount - 1) * 15);
    return {
      percentage: inProgressPercentage,
      status: "In Progress — Guided Refinement",
      percentile: "Top 45% Iteration Rate",
      conceptGrasp: Math.min(75, 45 + attemptsCount * 10),
      executionPrecision: 55,
      socraticAutonomy: Math.max(30, 85 - hintsUsed * 12),
      retentionScore: 68
    };
  }

  // When solved:
  let percentage = 98;
  let percentile = "Top 2% Percentile (Mastery Tier)";
  let status = "Exceptional First-Principle Breakthrough";
  let retention = 96;

  if (hintsUsed === 1) {
    percentage = 88;
    percentile = "Top 8% Percentile (Advanced Tier)";
    status = "Rapid Guided Adaptation";
    retention = 91;
  } else if (hintsUsed === 2) {
    percentage = 76;
    percentile = "Top 18% Percentile (Proficient Tier)";
    status = "Solid Concept Retrieval";
    retention = 84;
  } else if (hintsUsed === 3) {
    percentage = 64;
    percentile = "Top 35% Percentile (Progressing)";
    status = "Scaffolded Progression";
    retention = 75;
  } else if (hintsUsed >= 4) {
    percentage = 52;
    percentile = "Top 55% Percentile (Foundational)";
    status = "Full Step-by-Step Scaffolding";
    retention = 68;
  }

  return {
    percentage,
    percentile,
    status,
    conceptGrasp: Math.min(99, percentage + 2),
    executionPrecision: Math.min(98, percentage - 3),
    socraticAutonomy: Math.max(25, 100 - hintsUsed * 16),
    retentionScore: retention
  };
}

export const initialLeaderboards = {
  "JEE Main": [
    { rank: 1, name: "Ananya Sharma", handle: "ananya_jee", exp: 520, solved: 12, streak: 15, avatar: "👩‍🔬", accuracy: 94 },
    { rank: 2, name: "Rohan Verma", handle: "rohan_v", exp: 460, solved: 10, streak: 9, avatar: "👨‍💻", accuracy: 89 },
    { rank: 3, name: "Aarav Patel", handle: "aarav_p", exp: 390, solved: 9, streak: 12, avatar: "⚡", accuracy: 85 },
    { rank: 4, name: "Devansh Mehta", handle: "devansh_m", exp: 310, solved: 7, streak: 6, avatar: "🎯", accuracy: 81 },
    { rank: 5, name: "Tanvi Kulkarni", handle: "tanvi_k", exp: 260, solved: 6, streak: 8, avatar: "🧠", accuracy: 78 }
  ],
  "JEE Advanced": [
    { rank: 1, name: "Siddharth Rao", handle: "sid_adv", exp: 580, solved: 13, streak: 18, avatar: "🚀", accuracy: 96 },
    { rank: 2, name: "Kavya Nambiar", handle: "kavya_n", exp: 510, solved: 11, streak: 14, avatar: "🧬", accuracy: 92 },
    { rank: 3, name: "Aditya Roy", handle: "aditya_r", exp: 440, solved: 10, streak: 10, avatar: "⚛️", accuracy: 88 },
    { rank: 4, name: "Meera Sen", handle: "meera_s", exp: 360, solved: 8, streak: 7, avatar: "📐", accuracy: 83 },
    { rank: 5, name: "Vikram Malhotra", handle: "vikram_m", exp: 290, solved: 6, streak: 5, avatar: "🔭", accuracy: 79 }
  ],
  "NEET UG": [
    { rank: 1, name: "Dr. Isha Singhal", handle: "isha_neet", exp: 540, solved: 12, streak: 16, avatar: "🩺", accuracy: 95 },
    { rank: 2, name: "Farhan Qureshi", handle: "farhan_q", exp: 480, solved: 11, streak: 12, avatar: "🔬", accuracy: 91 },
    { rank: 3, name: "Ritika Das", handle: "ritika_d", exp: 410, solved: 9, streak: 11, avatar: "🌿", accuracy: 87 },
    { rank: 4, name: "Nikhil Joshi", handle: "nikhil_j", exp: 340, solved: 8, streak: 8, avatar: "🧪", accuracy: 82 },
    { rank: 5, name: "Ananya Pillai", handle: "ananya_p", exp: 270, solved: 6, streak: 6, avatar: "💡", accuracy: 77 }
  ]
};

export function getSession(sessionId) {
  if (!sessionId) return null;
  const session = sessions.get(sessionId);
  if (session) {
    session.lastActiveAt = Date.now();
  }
  return session || null;
}

export function createSession({
  exam,
  subject,
  chapter,
  subtopic,
  questionText,
  allHints = [],
  errorTitle = '',
  errorDescription = '',
  initialAttempt = null,
  isCorrect = false,
  isPartial = false,
  hasAttempt = true
}) {
  const sessionId = `SOC-SESS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const now = Date.now();

  let currentHintLevel = 0;
  let hintsUsed = 0;
  let solved = isCorrect;
  let expAwarded = 0;
  let partialExpTotal = 0;
  let deltaExp = 0;

  if (solved) {
    expAwarded = calculateExp(0);
    deltaExp = expAwarded;
  } else if (hasAttempt) {
    currentHintLevel = 1;
    hintsUsed = 1;
    if (isPartial) {
      partialExpTotal = 5;
      expAwarded = 5;
      deltaExp = 5;
    }
  }

  const attempts = [];
  if (initialAttempt) {
    attempts.push({
      attemptNumber: 1,
      doubtText: initialAttempt.doubtText || '',
      hasImage: Boolean(initialAttempt.hasImage),
      timestamp: now,
      isCorrect: solved,
      isPartial: Boolean(isPartial),
      deltaExp,
      feedback: errorDescription
    });
  }

  const session = {
    sessionId,
    createdAt: now,
    lastActiveAt: now,
    exam: exam || 'JEE Main',
    subject: subject || 'Mathematics',
    chapter: chapter || 'General',
    subtopic: subtopic || 'General Concepts',
    questionText: questionText || '',
    attempts,
    currentHintLevel,
    hintsUsed,
    solved,
    expAwarded,
    partialExpTotal,
    deltaExp,
    allHints,
    identifiedError: {
      errorTitle,
      errorDescription
    },
    masteryMetrics: calculateMasteryMetrics(hintsUsed, attempts.length || 1, solved)
  };

  sessions.set(sessionId, session);
  return session;
}

export function recordNewAttempt(sessionId, { doubtText, hasImage, isCorrect, isPartial = false, feedback, newHints = null }) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  session.lastActiveAt = Date.now();
  const attemptNumber = session.attempts.length + 1;

  if (newHints && Array.isArray(newHints) && newHints.length >= 4) {
    session.allHints = newHints;
  }

  let deltaExp = 0;

  if (isCorrect) {
    session.solved = true;
    const tierTotal = calculateExp(session.hintsUsed);
    // Deduct any partial EXP already earned so total never exceeds the tier reward
    const remainingBalance = Math.max(10, tierTotal - (session.partialExpTotal || 0));
    deltaExp = remainingBalance;
    session.partialExpTotal = (session.partialExpTotal || 0);
    session.expAwarded = (session.partialExpTotal || 0) + remainingBalance;
  } else {
    // Partial attempt credit (+5 EXP, max 2 partial credits = 10 EXP per session)
    if (isPartial && (session.partialExpTotal || 0) < 10) {
      deltaExp = 5;
      session.partialExpTotal = (session.partialExpTotal || 0) + 5;
      session.expAwarded = session.partialExpTotal;
    } else {
      deltaExp = 0;
    }

    // Increment hint level sequentially (up to 4)
    if (session.currentHintLevel < 4) {
      session.currentHintLevel += 1;
      session.hintsUsed = session.currentHintLevel;
    }
    if (feedback) {
      session.identifiedError.errorDescription = feedback;
    }
  }

  session.deltaExp = deltaExp;

  session.attempts.push({
    attemptNumber,
    doubtText: doubtText || '',
    hasImage: Boolean(hasImage),
    timestamp: Date.now(),
    isCorrect,
    isPartial: Boolean(isPartial),
    deltaExp,
    feedback: feedback || ''
  });

  session.masteryMetrics = calculateMasteryMetrics(session.hintsUsed, attemptNumber, session.solved);

  return session;
}
