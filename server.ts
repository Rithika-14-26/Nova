import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'NOVA',
    geminiConfigured: !!process.env.GEMINI_API_KEY && !!ai,
    timestamp: new Date().toISOString(),
  });
});

// 1. Study AI: Summarize Notes
app.post('/api/ai/summarize-notes', async (req: Request, res: Response) => {
  const { noteTitle, noteContent } = req.body;
  if (!noteContent || typeof noteContent !== 'string') {
    return res.status(400).json({ error: 'Note content is required.' });
  }

  if (ai) {
    try {
      const prompt = `You are NOVA's Academic AI Assistant. Analyze the following study notes titled "${noteTitle || 'Untitled Note'}":
"""
${noteContent.slice(0, 8000)}
"""

Provide a clean, structured study summary formatted in JSON with the following keys:
- "summary": A concise, clear 2-3 paragraph overview of the core concepts.
- "keyConcepts": An array of 4-6 objects with "term" and "definition".
- "flashcards": An array of 3-4 objects with "front" and "back".
- "studyTip": One practical mnemonic or high-yield revision technique for this topic.
- "estimatedReadTime": string like "5 mins"

Do not wrap in markdown quotes if possible, or return strictly valid JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      return res.json({
        ...parsed,
        isRealAi: true,
        model: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.warn('Gemini live summarization failed, falling back to educational parser:', err.message);
    }
  }

  // Fallback demo response with clear indicator
  const paragraphs = noteContent.split('\n\n').filter((p: string) => p.trim().length > 0);
  const sampleTerms = [
    { term: 'Core Mechanism', definition: 'The primary underlying principle governing the phenomenon discussed in the notes.' },
    { term: 'Key Formula / Rule', definition: 'Essential quantitative or qualitative relationship emphasized in study material.' },
    { term: 'Synthesis Factor', definition: 'The integrating variable that links foundational premises to practical applications.' },
  ];

  return res.json({
    summary: `These study notes (${noteTitle || 'Uploaded Notes'}) cover essential foundational principles. ${paragraphs[0] || 'Detailed examination of the fundamental concepts provided in your document.'} Key focus includes understanding cause-and-effect dynamics, standard terminology, and analytical application for upcoming coursework and exams.`,
    keyConcepts: sampleTerms,
    flashcards: [
      { front: `What is the central focus of "${noteTitle || 'these notes'}"?`, back: 'The core conceptual dynamics and mechanisms explained in the document.' },
      { front: 'Why is this topic tested frequently?', back: 'It establishes prerequisites for high-level coursework and problem sets.' },
      { front: 'How can you best retain this material?', back: 'Active recall spaced over 2-3 days using practice quiz questions.' },
    ],
    studyTip: 'Try the Feynman Technique: explain this note’s key concept out loud in 60 seconds without using jargon.',
    estimatedReadTime: '4 mins',
    isRealAi: false,
    demoNotice: 'Demo mode active (live Gemini inference is enabled when GEMINI_API_KEY is configured).',
  });
});

// 2. Study AI: Ask Questions anchored to Notes
app.post('/api/ai/ask-notes', async (req: Request, res: Response) => {
  const { question, noteContent, noteTitle } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  if (ai && noteContent) {
    try {
      const prompt = `You are NOVA's intelligent Study Assistant.
Context Notes (${noteTitle || 'Study Material'}):
"""
${(noteContent || '').slice(0, 8000)}
"""

Student's Question: "${question}"

Provide a direct, helpful, and academically sound answer. If the notes provide the direct answer, cite the notes. If the answer extends beyond the notes, clearly state that. Keep your tone encouraging and concise.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.4,
        },
      });

      return res.json({
        answer: response.text?.trim() || 'Could not generate answer.',
        isRealAi: true,
      });
    } catch (err: any) {
      console.warn('Gemini ask-notes failed:', err.message);
    }
  }

  // Fallback demo response
  return res.json({
    answer: `Regarding your question ("${question}"): In the context of ${noteTitle || 'your study notes'}, this principle highlights the relationship between input factors and resulting outcomes. Focus on how this component influences the broader system and test yourself on its primary dependencies.`,
    isRealAi: false,
    demoNotice: 'Demo mode active: Configure GEMINI_API_KEY for live model answers.',
  });
});

