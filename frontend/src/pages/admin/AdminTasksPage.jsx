import { useState, useEffect } from 'react';
import { Trash2, Search, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';

const statusBadge = { Pending: 'badge-yellow', 'In Progress': 'badge-purple', Completed: 'badge-green' };
const priorityBadge = { Low: 'badge-gray', Medium: 'badge-yellow', High: 'badge-red' };

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    api.get('/admin/tasks')
      .then(res => setTasks(res.data))
      .catch(() => toast.error('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/admin/tasks/${id}`);
      toast.success('Task deleted');
      setTasks(ts => ts.filter(t => t._id !== id));
    } catch { toast.error('Delete failed'); }
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.owner?.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="page-header flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Task Monitoring</h1>
          <p className="page-subtitle">{tasks.length} total tasks across all users</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search…" style={{ paddingLeft: 32, width: 180 }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-input" style={{ width: 140 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="full-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><ClipboardList size={40} /><br />No tasks found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Task</th>
                  <th className="hide-mobile">Owner</th>
                  <th className="hide-mobile">Priority</th>
                  <th>Status</th>
                  <th className="hide-mobile">Created</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(task => (
                  <tr key={task._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{task.description.slice(0, 50)}{task.description.length > 50 ? '…' : ''}</div>}
                    </td>
                    <td className="hide-mobile">
                      <div style={{ fontSize: '0.875rem' }}>{task.owner?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.owner?.email}</div>
                    </td>
                    <td className="hide-mobile">
                      <span className={`badge ${priorityBadge[task.priority]}`}>{task.priority}</span>
                    </td>
                    <td><span className={`badge ${statusBadge[task.status]}`}>{task.status}</span></td>
                    <td className="hide-mobile" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteTask(task._id)}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
