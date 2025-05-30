/**
 * Enhanced usage examples showcasing new features
 */
const lazy = require('lazy-import').default;

// Example 1: Caching & Memoization
async function cachingExample() {
  console.log('=== Enhanced Caching Example ===');
  
  // With caching enabled (default)
  const loadPath = lazy('path');
  
  console.log('Is cached before load:', loadPath.isCached());
  
  const path1 = await loadPath();
  console.log('Is cached after load:', loadPath.isCached());
  
  const path2 = await loadPath();
  console.log('Same instance:', path1 === path2);
  
  // Clear cache and reload
  loadPath.clearCache();
  console.log('Is cached after clear:', loadPath.isCached());
  
  const path3 = await loadPath();
  console.log('New instance after clear:', path1 !== path3); // Should be false for built-ins
  
  // Without caching
  console.log('\n--- Without Caching ---');
  const loadPathNoCache = lazy('path', { cache: false });
  console.log('Is cached (no cache mode):', loadPathNoCache.isCached());
}

// Example 2: Preloading
async function preloadingExample() {
  console.log('\n=== Preloading Example ===');
  
  const loadOS = lazy('os');
  
  console.log('Starting preload...');
  console.time('Preload');
  await loadOS.preload();
  console.timeEnd('Preload');
  
  console.log('Using preloaded module...');
  console.time('Use preloaded');
  const os = await loadOS();
  console.timeEnd('Use preloaded');
  
  console.log('Platform:', os.platform());
  console.log('Is cached:', loadOS.isCached());
}

// Example 3: TypeScript-style type inference
async function typeInferenceExample() {
  console.log('\n=== Type Inference Example ===');
  
  // Using typed lazy import
  const loadUtil = lazy.typed('util');
  const util = await loadUtil();
  
  console.log('Util inspect:', util.inspect({ hello: 'world' }));
  
  // Using all with preloading
  const loadModules = lazy.all({
    path: 'path',
    fs: 'fs',
    os: 'os'
  });
  
  console.log('Preloading all modules...');
  await loadModules.preload();
  console.log('All cached:', loadModules.isCached());
  
  const modules = await loadModules();
  console.log('Loaded modules:', Object.keys(modules));
}

// Example 4: Error Handling & Retries
async function errorHandlingExample() {
  console.log('\n=== Error Handling & Retries Example ===');
  
  // Custom error handler
  const loadNonExistent = lazy('non-existent-module-12345', {
    retries: 2,
    retryDelay: 500,
    onError: (error, attempt) => {
      console.log(`Attempt ${attempt} failed:`, error.message);
    }
  });
  
  try {
    await loadNonExistent();
  } catch (error) {
    console.log('Final error after retries:', error.message);
  }
  
  // Working module with retry configuration
  console.log('\n--- Working module with retry config ---');
  const loadFS = lazy('fs', {
    retries: 1,
    onError: (error, attempt) => {
      console.log(`Unexpected error on attempt ${attempt}:`, error.message);
    }
  });
  
  const fs = await loadFS();
  console.log('FS module loaded successfully, has readFileSync:', typeof fs.readFileSync === 'function');
}

// Example 5: Cache management
async function cacheManagementExample() {
  console.log('\n=== Cache Management Example ===');
  
  // Load multiple modules
  const modules = ['path', 'os', 'util', 'crypto'];
  const loaders = modules.map(mod => lazy(mod));
  
  // Load all modules
  for (const loader of loaders) {
    await loader();
  }
  
  console.log('Cache stats before clear:', lazy.getCacheStats());
  
  // Clear specific cache
  loaders[0].clearCache();
  console.log('Cache stats after clearing path:', lazy.getCacheStats());
  
  // Clear all cache
  lazy.clearAllCache();
  console.log('Cache stats after clearing all:', lazy.getCacheStats());
}

// Example 6: Advanced patterns
async function advancedPatternsExample() {
  console.log('\n=== Advanced Patterns Example ===');
  
  // Conditional loading with preload
  const shouldUseAdvancedFeature = true;
  
  if (shouldUseAdvancedFeature) {
    const loadCrypto = lazy('crypto');
    
    // Preload in background
    loadCrypto.preload().catch(err => {
      console.log('Preload failed:', err.message);
    });
    
    // Use later
    setTimeout(async () => {
      if (loadCrypto.isCached()) {
        console.log('Using preloaded crypto module');
        const crypto = await loadCrypto();
        const hash = crypto.createHash('md5').update('hello').digest('hex');
        console.log('MD5 hash of "hello":', hash);
      }
    }, 100);
  }
  
  // Multiple retry strategies
  const strategies = [
    { retries: 0, retryDelay: 0 },
    { retries: 1, retryDelay: 100 },
    { retries: 3, retryDelay: 500 }
  ];
  
  for (const [i, strategy] of strategies.entries()) {
    console.log(`\nStrategy ${i + 1}:`, strategy);
    const loadTest = lazy('fs', strategy);
    
    console.time(`Strategy ${i + 1}`);
    await loadTest();
    console.timeEnd(`Strategy ${i + 1}`);
  }
}

// Run all enhanced examples
async function runEnhancedExamples() {
  await cachingExample();
  await preloadingExample();
  await typeInferenceExample();
  await errorHandlingExample();
  await cacheManagementExample();
  await advancedPatternsExample();
}

if (require.main === module) {
  runEnhancedExamples().catch(console.error);
}

module.exports = {
  cachingExample,
  preloadingExample,
  typeInferenceExample,
  errorHandlingExample,
  cacheManagementExample,
  advancedPatternsExample
};