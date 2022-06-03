module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'donde-primary': '#E6334C',
        'donde-secondary': '#FEEBEC',
        'donde-gray-800': '#323239',
        'donde-gray-600': '#5A5A67',
        'donde-gray-400': '#A3A3AF',
        'donde-gray-200': '#F0F0F2',
        'donde-black-100': '#323239',
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
