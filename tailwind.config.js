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
      colors: {
        background: "#090d16",
        foreground: "#f1f5f9",
        card: {
          DEFAULT: "#0f172a",
          foreground: "#f1f5f9",
        },
        popover: {
          DEFAULT: "#090d16",
          foreground: "#f1f5f9",
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        border: "#1e293b",
        input: "#1e293b",
        primary: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#f8fafc",
        },
        accent: {
          DEFAULT: "#1e293b",
          foreground: "#f8fafc",
        },
        destructive: {
          DEFAULT: "#991b1b",
          foreground: "#ffffff",
        },
        ring: "#3b82f6",
      },
    },
  },
  plugins: [],
};
