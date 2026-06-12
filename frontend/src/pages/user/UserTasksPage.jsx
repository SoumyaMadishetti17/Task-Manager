import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ClipboardList } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';
import TaskModal from '../../components/common/TaskModal';

const statusBadge = { Pending: 'badge-yellow', 'In Progress': 'badge-purple', Completed: 'badge-green' };
const priorityBadge = { Low: 'badge-gray', Medium: 'badge-yellow', High: 'badge-red' };

export default function UserTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleSave = async (form) => {
    try {
      if (editing) {
        await api.put(`/tasks/${editing._id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', form);
        toast.success('Task created');
      }
      setModalOpen(false);
      setEditing(null);
      fetchTasks();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving task'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      setTasks(ts => ts.filter(t => t._id !== id));
    } catch { toast.error('Delete failed'); }
  };

  const openEdit = (task) => { setEditing(task); setModalOpen(true); };
  const openCreate = () => { setEditing(null); setModalOpen(true); };

  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div>
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Manage and track your personal tasks</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> New Task</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: 'var(--accent-light)' }}>{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="full-loader"><div className="spinner" /></div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <ClipboardList size={40} /><br />No tasks yet. Create your first task!
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="hide-mobile">Priority</th>
                  <th>Status</th>
                  <th className="hide-mobile">Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{task.description.slice(0, 60)}{task.description.length > 60 ? '…' : ''}</div>}
                    </td>
                    <td className="hide-mobile">
                      <span className={`badge ${priorityBadge[task.priority]}`}>{task.priority}</span>
                    </td>
                    <td><span className={`badge ${statusBadge[task.status]}`}>{task.status}</span></td>
                    <td className="hide-mobile" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(task)}><Pencil size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task._id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && <TaskModal task={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} />}
    </div>
  );
}