// 3. Study AI: Generate Practice Quiz
app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
  const { subject, topic, noteContent, difficulty = 'Medium' } = req.body;
  const targetTopic = topic || subject || 'General College Science';

  if (ai) {
    try {
      const prompt = `Create a 4-question multiple choice practice quiz for a college student studying "${targetTopic}" (Difficulty: ${difficulty}).
${noteContent ? `Base questions on these study notes:\n"""\n${noteContent.slice(0, 5000)}\n"""` : ''}

Return strictly valid JSON with this exact schema:
{
  "quizTitle": "${targetTopic} Practice Quiz",
  "difficulty": "${difficulty}",
  "questions": [
    {
      "id": "q1",
      "question": "Clear question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Clear explanation of why this answer is correct."
    }
  ]
}
Make sure correctIndex is an integer from 0 to 3. Provide exactly 4 options per question.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.5,
        },
      });

      const parsed = JSON.parse(response.text?.trim() || '{}');
      return res.json({
        ...parsed,
        isRealAi: true,
      });
    } catch (err: any) {
      console.warn('Gemini quiz generation failed:', err.message);
    }
  }

  // Pre-crafted high quality academic questions as fallback
  const fallbackQuizzes: Record<string, any[]> = {
    biology: [
      {
        id: 'bio_1',
        question: 'What is the primary role of ATP in cellular processes?',
        options: ['DNA replication primer', 'Universal chemical energy currency', 'Structural membrane lipid', 'Enzyme breakdown catalyst'],
        correctIndex: 1,
        explanation: 'Adenosine triphosphate (ATP) captures chemical energy obtained from the breakdown of food molecules and releases it to fuel cellular work.',
      },
      {
        id: 'bio_2',
        question: 'During which phase of meiosis does crossing over occur?',
        options: ['Metaphase I', 'Prophase I', 'Anaphase II', 'Telophase I'],
        correctIndex: 1,
        explanation: 'Synapsis and crossing over of non-sister chromatids take place during Prophase I of meiosis.',
      },
      {
        id: 'bio_3',
        question: 'Which enzyme synthesizes RNA during transcription?',
        options: ['DNA Polymerase III', 'RNA Polymerase', 'Helicase', 'Ligase'],
        correctIndex: 1,
        explanation: 'RNA polymerase binds to DNA promoters and synthesizes an RNA transcript from the DNA template.',
      },
      {
        id: 'bio_4',
        question: 'What is the function of the myelin sheath in nerve cells?',
        options: ['Generate action potentials', 'Accelerate electrical impulse transmission', 'Store neurotransmitters', 'Provide nutrient synthesis'],
        correctIndex: 1,
        explanation: 'The myelin sheath acts as an insulating layer that facilitates saltatory conduction, significantly speeding up impulse transmission.',
      },
    ],
  };

  const selectedList = fallbackQuizzes.biology;

  return res.json({
    quizTitle: `${targetTopic} Knowledge Check`,
    difficulty,
    questions: selectedList,
    isRealAi: false,
    demoNotice: 'Demo mode active: Pre-verified academic questions loaded.',
  });
});

// 4. Campus Help: Query Q&A
app.post('/api/ai/campus-qa', async (req: Request, res: Response) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required.' });

  // Known sample campus directory data
  const campusDirectory = `
Campus Directory & Standard Services:
- University Library: Open Mon-Thu 7:30 AM - Midnight, Fri 7:30 AM - 8:00 PM, Sat-Sun 10:00 AM - 10:00 PM. Quiet study floor is Level 4. Study rooms can be reserved via the Student Portal up to 7 days in advance.
- Student Health & Wellness Center: Health Science Building, Suite 210. Open Mon-Fri 8:30 AM - 4:30 PM. Walk-ins welcome for urgent care; counseling sessions require appointment. 24/7 Nurse Advice Line: (555) 019-8234.
- Campus Transit & Shuttle: North/South Express runs every 12 minutes between Student Union and East Parking Quad from 7:00 AM to 11:30 PM. Night Escort Service available after 9 PM.
- Financial Aid & Registrar: Student Services Hall 101. Virtual drop-in advising Tue & Thu 1-4 PM.
- Career Center: Founders Hall 3rd Floor. Drop-in resume reviews Wed 2-5 PM. On-campus student employment job board opens on the 1st of every month.
- Dining Commons & Cafes: Main Commons 7 AM - 9 PM. Blue Spruce Cafe (Library Lobby) open until 11 PM during midterms and finals.
- Academic Tutoring Center: Science & Tech Wing 104. Free peer tutoring for Math, Physics, Chemistry, and Writing.
`;

  if (ai) {
    try {
      const prompt = `You are NOVA's Campus Guide Assistant. Answer the student's campus query based on this official Campus Directory context:
${campusDirectory}

Query: "${query}"

Guidelines:
- Give a friendly, direct answer with exact hours, location, or protocol if available.
- Mention that this reflects standard university campus procedures.
- Clearly note that specific course syllabi or individual department notices should be verified with the department coordinator.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { temperature: 0.3 },
      });

      return res.json({
        answer: response.text?.trim() || 'Campus information unavailable.',
        isRealAi: true,
        isOfficialAnnouncement: false,
      });
    } catch (err: any) {
      console.warn('Campus QA Gemini failed:', err.message);
    }
  }

  // Fallback pattern matching
  let answer = 'The University Student Services center is open Monday through Friday, 8:30 AM to 5:00 PM. For library study rooms, reserve on the 4th floor quiet zone via the student portal.';
  const qLower = query.toLowerCase();
  if (qLower.includes('library') || qLower.includes('book') || qLower.includes('study room')) {
    answer = 'The Main University Library is open Mon-Thu 7:30 AM – Midnight (Fri until 8 PM, Sat-Sun 10 AM – 10 PM). Quiet study pods are on Level 4. Group study rooms can be reserved online via the Student Portal up to 7 days in advance.';
  } else if (qLower.includes('health') || qLower.includes('doctor') || qLower.includes('counseling') || qLower.includes('sick')) {
    answer = 'Student Health & Wellness is located in Health Science Bldg, Suite 210. Walk-ins are accepted Mon-Fri 8:30 AM – 4:30 PM. 24/7 campus nurse advice hotline is (555) 019-8234.';
  } else if (qLower.includes('bus') || qLower.includes('shuttle') || qLower.includes('transport') || qLower.includes('parking')) {
    answer = 'The North/South Express campus shuttle runs every 12 minutes from the Student Union to East Parking between 7:00 AM and 11:30 PM. Track live arrivals on the Campus Transit screen.';
  } else if (qLower.includes('food') || qLower.includes('dining') || qLower.includes('coffee') || qLower.includes('eat')) {
    answer = 'Main Dining Commons serves breakfast, lunch, and dinner from 7:00 AM to 9:00 PM. Blue Spruce Cafe inside the Library Lobby remains open until 11:00 PM on weekdays.';
  }

  return res.json({
    answer,
    isRealAi: false,
    isOfficialAnnouncement: false,
    demoNotice: 'Demo mode: Standard sample campus directory guidelines applied.',
  });
});

