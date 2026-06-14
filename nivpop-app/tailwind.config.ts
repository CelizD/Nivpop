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
        ink:     "#16120d",
        paper:   "#faf9f6",
        rose:    "#c4786a",
        mid:     "#6b5f52",
        muted:   "#a59a8c",
        border:  "rgba(22,18,13,0.10)",
        gold:    "#b49450",
        mint:    "#4a9068",
        mocha:   "#583828",
        peach:   "#dc7848",
        lav:     "#7860a8",
        teal:    "#346c58",
        amber:   "#c89c48",
        fig:     "#8c486c",
        caramel: "#b4783c",
        yuzu:    "#c8b434",
        earl:    "#50648c",
        chai:    "#b4503c",
        platano: "#c8b048",
        vino:    "#6c3058",
        carda:   "#985888",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":       "fadeIn .35s ease forwards",
        "slide-up":      "slideUp .4s cubic-bezier(.22,1,.36,1) forwards",
        "slide-forward": "slideForward .28s cubic-bezier(.22,1,.36,1) forwards",
        "slide-back":    "slideBack .28s cubic-bezier(.22,1,.36,1) forwards",
        "pulse-slow":    "pulse 2.5s ease infinite",
        "countdown":     "countdown 45s linear forwards",
      },
      keyframes: {
        fadeIn:       { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:      { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideForward: { from: { opacity: "0.5", transform: "translateX(48px)"  }, to: { opacity: "1", transform: "translateX(0)" } },
        slideBack:    { from: { opacity: "0.5", transform: "translateX(-48px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        countdown:    { from: { transform: "scaleX(1)" }, to: { transform: "scaleX(0)" } },
      },
    },
  },
  plugins: [],
};
export default config;
