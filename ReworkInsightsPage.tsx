import React, { useEffect, useState } from 'react';
import { ReworkInsight } from '../types/index.ts';
import { api } from '../services/api.ts';
import {
  Brain,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  TrendingDown,
  RefreshCw,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const ReworkInsightsPage: React.FC = () => {
  const [insights, setInsights] = useState<ReworkInsight[]>([]);
  const [metrics, setMetrics] = useState<{
    totalTasks: number;
    approvedTasks: number;
    changesRequestedCount: number;
    firstTimePassRate: number;
    averageRevisions: number;
  }>({
    totalTasks: 3,
    approvedTasks: 1,
    changesRequestedCount: 1,
    firstTimePassRate: 33,
    averageRevisions: 1.6,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await api.getReworkInsights();
      setInsights(res.insights || []);
      if (res.metrics) setMetrics(res.metrics);
    } catch (err) {
      console.warn('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Recharts breakdown data
  const categoryData = [
    { name: 'Omission of Error States', count: 4, fill: '#06B6D4' },
    { name: 'Visual vs Functional Ambiguity', count: 3, fill: '#F59E0B' },
    { name: 'Unrecorded Verbal Changes', count: 2, fill: '#8B5CF6' },
  ];

  const pieColors = ['#06B6D4', '#F59E0B', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
            Accountability & Quality Analytics
          </span>
          <h2 className="text-xl font-bold text-white">Rework Intelligence & Meeting Root-Causes</h2>
          <p className="text-xs text-slate-400">
            Identifies recurring requirement gaps, missing acceptance criteria, and patterns causing revision cycles.
          </p>
        </div>

        <button
          onClick={loadInsights}
          disabled={loading}
          className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">First-Time Pass Rate</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1 tabular-nums">{metrics.firstTimePassRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Verified on 1st submission</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">Average Submissions / Task</div>
          <div className="text-2xl font-bold text-white mt-1 tabular-nums">{metrics.averageRevisions}x</div>
          <div className="text-[11px] text-slate-500 mt-1">Iterations until sign-off</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">Revision Requests Logged</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">{metrics.changesRequestedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Missing criteria flagged</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="text-xs text-slate-400 font-medium">Total Tasks Analyzed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{metrics.totalTasks}</div>
          <div className="text-[11px] text-slate-500 mt-1">Audit-tracked tasks</div>
        </div>
      </div>

      {/* Analytics Chart & Pattern Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Most Common Revision Triggers</h3>
          <p className="text-xs text-slate-400">
            Identified reasons why initial evidence did not demonstrate complete meeting criteria
          </p>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} width={130} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Occurrences" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Recommended Meeting Interventions</h3>
          <p className="text-xs text-slate-400">
            Proactive improvements to future sprint planning meetings based on stored deliverable data
          </p>

          <div className="space-y-3 pt-1 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Mandate Negative States at Meeting Time</strong>
                <span className="text-slate-400 text-[11px] leading-relaxed">
                  When asking an engineer to build a feature, always formulate at least 1 explicit acceptance criterion
                  defining what an invalid input or failure response looks like.
                </span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Separate UI Proof from Backend Proof</strong>
                <span className="text-slate-400 text-[11px] leading-relaxed">
                  Never mix visual layout with routing logic in a single criterion. Tag visual elements with [screenshot]
                  and operational flows with [automated_test_result].
                </span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-start gap-2.5">
              <Lightbulb className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block mb-0.5">Use "Amend Decision" Instead of Verbal Tweaks</strong>
                <span className="text-slate-400 text-[11px] leading-relaxed">
                  Informal Slack conversations frequently alter scope without updating task criteria. Use MeetMind's
                  decision amendment tool to keep all parties aligned.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Insights Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Documented Rework Patterns from Stored Evidence</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="font-mono text-cyan-400 text-[10px] uppercase font-semibold">
                    {insight.category.replace(/_/g, ' ')}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                      insight.severity === 'high'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {insight.severity} impact
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2">{insight.title}</h4>

                <p className="text-slate-400 text-[11px] mb-2 leading-relaxed">
                  <strong>Root Cause:</strong> {insight.rootCause}
                </p>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 text-[11px] text-slate-300 italic">
                  "{insight.exampleSnippet}"
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="text-[10px] text-cyan-400 font-semibold block mb-0.5">
                  Suggested Meeting Intervention:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {insight.suggestedMeetingIntervention}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-500">
        <strong>Anti-Bias Standard:</strong> Rework Insights evaluates structural requirement clarity and task definitions.
        It is never used for automated employee performance ranking, punitive actions, or salary determinations.
      </div>
    </div>
  );
};
