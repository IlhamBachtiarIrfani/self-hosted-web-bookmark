/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        'sans': ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        'slide-in-out': {
          '0%': {
            transform: 'translateX(100%)',
            opacity: '0',
          },
          '5%': {
            opacity: '1',
            transform: 'translateX(0%)',
          },
          '95%': {
            transform: 'translateX(0%)',
            opacity: '1',
          },
          '100%': {
            opacity: '0',
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        'notif': 'slide-in-out 5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}
