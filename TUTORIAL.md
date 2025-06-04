# @phantasm0009/lazy-import - Complete Tutorial 🎓

A step-by-step guide to mastering lazy module loading for faster, more efficient JavaScript applications.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Basic Concepts](#basic-concepts)
3. [Core Features](#core-features)
4. [Advanced Patterns](#advanced-patterns)
5. [Static Bundle Helper (SBH)](#static-bundle-helper-sbh)
6. [Real-World Applications](#real-world-applications)
7. [Performance Optimization](#performance-optimization)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## 🚀 Getting Started

### Installation

```bash
npm install @phantasm0009/lazy-import
```

### Your First Lazy Import

Replace static imports with lazy imports to reduce startup time:

```javascript
// ❌ Before: Loads immediately at startup
import lodash from 'lodash';

// ✅ After: Loads only when needed
import lazy from '@phantasm0009/lazy-import';
const loadLodash = lazy('lodash');

async function processData(data) {
  const _ = await loadLodash();
  return _.map(data, item => _.upperCase(item.name));
}
```

**Result**: Your app starts faster because lodash only loads when `processData()` is called.

## 🧠 Basic Concepts

### 1. On-Demand Loading

Traditional imports load everything at startup:

```javascript
// These ALL load immediately, even if unused
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';

function readFile() { return fs.readFileSync('file.txt'); }
function hashData() { return crypto.createHash('sha256'); }
// path and zlib are loaded but never used!
```

With lazy-import, modules load only when called:

```javascript
import lazy from '@phantasm0009/lazy-import';

const loadFS = lazy('fs');
const loadPath = lazy('path');
const loadCrypto = lazy('crypto');
const loadZlib = lazy('zlib');

async function readFile() {
  const fs = await loadFS(); // Only fs loads here
  return fs.readFileSync('file.txt');
}

async function hashData() {
  const crypto = await loadCrypto(); // Only crypto loads here
  return crypto.createHash('sha256');
}
// path and zlib never load unless their functions are called
```

### 2. Automatic Caching

Once loaded, modules are cached for instant reuse:

```javascript
const loadLodash = lazy('lodash');

// First call: Downloads and caches lodash
const lodash1 = await loadLodash(); // ~50ms

// Subsequent calls: Returns cached version
const lodash2 = await loadLodash(); // ~0ms
const lodash3 = await loadLodash(); // ~0ms

console.log(lodash1 === lodash2); // true (same cached instance)
```

## 🔧 Core Features

### 1. Basic Loading

```javascript
import lazy from '@phantasm0009/lazy-import';

// Create lazy loader
const loadModule = lazy('module-name');

// Use the module
const module = await loadModule();
```

### 2. Loading Multiple Modules

```javascript
// Load multiple modules at once
const loadUtils = lazy.all({
  lodash: 'lodash',
  moment: 'moment',
  axios: 'axios'
});

const { lodash, moment, axios } = await loadUtils();
```

### 3. TypeScript Support

```javascript
import lazy from '@phantasm0009/lazy-import';

interface LodashModule {
  default: any;
  map: Function;
  filter: Function;
}

const loadLodash = lazy.typed<LodashModule>('lodash');
const lodash = await loadLodash(); // Full type safety!
```

### 4. Preloading

```javascript
const loadHeavyModule = lazy('heavy-module');

// Start loading in background
loadHeavyModule.preload();

// Do other work...
await doOtherWork();

// Module is likely ready now
const module = await loadHeavyModule(); // Instant!
```

### 5. Error Handling

```javascript
const loadModule = lazy('risky-module', {
  retries: 3,
  retryDelay: 1000,
  onError: (error, attempt) => {
    console.log(`Attempt ${attempt} failed:`, error.message);
  }
});

try {
  const module = await loadModule();
} catch (error) {
  console.log('All retries failed:', error);
}
```

### 6. Cache Management

```javascript
const loadModule = lazy('some-module');

// Check cache status
console.log(loadModule.isCached()); // false

// Load module
await loadModule();
console.log(loadModule.isCached()); // true

// Clear specific cache
loadModule.clearCache();
console.log(loadModule.isCached()); // false

// Clear all caches
lazy.clearAllCache();
```

## 🏗️ Advanced Patterns

### 1. Conditional Loading

```javascript
import lazy from '@phantasm0009/lazy-import';

const loadDevelopmentTools = lazy('dev-tools');
const loadProductionAnalytics = lazy('analytics');

async function initializeApp() {
  if (process.env.NODE_ENV === 'development') {
    const devTools = await loadDevelopmentTools();
    devTools.enable();
  } else {
    const analytics = await loadProductionAnalytics();
    analytics.init();
  }
}
```

### 2. Feature Flags

```javascript
const loadAdvancedFeatures = lazy('advanced-features');
const loadBasicFeatures = lazy('basic-features');

async function initializeFeatures(userTier) {
  if (userTier === 'premium') {
    const advanced = await loadAdvancedFeatures();
    return advanced.initialize();
  } else {
    const basic = await loadBasicFeatures();
    return basic.initialize();
  }
}
```

### 3. Plugin Architecture

```javascript
class PluginManager {
  constructor() {
    this.plugins = new Map();
  }

  register(name, modulePath) {
    this.plugins.set(name, lazy(modulePath));
  }

  async load(name) {
    if (!this.plugins.has(name)) {
      throw new Error(`Plugin ${name} not registered`);
    }
    return await this.plugins.get(name)();
  }
}

const plugins = new PluginManager();
plugins.register('auth', './plugins/auth');
plugins.register('storage', './plugins/storage');

// Load plugins only when needed
const authPlugin = await plugins.load('auth');
```

### 4. Lazy Singleton Pattern

```javascript
class DatabaseManager {
  constructor() {
    this.loadDB = lazy('database-driver');
    this.connection = null;
  }

  async getConnection() {
    if (!this.connection) {
      const DB = await this.loadDB();
      this.connection = new DB.Connection();
    }
    return this.connection;
  }
}

const db = new DatabaseManager();
// Database driver only loads when first connection is requested
```

## ⚡ Static Bundle Helper (SBH)

The Static Bundle Helper transforms `lazy()` calls into native `import()` at build time for production optimization.

### Setup with Vite

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';

export default defineConfig({
  plugins: [
    viteLazyImport({
      // Preserve lazy-import for development
      preserveOptions: process.env.NODE_ENV === 'development',
      // Custom chunk naming
      chunkNameTemplate: '[name]-lazy-[hash]'
    })
  ]
});
```

### How SBH Works

**Input code:**
```javascript
import lazy from '@phantasm0009/lazy-import';

const loadChart = lazy('chart.js');
const chart = await loadChart();
```

**SBH transforms to:**
```javascript
// Development: Uses lazy-import runtime
const loadChart = lazy('chart.js');

// Production: Direct import() with optimized chunks
const loadChart = () => import(
  /* webpackChunkName: "chart-lazy-abc123" */
  'chart.js'
);
```

### Benefits

- **Zero runtime overhead** in production
- **Perfect code splitting** with bundler optimizations
- **Same development experience** with full lazy-import features
- **Universal compatibility** across all major bundlers

## 🌟 Real-World Applications

### 1. CLI Tool with Heavy Dependencies

```javascript
#!/usr/bin/env node
import lazy from '@phantasm0009/lazy-import';

const loadChalk = lazy('chalk');
const loadInquirer = lazy('inquirer');
const loadFiglet = lazy('figlet');

class CLI {
  async showBanner() {
    const figlet = await loadFiglet();
    const chalk = await loadChalk();
    
    console.log(chalk.blue(figlet.textSync('My CLI')));
  }

  async runInteractive() {
    const inquirer = await loadInquirer();
    
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Build', 'Test', 'Deploy']
      }
    ]);
    
    return this.executeAction(answers.action);
  }
}

// CLI starts instantly, loads dependencies only when features are used
```

### 2. Express.js Server with Optional Features

```javascript
import express from 'express';
import lazy from '@phantasm0009/lazy-import';

const loadImageProcessor = lazy('sharp');
const loadPDFGenerator = lazy('puppeteer');
const loadEmailService = lazy('nodemailer');

const app = express();

// Image processing endpoint
app.post('/api/images/resize', async (req, res) => {
  try {
    const sharp = await loadImageProcessor(); // Only loads when needed
    const processedImage = await sharp(req.body.image)
      .resize(200, 200)
      .png()
      .toBuffer();
    
    res.send(processedImage);
  } catch (error) {
    res.status(500).json({ error: 'Image processing failed' });
  }
});

// PDF generation endpoint
app.post('/api/generate-pdf', async (req, res) => {
  const puppeteer = await loadPDFGenerator(); // Only loads when needed
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(req.body.html);
  const pdf = await page.pdf();
  
  res.contentType('application/pdf').send(pdf);
});

// Server starts fast, heavy dependencies load on-demand
app.listen(3000);
```

### 3. React App with Code Splitting

```jsx
import React, { useState } from 'react';
import lazy from '@phantasm0009/lazy-import';

// Combine React.lazy with lazy-import for comprehensive code splitting
const loadUtilities = lazy.all({
  lodash: 'lodash',
  moment: 'moment',
  chartjs: 'chart.js'
});

const HeavyDataComponent = React.lazy(() => import('./HeavyDataComponent'));

function App() {
  const [showChart, setShowChart] = useState(false);

  const handleShowChart = async () => {
    // Preload utilities before showing component
    await loadUtilities();
    setShowChart(true);
  };

  return (
    <div>
      <h1>My App</h1>
      <button onClick={handleShowChart}>
        Show Chart
      </button>
      
      {showChart && (
        <React.Suspense fallback={<div>Loading...</div>}>
          <HeavyDataComponent utilities={loadUtilities} />
        </React.Suspense>
      )}
    </div>
  );
}
```

### 4. Game Engine with Plugin System

```javascript
import lazy from '@phantasm0009/lazy-import';

class GameEngine {
  constructor() {
    this.loadPhysics = lazy('./engines/physics');
    this.loadAudio = lazy('./engines/audio');
    this.loadParticles = lazy('./engines/particles');
    this.loadNetworking = lazy('./engines/networking');
  }

  async initializePhysics() {
    const physics = await this.loadPhysics();
    return new physics.PhysicsEngine();
  }

  async initializeAudio() {
    const audio = await this.loadAudio();
    return new audio.AudioEngine();
  }

  async enableMultiplayer() {
    const networking = await this.loadNetworking();
    return new networking.NetworkEngine();
  }

  async startGame(options) {
    // Load only the engines you need
    const engines = {};

    if (options.physics) {
      engines.physics = await this.initializePhysics();
    }

    if (options.audio) {
      engines.audio = await this.initializeAudio();
    }

    if (options.multiplayer) {
      engines.networking = await this.enableMultiplayer();
    }

    return new Game(engines);
  }
}

// Game starts with minimal footprint, loads engines as needed
const game = new GameEngine();
```

## 📊 Performance Optimization

### 1. Preloading Strategies

```javascript
import lazy from '@phantasm0009/lazy-import';

class SmartPreloader {
  constructor() {
    this.loadHeavyModule = lazy('heavy-module');
    this.loadUserModule = lazy('user-specific-module');
  }

  // Preload based on user interaction
  async onUserHover() {
    // User is likely to click, start preloading
    this.loadHeavyModule.preload();
  }

  async onUserLogin(userType) {
    // Preload user-specific modules
    if (userType === 'admin') {
      lazy.preload('admin-dashboard');
      lazy.preload('user-management');
    }
  }

  // Preload during idle time
  async preloadDuringIdle() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.loadHeavyModule.preload();
      });
    }
  }
}
```

### 2. Intelligent Caching

```javascript
class ModuleCache {
  constructor() {
    this.criticalModules = new Set(['core', 'auth', 'router']);
    this.optionalModules = new Map();
  }

