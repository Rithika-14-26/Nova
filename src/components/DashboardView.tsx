import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  MapPin,
  Briefcase,
  Heart,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Smile,
  Zap,
  ShieldAlert,
} from 'lucide-react';
import { UserProfile, StudyTask, SmartReminder, WellbeingEntry } from '../types';
import { NavTab } from './Sidebar';

interface DashboardViewProps {
  user: UserProfile;
  tasks: StudyTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, subject: string, durationMins: number) => void;
  reminders: SmartReminder[];
  onNavigateTab: (tab: NavTab) => void;
  onQuickMoodCheckin: (mood: number) => void;
  todayWellbeing?: WellbeingEntry;
  onOpenLearningLoop: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  tasks,
  onToggleTask,
  onAddTask,
  reminders,
  onNavigateTab,
  onQuickMoodCheckin,
  todayWellbeing,
  onOpenLearningLoop,
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState(user.subjects[0] || 'General');
  const [newTaskDuration, setNewTaskDuration] = useState(30);

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask(newTaskTitle.trim(), newTaskSubject, newTaskDuration);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-purple-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-purple-100 backdrop-blur-xs">
                {user.university}
              </span>
              <span className="text-purple-200 text-xs">• {user.major}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getGreeting()}, {user.name.split(' ')[0]} ✨
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/90 max-w-xl leading-relaxed">
              You are on day {user.streakDays} of consistent learning. Today’s rhythm focuses on{' '}
              <span className="font-semibold text-emerald-300">
                {user.studyTimePreference} focus blocks
              </span>{' '}
              with spaced breathwork.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateTab('study')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-purple-900 font-semibold text-xs shadow-sm hover:bg-purple-50 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Resume Study AI</span>
            </button>
            <button
              onClick={onOpenLearningLoop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/30 hover:bg-emerald-500/40 text-emerald-100 border border-emerald-400/30 font-semibold text-xs backdrop-blur-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Adaptive Plan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main Module Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module 1: Study AI */}
        <div
          onClick={() => onNavigateTab('study')}
          className="bg-white rounded-3xl p-5 border border-purple-100/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              Study AI
            </span>
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Notes & Quizzes</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Summarize coursework notes, ask direct questions, and practice auto-generated quizzes.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 group-hover:gap-2 transition-all">
            <span>Open Study Room</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Module 2: Campus Help */}
        <div
          onClick={() => onNavigateTab('campus')}
          className="bg-white rounded-3xl p-5 border border-blue-100/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Campus Help
            </span>
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Campus Guide & Events</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Query library quiet hours, dining menus, shuttle routes, and verified campus events.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:gap-2 transition-all">
            <span>Ask Campus AI</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Module 3: Career Boost */}
        <div
          onClick={() => onNavigateTab('career')}
          className="bg-white rounded-3xl p-5 border border-amber-100/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Career Boost
            </span>
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Resume & Mock Interview</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Build guided resumes, practice real interview questions, and receive STAR feedback.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
            <span>Launch Career Lab</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Module 4: Wellbeing */}
        <div
          onClick={() => onNavigateTab('wellbeing')}
          className="bg-white rounded-3xl p-5 border border-emerald-100/80 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-0.5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Wellbeing
            </span>
          </div>
          <h3 className="font-bold text-slate-800 text-sm">Mood & Mindful Breaks</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Private daily check-in, 5-minute box breathing timer, and non-clinical balance advice.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 group-hover:gap-2 transition-all">
            <span>Check In & Recharge</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Plan + Reminders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Study Plan (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-slate-800">Today’s Study Plan</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                  {completedCount}/{tasks.length} Completed
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeting 45-minute focus intervals with 5-minute cognitive breaks.
              </p>
            </div>

            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Pacing: Normal</span>
              <span>{progressPercent}% Complete</span>
            </div>
          </div>

          {/* Add Task Form Inline */}
          {showAddTask && (
            <form onSubmit={handleCreateTask} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  autoFocus
                />
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                >
                  {user.subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="General">General</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Duration:</span>
                  {[20, 30, 45, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setNewTaskDuration(m)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                        newTaskDuration === m
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-slate-600 border-slate-200'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Task List */}
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className="py-3 px-2 flex items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="text-purple-600 hover:scale-110 transition-transform shrink-0"
                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-100 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-purple-500" />
                    )}
                  </button>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>{task.subject}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.durationMins} mins
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    task.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 border border-rose-100'
                      : task.priority === 'Medium'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Reminders + Quick Mood Check-in */}
        <div className="space-y-6">
          {/* Quick Mood Widget */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smile className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-xs text-slate-800">Daily Wellbeing Check-in</h3>
              </div>
              {todayWellbeing ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Logged Today
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">Pending</span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              How energized do you feel today? Your answer helps calibrate study intervals.
            </p>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {[
                { rating: 1, emoji: '😴', label: 'Drained' },
                { rating: 2, emoji: '🙁', label: 'Tired' },
                { rating: 3, emoji: '😐', label: 'Neutral' },
                { rating: 4, emoji: '🙂', label: 'Good' },
                { rating: 5, emoji: '⚡', label: 'Peak' },
              ].map((item) => (
                <button
                  key={item.rating}
                  type="button"
                  onClick={() => onQuickMoodCheckin(item.rating)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-all ${
                    todayWellbeing?.moodRating === item.rating
                      ? 'bg-emerald-100 border-emerald-400 shadow-2xs scale-105'
                      : 'bg-slate-50/70 border-slate-200/70 hover:bg-emerald-50/60'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[9px] font-medium text-slate-600 mt-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upcoming Reminders & Alerts Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-xs text-slate-800">Upcoming Alerts & Reminders</h3>
              <span className="text-[10px] text-purple-600 font-semibold">Active</span>
            </div>

            <div className="space-y-2.5">
              {reminders.slice(0, 3).map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-2xl bg-purple-50/40 border border-purple-100/60 flex items-start gap-2.5"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                      rem.type === 'study' ? 'bg-purple-600' : rem.type === 'career' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{rem.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5">{rem.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{rem.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
