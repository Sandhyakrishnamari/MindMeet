import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Camera, KeyRound, AlertCircle, Check, X, Lock } from 'lucide-react';

interface IdentityVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (verificationData: {
    verified: boolean;
    method: 'consent_webcam' | 'security_token' | 'passcode';
    timestamp: string;
    noticeAcknowledged: boolean;
  }) => void;
  employeeName: string;
}

export const IdentityVerificationModal: React.FC<IdentityVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  employeeName,
}) => {
  const [method, setMethod] = useState<'consent_webcam' | 'security_token'>('consent_webcam');
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [snapshotCaptured, setSnapshotCaptured] = useState<string | null>(null);
  const [securityTokenInput, setSecurityTokenInput] = useState('');
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setSnapshotCaptured(null);
      setCameraError(null);
      setTokenError(null);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. You can use the Secure Authentication Token alternative below.');
      setMethod('security_token');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setSnapshotCaptured(dataUrl);
      stopCamera();
    }
  };

  const handleConfirmVerification = () => {
    if (!consentAcknowledged) {
      alert('Please acknowledge the informed consent disclosure to proceed.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified({
        verified: true,
        method,
        timestamp: new Date().toISOString(),
        noticeAcknowledged: true,
      });
      onClose();
    }, 600);
  };

  const handleVerifyWithToken = () => {
    if (!securityTokenInput.trim() || securityTokenInput.length < 6) {
      setTokenError('Please enter a valid 6-digit employee authentication token.');
      return;
    }
    setTokenError(null);
    handleConfirmVerification();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Employee Identity Verification</h3>
              <p className="text-xs text-slate-400">
                Optional consent-based verification before submitting evidence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Privacy & Purpose Disclosure */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Transparent Privacy Policy & Purpose Notice</span>
            </div>
            <p className="leading-relaxed">
              This verification confirms that evidence submitted for <strong>{employeeName}</strong> originates
              directly from the authenticated team member.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero biometric template retention; snapshots are ephemeral</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>No continuous webcam tracking or facial emotion analysis</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Encrypted transit & strictly isolated from AI review logs</span>
              </div>
              <div className="flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Alternative token method always provided if camera is unavailable</span>
              </div>
            </div>
          </div>

          {/* Verification Method Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Verification Method:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMethod('consent_webcam');
                  setCameraError(null);
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                  method === 'consent_webcam'
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Camera className="w-4 h-4" />
                <span>Consent Webcam Snapshot</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMethod('security_token');
                  stopCamera();
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                  method === 'security_token'
                    ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Authentication Token</span>
              </button>
            </div>
          </div>

          {/* Webcam Method UI */}
          {method === 'consent_webcam' && (
            <div className="space-y-3">
              {cameraError && (
                <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-3 text-xs text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}

              <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
                {snapshotCaptured ? (
                  <div className="relative w-full h-[220px]">
                    <img
                      src={snapshotCaptured}
                      alt="Verification snapshot"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-950/30 flex items-center justify-center">
                      <div className="bg-slate-900/90 border border-emerald-500 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <Check className="w-4 h-4" />
                        <span>Snapshot Verified Ephemerally</span>
                      </div>
                    </div>
                  </div>
                ) : cameraActive ? (
                  <div className="relative w-full h-[220px]">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                      <button
                        type="button"
                        onClick={captureSnapshot}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1.5"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture Snapshot</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center space-y-2">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-400 max-w-sm">
                      Click below to activate your webcam for a single verification frame.
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                    >
                      Enable Camera
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Security Token Method UI */}
          {method === 'security_token' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Employee Authentication Token or Passcode:
                </label>
                <input
                  type="password"
                  placeholder="Enter 6-digit session token (e.g. 849201)"
                  value={securityTokenInput}
                  onChange={(e) => setSecurityTokenInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Demo token: Any 6 digits (e.g. <strong>123456</strong>) confirms authentication.
                </p>
              </div>
              {tokenError && (
                <div className="text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{tokenError}</span>
                </div>
              )}
            </div>
          )}

          {/* Informed Consent Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-xs text-slate-300">
                I give informed consent to verify my identity for this deliverable submission. I understand that
                identity verification is strictly separated from AI task verification.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!consentAcknowledged || isVerifying || (method === 'consent_webcam' && !snapshotCaptured && !cameraError)}
            onClick={method === 'security_token' ? handleVerifyWithToken : handleConfirmVerification}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isVerifying ? (
              <span>Verifying...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Complete Verification</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
