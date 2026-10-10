import React, { useState } from 'react';
import { User } from '../types/index.ts';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
  RotateCcw,
  Key,
  Globe,
  LayoutDashboard,
} from 'lucide-react';

interface NavigationProps {
  currentUser: User | null;
  users: User[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSwitchUser: (userId: string) => void;
  onResetDemo: () => void;
  hasGeminiKey: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentUser,
  users,
  activeTab,
  setActiveTab,
  onSwitchUser,
  onResetDemo,
  hasGeminiKey,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'traceability', label: 'Traceability' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'tasks', label: 'Tasks' },
    { id: 'rework', label: 'Rework' },
    { id: 'teams', label: 'Teams' },
    { id: 'admin', label: 'Admin' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800">
      {/* Strict Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('home')}
            className="text-left font-extrabold text-xl tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap cursor-pointer"
          >
            MeetMind<span className="text-cyan-400"> AI</span>
          </button>
        </div>

        {/* Zone 2: 4–6 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action area + role switcher */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* AI Status Indicator */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-400">
            {hasGeminiKey ? (
              <span className="flex items-center gap-1 text-emerald-400" title="Gemini 3.8 Flash live inference active">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Gemini 3.8 Live</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-400" title="Deterministic test mode (Add GEMINI_API_KEY in Secrets for live inference)">
                <Key className="w-3.5 h-3.5" />
                <span>Deterministic Mode</span>
              </span>
            )}
          </div>

          {/* Reset Demo Workflow Button */}
          <button
            onClick={onResetDemo}
            title="Reset demo data to initial Priya Sharma workflow"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>

          {/* Workspace Quick Launch or Toggle */}
          {activeTab === 'home' ? (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-950 cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Enter Workspace</span>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('home')}
              className="hidden md:flex px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Website</span>
            </button>
          )}

          {/* User & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center justify-center">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-slate-200 leading-none truncate max-w-[110px]">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold mt-0.5">
                  {currentUser?.role}
                </div>
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 text-xs text-slate-400">
                  Switch Active Role & Persona:
                </div>
                <div className="py-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                        currentUser?.id === u.id
                          ? 'bg-cyan-950/60 text-cyan-300 font-semibold border border-cyan-800/40'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-200">{u.name}</div>
                        <div className="text-[11px] text-slate-400">{u.title}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-400 uppercase font-mono font-medium">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
