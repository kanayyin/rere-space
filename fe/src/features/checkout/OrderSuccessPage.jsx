import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatRupiah, formatDateTime } from '../../lib/format.js';
import { useConfig } from '../config/ConfigContext.jsx';

const STATUS_LABEL = {
  PENDING: { label: 'Menunggu konfirmasi', color: 'bg-[var(--color-peach-light)] text-[var(--color-peach-dark)]' },
  PAID: { label: 'Sudah dibayar', color: 'bg-[var(--color-sky-light)] text-blue-600' },
  COMPLETED: { label: 'Selesai', color: 'bg-[var(--color-mint-light)] text-[var(--color-mint-dark)]' },
  CANCELLED: { label: 'Dibatalkan', color: 'bg-red-50 text-red-500' },
};

function buildWaUrl(order, adminWhatsapp) {
  const lines = [
    `*✦ Konfirmasi Pesanan — PastelShop*`,
    `────────────────`,
    `♡  Kode   : ${order.orderCode}`,
    `♡  Nama   : ${order.customerName}`,
    `♡  WA     : ${order.customerWhatsapp}`,
    '',
  ];
  order.items.forEach((item) => {
    lines.push(` ✦  *${item.productName}* (${item.optionName}) × ${item.quantity}`);
    lines.push(`     Harga: ${formatRupiah(item.subtotal)}`);
    lines.push('');
  });
  lines.push(`✦  *Total : ${formatRupiah(order.totalAmount)}*`);
  lines.push('────────────────');
  lines.push('Mohon konfirmasi pembayarannya ya kak ♡');
  return `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function OrderSuccessPage() {
  const { orderCode } = useParams();
  const { config } = useConfig();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/public/orders/${orderCode}`)
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderCode]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-lavender)] border-t-[var(--color-lavender-dark)]" />
    </div>
  );

  if (error || !order) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-5xl">😢</div>
      <p className="font-display font-black text-[var(--color-ink)]">Pesanan tidak ditemukan</p>
      <Link to="/" className="text-sm text-[var(--color-lavender-dark)] hover:underline">← Ke beranda</Link>
    </div>
  );

  const status = STATUS_LABEL[order.status] || STATUS_LABEL.PENDING;

  return (
    <div className="min-h-screen bg-[var(--color-white-soft)] px-6 py-10">
      <div className="mx-auto max-w-xl">
        {/* Success header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-peach)] text-4xl shadow-[var(--shadow-pop)]">
            🎉
          </div>
          <h1 className="font-display text-3xl font-black text-[var(--color-ink)]">Pesanan Dibuat! ✦</h1>
          <p className="mt-2 text-[var(--color-ink-soft)]">Segera konfirmasi ke admin ya kak ♡</p>
        </div>

        {/* Order card */}
        <div className="rounded-3xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-card)] overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--color-lavender-light)] to-[var(--color-peach-light)] px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-ink-soft)]">Kode Pesanan</p>
                <p className="font-display text-xl font-black text-[var(--color-lavender-dark)]">{order.orderCode}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.color}`}>{status.label}</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[var(--color-ink-muted)]">Nama</p>
                <p className="font-semibold text-[var(--color-ink)]">{order.customerName}</p>
              </div>
              <div>
                <p className="text-[var(--color-ink-muted)]">WhatsApp</p>
                <p className="font-semibold text-[var(--color-ink)]">{order.customerWhatsapp}</p>
              </div>
              <div>
                <p className="text-[var(--color-ink-muted)]">Waktu</p>
                <p className="font-semibold text-[var(--color-ink)]">{formatDateTime(order.createdAt)}</p>
              </div>
            </div>

            <hr className="border-[var(--color-border)]" />

            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-[var(--color-ink)]">{item.productName} ({item.optionName}) × {item.quantity}</span>
                  <span className="font-bold text-[var(--color-ink)]">{formatRupiah(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <hr className="border-[var(--color-border)]" />

            <div className="flex justify-between">
              <span className="font-bold text-[var(--color-ink)]">Total</span>
              <span className="font-display text-2xl font-black text-[var(--color-lavender-dark)]">{formatRupiah(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-col gap-3">
          {config.adminWhatsapp && (
            <a
              href={buildWaUrl(order, config.adminWhatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full bg-green-500 px-7 py-3 font-semibold text-white hover:bg-green-600 transition-colors shadow-[var(--shadow-card)]"
            >
              💬 Konfirmasi via WhatsApp
            </a>
          )}
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-full bg-[var(--color-lavender-light)] px-7 py-3 font-semibold text-[var(--color-lavender-dark)] hover:bg-[var(--color-lavender)]/50 transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
