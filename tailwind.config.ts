import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        srmen: {
          night: "#050B1E",
          deep: "#07122E",
          card: "#101B36",
          cardAlt: "#17254A",
          green: "#58CC02",
          sky: "#1CB0F6",
          xp: "#FFD43B",
          purple: "#8B5CF6",
        },
      },
      boxShadow: {
        glow: "0 0 36px rgba(28, 176, 246, 0.22)",
        green: "0 0 30px rgba(88, 204, 2, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
