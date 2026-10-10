import React, { useState } from 'react';
import { User, Task, Meeting } from '../types/index.ts';
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Plus,
  Search,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { CircularProgress } from '../components/CircularProgress.tsx';

interface DashboardPageProps {
  currentUser: User | null;
  tasks: Task[];
  meetings: Meeting[];
  onSelectTask: (taskId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  tasks,
  meetings,
  onSelectTask,
  onNavigateTab,
}) => {
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isManager = currentUser?.role === 'manager';
  const isEmployee = currentUser?.role === 'employee';
  const isAdmin = currentUser?.role === 'admin';

  // Compute metrics
  const totalTasks = tasks.length;
  const awaitingEvidence = tasks.filter((t) => t.status === 'awaiting_evidence').length;
  const underReview = tasks.filter(
    (t) => t.status === 'manager_review_required' || t.status === 'submitted' || t.status === 'partially_demonstrated'
  ).length;
  const approvedTasks = tasks.filter((t) => t.status === 'approved').length;
  const changesRequested = tasks.filter((t) => t.status === 'changes_requested').length;

  // Filter tasks
  const displayedTasks = tasks.filter((task) => {
    if (isEmployee && task.assignedToId !== currentUser?.id) {
      return false; // employee sees only their assigned tasks
    }
    if (filterEmployee !== 'all' && task.assignedToId !== filterEmployee) {
      return false;
    }
    if (filterStatus !== 'all' && task.status !== filterStatus) {
      return false;
    }
    if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Recharts trend data (evidence-backed completed tasks)
  const chartData = [
    { day: 'Mon', completed: 2, revisions: 1 },
    { day: 'Tue', completed: 4, revisions: 2 },
    { day: 'Wed', completed: 3, revisions: 1 },
    { day: 'Thu', completed: 6, revisions: 2 },
    { day: 'Fri', completed: 8, revisions: 3 },
    { day: 'Sat', completed: 1, revisions: 0 },
    { day: 'Sun', completed: 2, revisions: 0 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Persona Introduction */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-1">
            {isManager && 'Manager Intelligence Overview'}
            {isEmployee && `Employee Portal · Assigned to ${currentUser?.name}`}
            {isAdmin && 'Enterprise Admin & Compliance Center'}
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {isManager && 'Executive Accountability & Delivery Matrix'}
            {isEmployee && 'My Deliverables & Proof Checklist'}
            {isAdmin && 'Security, AI Configuration & Audit Overview'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isManager &&
              'Track verifiable deliverables extracted from meeting agreements. Evaluate employee submitted screenshots and test artifacts against explicit criteria.'}
            {isEmployee &&
              'View your agreed meeting commitments, upload verifiable screenshots, and review AI acceptance criteria findings.'}
            {isAdmin &&
              'Audit log inspection, role-based access control, privacy retention, and enterprise integration health.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('traceability')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950"
          >
            <span>Traceability Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          {isManager && (
            <button
              onClick={() => onNavigateTab('meetings')}
              className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Meeting</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">Total Agreed Tasks</div>
          <div className="text-2xl font-bold text-white mt-1 tabular-nums">{totalTasks}</div>
          <div className="text-[11px] text-slate-500 mt-1">Extracted from meetings</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">Awaiting Evidence</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">{awaitingEvidence}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending submission</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">Under Review / AI Analyzed</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 tabular-nums">{underReview}</div>
          <div className="text-[11px] text-slate-500 mt-1">Criteria evaluated</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">Manager Approved</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{approvedTasks}</div>
          <div className="text-[11px] text-slate-500 mt-1">Proof confirmed</div>
        </div>
      </div>

      {/* Changes Requested Banner if any */}
      {changesRequested > 0 && isEmployee && (
        <div className="bg-rose-950/30 border border-rose-800/60 rounded-xl p-4 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <strong>Action Required:</strong> A submitted deliverable requires revisions. Check manager feedback and upload updated evidence.
            </div>
          </div>
          <button
            onClick={() => {
              const reqTask = tasks.find((t) => t.status === 'changes_requested');
              if (reqTask) onSelectTask(reqTask.id);
            }}
            className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded font-semibold transition-colors"
          >
            Review Feedback
          </button>
        </div>
      )}

      {/* Chart Section for Manager / Admin */}
      {(isManager || isAdmin) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Proof-to-Progress Delivery Velocity</h3>
                <p className="text-xs text-slate-400">
                  Verified task completions vs rework revisions across sprint cycle
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400">Last 7 Days</span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Verified Deliverables"
                    stroke="#06B6D4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">Verification Status Breakdown</h3>
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Approved Deliverables</span>
                  <span className="text-white font-mono">{approvedTasks} / {totalTasks}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(approvedTasks / (totalTasks || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Evidence Under Review</span>
                  <span className="text-white font-mono">{underReview} / {totalTasks}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${(underReview / (totalTasks || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Awaiting Initial Submission</span>
                  <span className="text-white font-mono">{awaitingEvidence} / {totalTasks}</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full"
                    style={{ width: `${(awaitingEvidence / (totalTasks || 1)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <strong>Accountability Standard:</strong> No task is marked complete based solely on hours logged. Verification requires visible artifact match.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Filters & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks by title or deliverable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {isManager && (
            <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Employees</option>
              <option value="user_priya">Priya Sharma</option>
              <option value="user_alex">Alex Chen</option>
            </select>
          )}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="awaiting_evidence">Awaiting Evidence</option>
            <option value="submitted">Submitted</option>
            <option value="partially_demonstrated">Partially Demonstrated</option>
            <option value="manager_review_required">Manager Review Required</option>
            <option value="approved">Approved</option>
            <option value="changes_requested">Changes Requested</option>
          </select>
        </div>
      </div>

      {/* Tasks Table / Card Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            {isEmployee ? 'My Assigned Deliverables' : 'Team Task Deliverables & Evidence Status'}
          </h3>
          <span className="text-xs text-slate-400">
            Showing <strong className="text-slate-200">{displayedTasks.length}</strong> tasks
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {displayedTasks.map((task) => {
            const totalCrit = task.acceptanceCriteria.length;
            const satisfiedCrit = task.acceptanceCriteria.filter((c) => c.satisfied).length;
            const completionPct = totalCrit > 0 ? Math.round((satisfiedCrit / totalCrit) * 100) : 0;

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2.5 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400 font-semibold">{task.id}</span>
                    <span>·</span>
                    <span className="text-slate-300">{task.meetingTitle}</span>
                    <span>·</span>
                    <span>Assignee: <strong className="text-slate-200">{task.assignedToName}</strong></span>
                  </div>
                  <h4 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    Deliverable: {task.deliverable}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                  <div className="flex items-center gap-2.5">
                    <CircularProgress percentage={completionPct} size={36} strokeWidth={3} />
                    <div className="text-right text-xs">
                      <span className="text-slate-400 block text-[10px]">Criteria Fulfilled</span>
                      <span className="font-mono text-slate-200 font-semibold">
                        {satisfiedCrit} / {totalCrit} ({completionPct}%)
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs hidden sm:block">
                    <span className="text-slate-400 block text-[10px]">Deadline</span>
                    <span className="font-mono text-slate-200">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-md font-mono font-medium capitalize shrink-0 ${
                      task.status === 'approved'
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800'
                        : task.status === 'changes_requested'
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-800'
                        : task.status === 'awaiting_evidence'
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800'
                        : 'bg-cyan-950/70 text-cyan-300 border border-cyan-800'
                    }`}
                  >
                    {task.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
