/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,tsx}"],
  safelist: [
    {pattern: /btn-./},
    {pattern: /text-./},
    {pattern: /border-./},
  ],
  theme: {
    extend: {},
  },

  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          // primary: "#639",
          primary: "#106c98",
          secondary: "teal",
          "base-300": "#f6f7fb",
          accent: "#ff7518",
        },
      },
    ],
  },

  plugins: [require('daisyui')],
}

