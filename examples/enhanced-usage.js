/**
 * Enhanced usage examples showcasing advanced features and patterns
 * of @phantasm0009/lazy-import for production applications
 */
const lazy = require('@phantasm0009/lazy-import').default;

// Example 1: Advanced Caching & Cache Management
async function advancedCachingExample() {
  console.log('=== Advanced Caching & Cache Management ===');
  
  // Create multiple lazy loaders with different caching strategies
  const loadPath = lazy('path'); // Default: cache enabled
  const loadCrypto = lazy('crypto', { cache: false }); // No caching
  const loadFS = lazy('fs'); // Default: cache enabled
  
  console.log('📊 Initial cache states:');
  console.log('  Path cached:', loadPath.isCached());
  console.log('  Crypto cached:', loadCrypto.isCached());
  console.log('  FS cached:', loadFS.isCached());
  
  // Load modules
  console.log('\n⏳ Loading modules...');
  const [path1, crypto1, fs1] = await Promise.all([
    loadPath(),
    loadCrypto(),
    loadFS()
  ]);
  
  console.log('📈 After loading:');
  console.log('  Path cached:', loadPath.isCached());
  console.log('  Crypto cached (no cache mode):', loadCrypto.isCached());
  console.log('  FS cached:', loadFS.isCached());
  
  // Test cache consistency
  const [path2, crypto2, fs2] = await Promise.all([
    loadPath(),
    loadCrypto(),
    loadFS()
  ]);
  
  console.log('\n🔄 Cache consistency:');
  console.log('  Path same instance:', path1 === path2);
  console.log('  Crypto same instance (should be false):', crypto1 === crypto2);
  console.log('  FS same instance:', fs1 === fs2);
  
  // Selective cache clearing
  console.log('\n🗑️  Cache management:');
  loadPath.clearCache();
  console.log('  Path cached after clear:', loadPath.isCached());
  console.log('  FS still cached:', loadFS.isCached());
  
  // Global cache operations
  lazy.clearAllCache();
  console.log('  All caches cleared - FS cached:', loadFS.isCached());
}

// Example 2: Intelligent Preloading Strategies
async function intelligentPreloadingExample() {
  console.log('\n=== Intelligent Preloading Strategies ===');
  
  // Strategy 1: Predictive preloading
  const loadUtilities = lazy.all({
    crypto: 'crypto',
    util: 'util',
    url: 'url'
  });
  
  console.log('🚀 Starting predictive preload...');
  console.time('Predictive preload');
  
  // Preload likely-to-be-used modules
  const preloadPromise = lazy.preload('os'); // Single module preload
  
  // Simulate user interaction delay
  console.log('⏱️  Simulating user interaction (500ms)...');
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // By now, preload should be complete
  await preloadPromise;
  console.timeEnd('Predictive preload');
  
  // Strategy 2: Conditional preloading based on context
  const shouldPreloadHeavyModules = Math.random() > 0.5; // Simulate condition
  
  if (shouldPreloadHeavyModules) {
    console.log('📦 Conditionally preloading heavy modules...');
    await loadUtilities.preload(); // Preload multiple modules
  }
  
  // Strategy 3: Idle-time preloading simulation
  console.log('💤 Idle-time preloading simulation...');
  const loadZlib = lazy('zlib');
  
  // Simulate idle callback
  setTimeout(async () => {
    console.log('🔄 Browser idle detected, preloading zlib...');
    await loadZlib.preload();
    console.log('✅ Zlib preloaded during idle time');
  }, 100);
  
  // Wait for idle preload to complete
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Use the preloaded module - should be instant
  console.log('⚡ Using preloaded modules...');
  console.time('Use preloaded zlib');
  const zlib = await loadZlib();
  console.timeEnd('Use preloaded zlib');
  
  console.log('📋 Preloading strategy results:');
  console.log('  OS module ready:', typeof require('os').platform === 'function');
  console.log('  Zlib module ready:', typeof zlib.gzip === 'function');
}
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

// Example 3: Robust Error Handling & Recovery
async function robustErrorHandlingExample() {
  console.log('\n=== Robust Error Handling & Recovery ===');
  
  // Error handling with retries and custom error handler
  const loadNonExistentModule = lazy('this-definitely-does-not-exist', {
    retries: 3,
    retryDelay: 200,
    onError: (error, attempt) => {
      console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
    }
  });
  
  console.log('🔄 Testing error handling with retries...');
  try {
    await loadNonExistentModule();
  } catch (finalError) {
    console.log(`🚫 All retries exhausted: ${finalError.message}`);
  }
  
  // Graceful fallback pattern
  console.log('\n🛡️  Graceful fallback pattern:');
  
  async function loadWithFallback(primaryModule, fallbackModule) {
    try {
      const primary = lazy(primaryModule, { retries: 1, retryDelay: 100 });
      return await primary();
    } catch (error) {
      console.log(`⚠️  Primary module '${primaryModule}' failed, using fallback...`);
      const fallback = lazy(fallbackModule);
      return await fallback();
    }
  }
  
  // Try to load a non-existent module, fallback to 'path'
  try {
    const module = await loadWithFallback('fake-module', 'path');
    console.log('✅ Fallback successful:', typeof module.join === 'function');
  } catch (error) {
    console.log('❌ Both primary and fallback failed:', error.message);
  }
}

