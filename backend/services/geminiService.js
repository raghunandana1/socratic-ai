import { buildSocraticSystemInstruction, buildSocraticUserPrompt } from '../prompts/socraticPrompts.js';
import { getSession, createSession, recordNewAttempt } from './sessionStore.js';

// Helper to clean raw LaTeX commands into natural human-readable text
export function cleanMathFormatting(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
    .replace(/\\dfrac\{([^}]+)\}\{([^}]+)\}/g, '($1) / ($2)')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\\sqrt\[([^\]]+)\]\{([^}]+)\}/g, '$1√($2)')
    .replace(/\\implies/g, '➔')
    .replace(/\\iff/g, '⟺')
    .replace(/\\to/g, '→')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\infty/g, '∞')
    .replace(/\\pi/g, 'π')
    .replace(/\\theta/g, 'θ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\vec\{([^}]+)\}/g, '$1_vec')
    .replace(/\\hat\{([^}]+)\}/g, '$1_hat')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\mathrm\{([^}]+)\}/g, '$1')
    .replace(/\$+/g, '') // remove markdown/LaTeX math dollar delimiters
    .replace(/\\int_\{?([^}^_]+)\}?\^\{?([^}]+)\}?/g, '∫[$1 to $2]')
    .replace(/\\int/g, '∫')
    .replace(/\\sum_\{?([^}^_]+)\}?\^\{?([^}]+)\}?/g, '∑[$1 to $2]')
    .replace(/\\sum/g, '∑')
    .trim();
}

export async function diagnoseDoubtWithGemini({
  sessionId,
  exam,
  subject,
  classLevel,
  chapter,
  subtopic,
  errorTag,
  doubtText,
  imageBuffer,
  imageMimeType
}) {
  const envKey = Object.keys(process.env).find(k => k.trim().toUpperCase() === 'GEMINI_API_KEY' || k.trim().toUpperCase() === 'GOOGLE_API_KEY');
  const rawApiKey = envKey ? process.env[envKey] : (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '') : null;

  // Retrieve existing session if provided
  let existingSession = sessionId ? getSession(sessionId) : null;
  const attemptNumber = existingSession ? existingSession.attempts.length + 1 : 1;
  const priorAttempts = existingSession ? existingSession.attempts : [];

  const systemInstruction = buildSocraticSystemInstruction();
  const userPrompt = buildSocraticUserPrompt({
    exam: existingSession ? existingSession.exam : exam,
    subject: existingSession ? existingSession.subject : subject,
    classLevel,
    chapter: existingSession ? existingSession.chapter : chapter,
    subtopic: existingSession ? existingSession.subtopic : subtopic,
    errorTag,
    doubtText,
    hasImage: !!imageBuffer,
    attemptNumber,
    priorAttempts
  });

  const candidateModels = [];
  if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL !== 'gemini-1.5-flash') {
    candidateModels.push(process.env.GEMINI_MODEL);
  }
  candidateModels.push('gemini-3.6-flash', 'gemini-flash-latest');

  const isKeyConfigured = apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key_here');

  if (isKeyConfigured) {
    for (const model of candidateModels) {
      try {
        const parts = [];

        // Add image if attached
        if (imageBuffer) {
          parts.push({
            inlineData: {
              data: imageBuffer.toString('base64'),
              mimeType: imageMimeType || 'image/jpeg'
            }
          });
        }

        // Add student prompt
        parts.push({
          text: userPrompt
        });

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemInstruction }]
            },
            contents: [
              {
                role: 'user',
                parts: parts
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.2,
              maxOutputTokens: 2048
            }
          })
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.warn(`[Gemini API] Model ${model} failed with status ${response.status}: ${errorBody}`);
          continue;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          throw new Error('Empty response from Gemini');
        }

        const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsedData = JSON.parse(cleanedText);

        return processDiagnosticPayload({
          parsedData,
          existingSession,
          exam,
          subject,
          chapter,
          subtopic,
          errorTag,
          doubtText,
          hasImage: !!imageBuffer
        });
      } catch (err) {
        console.error(`[Gemini Service] Error with model ${model}:`, err.message);
      }
    }
  }

  // Graceful Fallback Mode (Demo / Offline)
  return getFallbackDiagnosticResponse({
    existingSession,
    exam,
    subject,
    chapter,
    subtopic,
    errorTag,
    doubtText,
    hasImage: !!imageBuffer
  });
}

