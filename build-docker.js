#!/usr/bin/env node

// Custom build script that bypasses TypeScript and ESLint checks
// This is used by the Dockerfile to build the Next.js app

const { spawnSync } = require('child_process');

console.log('Starting custom build with linting and type checks disabled...');

// Run Next.js build with flags to bypass checks
const result = spawnSync('npx', ['next', 'build', '--no-lint'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: '1',
    SKIP_LINTING: 'true',
    NODE_ENV: 'production',
    NEXT_DISABLE_ESLINT: '1', // Disable ESLint
    NEXT_DISABLE_TYPECHECK: '1' // Disable TypeScript checks
  }
});

if (result.status !== 0) {
  console.error('Build failed, trying alternative approach...');
  
  // If normal build fails, try with more aggressive flags
  const fallbackResult = spawnSync('npx', ['next', 'build'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: '1',
      FORCE_COLOR: '3',
      NODE_OPTIONS: '--max-old-space-size=4096',
      NODE_ENV: 'production',
      NEXT_DISABLE_ESLINT: '1',
      NEXT_DISABLE_TYPECHECK: '1'
    }
  });

  process.exit(fallbackResult.status);
} else {
  console.log('Build completed successfully!');
}
