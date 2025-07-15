/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FFC400",
        secondary: "#212121",
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
      },
    },
  },
  plugins: [],
};
