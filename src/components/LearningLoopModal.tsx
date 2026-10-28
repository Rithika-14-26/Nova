import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  Shield,
  ArrowRight,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { DailyFeedback, StudyTask } from '../types';
import { ApiService, AdaptivePlanResponse } from '../services/api';

interface LearningLoopModalProps {
  completedCount: number;
  averageQuizScore: number;
  wellnessIndex: number;
  onApplyNewTasks: (tasks: Omit<StudyTask, 'id'>[]) => void;
  onSaveFeedback: (feedback: DailyFeedback) => void;
  onClose: () => void;
}

export const LearningLoopModal: React.FC<LearningLoopModalProps> = ({
  completedCount,
  averageQuizScore,
  wellnessIndex,
  onApplyNewTasks,
  onSaveFeedback,
  onClose,
}) => {
  const [rating, setRating] = useState<number>(4);
  const [comments, setComments] = useState<string>('Pace felt good, need more active recall practice.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [adaptivePlan, setAdaptivePlan] = useState<AdaptivePlanResponse | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await ApiService.generateAdaptivePlan({
        completedCount,
        averageQuizScore,
        wellnessIndex,
        feedbackRating: rating,
        userNotes: comments,
      });
      setAdaptivePlan(res);
      onSaveFeedback({
        date: new Date().toISOString(),
        pacingRating: rating,
        comments,
        adaptivePlanGenerated: res,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToTasks = () => {
    if (!adaptivePlan) return;
    const newTasks: Omit<StudyTask, 'id'>[] = adaptivePlan.timeBlocks
      .filter((b) => b.type !== 'break')
      .map((b) => ({
        title: b.title,
        subject: b.type === 'career' ? 'Career Boost' : 'Core Focus',
        dueTime: b.time.split('-')[0].trim(),
        completed: false,
        priority: 'High',
        durationMins: 45,
      }));

    onApplyNewTasks(newTasks);
    setIsApplied(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 my-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-800">Adaptive Learning Loop</h2>
              <p className="text-[11px] text-slate-500">
                Rate today's learning load to generate tomorrow’s optimized study rhythm.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">
            ✕
          </button>
        </div>

        {/* Pacing Rating (1 to 5 Stars) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            How manageable was your study pace today?
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-semibold text-slate-700">
              {rating === 1 && 'Overwhelming / Exhausted'}
              {rating === 2 && 'Slightly Rushed'}
              {rating === 3 && 'Balanced Load'}
              {rating === 4 && 'Great Focus & Stamina'}
              {rating === 5 && 'Peak Productivity'}
            </span>
          </div>
        </div>

        {/* Feedback comments */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Reflection / Notes for the AI Planner
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            placeholder="e.g. Need more time for graph algorithms, felt well-rested after the eye break..."
            className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          />
        </div>

        {/* Data Privacy Transparency Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-600">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <span className="font-bold text-slate-800">Data Transparency:</span> NOVA uses your completion counts ({completedCount} tasks), quiz score average ({averageQuizScore}%), and wellness index ({wellnessIndex}/100) strictly to calibrate tomorrow’s session duration and break spacing.
          </p>
        </div>

        {/* Generate Button */}
        {!adaptivePlan && (
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-600 hover:opacity-95 text-white font-semibold text-xs shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isGenerating ? 'Synthesizing Adaptive Schedule...' : 'Generate Adaptive Tomorrow Plan'}</span>
          </button>
        )}

        {/* Render Generated Plan */}
        {adaptivePlan && (
          <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-purple-200">
              <span className="font-extrabold text-sm text-purple-950">
                {adaptivePlan.focusSummary}
              </span>
              <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-full">
                Adaptive Next-Day Plan
              </span>
            </div>

            <p className="text-xs text-purple-900 leading-relaxed">
              <span className="font-bold">Pacing Advice:</span> {adaptivePlan.pacingRecommendation}
            </p>

            {/* Time Blocks */}
            <div className="space-y-2">
              {adaptivePlan.timeBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                    block.type === 'break'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : block.type === 'career'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    <div>
                      <span className="font-bold block">{block.title}</span>
                      <span className="text-[10px] opacity-80">{block.notes}</span>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] font-semibold shrink-0">{block.time}</span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-purple-800 italic">
              ✨ {adaptivePlan.wellnessAdvice}
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              {isApplied ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Applied to Study Plan!
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyToTasks}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all"
                >
                  Apply to Tomorrow's Tasks
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
