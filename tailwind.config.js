/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontSize: {
        "2base": "2rem",
      },
      fontFamily: {
        bevietnam: ["BeVietnamPro"],
      },
      colors: {
        darkgray: "#111729",
        darkblue: "#1D1B48",
        blue: "#3662E3",
        gray: "#20293A",
        slate: {
          100: "#CDD5E0",
          200: "#4A5567",
          300: "#364153",
        },
      },
    },
  },
  plugins: [],
};
