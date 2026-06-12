import { useState, useEffect } from 'react';
import { Trash2, ToggleLeft, ToggleRight, Users, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/client';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = () => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await api.patch(`/admin/users/${user._id}/status`, { status: newStatus });
      toast.success(`User ${newStatus.toLowerCase()}`);
      setUsers(us => us.map(u => u._id === user._id ? { ...u, status: newStatus } : u));
    } catch { toast.error('Failed to update status'); }
  };

  const deleteUser = async (user) => {
    if (!confirm(`Delete user "${user.name}"? This also deletes their tasks.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      toast.success('User deleted');
      setUsers(us => us.filter(u => u._id !== user._id));
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">{users.length} registered users</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Search users…" style={{ paddingLeft: 32, width: 220 }}
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div className="full-loader"><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><Users size={40} /><br />No users found</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th className="hide-mobile">Role</th>
                  <th>Status</th>
                  <th className="hide-mobile">Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </td>
                    <td className="hide-mobile">
                      <span className={`badge ${user.role === 'Admin' ? 'badge-purple' : 'badge-gray'}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`badge ${user.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{user.status}</span>
                    </td>
                    <td className="hide-mobile" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => toggleStatus(user)}
                          disabled={user.role === 'Admin'}
                        >
                          {user.status === 'Active' ? <ToggleRight size={16} style={{ color: 'var(--success)' }} /> : <ToggleLeft size={16} />}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteUser(user)} disabled={user.role === 'Admin'}>
                          <Trash2 size={14} />
                        </button>
                      </div>
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
