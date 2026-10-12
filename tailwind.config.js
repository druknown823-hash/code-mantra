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
        vault: {
          bg: '#0d1117',
          card: '#161b22',
          border: '#30363d',
          hover: '#21262d',
          accent: '#58a6ff',
          success: '#238636',
          warning: '#d29922',
          danger: '#da3633',
          subtle: '#8b949e',
          text: '#c9d1d9',
          bright: '#f0f6fc',
          amoled: '#000000',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'Monaco', 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      minHeight: {
        'touch': '48px',
      },
      minWidth: {
        'touch': '48px',
      }
    },
  },
  plugins: [],
}
