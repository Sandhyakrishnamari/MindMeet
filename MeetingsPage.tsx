import React, { useState } from 'react';
import { Meeting, Task } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  FileText,
  Sparkles,
  CheckCircle,
  Plus,
  AlertTriangle,
  Send,
  Users,
  Calendar,
  Layers,
  Edit3,
  Trash2,
} from 'lucide-react';

interface MeetingsPageProps {
  meetings: Meeting[];
  onMeetingCreated: () => void;
  onTasksPublished: () => void;
  isManager: boolean;
}

// Preset realistic transcripts for fast testing
const SAMPLE_TEMPLATES = [
  {
    name: 'Sprint 44: Auth & Login Deliverable (Priya & Marcus)',
    title: 'Sprint 44 Architecture Sync & Auth Deliverables',
    transcript: `Marcus Vance: Let's kick off Sprint 44 sync. Our top priority is closing the security audit gap for the client login experience before client pilot next month.
Priya Sharma: I reviewed the initial wireframes. The backend token endpoints are ready, but we need the frontend form finalized with proper error feedback.
Marcus Vance: Exactly. Priya, can you take full ownership of the user login page? We agreed on specific acceptance criteria: email and password inputs, responsive layout, client-side empty-field validation before network dispatch, and when bad credentials return from the API, an explicit red banner must appear rather than a silent failure.
Priya Sharma: Understood. I will also make sure the password field supports masking/unmasking and that successful auth flows cleanly into the dashboard redirect.
Marcus Vance: Excellent. Let's make sure the deliverable is backed by screenshot proof demonstrating the form and the invalid error state. Alex, you'll be handling the session token refresh adapter on the backend.
Alex Chen: Yes, I'm working on the 15-minute sliding refresh window with Redis blacklisting.
Marcus Vance: Perfect. Priya, your deadline is Thursday October 15th. We'll do the Proof-to-Progress review once your screenshots are uploaded.`,
  },
  {
    name: 'Checkout Flow Redesign & Payment Gateway',
    title: 'Checkout Modernization & Stripe Webhook Sync',
    transcript: `Marcus Vance: We have high cart drop-off at the payment step. We need a frictionless checkout sheet.
Alex Chen: Stripe Payment Element supports 1-click Apple Pay and Google Pay out of the box.
Marcus Vance: Priya, can you build the responsive checkout modal component? Acceptance criteria: Card number formatting, real-time postal code validation, CVV tooltip helper, and disabled submit button while payment intent processes.
Priya Sharma: Yes, I can take that. Deliverable will be the styled checkout modal with visual validation states. Deadline next Friday October 23rd.
Marcus Vance: Confirmed. Submit screenshot evidence of the active and processing states for review.`,
  },
];