  loadModule(name) {
    const isCritical = this.criticalModules.has(name);
    
    return lazy(name, {
      cache: isCritical, // Cache critical modules
      retries: isCritical ? 3 : 1, // More retries for critical modules
      retryDelay: isCritical ? 500 : 1000
    });
  }

  // Periodically clean optional module cache
  cleanupCache() {
    this.optionalModules.forEach((loader, name) => {
      if (!this.criticalModules.has(name)) {
        loader.clearCache();
      }
    });
  }
}
```

### 3. Performance Monitoring

```javascript
class LazyLoadMonitor {
  constructor() {
    this.metrics = new Map();
  }

  createMonitoredLoader(name, modulePath) {
    const loader = lazy(modulePath, {
      onError: (error, attempt) => {
        this.recordError(name, error, attempt);
      }
    });

    // Wrap loader to collect metrics
    return async () => {
      const start = performance.now();
      
      try {
        const module = await loader();
        const loadTime = performance.now() - start;
        this.recordSuccess(name, loadTime);
        return module;
      } catch (error) {
        this.recordFailure(name, error);
        throw error;
      }
    };
  }

  recordSuccess(name, loadTime) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, { successes: 0, failures: 0, totalTime: 0 });
    }
    
    const metric = this.metrics.get(name);
    metric.successes++;
    metric.totalTime += loadTime;
  }

  getStats() {
    const stats = {};
    
    this.metrics.forEach((metric, name) => {
      stats[name] = {
        successRate: metric.successes / (metric.successes + metric.failures),
        averageLoadTime: metric.totalTime / metric.successes,
        totalLoads: metric.successes + metric.failures
      };
    });
    
    return stats;
  }
}
```

## 💡 Best Practices

### 1. Module Organization

```javascript
// ✅ Group related lazy imports
const uiModules = {
  loadCharts: lazy('chart.js'),
  loadDataGrid: lazy('ag-grid'),
  loadDatePicker: lazy('react-datepicker')
};

