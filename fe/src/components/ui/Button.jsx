export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const base = 'inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-lavender)] disabled:opacity-50 disabled:pointer-events-none rounded-full';

const variants = {
  primary: 'bg-[var(--color-ink)] text-white hover:bg-[var(--color-lavender-dark)]/90 shadow-[var(--shadow-card)]',
  secondary: 'bg-[var(--color-lavender-light)] text-[var(--color-lavender-dark)] hover:bg-[var(--color-lavender)]/60',
  ghost: 'hover:bg-[var(--color-surface-alt)] text-[var(--color-ink-soft)]',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  soft: 'bg-[var(--color-surface-alt)] text-[var(--color-ink)] hover:bg-[var(--color-border)]',
  mint: 'bg-[var(--color-mint-dark)] text-white hover:bg-[var(--color-mint-dark)]/90',
};

const sizes = {
  sm: 'px-4 py-1.5 text-sm',
  md: 'px-5 py-2 text-sm',
  lg: 'px-7 py-3 text-base',
};

export function buttonClasses({ variant = 'primary', size = 'md' } = {}) {
  return cn(base, variants[variant] || variants.primary, sizes[size] || sizes.md);
}

export function Button({ variant = 'primary', size = 'md', loading, children, className, ...props }) {
  return (
    <button className={cn(buttonClasses({ variant, size }), className)} disabled={loading || props.disabled} {...props}>
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  );
}

export function LinkButton({ to, variant = 'primary', size = 'md', children, className, ...props }) {
  return (
    <a href={to} className={cn(buttonClasses({ variant, size }), className)} {...props}>
      {children}
    </a>
  );
}
