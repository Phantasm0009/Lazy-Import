/**
 * Advanced usage examples for lazy-import
 * Demonstrates intermediate to advanced patterns and Static Bundle Helper (SBH) features
 * Suitable for developers who want to go beyond basic usage
 */
const lazy = require('lazy-import').default;

// Example 1: Smart preloading with performance monitoring
async function smartPreloadingExample() {
  console.log('=== Smart Preloading Example ===');
  console.log('Demonstrates intelligent preloading strategies for better UX');
  
  const startTime = performance.now();
  
  // Preload critical modules during app initialization
  console.log('🚀 Preloading critical modules...');
  const criticalModules = await lazy.all({
    fs: 'fs',
    path: 'path',
    os: 'os'
  }, { preload: true });
  
  const preloadTime = performance.now() - startTime;
  console.log(`✅ Critical modules preloaded in ${preloadTime.toFixed(2)}ms`);
  
  // Later usage is instant from cache
  const useStartTime = performance.now();
  const { fs, path, os } = await criticalModules();
  const useTime = performance.now() - useStartTime;
  
  console.log(`⚡ Modules accessed from cache in ${useTime.toFixed(2)}ms`);
  console.log(`📊 Performance gain: ${((preloadTime - useTime) / preloadTime * 100).toFixed(1)}% faster`);
  
  // Use the modules
  console.log(`💻 OS: ${os.type()} ${os.arch()}`);
  console.log(`📁 Current directory: ${path.basename(process.cwd())}`);
  console.log(`🗂️  Temp directory: ${os.tmpdir()}`);
}

