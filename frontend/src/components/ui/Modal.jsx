import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-3xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-[var(--color-ink)]/30 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${widths[size] || widths.md} max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--color-white-soft)] shadow-[var(--shadow-pop)]`}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-white-soft)] px-6 py-4">
          <h2 className="font-display text-lg font-bold text-[var(--color-ink)]">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-alt)] text-[var(--color-ink-soft)] hover:bg-[var(--color-border)] transition-colors"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
