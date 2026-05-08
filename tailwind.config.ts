import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "miido-navy": "#38507E",      // Azul profesional original
        "miido-teal": "#51A09A",      // Teal original
        "miido-lime": "#C2DB64",      // Verde lima original
        "miido-bg": "#F8FAFC",        // Fondo gris muy claro
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
