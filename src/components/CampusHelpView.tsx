import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Calendar,
  Clock,
  Bell,
  Bus,
  Library,
  HeartPulse,
  Sparkles,
  Info,
  Check,
  AlertCircle,
  Users,
} from 'lucide-react';
import { CampusEvent, CampusAnnouncement } from '../types';
import { ApiService } from '../services/api';

interface CampusHelpViewProps {
  events: CampusEvent[];
  announcements: CampusAnnouncement[];
}

export const CampusHelpView: React.FC<CampusHelpViewProps> = ({ events, announcements }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [rsvpdEventIds, setRsvpdEventIds] = useState<string[]>([]);

  const handleAskCampus = async (queryText?: string) => {
    const q = (queryText || searchQuery).trim();
    if (!q) return;
    setIsAsking(true);
    setQaAnswer(null);

    try {
      const res = await ApiService.askCampusQuestion(q);
      setQaAnswer(res.answer);
      setAiNote(res.isRealAi ? 'Answered via Gemini 3.8 Flash' : 'Standard campus directory guide');
    } catch (err: any) {
      setQaAnswer('Unable to retrieve campus information. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  const toggleRsvp = (eventId: string) => {
    if (rsvpdEventIds.includes(eventId)) {
      setRsvpdEventIds(rsvpdEventIds.filter((id) => id !== eventId));
    } else {
      setRsvpdEventIds([...rsvpdEventIds, eventId]);
    }
  };

  const categories = ['All', 'Academic', 'Career', 'Wellness', 'Social', 'Athletics'];
  const filteredEvents =
    selectedCategory === 'All'
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const sampleQueries = [
    'When does the library close during finals?',
    'Where is the student health center?',
    'What is the campus shuttle schedule?',
    'How do I reserve a quiet study room?',
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <MapPin className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Campus Assistance & Events
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Search campus protocols, upcoming university activities, shuttle routes, and department notices.
          </p>
        </div>
      </div>

      {/* Transparent Sample Data Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Sample Campus Data Notice:</span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            All schedules, campus events, and announcements shown below are realistic educational samples configured for demonstration purposes until connected to your official university SIS or portal.
          </p>
        </div>
      </div>

      {/* Interactive Campus Q&A Search Box */}
      <div className="bg-white rounded-3xl p-6 border border-blue-100/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h2 className="font-bold text-sm text-slate-800">Ask Campus Guide AI</h2>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskCampus();
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ask about study rooms, shuttle lines, library hours, health center..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isAsking || !searchQuery.trim()}
            className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
          >
            {isAsking ? 'Searching...' : 'Find Answer'}
          </button>
        </form>

        {/* Quick query chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-slate-400 mr-1">Popular questions:</span>
          {sampleQueries.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSearchQuery(q);
                handleAskCampus(q);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 text-[11px] border border-slate-200/70 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Q&A Result Box */}
        {qaAnswer && (
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-xs text-slate-800 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[10px] text-blue-700 font-bold uppercase tracking-wider">
              <span>Campus Guide Response</span>
              <span>{aiNote}</span>
            </div>
            <p className="leading-relaxed text-slate-700">{qaAnswer}</p>
          </div>
        )}
      </div>

      {/* Directory Quick Cards: Library, Health, Shuttles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-purple-700">
            <Library className="w-5 h-5" />
            <h3 className="font-bold text-xs text-slate-800">University Library</h3>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Mon-Thu: 7:30 AM – Midnight <br />
            Level 4 Quiet Zone • Group study pods 1-12
          </p>
          <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            Open Now
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-rose-700">
            <HeartPulse className="w-5 h-5" />
            <h3 className="font-bold text-xs text-slate-800">Student Health Center</h3>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            Health Science Bldg, Suite 210 <br />
            Walk-ins Mon-Fri 8:30 AM – 4:30 PM
          </p>
          <span className="inline-block text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
            Nurse Hotline 24/7
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
          <div className="flex items-center gap-2 text-blue-700">
            <Bus className="w-5 h-5" />
            <h3 className="font-bold text-xs text-slate-800">Campus Shuttles</h3>
          </div>
          <p className="text-[11px] text-slate-600 leading-snug">
            North / South Express runs every 12 mins <br />
            Active 7:00 AM – 11:30 PM daily
          </p>
          <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
            Live Schedule Synced
          </span>
        </div>
      </div>

      {/* Main Grid: Campus Events + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Section (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-base text-slate-800">Campus Events & Workshops</h2>
              <p className="text-xs text-slate-500 mt-0.5">Explore academic lectures, social gatherings, and career events.</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            {filteredEvents.map((evt) => {
              const isRsvpd = rsvpdEventIds.includes(evt.id);
              return (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                        {evt.category}
                      </span>
                      <span className="text-[10px] text-slate-400">Sample Event</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800">{evt.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {evt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {evt.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {evt.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {evt.attendeesCount + (isRsvpd ? 1 : 0)} attending
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleRsvp(evt.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center justify-center gap-1.5 ${
                      isRsvpd
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {isRsvpd && <Check className="w-3.5 h-3.5" />}
                    <span>{isRsvpd ? 'RSVP Confirmed' : 'RSVP to Event'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements Section (1 Col) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-800">Campus Announcements</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Sample Feed</span>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-purple-700">{ann.department}</span>
                  <span className="text-[10px] text-slate-400">{ann.date}</span>
                </div>
                <h4 className="font-bold text-xs text-slate-800">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{ann.content}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Priority: {ann.priority}</span>
                  <span className="text-amber-700 font-medium">Sample Announcement</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
