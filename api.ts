import {
  User,
  Meeting,
  Task,
  TraceabilityChain,
  ReworkInsight,
  AuditLogEntry,
  IntegrationAdapter,
} from '../types/index.ts';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const data = await res.json();
      if (data.error) errorMsg = data.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth & Profile
  async getCurrentUser(): Promise<{ user: User | null; hasGeminiKey: boolean }> {
    return fetchJson('/api/auth/current');
  },

  async switchUser(userId: string): Promise<{ user: User }> {
    return fetchJson('/api/auth/switch-user', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  async getUsers(): Promise<{ users: User[] }> {
    return fetchJson('/api/users');
  },

  // Meetings
  async getMeetings(): Promise<{ meetings: Meeting[] }> {
    return fetchJson('/api/meetings');
  },

  async getMeeting(id: string): Promise<{ meeting: Meeting }> {
    return fetchJson(`/api/meetings/${id}`);
  },

  async createMeeting(data: {
    title: string;
    rawTranscript: string;
    attendees?: string[];
    projectId?: string;
  }): Promise<{ meeting: Meeting }> {
    return fetchJson('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async analyzeMeeting(id: string): Promise<{
    meeting: Meeting;
    extractedTasks: any[];
    modelUsed: string;
    isDeterministicFallback: boolean;
  }> {
    return fetchJson(`/api/meetings/${id}/analyze`, {
      method: 'POST',
    });
  },

  async confirmMeetingTasks(id: string, tasks: any[]): Promise<{ meeting: Meeting; tasks: Task[] }> {
    return fetchJson(`/api/meetings/${id}/confirm-tasks`, {
      method: 'POST',
      body: JSON.stringify({ tasks }),
    });
  },

  // Tasks
  async getTasks(params?: {
    employeeId?: string;
    status?: string;
    priority?: string;
  }): Promise<{ tasks: Task[] }> {
    const query = new URLSearchParams();
    if (params?.employeeId) query.set('employeeId', params.employeeId);
    if (params?.status) query.set('status', params.status);
    if (params?.priority) query.set('priority', params.priority);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchJson(`/api/tasks${queryString}`);
  },

  async getTask(id: string): Promise<{
    task: Task;
    submissions: any[];
    currentSubmission: any;
    currentReport: any;
    reviews: any[];
    history: any[];
  }> {
    return fetchJson(`/api/tasks/${id}`);
  },

  async updateTask(id: string, data: Partial<Task> & { amendDecision?: string }): Promise<{ task: Task }> {
    return fetchJson(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Evidence & Review
  async submitEvidence(data: {
    taskId: string;
    progressDescription: string;
    files: any[];
    identityVerification?: any;
  }): Promise<{ submission: any; report: any; task: Task }> {
    return fetchJson('/api/evidence/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async reviewTask(data: {
    taskId: string;
    submissionId: string;
    decision: 'approved' | 'changes_requested';
    feedbackText: string;
  }): Promise<{ review: any; task: Task }> {
    return fetchJson('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Traceability & Rework Insights
  async getTraceability(taskId: string): Promise<{ chain: TraceabilityChain }> {
    return fetchJson(`/api/traceability/${taskId}`);
  },

  async getReworkInsights(): Promise<{
    insights: ReworkInsight[];
    metrics: {
      totalTasks: number;
      approvedTasks: number;
      changesRequestedCount: number;
      firstTimePassRate: number;
      averageRevisions: number;
    };
  }> {
    return fetchJson('/api/rework-insights');
  },

  // Audit Logs & Integrations
  async getAuditLogs(): Promise<{ logs: AuditLogEntry[] }> {
    return fetchJson('/api/audit-logs');
  },

  async getIntegrations(): Promise<{ integrations: IntegrationAdapter[] }> {
    return fetchJson('/api/integrations');
  },

  async syncIntegration(id: string): Promise<{ integration: IntegrationAdapter }> {
    return fetchJson(`/api/integrations/${id}/sync`, {
      method: 'POST',
    });
  },

  async resetDemoData(): Promise<{ status: string }> {
    return fetchJson('/api/seed/reset', {
      method: 'POST',
    });
  },
};