// 5. Career Boost: Resume & Skill Review
app.post('/api/ai/resume-review', async (req: Request, res: Response) => {
  const { resumeData, targetRole } = req.body;

  if (ai) {
    try {
      const prompt = `You are NOVA's Career Coach. Review this student resume targeted for "${targetRole || 'Internship / Entry-Level Role'}":
Resume Content:
${JSON.stringify(resumeData, null, 2)}

Provide actionable, constructive feedback in JSON:
{
  "overallScore": 84,
  "strengths": ["Clear technical skills", "Quantified achievements in projects"],
  "improvements": ["Use active action verbs (e.g., 'Architected', 'Spearheaded')", "Tailor bullet points to target role keywords"],
  "recommendedSkillsToAdd": ["Git version control", "Agile workflow", "Data Analysis"],
  "summaryCritique": "One concise paragraph advising how to strengthen the professional narrative."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.4 },
      });

      return res.json({
        ...JSON.parse(response.text?.trim() || '{}'),
        isRealAi: true,
      });
    } catch (err: any) {
      console.warn('Resume review Gemini failed:', err.message);
    }
  }

  return res.json({
    overallScore: 82,
    strengths: [
      'Education and academic coursework are clearly highlighted.',
      'Project descriptions demonstrate technical and organizational initiative.',
      'Clean layout and easy readability.',
    ],
    improvements: [
      'Incorporate quantitative metrics (e.g. "improved speed by 25%", "coordinated team of 4").',
      'Start each bullet point with high-impact power verbs (Engineered, Implemented, Spearheaded).',
      `Align core project keywords with the "${targetRole || 'Target Role'}" job description.`,
    ],
    recommendedSkillsToAdd: ['System Design', 'Git & CI/CD Basics', 'Cross-Functional Collaboration'],
    summaryCritique: 'Your resume shows a strong academic foundation. Emphasize problem-solving impact and measurable results in your recent project bullets to stand out to campus recruiters.',
    isRealAi: false,
    demoNotice: 'Demo mode: Standard career coaching rubric applied.',
  });
});

// 6. Career Boost: Mock Interview Feedback
app.post('/api/ai/interview-feedback', async (req: Request, res: Response) => {
  const { role, question, answer } = req.body;
  if (!answer || answer.trim().length === 0) {
    return res.status(400).json({ error: 'Interview response is required.' });
  }

  if (ai) {
    try {
      const prompt = `You are an expert interviewer evaluating a student candidate for a "${role || 'University Graduate / Intern'}" role.
Interview Question: "${question}"
Candidate Answer: "${answer}"

Evaluate the candidate's answer using the STAR method (Situation, Task, Action, Result).
Return JSON with this schema:
{
  "score": 85,
  "clarityRating": "Strong",
  "strengths": ["Good articulation of personal role", "Relevant examples"],
  "areasForGrowth": ["Add a quantifiable metric to the outcome", "Briefly conclude with what was learned"],
  "suggestedImprovement": "A refined, high-impact version of how this answer could be delivered."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.4 },
      });

      return res.json({
        ...JSON.parse(response.text?.trim() || '{}'),
        isRealAi: true,
      });
    } catch (err: any) {
      console.warn('Interview feedback Gemini failed:', err.message);
    }
  }

  // Fallback mock feedback
  const wordCount = answer.trim().split(/\s+/).length;
  const score = Math.min(94, Math.max(68, Math.round(70 + (wordCount > 40 ? 15 : 5))));

  return res.json({
    score,
    clarityRating: wordCount > 35 ? 'Good' : 'Needs Expansion',
    strengths: [
      'Directly addresses the prompt with honest perspective.',
      'Demonstrates self-awareness and willingness to learn.',
    ],
    areasForGrowth: [
      'Use the STAR method: Structure clearly into Situation, Task, Action, and Result.',
      'State specific tools, technologies, or communication strategies used.',
    ],
    suggestedImprovement: `When answering "${question}", structure like this: "In my recent course project [Situation], we needed to solve [Task]. I took the lead on [Action], which resulted in [Result and tangible lesson]."`,
    isRealAi: false,
    demoNotice: 'Demo mode: Structured STAR evaluation framework applied.',
  });
});