// Example 4: Performance Monitoring & Analytics
async function performanceMonitoringExample() {
  console.log('\n=== Performance Monitoring & Analytics ===');
  
  class LazyLoadAnalytics {
    constructor() {
      this.metrics = new Map();
    }
    
    createMonitoredLoader(name, modulePath) {
      const loader = lazy(modulePath);
      
      // Wrap the loader to collect metrics
      const monitoredLoader = async () => {
        const start = performance.now();
        
        try {
          const module = await loader();
          const loadTime = performance.now() - start;
          this.recordMetric(name, { loadTime, success: true });
          return module;
        } catch (error) {
          const loadTime = performance.now() - start;
          this.recordMetric(name, { loadTime, success: false, error: error.message });
          throw error;
        }
      };
      
      // Preserve lazy-import methods
      monitoredLoader.preload = loader.preload.bind(loader);
      monitoredLoader.clearCache = loader.clearCache.bind(loader);
      monitoredLoader.isCached = loader.isCached.bind(loader);
      
      return monitoredLoader;
    }
    
    recordMetric(name, data) {
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name).push({
        ...data,
        timestamp: Date.now()
      });
    }
    
    getAnalytics() {
      const analytics = {};
      
      this.metrics.forEach((records, name) => {
        const successful = records.filter(r => r.success);
        const failed = records.filter(r => !r.success);
        
        analytics[name] = {
          totalLoads: records.length,
          successRate: (successful.length / records.length) * 100,
          averageLoadTime: successful.length > 0 
            ? successful.reduce((sum, r) => sum + r.loadTime, 0) / successful.length 
            : 0,
          failures: failed.length,
          lastError: failed.length > 0 ? failed[failed.length - 1].error : null
        };
      });
      
      return analytics;
    }
  }
  
  // Use the analytics system
  const analytics = new LazyLoadAnalytics();
  
  console.log('📊 Creating monitored loaders...');
  const loadPath = analytics.createMonitoredLoader('path', 'path');
  const loadCrypto = analytics.createMonitoredLoader('crypto', 'crypto');
  const loadUtil = analytics.createMonitoredLoader('util', 'util');
  
  // Perform multiple loads to generate metrics
  console.log('⏱️  Performing multiple loads for metrics...');
  
  await loadPath();
  await loadCrypto();
  await loadUtil();
  
  // Load again (should be faster due to caching)
  await loadPath();
  await loadCrypto();
  
  // Display analytics
  console.log('\n📈 Performance Analytics:');
  const results = analytics.getAnalytics();
  
  Object.entries(results).forEach(([name, metrics]) => {
    console.log(`\n  ${name}:`);
    console.log(`    Total loads: ${metrics.totalLoads}`);
    console.log(`    Success rate: ${metrics.successRate.toFixed(1)}%`);
    console.log(`    Average load time: ${metrics.averageLoadTime.toFixed(2)}ms`);
    console.log(`    Failures: ${metrics.failures}`);
  });
}

// Example 5: Advanced Patterns - Plugin Architecture
async function pluginArchitectureExample() {
  console.log('\n=== Advanced Plugin Architecture ===');
  
  class PluginManager {
    constructor() {
      this.plugins = new Map();
      this.loadedPlugins = new Map();
    }
    
    register(name, modulePath, config = {}) {
      this.plugins.set(name, {
        loader: lazy(modulePath, config),
        config,
        dependencies: config.dependencies || []
      });
      console.log(`🔌 Plugin '${name}' registered`);
    }
    
    async load(name) {
      if (this.loadedPlugins.has(name)) {
        return this.loadedPlugins.get(name);
      }
      
      if (!this.plugins.has(name)) {
        throw new Error(`Plugin '${name}' not registered`);
      }
      
      const plugin = this.plugins.get(name);
      
      // Load dependencies first
      const dependencies = {};
      for (const depName of plugin.dependencies) {
        dependencies[depName] = await this.load(depName);
      }
      
      console.log(`📦 Loading plugin '${name}'...`);
      const module = await plugin.loader();
      
      // Initialize plugin if it has an init method
      let initializedPlugin = module;
      if (module.init && typeof module.init === 'function') {
        initializedPlugin = await module.init(dependencies, plugin.config);
      }
      
      this.loadedPlugins.set(name, initializedPlugin);
      console.log(`✅ Plugin '${name}' loaded successfully`);
      
      return initializedPlugin;
    }
    
    async loadAll() {
      const results = {};
      for (const [name] of this.plugins) {
        results[name] = await this.load(name);
      }
      return results;
    }
    
    isLoaded(name) {
      return this.loadedPlugins.has(name);
    }
    
    getStats() {
      return {
        registered: this.plugins.size,
        loaded: this.loadedPlugins.size,
        loadedPlugins: Array.from(this.loadedPlugins.keys())
      };
    }
  }
  
  // Demo the plugin system
  const pluginManager = new PluginManager();
  
  // Register core plugins (using Node.js built-ins as examples)
  pluginManager.register('logger', 'util', {
    retries: 2,
    dependencies: []
  });
  
  pluginManager.register('crypto', 'crypto', {
    dependencies: ['logger'],
    cache: true
  });
  
  pluginManager.register('fileSystem', 'fs', {
    dependencies: ['logger'],
    retries: 3
  });
  
  // Load specific plugins
  console.log('\n🚀 Loading specific plugins...');
  const logger = await pluginManager.load('logger');
  console.log('📝 Logger loaded:', typeof logger.inspect === 'function');
  
  const cryptoPlugin = await pluginManager.load('crypto');
  console.log('🔒 Crypto loaded:', typeof cryptoPlugin.randomBytes === 'function');
  
  // Check stats
  console.log('\n📊 Plugin Manager Stats:');
  const stats = pluginManager.getStats();
  console.log('  Registered plugins:', stats.registered);
  console.log('  Loaded plugins:', stats.loaded);
  console.log('  Loaded plugin names:', stats.loadedPlugins.join(', '));
}

