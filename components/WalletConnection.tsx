/**
 * WalletConnection Component
 *
 * Informational only — the actual connect/disconnect action lives in the
 * navbar (WalletConnectButton). This just tells the user what to do and,
 * once connected, shows their address for reference.
 */

'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaWallet, FaCopy, FaCheck } from 'react-icons/fa';
import { Card } from './example-components';

interface WalletConnectionProps {
  publicKey: string;
  isConnected: boolean;
}

const SUPPORTED_WALLETS = ['Freighter', 'xBull', 'Albedo', 'Rabet', 'Lobstr', 'Hana'];

export default function WalletConnection({ publicKey, isConnected }: WalletConnectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <Card eyebrow="Step 1" title="Connect a wallet">
        <p className="mb-6 text-sm text-ink/70">
          Use the{' '}
          <span className="inline-flex items-center gap-1.5 font-medium text-gold-hi">
            <FaWallet className="text-xs" /> Connect wallet
          </span>{' '}
          button in the top-right corner to link a Stellar wallet and start sending XLM.
        </p>

        <div className="border border-line bg-surface-2 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-muted">
            Supported wallets
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-ink/70 sm:grid-cols-3">
            {SUPPORTED_WALLETS.map((w) => (
              <div key={w} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-nova" />
                {w}
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-mint" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
        </span>
        <span className="text-sm text-ink/70">Wallet connected · Testnet</span>
      </div>

      <div className="border border-line bg-surface-2 p-4">
        <p className="mb-2 text-xs text-muted">Your address</p>
        <div className="flex items-center justify-between gap-3">
          <p className="break-all font-mono text-sm text-ink">{publicKey}</p>
          <button
            onClick={handleCopyAddress}
            className="flex-shrink-0 text-lg text-nova transition-colors hover:text-nova-hi"
            title={copied ? 'Copied!' : 'Copy address'}
          >
            {copied ? <FaCheck className="text-mint" /> : <FaCopy />}
          </button>
        </div>
      </div>

      <a
        href={stellar.getExplorerLink(publicKey, 'account')}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block text-sm text-nova underline decoration-nova/30 underline-offset-4 hover:text-nova-hi"
      >
        View on Stellar Expert →
      </a>
    </Card>
  );
}
