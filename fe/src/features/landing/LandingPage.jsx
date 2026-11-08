import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatRupiah } from '../../lib/format.js';
import { useCart } from '../cart/CartContext.jsx';
import { useConfig } from '../config/ConfigContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import ProductModal from './ProductModal.jsx';
import { Button } from '../../components/ui/Button.jsx';

function NavBar({ cartCount }) {
  const { config } = useConfig();
  return (
    <nav className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[var(--color-white-soft)]/80 border-b border-[var(--color-border)]">
      <span className="font-display text-xl font-black text-[var(--color-lavender-dark)]">
        ✦ {config.storeName}
      </span>
      <div className="flex items-center gap-3">
        <Link
          to="/keranjang"
          className="relative flex items-center gap-2 rounded-full bg-[var(--color-lavender-light)] px-4 py-2 text-sm font-semibold text-[var(--color-lavender-dark)] hover:bg-[var(--color-lavender)]/50 transition-colors"
        >
          🛒 Keranjang
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-lavender-dark)] text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

function HeroSection({ config }) {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 px-6">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[var(--color-lavender)]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[var(--color-peach)]/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-mint)]/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Avatar / logo area */}
        <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-peach)] shadow-[var(--shadow-pop)] text-5xl">
          🛍️
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender-light)] px-4 py-1.5 text-sm font-semibold text-[var(--color-lavender-dark)]">
          ⋆˙⟡ Toko digital terpercaya
        </div>

        <h1 className="font-display text-4xl font-black text-[var(--color-ink)] sm:text-6xl leading-tight">
          {config.storeName} ✦
        </h1>
        <p className="mt-4 text-[var(--color-ink-soft)] text-lg max-w-xl mx-auto">
          Akun premium digital terbaik dengan harga terjangkau. Proses cepat, garansi ada! 🌸
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#katalog"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender-dark)] px-7 py-3 font-semibold text-white hover:bg-[var(--color-lavender-dark)]/90 shadow-[var(--shadow-card)] transition-all"
          >
            Lihat Produk ✦
          </a>
          <a
            href="#cara-order"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-peach-light)] px-7 py-3 font-semibold text-[var(--color-peach-dark)] hover:bg-[var(--color-peach)]/60 transition-all"
          >
            Cara Order ♡
          </a>
        </div>

        {/* Stats */}
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {[['🌸', '500+', 'Pelanggan'], ['⚡', 'Proses', 'Cepat'], ['💎', 'Kualitas', 'Premium']].map(([icon, val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{icon}</span>
              <span className="font-display text-xl font-black text-[var(--color-lavender-dark)]">{val}</span>
              <span className="text-xs text-[var(--color-ink-soft)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
          active === ''
            ? 'bg-[var(--color-lavender-dark)] text-white shadow-[var(--shadow-card)]'
            : 'bg-[var(--color-surface-alt)] text-[var(--color-ink-soft)] hover:bg-[var(--color-lavender-light)]'
        }`}
      >
        ✦ Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
            active === cat
              ? 'bg-[var(--color-lavender-dark)] text-white shadow-[var(--shadow-card)]'
              : 'bg-[var(--color-surface-alt)] text-[var(--color-ink-soft)] hover:bg-[var(--color-lavender-light)]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product, onSelect }) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="group relative flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-white text-left shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-pop)] hover:-translate-y-1 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[var(--color-lavender-light)] to-[var(--color-peach-light)]">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl sm:text-5xl">📦</div>
        )}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3">
          <span className="rounded-full bg-[var(--color-lavender-dark)]/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white">
            {product.category}
          </span>
        </div>
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full bg-[var(--color-ink)]/80 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-white">Tidak tersedia</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-4 gap-2">
        <h3 className="font-display font-black text-xs sm:text-base text-[var(--color-ink)] line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="hidden sm:block text-xs text-[var(--color-ink-soft)] line-clamp-2">{product.description}</p>
        )}

        <div className="mt-auto flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-[var(--color-ink-muted)]">Mulai dari</p>
            <p className="font-display font-black text-xs sm:text-base text-[var(--color-lavender-dark)] truncate">
              {product.minPrice != null ? formatRupiah(product.minPrice) : '-'}
            </p>
          </div>
          <span className="shrink-0 w-full sm:w-auto text-center rounded-full bg-[var(--color-lavender-light)] px-3 py-1.5 sm:py-1 text-[10px] sm:text-xs font-bold text-[var(--color-lavender-dark)]">
            Pilih ✦
          </span>
        </div>
      </div>
    </button>
  );
}

function HowToOrder({ config }) {
  const steps = [
    { icon: '🛍️', title: 'Pilih Produk', desc: 'Pilih produk dan varian yang kamu inginkan dari katalog.' },
    { icon: '🛒', title: 'Tambah ke Keranjang', desc: 'Masukkan ke keranjang, sesuaikan jumlah sesuai kebutuhan.' },
    { icon: '📝', title: 'Isi Data & Checkout', desc: 'Isi nama dan nomor WhatsApp untuk konfirmasi pesanan.' },
    { icon: '💬', title: 'Konfirmasi via WA', desc: 'Tim kami akan menghubungimu untuk proses pembayaran.' },
  ];

  return (
    <section id="cara-order" className="py-16 px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-peach-light)] px-4 py-1.5 text-sm font-semibold text-[var(--color-peach-dark)]">
            ♡ Mudah banget!
          </div>
          <h2 className="font-display text-3xl font-black text-[var(--color-ink)]">Cara Order</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="relative rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-lavender-light)] text-2xl">
                {s.icon}
              </div>
              <div className="absolute right-4 top-4 font-display text-4xl font-black text-[var(--color-border)]">{i + 1}</div>
              <h3 className="font-display font-black text-[var(--color-ink)]">{s.title}</h3>
              <p className="mt-1 text-sm text-[var(--color-ink-soft)]">{s.desc}</p>
            </div>
          ))}
        </div>

        {config.adminWhatsapp && (
          <div className="mt-8 text-center">
            <a
              href={`https://wa.me/${config.adminWhatsapp}?text=${encodeURIComponent('Halo kak, saya mau tanya-tanya soal produk ✦')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-500 px-7 py-3 font-semibold text-white hover:bg-green-600 transition-colors shadow-[var(--shadow-card)]"
            >
              💬 Chat Admin WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { config } = useConfig();
  const cart = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api.get('/public/catalog/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    api.get(`/public/catalog/products${activeCategory ? `?category=${encodeURIComponent(activeCategory)}` : ''}`)
      .then(setProducts).catch(() => {});
    setShowAll(false);
  }, [activeCategory]);

  const displayed = showAll ? products : products.slice(0, 6);

  function handleAddToCart(product, optionId, qty) {
    const option = product.options.find((o) => o.id === optionId);
    if (!option) return;
    cart.addItem({ optionId: option.id, productId: product.id, productName: product.name, optionName: option.name, price: option.price, imageUrl: product.imageUrl }, qty);
    toast.success(`${product.name} masuk keranjang ✦`);
    setSelectedProduct(null);
  }

  function handleBuyNow(product, optionId, qty) {
    const option = product.options.find((o) => o.id === optionId);
    if (!option) return;
    cart.addItem({ optionId: option.id, productId: product.id, productName: product.name, optionName: option.name, price: option.price, imageUrl: product.imageUrl }, qty);
    setSelectedProduct(null);
    navigate('/keranjang');
  }

  return (
    <div className="min-h-screen bg-[var(--color-white-soft)]">
      <NavBar cartCount={cart.count} />
      <HeroSection config={config} />

      {/* Catalog section */}
      <section id="katalog" className="py-12 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-mint-light)] px-4 py-1.5 text-sm font-semibold text-[var(--color-mint-dark)]">
              ⋆˙⟡ Pilih kategori favoritmu
            </div>
            <h2 className="font-display text-3xl font-black text-[var(--color-ink)]">Katalog Produk</h2>
          </div>

          <div className="mb-6 flex justify-center">
            <CategoryPills categories={categories} active={activeCategory} onChange={setActiveCategory} />
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center text-[var(--color-ink-soft)]">
              <div className="mb-3 text-4xl">🌸</div>
              <p>Belum ada produk di kategori ini.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-1 grid-cols-3 ">
                {displayed.map((p) => (
                  <ProductCard key={p.id} product={p} onSelect={setSelectedProduct} />
                ))}
              </div>
              {!showAll && products.length > 6 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--color-lavender-dark)] px-7 py-3 font-semibold text-[var(--color-lavender-dark)] hover:bg-[var(--color-lavender-light)] transition-all"
                  >
                    Cek Katalog Lengkap ✦ ({products.length - 6} lainnya)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <HowToOrder config={config} />

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-6 text-center">
        <p className="font-display font-bold text-[var(--color-lavender-dark)]">✦ {config.storeName}</p>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">Toko digital premium · Proses cepat & terpercaya 🌸</p>
      </footer>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />
      )}
    </div>
  );
}
