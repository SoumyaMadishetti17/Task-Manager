import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, ClipboardList, Activity, CheckSquare, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NAV_USER = [
  { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
];

const NAV_ADMIN = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/tasks', icon: ClipboardList, label: 'All Tasks' },
  { to: '/admin/activity', icon: Activity, label: 'Activity Logs' },
];

export default function Layout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/login');
  };

  const navItems = isAdmin ? [...NAV_ADMIN, ...NAV_USER] : NAV_USER;

  const Sidebar = () => (
    <aside style={{
      width: 220, minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      padding: '20px 0',
      position: 'fixed', top: 0, left: open ? 0 : '-220px',
      zIndex: 50, transition: 'left 0.25s',
    }}
    className="sidebar"
    >
      {/* Logo */}
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-light)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <CheckSquare size={20} /> TaskFlow
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
          {isAdmin ? '🔑 Admin' : '👤 User'} — {user?.name}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px' }}>
        {isAdmin && <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', padding: '8px 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Admin</div>}
        {NAV_ADMIN.map(({ to, icon: Icon, label }) => isAdmin && (
          <NavLink key={to} to={to} end={to === '/admin'} onClick={() => setOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 'var(--radius-sm)',
              textDecoration: 'none', fontSize: '0.875rem', marginBottom: 2,
              color: isActive ? 'var(--accent-light)' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              fontWeight: isActive ? 500 : 400,
            })}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', padding: '8px 10px', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 8 }}>Workspace</div>
        {NAV_USER.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} onClick={() => setOpen(false)}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 'var(--radius-sm)',
              textDecoration: 'none', fontSize: '0.875rem', marginBottom: 2,
              color: isActive ? 'var(--accent-light)' : 'var(--text-muted)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              fontWeight: isActive ? 500 : 400,
            })}>
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout} className="btn btn-ghost w-full" style={{ justifyContent: 'flex-start' }}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div style={{ display: 'flex' }}>
      {/* Desktop sidebar (always visible) */}
      <style>{`@media (min-width: 768px) { .sidebar { left: 0 !important; position: sticky !important; height: 100vh; top: 0; } .topbar-toggle { display: none !important; } }`}</style>
      <Sidebar />
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />}

      {/* Main */}
      <main style={{ flex: 1, minHeight: '100vh', padding: '24px', maxWidth: 'calc(100vw - 220px)', overflowX: 'auto' }}>
        {/* Mobile top bar */}
        <button className="topbar-toggle btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => setOpen(v => !v)}>
          {open ? <X size={16} /> : <Menu size={16} />} Menu
        </button>
        <Outlet />
      </main>
    </div>
  );
}
