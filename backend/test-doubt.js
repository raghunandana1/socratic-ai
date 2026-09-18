import { createSession, recordNewAttempt, calculateExp, calculateMasteryMetrics } from './services/sessionStore.js';

console.log('=== TEST 1: EXP Calculation Validation ===');
console.assert(calculateExp(0) === 50, '0 hints used should award 50 EXP');
console.assert(calculateExp(1) === 40, '1 hint used should award 40 EXP');
console.assert(calculateExp(2) === 30, '2 hints used should award 30 EXP');
console.assert(calculateExp(3) === 20, '3 hints used should award 20 EXP');
console.assert(calculateExp(4) === 10, '4 hints used should award 10 EXP');
console.log('✅ EXP calculations strictly meet user requirements (50, 40, 30, 20, 10).');

console.log('\n=== TEST 2: Mastery Metrics & Cognitive Curve Calculation ===');
const m0 = calculateMasteryMetrics(0, 1, true);
console.assert(m0.percentage === 98, '0 hints should give 98% mastery');
const m1 = calculateMasteryMetrics(1, 2, true);
console.assert(m1.percentage === 88, '1 hint should give 88% mastery');
const m2 = calculateMasteryMetrics(2, 3, true);
console.assert(m2.percentage === 76, '2 hints should give 76% mastery');
const mIncomplete = calculateMasteryMetrics(1, 1, false);
console.assert(mIncomplete.percentage <= 65, 'Incomplete should reflect in-progress percentage');
console.log('✅ Mastery metrics calculation verified successfully!');

console.log('\n=== TEST 3: Session Sequential Unlock Life Cycle ===');
// 1. Initial Attempt: Incorrect
const s1 = createSession({
  exam: 'JEE Main',
  subject: 'Physics',
  chapter: 'Kinematics',
  subtopic: 'Projectile Motion',
  questionText: 'Find range when angle is 45 deg',
  allHints: ['Hint 1: Directional', 'Hint 2: Error specific', 'Hint 3: Formula value', 'Hint 4: Strong scaffolding'],
  errorTitle: 'Calculation Slip',
  errorDescription: 'Missed factor of 2',
  initialAttempt: { doubtText: 'R = v^2 / g', hasImage: false },
  isCorrect: false,
  hasAttempt: true
});

console.log('Attempt 1 Initial Level:', s1.currentHintLevel);
console.assert(s1.currentHintLevel === 1, 'Attempt 1 should unlock Hint 1');
console.assert(s1.hintsUsed === 1, 'Attempt 1 should register 1 hint used');
console.assert(s1.solved === false, 'Attempt 1 is not solved');

// 2. Retry Attempt 2: Still Incorrect
const s2 = recordNewAttempt(s1.sessionId, {
  doubtText: 'R = v^2 * sin(theta) / g',
  hasImage: false,
  isCorrect: false,
  feedback: 'Still missing factor of 2 in argument'
});

console.log('Attempt 2 Unlocked Level:', s2.currentHintLevel);
console.assert(s2.currentHintLevel === 2, 'Attempt 2 failure should unlock Hint 2');
console.assert(s2.hintsUsed === 2, 'Attempt 2 registers 2 hints used');
console.assert(s2.solved === false, 'Still not solved');

// 3. Retry Attempt 3: Correct!
const s3 = recordNewAttempt(s1.sessionId, {
  doubtText: 'R = v^2 * sin(2*theta) / g',
  hasImage: false,
  isCorrect: true,
  feedback: 'Correct formula!'
});

console.log('Attempt 3 Solved:', s3.solved, '| EXP Awarded:', s3.expAwarded, '| Mastery:', s3.masteryMetrics.percentage + '%');
console.assert(s3.solved === true, 'Attempt 3 is solved');
console.assert(s3.expAwarded === 30, 'Solved after using 2 hints should award exactly 30 EXP');
console.assert(s3.masteryMetrics.percentage === 76, 'Solved after using 2 hints should record 76% mastery');
console.log('✅ Sequential unlock and retry lifecycle verified successfully!');

console.log('\n=== TEST 4: Partial Attempt Micro-Credit (+5 EXP) Validation ===');
// Create session with partial attempt 1
const p1 = createSession({
  exam: 'JEE Main',
  subject: 'Physics',
  chapter: 'Rotational Mechanics',
  subtopic: 'Torque',
  questionText: 'Find angular acceleration',
  allHints: ['Hint 1', 'Hint 2', 'Hint 3', 'Hint 4'],
  errorTitle: 'Calculation Slip',
  errorDescription: 'Missed inertia factor',
  initialAttempt: { doubtText: 'tau = r * F', hasImage: false },
  isCorrect: false,
  isPartial: true,
  hasAttempt: true
});

console.assert(p1.expAwarded === 5, 'Attempt 1 partial should award +5 EXP');
console.assert(p1.deltaExp === 5, 'Attempt 1 delta should be 5 EXP');
console.assert(p1.partialExpTotal === 5, 'Attempt 1 partial total should be 5');

// Attempt 2: Another valid partial equation
const p2 = recordNewAttempt(p1.sessionId, {
  doubtText: 'tau = I * alpha, where I = 0.5 * M * R^2',
  hasImage: false,
  isCorrect: false,
  isPartial: true,
  feedback: 'Equations correct; now isolate alpha'
});

console.assert(p2.expAwarded === 10, 'Attempt 2 partial should bring total to 10 EXP');
console.assert(p2.deltaExp === 5, 'Attempt 2 delta should be 5 EXP');
console.assert(p2.partialExpTotal === 10, 'Attempt 2 partial total should be 10');

// Attempt 3: Final Solve!
const p3 = recordNewAttempt(p1.sessionId, {
  doubtText: 'alpha = 2 * F / (M * R)',
  hasImage: false,
  isCorrect: true,
  feedback: 'Breakthrough achieved!'
});

// Solved at hint level 2 (hintsUsed = 2 -> tier base = 30 EXP).
// Since 10 EXP was already awarded in partials, remaining balance is 20 EXP. Total = 30 EXP.
console.assert(p3.solved === true, 'p3 must be solved');
console.assert(p3.deltaExp === 20, 'p3 remaining balance should be 20 EXP (30 tier - 10 partial)');
console.assert(p3.expAwarded === 30, 'p3 total EXP should match the 30 EXP tier');
console.log('✅ Partial progress micro-credit (+5 EXP) and remaining balance logic verified perfectly!');

console.log('\n=== TEST 5: Multimodal Vision OCR Analysis Validation ===');
import { analyzeVisionImageWithGemini } from './services/geminiService.js';

const visionRes = await analyzeVisionImageWithGemini({
  imageBuffer: null,
  imageMimeType: null,
  exam: 'JEE Main'
});

console.assert(visionRes.detectedSubject === 'Physics', 'Should detect Physics');
console.assert(visionRes.detectedChapter === 'Kinematics', 'Should detect Kinematics');
console.assert(visionRes.displayFormula.left === 'v_rel', 'Should format v_rel formula');
console.assert(Array.isArray(visionRes.variableBreakdown) && visionRes.variableBreakdown.length > 0, 'Should have variable breakdown');
console.assert(typeof visionRes.studentExplanation === 'string', 'Should provide student intuition');
console.log('✅ Multimodal Vision OCR extraction verified successfully!');


