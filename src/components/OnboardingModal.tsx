import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  Target,
  BookOpen,
  Clock,
  Globe,
} from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingModalProps {
  onComplete: (user: UserProfile) => void;
  onCancel: () => void;
}

const COMMON_GOALS = [
  'Maintain high GPA (>= 3.8)',
  'Land Summer Tech / Business Internship',
  'Master Data Structures & Algorithms',
  'Improve Spaced Repetition Habits',
  'Achieve Balanced Sleep & Study Pacing',
  'Prepare for Graduate Admissions / GRE',
];

const COMMON_SUBJECTS = [
  'Data Structures & Algorithms',
  'Organic Chemistry',
  'Cognitive Psychology',
  'Linear Algebra & Calculus',
  'Microeconomics',
  'Molecular Cell Biology',
  'Computer Systems & Networks',
  'Academic Writing & Rhetoric',
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState('Alex Rivers');
  const [university, setUniversity] = useState('State University');
  const [major, setMajor] = useState('Computer Science');
  const [graduationYear, setGraduationYear] = useState('2027');
  const [academicGoals, setAcademicGoals] = useState<string[]>([
    'Maintain high GPA (>= 3.8)',
    'Land Summer Tech / Business Internship',
  ]);
  const [customGoal, setCustomGoal] = useState('');
  const [subjects, setSubjects] = useState<string[]>([
    'Data Structures & Algorithms',
    'Linear Algebra & Calculus',
  ]);
  const [customSubject, setCustomSubject] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [studyTimePreference, setStudyTimePreference] = useState<'morning' | 'afternoon' | 'evening' | 'night'>(
    'morning'
  );
  const [sessionLengthMinutes, setSessionLengthMinutes] = useState(45);

  const toggleGoal = (goal: string) => {
    if (academicGoals.includes(goal)) {
      setAcademicGoals(academicGoals.filter((g) => g !== goal));
    } else {
      setAcademicGoals([...academicGoals, goal]);
    }
  };

  const addCustomGoal = () => {
    if (customGoal.trim() && !academicGoals.includes(customGoal.trim())) {
      setAcademicGoals([...academicGoals, customGoal.trim()]);
      setCustomGoal('');
    }
  };

  const toggleSubject = (sub: string) => {
    if (subjects.includes(sub)) {
      setSubjects(subjects.filter((s) => s !== sub));
    } else {
      setSubjects([...subjects, sub]);
    }
  };

  const addCustomSubject = () => {
    if (customSubject.trim() && !subjects.includes(customSubject.trim())) {
      setSubjects([...subjects, customSubject.trim()]);
      setCustomSubject('');
    }
  };

  const handleFinish = () => {
    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: name || 'Student',
      email: `${(name || 'student').toLowerCase().replace(/\s+/g, '.')}@student.edu`,
      university: university || 'University',
      major: major || 'General Studies',
      graduationYear: graduationYear || '2027',
      academicGoals: academicGoals.length > 0 ? academicGoals : ['Achieve academic goals'],
      subjects: subjects.length > 0 ? subjects : ['General Science & Tech'],
      preferredLanguage,
      studyTimePreference,
      sessionLengthMinutes,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      isDemoUser: false,
    };
    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-8">
        {/* Progress header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-800">Welcome to NOVA</h2>
              <p className="text-[11px] text-slate-500">Step {step} of 4 • Student Onboarding</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">
            ✕
          </button>
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-4 gap-2 mt-4 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s <= step ? 'bg-gradient-to-r from-purple-600 to-indigo-500' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Academic Identity */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-purple-700">
              <GraduationCap className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-800">Academic Background</h3>
            </div>
            <p className="text-xs text-slate-500">
              Personalize your NOVA study dashboard and campus recommendations.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder="e.g. Alex Rivers"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">University / College</label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  placeholder="e.g. Pacific Coast University"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Major / Area of Study</label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    placeholder="e.g. Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Graduation Year</label>
                  <input
                    type="text"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                    placeholder="e.g. 2027"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Academic Goals */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-indigo-700">
              <Target className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-800">What are your primary goals this term?</h3>
            </div>
            <p className="text-xs text-slate-500">
              Select all that apply or add your own custom goals.
            </p>

            <div className="flex flex-wrap gap-2">
              {COMMON_GOALS.map((goal) => {
                const selected = academicGoals.includes(goal);
                return (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      selected
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {goal}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customGoal}
                onChange={(e) => setCustomGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomGoal())}
                placeholder="Type custom goal and click Add..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomGoal}
                className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Current Subjects */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-700">
              <BookOpen className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-800">Current Subjects & Courses</h3>
            </div>
            <p className="text-xs text-slate-500">
              These will organize your Study AI notes and practice quizzes.
            </p>

            <div className="flex flex-wrap gap-2">
              {COMMON_SUBJECTS.map((sub) => {
                const selected = subjects.includes(sub);
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => toggleSubject(sub)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSubject())}
                placeholder="Add another course (e.g. Cognitive Neuroscience)..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={addCustomSubject}
                className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Study Rhythm & Preferences */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-purple-700">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold text-sm text-slate-800">Study Style & Language</h3>
            </div>
            <p className="text-xs text-slate-500">
              NOVA adapts break intervals and study suggestions to your circadian rhythm.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preferred Language</span>
                </label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="German">Deutsch (German)</option>
                  <option value="Mandarin">中文 (Mandarin)</option>
                  <option value="Japanese">日本語 (Japanese)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Peak Focus Time of Day
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['morning', 'afternoon', 'evening', 'night'] as const).map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setStudyTimePreference(time)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                        studyTimePreference === time
                          ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ideal Single Focus Block Duration
                </label>
                <div className="flex items-center gap-3">
                  {[25, 45, 60, 90].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setSessionLengthMinutes(mins)}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                        sessionLengthMinutes === mins
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mins} mins
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-purple-200 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Launch NOVA Dashboard</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
