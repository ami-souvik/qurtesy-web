/** @type {import('tailwindcss').Config} */
import { Screens } from './tailwind.screens';

export default {
  darkMode: 'class', // allows manual dark/light toggle
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      Screens,
    },
  },
  plugins: [],
};
