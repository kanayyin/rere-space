import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatRupiah } from '../../lib/format.js';
import { useCart } from '../cart/CartContext.jsx';
import { TextField, TextArea } from '../../components/ui/Fields.jsx';
import { Button } from '../../components/ui/Button.jsx';

export default function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ customerName: '', customerWhatsapp: '', note: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  if (cart.items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6">
        <div className="text-5xl">🛒</div>
        <p className="font-display font-black text-[var(--color-ink)]">Keranjang kosong</p>
        <Link to="/" className="text-sm text-[var(--color-lavender-dark)] hover:underline">← Ke beranda</Link>
      </div>
    );
  }

  function validate() {
    const e = {};
    if (!form.customerName.trim() || form.customerName.trim().length < 2) e.customerName = 'Nama minimal 2 karakter.';
    if (!form.customerWhatsapp.trim()) e.customerWhatsapp = 'Nomor WhatsApp wajib diisi.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      const order = await api.post('/public/orders', {
        customerName: form.customerName.trim(),
        customerWhatsapp: form.customerWhatsapp.trim(),
        note: form.note.trim() || undefined,
        items: cart.items.map((i) => ({ optionId: i.optionId, quantity: i.quantity })),
      });
      cart.clear();
      navigate(`/pesanan/${order.orderCode}`);
    } catch (err) {
      setServerError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-white-soft)] px-6 py-10">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 flex items-center gap-3">
          <Link to="/keranjang" className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-lavender-dark)]">← Keranjang</Link>
          <h1 className="font-display text-2xl font-black text-[var(--color-ink)]">Checkout ✦</h1>
        </div>

        {/* Order summary */}
        <div className="mb-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-lavender-light)] p-5">
          <h2 className="mb-3 font-display font-bold text-[var(--color-lavender-dark)]">Ringkasan Pesanan</h2>
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item.optionId} className="flex justify-between text-sm">
                <span className="text-[var(--color-ink)]">{item.productName} ({item.optionName}) × {item.quantity}</span>
                <span className="font-bold text-[var(--color-ink)]">{formatRupiah(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between border-t border-[var(--color-lavender)]/50 pt-3">
            <span className="font-bold text-[var(--color-ink)]">Total</span>
            <span className="font-display font-black text-[var(--color-lavender-dark)]">{formatRupiah(cart.total)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]">
          <h2 className="font-display font-bold text-[var(--color-ink)]">Data Pemesan</h2>

          <TextField
            label="Nama Lengkap"
            required
            value={form.customerName}
            onChange={(e) => { setForm((f) => ({ ...f, customerName: e.target.value })); setErrors((er) => ({ ...er, customerName: '' })); }}
            error={errors.customerName}
            placeholder="Nama kamu"
          />

          <TextField
            label="Nomor WhatsApp"
            required
            type="tel"
            value={form.customerWhatsapp}
            onChange={(e) => { setForm((f) => ({ ...f, customerWhatsapp: e.target.value })); setErrors((er) => ({ ...er, customerWhatsapp: '' })); }}
            error={errors.customerWhatsapp}
            placeholder="08xxxxxxxxxx"
            hint="Nomor aktif untuk konfirmasi pesanan."
          />

          <TextArea
            label="Catatan (opsional)"
            rows={3}
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="Ada pesan khusus? Tulis di sini ♡"
            maxLength={500}
          />

          {serverError && (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{serverError}</p>
          )}

          <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
            Buat Pesanan ✦
          </Button>
        </form>
      </div>
    </div>
  );
}
