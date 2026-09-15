import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

async function buildApi() {
  const apiFiles = [
    { in: 'api/index.ts', outApi: 'api/index.js', outDist: 'dist/api/index.js' },
    { in: 'api/[...path].ts', outApi: 'api/[...path].js', outDist: 'dist/api/[...path].js' },
    { in: 'api/apiRouter.ts', outApi: 'api/apiRouter.js', outDist: 'dist/api/apiRouter.js' },
    { in: 'api/db.ts', outApi: 'api/db.js', outDist: 'dist/api/db.js' },
    { in: 'api/mongodb.ts', outApi: 'api/mongodb.js', outDist: 'dist/api/mongodb.js' },
    { in: 'api/cloudinary.ts', outApi: 'api/cloudinary.js', outDist: 'dist/api/cloudinary.js' },
    { in: 'api/seed.ts', outApi: 'api/seed.js', outDist: 'dist/api/seed.js' },
  ];

  // Ensure dist/api exists
  if (!fs.existsSync('dist/api')) {
    fs.mkdirSync('dist/api', { recursive: true });
  }

  for (const f of apiFiles) {
    // 1. Build to /api/*.js
    await build({
      entryPoints: [f.in],
      bundle: true,
      platform: 'node',
      format: 'esm',
      packages: 'external',
      outfile: f.outApi,
    });

    // 2. Build to dist/api/*.js
    await build({
      entryPoints: [f.in],
      bundle: true,
      platform: 'node',
      format: 'esm',
      packages: 'external',
      outfile: f.outDist,
    });

    console.log(`✓ Compiled ${f.in} -> ${f.outApi} and ${f.outDist}`);
  }

  console.log('✓ All API functions and modules successfully compiled to JavaScript.');
}

buildApi().catch((err) => {
  console.error('Build API error:', err);
  process.exit(1);
});
