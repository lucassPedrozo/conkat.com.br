// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://conkat.pedrozo.dev.br',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
