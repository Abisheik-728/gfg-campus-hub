import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json());

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

// Helper for Groq Chat
async function getGroqChatResponse(messages, systemPrompt = "") {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      model: "llama-3.3-70b-versatile",
    });
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw error;
  }
}

// ─── 1. AI Coding Mentor ─────────────────────────────
app.post('/api/ai-mentor', async (req, res) => {
  const { messages } = req.body;
  try {
    const systemPrompt = "Act as a coding mentor that explains concepts clearly and provides example code when needed. Supported topics: Python, Java, C++, JavaScript, Data Structures, Algorithms, Web Development. Provide a detailed explanation, example code if applicable, and a beginner-friendly summary.";
    
    // Format messages for Groq (ensure proper roles)
    const formattedMessages = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }));

    const response = await getGroqChatResponse(formattedMessages, systemPrompt);
    res.json({ response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI Mentor failed to respond' });
  }
});

// Alias for old frontend compatibility if needed
app.post('/api/mentor', (req, res) => res.redirect(307, '/api/ai-mentor'));

// ─── 2. AI Code Debugger ─────────────────────────────
app.post('/api/debug-code', async (req, res) => {
  const { code, language } = req.body;
  try {
    const prompt = `You are an expert AI Code Debugger. Analyze the provided ${language} code. 
    Detect errors, explain the problem, provide corrected code, and give optimization suggestions.
    Format your response strictly as a JSON object with these keys: errorExplanation, fixedCode, improvementSuggestions.
    Return ONLY valid JSON.
    Code:
    ${code}`;

    const response = await getGroqChatResponse([{ role: "user", content: prompt }]);
    
    // Clean JSON from markdown if present
    const jsonStr = response.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Debugging failed' });
  }
});

app.post('/api/debug', (req, res) => res.redirect(307, '/api/debug-code'));

// ─── 3. AI Code Explainer ────────────────────────────
app.post('/api/explain-code', async (req, res) => {
  const { code } = req.body;
  try {
    const prompt = `You are an AI Code Explainer. Provide: 1. Overview of the code, 2. Line-by-line explanation, 3. Beginner-friendly explanation. Use Markdown.
    Code:
    ${code}`;

    const response = await getGroqChatResponse([{ role: "user", content: prompt }]);
    res.json({ explanation: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Explanation failed' });
  }
});

app.post('/api/explain', (req, res) => res.redirect(307, '/api/explain-code'));

// ─── 4. Learning Roadmap Generator ───────────────────
app.post('/api/generate-roadmap', async (req, res) => {
  const { goal, skillLevel } = req.body;
  try {
    const prompt = `You are a Learning Roadmap Generator. Generate a structured roadmap for a student. 
    Goal: ${goal}, Skill Level: ${skillLevel}. 
    Include: Learning Stages, Topics to study, Suggested projects, Recommended tools. 
    Format your response strictly as a JSON object with these keys as sections: LearningStages, TopicsToStudy, SuggestedProjects, RecommendedTools.
    Return ONLY the JSON.`;

    const response = await getGroqChatResponse([{ role: "user", content: prompt }]);
    const jsonStr = response.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Roadmap generation failed' });
  }
});

app.post('/api/roadmap', (req, res) => res.redirect(307, '/api/generate-roadmap'));

// ─── 5. Resume Analyzer ──────────────────────────────
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  let text = '';
  try {
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdf(req.file.buffer);
      text = data.text;
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      text = result.value;
    } else if (req.file.mimetype === 'text/plain') {
      text = req.file.buffer.toString();
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

    const response = await getGroqChatResponse([{ role: "user", content: prompt }]);
    const jsonStr = response.replace(/```json|```/g, '').trim();
    res.json(JSON.parse(jsonStr));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Resume analysis failed' });
  }
});

app.post('/api/resume-analyze', (req, res) => res.redirect(307, '/api/analyze-resume'));

app.listen(port, () => {
  console.log(`AI Server running on http://localhost:${port} using Groq API`);
});
