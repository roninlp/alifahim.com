// @ts-check
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

import { defineConfig } from 'astro/config';

const require = createRequire(import.meta.url);

/**
 * `cf build` and `cf deploy` run the framework's build command and then read the
 * Build Output Specification tree in `.cloudflare/output/v0/`. Astro does not
 * write that tree itself, so emit it here from the static build.
 *
 * Delete this integration once `@astrojs/cloudflare` emits Build Output on its
 * own; `cf` will then do this step without help.
 */
function cloudflareBuildOutput() {
  return {
    name: 'cloudflare-build-output',
    hooks: {
      'astro:build:done': () => {
        execFileSync(
          process.execPath,
          [
            require.resolve('wrangler'),
            'build',
            '--experimental-new-config',
            '--experimental-cf-build-output',
          ],
          { stdio: 'inherit' },
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  redirects: {
    '/work/ledger': '/#work',
    '/work/harbor': '/#work',
    '/work/tempo': '/#work',
    '/work/northwind': '/#work',
  },
  integrations: [cloudflareBuildOutput()],
});
