/**
 * Stellify — Main Dashboard
 *
 * All blockchain logic lives in lib/stellar-helper.ts (untouched).
 * This page composes the UI: wallet connection, balance, payment form,
 * and transaction history.
 */

'use client';

import { useState } from 'react';
import WalletConnection from '@/components/WalletConnection';
import BalanceDisplay from '@/components/BalanceDisplay';
import PaymentForm from '@/components/PaymentForm';
import TransactionHistory from '@/components/TransactionHistory';

const STAR_POSITIONS = [
  { top: '12%', left: '8%', size: 2, delay: '0s' },
  { top: '22%', left: '82%', size: 3, delay: '0.6s' },
  { top: '58%', left: '92%', size: 2, delay: '1.4s' },
  { top: '72%', left: '18%', size: 2, delay: '2.1s' },
  { top: '38%', left: '48%', size: 3, delay: '0.9s' },
  { top: '85%', left: '60%', size: 2, delay: '1.8s' },
  { top: '10%', left: '55%', size: 2, delay: '2.6s' },
  { top: '65%', left: '35%', size: 2, delay: '0.3s' },
];

function Logomark() {
  return (
    <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line-hi bg-surface-2">
      <span className="h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(242,184,87,0.55)]" />
      <span className="absolute h-6 w-6 rounded-full border border-nova/40" />
    </div>
  );
}

function TrajectoryHero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-8 sm:p-12">
      <div className="starfield">
        {STAR_POSITIONS.map((s, i) => (
          <span
            key={i}
            className="animate-twinkle"
            style={{
              top: s.top,
              left: s.left,
              width: s.size,
              height: s.size,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>

      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="animate-rise">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-gold-hi">
            Stellar · Testnet
          </p>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-5xl">
            Send XLM anywhere,
            <br />
            in a few seconds.
          </h1>
          <p className="mt-4 max-w-md text-ink/70">
            Stellify is a minimal payment dApp for the Stellar network. Connect a
            wallet, enter an address and an amount, and the payment settles on
            testnet in moments.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span>~3–5s settlement</span>
            <span>Fees near zero</span>
            <span>No account required</span>
          </div>
        </div>

        {/* Signature element: a payment tracing a path from wallet to recipient */}
        <div className="relative h-40 w-full sm:h-48">
          <svg viewBox="0 0 400 140" className="h-full w-full" aria-hidden="true">
            <path
              d="M 8 70 C 120 10, 260 130, 392 40"
              fill="none"
              stroke="rgba(124,147,255,0.28)"
              strokeWidth="2"
              strokeDasharray="2 10"
              strokeLinecap="round"
              className="animate-dash"
            />
            <circle cx="8" cy="70" r="7" fill="#12162A" stroke="#7C93FF" strokeWidth="2" />
            <circle cx="392" cy="40" r="7" fill="#12162A" stroke="#F2B857" strokeWidth="2" />
          </svg>
          <div
            className="trail-path animate-trail-dot absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_3px_rgba(242,184,87,0.6)]"
            style={{ offsetRotate: '0deg' }}
          />
          <span className="absolute bottom-2 left-0 text-xs text-nova-hi">Your wallet</span>
          <span className="absolute right-0 top-2 text-xs text-gold-hi">Recipient</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleConnect = (key: string) => {
    setPublicKey(key);
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setPublicKey('');
    setIsConnected(false);
  };

  const handlePaymentSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-void bg-stardust">
      {/* Header */}
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Logomark />
            <div>
              <p className="font-display text-lg font-semibold leading-none text-ink">
                Stellify
              </p>
              <p className="mt-1 text-xs text-muted">Payment dApp on Stellar</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden rounded-full border border-gold/30 bg-gold/[0.08] px-3 py-1 text-xs font-medium text-gold-hi sm:inline-block">
              Testnet
            </span>
            <a
              href="https://laboratory.stellar.org/#account-creator?network=test"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink/60 transition-colors hover:text-ink"
            >
              Get testnet XLM
            </a>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {!isConnected && (
          <div className="mb-8">
            <TrajectoryHero />
          </div>
        )}

        <div className="mb-8">
          <WalletConnection onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>

        {isConnected && publicKey && (
          <div className="space-y-8">
            <div key={`balance-${refreshKey}`}>
              <BalanceDisplay publicKey={publicKey} />
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <PaymentForm publicKey={publicKey} onSuccess={handlePaymentSuccess} />
              <div key={`history-${refreshKey}`}>
                <TransactionHistory publicKey={publicKey} />
              </div>
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: '01',
                title: 'Install a wallet',
                copy: 'Freighter, xBull, Lobstr, Albedo, or any supported Stellar wallet.',
              },
              {
                n: '02',
                title: 'Connect',
                copy: 'Click connect above and approve the request in your wallet.',
              },
              {
                n: '03',
                title: 'Fund the account',
                copy: 'Use Stellar Laboratory to fund your testnet address for free.',
              },
              {
                n: '04',
                title: 'Send a payment',
                copy: 'Enter an address and amount, then send. It settles in seconds.',
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <p className="mb-3 font-mono text-xs text-nova">{step.n}</p>
                <h3 className="mb-1.5 font-medium text-ink">{step.title}</h3>
                <p className="text-sm text-muted">{step.copy}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center sm:px-6">
          <p className="text-sm text-muted">Stellify · built on the Stellar SDK</p>
          <p className="mt-1 text-xs text-muted/70">
            Running on Stellar Testnet — this app does not move real funds.
          </p>
        </div>
      </footer>
    </div>
  );
}
