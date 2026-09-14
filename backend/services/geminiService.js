import { buildSocraticSystemInstruction, buildSocraticUserPrompt } from '../prompts/socraticPrompts.js';

export async function diagnoseDoubtWithGemini({
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
  const systemInstruction = buildSocraticSystemInstruction();
  const userPrompt = buildSocraticUserPrompt({
    exam,
    subject,
    classLevel,
    chapter,
    subtopic,
    errorTag,
    doubtText,
    hasImage: !!imageBuffer
  });

  // Determine model list (ensuring deprecated 1.5-flash is replaced with 3.6-flash)
  const candidateModels = [];
  if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL !== 'gemini-1.5-flash') {
    candidateModels.push(process.env.GEMINI_MODEL);
  }
  candidateModels.push('gemini-3.6-flash', 'gemini-flash-latest');

  // Check if API key is provided and not the placeholder
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

        // Add student text prompt
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
          continue; // Try next candidate model
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          throw new Error('Empty response from Gemini');
        }

        // Clean response in case markdown formatting wraps the JSON
        const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
        const parsedData = JSON.parse(cleanedText);

        const detectedSubj = parsedData.detectedSubject || parsedData.subject || subject || "Physics";
        const detectedChap = parsedData.detectedChapter || parsedData.chapter || chapter || "General";
        const detectedSub = parsedData.detectedSubtopic || parsedData.subtopic || subtopic || "General Concepts";

        return {
          success: true,
          aiEngine: `Google Gemini 3.6 Flash (Live Free Tier)`,
          isLiveAI: true,
          data: {
            ticketId: parsedData.ticketId || `SOC-${Math.floor(100000 + Math.random() * 900000)}`,
            exam: parsedData.exam || exam || "JEE Main",
            subject: detectedSubj,
            chapter: detectedChap,
            subtopic: detectedSub,
            errorTag: parsedData.diagnosis?.errorTitle || errorTag || "Conceptual Misapplication",
            transcribedText: parsedData.transcribedText || doubtText || (imageBuffer ? "[Handwritten Notebook Working Processed]" : "Doubt Statement"),
            problemAnalysis: parsedData.problemAnalysis || `Socratic deconstruction of ${detectedSubj} problem under ${detectedChap}.`,
            diagnosis: {
              errorTitle: parsedData.diagnosis?.errorTitle || errorTag || "Conceptual Misapplication",
              errorDescription: parsedData.diagnosis?.errorDescription || "Misapplication of core domain invariants.",
              hints: parsedData.diagnosis?.hints || [
                "Identify the given parameters and boundary conditions for this problem.",
                "Which fundamental relation or conservation law governs this system?",
                "Substitute the boundary limits to simplify."
              ]
            },
            xpGained: parsedData.xpGained || 160,
            nextScaffoldingQuestion: parsedData.nextScaffoldingQuestion || "What is your next step?"
          }
        };
      } catch (err) {
        console.error(`[Gemini Service] Error with model ${model}:`, err.message);
      }
    }
  }

  // Graceful Fallback Mode (Runs when no API key is set or API is unreachable)
  return getFallbackDiagnosticResponse({
    exam,
    subject,
    chapter,
    subtopic,
    errorTag,
    doubtText,
    hasImage: !!imageBuffer
  });
}

function getFallbackDiagnosticResponse({ exam, subject, chapter, subtopic, errorTag, doubtText, hasImage }) {
  const cleanQuery = (doubtText || "").trim();
  const ticketNum = Math.floor(100000 + Math.random() * 900000);

  let errorTitle = errorTag;
  let errorDescription = "";

  if (errorTag === 'Conceptual Blindspot') {
    errorTitle = "Conceptual Misapplication";
    errorDescription = `Identified difficulty in mapping foundational principles of ${chapter || "this topic"} to problem constraints.`;
  } else if (errorTag === 'Calculation Slip') {
    errorTitle = "Algebraic / Arithmetic Slip";
    errorDescription = `Calculations deviate during intermediate simplification steps in ${subtopic || "this section"}.`;
  } else if (errorTag === 'Formula Amnesia') {
    errorTitle = "Formula Misapplication";
    errorDescription = `Solution steps suggest uncertainty in base case conditions, identity substitution, or sign conventions.`;
  } else {
    errorTitle = "Execution Bottleneck";
    errorDescription = `Pacing bottleneck detected while transitioning between problem setup and computation.`;
  }

  const hints = [
    `Deconstruct the given expressions in ${subtopic || chapter || "the question"}. Identify all known invariants and boundary constraints.`,
    `Apply the standard governing theorem for ${subtopic || chapter}. Look for symmetries, cancellations, or conservation relations.`,
    `Carry out the resulting algebraic reduction and test boundary limits to confirm consistency.`
  ];

  return {
    success: true,
    aiEngine: "Socratic Heuristic Diagnostic Engine (Demo Fallback)",
    isLiveAI: false,
    note: "Add your free GEMINI_API_KEY in backend/.env to activate live Google Gemini 1.5 Flash multimodal vision.",
    data: {
      ticketId: `SOC-${ticketNum}`,
      exam: exam || "JEE Main",
      subject: subject || "Mathematics",
      chapter: chapter || "General",
      subtopic: subtopic || "General Concepts",
      errorTag: errorTag || "Conceptual Blindspot",
      transcribedText: cleanQuery || (hasImage ? "[Notebook Camera Snapshot Uploaded — Vision OCR Pending Live Key]" : "Problem Query Analyzed"),
      problemAnalysis: `Socratic deconstruction of student doubt under ${chapter} (${subtopic}).`,
      diagnosis: {
        errorTitle,
        errorDescription,
        hints
      },
      xpGained: 155,
      nextScaffoldingQuestion: `What operation will help you isolate the primary variable in ${subtopic || "this problem"}?`
    }
  };
}
