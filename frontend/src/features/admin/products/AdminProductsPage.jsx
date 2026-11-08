import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api.js';
import { formatRupiah } from '../../../lib/format.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useAction } from '../../../hooks/useAction.js';
import { useToast } from '../../../components/ui/Toast.jsx';
import { Button, buttonClasses } from '../../../components/ui/Button.jsx';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);

  const { data, loading, error, reload } = useFetch(
    (signal) => api.get(`/admin/products?q=${encodeURIComponent(q)}&page=${page}`, signal),
    [q, page]
  );

  const remove = useAction((id) => api.delete(`/admin/products/${id}`));
  const toggle = useAction(({ id, isActive }) => api.put(`/admin/products/${id}`, { isActive: !isActive }));

  async function handleDelete(product) {
    const result = await remove.run(product.id);
    if (result.ok) { toast.success(`${product.name} dihapus`); setToDelete(null); reload(); }
    else toast.error(result.error.message);
  }

  async function handleToggle(product) {
    const result = await toggle.run(product);
    if (result.ok) { toast.success(`${product.name} ${product.isActive ? 'dinonaktifkan' : 'diaktifkan'}`); reload(); }
    else toast.error(result.error.message);
  }

  const items = data?.items || [];
  const meta = data?.meta;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">Produk 🛍️</h1>
        <Link to="/admin/produk/baru" className={buttonClasses({ variant: 'primary', size: 'md' })}>
          + Tambah Produk
        </Link>
      </div>

      <input
        type="search"
        placeholder="Cari produk..."
        value={q}
        onChange={(e) => { setQ(e.target.value); setPage(1); }}
        className="w-full max-w-xs rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lavender-dark)] focus:ring-2 focus:ring-[var(--color-lavender)]/40"
      />

      {loading && <div className="flex h-20 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-[var(--color-lavender)] border-t-[var(--color-lavender-dark)]" /></div>}
      {error && <p className="text-sm text-red-500">{error.message}</p>}

      {!loading && items.length === 0 && (
        <div className="rounded-3xl border border-[var(--color-border)] bg-white py-16 text-center shadow-[var(--shadow-card)]">
          <div className="mb-3 text-4xl">📦</div>
          <p className="text-[var(--color-ink-soft)]">Belum ada produk.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((product) => (
          <div key={product.id} className="flex flex-wrap items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)]">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-lavender-light)] to-[var(--color-peach-light)] overflow-hidden text-2xl">
              {product.imageUrl ? <img src={product.imageUrl} alt="" className="h-full w-full object-cover" /> : '📦'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-black text-[var(--color-ink)]">{product.name}</p>
              <p className="text-xs text-[var(--color-ink-soft)]">{product.category} · {product.options?.length || 0} varian</p>
              {product.minPrice != null && <p className="text-sm font-bold text-[var(--color-lavender-dark)]">Mulai {formatRupiah(product.minPrice)}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(product)}
                title={product.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${product.isActive ? 'bg-[var(--color-lavender-dark)]' : 'bg-[var(--color-border)]'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition-transform ${product.isActive ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
              <Link to={`/admin/produk/${product.id}`} className={buttonClasses({ variant: 'soft', size: 'sm' })}>Edit</Link>
              <button
                onClick={() => setToDelete(product)}
                className={buttonClasses({ variant: 'ghost', size: 'sm' })}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${p === page ? 'bg-[var(--color-lavender-dark)] text-white' : 'bg-[var(--color-surface-alt)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)]'}`}>{p}</button>
          ))}
        </div>
      )}

      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-[var(--shadow-pop)]">
            <h3 className="font-display font-black text-[var(--color-ink)]">Hapus produk?</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)]"><strong>{toDelete.name}</strong> beserta semua variannya akan dihapus permanen.</p>
            <div className="mt-5 flex gap-3">
              <Button variant="ghost" size="md" className="flex-1" onClick={() => setToDelete(null)}>Batal</Button>
              <Button variant="danger" size="md" className="flex-1" loading={remove.loading} onClick={() => handleDelete(toDelete)}>Ya, hapus</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
