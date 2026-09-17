import { createSession, recordNewAttempt, calculateExp } from './services/sessionStore.js';

console.log('=== TEST 1: EXP Calculation Validation ===');
console.assert(calculateExp(0) === 50, '0 hints used should award 50 EXP');
console.assert(calculateExp(1) === 40, '1 hint used should award 40 EXP');
console.assert(calculateExp(2) === 30, '2 hints used should award 30 EXP');
console.assert(calculateExp(3) === 20, '3 hints used should award 20 EXP');
console.assert(calculateExp(4) === 10, '4 hints used should award 10 EXP');
console.log('✅ EXP calculations strictly meet user requirements (50, 40, 30, 20, 10).');

console.log('\n=== TEST 2: Session Sequential Unlock Life Cycle ===');
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

console.log('Attempt 3 Solved:', s3.solved, '| EXP Awarded:', s3.expAwarded);
console.assert(s3.solved === true, 'Attempt 3 is solved');
console.assert(s3.expAwarded === 30, 'Solved after using 2 hints should award exactly 30 EXP');
console.log('✅ Sequential unlock and retry lifecycle verified successfully!');
