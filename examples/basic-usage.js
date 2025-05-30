/**
 * Basic usage examples for lazy-import
 */
const lazy = require('lazy-import').default;

// Example 1: Basic lazy loading
async function basicExample() {
  console.log('=== Basic Example ===');
  
  // Create a lazy loader for the 'path' module
  const loadPath = lazy('path');
  
  console.log('Path module not loaded yet...');
  
  // Load the module when needed
  const path = await loadPath();
  
  console.log('Path module loaded!');
  console.log('Joined path:', path.join('/users', 'john', 'documents'));
}

// Example 2: Caching behavior
async function cachingExample() {
  console.log('\n=== Caching Example ===');
  
  // With caching (default)
  const loadFS = lazy('fs');
  
  console.time('First load');
  const fs1 = await loadFS();
  console.timeEnd('First load');
  
  console.time('Second load (cached)');
  const fs2 = await loadFS();
  console.timeEnd('Second load (cached)');
  
  console.log('Same instance?', fs1 === fs2); // true
}

// Example 3: Without caching
async function noCacheExample() {
  console.log('\n=== No Cache Example ===');
  
  const loadCrypto = lazy('crypto', { cache: false });
  
  const crypto1 = await loadCrypto();
  const crypto2 = await loadCrypto();
  
  console.log('Different instances (no cache):', crypto1 !== crypto2);
}

// Run examples
async function runExamples() {
  await basicExample();
  await cachingExample();
  await noCacheExample();
}

if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = { basicExample, cachingExample, noCacheExample };