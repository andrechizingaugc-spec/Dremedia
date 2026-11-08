import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-inter)", "system-ui", "sans-serif"] },
      colors: {
        // brand: swap these for your own colours
        brand: { DEFAULT: "#00BDAB", hover: "#00A696", text: "#00998B", wash: "#D8FAF5" },
        money: "#4CAF6E",
        page: "#F4F4F0",
        ink: "#0A0A0A",
        muted: "#71717A",
        line: "#E5E5E5",
        side: "#F4F4F5",
      },
      borderRadius: { card: "12px" },
    },
  },
  plugins: [],
};
export default config;
