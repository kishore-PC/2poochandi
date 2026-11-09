/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0E12',
        card: '#181A20',
        gold: '#FACC15',
        border: '#1E293B',
        borderDark: '#000000',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Noto Sans Tamil', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        tamil: ['Noto Sans Tamil', 'Inter', 'Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(250,204,21,0.15), 0 12px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
};
