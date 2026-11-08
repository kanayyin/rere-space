import { useState } from 'react';
import { api } from '../../../lib/api.js';
import { formatRupiah, formatDateTime } from '../../../lib/format.js';
import { useFetch } from '../../../hooks/useFetch.js';
import { useAction } from '../../../hooks/useAction.js';
import { useToast } from '../../../components/ui/Toast.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import Modal from '../../../components/ui/Modal.jsx';

const STATUS_LABEL = { PENDING: 'Menunggu', PAID: 'Dibayar', COMPLETED: 'Selesai', CANCELLED: 'Batal' };
const STATUS_COLOR = {
  PENDING: 'bg-[var(--color-peach-light)] text-[var(--color-peach-dark)]',
  PAID: 'bg-[var(--color-sky-light)] text-blue-600',
  COMPLETED: 'bg-[var(--color-mint-light)] text-[var(--color-mint-dark)]',
  CANCELLED: 'bg-red-50 text-red-500',
};
const TRANSITIONS = { PENDING: ['PAID', 'CANCELLED'], PAID: ['COMPLETED', 'CANCELLED'], COMPLETED: ['CANCELLED'], CANCELLED: [] };
const ACTION_LABEL = { PAID: 'Tandai Dibayar', COMPLETED: 'Tandai Selesai', CANCELLED: 'Batalkan' };
const ACTION_VARIANT = { PAID: 'secondary', COMPLETED: 'mint', CANCELLED: 'danger' };

function OrderDetailModal({ order, onClose, onChanged }) {
  const toast = useToast();
  const [adminNote, setAdminNote] = useState(order.adminNote || '');
  const [costItems, setCostItems] = useState(() =>
    order.items.reduce((acc, i) => ({ ...acc, [i.id]: i.costPrice != null ? String(i.costPrice) : '' }), {})
  );
  const changeStatus = useAction((status, note) => api.patch(`/admin/orders/${order.id}/status`, { status, adminNote: note }));
  const saveCosts = useAction(() => api.patch(`/admin/orders/${order.id}/costs`, {
    items: order.items.map((i) => ({ itemId: i.id, costPrice: costItems[i.id] !== '' ? Number(costItems[i.id]) : null }))
  }));
  const transitions = TRANSITIONS[order.status] || [];

  async function handleStatus(status) {
    const result = await changeStatus.run(status, adminNote.trim() || undefined);
    if (result.ok) { toast.success(`Status diubah ke ${STATUS_LABEL[status]}`); onChanged(result.data); onClose(); }
    else toast.error(result.error.message);
  }

  async function handleSaveCosts() {
    const result = await saveCosts.run();
    if (result.ok) { toast.success('Modal disimpan ✦'); onChanged(result.data); }
    else toast.error(result.error.message);
  }

  return (
    <Modal open onClose={onClose} title={`Pesanan ${order.orderCode}`} size="lg">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2 items-center">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[order.status]}`}>{STATUS_LABEL[order.status]}</span>
          <span className="text-sm text-[var(--color-ink-soft)]">{formatDateTime(order.createdAt)}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-[var(--color-ink-muted)]">Nama</p><p className="font-semibold">{order.customerName}</p></div>
          <div><p className="text-[var(--color-ink-muted)]">WhatsApp</p><p className="font-semibold">{order.customerWhatsapp}</p></div>
          {order.note && <div className="col-span-2"><p className="text-[var(--color-ink-muted)]">Catatan</p><p className="font-semibold">{order.note}</p></div>}
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-surface-alt)]">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-[var(--color-ink-soft)]">Produk</th>
                <th className="px-4 py-2 text-right font-semibold text-[var(--color-ink-soft)]">Harga</th>
                <th className="px-4 py-2 text-right font-semibold text-[var(--color-ink-soft)]">Modal/satuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-xs text-[var(--color-ink-soft)]">{item.optionName} × {item.quantity}</p>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-[var(--color-lavender-dark)]">{formatRupiah(item.subtotal)}</td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number" min="0"
                      value={costItems[item.id]}
                      onChange={(e) => setCostItems((c) => ({ ...c, [item.id]: e.target.value }))}
                      placeholder="Modal"
                      className="w-24 rounded-xl border border-[var(--color-border)] px-2 py-1 text-right text-sm outline-none focus:border-[var(--color-lavender-dark)]"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between border-t border-[var(--color-border)] px-4 py-3">
            <span className="font-bold">Total</span>
            <span className="font-display font-black text-[var(--color-lavender-dark)]">{formatRupiah(order.totalAmount)}</span>
          </div>
        </div>

        <Button variant="soft" size="sm" loading={saveCosts.loading} onClick={handleSaveCosts}>Simpan Modal ✦</Button>

        {transitions.length > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold">Catatan admin</label>
            <textarea
              className="w-full rounded-2xl border border-[var(--color-border)] px-4 py-2.5 text-sm outline-none resize-none focus:border-[var(--color-lavender-dark)]"
              rows={2} value={adminNote} onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Catatan opsional..."
            />
            <div className="flex flex-wrap gap-2">
              {transitions.map((status) => (
                <Button key={status} variant={ACTION_VARIANT[status]} size="sm" loading={changeStatus.loading} onClick={() => handleStatus(status)}>
                  {ACTION_LABEL[status]}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function AdminOrdersPage() {
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data, loading, error, reload } = useFetch(
    (signal) => api.get(`/admin/orders?status=${status}&q=${encodeURIComponent(q)}&page=${page}`, signal),
    [status, q, page]
  );

  const items = data?.items || [];
  const meta = data?.meta;

  function handleChanged(updatedOrder) {
    setSelected(updatedOrder);
    reload();
  }

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">Pesanan 📋</h1>

      <div className="flex flex-wrap gap-3">
        <input type="search" placeholder="Cari pesanan..." value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }}
          className="w-full max-w-xs rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lavender-dark)]"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lavender-dark)]"
        >
          <option value="">Semua status</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {loading && <div className="flex h-20 items-center justify-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-[var(--color-lavender)] border-t-[var(--color-lavender-dark)]" /></div>}
      {error && <p className="text-sm text-red-500">{error.message}</p>}

      {!loading && items.length === 0 && (
        <div className="rounded-3xl border border-[var(--color-border)] bg-white py-16 text-center shadow-[var(--shadow-card)]">
          <div className="mb-3 text-4xl">📋</div>
          <p className="text-[var(--color-ink-soft)]">Belum ada pesanan.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((order) => (
          <button key={order.id} onClick={() => setSelected(order)}
            className="w-full flex flex-wrap items-center gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)] text-left hover:shadow-[var(--shadow-pop)] transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display font-black text-[var(--color-ink)]">{order.orderCode}</p>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_COLOR[order.status]}`}>{STATUS_LABEL[order.status]}</span>
              </div>
              <p className="text-sm text-[var(--color-ink-soft)]">{order.customerName} · {formatDateTime(order.createdAt)}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">{order.items.length} item</p>
            </div>
            <span className="font-display font-black text-[var(--color-lavender-dark)]">{formatRupiah(order.totalAmount)}</span>
          </button>
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 rounded-full text-sm font-bold transition-colors ${p === page ? 'bg-[var(--color-lavender-dark)] text-white' : 'bg-[var(--color-surface-alt)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)]'}`}>{p}</button>
          ))}
        </div>
      )}

      {selected && <OrderDetailModal order={selected} onClose={() => setSelected(null)} onChanged={handleChanged} />}
    </div>
  );
}
