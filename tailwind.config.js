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
        pastel: {
          pink: '#f5e6fa',
          blue: '#e6f0ff',
          purple: '#f0e6ff',
          gray: {
            100: '#f8f9fa',
            200: '#e9ecef',
            300: '#dee2e6',
            400: '#ced4da',
            500: '#adb5bd',
            600: '#6c757d',
            700: '#495057',
            800: '#343a40',
            900: '#212529',
          },
        },
        text: {
          primary: '#222',
          secondary: '#333',
          muted: '#555',
        },
      },
      borderRadius: {
        '2xl': '1.25rem',  // 20px
        '3xl': '1.875rem', // 30px
      },
      backdropBlur: {
        'xl': '20px',
      },
      boxShadow: {
        'card': '0px 10px 30px rgba(0, 0, 0, 0.05)',
        'card-hover': '0px 12px 35px rgba(0, 0, 0, 0.08)',
      },
      fontWeight: {
        'heading': '600',
        'body': '500',
      },
      fontSize: {
        'card-label': '0.875rem', // 14px
        'title': '1.5rem',       // 24px
        'button': '1rem',        // 16px
      },
      spacing: {
        'card-padding': '1rem',      // 16px
        'screen-padding': '1.5rem',  // 24px
        'card-gap': '0.75rem',       // 12px
      },
      transitionProperty: {
        'card': 'transform, box-shadow',
      },
      scale: {
        '102': '1.02',
      },
    },
  },
  plugins: [],
}
