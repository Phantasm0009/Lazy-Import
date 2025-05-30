/**
 * Advanced usage examples for lazy-import
 */
const lazy = require('lazy-import').default;

// Example 1: Preloading modules
async function preloadExample() {
  console.log('=== Preload Example ===');
  
  // Preload a module in the background
  console.log('Preloading os module...');
  const osModule = await lazy.preload('os');
  
  console.log('OS Platform:', osModule.platform());
  console.log('CPU Count:', osModule.cpus().length);
  
  // Later use - will be instant since it's cached
  const loadOS = lazy('os');
  const os = await loadOS();
  
  console.log('Same instance from cache:', osModule === os);
}

// Example 2: Loading multiple modules
async function multipleModulesExample() {
  console.log('\n=== Multiple Modules Example ===');
  
  const loadUtilities = lazy.all({
    path: 'path',
    os: 'os',
    util: 'util'
  });
  
  console.log('Loading multiple modules...');
  const { path, os, util } = await loadUtilities();
  
  console.log('Path join:', path.join('/', 'home', 'user'));
  console.log('OS type:', os.type());
  console.log('Util inspect:', util.inspect({ hello: 'world' }));
}

// Example 3: Conditional loading with error handling
async function conditionalLoadingExample() {
  console.log('\n=== Conditional Loading Example ===');
  
  // Try to load an optional module
  async function loadOptionalFeature(featureName) {
    try {
      const loadFeature = lazy(featureName);
      const feature = await loadFeature();
      console.log(`✅ ${featureName} loaded successfully`);
      return feature;
    } catch (error) {
      console.log(`❌ ${featureName} failed to load:`, error.message);
      return null;
    }
  }
  
  // This will work
  await loadOptionalFeature('fs');
  
  // This will fail gracefully
  await loadOptionalFeature('non-existent-module');
}

// Example 4: Sync-like usage
async function syncLikeExample() {
  console.log('\n=== Sync-like Example ===');
  
  const loadURL = lazy.sync('url');
  
  console.log('Using sync-like API...');
  const url = await loadURL();
  
  const parsed = url.parse('https://example.com/path?query=value');
  console.log('Parsed URL hostname:', parsed.hostname);
}

// Run advanced examples
async function runAdvancedExamples() {
  await preloadExample();
  await multipleModulesExample();
  await conditionalLoadingExample();
  await syncLikeExample();
}

if (require.main === module) {
  runAdvancedExamples().catch(console.error);
}

module.exports = {
  preloadExample,
  multipleModulesExample,
  conditionalLoadingExample,
  syncLikeExample
};