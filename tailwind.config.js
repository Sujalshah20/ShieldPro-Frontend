export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  safelist: [
    'shadow-2xl',
    'hover:shadow-2xl'
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#007ea8",
        "header-bg": "#003249",
        "sidebar-nav": "#003249",
        "background-main": "#ccdbdc",
        "background-light": "#f5f8f8",
        "card-accent": "#9ad1d4",
        "background-dark": "#0f1e23",
        "accent-shadow": "#9ad1d4",
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
    }
  },
  plugins: []
};