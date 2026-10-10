import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  RotateCcw,
  Layers,
  Brain,
  MessageSquare,
  Lock,
  Users,
  Check,
  ChevronRight,
  ExternalLink,
  Play,
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (tab?: string) => void;
  onSelectPriyaDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onSelectPriyaDemo,
}) => {
  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12">
        {/* Subtle radial ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Introducing Proof-to-Progress AI</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-300">Enterprise Accountability Suite</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
            Transform Meeting Conversations into{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Accountable, Verified Work.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MeetMind AI doesn’t just summarize transcripts. It extracts explicit deliverables, assigns verifiable acceptance criteria, and uses <strong>Gemini Multimodal AI</strong> to evaluate employee-submitted screenshots against original meeting promises.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <button
              onClick={() => onEnterApp('dashboard')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-950/80 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Launch Live Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onSelectPriyaDemo}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-cyan-500/40 text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
              <span>Interactive Priya Sharma Workflow</span>
            </button>
          </div>

          {/* Adjacency Trust Strip */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-800/80 max-w-3xl mx-auto">
            <div>
              <div className="text-lg font-extrabold text-white tabular-nums">100%</div>
              <div className="text-xs text-slate-400">Traceability Integrity</div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-cyan-400 tabular-nums">Gemini 3.8</div>
              <div className="text-xs text-slate-400">Multimodal Evidence Review</div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-white tabular-nums">Zero-Retention</div>
              <div className="text-xs text-slate-400">Consent Biometrics</div>
            </div>
            <div>
              <div className="text-lg font-extrabold text-amber-400 tabular-nums">SOC-2</div>
              <div className="text-xs text-slate-400">Audit-Ready Ledger</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Showcase Preview Card */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6 shadow-2xl relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
              Live Architecture Preview
            </span>
            <h2 className="text-xl font-bold text-white">
              The Proof-to-Progress AI Verification Engine
            </h2>
          </div>
          <button
            onClick={() => onEnterApp('traceability')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
          >
            <span>Explore Full Traceability Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Workflow Pipeline Simulation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
          {/* Step 1: Meeting Agreement */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono text-cyan-400 font-bold">01. Meeting Promise</span>
              <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded">Sprint 44 Sync</span>
            </div>
            <div className="font-mono text-slate-300 italic p-3 bg-slate-900/60 rounded border border-slate-800 text-[11px] leading-relaxed">
              "Marcus Vance: Priya, build the login page. Acceptance criteria: email/password inputs, client validation, and explicit red invalid credentials banner."
            </div>
            <div className="text-[11px] text-slate-400">
              Speaker attribution: <strong>Marcus Vance</strong> (98% confidence)
            </div>
          </div>

          {/* Step 2: Employee Evidence */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono text-amber-400 font-bold">02. Submitted Evidence</span>
              <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded">Screenshot v2</span>
            </div>
            <div className="bg-slate-900 rounded-lg p-2.5 border border-slate-800 flex flex-col items-center justify-center min-h-[100px] text-center">
              <FileCheck className="w-6 h-6 text-cyan-400 mb-1" />
              <span className="text-[11px] font-semibold text-white">login_with_validation.svg</span>
              <span className="text-[10px] text-slate-400">Identity: Verified (Consent Snapshot)</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Negative error banner & validation captured</span>
            </div>
          </div>

          {/* Step 3: AI Verdict & Manager Review */}
          <div className="bg-slate-950 border border-cyan-800/40 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="font-mono text-emerald-400 font-bold">03. AI Verification</span>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                96% Confirmed
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Inputs Present</span>
                <span className="text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Empty Validation Active</span>
                <span className="text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
              <div className="flex items-center justify-between text-slate-300 text-[11px]">
                <span>Red Invalid Banner</span>
                <span className="text-emerald-400 font-bold">✓ Satisfied</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300">
              <strong>Manager Sign-Off:</strong> Approved for staging deployment by Marcus Vance.
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Architectural Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
            Built for High-Stakes Teams
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Beyond Generic Meeting Summaries
          </h2>
          <p className="text-xs text-slate-400">
            A complete connected workflow from spoken words to verified deliverables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800/40 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Proof-to-Progress AI</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Uses Gemini multimodal capabilities to cross-examine screenshot evidence against explicit criteria. Flags satisfied requirements, missing edge cases, and contradictions.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-purple-950 border border-purple-800/40 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Meeting-to-Evidence Traceability</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every deliverable maintains an immutable link back to the exact meeting statement and decision. When decisions change, historical context is preserved with manager alerts.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800/40 text-amber-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Rework Intelligence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes historical revision trends to highlight recurring requirement ambiguities, such as omitting error states, and offers guidance to improve future sprint syncs.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Consent-Based Identity Verification</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Privacy-preserving verification before submission with informed consent. Employs zero-retention ephemeral snapshots or secure token passcodes without emotion tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive 5-Step Demo Workflow Guide */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
            Pre-Seeded Interactive Demonstration
          </span>
          <h2 className="text-2xl font-bold text-white">
            Experience the End-to-End Priya Sharma Scenario
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Follow the live scenario built into the platform to test both failure and approval paths:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-cyan-400 font-bold">1. Meeting Sync</span>
            <p className="text-slate-300 text-[11px]">
              Marcus uploads Sprint 44 sync transcript agreeing on a user login component.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-cyan-400 font-bold">2. Task Extracted</span>
            <p className="text-slate-300 text-[11px]">
              AI extracts the login task with 5 explicit acceptance criteria for Priya Sharma.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-cyan-400 font-bold">3. Draft Evidence v1</span>
            <p className="text-slate-300 text-[11px]">
              Priya submits v1 screenshot. AI flags that empty validation and error banner are missing.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-cyan-400 font-bold">4. Revision v2</span>
            <p className="text-slate-300 text-[11px]">
              Marcus requests changes. Priya uploads v2 screenshot capturing the active error banner.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-mono text-emerald-400 font-bold">5. Sign-Off</span>
            <p className="text-slate-300 text-[11px]">
              AI confirms 5/5 criteria (96% confidence). Marcus signs off on approval.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Ready to test? Click below to jump straight into the live interactive task.
          </span>
          <button
            onClick={onSelectPriyaDemo}
            className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Launch Priya's Deliverable in App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Role Navigation Quick Strip */}
      <section className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white">Explore by Organizational Role</h3>
          <p className="text-xs text-slate-400">
            Switch between Manager (Marcus), Employee (Priya), and Admin (Sarah) at any time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onEnterApp('dashboard')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Manager Dashboard
          </button>
          <button
            onClick={() => onEnterApp('tasks')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Employee Deliverables
          </button>
          <button
            onClick={() => onEnterApp('admin')}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Compliance & Audit
          </button>
        </div>
      </section>
    </div>
  );
};
