import { useState, useEffect } from 'react';
import { Activity, LogIn, Plus, Pencil, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const ACTION_META = {
  LOGIN: { icon: LogIn, color: 'var(--accent-light)', badge: 'badge-purple', label: 'Login' },
  TASK_CREATED: { icon: Plus, color: 'var(--success)', badge: 'badge-green', label: 'Task Created' },
  TASK_UPDATED: { icon: Pencil, color: 'var(--warning)', badge: 'badge-yellow', label: 'Task Updated' },
  TASK_DELETED: { icon: Trash2, color: 'var(--danger)', badge: 'badge-red', label: 'Task Deleted' },
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  useEffect(() => {
    api.get('/activity')
      .then(res => setLogs(res.data))
      .catch(() => toast.error('Failed to load activity logs'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = logs.filter(log => {
    const matchSearch = log.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.details?.toLowerCase().includes(search.toLowerCase());
    const matchAction = actionFilter === 'All' || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div>
      <div className="page-header flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Activity Logs</h1>
          <p className="page-subtitle">{logs.length} recent events</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search…" style={{ paddingLeft: 32, width: 180 }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-input" style={{ width: 160 }} value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
            <option value="All">All Actions</option>
            <option value="LOGIN">Login</option>
            <option value="TASK_CREATED">Task Created</option>
            <option value="TASK_UPDATED">Task Updated</option>
            <option value="TASK_DELETED">Task Deleted</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="full-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><Activity size={40} /><br />No activity found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th className="hide-mobile">Details</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(log => {
                  const meta = ACTION_META[log.action] || { badge: 'badge-gray', label: log.action };
                  const Icon = meta.icon;
                  return (
                    <tr key={log._id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {Icon && <Icon size={14} style={{ color: meta.color, flexShrink: 0 }} />}
                          <span className={`badge ${meta.badge}`}>{meta.label}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{log.user?.name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.user?.email}</div>
                      </td>
                      <td className="hide-mobile" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{log.details}</td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
