import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f5f2',
          100: '#b3e0d6',
          200: '#80ccba',
          300: '#4db89e',
          400: '#26a88a',
          500: '#0D6B58',
          600: '#0b5e4d',
          700: '#094e40',
          800: '#073e33',
          900: '#042e26',
          950: '#021f1a',
        },
        wood: {
          50: '#faf5eb',
          100: '#f0e4c4',
          200: '#e5d29d',
          300: '#dbc076',
          400: '#c9a84e',
          500: '#8B6914',
          600: '#7a5c12',
          700: '#664d0f',
          800: '#523e0c',
          900: '#3d2f09',
          950: '#291f06',
        },
        navy: {
          50: '#f0f1f4',
          100: '#d1d4dc',
          200: '#b2b7c4',
          300: '#939aad',
          400: '#7c849a',
          500: '#2C3345',
          600: '#262d3d',
          700: '#1f2533',
          800: '#191e29',
          900: '#12161f',
          950: '#0b0e14',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary: '#F1F3F5',
          border: '#E5E7EB',
        },
        status: {
          success: '#16A34A',
          'success-bg': '#F0FDF4',
          warning: '#D97706',
          'warning-bg': '#FFFBEB',
          danger: '#DC2626',
          'danger-bg': '#FEF2F2',
          info: '#2563EB',
          'info-bg': '#EFF6FF',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'heading': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'subheading': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.25rem' }],
        'caption': ['0.75rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        'sidebar': '2px 0 8px -2px rgb(0 0 0 / 0.08)',
      },
      borderRadius: {
        'card': '0.5rem',
      },
      maxWidth: {
        'dashboard': '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
