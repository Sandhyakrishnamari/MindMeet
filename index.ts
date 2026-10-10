export type UserRole = 'admin' | 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  department: string;
  avatarUrl?: string;
  verifiedIdentity?: boolean;
}

export interface Team {
  id: string;
  name: string;
  department: string;
  leadId: string;
  memberIds: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  key: string;
}

export interface SpeakerStatement {
  id: string;
  speakerName: string;
  text: string;
  timestampOffset?: string;
  confidence: number; // e.g. 0.95
  uncertaintyLabel: 'confirmed' | 'probable' | 'uncertain';
}

export interface MeetingDecision {
  id: string;
  meetingId: string;
  statement: string;
  rationale: string;
  agreedBy: string[];
  associatedTaskIds: string[];
  status: 'active' | 'amended' | 'deprecated';
  version: number;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  durationMinutes: number;
  projectId: string;
  organizerName: string;
  attendees: string[];
  rawTranscript: string;
  summary: string;
  importantPoints: string[];
  decisions: MeetingDecision[];
  speakerStatements: SpeakerStatement[];
  unresolvedQuestions: string[];
  dependenciesAndRisks: string[];
  status: 'draft' | 'processed' | 'tasks_confirmed';
  extractedTaskIds: string[];
}

export type RequiredEvidenceType = 'screenshot' | 'test_log' | 'code_review' | 'document' | 'multi_asset';

export interface AcceptanceCriterion {
  id: string;
  description: string;
  requiredEvidenceType: RequiredEvidenceType;
  satisfied: boolean;
  notes?: string;
  aiEvidenceFound?: string;
}

export type TaskStatus =
  | 'awaiting_evidence'
  | 'submitted'
  | 'ai_review_complete'
  | 'partially_demonstrated'
  | 'needs_more_evidence'
  | 'manager_review_required'
  | 'approved'
  | 'changes_requested';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  meetingId: string;
  meetingTitle: string;
  decisionId: string;
  discussionExcerpt: string;
  assignedToId: string;
  assignedToName: string;
  assignedToEmail: string;
  assignedByName: string;
  deliverable: string;
  acceptanceCriteria: AcceptanceCriterion[];
  deadline: string;
  priority: TaskPriority;
  requiredEvidenceType: RequiredEvidenceType;
  status: TaskStatus;
  currentSubmissionId?: string;
  createdAt: string;
  updatedAt: string;
  decisionAmendedAlert?: boolean;
}

export interface EvidenceFile {
  id: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  dataUrl: string; // base64 or URL
  previewUrl?: string;
  uploadedAt: string;
}

export interface EvidenceSubmission {
  id: string;
  taskId: string;
  employeeId: string;
  employeeName: string;
  progressDescription: string;
  files: EvidenceFile[];
  identityVerification: {
    verified: boolean;
    method: 'consent_webcam' | 'security_token' | 'passcode';
    timestamp: string;
    noticeAcknowledged: boolean;
  };
  versionNumber: number;
  submittedAt: string;
  aiVerificationReportId?: string;
  status: 'pending_ai' | 'analyzed' | 'under_review' | 'approved' | 'changes_requested';
}

export interface CriterionAnalysisResult {
  criterionId: string;
  description: string;
  satisfied: boolean;
  evidenceFound: string;
  explanation: string;
  confidence: number; // 0.0 - 1.0
  isFunctionalTestRequired: boolean;
}

export interface AIVerificationReport {
  id: string;
  submissionId: string;
  taskId: string;
  analyzedAt: string;
  modelUsed: string;
  isDeterministicFallback: boolean;
  criteriaResults: CriterionAnalysisResult[];
  satisfiedCriteriaIds: string[];
  unverifiedCriteriaIds: string[];
  contradictions: string[];
  additionalEvidenceRequired: string[];
  evidenceQualityWarnings?: string[];
  qualityWarnings?: string[];
  verificationConfidence: number; // 0 - 100
  recommendedAction: 'approve' | 'request_changes' | 'needs_more_evidence';
  summaryExplanation: string;
  functionalLimitationDisclaimer: string;
}

export interface ManagerReview {
  id: string;
  taskId: string;
  submissionId: string;
  managerId: string;
  managerName: string;
  decision: 'approved' | 'changes_requested';
  feedbackText: string;
  reviewedAt: string;
}

export type TaskHistoryEventType =
  | 'task_created'
  | 'criteria_updated'
  | 'evidence_submitted'
  | 'ai_review_generated'
  | 'manager_reviewed'
  | 'decision_amended'
  | 'integration_synced';

export interface TaskHistoryEvent {
  id: string;
  taskId: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | 'system_ai';
  eventType: TaskHistoryEventType;
  title: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface TraceabilityChain {
  meeting: {
    id: string;
    title: string;
    date: string;
    excerpt: string;
    speaker: string;
    speakerConfidence: number;
  };
  decision: {
    id: string;
    statement: string;
    rationale: string;
    status: string;
  };
  task: {
    id: string;
    title: string;
    deliverable: string;
    assignedTo: string;
    deadline: string;
    priority: string;
    status: TaskStatus;
  };
  criteria: AcceptanceCriterion[];
  submission?: {
    id: string;
    version: number;
    submittedAt: string;
    description: string;
    filesCount: number;
    evidencePreview: string;
  };
  aiReport?: AIVerificationReport;
  managerReview?: ManagerReview;
}

export interface ReworkInsight {
  id: string;
  category: 'unclear_criteria' | 'missing_edge_cases' | 'functional_omission' | 'scope_drift';
  title: string;
  frequency: number;
  affectedTasksCount: number;
  severity: 'high' | 'medium' | 'low';
  exampleSnippet: string;
  rootCause: string;
  suggestedMeetingIntervention: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole | 'system';
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'denied';
  details: string;
}

export interface IntegrationAdapter {
  id: string;
  name: 'Jira' | 'Trello' | 'Google Calendar';
  icon: string;
  connected: boolean;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string | null;
  itemsSyncedCount: number;
  demoMode: boolean;
}
