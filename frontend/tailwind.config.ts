import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Restrained Plum / Muted Purple primary accent (ERP / Odoo-inspired)
        brand: {
          50: '#FAF6F9',
          100: '#F4ECF2',
          200: '#EADBE6',
          300: '#D8BFD2',
          400: '#BD99B6',
          500: '#714B67', // Primary restrained plum
          600: '#643F5B',
          700: '#5E3B55',
          800: '#513249',
          850: '#482B40',
          900: '#3E2336',
          950: '#281724',
        },
        // Subtle warm wood/tan secondary accent
        wood: {
          50: '#FAF7F4',
          100: '#F3ECE5',
          200: '#E5D7CA',
          300: '#D2BDAA',
          400: '#BA9E85',
          500: '#A18065',
          600: '#86664D',
          700: '#6D513C',
          800: '#563E2D',
          900: '#463224',
          950: '#2C1E15',
        },
        // Dark navy / charcoal text hierarchy (Dashboard)
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
        // Clean neutral workspace surfaces
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F8F9FA',
          tertiary: '#F1F3F5',
          border: '#E5E7EB',
        },
        // Semantic status colors (green ONLY for success)
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
        // Enterprise ERP neutrals
        erp: {
          bg: '#F9FAFB',
          surface: '#FFFFFF',
          border: '#E5E7EB',
          muted: '#6B7280',
          darkBg: '#0F1216',
          darkSurface: '#181B20',
          darkBorder: '#272B33',
          darkMuted: '#9CA3AF',
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
        display: ['2rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        heading: ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        subheading: ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        body: ['0.875rem', { lineHeight: '1.25rem' }],
        caption: ['0.75rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
        sidebar: '2px 0 8px -2px rgb(0 0 0 / 0.08)',
        'erp-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'erp-card': '0 1px 4px 0 rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.03)',
      },
      borderRadius: {
        card: '0.5rem',
      },
      maxWidth: {
        dashboard: '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
