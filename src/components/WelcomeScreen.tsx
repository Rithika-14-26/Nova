import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  MapPin,
  Briefcase,
  Heart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  Play,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '../types';

interface WelcomeScreenProps {
  onStartOnboarding: () => void;
  onExploreDemo: () => void;
  onSignInSuccess: (user: Partial<UserProfile>) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartOnboarding,
  onExploreDemo,
  onSignInSuccess,
}) => {
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [signInError, setSignInError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (!signInEmail || !signInEmail.includes('@')) {
      setSignInError('Please enter a valid student university email.');
      return;
    }
    if (!studentId || studentId.length < 4) {
      setSignInError('Please enter a valid student ID (at least 4 characters).');
      return;
    }

    setIsSigningIn(true);
    setTimeout(() => {
      setIsSigningIn(false);
      setShowSignInModal(false);
      onSignInSuccess({
        email: signInEmail,
        name: signInEmail.split('@')[0].replace('.', ' '),
        isDemoUser: false,
      });
    }, 600);
  };

  const featureCards = [
    {
      icon: BookOpen,
      title: 'Study AI',
      color: 'from-purple-500/10 to-indigo-500/10 border-purple-200/80 text-purple-700',
      description: 'Upload notes, get smart summaries, ask direct questions, and generate instant practice quizzes.',
    },
    {
      icon: MapPin,
      title: 'Campus Help',
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-200/80 text-blue-700',
      description: 'Navigate campus hours, library quiet zones, events, shuttles, and standard announcements.',
    },
    {
      icon: Briefcase,
      title: 'Career Boost',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-200/80 text-amber-700',
      description: 'Guided resume builder with live feedback, skill suggestions, and mock interview practice.',
    },
    {
      icon: Heart,
      title: 'Wellbeing',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-200/80 text-emerald-700',
      description: 'Daily mood & energy check-ins, guided micro-breaks (box breathing, 20-20-20), and healthy habits.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF9FF] via-[#F4FBF7] to-[#F5F3FF] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-purple-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
              NOVA
            </span>
            <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
              Student Platform
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSignInModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-white/80 transition-all border border-slate-200/80 shadow-2xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Returning Student</span>
          </button>
          <button
            onClick={onExploreDemo}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-all shadow-2xs"
          >
            <Play className="w-3.5 h-3.5 text-emerald-600" />
            <span>Explore Demo</span>
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-5xl w-full mx-auto my-auto py-8 lg:py-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/70 text-purple-800 text-xs font-semibold mb-6 border border-purple-200/60 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Connected Academic, Campus, & Wellbeing Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Your personal platform for{' '}
          <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
            academic success
          </span>{' '}
          and student balance.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          NOVA unites AI-driven note summaries, practice quizzes, campus assistance, career preparation, and daily wellbeing into one seamless, private space.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onStartOnboarding}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-purple-200 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Get Started — New Student</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 text-emerald-600" />
            <span>Explore Demo Experience</span>
          </button>
        </div>

        {/* Feature Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {featureCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl border border-slate-200/70 shadow-sm hover:shadow-md transition-all group"
              >
                <div
                  className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{card.title}</h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{card.description}</p>
              </div>
            );
          })}
        </div>

        {/* Privacy & Trust Badge */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Local privacy sandbox</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
            <span>Deterministic demo data ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Gemini server-side AI integration</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto py-4 text-center text-xs text-slate-400">
        NOVA — Intelligent Personal Student Platform • Private & Accessible
      </footer>

      {/* Returning Student Sign In Modal */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-slate-800">Returning Student Sign In</h3>
              </div>
              <button
                onClick={() => setShowSignInModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Sign in with your university credentials. Passwords are never stored in plain text, and biometric gimmicks are excluded.
            </p>

            <form onSubmit={handleSignIn} className="mt-4 space-y-3.5">
              {signInError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {signInError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Email
                </label>
                <input
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. maya.lin@student.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student ID Number
                </label>
                <input
                  type="password"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 849201"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignInModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {isSigningIn ? 'Verifying...' : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