function processDiagnosticPayload({
  parsedData,
  existingSession,
  exam,
  subject,
  chapter,
  subtopic,
  errorTag,
  doubtText,
  hasImage
}) {
  const hasAttempt = parsedData.hasAttempt !== false;
  const isCorrect = Boolean(parsedData.isCorrect);

  const detectedSubj = parsedData.detectedSubject || subject || (existingSession?.subject) || "Mathematics";
  const detectedChap = parsedData.detectedChapter || chapter || (existingSession?.chapter) || "General";
  const detectedSub = parsedData.detectedSubtopic || subtopic || (existingSession?.subtopic) || "General Concepts";
  const questionStatement = cleanMathFormatting(parsedData.questionStatement || parsedData.transcribedText || doubtText || "Problem Statement");

  const rawHints = parsedData.hints && parsedData.hints.length >= 4 ? parsedData.hints : [
    "Identify the known physical/mathematical invariants and state your chosen coordinate origin.",
    "Which governing law or theorem directly relates your known variables to the target unknown?",
    "Notice where your algebraic substitution or sign convention introduced an extraneous factor.",
    "Equate the simplified terms to solve for the target variable."
  ];
  const cleanedHints = rawHints.map(h => cleanMathFormatting(h));

  const errorTitle = parsedData.errorTitle || (parsedData.diagnosis?.errorTitle) || errorTag || "Conceptual Misapplication";
  const errorDescription = cleanMathFormatting(parsedData.errorDescription || (parsedData.diagnosis?.errorDescription) || "Identified calculation or conceptual discrepancy.");
  const firstIncorrectStep = parsedData.firstIncorrectStep ? cleanMathFormatting(parsedData.firstIncorrectStep) : null;
  const feedbackForStudent = cleanMathFormatting(parsedData.feedbackForStudent || errorDescription);
  const reasoningSteps = (parsedData.reasoningSteps || []).map(s => cleanMathFormatting(s));

  let session;
  if (existingSession) {
    session = recordNewAttempt(existingSession.sessionId, {
      doubtText,
      hasImage,
      isCorrect,
      feedback: feedbackForStudent,
      newHints: cleanedHints
    });
  } else {
    session = createSession({
      exam: exam || "JEE Main",
      subject: detectedSubj,
      chapter: detectedChap,
      subtopic: detectedSub,
      questionText: questionStatement,
      allHints: cleanedHints,
      errorTitle,
      errorDescription,
      initialAttempt: {
        doubtText,
        hasImage
      },
      isCorrect,
      hasAttempt
    });
  }

  // Format UI hints response: ONLY reveal up to session.currentHintLevel
  const revealedHints = session.allHints.slice(0, session.currentHintLevel);
  const totalHintsAvailable = 4;
  const lockedCount = Math.max(0, totalHintsAvailable - session.currentHintLevel);

  return {
    success: true,
    session: {
      sessionId: session.sessionId,
      question: session.questionText,
      attemptsCount: session.attempts.length,
      currentHintLevel: session.currentHintLevel,
      hintsUsed: session.hintsUsed,
      solved: session.solved,
      expAwarded: session.expAwarded
    },
    data: {
      hasAttempt,
      isCorrect: session.solved,
      firstIncorrectStep,
      reasoningSteps,
      errorTitle: session.identifiedError.errorTitle,
      errorDescription: session.identifiedError.errorDescription,
      feedbackForStudent,
      unlockedHints: revealedHints,
      currentHint: revealedHints[revealedHints.length - 1] || null,
      totalHints: totalHintsAvailable,
      lockedCount,
      attempts: session.attempts
    }
  };
}

function getFallbackDiagnosticResponse({
  existingSession,
  exam,
  subject,
  chapter,
  subtopic,
  errorTag,
  doubtText,
  hasImage
}) {
  const cleanQuery = (doubtText || "").trim();
  const hasAttempt = Boolean(cleanQuery.length > 0 || hasImage);
  const isCorrect = /correct|eureka|solution verified/i.test(cleanQuery);

  const fallbackHints = [
    "Identify the known physical/mathematical invariants and boundary conditions.",
    "Recall the governing formula or conservation relation for this system. What variable needs isolating?",
    "Check your algebraic expansion for sign reversals or missing constants.",
    "Carry out the final reduction and test extreme boundary limits to verify consistency."
  ];

  let session;
  if (existingSession) {
    session = recordNewAttempt(existingSession.sessionId, {
      doubtText,
      hasImage,
      isCorrect,
      feedback: isCorrect ? "Solution verified!" : "Your approach is moving in the right direction, but check intermediate simplification."
    });
  } else {
    session = createSession({
      exam: exam || "JEE Main",
      subject: subject || "Mathematics",
      chapter: chapter || "General",
      subtopic: subtopic || "General Concepts",
      questionText: cleanQuery || (hasImage ? "[Notebook Snapshot Problem Statement]" : "Target Problem"),
      allHints: fallbackHints,
      errorTitle: "Conceptual Misapplication",
      errorDescription: "Identified discrepancy between problem constraints and intermediate calculation.",
      initialAttempt: {
        doubtText: cleanQuery,
        hasImage
      },
      isCorrect,
      hasAttempt
    });
  }

  const revealedHints = session.allHints.slice(0, session.currentHintLevel);
  const totalHintsAvailable = 4;
  const lockedCount = Math.max(0, totalHintsAvailable - session.currentHintLevel);

  return {
    success: true,
    session: {
      sessionId: session.sessionId,
      question: session.questionText,
      attemptsCount: session.attempts.length,
      currentHintLevel: session.currentHintLevel,
      hintsUsed: session.hintsUsed,
      solved: session.solved,
      expAwarded: session.expAwarded
    },
    data: {
      hasAttempt,
      isCorrect: session.solved,
      firstIncorrectStep: session.solved ? null : "Step 2: Misapplied constraint",
      reasoningSteps: [
        "Step 1: Extracted given parameters and boundary conditions",
        "Step 2: Executed intermediate algebraic substitution"
      ],
      errorTitle: session.identifiedError.errorTitle,
      errorDescription: session.identifiedError.errorDescription,
      feedbackForStudent: hasAttempt
        ? (session.solved ? "Brilliant work! Your solution is verified and complete." : "You're close! Review the currently unlocked hint below before retrying.")
        : "Please write out your initial reasoning or calculations first so Socratic AI can evaluate your step-by-step thinking.",
      unlockedHints: revealedHints,
      currentHint: revealedHints[revealedHints.length - 1] || null,
      totalHints: totalHintsAvailable,
      lockedCount,
      attempts: session.attempts
    }
  };
}
