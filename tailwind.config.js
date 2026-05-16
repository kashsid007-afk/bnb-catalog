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
        bnb: {
          gold:    '#C9975A',
          'gold-light': '#E8D0B0',
          cream:   '#F8F2EA',
          sand:    '#EDE0CE',
          brown:   '#8C6A52',
          dark:    '#3A2E25',
          muted:   '#9A8678',
        },
        wa: '#25D366',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-up':     'fadeUp 0.5s ease both',
        'fade-in':     'fadeIn 0.3s ease both',
        'scale-in':    'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-left':  'slideLeft 0.3s ease both',
        'pulse-gold':  'pulseGold 2s ease infinite',
        'shimmer':     'shimmer 1.4s infinite',
      },
      keyframes: {
        fadeUp:     { from:{ opacity:0, transform:'translateY(14px)' }, to:{ opacity:1, transform:'translateY(0)' } },
        fadeIn:     { from:{ opacity:0 }, to:{ opacity:1 } },
        scaleIn:    { from:{ opacity:0, transform:'scale(0.94)' }, to:{ opacity:1, transform:'scale(1)' } },
        slideLeft:  { from:{ opacity:0, transform:'translateX(-16px)' }, to:{ opacity:1, transform:'translateX(0)' } },
        pulseGold:  { '0%,100%':{ opacity:1 }, '50%':{ opacity:0.5 } },
        shimmer:    { '0%':{ backgroundPosition:'-400px 0' }, '100%':{ backgroundPosition:'400px 0' } },
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
