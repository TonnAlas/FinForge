// @ts-check
import { defineConfig } from 'astro/config';

const REPO_NAME = 'FinForge';

// https://astro.build/config
export default defineConfig({
  site: 'https://tonnalas.github.io',
  base: `/${REPO_NAME}/`,
  output: 'static',
});
