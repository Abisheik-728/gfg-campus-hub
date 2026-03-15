import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const upload = multer({ storage: multer.memoryStorage() });

// ─── 1. AI Coding Mentor ─────────────────────────────
app.post('/api/mentor', async (req, res) => {
  const { messages } = req.body;
  try {
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const prompt = "Act as a coding mentor that explains concepts clearly and provides example code when needed. Supported topics: Python, Java, C++, JavaScript, Data Structures, Algorithms, Web Development. User question: " + messages[messages.length - 1].content;
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    res.json({ response: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI Mentor failed to respond' });
  }
});

// ─── 2. AI Code Debugger ─────────────────────────────
app.post('/api/debug', async (req, res) => {
  const { code, language } = req.body;
  try {
    const prompt = `You are an expert AI Code Debugger. Analyze the provided ${language} code. 
    Detect errors, explain the problem, provide corrected code, and give optimization suggestions.
    Format your response strictly as a JSON object with these keys: errorExplanation, fixedCode, improvementSuggestions.
    Code:
    ${code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Gemini sometimes wraps JSON in markdown blocks
    const jsonStr = text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Debugging failed' });
  }
});

// ─── 3. AI Code Explainer ────────────────────────────
app.post('/api/explain', async (req, res) => {
  const { code } = req.body;
  try {
    const prompt = `You are an AI Code Explainer. Provide: 1. Overview of the code, 2. Line-by-line explanation, 3. Beginner-friendly explanation. Use Markdown.
    Code:
    ${code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ explanation: response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Explanation failed' });
  }
});

// ─── 4. Learning Roadmap Generator ───────────────────
app.post('/api/roadmap', async (req, res) => {
  const { goal, skillLevel } = req.body;
  try {
    const prompt = `You are a Learning Roadmap Generator. Generate a structured roadmap for a student. 
    Goal: ${goal}, Skill Level: ${skillLevel}. 
    Include: Learning Stages, Topics to study, Suggested projects, Recommended tools. 
    Format your response strictly as a JSON object with these keys as sections.
    Return ONLY the JSON.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Roadmap generation failed' });
  }
});

// ─── 5. Resume Analyzer ──────────────────────────────
app.post('/api/resume-analyze', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  let text = '';
  try {
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const prompt = `Analyze this resume text and return:
    1. Resume Score (0-100)
    2. Strengths and Detected Skills
    3. Weaknesses/Missing technologies
    4. Suggestions for tech jobs.
    Format your response strictly as a JSON object with keys: score, strengths, skills, weaknesses, suggestions.
    Return ONLY the JSON.
    Resume Text:
    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resultText = response.text();
    const jsonStr = resultText.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resume analysis failed' });
  }
});

app.listen(port, () => {
  console.log(`AI Server running on http://localhost:${port} using Gemini API`);
});
