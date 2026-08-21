import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stellify · Send XLM on Stellar',
  description:
    'Stellify is a simple payment dApp for the Stellar network — connect a wallet and send XLM to any address in seconds. Testnet only.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-void text-ink">{children}</body>
    </html>
  );
}
