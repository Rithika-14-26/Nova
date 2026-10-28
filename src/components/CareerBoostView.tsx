import React, { useState } from 'react';
import {
  Briefcase,
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle2,
  Award,
  ArrowRight,
  Save,
  Download,
  Plus,
  Trash2,
  RotateCcw,
  MessageSquare,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { ResumeData, MockInterviewRecord } from '../types';
import { ApiService, ResumeReviewResponse, InterviewFeedbackResponse } from '../services/api';

interface CareerBoostViewProps {
  initialResume: ResumeData;
  onSaveResume: (data: ResumeData) => void;
}

const MOCK_QUESTIONS_BY_ROLE: Record<string, string[]> = {
  'Software Engineering Intern': [
    'Describe a challenging bug you encountered in a coding project and how you diagnosed and resolved it.',
    'Tell me about a time you had to balance clean software architecture with tight deadlines.',
    'How do you approach learning an unfamiliar programming language or library for a new project?',
  ],
  'Data Analyst / Scientist Intern': [
    'Walk me through a project where you turned messy raw data into actionable insights for stakeholders.',
    'How do you validate the integrity of your dataset before running statistical models?',
    'Describe a time you had to explain complex quantitative findings to a non-technical audience.',
  ],
  'Product / Project Associate': [
    'Tell me about a time when team members had conflicting priorities and how you reached consensus.',
    'How do you prioritize feature requests when resources are limited?',
    'Describe a project launch that did not go as planned and what you learned from the experience.',
  ],
};

const SAMPLE_ANSWERS: Record<string, string> = {
  'Software Engineering Intern':
    'In my Web Systems course project, we experienced an intermittent race condition where user sessions would desync under concurrent state updates. As the frontend lead, I set up unit tests to reproduce the state mutation reliably, isolated the asynchronous dispatch in our store, and transitioned the state flow to an immutable queue pattern. This completely eliminated the race condition, decreased response latency by 22%, and taught me the importance of reproducible unit tests.',
  'Data Analyst / Scientist Intern':
    'During my lab assistantship, our team collected over 10,000 participant survey records with inconsistent date formatting and missing null values. I wrote a Python cleaning pipeline using pandas and regular expressions, automated outlier detection, and created a summary dashboard in Matplotlib. This cut data processing time from 3 days to under 15 minutes for the research team.',
  'Product / Project Associate':
    'When building a campus event app with 4 fellow students, our design lead wanted a complex 3D interactive map while our backend engineer wanted to focus on push notifications. I facilitated a prioritization matrix mapping user impact versus implementation effort, which helped us agree on a clean 2D map for MVP launch. We delivered 3 days ahead of demo day with 400 active student users.',
};

export const CareerBoostView: React.FC<CareerBoostViewProps> = ({ initialResume, onSaveResume }) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'interview' | 'skills'>('resume');

  // Resume State
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [isReviewingResume, setIsReviewingResume] = useState(false);
  const [resumeFeedback, setResumeFeedback] = useState<ResumeReviewResponse | null>(null);

  // Mock Interview State
  const [selectedRole, setSelectedRole] = useState<string>('Software Engineering Intern');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewFeedbackResponse | null>(null);
  const [interviewHistory, setInterviewHistory] = useState<MockInterviewRecord[]>([]);

  const questionsForRole = MOCK_QUESTIONS_BY_ROLE[selectedRole] || MOCK_QUESTIONS_BY_ROLE['Software Engineering Intern'];
  const currentQuestion = questionsForRole[currentQuestionIndex] || questionsForRole[0];

  // Save Resume draft
  const handleSaveResume = () => {
    onSaveResume(resume);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  // AI Resume Review
  const handleReviewResume = async () => {
    setIsReviewingResume(true);
    setResumeFeedback(null);
    try {
      const res = await ApiService.reviewResume(resume, resume.targetRole);
      setResumeFeedback(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsReviewingResume(false);
    }
  };

  // Fast Fill Sample Answer
  const handleUseSampleAnswer = () => {
    const sample = SAMPLE_ANSWERS[selectedRole] || SAMPLE_ANSWERS['Software Engineering Intern'];
    setInterviewAnswer(sample);
  };

  // Evaluate Mock Interview
  const handleEvaluateInterview = async () => {
    if (!interviewAnswer.trim()) return;
    setIsEvaluatingAnswer(true);
    setInterviewFeedback(null);

    try {
      const res = await ApiService.evaluateInterviewAnswer(selectedRole, currentQuestion, interviewAnswer);
      setInterviewFeedback(res);

      const record: MockInterviewRecord = {
        id: `int_${Date.now()}`,
        role: selectedRole,
        question: currentQuestion,
        userAnswer: interviewAnswer,
        score: res.score,
        clarityRating: res.clarityRating,
        strengths: res.strengths,
        areasForGrowth: res.areasForGrowth,
        suggestedImprovement: res.suggestedImprovement,
        timestamp: new Date().toISOString(),
        isRealAi: res.isRealAi,
      };
      setInterviewHistory((prev) => [record, ...prev]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluatingAnswer(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Career Boost Lab
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build ATS-friendly student resumes, practice mock interviews with AI feedback, and identify key career skills.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs flex gap-1">
          {[
            { id: 'resume', label: 'Resume Builder', icon: FileText },
            { id: 'interview', label: 'Mock Interview', icon: MessageSquare },
            { id: 'skills', label: 'Skill Roadmap', icon: Lightbulb },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Resume Builder & Review */}
      {activeTab === 'resume' && (
        <div className="space-y-6">
          {/* Top Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xs font-bold text-slate-800">Target Role:</span>
                <input
                  type="text"
                  value={resume.targetRole}
                  onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
                  placeholder="e.g. Software Engineering Intern"
                  className="ml-2 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-amber-900 bg-amber-50/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              {isSavedNotice && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveResume}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft</span>
              </button>
              <button
                onClick={handleReviewResume}
                disabled={isReviewingResume}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>{isReviewingResume ? 'Evaluating Resume...' : 'AI Resume Review'}</span>
              </button>
            </div>
          </div>

          {/* AI Feedback Banner */}
          {resumeFeedback && (
            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-800">AI Resume Assessment & Recommendations</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Resume Impact Score:</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                    {resumeFeedback.overallScore}/100
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-amber-50/40 p-3 rounded-2xl border border-amber-100">
                {resumeFeedback.summaryCritique}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Strengths</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-emerald-800 text-[11px]">
                    {resumeFeedback.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/80 space-y-1.5">
                  <h4 className="font-bold text-purple-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>High-Impact Tweaks</span>
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-purple-800 text-[11px]">
                    {resumeFeedback.improvements.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2 Column Layout: Edit Form + Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Guided Editor */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
              <h3 className="font-bold text-sm text-slate-800 pb-2 border-b border-slate-100">
                Guided Sections
              </h3>

              {/* Personal Info */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Contact Information
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={resume.fullName}
                    onChange={(e) => setResume({ ...resume, fullName: e.target.value })}
                    placeholder="Full Name"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <input
                    type="email"
                    value={resume.email}
                    onChange={(e) => setResume({ ...resume, email: e.target.value })}
                    placeholder="Email"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={resume.phone}
                    onChange={(e) => setResume({ ...resume, phone: e.target.value })}
                    placeholder="Phone"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={resume.linkedin}
                    onChange={(e) => setResume({ ...resume, linkedin: e.target.value })}
                    placeholder="LinkedIn URL"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Professional Summary
                </span>
                <textarea
                  value={resume.summary}
                  onChange={(e) => setResume({ ...resume, summary: e.target.value })}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs leading-relaxed"
                />
              </div>

              {/* Education */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Education
                </span>
                <input
                  type="text"
                  value={resume.education.institution}
                  onChange={(e) =>
                    setResume({
                      ...resume,
                      education: { ...resume.education, institution: e.target.value },
                    })
                  }
                  placeholder="Institution"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs mb-2"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={resume.education.degree}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        education: { ...resume.education, degree: e.target.value },
                      })
                    }
                    placeholder="Degree"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <input
                    type="text"
                    value={resume.education.gpa}
                    onChange={(e) =>
                      setResume({
                        ...resume,
                        education: { ...resume.education, gpa: e.target.value },
                      })
                    }
                    placeholder="GPA"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Skills Categorization
                </span>
                {resume.skills.map((sk, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500">{sk.category}</span>
                    <input
                      type="text"
                      value={sk.items}
                      onChange={(e) => {
                        const newSkills = [...resume.skills];
                        newSkills[idx].items = e.target.value;
                        setResume({ ...resume, skills: newSkills });
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Live Formatted Resume Preview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md font-sans text-slate-800 space-y-4">
              <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">{resume.fullName}</h2>
                <p className="text-xs text-slate-500">
                  {resume.email} • {resume.phone} • {resume.linkedin}
                </p>
                <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full mt-1">
                  Target: {resume.targetRole}
                </span>
              </div>

              {/* Summary section */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  Professional Summary
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed pt-1">{resume.summary}</p>
              </div>

              {/* Education section */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  Education
                </h3>
                <div className="pt-1 flex items-baseline justify-between text-xs">
                  <span className="font-bold text-slate-800">{resume.education.institution}</span>
                  <span className="text-slate-500">{resume.education.expectedGrad}</span>
                </div>
                <p className="text-xs text-slate-600">
                  {resume.education.degree} — GPA: {resume.education.gpa}
                </p>
                <p className="text-[11px] text-slate-500">Relevant Coursework: {resume.education.coursework}</p>
              </div>

              {/* Experiences */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  Experience & Leadership
                </h3>
                {resume.experiences.map((exp) => (
                  <div key={exp.id} className="pt-1 space-y-1 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-800">
                        {exp.role} • {exp.company}
                      </span>
                      <span className="text-[11px] text-slate-500">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                      {exp.bulletPoints.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  Key Projects
                </h3>
                {resume.projects.map((proj) => (
                  <div key={proj.id} className="pt-1 space-y-1 text-xs">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-800">{proj.name}</span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {proj.technologies}
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                      {proj.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-relaxed">
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Skills */}
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-0.5">
                  Technical & Professional Skills
                </h3>
                <div className="pt-1 space-y-1 text-xs">
                  {resume.skills.map((sk, idx) => (
                    <p key={idx} className="text-slate-700">
                      <span className="font-bold text-slate-800">{sk.category}:</span> {sk.items}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Mock Interview Practice */}
      {activeTab === 'interview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-800">Mock Interview Practice Studio</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Answer realistic behavioral and technical interview prompts and receive immediate STAR rubric analysis.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentQuestionIndex(0);
                  setInterviewAnswer('');
                  setInterviewFeedback(null);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium bg-white"
              >
                {Object.keys(MOCK_QUESTIONS_BY_ROLE).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Prompt Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/60 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
              <span>Question {currentQuestionIndex + 1} of {questionsForRole.length}</span>
              <button
                type="button"
                onClick={() => {
                  setCurrentQuestionIndex((prev) => (prev + 1) % questionsForRole.length);
                  setInterviewAnswer('');
                  setInterviewFeedback(null);
                }}
                className="text-[11px] underline hover:text-amber-900"
              >
                Next Question →
              </button>
            </div>

            <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
              "{currentQuestion}"
            </h4>

            <div className="flex items-center justify-between text-[11px] text-amber-900 pt-1 border-t border-amber-200/60">
              <span>Evaluate using STAR: Situation, Task, Action, Result</span>
              <button
                type="button"
                onClick={handleUseSampleAnswer}
                className="font-bold text-amber-800 underline hover:text-amber-950"
              >
                Load Model Answer
              </button>
            </div>
          </div>

          {/* User Response Area */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Your Response:
            </label>
            <textarea
              value={interviewAnswer}
              onChange={(e) => setInterviewAnswer(e.target.value)}
              rows={6}
              placeholder="Structure your answer clearly: Describe the context, what you specifically executed, and the measurable outcome..."
              className="w-full p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-400 focus:outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Word count: {interviewAnswer.trim() ? interviewAnswer.trim().split(/\s+/).length : 0} words
              </span>

              <button
                onClick={handleEvaluateInterview}
                disabled={isEvaluatingAnswer || !interviewAnswer.trim()}
                className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
              >
                {isEvaluatingAnswer ? 'Analyzing Response...' : 'Submit for AI STAR Feedback'}
              </button>
            </div>
          </div>

          {/* Evaluation Feedback Card */}
          {interviewFeedback && (
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-sm text-slate-800">STAR Evaluation Results</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Clarity: {interviewFeedback.clarityRating}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                    Score: {interviewFeedback.score}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <span className="font-bold text-emerald-900">Demonstrated Strengths:</span>
                  <ul className="list-disc list-inside space-y-1 text-emerald-800 text-[11px]">
                    {interviewFeedback.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1.5">
                  <span className="font-bold text-purple-900">Opportunities for Growth:</span>
                  <ul className="list-disc list-inside space-y-1 text-purple-800 text-[11px]">
                    {interviewFeedback.areasForGrowth.map((area, idx) => (
                      <li key={idx}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold text-amber-900 block text-[10px] uppercase">
                  Suggested High-Impact STAR Refinement:
                </span>
                <p className="leading-relaxed">{interviewFeedback.suggestedImprovement}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Skill Roadmap */}
      {activeTab === 'skills' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-800">Curated Skill Roadmap</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identified competencies that elevate student candidacy for {resume.targetRole || 'Internships'}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-700">Foundational Core</span>
              <h4 className="font-bold text-sm text-slate-800">Algorithms & System Architecture</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Master Big-O efficiency, graph traversals, and scalable asynchronous client-server communication.
              </p>
              <span className="inline-block text-[10px] text-purple-700 font-semibold bg-white px-2 py-0.5 rounded-md">
                Mastery in Progress
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-700">High-Demand Technical</span>
              <h4 className="font-bold text-sm text-slate-800">Modern Full-Stack & APIs</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Build end-to-end full-stack applications with TypeScript, Express proxy routing, and real-time state.
              </p>
              <span className="inline-block text-[10px] text-emerald-700 font-semibold bg-white px-2 py-0.5 rounded-md">
                Demonstrated in Portfolio
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <span className="text-[10px] font-bold uppercase text-blue-700">Professional Leadership</span>
              <h4 className="font-bold text-sm text-slate-800">STAR Communication & Team Delivery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Communicate trade-offs with stakeholders, document architecture decisions, and mentor peer learners.
              </p>
              <span className="inline-block text-[10px] text-blue-700 font-semibold bg-white px-2 py-0.5 rounded-md">
                Practice in Mock Lab
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
