/**
 * TransactionHistory Component
 *
 * Lists recent payments for the connected account.
 */

'use client';

import { useState, useEffect } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaSync, FaArrowUp, FaArrowDown, FaExternalLinkAlt } from 'react-icons/fa';
import { Card, EmptyState } from './example-components';

interface Transaction {
  id: string;
  type: string;
  amount?: string;
  asset?: string;
  from?: string;
  to?: string;
  createdAt: string;
  hash: string;
}

interface TransactionHistoryProps {
  publicKey: string;
}

export default function TransactionHistory({ publicKey }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [limit] = useState(10);

  const fetchTransactions = async () => {
    try {
      setRefreshing(true);
      const txs = await stellar.getRecentTransactions(publicKey, limit);
      setTransactions(txs);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (publicKey) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatAddress = (address?: string): string => {
    if (!address) return 'N/A';
    return stellar.formatAddress(address, 4, 4);
  };

  const isOutgoing = (tx: Transaction): boolean => tx.from === publicKey;

  if (loading) {
    return (
      <Card eyebrow="Activity" title="Recent transactions">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-20 bg-surface-2" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card
      eyebrow="Activity"
      title="Recent transactions"
      action={
        <button
          onClick={fetchTransactions}
          disabled={refreshing}
          className="text-nova transition-colors hover:text-nova-hi disabled:opacity-50"
          title="Refresh transactions"
        >
          <FaSync className={refreshing ? 'animate-spin' : ''} />
        </button>
      }
    >
      {transactions.length === 0 ? (
        <EmptyState
          icon="—"
          title="No transactions yet"
          description="Payments you send or receive on this address will show up here."
        />
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => {
            const outgoing = isOutgoing(tx);

            return (
              <div
                key={tx.id}
                className="border border-line bg-surface-2 p-4 transition-colors hover:border-line-hi"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center ${
                        outgoing ? 'bg-coral/15 text-coral' : 'bg-mint/15 text-mint'
                      }`}
                    >
                      {outgoing ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    <div>
                      <p className="font-medium text-ink">{outgoing ? 'Sent' : 'Received'}</p>
                      {tx.amount && (
                        <p
                          className={`font-display text-lg font-semibold ${
                            outgoing ? 'text-coral' : 'text-mint'
                          }`}
                        >
                          {outgoing ? '-' : '+'}
                          {parseFloat(tx.amount).toFixed(2)} {tx.asset || 'XLM'}
                        </p>
                      )}
                    </div>
                  </div>

                  <a
                    href={stellar.getExplorerLink(tx.hash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-nova transition-colors hover:text-nova-hi"
                  >
                    Details <FaExternalLinkAlt className="text-xs" />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="mb-1 text-xs text-muted">From</p>
                    <p className="font-mono text-ink/80">{formatAddress(tx.from)}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted">To</p>
                    <p className="font-mono text-ink/80">{formatAddress(tx.to)}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <p className="text-xs text-muted">{formatDate(tx.createdAt)}</p>
                  <p className="font-mono text-xs text-muted/70">{tx.hash.slice(0, 12)}...</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {transactions.length > 0 && (
        <p className="mt-4 text-center text-sm text-muted">
          Showing last {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
        </p>
      )}
    </Card>
  );
}
