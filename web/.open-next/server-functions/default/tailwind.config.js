/**
 * TAILWIND VERSION LOCKED TO v3.4.19
 *
 * DO NOT UPGRADE TO v4 - Tailwind v4's scanner misinterprets JSON color
 * values in src/ token files as Tailwind class names, causing build failures.
 *
 * Pattern ported from Vete (ai-whisperers/vete).
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Design system border radius tokens
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      // Design system shadows
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        button: 'var(--shadow-button)',
        nav: 'var(--shadow-nav)',
      },
      // Transition durations from tokens
      transitionDuration: {
        fast: 'var(--transition-fast)',
        normal: 'var(--transition-normal)',
        slow: 'var(--transition-slow)',
      },
      // Theme-driven colors via CSS variables (hex, NOT hsl-wrapped)
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          light: 'var(--surface-light)',
        },
        success: 'var(--success)',
        error: 'var(--error)',
        warning: 'var(--warning)',
      },
      // Animation keyframes
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.6s ease-out',
        'bounce-in': 'bounce-in 0.6s ease-out',
      },
    },
  },
  plugins: [],
}
