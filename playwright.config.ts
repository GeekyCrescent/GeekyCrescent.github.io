import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    // astro 7's preview detaches itself when it detects an agent/CI shell; a plain static
    // server over dist/ stays attached and matches what GitHub Pages serves.
    command: 'python3 -m http.server 4321 --directory dist',
    port: 4321,
    reuseExistingServer: false,
  },
  projects: [
    { name: 'phone', use: { viewport: { width: 375, height: 812 } } },
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
  ],
});
