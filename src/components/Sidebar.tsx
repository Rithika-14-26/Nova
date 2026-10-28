import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MapPin,
  Briefcase,
  Heart,
  TrendingUp,
  Settings,
  Flame,
  Shield,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'study'
  | 'campus'
  | 'career'
  | 'wellbeing'
  | 'progress'
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  streakDays: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, streakDays }) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'AI Dashboard', icon: LayoutDashboard },
    { id: 'study', label: 'Study AI', icon: BookOpen, badge: 'Smart' },
    { id: 'campus', label: 'Campus Help', icon: MapPin },
    { id: 'career', label: 'Career Boost', icon: Briefcase },
    { id: 'wellbeing', label: 'Wellbeing', icon: Heart },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Data', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between border-r border-purple-100/80 bg-white/70 backdrop-blur-sm p-4 min-h-[calc(100vh-61px)]">
      <div className="space-y-6">
        {/* Streak & Focus Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 via-indigo-50/50 to-emerald-50 border border-purple-100/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white shadow-2xs text-amber-500">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              </span>
              <div>
                <span className="text-xs font-bold text-slate-800">{streakDays}-Day Streak</span>
                <p className="text-[10px] text-slate-500">Active study consistency</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              On Track
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                      isActive
                        ? 'bg-purple-700 text-purple-100'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Privacy Note */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Private & Sandboxed</span>
          </div>
          <p className="text-[10px] leading-relaxed text-slate-500">
            Study notes, quiz records, and wellbeing check-ins are kept confidential.
          </p>
        </div>

        <p className="text-[10px] text-center text-slate-400">
          NOVA Student Intelligence v1.0
        </p>
      </div>
    </aside>
  );
};
