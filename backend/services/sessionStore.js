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
setInterval(cleanupOldSessions, 60 * 60 * 1000);

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
  hasAttempt = true
}) {
  const sessionId = `SOC-SESS-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const now = Date.now();

  let currentHintLevel = 0;
  let hintsUsed = 0;
  let solved = isCorrect;
  let expAwarded = 0;

  if (solved) {
    expAwarded = calculateExp(0);
  } else if (hasAttempt) {
    currentHintLevel = 1;
    hintsUsed = 1;
  }

  const attempts = [];
  if (initialAttempt) {
    attempts.push({
      attemptNumber: 1,
      doubtText: initialAttempt.doubtText || '',
      hasImage: Boolean(initialAttempt.hasImage),
      timestamp: now,
      isCorrect: solved,
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
    allHints,
    identifiedError: {
      errorTitle,
      errorDescription
    }
  };

  sessions.set(sessionId, session);
  return session;
}

export function recordNewAttempt(sessionId, { doubtText, hasImage, isCorrect, feedback, newHints = null }) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  session.lastActiveAt = Date.now();
  const attemptNumber = session.attempts.length + 1;

  if (newHints && Array.isArray(newHints) && newHints.length >= 4) {
    session.allHints = newHints;
  }

  if (isCorrect) {
    session.solved = true;
    session.expAwarded = calculateExp(session.hintsUsed);
  } else {
    // Increment hint level sequentially (up to 4)
    if (session.currentHintLevel < 4) {
      session.currentHintLevel += 1;
      session.hintsUsed = session.currentHintLevel;
    }
    if (feedback) {
      session.identifiedError.errorDescription = feedback;
    }
  }

  session.attempts.push({
    attemptNumber,
    doubtText: doubtText || '',
    hasImage: Boolean(hasImage),
    timestamp: Date.now(),
    isCorrect,
    feedback: feedback || ''
  });

  return session;
}
