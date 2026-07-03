// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://aizyeee.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: { prefixDefaultLocale: false },
  },
});
