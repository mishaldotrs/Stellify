/**
 * WalletConnection Component
 *
 * Handles wallet connection/disconnection and displays the connected address.
 * All blockchain logic lives in lib/stellar-helper.ts (untouched).
 */

'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaWallet, FaCopy, FaCheck } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { Card } from './example-components';

interface WalletConnectionProps {
  onConnect: (publicKey: string) => void;
  onDisconnect: () => void;
}

const SUPPORTED_WALLETS = ['Freighter', 'xBull', 'Albedo', 'Rabet', 'Lobstr', 'Hana'];

export default function WalletConnection({ onConnect, onDisconnect }: WalletConnectionProps) {
  const [publicKey, setPublicKey] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const key = await stellar.connectWallet();
      setPublicKey(key);
      setIsConnected(true);
      onConnect(key);
    } catch (error: any) {
      console.error('Connection error:', error);
      alert(`Couldn't connect a wallet:\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    stellar.disconnect();
    setPublicKey('');
    setIsConnected(false);
    onDisconnect();
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected) {
    return (
      <Card eyebrow="Step 1" title="Connect a wallet">
        <p className="mb-6 text-sm text-ink/70">
          Connect any Stellar wallet to view your testnet balance and send XLM.
        </p>

        <button
          onClick={handleConnect}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-gold px-6 py-4 font-medium text-void transition-colors hover:bg-gold-hi disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-solid border-void border-r-transparent" />
              Connecting…
            </>
          ) : (
            <>
              <FaWallet />
              Connect wallet
            </>
          )}
        </button>

        <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4">
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
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-mint" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint" />
          </span>
          <span className="text-sm text-ink/70">Wallet connected · Testnet</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="flex items-center gap-2 text-sm text-coral/90 transition-colors hover:text-coral"
        >
          <MdLogout /> Disconnect
        </button>
      </div>

      <div className="rounded-xl border border-line bg-surface-2 p-4">
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
