import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagnoseDoubtWithGemini, analyzeVisionImageWithGemini } from './services/geminiService.js';
import { initialLeaderboards } from './services/sessionStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory leaderboards state (categorized by JEE Main, JEE Advanced, NEET UG)
let leaderboardState = JSON.parse(JSON.stringify(initialLeaderboards));

// Configure Multer for In-Memory File Uploads (up to 10MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

// Load syllabus taxonomy from local backend data or parent src
let taxonomyData = null;
try {
  const localTaxonomyPath = path.resolve(__dirname, './data/chaptersData.json');
  const parentTaxonomyPath = path.resolve(__dirname, '../src/data/chaptersData.json');
  
  if (fs.existsSync(localTaxonomyPath)) {
    taxonomyData = JSON.parse(fs.readFileSync(localTaxonomyPath, 'utf8'));
  } else if (fs.existsSync(parentTaxonomyPath)) {
    taxonomyData = JSON.parse(fs.readFileSync(parentTaxonomyPath, 'utf8'));
  }
} catch (err) {
  console.warn('[Taxonomy] Warning: Could not load chaptersData.json:', err.message);
}

function getApiKey() {
  const envKey = Object.keys(process.env).find(k => k.trim().toUpperCase() === 'GEMINI_API_KEY' || k.trim().toUpperCase() === 'GOOGLE_API_KEY');
  const val = envKey ? process.env[envKey] : (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  return val ? val.trim().replace(/^["']|["']$/g, '') : null;
}

// 1. Healthcheck Route
app.get('/api/v1/health', (req, res) => {
  const apiKey = getApiKey();
  const isKeyConfigured = Boolean(apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key_here'));

  res.json({
    status: 'healthy',
    service: 'Socratic AI Diagnostic Backend',
    version: '1.0.0',
    gemini: {
      isKeyConfigured,
      model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
      mode: isKeyConfigured ? 'Live Google Gemini Multimodal' : 'Heuristic Fallback (Demo)',
      keyPrefix: apiKey ? `${apiKey.substring(0, 4)}...` : 'none',
      keyLength: apiKey ? apiKey.length : 0
    },
    timestamp: new Date().toISOString()
  });
});

// 2. Syllabus Taxonomy Route
app.get('/api/v1/taxonomy', (req, res) => {
  if (!taxonomyData) {
    return res.status(404).json({ error: 'Taxonomy dataset not found' });
  }
  res.json(taxonomyData);
});

// 3. Leaderboard Routes (Strictly JEE Main, JEE Advanced, NEET UG)
app.get('/api/v1/leaderboard', (req, res) => {
  const category = req.query.category || 'JEE Main';
  const data = leaderboardState[category] || leaderboardState['JEE Main'];
  res.json({
    success: true,
    category,
    categories: ['JEE Main', 'JEE Advanced', 'NEET UG'],
    leaderboard: data
  });
});

app.post('/api/v1/leaderboard/score', (req, res) => {
  const { name, handle, exp, exam, solved } = req.body;
  const category = ['JEE Main', 'JEE Advanced', 'NEET UG'].includes(exam) ? exam : 'JEE Main';

  if (!leaderboardState[category]) {
    leaderboardState[category] = [];
  }

  const existingIdx = leaderboardState[category].findIndex(u => u.handle === handle || u.name === name);
  if (existingIdx >= 0) {
    leaderboardState[category][existingIdx].exp = exp;
    if (solved) leaderboardState[category][existingIdx].solved = solved;
  } else {
    leaderboardState[category].push({
      rank: 0,
      name: name || 'You (Aspirant)',
      handle: handle || 'you_aspirant',
      exp: exp || 0,
      solved: solved || 1,
      streak: 12,
      avatar: '⚡',
      accuracy: 92,
      isCurrentUser: true
    });
  }

  // Sort descending by EXP
  leaderboardState[category].sort((a, b) => b.exp - a.exp);
  leaderboardState[category].forEach((item, idx) => {
    item.rank = idx + 1;
  });

  res.json({
    success: true,
    category,
    leaderboard: leaderboardState[category]
  });
});

// 4. Main Socratic Doubt Diagnostic Route
app.post('/api/v1/doubts/diagnose', upload.single('image'), async (req, res) => {
  try {
    const {
      sessionId,
      exam,
      subject,
      class: classLevel,
      chapter,
      subtopic,
      errorTag,
      questionText: doubtText
    } = req.body;

    const imageBuffer = req.file ? req.file.buffer : null;
    const imageMimeType = req.file ? req.file.mimetype : null;

    console.log(`[Doubt Ingestion] Received request: Session=${sessionId || 'New'} | ${exam || 'General'} | ${subject || 'General'} | Image Attached: ${Boolean(imageBuffer)}`);

    const diagnosticResult = await diagnoseDoubtWithGemini({
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
    });

    return res.json(diagnosticResult);
  } catch (error) {
    console.error('[Diagnose Route Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to diagnose doubt',
      message: error.message
    });
  }
});

// 5. Multimodal Vision OCR Extraction Route
app.post('/api/v1/vision/analyze', upload.single('image'), async (req, res) => {
  try {
    const { exam } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null;
    const imageMimeType = req.file ? req.file.mimetype : null;

    console.log(`[Vision Ingestion] Received image upload: Size=${imageBuffer ? imageBuffer.length : 0} bytes | Exam=${exam || 'JEE Main'}`);

    const result = await analyzeVisionImageWithGemini({
      imageBuffer,
      imageMimeType,
      exam
    });

    return res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('[Vision Route Error]', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract vision data from image',
      message: error.message
    });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Socratic AI Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🎯 Diagnose API: POST http://localhost:${PORT}/api/v1/doubts/diagnose`);
  console.log(`👁️ Vision OCR API: POST http://localhost:${PORT}/api/v1/vision/analyze`);
  console.log(`🔑 Gemini Key Status: ${process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_gemini') ? 'Configured ✅' : 'Not Configured (Demo Mode Active) ⚠️'}`);
  console.log(`====================================================`);
});
