/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        linen: {
          50:  '#faf8f4',
          100: '#f0ebe0',
          200: '#dfd8c8',
          500: '#8c7e67',
          700: '#4d4235',
          800: '#342c23',
          900: '#1e1a15',
        },
        sage: {
          50:  '#f3f8f4',
          100: '#e3ede5',
          200: '#c0d5c4',
          400: '#6b9b74',
          500: '#4f7d57',
          600: '#3e6345',
          700: '#334f39',
          800: '#2a3f2e',
          900: '#1e2e21',
        },
      },
    },
  },
  plugins: [],
}
