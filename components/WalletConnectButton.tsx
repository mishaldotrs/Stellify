/**
 * WalletConnectButton — compact connect/disconnect control for the navbar.
 *
 * Mirrors WalletConnection.tsx's logic but stays controlled from the parent
 * page so both stay perfectly in sync (no duplicate connection state).
 */

'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaWallet, FaCopy, FaCheck } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';

interface WalletConnectButtonProps {
  publicKey: string;
  isConnected: boolean;
  onConnect: (publicKey: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnectButton({
  publicKey,
  isConnected,
  onConnect,
  onDisconnect,
}: WalletConnectButtonProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const key = await stellar.connectWallet();
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
    onDisconnect();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isConnected && publicKey) {
    return (
      <div className="flex items-center gap-2 border border-line-hi bg-surface-2 py-1.5 pl-3 pr-1.5">
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-mint" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
        </span>
        <span className="font-mono text-xs text-ink/80">
          {stellar.formatAddress(publicKey)}
        </span>
        <button
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy address'}
          className="flex h-6 w-6 items-center justify-center text-nova transition-colors hover:bg-nova/10 hover:text-nova-hi"
        >
          {copied ? <FaCheck className="text-xs text-mint" /> : <FaCopy className="text-xs" />}
        </button>
        <button
          onClick={handleDisconnect}
          title="Disconnect"
          className="flex h-6 w-6 items-center justify-center text-coral/90 transition-colors hover:bg-coral/10 hover:text-coral"
        >
          <MdLogout className="text-sm" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={loading}
      className="flex items-center gap-2 bg-gold px-4 py-2 text-sm font-medium text-void transition-colors hover:bg-gold-hi disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? (
        <>
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-[2px] border-solid border-void border-r-transparent" />
          Connecting…
        </>
      ) : (
        <>
          <FaWallet className="text-xs" />
          Connect wallet
        </>
      )}
    </button>
  );
}
