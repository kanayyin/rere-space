import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    api.get('/admin/auth/me').then((d) => setAdmin(d.admin)).catch(() => navigate('/admin/login'));
  }, [navigate]);

  async function handleLogout() {
    await api.post('/admin/auth/logout').catch(() => {});
    navigate('/admin/login');
  }

  if (!admin) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-lavender)] border-t-[var(--color-lavender-dark)]" />
    </div>
  );

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '✦' },
    { to: '/admin/produk', label: 'Produk', icon: '🛍️' },
    { to: '/admin/pesanan', label: 'Pesanan', icon: '📋' },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--color-surface)]">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--color-border)] bg-white md:flex">
        <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-5">
          <span className="font-display text-lg font-black text-[var(--color-lavender-dark)]">✦ Sourire</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[var(--color-lavender-light)] text-[var(--color-lavender-dark)]'
                    : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-alt)]'
                }`
              }
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-[var(--color-border)] p-4">
          <p className="mb-2 truncate text-xs text-[var(--color-ink-soft)]">{admin.email}</p>
          <button onClick={handleLogout} className="w-full rounded-2xl bg-[var(--color-surface-alt)] py-2 text-xs font-semibold text-[var(--color-ink-soft)] hover:bg-[var(--color-border)] transition-colors">
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between border-b border-[var(--color-border)] bg-white px-4 py-3 md:hidden">
          <span className="font-display font-black text-[var(--color-lavender-dark)]">✦ Sourire</span>
          <div className="flex gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${isActive ? 'bg-[var(--color-lavender-light)] text-[var(--color-lavender-dark)]' : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-surface-alt)]'}`}>
                {item.icon}
              </NavLink>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
