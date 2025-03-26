import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          green: "rgb(var(--color-green) / <alpha-value>)",
          gray: "rgb(var(--color-gray) / <alpha-value>)",
          "light-gray": "rgb(var(--color-light-gray) / <alpha-value>)",
          card: "rgb(var(--color-card) / <alpha-value>)",
          foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#2eac68",
              foreground: "#fff",
            },
            secondary: {
              DEFAULT: "#fff",
              foreground: "#2eac68",
            },
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#2eac68",
              foreground: "#fff",
            },
            secondary: {
              DEFAULT: "#333",
              foreground: "#2eac68",
            },
          },
        },
      },
    }),
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwind-scrollbar-hide"),
  ],
  darkMode: "class",
};
