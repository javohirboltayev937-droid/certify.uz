/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE',
          300: '#93C5FD', 400: '#60A5FA', 500: '#3B82F6',
          600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
        },
        navy: {
          950: '#020B18', 900: '#080f1e', 800: '#0d1530',
          700: '#111d42', 600: '#1a2854',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dot-grid': 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)',
      },
      backgroundSize: {
        'dot-sm': '24px 24px',
        'dot-md': '32px 32px',
        'dot-lg': '48px 48px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.08)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10)',
        'neon-purple': '0 0 25px rgba(139,92,246,0.55), 0 0 60px rgba(139,92,246,0.2)',
        'neon-blue': '0 0 25px rgba(59,130,246,0.55), 0 0 60px rgba(59,130,246,0.2)',
        'neon-cyan': '0 0 20px rgba(34,211,238,0.45), 0 0 50px rgba(34,211,238,0.15)',
        'neon-emerald': '0 0 20px rgba(16,185,129,0.45), 0 0 50px rgba(16,185,129,0.15)',
        glass: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.07)',
        'glass-lg': '0 16px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.07)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-18px)' } },
        floatSlow: { '0%,100%': { transform: 'translateY(0) rotate(2deg)' }, '50%': { transform: 'translateY(-12px) rotate(-2deg)' } },
        glowPulse: {
          '0%,100%': { boxShadow: '0 0 20px rgba(139,92,246,0.35)' },
          '50%': { boxShadow: '0 0 50px rgba(139,92,246,0.75), 0 0 100px rgba(139,92,246,0.25)' },
        },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        scanLine: { '0%': { top: '0%', opacity: '1' }, '100%': { top: '100%', opacity: '0.3' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(28px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        spinSlow: { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        blob: {
          '0%,100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        ping: {
          '75%,100%': { transform: 'scale(2)', opacity: '0' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        borderGlow: {
          '0%,100%': { borderColor: 'rgba(139,92,246,0.3)' },
          '50%': { borderColor: 'rgba(139,92,246,0.8)' },
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'scan-line': 'scanLine 1.8s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'spin-slow': 'spinSlow 22s linear infinite',
        'blob': 'blob 9s ease-in-out infinite',
        'ping': 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        'border-glow': 'borderGlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