// Example 2: Conditional loading with fallbacks and retries
async function robustLoadingExample() {
  console.log('\n=== Robust Loading with Fallbacks ===');
  console.log('Demonstrates error handling, retries, and graceful degradation');
  
  async function loadWithFallback(primary, fallback, retries = 2) {
    let lastError;
    
    // Try primary module with retries
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Attempting to load ${primary} (attempt ${attempt}/${retries})`);
        const loadPrimary = lazy(primary);
        const module = await loadPrimary();
        console.log(`✅ Successfully loaded ${primary}`);
        return { module, source: primary };
      } catch (error) {
        lastError = error;
        console.log(`❌ Attempt ${attempt} failed: ${error.message}`);
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 100 * attempt)); // Exponential backoff
        }
      }
    }
    
    // Try fallback
    if (fallback) {
      try {
        console.log(`🔄 Trying fallback: ${fallback}`);
        const loadFallback = lazy(fallback);
        const module = await loadFallback();
        console.log(`✅ Fallback ${fallback} loaded successfully`);
        return { module, source: fallback };
      } catch (fallbackError) {
        console.log(`❌ Fallback also failed: ${fallbackError.message}`);
        throw new Error(`Both primary (${primary}) and fallback (${fallback}) failed`);
      }
    }
    
    throw lastError;
  }
  
  // Example: Try to load a module with fallback
  try {
    const { module: crypto, source } = await loadWithFallback('crypto', 'node:crypto');
    console.log(`🔐 Crypto module loaded from: ${source}`);
    const hash = crypto.createHash('md5').update('hello world').digest('hex');
    console.log(`🔑 MD5 hash: ${hash}`);
  } catch (error) {
    console.log(`💥 All loading attempts failed: ${error.message}`);
  }
}

// Example 3: Module composition and dependency injection
async function moduleCompositionExample() {
  console.log('\n=== Module Composition & Dependency Injection ===');
  console.log('Demonstrates building complex services from lazy-loaded components');
  
  // Create a service that composes multiple modules
  class FileService {
    constructor() {
      this.modules = {};
    }
    
    async init() {
      console.log('🏗️  Initializing FileService...');
      
      // Lazy load dependencies
      const moduleLoaders = lazy.all({
        fs: 'fs/promises',
        path: 'path',
        crypto: 'crypto',
        os: 'os'
      });
      
      this.modules = await moduleLoaders();
      console.log('✅ FileService dependencies loaded');
      return this;
    }
    
    async createSecureFile(filename, content) {
      const { fs, path, crypto, os } = this.modules;
      
      // Generate secure filename
      const hash = crypto.randomBytes(16).toString('hex');
      const secureFilename = `${hash}-${filename}`;
      const fullPath = path.join(os.tmpdir(), secureFilename);
      
      // Write file
      await fs.writeFile(fullPath, content);
      console.log(`📝 Created secure file: ${secureFilename}`);
      
      return {
        path: fullPath,
        filename: secureFilename,
        size: content.length
      };
    }
    
    async readFileInfo(filePath) {
      const { fs, path } = this.modules;
      
      try {
        const stats = await fs.stat(filePath);
        return {
          exists: true,
          size: stats.size,
          name: path.basename(filePath),
          extension: path.extname(filePath),
          modified: stats.mtime
        };
      } catch (error) {
        return { exists: false, error: error.message };
      }
    }
  }
  
  // Use the service
  const fileService = await new FileService().init();
  
  const fileInfo = await fileService.createSecureFile('test.txt', 'Hello, lazy-import!');
  console.log(`📊 File info:`, fileInfo);
  
  const readInfo = await fileService.readFileInfo(fileInfo.path);
  console.log(`📋 File details:`, readInfo);
}

// Example 4: Performance monitoring and analytics
async function performanceMonitoringExample() {
  console.log('\n=== Performance Monitoring & Analytics ===');
  console.log('Demonstrates tracking and optimizing module loading performance');
  
  class LazyLoadingAnalytics {
    constructor() {
      this.loadTimes = new Map();
      this.cacheHits = new Map();
      this.errors = [];
    }
    
    async trackLoad(moduleName, loadFn) {
      const startTime = performance.now();
      const isCached = lazy.isCached && lazy.isCached(moduleName);
      
      try {
        const result = await loadFn();
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        this.loadTimes.set(moduleName, {
          duration,
          cached: isCached,
          timestamp: new Date()
        });
        
        if (isCached) {
          this.cacheHits.set(moduleName, (this.cacheHits.get(moduleName) || 0) + 1);
        }
        
        console.log(`📊 ${moduleName}: ${duration.toFixed(2)}ms ${isCached ? '(cached)' : '(fresh)'}`);
        return result;
      } catch (error) {
        this.errors.push({
          module: moduleName,
          error: error.message,
          timestamp: new Date()
        });
        console.log(`❌ ${moduleName}: failed - ${error.message}`);
        throw error;
      }
    }
    
    getReport() {
      const totalLoads = this.loadTimes.size;
      const totalCacheHits = Array.from(this.cacheHits.values()).reduce((a, b) => a + b, 0);
      const avgLoadTime = Array.from(this.loadTimes.values())
        .map(t => t.duration)
        .reduce((a, b) => a + b, 0) / totalLoads;
      
      return {
        totalLoads,
        totalCacheHits,
        cacheHitRate: totalCacheHits / totalLoads,
        avgLoadTime: avgLoadTime.toFixed(2),
        errors: this.errors.length,
        moduleDetails: Object.fromEntries(this.loadTimes)
      };
    }
  }
  
  const analytics = new LazyLoadingAnalytics();
  
  // Track various module loads
  await analytics.trackLoad('util', async () => {
    const loadUtil = lazy('util');
    return await loadUtil();
  });
  
  await analytics.trackLoad('querystring', async () => {
    const loadQS = lazy('querystring');
    return await loadQS();
  });
  
  await analytics.trackLoad('url', async () => {
    const loadURL = lazy('url');
    return await loadURL();
  });
  
  // Load the same module again (should be cached)
  await analytics.trackLoad('util', async () => {
    const loadUtil = lazy('util');
    return await loadUtil();
  });
  
  const report = analytics.getReport();
  console.log('\n📈 Performance Report:');
  console.log(`Total loads: ${report.totalLoads}`);
  console.log(`Cache hits: ${report.totalCacheHits}`);
  console.log(`Cache hit rate: ${(report.cacheHitRate * 100).toFixed(1)}%`);
  console.log(`Average load time: ${report.avgLoadTime}ms`);
  console.log(`Errors: ${report.errors}`);
}

// Example 5: Static Bundle Helper (SBH) transformation demo
async function sbhTransformationExample() {
  console.log('\n=== Static Bundle Helper (SBH) Transformation ===');
  console.log('Demonstrates how SBH optimizes lazy imports at build time');
  
  console.log('🔧 With SBH, the following code:');
  console.log(`  const loadUtils = lazy.all({ fs: 'fs', path: 'path' });`);
  console.log(`  const { fs, path } = await loadUtils();`);
  
  console.log('\n🚀 Gets transformed to optimized static imports:');
  console.log(`  import fs from 'fs';`);
  console.log(`  import path from 'path';`);
  console.log(`  const loadUtils = () => ({ fs, path });`);
  
  console.log('\n✨ Benefits:');
  console.log('• Better tree-shaking');
  console.log('• Faster runtime performance');
  console.log('• Smaller bundle sizes');
  console.log('• TypeScript-friendly');
  
  // Demonstrate the actual loading (works with or without SBH)
  const loadUtils = lazy.all({ 
    path: 'path',
    os: 'os'
  });
  
  const startTime = performance.now();
  const { path, os } = await loadUtils();
  const endTime = performance.now();
  
  console.log(`\n📦 Loaded utils in ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`📁 Example usage: ${path.join('src', 'components')}`);
  console.log(`💻 Platform: ${os.platform()}`);
}

// Run all advanced examples
async function runAdvancedExamples() {
  console.log('🚀 Running Advanced lazy-import Examples\n');
  console.log('These examples demonstrate intermediate to advanced usage patterns');
  console.log('Perfect for developers ready to leverage lazy-import\'s full potential\n');
  
  try {
    await smartPreloadingExample();
    await robustLoadingExample();
    await moduleCompositionExample();
    await performanceMonitoringExample();
    await sbhTransformationExample();
    
    console.log('\n🎉 All advanced examples completed successfully!');
    console.log('\n📚 Next steps:');
    console.log('• Check out enhanced-usage.js for production-ready patterns');
    console.log('• Read TUTORIAL.md for comprehensive learning guide');
    console.log('• Explore bundler-configs/ for SBH setup examples');
  } catch (error) {
    console.error('\n💥 Error running examples:', error);
  }
}

if (require.main === module) {
  runAdvancedExamples().catch(console.error);
}

module.exports = {
  smartPreloadingExample,
  robustLoadingExample,
  moduleCompositionExample,
  performanceMonitoringExample,
  sbhTransformationExample,
  runAdvancedExamples
};