/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0A0C16',
        surface: '#12162A',
        'surface-2': '#1A2038',
        'surface-3': '#232B4A',
        line: 'rgba(233,231,246,0.09)',
        'line-hi': 'rgba(233,231,246,0.18)',
        gold: '#F2B857',
        'gold-hi': '#FFD37E',
        nova: '#7C93FF',
        'nova-hi': '#9DB0FF',
        coral: '#FF6E6E',
        mint: '#5FE3A1',
        ink: '#F3F1E9',
        muted: '#8B90AC',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        stardust:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,147,255,0.16), transparent), radial-gradient(ellipse 60% 40% at 85% 10%, rgba(242,184,87,0.10), transparent)',
      },
      keyframes: {
        'trail-dot': {
          '0%': { offsetDistance: '0%', opacity: '0' },
          '8%': { opacity: '1' },
          '92%': { opacity: '1' },
          '100%': { offsetDistance: '100%', opacity: '0' },
        },
        dash: {
          to: { strokeDashoffset: '-24' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        rise: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        'trail-dot': 'trail-dot 3.2s ease-in-out infinite',
        dash: 'dash 1.2s linear infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.2,0.6,0.4,1) infinite',
        rise: 'rise 0.5s ease-out both',
        twinkle: 'twinkle 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
