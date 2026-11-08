import { Link, useNavigate } from 'react-router-dom';
import { formatRupiah } from '../../lib/format.js';
import { useCart } from './CartContext.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function CartPage() {
  const cart = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <div className="text-6xl">🛒</div>
        <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">Keranjang kosong</h1>
        <p className="text-[var(--color-ink-soft)]">Belum ada produk yang dipilih.</p>
        <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender-dark)] px-7 py-3 font-semibold text-white hover:bg-[var(--color-lavender-dark)]/90 transition-all">
          ← Lihat Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-white-soft)] px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-lavender-dark)]">← Kembali</Link>
          <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">Keranjang ✦</h1>
        </div>

        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.optionId} className="flex gap-4 rounded-3xl border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)]">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-lavender-light)] to-[var(--color-peach-light)] text-2xl overflow-hidden">
                {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover" /> : '📦'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-black text-[var(--color-ink)] truncate">{item.productName}</p>
                <p className="text-sm text-[var(--color-ink-soft)]">{item.optionName}</p>
                <p className="font-bold text-[var(--color-lavender-dark)]">{formatRupiah(item.price)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] px-2 py-1">
                  <button onClick={() => cart.updateQty(item.optionId, item.quantity - 1)} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-[var(--color-surface-alt)] transition-colors font-bold text-[var(--color-ink)]">−</button>
                  <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => cart.updateQty(item.optionId, item.quantity + 1)} className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-[var(--color-surface-alt)] transition-colors font-bold text-[var(--color-ink)]">+</button>
                </div>
                <button onClick={() => cart.removeItem(item.optionId)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Hapus</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-baseline justify-between">
            <span className="font-semibold text-[var(--color-ink-soft)]">Total</span>
            <span className="font-display text-3xl font-black text-[var(--color-lavender-dark)]">{formatRupiah(cart.total)}</span>
          </div>
          <Button variant="primary" size="lg" className="mt-4 w-full" onClick={() => navigate('/checkout')}>
            Lanjut Checkout ✦
          </Button>
        </div>
      </div>
    </div>
  );
}
