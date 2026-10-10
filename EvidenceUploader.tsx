import React, { useState } from 'react';
import { Task } from '../types/index.ts';
import { Upload, FileImage, ShieldCheck, Check, AlertCircle, Sparkles } from 'lucide-react';
import { IdentityVerificationModal } from './IdentityVerificationModal.tsx';

interface EvidenceUploaderProps {
  task: Task;
  employeeName: string;
  onSubmitEvidence: (payload: {
    taskId: string;
    progressDescription: string;
    files: Array<{ name: string; sizeBytes: number; mimeType: string; dataUrl: string }>;
    identityVerification: any;
  }) => Promise<void>;
  onCancel?: () => void;
}

// Sample SVG screenshots for fast demo testing
const SAMPLE_MOCK_V1_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0B0F17"/>
  <rect x="30" y="30" width="740" height="440" rx="12" fill="#111827" stroke="#1E293B" stroke-width="2"/>
  <rect x="30" y="30" width="740" height="40" rx="12" fill="#1E293B"/>
  <text x="60" y="55" fill="#94A3B8" font-family="monospace" font-size="12">https://auth.internal/login (v1 Resting State)</text>
  <rect x="250" y="110" width="300" height="320" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
  <text x="280" y="150" fill="#F8FAFC" font-family="system-ui" font-weight="bold" font-size="18">Sign in</text>
  <text x="280" y="190" fill="#94A3B8" font-family="system-ui" font-size="12">Email</text>
  <rect x="280" y="200" width="240" height="34" rx="4" fill="#1E293B"/>
  <text x="280" y="260" fill="#94A3B8" font-family="system-ui" font-size="12">Password</text>
  <rect x="280" y="270" width="240" height="34" rx="4" fill="#1E293B"/>
  <rect x="280" y="330" width="240" height="36" rx="6" fill="#06B6D4"/>
  <text x="375" y="352" fill="#042F2E" font-family="system-ui" font-weight="bold" font-size="13">Sign In</text>
</svg>
`)}`;

const SAMPLE_MOCK_V2_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="#0B0F17"/>
  <rect x="30" y="30" width="740" height="440" rx="12" fill="#111827" stroke="#1E293B" stroke-width="2"/>
  <rect x="30" y="30" width="740" height="40" rx="12" fill="#1E293B"/>
  <text x="60" y="55" fill="#94A3B8" font-family="monospace" font-size="12">https://auth.internal/login?error=invalid_credentials (v2 Error Banner Active)</text>
  <rect x="240" y="90" width="320" height="360" rx="10" fill="#0F172A" stroke="#334155" stroke-width="1"/>
  <text x="270" y="125" fill="#F8FAFC" font-family="system-ui" font-weight="bold" font-size="18">Sign in</text>
  <rect x="270" y="140" width="260" height="30" rx="4" fill="#450A0A" stroke="#EF4444" stroke-width="1"/>
  <text x="280" y="160" fill="#FCA5A5" font-family="system-ui" font-size="11" font-weight="bold">⚠ Invalid email or password.</text>
  <text x="270" y="195" fill="#94A3B8" font-family="system-ui" font-size="12">Email</text>
  <rect x="270" y="205" width="260" height="32" rx="4" fill="#1E293B" stroke="#06B6D4"/>
  <text x="270" y="255" fill="#94A3B8" font-family="system-ui" font-size="12">Password</text>
  <rect x="270" y="265" width="260" height="32" rx="4" fill="#1E293B" stroke="#EF4444"/>
  <text x="270" y="310" fill="#F87171" font-family="system-ui" font-size="10">Password cannot be blank (Validation active)</text>
  <rect x="270" y="325" width="260" height="36" rx="6" fill="#06B6D4"/>
  <text x="370" y="348" fill="#042F2E" font-family="system-ui" font-weight="bold" font-size="13">Sign In</text>
  <text x="270" y="380" fill="#10B981" font-family="system-ui" font-size="10">✓ Dashboard redirect configured: /dashboard</text>
