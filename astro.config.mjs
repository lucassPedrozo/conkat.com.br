// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://conkat.app',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
