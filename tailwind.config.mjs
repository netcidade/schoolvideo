/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Design tokens do projeto original
        dark:    '#0B0B0F',
        surface: '#111116',
        border:  'rgba(255,255,255,0.08)',
        gold:    '#C9A84C',
        cream:   '#F0EAD6',
        muted:   'rgba(240,234,214,0.45)',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
};
