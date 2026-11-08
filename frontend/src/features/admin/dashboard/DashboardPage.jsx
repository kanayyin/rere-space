import { useFetch } from '../../../hooks/useFetch.js';
import { api } from '../../../lib/api.js';
import { formatRupiah, formatDateTime } from '../../../lib/format.js';

const STATUS_LABEL = { PENDING: 'Menunggu', PAID: 'Dibayar', COMPLETED: 'Selesai', CANCELLED: 'Batal' };
const STATUS_COLOR = {
  PENDING: 'bg-[var(--color-peach-light)] text-[var(--color-peach-dark)]',
  PAID: 'bg-[var(--color-sky-light)] text-blue-600',
  COMPLETED: 'bg-[var(--color-mint-light)] text-[var(--color-mint-dark)]',
  CANCELLED: 'bg-red-50 text-red-500',
};

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]`}>
      <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${color || 'bg-[var(--color-lavender-light)]'} text-xl`}>
        {icon}
      </div>
      <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
      <p className="font-display text-2xl font-black text-[var(--color-ink)]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[var(--color-ink-muted)]">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading, error } = useFetch((signal) => api.get('/admin/dashboard', signal), []);

  if (loading) return <div className="flex h-40 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-lavender)] border-t-[var(--color-lavender-dark)]" /></div>;
  if (error) return <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error.message}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">Dashboard ✦</h1>
        <p className="text-sm text-[var(--color-ink-soft)]">Ringkasan performa toko bulan ini</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon="📋" label="Pesanan Hari Inii" value={data.ordersToday} color="bg-[var(--color-sky-light)]" />
        <StatCard icon="⏳" label="Menunggu Konfirmasi" value={data.pendingOrders} color="bg-[var(--color-peach-light)]" />
        <StatCard icon="💰" label="Pendapatan Bulan Ini" value={formatRupiah(data.revenueThisMonth)} color="bg-[var(--color-mint-light)]" />
        <StatCard icon="📦" label="Modal Bulan Ini" value={formatRupiah(data.costThisMonth)} sub={data.itemsMissingCost > 0 ? `${data.itemsMissingCost} item belum diisi modal` : 'Semua modal terisi'} color="bg-[var(--color-lavender-light)]" />
        <StatCard icon="✦" label="Keuntungan Bulan Ini" value={formatRupiah(data.profitThisMonth)} color="bg-[var(--color-blush-light)]" />
      </div>

      {/* Recent orders */}
      <div className="rounded-3xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)]">
        <div className="border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="font-display font-bold text-[var(--color-ink)]">Pesanan Terbaru</h2>
        </div>
        <div className="divide-y divide-[var(--color-border)]">
          {data.recentOrders?.length === 0 && (
            <p className="px-6 py-8 text-center text-sm text-[var(--color-ink-soft)]">Belum ada pesanan.</p>
          )}
          {data.recentOrders?.map((order) => (
            <div key={order.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--color-ink)]">{order.orderCode}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">{order.customerName} · {formatDateTime(order.createdAt)}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLOR[order.status]}`}>{STATUS_LABEL[order.status]}</span>
              <span className="font-display font-black text-[var(--color-lavender-dark)]">{formatRupiah(order.totalAmount)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
