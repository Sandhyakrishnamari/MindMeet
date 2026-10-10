import React, { useState } from 'react';
import { Task, User } from '../types/index.ts';
import { ProofToProgressViewer } from '../components/ProofToProgressViewer.tsx';
import { EvidenceUploader } from '../components/EvidenceUploader.tsx';
import { CircularProgress } from '../components/CircularProgress.tsx';
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

interface TasksPageProps {
  tasks: Task[];
  currentUser: User | null;
  selectedTaskId: string | null;
  onSelectTask: (taskId: string | null) => void;
  taskDetailData: {
    task: Task;
    submissions: any[];
    currentSubmission: any;
    currentReport: any;
    reviews: any[];
    history: any[];
  } | null;
  onSubmitEvidence: (payload: any) => Promise<void>;
  onReviewSubmit: (decision: 'approved' | 'changes_requested', feedback: string) => Promise<void>;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  currentUser,
  selectedTaskId,
  onSelectTask,
  taskDetailData,
  onSubmitEvidence,
  onReviewSubmit,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploader, setShowUploader] = useState(false);

  const isManager = currentUser?.role === 'manager';
  const isEmployee = currentUser?.role === 'employee';

  const filteredTasks = tasks.filter((t) => {
    if (isEmployee && t.assignedToId !== currentUser?.id) {
      // show all or allow toggling
    }
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search.trim() && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // If a task is selected, show detail & Proof-to-Progress view
  if (selectedTaskId && taskDetailData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              onSelectTask(null);
              setShowUploader(false);
            }}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tasks</span>
          </button>

          {/* If employee is viewing this task, allow submitting evidence */}
          {!showUploader && (
            <button
              onClick={() => setShowUploader(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Submit Progress Evidence</span>
            </button>
          )}
        </div>

        {showUploader ? (
          <EvidenceUploader
            task={taskDetailData.task}
            employeeName={currentUser?.name || taskDetailData.task.assignedToName}
            onSubmitEvidence={async (payload) => {
              await onSubmitEvidence(payload);
              setShowUploader(false);
            }}
            onCancel={() => setShowUploader(false)}
          />
        ) : (
          <ProofToProgressViewer
            task={taskDetailData.task}
            submission={taskDetailData.currentSubmission}
            report={taskDetailData.currentReport}
            reviews={taskDetailData.reviews}
            history={taskDetailData.history}
            isManager={isManager}
            onReviewSubmit={onReviewSubmit}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
            Deliverable Accountability Ledger
          </span>
          <h2 className="text-xl font-bold text-white">Actionable Tasks & Evidence Queue</h2>
          <p className="text-xs text-slate-400">
            Every task links to a meeting agreement with explicit criteria and verified screenshot proof.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
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

      {/* Tasks List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((t) => {
          const totalCrit = t.acceptanceCriteria.length;
          const satisfiedCrit = t.acceptanceCriteria.filter((c) => c.satisfied).length;
          const completionPct = totalCrit > 0 ? Math.round((satisfiedCrit / totalCrit) * 100) : 0;

          return (
            <div
              key={t.id}
              onClick={() => onSelectTask(t.id)}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 space-y-4 cursor-pointer transition-all flex flex-col justify-between group shadow-sm hover:shadow-cyan-950/40 relative"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-cyan-400 font-semibold">{t.id}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium capitalize ${
                      t.status === 'approved'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : t.status === 'changes_requested'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : t.status === 'awaiting_evidence'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}
                  >
                    {t.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {t.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {t.deliverable}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col items-center">
                    <CircularProgress percentage={completionPct} size={42} strokeWidth={3.5} />
                    <span className="text-[9px] text-slate-500 font-mono mt-0.5">Criteria</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Assignee: <strong className="text-slate-200">{t.assignedToName}</strong></span>
                  <span className="font-mono text-slate-300">
                    {new Date(t.deadline).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono font-semibold text-slate-300">{satisfiedCrit}/{totalCrit}</span>
                    <span>Criteria Fulfilled ({completionPct}%)</span>
                  </span>
                  <span className="text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    View Proof →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
