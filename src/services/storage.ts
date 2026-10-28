import {
  UserProfile,
  StudyNote,
  CampusEvent,
  CampusAnnouncement,
  ResumeData,
  StudyTask,
  SmartReminder,
  WellbeingEntry,
  QuizAttemptRecord,
  DailyFeedback,
} from '../types';
import {
  INITIAL_DEMO_USER,
  INITIAL_STUDY_NOTES,
  INITIAL_CAMPUS_EVENTS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_RESUME_DATA,
  INITIAL_TASKS,
  INITIAL_REMINDERS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_WELLBEING_CHECKINS,
} from './mockData';

const STORAGE_KEYS = {
  USER: 'nova_user_profile',
  NOTES: 'nova_study_notes',
  EVENTS: 'nova_campus_events',
  ANNOUNCEMENTS: 'nova_announcements',
  RESUME: 'nova_resume_data',
  TASKS: 'nova_tasks',
  REMINDERS: 'nova_reminders',
  QUIZ_ATTEMPTS: 'nova_quiz_attempts',
  WELLBEING: 'nova_wellbeing',
  FEEDBACK: 'nova_feedback_history',
  HAS_ONBOARDED: 'nova_has_onboarded',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing ${key} to localStorage:`, err);
  }
}

export const StorageService = {
  getHasOnboarded(): boolean {
    return localStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED) === 'true';
  },

  setHasOnboarded(value: boolean): void {
    localStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, value ? 'true' : 'false');
  },

  getUser(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.USER, INITIAL_DEMO_USER);
  },

  setUser(user: UserProfile): void {
    safeSet(STORAGE_KEYS.USER, user);
  },

  getNotes(): StudyNote[] {
    return safeGet<StudyNote[]>(STORAGE_KEYS.NOTES, INITIAL_STUDY_NOTES);
  },

  saveNote(note: StudyNote): void {
    const notes = this.getNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = note;
    } else {
      notes.unshift(note);
    }
    safeSet(STORAGE_KEYS.NOTES, notes);
  },

  deleteNote(id: string): void {
    const notes = this.getNotes().filter((n) => n.id !== id);
    safeSet(STORAGE_KEYS.NOTES, notes);
  },

  getCampusEvents(): CampusEvent[] {
    return safeGet<CampusEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_CAMPUS_EVENTS);
  },

  getAnnouncements(): CampusAnnouncement[] {
    return safeGet<CampusAnnouncement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  getResume(): ResumeData {
    return safeGet<ResumeData>(STORAGE_KEYS.RESUME, INITIAL_RESUME_DATA);
  },

  saveResume(data: ResumeData): void {
    safeSet(STORAGE_KEYS.RESUME, data);
  },

  getTasks(): StudyTask[] {
    return safeGet<StudyTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },

  saveTasks(tasks: StudyTask[]): void {
    safeSet(STORAGE_KEYS.TASKS, tasks);
  },

  toggleTask(taskId: string): StudyTask[] {
    const tasks = this.getTasks().map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    this.saveTasks(tasks);
    return tasks;
  },

  addTask(task: Omit<StudyTask, 'id'>): StudyTask {
    const tasks = this.getTasks();
    const newTask: StudyTask = {
      ...task,
      id: `task_${Date.now()}`,
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  },

  getReminders(): SmartReminder[] {
    return safeGet<SmartReminder[]>(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
  },

  saveReminders(reminders: SmartReminder[]): void {
    safeSet(STORAGE_KEYS.REMINDERS, reminders);
  },

  toggleReminder(id: string): void {
    const reminders = this.getReminders().map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    this.saveReminders(reminders);
  },

  markReminderRead(id: string): void {
    const reminders = this.getReminders().map((r) => (r.id === id ? { ...r, read: true } : r));
    this.saveReminders(reminders);
  },

  getQuizAttempts(): QuizAttemptRecord[] {
    return safeGet<QuizAttemptRecord[]>(STORAGE_KEYS.QUIZ_ATTEMPTS, INITIAL_QUIZ_ATTEMPTS);
  },

  recordQuizAttempt(attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>): QuizAttemptRecord {
    const attempts = this.getQuizAttempts();
    const newRecord: QuizAttemptRecord = {
      ...attempt,
      id: `atm_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    attempts.unshift(newRecord);
    safeSet(STORAGE_KEYS.QUIZ_ATTEMPTS, attempts);
    return newRecord;
  },

  getWellbeingHistory(): WellbeingEntry[] {
    return safeGet<WellbeingEntry[]>(STORAGE_KEYS.WELLBEING, INITIAL_WELLBEING_CHECKINS);
  },

  recordWellbeing(entry: WellbeingEntry): void {
    const history = this.getWellbeingHistory();
    const todayStr = entry.date.slice(0, 10);
    const existingIdx = history.findIndex((h) => h.date.slice(0, 10) === todayStr);
    if (existingIdx >= 0) {
      history[existingIdx] = entry;
    } else {
      history.push(entry);
    }
    safeSet(STORAGE_KEYS.WELLBEING, history);
  },

  getFeedbackHistory(): DailyFeedback[] {
    return safeGet<DailyFeedback[]>(STORAGE_KEYS.FEEDBACK, []);
  },

  saveFeedback(feedback: DailyFeedback): void {
    const history = this.getFeedbackHistory();
    history.unshift(feedback);
    safeSet(STORAGE_KEYS.FEEDBACK, history);
  },

  resetAllToDemo(): void {
    localStorage.clear();
    this.setHasOnboarded(true);
    this.setUser(INITIAL_DEMO_USER);
    this.saveTasks(INITIAL_TASKS);
    this.saveReminders(INITIAL_REMINDERS);
    this.saveResume(INITIAL_RESUME_DATA);
    safeSet(STORAGE_KEYS.NOTES, INITIAL_STUDY_NOTES);
    safeSet(STORAGE_KEYS.EVENTS, INITIAL_CAMPUS_EVENTS);
    safeSet(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    safeSet(STORAGE_KEYS.QUIZ_ATTEMPTS, INITIAL_QUIZ_ATTEMPTS);
    safeSet(STORAGE_KEYS.WELLBEING, INITIAL_WELLBEING_CHECKINS);
  },
};
