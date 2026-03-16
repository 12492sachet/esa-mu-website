/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        crimson: {
          50:  '#fdf2f2',
          100: '#fde3e3',
          200: '#fbcbcb',
          300: '#f7a3a3',
          400: '#f06b6b',
          500: '#e53e3e',
          600: '#c0392b',
          700: '#9b2226',
          800: '#8B1A1A',
          900: '#6b1212',
          950: '#3d0a0a',
        },
        'esamu-pink': '#f9ecec',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up':        'fadeUp 0.6s ease forwards',
        'fade-in':        'fadeIn 0.4s ease forwards',
        'slide-left':     'slideLeft 0.5s ease forwards',
        'spin-slow':      'spin 8s linear infinite',
        'ticker':         'ticker 22s linear infinite',
        'marquee-slow':   'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp:    { '0%': { opacity: '0', transform: 'translateY(24px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideLeft: { '0%': { opacity: '0', transform: 'translateX(30px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        ticker:    { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        marquee:   { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-33.333%)' } },
      },
    },
  },
  plugins: [],
}
