/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green:      '#4CAF82',   // primary green
          'green-light': '#A8D5B5', // soft green
          'green-pale': '#E8F5EE',  // very light green bg
          yellow:     '#F5C842',   // primary yellow
          'yellow-light': '#FDE89A',// soft yellow
          'yellow-pale': '#FFFBEA',  // very light yellow bg
          cream:      '#FFF8F0',   // cream bg
          'cream-dark': '#F5EFE6', // darker cream
          white:      '#FFFFFF',
          text:       '#2D3A2E',   // dark green-tinted text
          'text-muted': '#6B7C6D', // muted green-grey text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 20px 0 rgba(76, 175, 130, 0.08)',
        'card': '0 4px 24px 0 rgba(0,0,0,0.07)',
        'hover': '0 8px 32px 0 rgba(76, 175, 130, 0.18)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        '2xl2': '1.75rem',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #FFFBEA 0%, #E8F5EE 50%, #FFF8F0 100%)',
        'card-gradient': 'linear-gradient(135deg, #ffffff 0%, #E8F5EE 100%)',
        'green-gradient': 'linear-gradient(135deg, #4CAF82 0%, #2e8b5e 100%)',
        'yellow-gradient': 'linear-gradient(135deg, #F5C842 0%, #e6b800 100%)',
      },
    },
  },
  plugins: [],
}
