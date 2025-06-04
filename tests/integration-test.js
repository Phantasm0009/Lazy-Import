#!/usr/bin/env node

/**
 * Integration test runner for Static Bundle Helper
 * Tests transformation across different bundlers
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.join(__dirname, 'integration', 'test-project');
const resultsDir = path.join(__dirname, 'integration', 'results');

// Ensure results directory exists
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

function log(message) {
  console.log(`[Integration Test] ${message}`);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
}

function analyzeTransformation(originalCode, transformedCode, bundler) {
  const analysis = {
    bundler,
    transformCount: 0,
    preservedOptions: 0,
    chunkComments: 0,
    originalLazyCalls: (originalCode.match(/lazy\(/g) || []).length,
    transformedImports: (transformedCode.match(/import\(/g) || []).length,
    helperFunctions: (transformedCode.match(/__lazyHelper/g) || []).length,
    errors: []
  };

  // Count transformations
  analysis.transformCount = analysis.transformedImports;
  
  // Count preserved options (helper functions)
  analysis.preservedOptions = analysis.helperFunctions;
  
  // Count chunk comments
  analysis.chunkComments = (transformedCode.match(/\/\*[^*]*webpackChunkName[^*]*\*\//g) || []).length +
                           (transformedCode.match(/\/\*[^*]*chunkName[^*]*\*\//g) || []).length;

  return analysis;
}

async function runIntegrationTests() {
  log('Starting Static Bundle Helper integration tests...');
  
  try {
    // Change to project directory
    process.chdir(projectDir);
    
    // Install dependencies
    log('Installing dependencies...');
    execSync('npm install', { stdio: 'pipe' });
    
    const originalCode = readFile('src/sample.js');
    if (!originalCode) {
      throw new Error('Could not read original source file');
    }
    
    const results = {};
    
    // Test Vite
    log('Testing Vite transformation...');
    try {
      execSync('npm run build:vite', { stdio: 'pipe' });
      const viteOutput = readFile('dist/vite/TestLib.js') || readFile('dist/vite/TestLib.mjs');
      if (viteOutput) {
        results.vite = analyzeTransformation(originalCode, viteOutput, 'vite');
        log(`✅ Vite: ${results.vite.transformCount} transformations`);
      } else {
        results.vite = { bundler: 'vite', error: 'No output file found' };
        log('❌ Vite: No output found');
      }
    } catch (error) {
      results.vite = { bundler: 'vite', error: error.message };
      log(`❌ Vite failed: ${error.message}`);
    }
    
    // Test Rollup
    log('Testing Rollup transformation...');
    try {
      execSync('npm run build:rollup', { stdio: 'pipe' });
      const rollupOutput = readFile('dist/rollup/sample.js');
      if (rollupOutput) {
        results.rollup = analyzeTransformation(originalCode, rollupOutput, 'rollup');
        log(`✅ Rollup: ${results.rollup.transformCount} transformations`);
      } else {
        results.rollup = { bundler: 'rollup', error: 'No output file found' };
        log('❌ Rollup: No output found');
      }
    } catch (error) {
      results.rollup = { bundler: 'rollup', error: error.message };
      log(`❌ Rollup failed: ${error.message}`);
    }
    
    // Test Webpack
    log('Testing Webpack transformation...');
    try {
      execSync('npm run build:webpack', { stdio: 'pipe' });
      const webpackOutput = readFile('dist/webpack/bundle.js');
      if (webpackOutput) {
        results.webpack = analyzeTransformation(originalCode, webpackOutput, 'webpack');
        log(`✅ Webpack: ${results.webpack.transformCount} transformations`);
      } else {
        results.webpack = { bundler: 'webpack', error: 'No output file found' };
        log('❌ Webpack: No output found');
      }
    } catch (error) {
      results.webpack = { bundler: 'webpack', error: error.message };
      log(`❌ Webpack failed: ${error.message}`);
    }
    
    // Test Babel
    log('Testing Babel transformation...');
    try {
      execSync('npm run build:babel', { stdio: 'pipe' });
      const babelOutput = readFile('dist/sample.js');
      if (babelOutput) {
        results.babel = analyzeTransformation(originalCode, babelOutput, 'babel');
        log(`✅ Babel: ${results.babel.transformCount} transformations`);
      } else {
        results.babel = { bundler: 'babel', error: 'No output file found' };
        log('❌ Babel: No output found');
      }
    } catch (error) {
      results.babel = { bundler: 'babel', error: error.message };
      log(`❌ Babel failed: ${error.message}`);
    }
    
    // Save results
    const resultFile = path.join(resultsDir, 'integration-test-results.json');
    fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
    log(`Results saved to: ${resultFile}`);
    
    // Print summary
    console.log('\n📊 Integration Test Summary:');
    console.log('=' .repeat(50));
    
    for (const [bundler, result] of Object.entries(results)) {
      if (result.error) {
        console.log(`❌ ${bundler.toUpperCase()}: Failed - ${result.error}`);
      } else {
        console.log(`✅ ${bundler.toUpperCase()}:`);
        console.log(`   • Transformations: ${result.transformCount}/${result.originalLazyCalls}`);
        console.log(`   • Options preserved: ${result.preservedOptions}`);
        console.log(`   • Chunk comments: ${result.chunkComments}`);
      }
    }
    
    const successCount = Object.values(results).filter(r => !r.error).length;
    console.log(`\n🎯 ${successCount}/4 bundlers passed`);
    
    return results;
    
  } catch (error) {
    log(`❌ Integration test failed: ${error.message}`);
    throw error;
  }
}

if (require.main === module) {
  runIntegrationTests().catch(error => {
    console.error('Integration test failed:', error);
    process.exit(1);
  });
}

module.exports = { runIntegrationTests };
