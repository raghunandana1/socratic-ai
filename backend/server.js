import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { diagnoseDoubtWithGemini } from './services/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// 1. Healthcheck Route
app.get('/api/v1/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim() !== '' && !apiKey.includes('your_gemini_api_key_here'));

  res.json({
    status: 'healthy',
    service: 'Socratic AI Diagnostic Backend',
    version: '1.0.0',
    gemini: {
      isKeyConfigured,
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      mode: isKeyConfigured ? 'Live Google Gemini Multimodal' : 'Heuristic Fallback (Demo)'
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

// 3. Main Socratic Doubt Diagnostic Route
app.post('/api/v1/doubts/diagnose', upload.single('image'), async (req, res) => {
  try {
    const {
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

    console.log(`[Doubt Ingestion] Received request: ${exam || 'General'} | ${subject || 'General'} | Image Attached: ${Boolean(imageBuffer)}`);

    const diagnosticResult = await diagnoseDoubtWithGemini({
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

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Socratic AI Backend Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`🎯 Diagnose API: POST http://localhost:${PORT}/api/v1/doubts/diagnose`);
  console.log(`🔑 Gemini Key Status: ${process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('your_gemini') ? 'Configured ✅' : 'Not Configured (Demo Mode Active) ⚠️'}`);
  console.log(`====================================================`);
});
