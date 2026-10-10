import React, { useState } from 'react';
import { User, Team, Project } from '../types/index.ts';
import { Users, Briefcase, Plus, Shield, Check, UserCheck, Layers } from 'lucide-react';

interface TeamsProjectsPageProps {
  users: User[];
  isManagerOrAdmin: boolean;
}

export const TeamsProjectsPage: React.FC<TeamsProjectsPageProps> = ({
  users,
  isManagerOrAdmin,
}) => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 'team_frontend',
      name: 'Core Frontend & Experience',
      department: 'Engineering',
      leadId: 'user_marcus',
      memberIds: ['user_priya', 'user_marcus'],
    },
    {
      id: 'team_backend',
      name: 'Platform Infrastructure & Security',
      department: 'Platform Architecture',
      leadId: 'user_alex',
      memberIds: ['user_alex', 'user_sarah'],
    },
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'proj_auth',
      name: 'Zero-Trust Authentication & SSO Suite',
      description: 'Next-generation enterprise authentication workflow with strict identity verification.',
      status: 'active',
      key: 'AUTH-2026',
    },
    {
      id: 'proj_checkout',
      name: 'Checkout Modernization & Payment Gateway',
      description: 'Stripe 1-click payment element integration and webhook reconciliation.',
      status: 'active',
      key: 'CHECKOUT-2026',
    },
  ]);

  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectKey, setNewProjectKey] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return;
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      name: newTeamName,
      department: newTeamDept || 'Product Engineering',
      leadId: users[0]?.id || 'user_marcus',
      memberIds: [users[0]?.id, users[1]?.id].filter(Boolean),
    };
    setTeams([...teams, newTeam]);
    setShowNewTeamModal(false);
    setNewTeamName('');
    setNewTeamDept('');
  };

  const handleAddProject = () => {
    if (!newProjectName.trim()) return;
    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: newProjectName,
      key: (newProjectKey || 'PROJ').toUpperCase(),
      description: newProjectDesc || 'Enterprise roadmap project deliverable.',
      status: 'active',
    };
    setProjects([...projects, newProj]);
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectKey('');
    setNewProjectDesc('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider block mb-1">
            Organization & Resource Directory
          </span>
          <h2 className="text-xl font-bold text-white">Teams, Projects & Role Access Matrix</h2>
          <p className="text-xs text-slate-400">
            Manage engineering rosters, roadmap initiatives, and role-based permissions.
          </p>
        </div>

        {isManagerOrAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNewTeamModal(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Team</span>
            </button>
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-lg shadow-cyan-950 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-cyan-400" />
          <span>Active Enterprise Projects ({projects.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-400 font-bold text-xs bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  {proj.key}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {proj.status}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">{proj.name}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Teams and Members */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>Engineering Teams & Rosters ({teams.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team) => {
            const lead = users.find((u) => u.id === team.leadId);
            const members = users.filter((u) => team.memberIds.includes(u.id));

            return (
              <div
                key={team.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{team.name}</h4>
                    <span className="text-xs text-slate-400">{team.department}</span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Lead: <strong className="text-cyan-300">{lead?.name || 'Marcus Vance'}</strong>
                  </span>
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 block">Team Members:</span>
                  <div className="space-y-1.5">
                    {members.map((m) => (
                      <div
                        key={m.id}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-200">{m.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2">({m.title})</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono font-medium uppercase bg-slate-900 text-cyan-400">
                          {m.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Role-Based Permissions Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Role-Based Access Control (RBAC) Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">System Capability</th>
                <th className="py-2.5 px-3">Admin</th>
                <th className="py-2.5 px-3">Manager</th>
                <th className="py-2.5 px-3">Employee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Import Transcripts & Extract Tasks</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-slate-500">Read-Only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Define & Amend Acceptance Criteria</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-slate-500">Read-Only</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Upload Deliverable Evidence & Passcodes</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Assigned Tasks</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Proof-to-Progress Sign-Off (Approve/Reject)</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-slate-500">No</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-medium text-white">Security Ledger & Retention Management</td>
                <td className="py-2.5 px-3 text-emerald-400">✓ Full</td>
                <td className="py-2.5 px-3 text-slate-500">No</td>
                <td className="py-2.5 px-3 text-slate-500">No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* New Team Modal */}
      {showNewTeamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Create Engineering Team</h3>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Team Name:</label>
              <input
                type="text"
                placeholder="e.g. Mobile Experience Team"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Department:</label>
              <input
                type="text"
                placeholder="e.g. Product Engineering"
                value={newTeamDept}
                onChange={(e) => setNewTeamDept(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewTeamModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTeam}
                className="px-4 py-2 bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
              >
                Create Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Create New Project</h3>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Project Name:</label>
              <input
                type="text"
                placeholder="e.g. Identity Federation 2.0"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Project Key:</label>
              <input
                type="text"
                placeholder="e.g. FED-2026"
                value={newProjectKey}
                onChange={(e) => setNewProjectKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white uppercase font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">Description:</label>
              <textarea
                rows={3}
                placeholder="Summary of project goals and deliverables..."
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddProject}
                className="px-4 py-2 bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
