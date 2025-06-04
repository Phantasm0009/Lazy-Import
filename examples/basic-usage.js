/**
 * Basic usage examples for @phantasm0009/lazy-import
 * 
 * This file demonstrates fundamental lazy loading patterns that can be used
 * in any JavaScript/Node.js application to improve startup performance.
 */
const lazy = require('@phantasm0009/lazy-import').default;

// Example 1: Basic lazy loading
async function basicExample() {
  console.log('=== Basic Lazy Loading ===');
  
  // Create a lazy loader for the 'path' module
  const loadPath = lazy('path');
  
  console.log('✨ Path module not loaded yet (zero startup cost)');
  
  // Load the module when needed - this is when the actual import happens
  const path = await loadPath();
  
  console.log('✅ Path module loaded on-demand!');
  console.log('📁 Joined path:', path.join('/users', 'john', 'documents'));
  console.log('🔍 Module type:', typeof path);
}

// Example 2: Automatic caching (load once, use everywhere)
async function cachingExample() {
  console.log('\n=== Automatic Caching Demonstration ===');
  
  // With caching enabled (default behavior)
  const loadFS = lazy('fs');
  
  console.log('⏱️  Measuring first load time...');
  console.time('First load');
  const fs1 = await loadFS();
  console.timeEnd('First load');
  
  console.log('⚡ Measuring cached load time...');
  console.time('Second load (cached)');
  const fs2 = await loadFS();
  console.timeEnd('Second load (cached)');
  
  console.log('🔄 Same cached instance?', fs1 === fs2); // true
  console.log('💾 Cache status:', loadFS.isCached() ? 'Cached' : 'Not cached');
}

// Example 3: Disabling cache for fresh instances
async function noCacheExample() {
  console.log('\n=== No Cache Example ===');
  
  // Disable caching for scenarios that need fresh instances
  const loadCrypto = lazy('crypto', { cache: false });
  
  console.log('🔄 Loading crypto module twice without caching...');
  const crypto1 = await loadCrypto();
  const crypto2 = await loadCrypto();
  
  console.log('🆕 Different instances (no cache):', crypto1 !== crypto2);
  console.log('📊 Cache status:', loadCrypto.isCached() ? 'Cached' : 'Not cached');
}

// Example 4: Loading multiple modules at once
async function multipleModulesExample() {
  console.log('\n=== Multiple Modules Loading ===');
  
  // Load multiple modules simultaneously for better performance
  const loadUtils = lazy.all({
    fs: 'fs',
    path: 'path',
    os: 'os',
    util: 'util'
  });
  
  console.log('📦 Loading multiple Node.js built-in modules...');
  console.time('Multiple modules load');
  const { fs, path, os, util } = await loadUtils();
  console.timeEnd('Multiple modules load');
  
  console.log('✅ All modules loaded successfully!');
  console.log('🖥️  Platform:', os.platform());
  console.log('🏠 Home directory:', path.join(os.homedir(), 'Documents'));
  console.log('🔍 Util inspect available:', typeof util.inspect === 'function');
}

// Example 5: Preloading for better UX
async function preloadingExample() {
  console.log('\n=== Preloading Example ===');
  
  const loadModule = lazy('crypto');
  
  console.log('🚀 Starting preload in background...');
  // Start loading in background without waiting
  loadModule.preload();
  
  console.log('⚙️  Doing other work while module loads...');
  // Simulate other work
  await new Promise(resolve => setTimeout(resolve, 100));
  
  console.log('⚡ Module should be preloaded now, using it instantly:');
  console.time('Preloaded module access');
  const crypto = await loadModule();
  console.timeEnd('Preloaded module access');
  
  console.log('✅ Crypto module ready:', typeof crypto.randomBytes === 'function');
}

// Example 6: Error handling and retries
async function errorHandlingExample() {
  console.log('\n=== Error Handling Example ===');
  
  // Try to load a module that doesn't exist
  const loadNonExistent = lazy('this-module-does-not-exist', {
    retries: 2,
    retryDelay: 500,
    onError: (error, attempt) => {
      console.log(`❌ Attempt ${attempt} failed:`, error.message);
    }
  });
  
  try {
    await loadNonExistent();
  } catch (error) {
    console.log('🚫 Final error after retries:', error.message);
  }
}

// Example 7: Cache management
async function cacheManagementExample() {
  console.log('\n=== Cache Management ===');
  
  const loadUrl = lazy('url');
  
  // Load and cache the module
  await loadUrl();
  console.log('📥 Module cached:', loadUrl.isCached());
  
  // Clear specific cache
  loadUrl.clearCache();
  console.log('🗑️  Module cache cleared:', loadUrl.isCached());
  
  // Load again (will re-import)
  await loadUrl();
  console.log('📥 Module cached again:', loadUrl.isCached());
  
  // Clear all caches globally
  lazy.clearAllCache();
  console.log('🧹 All caches cleared globally');
}

// Main execution function
async function runAllExamples() {
  console.log('🚀 @phantasm0009/lazy-import - Basic Usage Examples\n');
  console.log('This demonstrates the core functionality of lazy-import for on-demand module loading.\n');
  
  try {
    await basicExample();
    await cachingExample();
    await noCacheExample();
    await multipleModulesExample();
    await preloadingExample();
    await errorHandlingExample();
    await cacheManagementExample();
    
    console.log('\n✅ All examples completed successfully!');
    console.log('\n💡 Key takeaways:');
    console.log('   • Modules load only when needed (zero startup cost)');
    console.log('   • Automatic caching improves performance');
    console.log('   • Multiple loading strategies available');
    console.log('   • Robust error handling and recovery');
    console.log('   • Fine-grained cache control');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

module.exports = { 
  basicExample, 
  cachingExample, 
  noCacheExample,
  multipleModulesExample,
  preloadingExample,
  errorHandlingExample,
  cacheManagementExample,
  runAllExamples
};