/**
 * PaymentForm Component
 *
 * The core of Stellify: send XLM to any Stellar address.
 * Validates input, submits via lib/stellar-helper.ts, and surfaces the result.
 */

'use client';

import { useState } from 'react';
import { stellar } from '@/lib/stellar-helper';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { Card, Input, Button, Alert } from './example-components';

interface PaymentFormProps {
  publicKey: string;
  onSuccess?: () => void;
}

export default function PaymentForm({ publicKey, onSuccess }: PaymentFormProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [txHash, setTxHash] = useState('');

  const validateForm = (): boolean => {
    const newErrors: { recipient?: string; amount?: string } = {};

    if (!recipient.trim()) {
      newErrors.recipient = 'Recipient address is required';
    } else if (recipient.length !== 56 || !recipient.startsWith('G')) {
      newErrors.recipient = 'Enter a valid Stellar address (56 characters, starts with G)';
    }

    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (numAmount < 0.0000001) {
        newErrors.amount = 'Amount is too small — minimum is 0.0000001 XLM';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setAlert(null);
      setTxHash('');

      const result = await stellar.sendPayment({
        from: publicKey,
        to: recipient,
        amount: amount,
        memo: memo || undefined,
      });

      if (result.success) {
        setTxHash(result.hash);
        setAlert({ type: 'success', message: 'Payment sent.' });

        setRecipient('');
        setAmount('');
        setMemo('');
        setErrors({});

        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      let errorMessage = "Couldn't send the payment. ";

      if (error.message?.includes('insufficient')) {
        errorMessage += 'Insufficient balance.';
      } else if (error.message?.includes('destination')) {
        errorMessage += 'That destination account looks invalid.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }

      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card eyebrow="Step 2" title="Send XLM">
      {alert && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
        </div>
      )}

      {txHash && (
        <div className="mb-4 border border-mint/30 bg-mint/[0.08] p-4">
          <div className="flex items-start gap-3">
            <FaCheckCircle className="mt-1 flex-shrink-0 text-mint" />
            <div className="flex-1 overflow-hidden">
              <p className="mb-2 font-medium text-mint">Transaction confirmed</p>
              <p className="mb-1 text-xs text-ink/60">Transaction hash</p>
              <p className="mb-3 break-all font-mono text-xs text-ink/90">{txHash}</p>
              <a
                href={stellar.getExplorerLink(txHash, 'tx')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-nova underline decoration-nova/30 underline-offset-4 hover:text-nova-hi"
              >
                View on Stellar Expert →
              </a>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Recipient address"
          placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
          value={recipient}
          onChange={setRecipient}
          error={errors.recipient}
          mono
        />

        <Input
          label="Amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={setAmount}
          error={errors.amount}
          suffix="XLM"
        />

        <Input
          label="Memo (optional)"
          placeholder="Payment for…"
          value={memo}
          onChange={setMemo}
        />

        <div className="pt-2">
          <Button onClick={() => {}} type="submit" variant="primary" disabled={loading} fullWidth>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-[3px] border-solid border-void border-r-transparent" />
                Sending…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <FaPaperPlane />
                Send payment
              </span>
            )}
          </Button>
        </div>
      </form>

      <p className="mt-4 text-xs text-muted">
        Double-check the recipient address — transactions on Stellar are irreversible.
      </p>
    </Card>
  );
}
