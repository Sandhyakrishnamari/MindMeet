import React, { useEffect, useState } from 'react';
import { User, Task, Meeting, TraceabilityChain } from './types/index.ts';
import { api } from './services/api.ts';
import { Navigation } from './components/Navigation.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { MeetingsPage } from './pages/MeetingsPage.tsx';
import { TasksPage } from './pages/TasksPage.tsx';
import { TraceabilityGraph } from './components/TraceabilityGraph.tsx';
import { ReworkInsightsPage } from './pages/ReworkInsightsPage.tsx';
import { TeamsProjectsPage } from './pages/TeamsProjectsPage.tsx';
import { AdminAuditPage } from './pages/AdminAuditPage.tsx';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('home'); // Defaults to beautiful public website

  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTraceabilityTaskId, setSelectedTraceabilityTaskId] = useState<string>('task_login_page');
  const [traceabilityChain, setTraceabilityChain] = useState<TraceabilityChain | null>(null);

  const [taskDetailData, setTaskDetailData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [authRes, usersRes, tasksRes, meetingsRes] = await Promise.all([
        api.getCurrentUser(),
        api.getUsers(),
        api.getTasks(),
        api.getMeetings(),
      ]);

      setCurrentUser(authRes.user);
      setHasGeminiKey(authRes.hasGeminiKey);
      setUsers(usersRes.users || []);
      setTasks(tasksRes.tasks || []);
      setMeetings(meetingsRes.meetings || []);

      if (tasksRes.tasks && tasksRes.tasks.length > 0) {
        const firstTaskId = tasksRes.tasks[0].id;
        setSelectedTraceabilityTaskId(firstTaskId);
        loadTraceability(firstTaskId);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTraceability = async (taskId: string) => {
    try {
      const res = await api.getTraceability(taskId);
      setTraceabilityChain(res.chain);
    } catch (err) {
      console.warn('Traceability load error:', err);
    }
  };

  const handleSelectTask = async (taskId: string | null) => {
    setSelectedTaskId(taskId);
    if (!taskId) {
      setTaskDetailData(null);
      return;
    }
    try {
      const data = await api.getTask(taskId);
      setTaskDetailData(data);
      setActiveTab('tasks');
    } catch (err) {
      console.error('Failed to load task details:', err);
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await api.switchUser(userId);
      setCurrentUser(res.user);
      showToast(`Switched active profile to ${res.user.name} (${res.user.role})`);
    } catch (err) {
      console.error('Switch user error:', err);
    }
  };

  const handleResetDemo = async () => {
    try {
      await api.resetDemoData();
      showToast('Demo data reseeded to initial Priya Sharma workflow state.');
      await loadInitialData();
    } catch (err) {
      alert('Failed to reset demo.');
    }
  };

  const handleSubmitEvidence = async (payload: any) => {
    try {
      await api.submitEvidence(payload);
      showToast('Evidence submitted and multimodal AI verification completed!');
      if (selectedTaskId) {
        const updated = await api.getTask(selectedTaskId);
        setTaskDetailData(updated);
      }
      const tasksRes = await api.getTasks();
      setTasks(tasksRes.tasks || []);
      if (selectedTaskId) {
        loadTraceability(selectedTaskId);
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleReviewSubmit = async (decision: 'approved' | 'changes_requested', feedback: string) => {
    if (!selectedTaskId) return;
    try {
      await api.reviewTask({
        taskId: selectedTaskId,
        submissionId: taskDetailData?.currentSubmission?.id || '',
        decision,
        feedbackText: feedback,
      });
      showToast(`Review decision recorded: ${decision.replace(/_/g, ' ')}`);
      const updated = await api.getTask(selectedTaskId);
      setTaskDetailData(updated);
      const tasksRes = await api.getTasks();
      setTasks(tasksRes.tasks || []);
      loadTraceability(selectedTaskId);
    } catch (err: any) {
      alert(`Review submission failed: ${err.message}`);
    }
  };

  const handleAmendDecision = async (taskId: string, newStatement: string) => {
    try {
      await api.updateTask(taskId, {
        amendDecision: newStatement,
      });
      showToast('Meeting decision amendment logged. Manager notified to revise criteria.');
      loadTraceability(taskId);
      const tasksRes = await api.getTasks();
      setTasks(tasksRes.tasks || []);
    } catch (err: any) {
      alert(`Failed to amend decision: ${err.message}`);
    }
  };

  // Quick launch into Priya's Login Page Task
  const handleLaunchPriyaDemo = async () => {
    const priyaUser = users.find((u) => u.id === 'user_priya');
    if (priyaUser) {
      await handleSwitchUser(priyaUser.id);
    }
    await handleSelectTask('task_login_page');
    setActiveTab('tasks');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Strict Top Bar Contract Header */}
      <Navigation
        currentUser={currentUser}
        users={users}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'tasks') {
            setSelectedTaskId(null);
          }
        }}
        onSwitchUser={handleSwitchUser}
        onResetDemo={handleResetDemo}
        hasGeminiKey={hasGeminiKey}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <div className="text-xs text-slate-400">Loading MeetMind AI Platform...</div>
          </div>
        ) : (
          <>
            {activeTab === 'home' && (
              <LandingPage
                onEnterApp={(tab) => {
                  setActiveTab(tab || 'dashboard');
                  setSelectedTaskId(null);
                }}
                onSelectPriyaDemo={handleLaunchPriyaDemo}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage
                currentUser={currentUser}
                tasks={tasks}
                meetings={meetings}
                onSelectTask={handleSelectTask}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'traceability' && (
              <TraceabilityGraph
                tasks={tasks}
                selectedTaskId={selectedTraceabilityTaskId}
                onSelectTask={(id) => {
                  setSelectedTraceabilityTaskId(id);
                  loadTraceability(id);
                }}
                chain={traceabilityChain}
                onAmendDecision={handleAmendDecision}
              />
            )}

            {activeTab === 'meetings' && (
              <MeetingsPage
                meetings={meetings}
                onMeetingCreated={async () => {
                  const mRes = await api.getMeetings();
                  setMeetings(mRes.meetings || []);
                }}
                onTasksPublished={async () => {
                  const [tRes, mRes] = await Promise.all([api.getTasks(), api.getMeetings()]);
                  setTasks(tRes.tasks || []);
                  setMeetings(mRes.meetings || []);
                  setActiveTab('tasks');
                }}
                isManager={currentUser?.role === 'manager'}
              />
            )}

            {activeTab === 'tasks' && (
              <TasksPage
                tasks={tasks}
                currentUser={currentUser}
                selectedTaskId={selectedTaskId}
                onSelectTask={handleSelectTask}
                taskDetailData={taskDetailData}
                onSubmitEvidence={handleSubmitEvidence}
                onReviewSubmit={handleReviewSubmit}
              />
            )}

            {activeTab === 'rework' && <ReworkInsightsPage />}

            {activeTab === 'teams' && (
              <TeamsProjectsPage
                users={users}
                isManagerOrAdmin={currentUser?.role === 'manager' || currentUser?.role === 'admin'}
              />
            )}

            {activeTab === 'admin' && (
              <AdminAuditPage users={users} hasGeminiKey={hasGeminiKey} />
            )}
          </>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/60 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quiet Corporate Footer */}
      <footer className="border-t border-slate-900 py-6 mt-12 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            MeetMind AI · Proof-to-Progress & Meeting-to-Evidence Traceability
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>SOC-2 Type II Certified Model Workflows</span>
            <span>·</span>
            <span>Zero Biometric Template Retention</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
