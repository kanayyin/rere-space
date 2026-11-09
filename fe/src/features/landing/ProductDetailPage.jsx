import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatRupiah } from '../../lib/format.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useConfig } from '../config/ConfigContext.jsx';
import { useCart } from '../cart/CartContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { Button } from '../../components/ui/Button.jsx';

function TopBar({ cartCount }) {
  const { config } = useConfig();
  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-md bg-[var(--color-white-soft)]/80 border-b border-[var(--color-border)]">
      <Link to="/" className="font-display text-lg sm:text-xl font-black text-[var(--color-lavender-dark)] truncate">
        ✦ {config.storeName}
      </Link>
      <Link
        to="/keranjang"
        className="relative flex items-center gap-1.5 sm:gap-2 rounded-full bg-[var(--color-lavender-light)] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[var(--color-lavender-dark)] hover:bg-[var(--color-lavender)]/50 transition-colors"
      >
        🛒 <span className="hidden sm:inline">Keranjang</span>
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-lavender-dark)] text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  );
}

function QuantityStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-alt)] font-bold text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors"
      >
        −
      </button>
      <span className="w-7 text-center font-bold text-[var(--color-ink)]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-alt)] font-bold text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors"
      >
        +
      </button>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const cart = useCart();

  const { data: product, loading, error } = useFetch(
    (signal) => api.get(`/public/catalog/products/${slug}`, signal),
    [slug]
  );

  const options = useMemo(() => product?.options || [], [product]);
  const [optionId, setOptionId] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const firstActive = options.find((o) => o.isActive !== false);
    setOptionId((firstActive || options[0])?.id || '');
    setQty(1);
  }, [options]);

  if (loading && !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-white-soft)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-lavender)] border-t-[var(--color-lavender-dark)]" />
      </div>
    );
  }

  if (error?.status === 404) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--color-white-soft)] px-6 text-center">
        <div className="text-5xl">🌸</div>
        <p className="text-[var(--color-ink-soft)]">Produk tidak ditemukan atau sudah tidak dijual.</p>
        <Link to="/" className="rounded-full bg-[var(--color-lavender-dark)] px-6 py-2.5 font-semibold text-white">
          Kembali ke katalog
        </Link>
      </div>
    );
  }

  if (!product) return null;

  const selected = options.find((o) => o.id === optionId);
  const canOrder = product.available && selected?.isActive !== false;

  function addToCart() {
    if (!canOrder || !selected) return false;
    cart.addItem(
      { optionId: selected.id, productId: product.id, productName: product.name, optionName: selected.name, price: selected.price, imageUrl: product.imageUrl },
      qty
    );
    return true;
  }

  function handleAdd() {
    if (addToCart()) toast.success(`${product.name} masuk keranjang ✦`);
  }

  function handleBuyNow() {
    if (addToCart()) navigate('/keranjang');
  }

  return (
    <div className="min-h-screen bg-[var(--color-white-soft)]">
      <TopBar cartCount={cart.count} />

      <article className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <nav className="mb-4 text-sm text-[var(--color-ink-soft)]">
          <Link to="/" className="font-bold text-[var(--color-lavender-dark)] hover:underline">
            Katalog
          </Link>{' '}
          / {product.name}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          {/* Image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-lavender-light)] to-[var(--color-peach-light)] shadow-[var(--shadow-card)]">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-6xl">📦</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="inline-flex rounded-full bg-[var(--color-lavender-light)] px-3 py-1 text-xs font-bold text-[var(--color-lavender-dark)]">
              {product.category}
            </span>
            <h1 className="mt-3 font-display text-3xl font-black text-[var(--color-ink)] sm:text-4xl">{product.name}</h1>
            {product.description && (
              <p className="mt-4 max-w-prose whitespace-pre-line leading-relaxed text-[var(--color-ink-soft)]">
                {product.description}
              </p>
            )}

            {options.length === 0 ? (
              <p className="mt-8 rounded-2xl bg-[var(--color-peach-light)] px-4 py-3 font-semibold text-[var(--color-peach-dark)]">
                Varian untuk produk ini belum tersedia. Hubungi admin lewat WhatsApp untuk menanyakan stok.
              </p>
            ) : (
              <div className="mt-8 space-y-6">
                <section>
                  <h2 className="mb-3 text-lg font-bold text-[var(--color-ink)]">Pilih Varian</h2>
                  <div className="grid gap-2">
                    {options.map((opt) => {
                      const disabled = !opt.isActive;
                      const sel = opt.id === optionId;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => !disabled && setOptionId(opt.id)}
                          className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all ${
                            disabled
                              ? 'cursor-not-allowed opacity-50 border-[var(--color-border)] bg-[var(--color-surface)]'
                              : sel
                                ? 'border-[var(--color-lavender-dark)] bg-[var(--color-lavender-light)]'
                                : 'border-[var(--color-border)] bg-white hover:border-[var(--color-lavender)]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full border-2 ${sel && !disabled ? 'border-[var(--color-lavender-dark)] bg-[var(--color-lavender-dark)]' : 'border-[var(--color-border)]'}`} />
                            <span className="font-semibold text-sm text-[var(--color-ink)]">{opt.name}</span>
                            {disabled && <span className="text-xs text-[var(--color-ink-muted)]">(tidak tersedia)</span>}
                          </span>
                          <span className="font-display font-black text-[var(--color-lavender-dark)]">{formatRupiah(opt.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="mb-2 text-lg font-bold text-[var(--color-ink)]">Jumlah</h2>
                    <QuantityStepper value={qty} onChange={setQty} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--color-ink-muted)]">Subtotal</p>
                    <p className="font-display text-3xl font-black text-[var(--color-lavender-dark)]">
                      {formatRupiah((selected?.price || 0) * qty)}
                    </p>
                  </div>
                </section>

                {!canOrder && (
                  <p className="rounded-2xl bg-[var(--color-surface-alt)] px-4 py-3 text-sm font-semibold text-[var(--color-ink-soft)]">
                    {product.isActive
                      ? 'Varian ini sedang tidak tersedia. Pilih varian lain atau hubungi admin.'
                      : 'Produk ini sedang tidak tersedia untuk dipesan.'}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary" size="lg" className="flex-1" disabled={!canOrder} onClick={handleAdd}>
                    🛒 Tambah ke Keranjang
                  </Button>
                  <Button variant="primary" size="lg" className="flex-1" disabled={!canOrder} onClick={handleBuyNow}>
                    Beli Sekarang ✦
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