export const MeetingsPage: React.FC<MeetingsPageProps> = ({
  meetings,
  onMeetingCreated,
  onTasksPublished,
  isManager,
}) => {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || '');
  const [showNewMeetingModal, setShowNewMeetingModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTranscript, setNewTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedTasks, setExtractedTasks] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const currentMeeting = meetings.find((m) => m.id === selectedMeetingId) || meetings[0];

  const handleCreateMeeting = async () => {
    if (!newTitle.trim() || !newTranscript.trim()) {
      alert('Please provide meeting title and transcript text.');
      return;
    }

    try {
      const res = await api.createMeeting({
        title: newTitle,
        rawTranscript: newTranscript,
      });
      setShowNewMeetingModal(false);
      setNewTitle('');
      setNewTranscript('');
      onMeetingCreated();
      setSelectedMeetingId(res.meeting.id);
    } catch (err: any) {
      alert(`Failed to save meeting: ${err.message}`);
    }
  };

  const handleRunAIAnalysis = async () => {
    if (!currentMeeting) return;
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeMeeting(currentMeeting.id);
      setExtractedTasks(res.extractedTasks || []);
      onMeetingCreated(); // refresh meeting data
    } catch (err: any) {
      alert(`AI Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePublishTasks = async () => {
    if (!currentMeeting || extractedTasks.length === 0) return;
    setIsPublishing(true);
    try {
      await api.confirmMeetingTasks(currentMeeting.id, extractedTasks);
      setExtractedTasks([]);
      onTasksPublished();
      alert('Extracted tasks successfully confirmed and published to employee queues!');
    } catch (err: any) {
      alert(`Failed to publish tasks: ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Allow manager to edit candidate task before publishing
  const updateCandidateTask = (index: number, field: string, value: any) => {
    const updated = [...extractedTasks];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedTasks(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
            Meeting Intelligence Engine
          </span>
          <h2 className="text-xl font-bold text-white">Transcript Processing & Task Extraction</h2>
          <p className="text-xs text-slate-400">
            Extract meeting decisions, speaker attribution with uncertainty confidence, and actionable tasks with explicit acceptance criteria.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isManager && (
            <button
              onClick={() => setShowNewMeetingModal(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950"
            >
              <Plus className="w-4 h-4" />
              <span>Import Transcript</span>
            </button>
          )}
        </div>
      </div>

      {/* Meeting Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {meetings.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setSelectedMeetingId(m.id);
              setExtractedTasks([]);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
              currentMeeting?.id === m.id
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {m.title}
          </button>
        ))}
      </div>

      {currentMeeting && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Transcript & Speaker Attribution */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>Meeting Transcript & Audio Logs</span>
                  </h3>
                  <div className="text-xs text-slate-400">
                    Recorded {new Date(currentMeeting.date).toLocaleDateString()} · {currentMeeting.durationMinutes} mins
                  </div>
                </div>

                <button
                  disabled={isAnalyzing}
                  onClick={handleRunAIAnalysis}
                  className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAnalyzing ? 'Analyzing with Gemini...' : 'Analyze with Gemini'}</span>
                </button>
              </div>

              {/* Raw Transcript Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 max-h-72 overflow-y-auto">
                <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {currentMeeting.rawTranscript}
                </pre>
              </div>

              {/* Speaker Attribution Table */}
              {currentMeeting.speakerStatements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Speaker-Attributed Statements (With Confidence):</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      Anti-hallucination: Never assigns without proof
                    </span>
                  </div>

                  <div className="space-y-2">
                    {currentMeeting.speakerStatements.map((stmt) => (
                      <div
                        key={stmt.id}
                        className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-300">{stmt.speakerName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ({Math.round(stmt.confidence * 100)}% confidence)
                            </span>
                          </div>
                          <p className="text-slate-300 italic font-mono text-[11px]">
                            "{stmt.text}"
                          </p>
                        </div>

                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase font-semibold shrink-0 ${
                            stmt.uncertaintyLabel === 'confirmed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {stmt.uncertaintyLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Summary, Decisions, and Extracted Tasks */}
          <div className="lg:col-span-5 space-y-5">
            {/* AI Summary & Decisions */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Executive Summary & Key Decisions</span>
              </h3>

              {currentMeeting.summary ? (
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-300 leading-relaxed">
                    <strong className="text-cyan-400 block mb-1">Meeting Summary:</strong>
                    {currentMeeting.summary}
                  </div>

                  <div>
                    <span className="font-bold text-slate-300 block mb-1.5">Formal Decisions:</span>
                    <div className="space-y-1.5">
                      {currentMeeting.decisions.map((d) => (
                        <div
                          key={d.id}
                          className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-xs space-y-0.5"
                        >
                          <div className="font-semibold text-emerald-400">{d.statement}</div>
                          <div className="text-[11px] text-slate-400">
                            <strong>Rationale:</strong> {d.rationale}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {currentMeeting.dependenciesAndRisks.length > 0 && (
                    <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-lg text-amber-300">
                      <strong className="block mb-1">Identified Dependencies & Risks:</strong>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                        {currentMeeting.dependenciesAndRisks.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 text-slate-500 text-xs">
                  Click "Analyze with Gemini" to extract decisions, speaker statements, and actionable criteria.
                </div>
              )}
            </div>

            {/* Extracted Tasks Confirmation Editor (Manager can review before publishing) */}
            {extractedTasks.length > 0 && isManager && (
              <div className="bg-slate-900 border border-cyan-800/60 rounded-xl p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-sm font-bold text-cyan-300">
                      Extracted Action Items ({extractedTasks.length})
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Review, edit owner, deadline, and explicit criteria before publishing.
                    </p>
                  </div>

                  <button
                    disabled={isPublishing}
                    onClick={handlePublishTasks}
                    className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md"
                  >
                    {isPublishing ? 'Publishing...' : 'Confirm & Publish Tasks'}
                  </button>
                </div>

                <div className="space-y-3">
                  {extractedTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2 text-xs"
                    >
                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold">Task Title:</label>
                        <input
                          type="text"
                          value={task.title}
                          onChange={(e) => updateCandidateTask(idx, 'title', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Assignee:</label>
                          <input
                            type="text"
                            value={task.assignedToName}
                            onChange={(e) => updateCandidateTask(idx, 'assignedToName', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold">Deadline:</label>
                          <input
                            type="text"
                            value={task.deadline}
                            onChange={(e) => updateCandidateTask(idx, 'deadline', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-semibold">
                          Acceptance Criteria ({task.acceptanceCriteria?.length || 0}):
                        </label>
                        <div className="space-y-1 mt-1">
                          {(task.acceptanceCriteria || []).map((crit: any, cIdx: number) => (
                            <div key={cIdx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                              <span className="text-cyan-400 font-mono">{cIdx + 1}.</span>
                              <span>{typeof crit === 'string' ? crit : crit.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Meeting Modal */}
      {showNewMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Import Meeting Transcript or Notes</span>
            </h3>

            {/* Template Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-400">Load Template:</span>
              {SAMPLE_TEMPLATES.map((tmpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setNewTitle(tmpl.title);
                    setNewTranscript(tmpl.transcript);
                  }}
                  className="text-xs px-2.5 py-1 rounded bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300"
                >
                  {tmpl.name}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Meeting Title / Strategic Topic:
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 Security Sprint Planning"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Raw Transcript / Notes:
              </label>
              <textarea
                rows={10}
                placeholder="Paste transcript with speaker labels (e.g. Marcus: ... Priya: ...)"
                value={newTranscript}
                onChange={(e) => setNewTranscript(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 font-mono text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewMeetingModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateMeeting}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg"
              >
                Save & Prepare for AI Extraction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
