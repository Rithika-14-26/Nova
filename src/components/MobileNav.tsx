import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MapPin,
  Briefcase,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { NavTab } from './Sidebar';

interface MobileNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab }) => {
  const items: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'study', label: 'Study AI', icon: BookOpen },
    { id: 'campus', label: 'Campus', icon: MapPin },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'wellbeing', label: 'Wellbeing', icon: Heart },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 px-2 py-1.5 shadow-lg flex items-center justify-around"
      aria-label="Mobile Navigation"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive ? 'text-purple-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <div
              className={`p-1 rounded-lg transition-colors ${
                isActive ? 'bg-purple-100 text-purple-700' : 'bg-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