// Example 6: Memory-Efficient Batch Operations
async function memoryEfficientBatchExample() {
  console.log('\n=== Memory-Efficient Batch Operations ===');
  
  class BatchProcessor {
    constructor(batchSize = 3) {
      this.batchSize = batchSize;
      this.processed = 0;
    }
    
    async processBatch(moduleNames) {
      console.log(`🔄 Processing batch of ${moduleNames.length} modules...`);
      
      // Process in smaller batches to control memory usage
      for (let i = 0; i < moduleNames.length; i += this.batchSize) {
        const batch = moduleNames.slice(i, i + this.batchSize);
        console.log(`  📦 Processing batch ${Math.floor(i / this.batchSize) + 1}: ${batch.join(', ')}`);
        
        // Load batch with timeout control
        const loaders = batch.map(name => {
          const loader = lazy(name, { 
            cache: false, // Don't cache to save memory
            retries: 1 
          });
          return { name, loader };
        });
        
        const results = await Promise.allSettled(
          loaders.map(async ({ name, loader }) => {
            try {
              const module = await loader();
              return { name, success: true, moduleType: typeof module };
            } catch (error) {
              return { name, success: false, error: error.message };
            }
          })
        );
        
        // Process results
        results.forEach((result, index) => {
          const { name } = loaders[index];
          if (result.status === 'fulfilled') {
            const { success, moduleType, error } = result.value;
            if (success) {
              console.log(`    ✅ ${name}: ${moduleType}`);
              this.processed++;
            } else {
              console.log(`    ❌ ${name}: ${error}`);
            }
          } else {
            console.log(`    ❌ ${name}: Promise rejected`);
          }
        });
        
        // Small delay between batches to allow GC
        if (i + this.batchSize < moduleNames.length) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
      
      console.log(`✅ Batch processing complete. Processed: ${this.processed}/${moduleNames.length}`);
    }
  }
  
  // Test with Node.js built-in modules
  const processor = new BatchProcessor(2);
  const moduleNames = ['path', 'fs', 'os', 'crypto', 'util', 'url', 'querystring'];
  
  await processor.processBatch(moduleNames);
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

// Main execution function with comprehensive examples
async function runEnhancedExamples() {
  console.log('🚀 @phantasm0009/lazy-import - Enhanced Usage Examples\n');
  console.log('Advanced patterns and production-ready implementations for lazy loading.\n');
  
  try {
    await advancedCachingExample();
    await intelligentPreloadingExample();
    await robustErrorHandlingExample();
    await performanceMonitoringExample();
    await pluginArchitectureExample();
    await memoryEfficientBatchExample();
    
    console.log('\n🎉 All enhanced examples completed successfully!');
    console.log('\n💡 Key production patterns demonstrated:');
    console.log('   • Advanced cache management strategies');
    console.log('   • Intelligent preloading for better UX');
    console.log('   • Robust error handling with fallbacks');
    console.log('   • Performance monitoring and analytics');
    console.log('   • Scalable plugin architecture');
    console.log('   • Memory-efficient batch processing');
    console.log('\n🏗️  These patterns are production-ready and can be adapted for your specific use cases.');
    
  } catch (error) {
    console.error('❌ Error running enhanced examples:', error);
  }
}

// Execute if run directly
if (require.main === module) {
  runEnhancedExamples();
}

module.exports = {
  advancedCachingExample,
  intelligentPreloadingExample,
  robustErrorHandlingExample,
  performanceMonitoringExample,
  pluginArchitectureExample,
  memoryEfficientBatchExample,
  runEnhancedExamples
};