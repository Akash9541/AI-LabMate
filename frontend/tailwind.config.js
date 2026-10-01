/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: "#07090c",
          panel: "#0f141d",
          panelDark: "#0a0d13",
          border: "#1d2738",
          borderLight: "#2e3c54",
          amber: "#ffb000",
          amberDim: "#b37b00",
          cyan: "#00e5ff",
          cyanDim: "#0099aa",
          green: "#10b981",
          red: "#f43f5e",
          purpleAccent: "#8b5cf6",
          text: "#e2e8f0",
          muted: "#7d8da6",
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        'oscilloscope-grid': "linear-gradient(to right, rgba(0, 229, 255, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 229, 255, 0.07) 1px, transparent 1px)",
        'amber-grid': "linear-gradient(to right, rgba(255, 176, 0, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 176, 0, 0.07) 1px, transparent 1px)",
      },
      boxShadow: {
        'lab-glow-cyan': '0 0 15px rgba(0, 229, 255, 0.15)',
        'lab-glow-amber': '0 0 15px rgba(255, 176, 0, 0.15)',
        'lab-panel': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
