/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cu: {
          red: "#D61F26",
          redDark: "#A8161B",
          charcoal: "#0B0F19",
          slate: "#111827"
        }
      },
      boxShadow: {
        soft: "0 10px 30px -5px rgba(0,0,0,.45)"
      },
      keyframes: {
        gradient: {
          '0%,100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        }
      },
      animation: {
        gradient: 'gradient 14s ease infinite'
      }
    },
  },
  plugins: [],
}
