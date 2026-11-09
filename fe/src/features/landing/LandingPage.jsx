import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { formatRupiah } from '../../lib/format.js';
import { useCart } from '../cart/CartContext.jsx';
import { useConfig } from '../config/ConfigContext.jsx';

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
          className="relative flex items-center gap-2 rounded-full bg-[var(--color-lavender-light)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-lavender)]/50 transition-colors"
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
    <section className="relative overflow-hidden pt-16 pb-16 px-6">
      {/* Banner photo */}
      <div className="relative mx-auto mb-8 h-40 w-full max-w-5xl overflow-hidden rounded-3xl sm:h-56 bg-gradient-to-br from-[var(--color-lavender-light)] via-[var(--color-peach-light)] to-[var(--color-mint-light)]">
        <img src="/banner.jpg" alt="Banner toko" className="h-full w-full object-cover" />
      </div>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-80 w-80 rounded-full bg-[var(--color-lavender)]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[var(--color-peach)]/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-mint)]/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Avatar / foto profil */}
        <div className="mx-auto -mt-20 mb-6 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-[var(--shadow-pop)] bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-peach)]">
          <img src="/profile.jpg" alt={config.storeName} className="h-full w-full object-cover" />
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender-light)] px-4 py-1.5 text-sm font-semibold text-[var(--color-ink)]">
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
          <a
            href="wa.me/6285811367333"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-peach-light)] px-7 py-3 font-semibold text-[var(--color-peach-dark)] hover:bg-[var(--color-peach)]/60 transition-all"
          >
            Whatsapp
          </a>
          <a
            href="https://padlet.com/larasazzara/testiii-s023ij55xl3majuwp0i4"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-lavender-dark)] px-7 py-3 font-semibold text-white hover:bg-[var(--color-lavender-dark)]/90 shadow-[var(--shadow-card)] transition-all"
          >
            Testimoni
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

function ProductCard({ product }) {
  return (
    <Link
      to={`/produk/${product.slug}`}
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-[var(--color-border)] bg-white text-left shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-pop)] hover:-translate-y-1 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-[var(--color-lavender-light)] to-[var(--color-peach-light)]">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl sm:text-5xl">📦</div>
        )}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 max-w-[85%]">
          <span className="block truncate rounded-full bg-[var(--color-lavender-dark)]/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold text-white">
            {product.category}
          </span>
        </div>
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <span className="rounded-full bg-[var(--color-ink)]/80 px-2.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold text-white">Tidak tersedia</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-4 min-w-0">
        <h3 className="font-display font-black text-[var(--color-ink)] text-xs sm:text-base leading-snug line-clamp-2 break-words">
          {product.name}
        </h3>
        {product.description && (
          <p className="hidden sm:block text-xs text-[var(--color-ink-soft)] line-clamp-2">{product.description}</p>
        )}
        <div className="mt-auto flex flex-col gap-1.5 pt-1">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-[var(--color-ink-muted)]">Mulai dari</p>
            <p className="font-display font-black text-[var(--color-lavender-dark)] text-xs sm:text-base truncate">
              {product.minPrice != null ? formatRupiah(product.minPrice) : '-'}
            </p>
          </div>
          <span className="w-full rounded-full bg-[var(--color-lavender-light)] px-2 py-1 sm:px-3 sm:py-1.5 text-center text-[10px] sm:text-xs font-bold text-[var(--color-lavender-dark)]">
            Pilih ✦
          </span>
        </div>
      </div>
    </Link>
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

      
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { config } = useConfig();
  const cart = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
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
              <div className="grid grid-cols-3 gap-2.5 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {displayed.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
    </div>
  );
}
