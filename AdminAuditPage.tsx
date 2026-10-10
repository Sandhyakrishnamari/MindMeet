import React, { useEffect, useState } from 'react';
import { AuditLogEntry, IntegrationAdapter, User } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Shield,
  Key,
  Users,
  Database,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Sliders,
  Check,
} from 'lucide-react';

interface AdminAuditPageProps {
  users: User[];
  hasGeminiKey: boolean;
}

export const AdminAuditPage: React.FC<AdminAuditPageProps> = ({ users, hasGeminiKey }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [integrations, setIntegrations] = useState<IntegrationAdapter[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [retentionDays, setRetentionDays] = useState<number>(90);
  const [redactionActive, setRedactionActive] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [logsRes, integRes] = await Promise.all([
        api.getAuditLogs(),
        api.getIntegrations(),
      ]);
      setLogs(logsRes.logs || []);
      setIntegrations(integRes.integrations || []);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await api.syncIntegration(id);
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? res.integration : i))
      );
      loadData(); // refresh audit logs
    } catch (err: any) {
      alert(`Sync failed: ${err.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
            Enterprise Governance & Security
          </span>
          <h2 className="text-xl font-bold text-white">System Administration, Audit Logs & Privacy</h2>
          <p className="text-xs text-slate-400">
            Immutable audit logging, role-based access management, AI model status, and integration adapters.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Trail</span>
        </button>
      </div>

      {/* System Health & AI Provider Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">AI Intelligence Model</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
                hasGeminiKey
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {hasGeminiKey ? 'Gemini 3.8 Live' : 'Deterministic Mode'}
            </span>
          </div>
          <div className="text-base font-bold text-white">gemini-3.8-flash</div>
          <p className="text-[11px] text-slate-400">
            {hasGeminiKey
              ? 'Server-side @google/genai SDK configured with User-Agent telemetry.'
              : 'Add GEMINI_API_KEY to AI Studio Secrets for live multimodal inference.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Evidence Storage</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              Encrypted Private
            </span>
          </div>
          <div className="text-base font-bold text-white">AES-256 GCM Rest</div>
          <p className="text-[11px] text-slate-400">
            Role-gated downloads. Employees cannot view other employees' unshared draft evidence.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Biometric Privacy Guard</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
              Zero Retention
            </span>
          </div>
          <div className="text-base font-bold text-white">Ephemeral Matching</div>
          <p className="text-[11px] text-slate-400">
            No raw face templates saved. No continuous monitoring. No emotion inference.
          </p>
        </div>
      </div>

      {/* External Integration Adapters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Project Management & Calendar Adapters</h3>
            <p className="text-xs text-slate-400">
              Export verified action items to Jira, Trello, and Google Calendar. Clearly labeled in demo mode.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {integrations.map((adapter) => (
            <div
              key={adapter.id}
              className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{adapter.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-mono border border-slate-700">
                  Demo Mode
                </span>
              </div>

              <p className="text-slate-400 text-[11px]">
                Syncs approved deliverables and creates linked tickets with meeting context.
              </p>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 text-[10px]">
                  {adapter.lastSyncedAt
                    ? `Synced ${new Date(adapter.lastSyncedAt).toLocaleTimeString()}`
                    : 'Not synced yet'}
                </span>

                <button
                  onClick={() => handleSync(adapter.id)}
                  disabled={syncingId === adapter.id}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {syncingId === adapter.id ? 'Exporting...' : 'Export Approved'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy, Retention & Prompt Injection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Data Retention & Automatic Purge Policies</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Evidence Artifact Retention Window:
              </label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
              >
                <option value={30}>30 Days (Strict SOC-2 Minimal)</option>
                <option value={90}>90 Days (Recommended Enterprise Standard)</option>
                <option value={180}>180 Days (Extended Regulatory Audit)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-300">Automatic PII & Credential Masking in Transcripts</span>
              <button
                type="button"
                onClick={() => setRedactionActive(!redactionActive)}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  redactionActive ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    redactionActive ? 'right-0.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Prompt Injection Defense & Input Sanitization</span>
          </h3>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            MeetMind AI sanitizes uploaded meeting documents, pasted transcripts, and screenshot metadata
            to prevent adversarial prompt injections (e.g., hidden instructions attempting to force false approvals).
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 space-y-1">
            <div className="text-emerald-400 font-semibold">Active Protections:</div>
            <div>· Delimiter encapsulation on all system-to-model boundaries</div>
            <div>· Human manager final sign-off is always required (no autonomous approvals)</div>
            <div>· Explicit rejection of administrative overrides inside user content</div>
          </div>
        </div>
      </div>

      {/* Immutable Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Security & Accountability Audit Ledger</h3>
            <p className="text-xs text-slate-400">
              Tamper-evident record of all meeting analyses, identity confirmations, and manager review decisions.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{logs.length} logged events</span>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 text-xs flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="font-mono text-cyan-400 font-semibold text-[11px]">{log.action}</span>
                  <span>·</span>
                  <span className="text-slate-300">{log.actorEmail}</span>
                  <span>·</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.ipAddress}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{log.details}</p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                    log.status === 'success'
                      ? 'bg-emerald-950 text-emerald-400'
                      : log.status === 'warning'
                      ? 'bg-amber-950 text-amber-400'
                      : 'bg-rose-950 text-rose-400'
                  }`}
                >
                  {log.status}
                </span>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
