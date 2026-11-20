// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://conkat.com.br',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
});
