/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        '2base': '2rem',
      }
    },
    fontFamily: {
      'bevietnam': ['BeVietnamPro']
    },
  },
  plugins: [],
};
