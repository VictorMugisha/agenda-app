/* eslint-disable no-undef */
import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-primary": "rgba(210, 205, 205, 0.178)",
        "app-secondary": "rgba(71, 162, 59, 0.904)",
      },
    },
  },
  plugins: [daisyui, require("tailwind-scrollbar-hide")],
};
