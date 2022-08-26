const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    minWidth: {
      '60rem': '60rem',
    },
    maxWidth: {
      '60rem': '60rem',
    },
    extend: {
      colors: {
        primary: '#E6334C',
        secondary: '#FEEBEC',
        black: '#323239',
        warning: '#E1980A',
        danger: '#DB3500',
        success: '#49C462',
        'dark-gray': '#5A5A67',
        'medium-gray': '#A3A3AF',
        'light-gray': '#D1D1D7',
        'ultra-light-gray': '#F0F0F2',
        'ultra-light-salmon': '#fceaed',
        'dark-semi-transparent': 'rgba(50, 50, 57, 0.7)',
      },
      backgroundImage: {
        'modal-image': "url('../assets/images/bg-modal.png')",
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
