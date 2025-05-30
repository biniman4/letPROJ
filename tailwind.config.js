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
          accent: "#3b82f6",
          text: {
            primary: "#ffffff",
            secondary: "#9ca3af",
          },
        },
      },
    },
  },
  plugins: [],
};
