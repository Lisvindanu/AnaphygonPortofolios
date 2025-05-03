/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A0A0A",
        secondary: "#1A1A1A",
        accent: "#00FFFF",
        highlight: "#FF00FF",
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #00FFFF' },
          '50%': { boxShadow: '0 0 20px #00FFFF, 0 0 30px #00FFFF' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('/public/noise.png')",
      },
      textShadow: {
        'glow': '0 0 10px #00FFFF',
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionProperty: {
        'width': 'width',
        'height': 'height',
      }
    },
  },
  plugins: [],
}
