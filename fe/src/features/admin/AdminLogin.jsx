import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { TextField } from '../../components/ui/Fields.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/admin/auth/login', form);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-peach)] text-3xl">
            ✦
          </div>
          <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">Admin PastelShop</h1>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">Masuk untuk kelola toko</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="admin@pastelshop.id" />
          <TextField label="Password" type="password" required value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
          {error && <p className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">{error}</p>}
          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Masuk ✦</Button>
        </form>
      </div>
    </div>
  );
}
