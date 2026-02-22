import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#E8EEF4",
          100: "#C5D4E3",
          200: "#9FB8D0",
          300: "#799CBD",
          400: "#5C87AE",
          500: "#3F729F",
          600: "#376491",
          700: "#2D5280",
          800: "#0B2C4D",
          900: "#081E36",
          950: "#051425",
        },
        midnight: "#040D19",
        electric: "#3B82F6",
        cyan: {
          DEFAULT: "#06B6D4",
          50: "#ECFEFF",
          100: "#CFFAFE",
          200: "#A5F3FC",
          300: "#67E8F9",
          400: "#22D3EE",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
        },
        surface: {
          0: "#FFFFFF",
          1: "#F8FAFC",
          2: "#F1F5F9",
          3: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "Fira Code", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-down": "fadeDown 0.6s ease-out forwards",
        "slide-left": "slideLeft 0.6s ease-out forwards",
        "slide-right": "slideRight 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        shimmer: "shimmer 2s infinite linear",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
        "cursor-blink": "cursorBlink 0.8s step-end infinite",
        "glow-drift": "glowDrift 8s ease-in-out infinite",
        "underline-in": "underlineIn 0.2s ease-out forwards",
        "circuit-draw": "circuitDraw 2s ease-out forwards",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseDot: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.3)", opacity: "0.7" },
        },
        cursorBlink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        glowDrift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "25%": { transform: "translate(100px, 50px)" },
          "50%": { transform: "translate(-50px, 100px)" },
          "75%": { transform: "translate(-100px, -50px)" },
        },
        underlineIn: {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        circuitDraw: {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      backgroundImage: {
        "gradient-hero": "linear-gradient(135deg, #040D19 0%, #0B2C4D 50%, #1E3A5F 100%)",
        "gradient-accent": "linear-gradient(135deg, #3B82F6 0%, #06B6D4 100%)",
        "gradient-card-shine": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)",
        "dot-grid": "radial-gradient(circle, rgba(11,44,77,0.07) 1px, transparent 1px)",
        "dot-grid-light": "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-24": "24px 24px",
      },
      boxShadow: {
        "glow-blue": "0 8px 30px rgba(59,130,246,0.12)",
        "glow-cyan": "0 8px 30px rgba(6,182,212,0.12)",
        "card-hover": "0 10px 40px -10px rgba(0,0,0,0.1)",
        "glass": "0 8px 32px 0 rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
