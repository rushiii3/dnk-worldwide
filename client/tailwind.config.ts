import type { Config } from "tailwindcss";

const config: Config = {
  
  theme: {
    screens: {
      sm: "375px",
      md: "768px",
      lg: "1200px",
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        md: "2rem",
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sf-pro)', 'system-ui', 'sans-serif'],
      },
    },
  },
  
  plugins: [],
};
export default config;
