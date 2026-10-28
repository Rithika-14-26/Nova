import { QuizQuestionItem } from '../types';

export interface SummarizeResponse {
  summary: string;
  keyConcepts: { term: string; definition: string }[];
  flashcards: { front: string; back: string }[];
  studyTip: string;
  estimatedReadTime: string;
  isRealAi: boolean;
  demoNotice?: string;
  model?: string;
}

export interface AskNotesResponse {
  answer: string;
  isRealAi: boolean;
  demoNotice?: string;
}

export interface GenerateQuizResponse {
  quizTitle: string;
  difficulty: string;
  questions: QuizQuestionItem[];
  isRealAi: boolean;
  demoNotice?: string;
}

export interface CampusQaResponse {
  answer: string;
  isRealAi: boolean;
  isOfficialAnnouncement: boolean;
  demoNotice?: string;
}

export interface ResumeReviewResponse {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  recommendedSkillsToAdd: string[];
  summaryCritique: string;
  isRealAi: boolean;
  demoNotice?: string;
}

export interface InterviewFeedbackResponse {
  score: number;
  clarityRating: string;
  strengths: string[];
  areasForGrowth: string[];
  suggestedImprovement: string;
  isRealAi: boolean;
  demoNotice?: string;
}

export interface AdaptivePlanResponse {
  focusSummary: string;
  pacingRecommendation: string;
  timeBlocks: {
    time: string;
    title: string;
    type: 'study' | 'break' | 'career';
    notes: string;
  }[];
  wellnessAdvice: string;
  isRealAi: boolean;
  demoNotice?: string;
}

export const ApiService = {
  async checkHealth(): Promise<{ status: string; geminiConfigured: boolean }> {
    try {
      const res = await fetch('/api/health');
      if (!res.ok) throw new Error('Health check error');
      return await res.json();
    } catch {
      return { status: 'fallback', geminiConfigured: false };
    }
  },

  async summarizeNotes(noteTitle: string, noteContent: string): Promise<SummarizeResponse> {
    const res = await fetch('/api/ai/summarize-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noteTitle, noteContent }),
    });
    if (!res.ok) {
      throw new Error(`Failed to summarize notes: HTTP ${res.status}`);
    }
    return await res.json();
  },

  async askNotes(question: string, noteContent: string, noteTitle?: string): Promise<AskNotesResponse> {
    const res = await fetch('/api/ai/ask-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, noteContent, noteTitle }),
    });
    if (!res.ok) {
      throw new Error(`Failed to get answer: HTTP ${res.status}`);
    }
    return await res.json();
  },

  async generateQuiz(subject: string, topic: string, noteContent?: string, difficulty?: string): Promise<GenerateQuizResponse> {
    const res = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, topic, noteContent, difficulty }),
    });
    if (!res.ok) {
      throw new Error(`Failed to generate quiz: HTTP ${res.status}`);
    }
    return await res.json();
  },

  async askCampusQuestion(query: string): Promise<CampusQaResponse> {
    const res = await fetch('/api/ai/campus-qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch campus answer: HTTP ${res.status}`);
    }
    return await res.json();
  },

  async reviewResume(resumeData: any, targetRole: string): Promise<ResumeReviewResponse> {
    const res = await fetch('/api/ai/resume-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData, targetRole }),
    });
    if (!res.ok) {
      throw new Error(`Failed to review resume: HTTP ${res.status}`);
    }
    return await res.json();
  },

  async evaluateInterviewAnswer(role: string, question: string, answer: string): Promise<InterviewFeedbackResponse> {
    const res = await fetch('/api/ai/interview-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, question, answer }),
    });
    if (!res.ok) {
      throw new Error(`Failed to evaluate interview answer: HTTP ${res.status}`);
    }
    return await res.json();
  },

  async generateAdaptivePlan(params: {
    completedCount: number;
    averageQuizScore: number;
    wellnessIndex: number;
    feedbackRating: number;
    userNotes?: string;
  }): Promise<AdaptivePlanResponse> {
    const res = await fetch('/api/ai/adaptive-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      throw new Error(`Failed to generate adaptive plan: HTTP ${res.status}`);
    }
    return await res.json();
  },
};
