import { useState, useEffect } from 'react';
import { Users, ClipboardList, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import api from '../../api/client';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setStats(res.data))
      .catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="full-loader"><div className="spinner" /></div>;

  const completion = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview and analytics</p>
      </div>

      <div className="stat-grid">
        {[
          { label: 'Total Users', value: stats.totalUsers, icon: Users, cls: '' },
          { label: 'Total Tasks', value: stats.totalTasks, icon: ClipboardList, cls: '' },
          { label: 'Completed', value: stats.completedTasks, icon: CheckCircle, cls: 'green' },
          { label: 'Pending', value: stats.pendingTasks, icon: Clock, cls: 'yellow' },
          { label: 'In Progress', value: stats.inProgressTasks, icon: TrendingUp, cls: '' },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className={`stat-card ${cls}`}>
            <div className="stat-value" style={{ color: cls === 'green' ? 'var(--success)' : cls === 'yellow' ? 'var(--warning)' : '' }}>{value}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-icon"><Icon size={40} /></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} style={{ color: 'var(--success)' }} /> Completion Rate
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{completion}%</div>
          <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 6, marginTop: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${completion}%`, background: 'var(--success)', borderRadius: 4, transition: 'width 0.5s' }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 8 }}>{stats.completedTasks} of {stats.totalTasks} tasks completed</p>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, marginBottom: 16 }}>Task Breakdown</div>
          {[
            { label: 'Completed', value: stats.completedTasks, color: 'var(--success)' },
            { label: 'In Progress', value: stats.inProgressTasks, color: 'var(--accent-light)' },
            { label: 'Pending', value: stats.pendingTasks, color: 'var(--warning)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: '0.875rem' }}>{label}</span>
              </div>
              <span style={{ fontWeight: 600, color }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