// ✅ Create lazy loading utilities
const createLazyUtility = (modulePath) => {
  const loader = lazy(modulePath);
  
  return {
    load: loader,
    preload: () => loader.preload(),
    isLoaded: () => loader.isCached()
  };
};
```

### 2. Error Boundaries

```javascript
class LazyLoadErrorBoundary {
  constructor() {
    this.fallbacks = new Map();
  }

  registerFallback(moduleName, fallbackFn) {
    this.fallbacks.set(moduleName, fallbackFn);
  }

  async safeLoad(loader, moduleName) {
    try {
      return await loader();
    } catch (error) {
      console.warn(`Failed to load ${moduleName}, using fallback`);
      
      if (this.fallbacks.has(moduleName)) {
        return this.fallbacks.get(moduleName)();
      }
      
      throw error;
    }
  }
}

// Usage
const errorBoundary = new LazyLoadErrorBoundary();
errorBoundary.registerFallback('charts', () => import('./fallbacks/basic-chart'));

const loadCharts = lazy('advanced-charts');
const charts = await errorBoundary.safeLoad(loadCharts, 'charts');
```

### 3. Development vs Production

```javascript
// Development: Full lazy-import features
const isDev = process.env.NODE_ENV === 'development';

const createLoader = (modulePath) => {
  return lazy(modulePath, {
    cache: !isDev, // Disable cache in dev for hot reloading
    retries: isDev ? 0 : 3, // No retries in dev (fail fast)
    onError: isDev ? console.error : logToService
  });
};
```

## 🐛 Troubleshooting

### Common Issues

1. **Module not found errors**
   ```javascript
   // ❌ Typo in module name
   const loader = lazy('lodsh'); // Should be 'lodash'
   
   // ✅ Verify module name
   const loader = lazy('lodash');
   ```

2. **TypeScript type errors**
   ```typescript
   // ❌ Missing type annotation
   const loader = lazy('lodash');
   const result = await loader(); // Type 'any'
   
   // ✅ Provide types
   const loader = lazy.typed<typeof import('lodash')>('lodash');
   const result = await loader(); // Fully typed
   ```

3. **Caching issues**
   ```javascript
   // ❌ Expecting fresh instances with caching enabled
   const loader = lazy('module');
   const instance1 = await loader();
   const instance2 = await loader();
   console.log(instance1 === instance2); // true (cached)
   
   // ✅ Disable caching for fresh instances
   const loader = lazy('module', { cache: false });
   ```

### Debugging

```javascript
// Enable debug mode
const loader = lazy('module', {
  onError: (error, attempt) => {
    console.log(`Load attempt ${attempt} failed:`, error);
  }
});

// Check cache status
console.log('Is cached:', loader.isCached());

// Monitor load times
console.time('Module load');
const module = await loader();
console.timeEnd('Module load');
```

## 🎯 Next Steps

1. **Explore Static Bundle Helper**: Set up SBH for production optimization
2. **Monitor Performance**: Implement load time tracking
3. **Optimize Preloading**: Use intelligent preloading strategies
4. **Scale Your Architecture**: Build plugin systems with lazy loading

For more examples and advanced patterns, check out the [examples directory](./examples/) in this repository.

---

**Happy lazy loading! 🚀**

*This tutorial covers all aspects of @phantasm0009/lazy-import. For questions or contributions, visit our [GitHub repository](https://github.com/phantasm0009/lazy-import).*
