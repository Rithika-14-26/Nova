import React, { useState } from 'react';
import { Sparkles, Bell, User, Check, RefreshCw, Moon, Sun, ShieldCheck } from 'lucide-react';
import { UserProfile, SmartReminder } from '../types';

interface NavbarProps {
  user: UserProfile;
  geminiConfigured: boolean;
  reminders: SmartReminder[];
  onToggleReminderRead: (id: string) => void;
  onOpenSettings: () => void;
  onOpenLearningLoop: () => void;
  onResetDemo: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  geminiConfigured,
  reminders,
  onToggleReminderRead,
  onOpenSettings,
  onOpenLearningLoop,
  onResetDemo,
  onLogout,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = reminders.filter((r) => !r.read && r.enabled).length;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-purple-100/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-sm shadow-purple-200">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                NOVA
              </span>
              <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                Student AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              Study • Campus • Career • Wellbeing
            </p>
          </div>
        </div>

        {/* Center: AI Engine status pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <span
            className={`w-2 h-2 rounded-full ${
              geminiConfigured ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-400 ring-4 ring-amber-100'
            }`}
          />
          <span className="font-medium">
            {geminiConfigured ? 'Gemini 3.8 Live AI' : 'Deterministic Demo Mode'}
          </span>
          <span className="text-[10px] text-slate-500">
            {geminiConfigured ? '• Server Proxy' : '• Offline Ready'}
          </span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Learning Loop button */}
          <button
            onClick={onOpenLearningLoop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70 transition-colors shadow-2xs"
            title="Daily Reflection & Next-day Plan"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Adaptive Plan</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
              aria-label="Smart Reminders and Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-purple-600 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-purple-600" />
                    <h4 className="font-semibold text-sm text-slate-800">Smart Reminders</h4>
                  </div>
                  <span className="text-xs text-slate-500">{reminders.length} active</span>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto mt-2">
                  {reminders.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No reminders scheduled.</p>
                  ) : (
                    reminders.map((rem) => (
                      <div
                        key={rem.id}
                        className={`py-2.5 px-2 rounded-lg flex items-start gap-3 transition-colors ${
                          rem.read ? 'opacity-60 bg-transparent' : 'bg-purple-50/50'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            rem.type === 'study'
                              ? 'bg-purple-500'
                              : rem.type === 'campus'
                              ? 'bg-blue-500'
                              : rem.type === 'career'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800">{rem.title}</p>
                          <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">{rem.message}</p>
                          <span className="text-[10px] text-slate-500 mt-1 block">{rem.timestamp}</span>
                        </div>
                        {!rem.read && (
                          <button
                            onClick={() => onToggleReminderRead(rem.id)}
                            className="text-xs p-1 text-slate-500 hover:text-purple-600"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar & Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-purple-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-200 to-indigo-100 text-purple-700 flex items-center justify-center font-bold text-xs ring-2 ring-purple-100">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-slate-700 hidden sm:inline-block max-w-[100px] truncate">
                {user.name}
              </span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-3 z-50">
                <div className="pb-3 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <p className="text-[10px] text-purple-700 font-medium mt-1 truncate">
                    {user.major} • {user.graduationYear}
                  </p>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenSettings();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg flex items-center justify-between"
                  >
                    <span>Account & Preferences</span>
                    <User className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onResetDemo();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-amber-700 hover:bg-amber-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Reset to Sample Data</span>
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                  >
                    Switch User / Exit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
