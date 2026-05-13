import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1B2B',
        'ink-soft': '#1A2C40',
        paper: '#F7F4EC',
        'paper-deep': '#EFE9D8',
        accent: '#B8862A',
        'accent-soft': '#E8D9B5',
        muted: '#5B6776',
        line: '#E2DCCB',
        danger: '#9C2A2A',
        success: '#2F6B4C',
        cancelled: '#8A7A55',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        soft: '0 1px 0 rgba(11,27,43,.04), 0 8px 24px -12px rgba(11,27,43,.18)',
        lift: '0 1px 0 rgba(11,27,43,.06), 0 16px 32px -16px rgba(11,27,43,.25)',
        inner: 'inset 0 -1px 0 rgba(11,27,43,.06)',
      },
      borderRadius: {
        lg: '10px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in-fast': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'slide-up': {
          '0%': { opacity: 0, transform: 'translateY(12px) scale(.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in .35s ease-out both',
        'fade-in-fast': 'fade-in-fast .15s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        'slide-up': 'slide-up .25s cubic-bezier(.2,.7,.2,1) both',
      },
    },
  },
  plugins: [forms({ strategy: 'class' })],
};
