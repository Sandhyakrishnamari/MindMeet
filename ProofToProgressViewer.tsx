import React, { useState } from 'react';
import {
  Task,
  EvidenceSubmission,
  AIVerificationReport,
  ManagerReview,
  TaskHistoryEvent,
} from '../types/index.ts';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldAlert,
  FileCheck,
  Send,
  Eye,
  Info,
  Calendar,
  User,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { CircularProgress } from './CircularProgress.tsx';

interface ProofToProgressViewerProps {
  task: Task;
  submission: EvidenceSubmission | null;
  report: AIVerificationReport | null;
  reviews: ManagerReview[];
  history: TaskHistoryEvent[];
  isManager: boolean;
  onReviewSubmit?: (decision: 'approved' | 'changes_requested', feedback: string) => void;
  onSelectSubmission?: (submissionId: string) => void;
}

export const ProofToProgressViewer: React.FC<ProofToProgressViewerProps> = ({
  task,
  submission,
  report,
  reviews,
  history,
  isManager,
  onReviewSubmit,
}) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState<'evidence' | 'history' | 'traceability_preview'>('evidence');

  const handleReview = async (decision: 'approved' | 'changes_requested') => {
    if (!feedbackText.trim()) {
      alert('Please provide review notes / feedback to accompany your decision.');
      return;
    }
    setSubmittingReview(true);
    if (onReviewSubmit) {
      await onReviewSubmit(decision, feedbackText);
    }
    setSubmittingReview(false);
  };

  const primaryFile = submission?.files?.[0];
  const totalCrit = task.acceptanceCriteria.length;
  const satisfiedCrit = task.acceptanceCriteria.filter((c) => c.satisfied).length;
  const completionPct = totalCrit > 0 ? Math.round((satisfiedCrit / totalCrit) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Task & Meeting Context Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mb-1">
              <span>Task ID: <strong className="text-slate-200 font-mono">{task.id}</strong></span>
              <span>·</span>
              <span>Meeting: <strong className="text-cyan-400">{task.meetingTitle}</strong></span>
              <span>·</span>
              <span>Assignee: <strong className="text-slate-200">{task.assignedToName}</strong></span>
            </div>
            <h2 className="text-xl font-bold text-white">{task.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <CircularProgress percentage={completionPct} size={42} strokeWidth={3.5} />
              <div className="text-right text-xs">
                <span className="text-slate-400 block text-[10px]">Criteria Fulfilled</span>
                <span className="font-mono text-slate-200 font-semibold">
                  {satisfiedCrit} / {totalCrit} ({completionPct}%)
                </span>
              </div>
            </div>

            <div className="text-right pl-2 border-l border-slate-800">
              <div className="text-xs text-slate-400">Current Status</div>
              <div className="text-sm font-semibold text-cyan-300 capitalize">
                {task.status.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
        </div>

        {/* Discussion Excerpt & Deliverable Requirement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <span className="font-semibold text-slate-300 block mb-1">Original Meeting Discussion Excerpt:</span>
            <p className="text-slate-400 italic font-mono leading-relaxed">
              "{task.discussionExcerpt}"
            </p>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
            <span className="font-semibold text-slate-300 block mb-1">Expected Deliverable:</span>
            <p className="text-slate-300 leading-relaxed">
              {task.deliverable}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'evidence'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Proof-to-Progress AI Verification
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-cyan-400 text-cyan-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Continuous Task Timeline ({history.length} events)
        </button>
      </div>

      {/* Evidence & AI Findings View */}
      {activeTab === 'evidence' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Submitted Artifact / Screenshot Preview */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-cyan-400" />
                  <span>Submitted Evidence Artifact (v{submission?.versionNumber || 1})</span>
                </h3>
                {submission && (
                  <span className="text-xs text-slate-400">
                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {submission?.progressDescription && (
                <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs text-slate-300">
                  <strong className="text-slate-400 block mb-0.5">Employee Progress Notes:</strong>
                  "{submission.progressDescription}"
                </div>
              )}

              {/* Artifact Viewer Frame */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden min-h-[340px] flex items-center justify-center p-2">
                {primaryFile?.dataUrl ? (
                  <div className="w-full">
                    <img
                      src={primaryFile.dataUrl}
                      alt={primaryFile.name || 'Submitted Evidence'}
                      className="w-full h-auto rounded-lg object-contain max-h-[460px] border border-slate-800"
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>{primaryFile.name}</span>
                      <span>Identity: Verified ({submission?.identityVerification.method})</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 text-slate-500 text-xs">
                    No evidence screenshot submitted yet.
                  </div>
                )}
              </div>

              {/* Identity Verification Indicator */}
              {submission?.identityVerification && (
                <div className="bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Identity Verified at submission ({submission.identityVerification.method})</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(submission.identityVerification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Multimodal Criteria-by-Criteria Analysis */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>AI Proof-to-Progress Findings</span>
                  </h3>
                  <div className="text-xs text-slate-400">
                    Model: <span className="font-mono text-slate-300">{report?.modelUsed || 'gemini-3.8-flash'}</span>
                  </div>
                </div>

                {report && (
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Verification Confidence</div>
                    <div className="text-lg font-bold text-cyan-400 tabular-nums">
                      {report.verificationConfidence}%
                    </div>
                  </div>
                )}
              </div>

              {/* Summary Statement */}
              {report && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
                  <strong className="text-cyan-400 block mb-1">AI Summary & Recommendation:</strong>
                  {report.summaryExplanation}
                  <div className="mt-2 text-[11px] font-semibold text-slate-400">
                    Recommended Action: <span className="text-cyan-300 uppercase">{report.recommendedAction.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              )}

              {/* Criteria Satisfaction List */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Acceptance Criteria Assessment:
                </div>

                {task.acceptanceCriteria.map((criterion, idx) => {
                  const result = report?.criteriaResults?.find((r) => r.criterionId === criterion.id);
                  const isSatisfied = result ? result.satisfied : criterion.satisfied;

                  return (
                    <div
                      key={criterion.id}
                      className={`p-3 rounded-lg border text-xs transition-colors ${
                        isSatisfied
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-rose-950/20 border-rose-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          {isSatisfied ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-medium text-slate-200">
                              {idx + 1}. {criterion.description}
                            </span>
                            {result?.evidenceFound && (
                              <p className="text-[11px] text-slate-400 mt-1">
                                <strong>Evidence Found:</strong> {result.evidenceFound}
                              </p>
                            )}
                            {result?.explanation && (
                              <p className="text-[11px] text-slate-400">
                                <strong>Explanation:</strong> {result.explanation}
                              </p>
                            )}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium shrink-0 ${
                            isSatisfied
                              ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40'
                              : 'bg-rose-900/40 text-rose-300 border border-rose-700/40'
                          }`}
                        >
                          {isSatisfied ? 'Satisfied' : 'Unverified'}
                        </span>
                      </div>

                      {result?.isFunctionalTestRequired && (
                        <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>Functional requirement: Screenshot confirms visual presence; automated test logs recommended.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quality Warnings or Additional Evidence Required */}
              {report?.additionalEvidenceRequired && report.additionalEvidenceRequired.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Additional Evidence Required:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1">
                    {report.additionalEvidenceRequired.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Legal & AI Limitations Disclaimer */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-500 leading-relaxed">
                <strong>Proof-to-Progress Disclosure:</strong> A screenshot is visual evidence, not definitive proof
                that software works or that backend services are fully functional. The human manager retains sole authority
                over deliverable approval.
              </div>

              {/* Manager Review Action Card */}
              {isManager && (
                <div className="bg-slate-950 border border-cyan-800/50 rounded-xl p-4 space-y-3 mt-4">
                  <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                    Manager Review & Accountability Sign-Off
                  </h4>

                  <textarea
                    rows={3}
                    placeholder="Enter review notes and feedback for the employee..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />

                  <div className="flex items-center justify-end gap-3 pt-1">
                    <button
                      type="button"
                      disabled={submittingReview}
                      onClick={() => handleReview('changes_requested')}
                      className="px-4 py-2 text-xs font-semibold text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      type="button"
                      disabled={submittingReview}
                      onClick={() => handleReview('approved')}
                      className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Deliverable</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Past Manager Reviews Log */}
              {reviews.length > 0 && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-400">Review History:</div>
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-300">{rev.managerName}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                            rev.decision === 'approved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {rev.decision.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px]">"{rev.feedbackText}"</p>
                      <div className="text-[10px] text-slate-500">
                        {new Date(rev.reviewedAt).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Timeline */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-6">Continuous Task Audit Timeline</h3>
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {history.map((event, idx) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center" />
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{event.title}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-cyan-400 font-medium text-[11px]">
                    By: {event.actorName} ({event.actorRole})
                  </div>
                  <p className="text-slate-300 leading-relaxed pt-1">{event.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
