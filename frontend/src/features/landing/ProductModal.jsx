import { useState } from 'react';
import { formatRupiah } from '../../lib/format.js';
import Modal from '../../components/ui/Modal.jsx';
import { Button } from '../../components/ui/Button.jsx';

function QuantityStepper({ value, onChange }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-surface-alt)] font-bold text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors"
      >
        −
      </button>
      <span className="w-6 text-center font-bold text-[var(--color-ink)]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(20, value + 1))}
        className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-surface-alt)] font-bold text-[var(--color-ink)] hover:bg-[var(--color-border)] transition-colors"
      >
        +
      </button>
    </div>
  );
}

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-[var(--color-ink)] hover:bg-[var(--color-surface-alt)] transition-colors"
      >
        <span>{title}</span>
        <span className={`text-[var(--color-lavender-dark)] transition-transform ${open ? 'rotate-180' : ''}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-ink-soft)] whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  );
}

export default function ProductModal({ product, onClose, onAddToCart, onBuyNow }) {
  const activeOptions = product.options?.filter((o) => o.isActive) || [];
  const [optionId, setOptionId] = useState(activeOptions[0]?.id || product.options?.[0]?.id || '');
  const [qty, setQty] = useState(1);

  const selected = product.options?.find((o) => o.id === optionId);
  const canOrder = product.available && selected?.isActive !== false;

  return (
    <Modal open onClose={onClose} title={product.name} size="md">
      <div className="space-y-5">
        {/* Image */}
        {product.imageUrl ? (
          <div className="overflow-hidden rounded-2xl aspect-video bg-gradient-to-br from-[var(--color-lavender-light)] to-[var(--color-peach-light)]">
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-lavender-light)] to-[var(--color-peach-light)] text-5xl">
            📦
          </div>
        )}

        {/* Category badge */}
        <span className="inline-flex rounded-full bg-[var(--color-lavender-light)] px-3 py-1 text-xs font-bold text-[var(--color-lavender-dark)]">
          {product.category}
        </span>

        {/* Variant picker */}
        {product.options?.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-semibold text-[var(--color-ink)]">Pilih Varian</p>
            <div className="grid gap-2">
              {product.options.map((opt) => {
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
          </div>
        )}

        {/* Qty + subtotal */}
        <div className="flex items-center justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-[var(--color-ink)]">Jumlah</p>
            <QuantityStepper value={qty} onChange={setQty} />
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--color-ink-muted)]">Subtotal</p>
            <p className="font-display text-2xl font-black text-[var(--color-lavender-dark)]">
              {formatRupiah((selected?.price || 0) * qty)}
            </p>
          </div>
        </div>

        {/* Description accordion */}
        {product.description && (
          <Accordion title="📋 Deskripsi Produk">
            {product.description}
          </Accordion>
        )}

        {/* Unavailable message */}
        {!canOrder && (
          <p className="rounded-2xl bg-[var(--color-peach-light)] px-4 py-3 text-sm font-semibold text-[var(--color-peach-dark)]">
            {product.isActive
              ? 'Varian ini sedang tidak tersedia. Pilih varian lain ya kak ♡'
              : 'Produk ini sedang tidak tersedia untuk dipesan.'}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            disabled={!canOrder}
            onClick={() => onAddToCart(product, optionId, qty)}
          >
            🛒 Keranjang
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            disabled={!canOrder}
            onClick={() => onBuyNow(product, optionId, qty)}
          >
            Beli Sekarang ✦
          </Button>
        </div>
      </div>
    </Modal>
  );
}
