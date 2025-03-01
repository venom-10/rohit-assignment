/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        comic: ['Comic Neue', 'cursive'],
        bubblegum: ['Bubblegum Sans', 'cursive'],
      },
      colors: {
        'cartoon-yellow': '#FFE15D',
        'cartoon-blue': '#7BD3EA',
        'cartoon-pink': '#FF9EAA',
        'cartoon-green': '#A6CF98',
        'cartoon-purple': '#D09CFA',
        'cartoon-orange': '#FFA447',
        'cartoon-bg': '#FFF8E6',
      },
      borderWidth: {
        '6': '6px',
        '8': '8px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'cartoon': '4px 4px 0px #000000',
        'cartoon-lg': '8px 8px 0px #000000',
      },
    },
  },
  plugins: [],
}