</svg>
`)}`;

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({
  task,
  employeeName,
  onSubmitEvidence,
  onCancel,
}) => {
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<Array<{ name: string; sizeBytes: number; mimeType: string; dataUrl: string }>>([]);
  const [identityVerifiedData, setIdentityVerifiedData] = useState<any | null>(null);
  const [identityModalOpen, setIdentityModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    if (file.size > 15 * 1024 * 1024) {
      alert('File size exceeds 15MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFiles([
        {
          name: file.name,
          sizeBytes: file.size,
          mimeType: file.type || 'image/png',
          dataUrl,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // Preset sample selectors
  const loadMockV1 = () => {
    setFiles([
      {
        name: 'login_resting_state_v1.svg',
        sizeBytes: 15400,
        mimeType: 'image/svg+xml',
        dataUrl: SAMPLE_MOCK_V1_SVG,
      },
    ]);
    setDescription('Initial deliverable draft: Basic form inputs and styling.');
  };

  const loadMockV2 = () => {
    setFiles([
      {
        name: 'login_error_and_validation_v2.svg',
        sizeBytes: 19800,
        mimeType: 'image/svg+xml',
        dataUrl: SAMPLE_MOCK_V2_SVG,
      },
    ]);
    setDescription('Revised deliverable addressing meeting feedback: Added red error banner and client validation.');
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert('Please upload a screenshot or select a demo sample to provide evidence.');
      return;
    }
    if (!description.trim()) {
      alert('Please enter a brief progress description.');
      return;
    }
    if (!identityVerifiedData) {
      setIdentityModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitEvidence({
        taskId: task.id,
        progressDescription: description,
        files,
        identityVerification: identityVerifiedData,
      });
    } catch (err: any) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-cyan-400" />
          <span>Submit Task Evidence for Proof-to-Progress AI Review</span>
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Upload screenshots or documents that demonstrate satisfaction of the agreed acceptance criteria.
        </p>
      </div>

      {/* Target Acceptance Criteria checklist reminder */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
        <span className="text-xs font-semibold text-slate-300 block">
          Required Deliverable Acceptance Criteria ({task.acceptanceCriteria.length} items):
        </span>
        <div className="space-y-1.5">
          {task.acceptanceCriteria.map((c, i) => (
            <div key={c.id} className="text-xs text-slate-400 flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-medium">{i + 1}.</span>
              <span>{c.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Quick-Load Buttons */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-400">Quick Test Samples:</span>
        <button
          type="button"
          onClick={loadMockV1}
          className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 hover:border-slate-500 text-slate-300 transition-colors"
        >
          Load Draft Evidence (Missing Error Banner)
        </button>
        <button
          type="button"
          onClick={loadMockV2}
          className="text-xs px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-700 hover:border-cyan-500 text-cyan-300 transition-colors font-medium"
        >
          Load Complete Evidence (All Criteria Met)
        </button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 text-center transition-colors bg-slate-950/40 relative">
        <input
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FileImage className="w-8 h-8 text-cyan-400" />
          <div className="text-xs font-semibold text-slate-200">
            Drag & drop your screenshot or document here, or browse files
          </div>
          <div className="text-[11px] text-slate-500">
            Supports PNG, JPG, SVG, PDF up to 15MB
          </div>
        </div>
      </div>

      {/* Uploaded File Preview */}
      {files.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileImage className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-xs font-semibold text-slate-200">{files[0].name}</div>
              <div className="text-[10px] text-slate-500 font-mono">
                {(files[0].sizeBytes / 1024).toFixed(1)} KB · {files[0].mimeType}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFiles([])}
            className="text-xs text-rose-400 hover:text-rose-300"
          >
            Remove
          </button>
        </div>
      )}

      {/* Progress Description Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Progress Notes & Implementation Summary:
        </label>
        <textarea
          rows={3}
          placeholder="Describe how your implementation fulfills the agreed meeting deliverable..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Identity Verification Step */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Employee Identity Verification</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {identityVerifiedData
              ? `Verified via ${identityVerifiedData.method} at ${new Date(
                  identityVerifiedData.timestamp
                ).toLocaleTimeString()}`
              : 'Consent-based snapshot or authentication token verification required before submit.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIdentityModalOpen(true)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            identityVerifiedData
              ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
              : 'bg-cyan-950/60 border-cyan-600/50 text-cyan-300 hover:bg-cyan-900/60'
          }`}
        >
          {identityVerifiedData ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Identity Verified</span>
            </>
          ) : (
            <span>Verify Identity</span>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={isSubmitting || files.length === 0}
          onClick={handleSubmit}
          className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-950/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{isSubmitting ? 'Analyzing with Gemini...' : 'Submit Evidence & Run AI Verification'}</span>
        </button>
      </div>

      {/* Identity Verification Modal */}
      <IdentityVerificationModal
        isOpen={identityModalOpen}
        onClose={() => setIdentityModalOpen(false)}
        onVerified={(data) => setIdentityVerifiedData(data)}
        employeeName={employeeName}
      />
    </div>
  );
};
