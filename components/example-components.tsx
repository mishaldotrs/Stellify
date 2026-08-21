/**
 * Stellify UI primitives — shared building blocks used across the dashboard.
 */

'use client';

import { useState } from 'react';

// Loading spinner
export function LoadingSpinner() {
  return (
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]">
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
}

// Balance card
export function BalanceCard({ balance, label }: { balance: string; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-6">
      <p className="mb-2 text-sm text-muted">{label}</p>
      <p className="font-display text-4xl font-semibold text-ink">{balance}</p>
    </div>
  );
}

// Transaction item
export function TransactionItem({
  type,
  amount,
  asset,
  date,
  hash,
  explorerLink,
}: {
  type: string;
  amount?: string;
  asset?: string;
  date: string;
  hash: string;
  explorerLink: string;
}) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 p-4 transition-colors hover:border-line-hi">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <p className="font-medium text-ink">{type}</p>
          {amount && (
            <p className="text-ink/80">
              {amount} {asset || 'XLM'}
            </p>
          )}
        </div>
        <a
          href={explorerLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-nova hover:text-nova-hi"
        >
          View →
        </a>
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{new Date(date).toLocaleString()}</span>
        <span className="font-mono">{hash.slice(0, 8)}...</span>
      </div>
    </div>
  );
}

// Copy button
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="text-sm text-nova hover:text-nova-hi">
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// Alert / toast
export function Alert({
  type,
  message,
  onClose,
}: {
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
}) {
  const styles = {
    success: 'bg-mint/10 border-mint/30 text-mint',
    error: 'bg-coral/10 border-coral/30 text-coral',
    info: 'bg-nova/10 border-nova/30 text-nova-hi',
  };

  return (
    <div
      role="status"
      className={`flex items-center justify-between rounded-xl border px-5 py-4 ${styles[type]}`}
    >
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="ml-4 text-ink/50 hover:text-ink" aria-label="Dismiss">
        ✕
      </button>
    </div>
  );
}

// Card — the base surface used everywhere
export function Card({
  title,
  eyebrow,
  action,
  children,
  className = '',
}: {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] sm:p-7 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// Text input
export function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  mono = false,
  suffix,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  mono?: boolean;
  suffix?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-ink/70">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-surface-2 px-4 py-3 text-ink placeholder-muted transition-colors focus:outline-none ${
            mono ? 'font-mono text-sm' : ''
          } ${suffix ? 'pr-16' : ''} ${
            error ? 'border-coral/60' : 'border-line focus:border-nova/50'
          }`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-coral">{error}</p>}
    </div>
  );
}

// Button
export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  type,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants = {
    primary: 'bg-gold text-void hover:bg-gold-hi',
    secondary: 'bg-surface-3 text-ink border border-line-hi hover:border-nova/50',
    danger: 'bg-coral/15 text-coral border border-coral/30 hover:bg-coral/20',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${
        fullWidth ? 'w-full' : ''
      } rounded-xl px-6 py-3.5 font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

// Empty state
export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="py-12 text-center">
      <div className="mb-4 text-4xl opacity-60">{icon}</div>
      <h3 className="mb-2 font-display text-lg font-medium text-ink">{title}</h3>
      <p className="mx-auto max-w-sm text-sm text-muted">{description}</p>
    </div>
  );
}

// Modal
export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-line p-6">
          <h3 className="font-display text-xl font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="text-xl text-muted hover:text-ink" aria-label="Close">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
