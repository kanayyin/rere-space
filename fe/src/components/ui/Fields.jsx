export function TextField({ label, error, hint, className, ...props }) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">{label}</label>}
      <input
        className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-lavender-dark)] focus:ring-2 focus:ring-[var(--color-lavender)]/40 ${
          error ? 'border-red-400 bg-red-50' : 'border-[var(--color-border)] bg-white'
        }`}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{hint}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}

export function TextArea({ label, error, hint, className, ...props }) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">{label}</label>}
      <textarea
        className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-[var(--color-ink-muted)] focus:border-[var(--color-lavender-dark)] focus:ring-2 focus:ring-[var(--color-lavender)]/40 resize-none ${
          error ? 'border-red-400 bg-red-50' : 'border-[var(--color-border)] bg-white'
        }`}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{hint}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}

export function SelectField({ label, error, hint, children, className, ...props }) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-semibold text-[var(--color-ink)]">{label}</label>}
      <select
        className={`w-full rounded-2xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-lavender-dark)] focus:ring-2 focus:ring-[var(--color-lavender)]/40 ${
          error ? 'border-red-400 bg-red-50' : 'border-[var(--color-border)] bg-white'
        }`}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-[var(--color-ink-soft)]">{hint}</p>}
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </div>
  );
}
