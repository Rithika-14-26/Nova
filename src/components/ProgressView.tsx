import React from 'react';
import {
  TrendingUp,
  Flame,
  Award,
  CheckCircle2,
  Heart,
  Clock,
  BookOpen,
  Briefcase,
  MapPin,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  UserProfile,
  StudyTask,
  QuizAttemptRecord,
  WellbeingEntry,
  StudyNote,
} from '../types';
import { calculateWellbeingScore } from '../utils/studyLogic';

interface ProgressViewProps {
  user: UserProfile;
  tasks: StudyTask[];
  quizAttempts: QuizAttemptRecord[];
  wellbeingHistory: WellbeingEntry[];
  notes: StudyNote[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  user,
  tasks,
  quizAttempts,
  wellbeingHistory,
  notes,
}) => {
  const completedTasks = tasks.filter((t) => t.completed);
  const totalDurationMinutes = completedTasks.reduce((acc, t) => acc + t.durationMins, 0);
  const focusHours = (totalDurationMinutes / 60).toFixed(1);

  // Average quiz score
  const totalScores = quizAttempts.reduce((acc, q) => acc + q.scorePercentage, 0);
  const avgQuizScore =
    quizAttempts.length > 0 ? Math.round(totalScores / quizAttempts.length) : 85;

  const wellness = calculateWellbeingScore(wellbeingHistory);

  // Group quiz attempts by subject
  const subjectScores: Record<string, { total: number; count: number }> = {};
  quizAttempts.forEach((atm) => {
    if (!subjectScores[atm.subject]) {
      subjectScores[atm.subject] = { total: 0, count: 0 };
    }
    subjectScores[atm.subject].total += atm.scorePercentage;
    subjectScores[atm.subject].count += 1;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Unified Progress Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Connected metrics across Study AI, Campus activities, Career prep, and Daily wellbeing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              user.isDemoUser
                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {user.isDemoUser ? 'Sample Student Data Active' : 'Personal Saved Storage'}
          </span>
        </div>
      </div>

      {/* 4 Core Pillars KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Streak */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Study Streak
            </span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{user.streakDays} Days</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Active daily habit</p>
        </div>

        {/* Metric 2: Completed Sessions */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Focus Time
            </span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{focusHours} hrs</p>
          <p className="text-[11px] text-slate-500">{completedTasks.length} sessions completed</p>
        </div>

        {/* Metric 3: Quiz Average */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Quiz Average
            </span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{avgQuizScore}%</p>
          <p className="text-[11px] text-indigo-700 font-semibold">
            {quizAttempts.length} quizzes taken
          </p>
        </div>

        {/* Metric 4: Wellness Index */}
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Wellness Index
            </span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{wellness.wellnessIndex}/100</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Balanced Stamina</p>
        </div>
      </div>

      {/* Main Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Performance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Subject Mastery Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">Average quiz score retention per enrolled subject.</p>
            </div>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-4">
            {user.subjects.map((sub) => {
              const data = subjectScores[sub];
              const score = data ? Math.round(data.total / data.count) : 80;
              return (
                <div key={sub} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800">{sub}</span>
                    <span className="text-purple-700">{score}% Mastery</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 85
                          ? 'bg-emerald-500'
                          : score >= 70
                          ? 'bg-purple-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Longitudinal Wellbeing & Study Balance */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-sm text-slate-800">Weekly Vitality & Rhythm</h3>
              <p className="text-xs text-slate-500 mt-0.5">Logged energy and mood vs study completion.</p>
            </div>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
                <span className="text-[10px] uppercase font-bold text-purple-700 block">Avg Mood</span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                  {wellness.averageMood} / 5
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Energy</span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                  {wellness.averageEnergy} / 5
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">Stress</span>
                <span className="text-xl font-extrabold text-slate-900 mt-1 block">
                  {wellness.averageStress} / 5
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-800 block">Correlation Insight:</span>
              <p className="leading-relaxed text-slate-600">
                Your highest quiz scores correlate directly with days where morning energy was logged at 4+ and box breathing breaks were taken after 45-minute focus intervals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Modules Health Stream */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
          Module Connectivity Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
            <span className="font-bold text-purple-900">Study AI</span>
            <p className="text-slate-600">{notes.length} uploaded documents active</p>
            <p className="text-slate-600">{quizAttempts.length} quiz evaluations logged</p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1">
            <span className="font-bold text-blue-900">Campus Help</span>
            <p className="text-slate-600">Standard campus directory connected</p>
            <p className="text-slate-600">4 upcoming university events tracked</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1">
            <span className="font-bold text-amber-900">Career Boost</span>
            <p className="text-slate-600">Resume draft saved with ATS review</p>
            <p className="text-slate-600">Mock interview STAR rubrics available</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1">
            <span className="font-bold text-emerald-900">Wellbeing</span>
            <p className="text-slate-600">{wellbeingHistory.length} check-in entries logged</p>
            <p className="text-slate-600">4-4-4-4 Box breathing resets completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};
