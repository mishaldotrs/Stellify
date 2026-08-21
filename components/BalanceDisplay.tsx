/**
 * BalanceDisplay Component
 *
 * Shows the connected account's XLM balance with a manual refresh.
 */

'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaSync } from 'react-icons/fa';
import { Card } from './example-components';

interface BalanceDisplayProps {
  publicKey: string;
}

export default function BalanceDisplay({ publicKey }: BalanceDisplayProps) {
  const [balance, setBalance] = useState<string>('0');
  const [assets, setAssets] = useState<Array<{ code: string; issuer: string; balance: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBalance = async () => {
    try {
      setRefreshing(true);
      const balanceData = await stellar.getBalance(publicKey);
      setBalance(balanceData.xlm);
      setAssets(balanceData.assets);
    } catch (error) {
      console.error('Error fetching balance:', error);
      alert("Couldn't fetch balance. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  const formatBalance = (balance: string): string => {
    const num = parseFloat(balance);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 7,
    });
  };

  if (loading) {
    return (
      <Card eyebrow="Balance">
        <div className="animate-pulse">
          <div className="mb-4 h-16 rounded-xl bg-surface-2" />
          <div className="h-10 w-1/2 rounded-xl bg-surface-2" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      eyebrow="Balance"
      title="Available to send"
      action={
        <button
          onClick={fetchBalance}
          disabled={refreshing}
          className="text-nova transition-colors hover:text-nova-hi disabled:opacity-50"
          title="Refresh balance"
        >
          <FaSync className={refreshing ? 'animate-spin' : ''} />
        </button>
      }
    >
      <div className="rounded-xl border border-line bg-surface-2 p-6">
        <div className="flex items-baseline gap-2">
          <p className="font-display text-5xl font-semibold tracking-tight text-ink">
            {formatBalance(balance)}
          </p>
          <p className="text-xl text-muted">XLM</p>
        </div>
        <p className="mt-2 text-sm text-muted">Stellar Testnet · not real funds</p>
      </div>

      {assets.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs uppercase tracking-[0.1em] text-muted">Other assets</p>
          {assets.map((asset, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-xl border border-line bg-surface-2 p-4"
            >
              <div>
                <p className="font-medium text-ink">{asset.code}</p>
                <p className="max-w-[200px] truncate font-mono text-xs text-muted">
                  {asset.issuer}
                </p>
              </div>
              <p className="text-lg font-semibold text-ink">{formatBalance(asset.balance)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-xl border border-gold/25 bg-gold/[0.06] p-3">
        <p className="text-xs text-gold-hi">
          Keep at least 1 XLM in this account — Stellar holds a minimum reserve per account.
        </p>
      </div>
    </Card>
  );
}
