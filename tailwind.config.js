const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
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
        'ultra-light-salmon': '#fceaed',
      },
      fontFamily: {
        sans: ['Open-sans', ...defaultTheme.fontFamily.sans],
        title: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        content: '1rem',
        4.5: '1.125rem',
      },
      dropShadow: {
        donde: '0 8px 16px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};