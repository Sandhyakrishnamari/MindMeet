import React, { useState } from 'react';
import { TraceabilityChain, Task } from '../types/index.ts';
import {
  MessageSquare,
  CheckCircle,
  Briefcase,
  ListChecks,
  FileImage,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface TraceabilityGraphProps {
  tasks: Task[];
  selectedTaskId: string;
  onSelectTask: (taskId: string) => void;
  chain: TraceabilityChain | null;
  onAmendDecision?: (taskId: string, newStatement: string) => void;
}

export const TraceabilityGraph: React.FC<TraceabilityGraphProps> = ({
  tasks,
  selectedTaskId,
  onSelectTask,
  chain,
  onAmendDecision,
}) => {
  const [selectedNode, setSelectedNode] = useState<number>(0);
  const [amendModalOpen, setAmendModalOpen] = useState(false);
  const [amendText, setAmendText] = useState('');

  if (!chain) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
        Select a task to view the complete Meeting-to-Evidence Traceability graph.
      </div>
    );
  }

  const nodes = [
    {
      index: 0,
      id: 'statement',
      title: 'Meeting Statement',
      subtitle: `${chain.meeting.speaker} (${Math.round(chain.meeting.speakerConfidence * 100)}% conf)`,
      icon: MessageSquare,
      status: 'verified',
    },
    {
      index: 1,
      id: 'decision',
      title: 'Agreed Decision',
      subtitle: chain.decision.statement,
      icon: CheckCircle,
      status: 'verified',
    },
    {
      index: 2,
      id: 'task',
      title: 'Assigned Task',
      subtitle: `${chain.task.title} → ${chain.task.assignedTo}`,
      icon: Briefcase,
      status: 'verified',
    },
    {
      index: 3,
      id: 'criteria',
      title: 'Acceptance Criteria',
      subtitle: `${chain.criteria.length} explicit rules`,
      icon: ListChecks,
      status: 'verified',
    },
    {
      index: 4,
      id: 'evidence',
      title: 'Employee Evidence',
      subtitle: chain.submission ? `v${chain.submission.version} Submitted` : 'Awaiting Submission',
      icon: FileImage,
      status: chain.submission ? 'verified' : 'pending',
    },
    {
      index: 5,
      id: 'ai_findings',
      title: 'AI Verification',
      subtitle: chain.aiReport ? `${chain.aiReport.verificationConfidence}% Confirmed` : 'Pending Review',
      icon: Sparkles,
      status: chain.aiReport ? (chain.aiReport.unverifiedCriteriaIds.length === 0 ? 'verified' : 'warning') : 'pending',
    },
    {
      index: 6,
      id: 'manager_review',
      title: 'Manager Approval',
      subtitle: chain.managerReview ? chain.managerReview.decision : 'Pending Review',
      icon: ShieldCheck,
      status: chain.managerReview?.decision === 'approved' ? 'verified' : chain.managerReview ? 'warning' : 'pending',
    },
  ];

  const handleAmendSubmit = () => {
    if (!amendText.trim()) return;
    if (onAmendDecision) {
      onAmendDecision(chain.task.id, amendText);
    }
    setAmendModalOpen(false);
    setAmendText('');
  };

  return (
    <div className="space-y-6">
      {/* Task Selector & Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
            Proof-to-Progress Core Differentiator
          </span>
          <h2 className="text-lg font-bold text-white">Meeting-to-Evidence Traceability Thread</h2>
          <p className="text-xs text-slate-400">
            Unbroken cryptographic and audit link from verbal meeting discussions to verified deliverable proof.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs text-slate-400 font-medium whitespace-nowrap">
            Selected Task:
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => onSelectTask(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-500 font-medium"
          >
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.assignedToName})
              </option>
            ))}
          </select>

          <button
            onClick={() => setAmendModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            title="Simulate decision change to verify that history is preserved and manager is notified"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Amend Decision</span>
          </button>
        </div>
      </div>

      {/* Decision Amended Warning Banner if flagged */}
      {chain.task.status === 'approved' && (
        <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Complete Traceability Verified:</strong> Every meeting promise links directly to verified visual proof and manager sign-off.
            </span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400">100% Chain Integrity</span>
        </div>
      )}

      {/* Horizontal Interactive Pipeline Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 overflow-x-auto">
        <div className="min-w-[850px] flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute left-6 right-6 top-6 h-0.5 bg-slate-800 -z-0" />

          {nodes.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.index;
            const isVerified = node.status === 'verified';
            const isWarning = node.status === 'warning';

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.index)}
                className={`relative z-10 flex flex-col items-center text-center group transition-transform ${
                  isSelected ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300'
                      : isVerified
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-600/50'
                      : isWarning
                      ? 'bg-rose-950/80 text-rose-400 border border-rose-600/50'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="mt-2.5 max-w-[110px]">
                  <div
                    className={`text-xs font-bold leading-tight ${
                      isSelected ? 'text-cyan-400' : 'text-slate-200'
                    }`}
                  >
                    {node.title}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {node.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Inspection Card for Selected Node */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-cyan-400 font-bold uppercase font-mono">
              Stage 0{selectedNode + 1}
            </span>
            <span className="text-slate-500">/</span>
            <h3 className="text-sm font-bold text-white">
              {nodes[selectedNode].title} Deep-Dive
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Node status: <strong className="text-slate-200 capitalize">{nodes[selectedNode].status}</strong>
          </span>
        </div>

        {/* Node 0: Meeting Statement */}
        {selectedNode === 0 && (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">Source Meeting</span>
                <span className="font-semibold text-white">{chain.meeting.title}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">Speaker Attribution</span>
                <span className="font-semibold text-cyan-300">{chain.meeting.speaker}</span>
                <span className="text-[11px] text-slate-400 ml-1">
                  ({Math.round(chain.meeting.speakerConfidence * 100)}% attribution confidence)
                </span>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-500 block mb-1">Recorded Date</span>
                <span className="font-semibold text-slate-300">
                  {new Date(chain.meeting.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
              <span className="text-slate-400 font-semibold block mb-1">
                Verbatim Transcript Excerpt:
              </span>
              <p className="font-mono text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded border border-slate-800/60">
                "{chain.meeting.excerpt}"
              </p>
            </div>
          </div>
        )}

        {/* Node 1: Decision */}
        {selectedNode === 1 && (
          <div className="space-y-3 text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-slate-500 block">Formal Meeting Decision</span>
              <h4 className="text-sm font-bold text-cyan-300">{chain.decision.statement}</h4>
              <p className="text-slate-300">
                <strong>Business & Technical Rationale:</strong> {chain.decision.rationale}
              </p>
            </div>
            <div className="text-[11px] text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <strong>Immutable Rule:</strong> When decisions change, MeetMind AI does not overwrite the original agreement. It flags an amendment alert so that acceptance criteria can be safely re-negotiated.
            </div>
          </div>
        )}

        {/* Node 2: Task */}
        {selectedNode === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-slate-500 block">Task Assignment</span>
              <h4 className="text-sm font-bold text-white">{chain.task.title}</h4>
              <div className="text-slate-300">
                <strong>Assigned To:</strong> {chain.task.assignedTo}
              </div>
              <div className="text-slate-300">
                <strong>Priority:</strong> <span className="uppercase text-cyan-400">{chain.task.priority}</span>
              </div>
              <div className="text-slate-300">
                <strong>Deadline:</strong> {new Date(chain.task.deadline).toLocaleDateString()}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
              <span className="text-slate-500 block">Agreed Deliverable Spec</span>
              <p className="text-slate-300 leading-relaxed">{chain.task.deliverable}</p>
            </div>
          </div>
        )}

        {/* Node 3: Acceptance Criteria */}
        {selectedNode === 3 && (
          <div className="space-y-3 text-xs">
            <div className="text-slate-400 font-semibold">
              Explicit, Testable Conditions Extracted from Meeting:
            </div>
            <div className="space-y-2">
              {chain.criteria.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-cyan-400 font-semibold">{i + 1}.</span>
                    <span className="text-slate-200">{c.description}</span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">
                    {c.requiredEvidenceType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Node 4: Evidence */}
        {selectedNode === 4 && (
          <div className="space-y-4 text-xs">
            {chain.submission ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <span className="text-slate-400 font-semibold block">Submission Record</span>
                  <div>
                    <strong>Version:</strong> v{chain.submission.version}
                  </div>
                  <div>
                    <strong>Submitted:</strong> {new Date(chain.submission.submittedAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Description:</strong> "{chain.submission.description}"
                  </div>
                </div>

                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-center">
                  {chain.submission.evidencePreview ? (
                    <img
                      src={chain.submission.evidencePreview}
                      alt="Submitted evidence preview"
                      className="max-h-48 rounded object-contain"
                    />
                  ) : (
                    <span className="text-slate-500">No image preview</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500">
                Awaiting evidence submission from {chain.task.assignedTo}.
              </div>
            )}
          </div>
        )}

        {/* Node 5: AI Findings */}
        {selectedNode === 5 && (
          <div className="space-y-3 text-xs">
            {chain.aiReport ? (
              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-cyan-400">Gemini 3.8 Multimodal Verification</span>
                    <span className="font-mono text-slate-300">{chain.aiReport.verificationConfidence}% Confidence</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">{chain.aiReport.summaryExplanation}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-lg text-emerald-300">
                    <strong className="block mb-1">Satisfied Criteria ({chain.aiReport.satisfiedCriteriaIds.length}):</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                      {chain.aiReport.satisfiedCriteriaIds.map((id) => {
                        const crit = chain.criteria.find((c) => c.id === id);
                        return <li key={id}>{crit?.description || id}</li>;
                      })}
                    </ul>
                  </div>

                  <div className="bg-rose-950/20 border border-rose-800/40 p-3 rounded-lg text-rose-300">
                    <strong className="block mb-1">Requirement Gaps / Unverified ({chain.aiReport.unverifiedCriteriaIds.length}):</strong>
                    {chain.aiReport.unverifiedCriteriaIds.length === 0 ? (
                      <span className="text-[11px] text-slate-400">All requirements verified!</span>
                    ) : (
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {chain.aiReport.unverifiedCriteriaIds.map((id) => {
                          const crit = chain.criteria.find((c) => c.id === id);
                          return <li key={id}>{crit?.description || id}</li>;
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500">
                AI verification has not run for this task yet.
              </div>
            )}
          </div>
        )}

        {/* Node 6: Manager Review */}
        {selectedNode === 6 && (
          <div className="space-y-3 text-xs">
            {chain.managerReview ? (
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Reviewer: {chain.managerReview.managerName}</span>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                      chain.managerReview.decision === 'approved'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {chain.managerReview.decision}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed italic">
                  "{chain.managerReview.feedbackText}"
                </p>
                <div className="text-[11px] text-slate-500">
                  Signed at: {new Date(chain.managerReview.reviewedAt).toLocaleString()}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500">
                Awaiting final human manager evaluation.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decision Amendment Modal */}
      {amendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Amend Meeting Decision</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Demonstrates MeetMind AI's traceability safeguard: when an agreed decision changes, the original meeting record
              is never erased. Instead, a revision notification is issued to the manager and logged in the audit trail.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Security audit added requirement: Password must support WebAuthn passkey option."
              value={amendText}
              onChange={(e) => setAmendText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAmendModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAmendSubmit}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg"
              >
                Publish Amendment Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
