import { build } from 'esbuild';
import fs from 'fs';
import path from 'path';

async function buildApi() {
  const apiFiles = [
    { in: 'server/index.ts', outApi: 'api/index.js', outDist: 'dist/api/index.js' },
    { in: 'server/index.ts', outApi: 'api/[...path].js', outDist: 'dist/api/[...path].js' },
    { in: 'server/apiRouter.ts', outApi: 'api/apiRouter.js', outDist: 'dist/api/apiRouter.js' },
    { in: 'server/db.ts', outApi: 'api/db.js', outDist: 'dist/api/db.js' },
    { in: 'server/mongodb.ts', outApi: 'api/mongodb.js', outDist: 'dist/api/mongodb.js' },
    { in: 'server/cloudinary.ts', outApi: 'api/cloudinary.js', outDist: 'dist/api/cloudinary.js' },
    { in: 'server/seed.ts', outApi: 'api/seed.js', outDist: 'dist/api/seed.js' },
  ];

  // Ensure api and dist/api directories exist
  if (!fs.existsSync('api')) {
    fs.mkdirSync('api', { recursive: true });
  }
  if (!fs.existsSync('dist/api')) {
    fs.mkdirSync('dist/api', { recursive: true });
  }

  // Clean any stray .ts files from /api to prevent Vercel path conflict errors
  const apiDirFiles = fs.readdirSync('api');
  for (const file of apiDirFiles) {
    if (file.endsWith('.ts')) {
      fs.unlinkSync(path.join('api', file));
      console.log(`Cleaned up conflicting TypeScript file from api/: ${file}`);
    }
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
