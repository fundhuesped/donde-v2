const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E6334C',
        secondary: '#FEEBEC',
        black: '#323239',
        'dark-gray': '#5A5A67',
        'medium-gray': '#A3A3AF',
        'light-gray': '#D1D1D7',
        'ultra-light-gray': '#F0F0F2',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        4.5: '1.125rem',
      },
      dropShadow: {
        donde: '0 8px 16px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
