import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
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
          500: '#9C6E93',
          600: '#83567A',
          700: '#714B67', // Primary restrained plum
          800: '#5E3B55', // Dark plum for buttons & focus
          850: '#513249',
          900: '#43293D',
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
        // Dedicated enterprise ERP neutrals
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
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'erp-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'erp-card': '0 1px 4px 0 rgba(0, 0, 0, 0.05), 0 0 1px 1px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};

export default config;
