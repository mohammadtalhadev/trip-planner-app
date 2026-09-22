import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Outfit', '"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Enforce consistent cool slate palette site-wide, eliminating warm brownish tones
        stone: colors.slate,
        sand: colors.slate,
        primary: {
          DEFAULT: '#c2410c',
          hover: '#b91c1c',
          active: '#9a3412',
        },
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#c2410c', // Terracotta crimson from Light Frost design
          700: '#b91c1c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        frost: {
          50: '#f8fafd',
          100: '#f0f4fc',
          200: '#e2ebf9',
          300: '#c7daf4',
          400: '#7db3f0',
          500: '#38bdf8', // Cyan accent
          600: '#0ea5e9', // Vibrant blue
          700: '#0284c7',
          800: '#0369a1',
          900: '#075985',
        },
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 8px 30px -4px rgba(20, 30, 80, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'float': '0 16px 36px -4px rgba(20, 30, 80, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'frost': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
