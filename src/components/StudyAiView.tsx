import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  FileText,
  HelpCircle,
  Award,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Clock,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';
import { StudyNote, QuizQuestionItem, QuizAttemptRecord } from '../types';
import { ApiService, SummarizeResponse } from '../services/api';
import { calculateQuizScore } from '../utils/studyLogic';

interface StudyAiViewProps {
  notes: StudyNote[];
  onSaveNote: (note: StudyNote) => void;
  onDeleteNote: (id: string) => void;
  quizAttempts: QuizAttemptRecord[];
  onRecordQuizAttempt: (attempt: Omit<QuizAttemptRecord, 'id' | 'timestamp'>) => void;
  subjects: string[];
}

export const StudyAiView: React.FC<StudyAiViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  quizAttempts,
  onRecordQuizAttempt,
  subjects,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [activeSubTab, setActiveSubTab] = useState<'summary' | 'ask' | 'quiz' | 'history'>('summary');

  // New Note Modal
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteSubject, setNewNoteSubject] = useState(subjects[0] || 'General');
  const [newNoteContent, setNewNoteContent] = useState('');

  // Summarize state
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<SummarizeResponse | null>(null);

  // Ask question state
  const [questionText, setQuestionText] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string; isRealAi: boolean }>>([]);

  // Quiz state
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestionItem[] | null>(null);
  const [activeQuizTitle, setActiveQuizTitle] = useState('');
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submittedQuizResult, setSubmittedQuizResult] = useState<any | null>(null);
  const [quizNotice, setQuizNotice] = useState<string | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  // Trigger Summarization
  const handleSummarize = async () => {
    if (!selectedNote) return;
    setIsSummarizing(true);
    try {
      const res = await ApiService.summarizeNotes(selectedNote.title, selectedNote.content);
      setCurrentSummary(res);
      // update note with cached summary
      const updated: StudyNote = {
        ...selectedNote,
        summary: res,
      };
      onSaveNote(updated);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSummarizing(false);
    }
  };

  // Ask question about note
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim() || !selectedNote) return;
    const q = questionText.trim();
    setQuestionText('');
    setIsAsking(true);

    try {
      const res = await ApiService.askNotes(q, selectedNote.content, selectedNote.title);
      setQaHistory((prev) => [...prev, { q, a: res.answer, isRealAi: res.isRealAi }]);
    } catch (err: any) {
      setQaHistory((prev) => [
        ...prev,
        { q, a: 'Failed to process question. Please try again.', isRealAi: false },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  // Generate Practice Quiz
  const handleGenerateQuiz = async () => {
    if (!selectedNote) return;
    setIsGeneratingQuiz(true);
    setUserAnswers({});
    setSubmittedQuizResult(null);

    try {
      const res = await ApiService.generateQuiz(
        selectedNote.subject,
        selectedNote.title,
        selectedNote.content,
        quizDifficulty
      );
      setActiveQuizQuestions(res.questions);
      setActiveQuizTitle(res.quizTitle);
      setQuizNotice(res.isRealAi ? 'Generated live via Gemini 3.8 Flash' : 'Deterministic sample quiz loaded');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Submit active quiz
  const handleSubmitQuiz = () => {
    if (!activeQuizQuestions) return;
    const result = calculateQuizScore(userAnswers, activeQuizQuestions);
    setSubmittedQuizResult(result);

    // Save record to attempts history
    onRecordQuizAttempt({
      quizTitle: activeQuizTitle || `${selectedNote.title} Quiz`,
      subject: selectedNote.subject,
      scorePercentage: result.scorePercentage,
      correctCount: result.correct,
      totalQuestions: result.total,
      passed: result.passed,
      difficulty: quizDifficulty,
    });
  };

  // Handle Create Note
  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: StudyNote = {
      id: `note_${Date.now()}`,
      title: newNoteTitle.trim(),
      subject: newNoteSubject,
      content: newNoteContent.trim(),
      uploadedAt: new Date().toISOString(),
      wordCount: newNoteContent.trim().split(/\s+/).length,
    };

    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
    setShowNewNoteModal(false);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Study AI Workstation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Transform raw lecture notes into active-recall summaries, instant quizzes, and anchored Q&A.
          </p>
        </div>

        <button
          onClick={() => setShowNewNoteModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Create Notes</span>
        </button>
      </div>

      {/* Main Grid: Notes Selector Sidebar + Main AI Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Notes List */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-700">Study Materials ({notes.length})</span>
            <span className="text-[10px] text-purple-600 font-medium">Select to study</span>
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
            {notes.map((note) => {
              const isSelected = note.id === (selectedNote?.id || '');
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    setSelectedNoteId(note.id);
                    setCurrentSummary(note.summary || null);
                    setActiveQuizQuestions(null);
                    setSubmittedQuizResult(null);
                  }}
                  className={`p-3 rounded-2xl cursor-pointer transition-all border text-left ${
                    isSelected
                      ? 'bg-purple-50/90 border-purple-300 shadow-2xs'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-bold ${isSelected ? 'text-purple-900' : 'text-slate-800'}`}>
                      {note.title}
                    </p>
                    {notes.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="text-slate-400 hover:text-rose-500 p-0.5"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span className="font-medium text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full">
                      {note.subject}
                    </span>
                    <span>{note.wordCount} words</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 3 Cols: AI Workspace */}
        <div className="lg:col-span-3 space-y-4">
          {/* Sub Navigation Tabs */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs flex flex-wrap gap-1">
            {[
              { id: 'summary', label: 'AI Summary & Flashcards', icon: Sparkles },
              { id: 'ask', label: 'Ask Notes Q&A', icon: HelpCircle },
              { id: 'quiz', label: 'Practice Quiz', icon: Award },
              { id: 'history', label: 'Previous Attempts', icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* SubTab 1: AI Summary & Flashcards */}
          {activeSubTab === 'summary' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-slate-800">{selectedNote?.title}</h2>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      {selectedNote?.subject}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Uploaded on {selectedNote ? new Date(selectedNote.uploadedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <button
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-purple-200 animate-spin-slow" />
                  <span>{isSummarizing ? 'Analyzing with AI...' : 'Re-Summarize Notes'}</span>
                </button>
              </div>

              {/* Status Banner */}
              {selectedNote?.summary && (
                <div
                  className={`p-3 rounded-2xl flex items-center justify-between text-xs ${
                    selectedNote.summary.isRealAi
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-purple-50 text-purple-800 border border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>
                      {selectedNote.summary.isRealAi
                        ? 'Generated live via Gemini 3.8 Flash model.'
                        : 'Sample academic study summary loaded.'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/70">
                    Est. Read: {selectedNote.summary.estimatedReadTime || '3 mins'}
                  </span>
                </div>
              )}

              {/* Content Summary Card */}
              {selectedNote?.summary ? (
                <div className="space-y-6">
                  {/* Summary Text */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      High-Yield Overview
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                      {selectedNote.summary.summary}
                    </p>
                  </div>

                  {/* Key Concepts */}
                  {selectedNote.summary.keyConcepts && selectedNote.summary.keyConcepts.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        Key Concepts & Terminology
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedNote.summary.keyConcepts.map((kc, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1"
                          >
                            <span className="font-bold text-xs text-purple-900 block">{kc.term}</span>
                            <p className="text-xs text-slate-600 leading-relaxed">{kc.definition}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flashcards */}
                  {selectedNote.summary.flashcards && selectedNote.summary.flashcards.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        Active Recall Flashcards
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {selectedNote.summary.flashcards.map((fc, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/60 to-indigo-50/60 border border-purple-100 shadow-2xs flex flex-col justify-between min-h-[120px]"
                          >
                            <p className="text-xs font-semibold text-slate-800 leading-snug">
                              Q: {fc.front}
                            </p>
                            <div className="mt-3 pt-2 border-t border-purple-200/60 text-xs text-purple-900">
                              <span className="font-semibold text-[10px] uppercase text-purple-600 block">
                                Answer:
                              </span>
                              {fc.back}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Study Tip */}
                  {selectedNote.summary.studyTip && (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-900">High-Yield Retention Technique:</span>
                        <p className="text-xs text-emerald-800 mt-0.5">{selectedNote.summary.studyTip}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 space-y-3">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    No summary generated yet for this study document.
                  </p>
                  <button
                    onClick={handleSummarize}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                  >
                    Generate AI Summary Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SubTab 2: Ask Notes Q&A */}
          {activeSubTab === 'ask' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-800">
                  Ask Questions Anchored to "{selectedNote?.title}"
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  AI will analyze the uploaded document text to answer conceptual questions directly.
                </p>
              </div>

              {/* Chat history */}
              <div className="space-y-3 min-h-[220px] max-h-[380px] overflow-y-auto p-1">
                {qaHistory.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Ask any question regarding key mechanisms, formulas, or definitions in these notes.
                  </div>
                ) : (
                  qaHistory.map((item, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-end">
                        <div className="bg-purple-600 text-white px-3.5 py-2 rounded-2xl rounded-tr-xs text-xs max-w-lg shadow-2xs">
                          {item.q}
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="bg-slate-50 border border-slate-200/80 text-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-xs text-xs max-w-xl leading-relaxed shadow-2xs space-y-1">
                          <p>{item.a}</p>
                          <span className="text-[10px] text-slate-400 block pt-1 border-t border-slate-100">
                            {item.isRealAi ? '✨ Gemini AI' : 'Deterministic Sample Response'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleAskQuestion} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask a question about these notes (e.g. 'What is the net ATP yield?')..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isAsking || !questionText.trim()}
                  className="px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {isAsking ? 'Thinking...' : 'Ask AI'}
                </button>
              </form>
            </div>
          )}

          {/* SubTab 3: Practice Quiz Generator & Live Quiz Runner */}
          {activeSubTab === 'quiz' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Practice Quiz Generator</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate an instant 4-question multiple choice knowledge check.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={quizDifficulty}
                    onChange={(e) => setQuizDifficulty(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>

                  <button
                    onClick={handleGenerateQuiz}
                    disabled={isGeneratingQuiz}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{isGeneratingQuiz ? 'Creating Quiz...' : 'Generate New Quiz'}</span>
                  </button>
                </div>
              </div>

              {quizNotice && (
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-800 text-xs border border-purple-200 flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{quizNotice}</span>
                </div>
              )}

              {/* Active Quiz Runner */}
              {activeQuizQuestions && activeQuizQuestions.length > 0 ? (
                <div className="space-y-6">
                  {/* Score breakdown if submitted */}
                  {submittedQuizResult && (
                    <div
                      className={`p-5 rounded-2xl border text-center space-y-2 ${
                        submittedQuizResult.passed
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <h4 className="font-extrabold text-xl">
                        Score: {submittedQuizResult.scorePercentage}% ({submittedQuizResult.correct}/
                        {submittedQuizResult.total} Correct)
                      </h4>
                      <p className="text-xs">
                        {submittedQuizResult.passed
                          ? '🎉 Mastery Achieved! Great conceptual grasp on this material.'
                          : 'Keep practicing! Review the detailed explanations below to reinforce weak spots.'}
                      </p>
                      <button
                        onClick={handleGenerateQuiz}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold shadow-2xs hover:bg-slate-50"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Another Quiz</span>
                      </button>
                    </div>
                  )}

                  {/* Questions List */}
                  <div className="space-y-5">
                    {activeQuizQuestions.map((q, qIndex) => {
                      const selectedOpt = userAnswers[q.id];
                      const hasSubmitted = !!submittedQuizResult;
                      const isCorrect = selectedOpt === q.correctIndex;

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-bold text-xs text-slate-800">
                              {qIndex + 1}. {q.question}
                            </span>
                            {hasSubmitted && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                            )}
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIndex) => {
                              const isChecked = selectedOpt === optIndex;
                              let btnClass =
                                'bg-white text-slate-700 border-slate-200 hover:bg-purple-50/50';

                              if (hasSubmitted) {
                                if (optIndex === q.correctIndex) {
                                  btnClass = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                                } else if (isChecked && !isCorrect) {
                                  btnClass = 'bg-rose-100 border-rose-300 text-rose-900 line-through';
                                }
                              } else if (isChecked) {
                                btnClass = 'bg-purple-600 text-white border-purple-600 font-semibold';
                              }

                              return (
                                <button
                                  key={optIndex}
                                  type="button"
                                  disabled={hasSubmitted}
                                  onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIndex })}
                                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {hasSubmitted && optIndex === q.correctIndex && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {hasSubmitted && (
                            <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-xs text-purple-950 space-y-0.5">
                              <span className="font-bold block text-[10px] uppercase text-purple-700">
                                Educational Explanation:
                              </span>
                              <p>{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit Button */}
                  {!submittedQuizResult && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(userAnswers).length < activeQuizQuestions.length}
                        className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
                      >
                        Submit Answers & Calculate Score
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 space-y-2">
                  <Award className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">
                    Ready to test your recall? Click "Generate New Quiz" above.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SubTab 4: Previous Attempts History */}
          {activeSubTab === 'history' && (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-800">Past Quiz Attempts</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your mastery trends across course subjects.
                </p>
              </div>

              {quizAttempts.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No quiz attempts recorded yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {quizAttempts.map((atm) => (
                    <div key={atm.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{atm.quizTitle}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                          <span>{atm.subject}</span>
                          <span>•</span>
                          <span>{new Date(atm.timestamp).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-slate-800">
                          {atm.scorePercentage}%
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            atm.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {atm.passed ? 'Passed' : 'Needs Review'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload/New Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">Add Study Material / Notes</h3>
              <button
                onClick={() => setShowNewNoteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Organic Chemistry — Carbonyl Addition Reactions"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={newNoteSubject}
                  onChange={(e) => setNewNoteSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
                >
                  {subjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                  <option value="General Studies">General Studies</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Note Content or Lecture Transcript
                </label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={6}
                  placeholder="Paste lecture notes, study guide text, or bullet points here..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewNoteModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm"
                >
                  Save & Begin Studying
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
