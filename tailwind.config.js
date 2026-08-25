/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      colors: {
        background: "#f4f2ec",
        foreground: "#1c1916",
        card: {
          DEFAULT: "#fcfbf8",
          foreground: "#1c1916",
        },
        muted: {
          DEFAULT: "#ece9e1",
          foreground: "#6b665c",
        },
        border: "#ddd8cc",
        input: "#ddd8cc",
        primary: {
          DEFAULT: "#1c1916",
          foreground: "#fcfbf8",
        },
        secondary: {
          DEFAULT: "#ece9e1",
          foreground: "#1c1916",
        },
        accent: {
          DEFAULT: "#2f4a3c",
          foreground: "#fcfbf8",
        },
        destructive: {
          DEFAULT: "#9b2c2c",
          foreground: "#ffffff",
        },
        ring: "#1c1916",
        risk: {
          high: "#9b2c2c",
          medium: "#9a5b12",
          low: "#2f6b4f",
        },
      },
      boxShadow: {
        card: "0 1px 0 rgba(28, 25, 22, 0.04), 0 12px 32px -16px rgba(28, 25, 22, 0.12)",
      },
    },
  },
  plugins: [],
};
