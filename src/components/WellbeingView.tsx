import React, { useState, useEffect } from 'react';
import {
  Heart,
  Smile,
  ShieldCheck,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Droplets,
  Eye,
  CheckCircle2,
  Calendar,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { WellbeingEntry } from '../types';
import { calculateWellbeingScore } from '../utils/studyLogic';

interface WellbeingViewProps {
  history: WellbeingEntry[];
  onSaveCheckin: (entry: WellbeingEntry) => void;
}

export const WellbeingView: React.FC<WellbeingViewProps> = ({ history, onSaveCheckin }) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const existingToday = history.find((h) => h.date.slice(0, 10) === todayStr);

  const [moodRating, setMoodRating] = useState<number>(existingToday?.moodRating || 4);
  const [energyLevel, setEnergyLevel] = useState<number>(existingToday?.energyLevel || 4);
  const [stressLevel, setStressLevel] = useState<number>(existingToday?.stressLevel || 2);
  const [reflectionNotes, setReflectionNotes] = useState<string>(existingToday?.notes || '');
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  // Box Breathing Timer State (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold (Full)';
              if (currentPhase === 'Hold (Full)') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Hold (Empty)';
              setCyclesCompleted((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: WellbeingEntry = {
      date: new Date().toISOString(),
      moodRating,
      energyLevel,
      stressLevel,
      notes: reflectionNotes,
    };
    onSaveCheckin(entry);
    setSaveConfirmed(true);
    setTimeout(() => setSaveConfirmed(false), 3000);
  };

  const wellnessMetrics = calculateWellbeingScore(history);

  const moodEmojis = [
    { rating: 1, emoji: '😴', label: 'Exhausted' },
    { rating: 2, emoji: '🙁', label: 'Low Mood' },
    { rating: 3, emoji: '😐', label: 'Balanced' },
    { rating: 4, emoji: '🙂', label: 'Positive' },
    { rating: 5, emoji: '✨', label: 'Radiant' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Heart className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Wellbeing & Mindful Rest
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Private daily mood check-ins, guided cognitive reset breaks, and balanced academic stamina planning.
          </p>
        </div>
      </div>

      {/* Non-clinical Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3 text-xs text-emerald-900">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Confidentiality & Non-Clinical Guidance Notice:</span>
          <p className="mt-0.5 text-emerald-800 leading-relaxed">
            All check-ins are stored privately in your browser sandbox. Wellbeing tools offer supportive lifestyle and study-break suggestions only; they do not diagnose, treat, or replace professional medical or mental health care.
          </p>
        </div>
      </div>

      {/* Main Grid: Daily Check-in Form + Interactive Break Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Mood Check-In Form */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-800">Daily Self-Check-in</h3>
              <p className="text-xs text-slate-400 mt-0.5">Track daily vitality and stress fluctuations.</p>
            </div>
            {saveConfirmed && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Mood selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. How are you feeling overall today?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodEmojis.map((item) => (
                  <button
                    key={item.rating}
                    type="button"
                    onClick={() => setMoodRating(item.rating)}
                    className={`flex flex-col items-center py-2.5 px-1 rounded-2xl border text-center transition-all ${
                      moodRating === item.rating
                        ? 'bg-emerald-100 border-emerald-400 shadow-2xs scale-105'
                        : 'bg-slate-50 border-slate-200/70 hover:bg-emerald-50/50'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-[10px] font-semibold text-slate-700 mt-1">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Energy Level (1 to 5) */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-bold text-slate-700">
                <span>2. Cognitive Energy Level</span>
                <span className="text-emerald-700">{energyLevel} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={energyLevel}
                onChange={(e) => setEnergyLevel(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Drained</span>
                <span>Moderate Focus</span>
                <span>Peak Alertness</span>
              </div>
            </div>

            {/* Stress Level (1 to 5) */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-bold text-slate-700">
                <span>3. Current Academic Stress Pressure</span>
                <span className="text-purple-700">{stressLevel} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={stressLevel}
                onChange={(e) => setStressLevel(parseInt(e.target.value, 10))}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Peaceful</span>
                <span>Manageable Load</span>
                <span>High Exam Pressure</span>
              </div>
            </div>

            {/* Private reflection note */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Optional Reflection Note (Private)
              </label>
              <textarea
                value={reflectionNotes}
                onChange={(e) => setReflectionNotes(e.target.value)}
                placeholder="Jot down a quick thought (e.g. 'Feeling great after finishing biology summary')..."
                rows={2}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
            >
              Record Today's Check-in
            </button>
          </form>
        </div>

        {/* Guided Study-Break Studio: Box Breathing Timer */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-800">Mindful Reset: Box Breathing</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                4-4-4-4 rhythm calms the nervous system and refreshes working memory.
              </p>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              {cyclesCompleted} Cycles
            </span>
          </div>

          {/* Visual Breathing Circle */}
          <div className="my-auto py-6 flex flex-col items-center justify-center">
            <div
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center transition-all duration-1000 border-4 ${
                breathPhase === 'Inhale'
                  ? 'scale-110 bg-emerald-50 border-emerald-400 shadow-md shadow-emerald-100'
                  : breathPhase === 'Hold (Full)'
                  ? 'scale-110 bg-indigo-50 border-indigo-400 shadow-md shadow-indigo-100'
                  : breathPhase === 'Exhale'
                  ? 'scale-90 bg-purple-50 border-purple-400'
                  : 'scale-90 bg-slate-50 border-slate-300'
              }`}
            >
              <span className="text-2xl font-extrabold text-slate-800">{breathSecondsLeft}s</span>
              <span className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
                {breathPhase}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsBreathingActive(!isBreathingActive)}
                className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-semibold shadow-sm transition-all ${
                  isBreathingActive
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isBreathingActive ? 'Pause' : 'Start 4-Minute Reset'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsBreathingActive(false);
                  setBreathPhase('Inhale');
                  setBreathSecondsLeft(4);
                  setCyclesCompleted(0);
                }}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100"
                title="Reset timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Micro-break suggestions */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-2">
              <Eye className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-blue-900">20-20-20 Eye Relief</span>
                <p className="text-[10px] text-blue-800 leading-snug mt-0.5">
                  Look 20 feet away for 20 seconds to relax ciliary eye muscles.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100 flex items-start gap-2">
              <Droplets className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-teal-900">Hydration & Spine</span>
                <p className="text-[10px] text-teal-800 leading-snug mt-0.5">
                  Drink 250ml water and gently roll shoulders back 5 times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supportive Personal Wellbeing Plan */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-800">Supportive Personal Wellbeing Plan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Longitudinal metrics synthesized from your logged check-in entries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600">Calculated Wellness Index:</span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
              {wellnessMetrics.wellnessIndex} / 100
            </span>
          </div>
        </div>

        {/* 3 Pillar Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
            <span className="text-[10px] font-bold text-purple-700 uppercase">Average Mood</span>
            <p className="text-2xl font-extrabold text-slate-800">{wellnessMetrics.averageMood} / 5</p>
            <p className="text-xs text-slate-600">
              Consistent emotional resilience noted over your recent study blocks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Cognitive Energy</span>
            <p className="text-2xl font-extrabold text-slate-800">{wellnessMetrics.averageEnergy} / 5</p>
            <p className="text-xs text-slate-600">
              Optimal energy windows align with your morning study schedule preference.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
            <span className="text-[10px] font-bold text-indigo-700 uppercase">Perceived Stress</span>
            <p className="text-2xl font-extrabold text-slate-800">{wellnessMetrics.averageStress} / 5</p>
            <p className="text-xs text-slate-600">
              Healthy manageable threshold; keep incorporating 10-minute movement buffers.
            </p>
          </div>
        </div>

        {/* Past checkins table */}
        <div className="space-y-3 pt-2">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
            Recent Check-in Log
          </h4>
          <div className="divide-y divide-slate-100">
            {history.slice(-5).reverse().map((entry, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{entry.date.slice(0, 10)}</span>
                <div className="flex items-center gap-4 text-slate-600">
                  <span>Mood: {entry.moodRating}/5</span>
                  <span>Energy: {entry.energyLevel}/5</span>
                  <span>Stress: {entry.stressLevel}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
