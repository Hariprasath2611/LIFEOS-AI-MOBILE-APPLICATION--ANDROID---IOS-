/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        card: '#111111',
        primary: '#00FF88',      // Vivid Emerald Green
        secondary: '#00C853',    // Darker Emerald
        textMain: '#FFFFFF',
        mutedText: '#A0A0A0',
        glassBorder: 'rgba(255, 255, 255, 0.08)',
        glassBg: 'rgba(255, 255, 255, 0.03)',
      },
      fontFamily: {
        // System defaults or customizable fonts
        sans: ["System", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}
