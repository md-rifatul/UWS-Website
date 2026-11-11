/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a121c',
          900: '#101D2C', // Deep Navy
          800: '#18293d',
          700: '#22364e',
        },
        charcoal: {
          900: '#182029',
          800: '#202A35', // Charcoal
          700: '#2e3a48',
          600: '#3f4e5f',
        },
        industrial: {
          orange: '#F28C28', // Industrial Orange accent
          'orange-hover': '#e07916',
          'orange-light': '#fdf2e9',
          'orange-dark': '#c4620a',
        },
        slate: {
          muted: '#7B8491', // Slate
          border: '#E2E6EC',
          light: '#F0F2F5',
        },
        surface: {
          offwhite: '#F7F8FA', // Off White
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'premium': '0 10px 25px -5px rgba(16, 29, 44, 0.08), 0 8px 10px -6px rgba(16, 29, 44, 0.04)',
        'card-hover': '0 20px 30px -10px rgba(16, 29, 44, 0.12), 0 10px 10px -5px rgba(16, 29, 44, 0.04)',
      }
    },
  },
  plugins: [],
}

