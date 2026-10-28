import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Globe,
  Shield,
  Download,
  RotateCcw,
  CheckCircle2,
  Database,
  Cloud,
} from 'lucide-react';
import { UserProfile, SmartReminder } from '../types';

interface SettingsModalProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  reminders: SmartReminder[];
  onToggleReminder: (id: string) => void;
  onResetDemo: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  onUpdateUser,
  reminders,
  onToggleReminder,
  onResetDemo,
  onClose,
}) => {
  const [name, setName] = useState(user.name);
  const [university, setUniversity] = useState(user.university);
  const [major, setMajor] = useState(user.major);
  const [language, setLanguage] = useState(user.preferredLanguage);
  const [sessionLength, setSessionLength] = useState(user.sessionLengthMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      university,
      major,
      preferredLanguage: language,
      sessionLengthMinutes: sessionLength,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      user,
      reminders,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nova-student-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 my-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-800">Preferences & Data Settings</h2>
              <p className="text-[11px] text-slate-500">Configure notifications, profile details, and storage privacy.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">
            ✕
          </button>
        </div>

        {/* Profile Settings */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Student Profile
            </h3>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Updated
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Major</label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none bg-white"
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Mandarin">中文</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow-sm transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        {/* Smart Reminders Controls */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Notification & Reminder Controls
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Control which smart study nudges and campus event alerts are active.
          </p>

          <div className="space-y-2">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800">{rem.title}</span>
                  <p className="text-[11px] text-slate-500">{rem.message}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    rem.enabled ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                      rem.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Storage & Privacy Section */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-600">
              Data Storage & Privacy Sandbox
            </h3>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-600" />
                <span>Current Mode: Local Persistent Sandbox</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Your study notes, flashcard summaries, quiz attempts, and wellbeing logs are safely preserved in browser local storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All Data (JSON)</span>
            </button>

            <button
              onClick={() => {
                onResetDemo();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset to Sample Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