// 7. Learning Loop: Adaptive Next-Day Study Plan
app.post('/api/ai/adaptive-plan', async (req: Request, res: Response) => {
  const { completedCount, averageQuizScore, wellnessIndex, feedbackRating, userNotes } = req.body;

  if (ai) {
    try {
      const prompt = `You are NOVA's Adaptive Learning Planner.
Student's Day Metrics:
- Completed Study Tasks: ${completedCount || 3}
- Average Quiz Score: ${averageQuizScore || 78}%
- Wellbeing Index: ${wellnessIndex || 75}/100
- Today's User Rating of Pace: ${feedbackRating || 4}/5 stars
- Student Notes/Reflection: "${userNotes || 'Balanced day, want to keep steady pace'}"

Generate an optimized, realistic study schedule for tomorrow.
Return JSON:
{
  "focusSummary": "Inspiring theme for tomorrow",
  "pacingRecommendation": "Specific advice on session length and break frequency",
  "timeBlocks": [
    { "time": "09:00 AM - 10:15 AM", "title": "Core Subject Deep Focus", "type": "study", "notes": "Active recall & practice problems" },
    { "time": "10:15 AM - 10:30 AM", "title": "Mindful Refresh Break", "type": "break", "notes": "Hydrate and stretch" },
    { "time": "10:30 AM - 11:45 AM", "title": "Targeted Review & Flashcards", "type": "study", "notes": "Solidify weak quiz topics" },
    { "time": "02:00 PM - 02:45 PM", "title": "Career or Skill Sprint", "type": "career", "notes": "Resume refine or mock interview" }
  ],
  "wellnessAdvice": "Specific non-clinical advice to preserve cognitive stamina."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.4 },
      });

      return res.json({
        ...JSON.parse(response.text?.trim() || '{}'),
        isRealAi: true,
      });
    } catch (err: any) {
      console.warn('Adaptive plan Gemini failed:', err.message);
    }
  }

  // Fallback adaptive plan
  const isHighStamina = (wellnessIndex || 70) >= 70 && (averageQuizScore || 75) >= 75;

  return res.json({
    focusSummary: isHighStamina 
      ? 'Momentum Day: Deep Problem Sets & Career Advancement'
      : 'Restorative Mastery: Spaced Recall & High-Yield Concept Practice',
    pacingRecommendation: isHighStamina
      ? '45-minute focus intervals with 10-minute active recharge breaks.'
      : '30-minute low-strain review blocks with 15-minute screen-free walks.',
    timeBlocks: [
      { time: '09:00 AM - 09:45 AM', title: 'High-Yield Subject Review', type: 'study', notes: 'Review missed quiz questions from yesterday' },
      { time: '09:45 AM - 10:00 AM', title: 'Hydration & Movement Break', type: 'break', notes: 'Step outside or stretch' },
      { time: '10:00 AM - 10:45 AM', title: 'Practice Quiz & Self-Testing', type: 'study', notes: 'Complete 1-2 interactive quizzes' },
      { time: '02:30 PM - 03:15 PM', title: 'Career Boost: Resume Polish', type: 'career', notes: 'Add metrics to project descriptions' },
    ],
    wellnessAdvice: 'Plan a wind-down routine 45 minutes before sleep to support memory consolidation.',
    isRealAi: false,
    demoNotice: 'Demo mode: Rule-based adaptive scheduling engine active.',
  });
});

// Setup Vite in development or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOVA full-stack server running on http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server error:', err);
  process.exit(1);
});
