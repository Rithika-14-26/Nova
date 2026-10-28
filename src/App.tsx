import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { DashboardView } from './components/DashboardView';
import { StudyAiView } from './components/StudyAiView';
import { CampusHelpView } from './components/CampusHelpView';
import { CareerBoostView } from './components/CareerBoostView';
import { WellbeingView } from './components/WellbeingView';
import { ProgressView } from './components/ProgressView';
import { LearningLoopModal } from './components/LearningLoopModal';
import { SettingsModal } from './components/SettingsModal';

import {
  UserProfile,
  StudyTask,
  StudyNote,
  CampusEvent,
  CampusAnnouncement,
  ResumeData,
  SmartReminder,
  QuizAttemptRecord,
  WellbeingEntry,
  DailyFeedback,
} from './types';
import { StorageService } from './services/storage';
import { ApiService } from './services/api';
import { calculateStreak } from './utils/studyLogic';

export default function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const autostart = urlParams.get('autostart') === '1';

  // Auth / Onboarding State
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    if (autostart) return true;
    return StorageService.getHasOnboarded();
  });
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);

  // Core Data State
  const [user, setUser] = useState<UserProfile>(() => StorageService.getUser());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [tasks, setTasks] = useState<StudyTask[]>(() => StorageService.getTasks());
  const [notes, setNotes] = useState<StudyNote[]>(() => StorageService.getNotes());
  const [events, setEvents] = useState<CampusEvent[]>(() => StorageService.getCampusEvents());
  const [announcements, setAnnouncements] = useState<CampusAnnouncement[]>(() =>
    StorageService.getAnnouncements()
  );
  const [resume, setResume] = useState<ResumeData>(() => StorageService.getResume());
  const [reminders, setReminders] = useState<SmartReminder[]>(() => StorageService.getReminders());
  const [quizAttempts, setQuizAttempts] = useState<QuizAttemptRecord[]>(() =>
    StorageService.getQuizAttempts()
  );
  const [wellbeingHistory, setWellbeingHistory] = useState<WellbeingEntry[]>(() =>
    StorageService.getWellbeingHistory()
  );

  // Engine status
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);

  // Modals
  const [showLearningLoop, setShowLearningLoop] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Check backend health on mount
  useEffect(() => {
    ApiService.checkHealth().then((health) => {
      setGeminiConfigured(health.geminiConfigured);
    });

    // Update streak based on activity dates
    const activityDates = wellbeingHistory.map((w) => w.date);
    const currentStreak = calculateStreak(activityDates);
    if (currentStreak !== user.streakDays && currentStreak > 0) {
      const updatedUser = { ...user, streakDays: currentStreak };
      setUser(updatedUser);
      StorageService.setUser(updatedUser);
    }
  }, []);

  // Handlers
  const handleStartOnboarding = () => {
    setShowOnboardingModal(true);
  };

  const handleCompleteOnboarding = (newUser: UserProfile) => {
    setUser(newUser);
    StorageService.setUser(newUser);
    StorageService.setHasOnboarded(true);
    setHasOnboarded(true);
    setShowOnboardingModal(false);
    setActiveTab('dashboard');
  };

  const handleExploreDemo = () => {
    StorageService.resetAllToDemo();
    const demoUser = StorageService.getUser();
    setUser(demoUser);
    setTasks(StorageService.getTasks());
    setNotes(StorageService.getNotes());
    setEvents(StorageService.getCampusEvents());
    setAnnouncements(StorageService.getAnnouncements());
    setResume(StorageService.getResume());
    setReminders(StorageService.getReminders());
    setQuizAttempts(StorageService.getQuizAttempts());
    setWellbeingHistory(StorageService.getWellbeingHistory());
    StorageService.setHasOnboarded(true);
    setHasOnboarded(true);
    setActiveTab('dashboard');
  };

  const handleSignInSuccess = (partial: Partial<UserProfile>) => {
    const updated = { ...user, ...partial, isDemoUser: false };
    setUser(updated);
    StorageService.setUser(updated);
    StorageService.setHasOnboarded(true);
    setHasOnboarded(true);
    setActiveTab('dashboard');
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = StorageService.toggleTask(taskId);
    setTasks(updatedTasks);
  };

  const handleAddTask = (title: string, subject: string, durationMins: number) => {
    const created = StorageService.addTask({
      title,
      subject,
      dueTime: '03:00 PM',
      completed: false,
      priority: 'Medium',
      durationMins,
    });
    setTasks([...tasks, created]);
  };

  const handleSaveNote = (note: StudyNote) => {
    StorageService.saveNote(note);
    setNotes(StorageService.getNotes());
  };

  const handleDeleteNote = (id: string) => {
    StorageService.deleteNote(id);
    setNotes(StorageService.getNotes());
  };

  const handleRecordQuizAttempt = (attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>) => {
    const recorded = StorageService.recordQuizAttempt(attempt);
    setQuizAttempts(StorageService.getQuizAttempts());
  };

  const handleSaveResume = (data: ResumeData) => {
    StorageService.saveResume(data);
    setResume(data);
  };

  const handleSaveWellbeing = (entry: WellbeingEntry) => {
    StorageService.recordWellbeing(entry);
    setWellbeingHistory(StorageService.getWellbeingHistory());
  };

  const handleQuickMoodCheckin = (mood: number) => {
    const entry: WellbeingEntry = {
      date: new Date().toISOString(),
      moodRating: mood,
      energyLevel: mood,
      stressLevel: 2,
    };
    handleSaveWellbeing(entry);
  };

  const handleToggleReminder = (id: string) => {
    StorageService.toggleReminder(id);
    setReminders(StorageService.getReminders());
  };

  const handleMarkReminderRead = (id: string) => {
    StorageService.markReminderRead(id);
    setReminders(StorageService.getReminders());
  };

  const handleResetDemo = () => {
    StorageService.resetAllToDemo();
    setUser(StorageService.getUser());
    setTasks(StorageService.getTasks());
    setNotes(StorageService.getNotes());
    setEvents(StorageService.getCampusEvents());
    setAnnouncements(StorageService.getAnnouncements());
    setResume(StorageService.getResume());
    setReminders(StorageService.getReminders());
    setQuizAttempts(StorageService.getQuizAttempts());
    setWellbeingHistory(StorageService.getWellbeingHistory());
  };

  const handleLogout = () => {
    StorageService.setHasOnboarded(false);
    setHasOnboarded(false);
  };

  const handleApplyNewTasks = (newTasks: Omit<StudyTask, 'id'>[]) => {
    newTasks.forEach((t) => {
      StorageService.addTask(t);
    });
    setTasks(StorageService.getTasks());
  };

  const handleSaveFeedback = (feedback: DailyFeedback) => {
    StorageService.saveFeedback(feedback);
  };

  // If user hasn't onboarded, show welcome / login screen
  if (!hasOnboarded) {
    return (
      <>
        <WelcomeScreen
          onStartOnboarding={handleStartOnboarding}
          onExploreDemo={handleExploreDemo}
          onSignInSuccess={handleSignInSuccess}
        />
        {showOnboardingModal && (
          <OnboardingModal
            onComplete={handleCompleteOnboarding}
            onCancel={() => setShowOnboardingModal(false)}
          />
        )}
      </>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayWellbeing = wellbeingHistory.find((w) => w.date.slice(0, 10) === todayStr);

  return (
    <div className="min-h-screen bg-[#FAF9FF] text-slate-800 flex flex-col font-sans selection:bg-purple-200">
      {/* Top Navigation */}
      <Navbar
        user={user}
        geminiConfigured={geminiConfigured}
        reminders={reminders}
        onToggleReminderRead={handleMarkReminderRead}
        onOpenSettings={() => setShowSettings(true)}
        onOpenLearningLoop={() => setShowLearningLoop(true)}
        onResetDemo={handleResetDemo}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'settings') {
              setShowSettings(true);
            } else {
              setActiveTab(tab);
            }
          }}
          streakDays={user.streakDays}
        />

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              user={user}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              reminders={reminders}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onQuickMoodCheckin={handleQuickMoodCheckin}
              todayWellbeing={todayWellbeing}
              onOpenLearningLoop={() => setShowLearningLoop(true)}
            />
          )}

          {activeTab === 'study' && (
            <StudyAiView
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              quizAttempts={quizAttempts}
              onRecordQuizAttempt={handleRecordQuizAttempt}
              subjects={user.subjects}
            />
          )}

          {activeTab === 'campus' && (
            <CampusHelpView events={events} announcements={announcements} />
          )}

          {activeTab === 'career' && (
            <CareerBoostView initialResume={resume} onSaveResume={handleSaveResume} />
          )}

          {activeTab === 'wellbeing' && (
            <WellbeingView
              history={wellbeingHistory}
              onSaveCheckin={handleSaveWellbeing}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressView
              user={user}
              tasks={tasks}
              quizAttempts={quizAttempts}
              wellbeingHistory={wellbeingHistory}
              notes={notes}
            />
          )}
        </main>
      </div>

      {/* Mobile Navigation bottom bar */}
      <MobileNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

      {/* Learning Loop Modal */}
      {showLearningLoop && (
        <LearningLoopModal
          completedCount={tasks.filter((t) => t.completed).length}
          averageQuizScore={
            quizAttempts.length > 0
              ? Math.round(
                  quizAttempts.reduce((acc, q) => acc + q.scorePercentage, 0) /
                    quizAttempts.length
                )
              : 85
          }
          wellnessIndex={todayWellbeing?.moodRating ? todayWellbeing.moodRating * 20 : 75}
          onApplyNewTasks={handleApplyNewTasks}
          onSaveFeedback={handleSaveFeedback}
          onClose={() => setShowLearningLoop(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          user={user}
          onUpdateUser={(updated) => {
            setUser(updated);
            StorageService.setUser(updated);
          }}
          reminders={reminders}
          onToggleReminder={handleToggleReminder}
          onResetDemo={handleResetDemo}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
