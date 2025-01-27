/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  important: '#__next',
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
}