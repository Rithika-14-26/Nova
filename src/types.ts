export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  graduationYear: string;
  academicGoals: string[];
  subjects: string[];
  preferredLanguage: string;
  studyTimePreference: 'morning' | 'afternoon' | 'evening' | 'night';
  sessionLengthMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  isDemoUser: boolean;
}

export interface NoteSummary {
  summary: string;
  keyConcepts: { term: string; definition: string }[];
  flashcards: { front: string; back: string }[];
  studyTip: string;
  estimatedReadTime: string;
  isRealAi: boolean;
  demoNotice?: string;
}

export interface StudyNote {
  id: string;
  title: string;
  subject: string;
  content: string;
  uploadedAt: string;
  wordCount: number;
  summary?: NoteSummary;
}

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAttemptRecord {
  id: string;
  quizTitle: string;
  subject: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  timestamp: string;
  passed: boolean;
  difficulty: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Academic' | 'Career' | 'Wellness' | 'Social' | 'Athletics';
  date: string;
  time: string;
  location: string;
  description: string;
  attendeesCount: number;
  isSampleData: boolean;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  date: string;
  priority: 'High' | 'Normal' | 'Info';
  department: string;
  content: string;
  isOfficialAnnouncement: boolean; // clearly flagged
}

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  targetRole: string;
  summary: string;
  education: {
    institution: string;
    degree: string;
    gpa: string;
    expectedGrad: string;
    coursework: string;
  };
  experiences: {
    id: string;
    role: string;
    company: string;
    period: string;
    bulletPoints: string[];
  }[];
  projects: {
    id: string;
    name: string;
    technologies: string;
    description: string;
    bullets: string[];
  }[];
  skills: {
    category: string;
    items: string;
  }[];
}

export interface MockInterviewRecord {
  id: string;
  role: string;
  question: string;
  userAnswer: string;
  score: number;
  clarityRating: string;
  strengths: string[];
  areasForGrowth: string[];
  suggestedImprovement: string;
  timestamp: string;
  isRealAi: boolean;
}

export interface WellbeingEntry {
  date: string;
  moodRating: number; // 1 to 5
  energyLevel: number; // 1 to 5
  stressLevel: number; // 1 to 5
  notes?: string;
  completedBreakType?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  dueTime: string;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
  durationMins: number;
}

export interface SmartReminder {
  id: string;
  title: string;
  message: string;
  type: 'study' | 'campus' | 'career' | 'wellbeing';
  timestamp: string;
  read: boolean;
  enabled: boolean;
}

export interface DailyFeedback {
  date: string;
  pacingRating: number; // 1-5
  comments: string;
  adaptivePlanGenerated?: any;
}
