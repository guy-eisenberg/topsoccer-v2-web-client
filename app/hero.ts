import { heroui } from "@heroui/react";

export default heroui({
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
});
