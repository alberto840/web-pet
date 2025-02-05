// @type {import('tailwindcss').Config}
module.exports = {
  content: ["./src/**/*.{html,ts}",],
  theme: {
    screens: {
      'xs': { 'max': '575px' },
      // => @media (max-width: 575px) { ... }

      'sm': { 'max': '767px' },
      // => @media (max-width: 767px) { ... }

      'md': { 'min': '768px', 'max': '991px' },
      // => @media (min-width: 768px) and (max-width: 991px) { ... }

      'lg': { 'min': '992px', 'max': '1200px' },
      // => @media (min-width: 992px) and (max-width: 1200px) { ... }

      'xl': { 'min': '1201px', 'max': '1400px' },
      // => @media (min-width: 1201px) and (max-width: 1400px) { ... }

      'xxl': { 'min': '1401px', 'max': '1600px' },
      // => @media (min-width: 1401px) and (max-width: 1600px) { ... }

      'xxxl': { 'min': '1601px', 'max': '1920px' },
      // => @media (min-width: 1401px) and (max-width: 1600px) { ... }

      'minSm': { 'min': '768px' },
      // => @media (min-width: 575px) { ... }
    },
    container: {
      center: true,
      padding: '15px',
    },
    fontFamily: {
      'primary': ["'Nunito Sans', sans-serif"],
      'fontawesome': ["Font Awesome 5 Pro"],
    },
    extend: {
      colors: {
        'white': '#ffffff',
        'heading': '#0D0F19',
        'primary': '#017991', //cambiado
        'secondary': '#41c7ae', //cambiado
        'success': '#349f8b', //cambiado
        'border': '#EFF0F2',
        'borderLight': '#41c7ae', //cambiado
        'body': '#616161',
        'gray': '#fcfcfc', //only use in input bg
        'lightest': '#f9f9f9',
        'teal': '#8b349f', //cambiado
        'danger': '#c7415a', //cambiado
        'warning': '#f28020', //cambiado
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
