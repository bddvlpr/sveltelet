import type { Config } from 'tailwindcss';

import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  daisyui: {
    logs: false
  },
  plugins: [typography, daisyui]
} satisfies Config;
