#!/usr/bin/env node

/**
 * Performance benchmark for Static Bundle Helper
 * Measures transformation speed and bundle size impact
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

const projectDir = path.join(__dirname, 'performance', 'benchmark-project');
const resultsDir = path.join(__dirname, 'performance', 'results');

// Ensure results directory exists
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

function log(message) {
  console.log(`[Performance Benchmark] ${message}`);
}

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function createTestFiles(baseDir, numFiles = 10, lazyCallsPerFile = 5) {
  const srcDir = path.join(baseDir, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }

  for (let i = 1; i <= numFiles; i++) {
    const content = `
// Test file ${i} - Generated for performance testing
import lazy from '@phantasm0009/lazy-import';

${Array.from({ length: lazyCallsPerFile }, (_, j) => `
// Lazy import ${j + 1}
const load${i}_${j + 1} = lazy('module-${i}-${j + 1}');

export async function use${i}_${j + 1}() {
  const module = await load${i}_${j + 1}();
  return module.default || module;
}

// With options
const loadWithOptions${i}_${j + 1} = lazy('module-${i}-${j + 1}-opts', {
  retries: 3,
  timeout: 5000
});
`).join('\n')}

export { ${Array.from({ length: lazyCallsPerFile }, (_, j) => `load${i}_${j + 1}, loadWithOptions${i}_${j + 1}`).join(', ')} };
`;

    fs.writeFileSync(path.join(srcDir, `module${i}.js`), content);
  }

  // Create index file
  const indexContent = `
${Array.from({ length: numFiles }, (_, i) => `export * from './module${i + 1}.js';`).join('\n')}
`;

  fs.writeFileSync(path.join(srcDir, 'index.js'), indexContent);
}

function createBenchmarkProject() {
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Create package.json
  const packageJson = {
    name: "lazy-import-performance-test",
    version: "1.0.0",
    private: true,
    type: "module",
    scripts: {
      "build:with-sbh": "vite build",
      "build:without-sbh": "vite build --config vite.config.no-sbh.js"
    },
    devDependencies: {
      "vite": "^4.0.0"
    },
    dependencies: {
      "@phantasm0009/lazy-import": "file:../../../"
    }
  };

  fs.writeFileSync(path.join(projectDir, 'package.json'), JSON.stringify(packageJson, null, 2));

  // Create Vite config with SBH
  const viteConfigWithSBH = `
import { defineConfig } from 'vite';
import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';

export default defineConfig({
  plugins: [
    viteLazyImport({
      chunkComment: true,
      preserveOptions: true
    })
  ],
  build: {
    outDir: 'dist/with-sbh',
    lib: {
      entry: 'src/index.js',
      name: 'BenchmarkLib',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@phantasm0009/lazy-import']
    }
  }
});
`;

  fs.writeFileSync(path.join(projectDir, 'vite.config.js'), viteConfigWithSBH);

  // Create Vite config without SBH
  const viteConfigWithoutSBH = `
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist/without-sbh',
    lib: {
      entry: 'src/index.js',
      name: 'BenchmarkLib',
      formats: ['es']
    },
    rollupOptions: {
      external: ['@phantasm0009/lazy-import']
    }
  }
});
`;

  fs.writeFileSync(path.join(projectDir, 'vite.config.no-sbh.js'), viteConfigWithoutSBH);

  // Create test files
  createTestFiles(projectDir);
}

async function runPerformanceBenchmark() {
  log('Starting performance benchmark...');

  try {
    // Create benchmark project
    log('Creating benchmark project...');
    createBenchmarkProject();

    process.chdir(projectDir);

    // Install dependencies
    log('Installing dependencies...');
    execSync('npm install', { stdio: 'pipe' });

    const results = {
      testConfig: {
        files: 10,
        lazyCallsPerFile: 5,
        totalLazyCalls: 50
      },
      withSBH: {},
      withoutSBH: {}
    };

    // Benchmark with SBH
    log('Benchmarking WITH Static Bundle Helper...');
    const startWithSBH = performance.now();
    execSync('npm run build:with-sbh', { stdio: 'pipe' });
    const endWithSBH = performance.now();

    results.withSBH = {
      buildTime: endWithSBH - startWithSBH,
      bundleSize: getFileSize('dist/with-sbh/BenchmarkLib.js'),
      chunks: fs.readdirSync('dist/with-sbh').filter(f => f.endsWith('.js')).length
    };

    // Benchmark without SBH
    log('Benchmarking WITHOUT Static Bundle Helper...');
    const startWithoutSBH = performance.now();
    execSync('npm run build:without-sbh', { stdio: 'pipe' });
    const endWithoutSBH = performance.now();

    results.withoutSBH = {
      buildTime: endWithoutSBH - startWithoutSBH,
      bundleSize: getFileSize('dist/without-sbh/BenchmarkLib.js'),
      chunks: fs.readdirSync('dist/without-sbh').filter(f => f.endsWith('.js')).length
    };

    // Calculate improvements
    results.comparison = {
      buildTimeChange: ((results.withSBH.buildTime - results.withoutSBH.buildTime) / results.withoutSBH.buildTime) * 100,
      bundleSizeChange: ((results.withSBH.bundleSize - results.withoutSBH.bundleSize) / results.withoutSBH.bundleSize) * 100,
      chunksCreated: results.withSBH.chunks - results.withoutSBH.chunks
    };

    // Save results
    const resultFile = path.join(resultsDir, 'performance-benchmark.json');
    fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
    log(`Results saved to: ${resultFile}`);

    // Print summary
    console.log('\n📊 Performance Benchmark Results:');
    console.log('=' .repeat(60));
    console.log(`Test Configuration:`);
    console.log(`  • Files: ${results.testConfig.files}`);
    console.log(`  • Lazy calls per file: ${results.testConfig.lazyCallsPerFile}`);
    console.log(`  • Total lazy calls: ${results.testConfig.totalLazyCalls}`);
    console.log();

    console.log(`Build Performance:`);
    console.log(`  • Without SBH: ${results.withoutSBH.buildTime.toFixed(2)}ms`);
    console.log(`  • With SBH: ${results.withSBH.buildTime.toFixed(2)}ms`);
    console.log(`  • Change: ${results.comparison.buildTimeChange.toFixed(2)}%`);
    console.log();

    console.log(`Bundle Analysis:`);
    console.log(`  • Without SBH: ${formatBytes(results.withoutSBH.bundleSize)} (${results.withoutSBH.chunks} chunks)`);
    console.log(`  • With SBH: ${formatBytes(results.withSBH.bundleSize)} (${results.withSBH.chunks} chunks)`);
    console.log(`  • Size change: ${results.comparison.bundleSizeChange.toFixed(2)}%`);
    console.log(`  • Additional chunks: ${results.comparison.chunksCreated}`);

    return results;

  } catch (error) {
    log(`❌ Performance benchmark failed: ${error.message}`);
    throw error;
  }
}

if (require.main === module) {
  runPerformanceBenchmark().catch(error => {
    console.error('Performance benchmark failed:', error);
    process.exit(1);
  });
}

module.exports = { runPerformanceBenchmark };
