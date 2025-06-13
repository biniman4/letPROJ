/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom colors for dark mode
        dark: {
          primary: "#1a1a1a",
          secondary: "#2d2d2d",
          accent: "#194A8D",
          text: {
            primary: "#ffffff",
            secondary: "#9ca3af",
          },
        },
        // Custom color for general text based on user's image
        'main-text': "#00334C",
        // Custom color for hover state
        'hover-gold': "#D29341",
        // Custom color for active background
        'active-bg-dark': "#367C94",
      },
    },
  },
  plugins: [],
};
