/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          900: '#07090E',
          800: '#0D1117',
          700: '#161B26',
          600: '#212A3E',
          500: '#323E59',
        },
        terminal: {
          green: '#10B981',
          emerald: '#059669',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          rose: '#F43F5E',
          indigo: '#6366F1',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
