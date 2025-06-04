# Migration Guide - Upgrading to @phantasm0009/lazy-import 🔄

Complete migration guide for switching from other lazy loading solutions or upgrading from older versions.

## 📋 Migration Paths

- [From Dynamic Imports](#from-dynamic-imports)
- [From React.lazy](#from-reactlazy)
- [From Webpack Code Splitting](#from-webpack-code-splitting)
- [From Lodable Components](#from-loadable-components)
- [From Custom Lazy Loading](#from-custom-lazy-loading)
- [From Previous Versions](#from-previous-versions)

## 🚀 From Dynamic Imports

### Before: Manual Dynamic Imports

```javascript
// ❌ Manual dynamic imports with custom caching
const moduleCache = new Map();

async function loadModule(moduleName) {
  if (moduleCache.has(moduleName)) {
    return moduleCache.get(moduleName);
  }
  
  try {
    const module = await import(moduleName);
    moduleCache.set(moduleName, module);
    return module;
  } catch (error) {
    console.error(`Failed to load ${moduleName}:`, error);
    throw error;
  }
}

// Usage
const lodash = await loadModule('lodash');
```

### After: @phantasm0009/lazy-import

```javascript
// ✅ Simple and feature-rich
import lazy from '@phantasm0009/lazy-import';

const loadLodash = lazy('lodash');
const lodash = await loadLodash();
```

### Migration Steps

1. **Install the package**:
   ```bash
   npm install @phantasm0009/lazy-import
   ```

2. **Replace manual caching logic**:
   ```javascript
   // Remove your custom cache implementation
   // const moduleCache = new Map(); // ❌ Remove

   // Replace with lazy-import
   import lazy from '@phantasm0009/lazy-import';
   ```

3. **Update load functions**:
   ```javascript
   // Before
   async function loadModule(moduleName) {
     // ... custom logic
   }

   // After
   const loadModule = lazy(moduleName);
   ```

4. **Benefits gained**:
   - Automatic caching with cache control
   - Error handling and retries
   - TypeScript support
   - Preloading capabilities
   - Static Bundle Helper optimization

## ⚛️ From React.lazy

### Before: React.lazy Only

```javascript
// ❌ Limited to React components
const LazyComponent = React.lazy(() => import('./HeavyComponent'));
const LazyChart = React.lazy(() => import('./ChartComponent'));

// No support for non-component modules
import('lodash').then(lodash => {
  // Manual handling required
});
```

### After: React.lazy + lazy-import

```javascript
// ✅ Best of both worlds
import React from 'react';
import lazy from '@phantasm0009/lazy-import';

// React components with React.lazy
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Utilities with lazy-import
const loadLodash = lazy('lodash');
const loadChartJS = lazy('chart.js');

function MyComponent() {
  const handleShowChart = async () => {
    // Preload utilities before showing component
    const [lodash, chartjs] = await Promise.all([
      loadLodash(),
      loadChartJS()
    ]);
    
    // Use utilities...
  };

  return (
    <div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    </div>
  );
}
```

### Migration Strategy

1. **Keep React.lazy for components**:
   ```javascript
   // Keep this for React components
   const LazyComponent = React.lazy(() => import('./Component'));
   ```

2. **Use lazy-import for utilities**:
   ```javascript
   // Add this for non-component modules
   const loadUtilities = lazy.all({
     lodash: 'lodash',
     axios: 'axios',
     moment: 'moment'
   });
   ```

3. **Combine for optimal performance**:
   ```javascript
   // Preload utilities before component mounts
   const LazyDashboard = React.lazy(async () => {
     // Preload dependencies
     await loadUtilities();
     return import('./Dashboard');
   });
   ```

## 📦 From Webpack Code Splitting

### Before: Webpack Magic Comments

```javascript
// ❌ Webpack-specific syntax
const loadLodash = () => import(
  /* webpackChunkName: "lodash" */
  /* webpackPreload: true */
  'lodash'
);

// Manual error handling
loadLodash().catch(error => {
  console.error('Failed to load lodash:', error);
});
```

### After: Universal Solution

```javascript
// ✅ Works with all bundlers
import lazy from '@phantasm0009/lazy-import';

const loadLodash = lazy('lodash', {
  retries: 3,
  retryDelay: 1000,
  onError: (error, attempt) => {
    console.log(`Attempt ${attempt} failed:`, error.message);
  }
});

// Preloading
loadLodash.preload();
```

### Migration Benefits

1. **Universal bundler support**: Works with Vite, Rollup, Webpack, esbuild
2. **Built-in error handling**: No need for manual `.catch()`
3. **Caching included**: Automatic module caching
4. **Static Bundle Helper**: Transforms to optimal bundler-specific code

## 🔧 From Loadable Components

### Before: @loadable/component

```javascript
// ❌ React-specific, limited features
import loadable from '@loadable/component';

const AsyncComponent = loadable(() => import('./Component'), {
  fallback: <div>Loading...</div>
});

// Manual utility loading
import('./utils').then(utils => {
  // Handle manually
});
```

### After: More Flexible Solution

```javascript
// ✅ Works everywhere, not just React
import React from 'react';
import lazy from '@phantasm0009/lazy-import';

// For React components
const LazyComponent = React.lazy(() => import('./Component'));

// For utilities with advanced features
const loadUtils = lazy('./utils');
const loadAPI = lazy('./api', {
  retries: 3,
  preload: true // Auto-preload
});

function App() {
  React.useEffect(() => {
    // Preload utilities on app start
    loadUtils.preload();
    loadAPI.preload();
  }, []);

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
```

## 🛠️ From Custom Lazy Loading

### Before: Custom Implementation

```javascript
// ❌ Custom lazy loading with limitations
class CustomLazyLoader {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  async load(modulePath) {
    if (this.cache.has(modulePath)) {
      return this.cache.get(modulePath);
    }

    if (this.loading.has(modulePath)) {
      return this.loading.get(modulePath);
    }

    const promise = import(modulePath).then(module => {
      this.cache.set(modulePath, module);
      this.loading.delete(modulePath);
      return module;
    });

    this.loading.set(modulePath, promise);
    return promise;
  }
}

const loader = new CustomLazyLoader();
```

### After: Feature-Rich Solution

```javascript
// ✅ All features included
import lazy from '@phantasm0009/lazy-import';

// Replace entire custom implementation
const loadModule = lazy('module-path');

// All features available:
// - Automatic caching
// - Duplicate request deduplication
// - Error handling and retries
// - TypeScript support
// - Preloading
// - Cache management
```

### Migration Steps

1. **Remove custom implementation**
2. **Replace with lazy-import**
3. **Gain additional features**:
   - Error handling
   - Retries
   - Preloading
   - TypeScript support
   - Static Bundle Helper

## 📈 From Previous Versions

### v1.x to v2.x

#### Breaking Changes

1. **Import path changed**:
   ```javascript
   // ❌ v1.x
   import lazy from 'lazy-import';

   // ✅ v2.x
   import lazy from '@phantasm0009/lazy-import';
   ```

2. **Static Bundle Helper added**:
   ```javascript
   // New in v2.x - build-time optimization
   import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';
   ```

#### New Features

1. **Enhanced TypeScript support**:
   ```javascript
   // New typed method
   const loadModule = lazy.typed<ModuleType>('module');
   ```

2. **Multiple module loading**:
   ```javascript
   // New lazy.all method
   const loadUtils = lazy.all({
     lodash: 'lodash',
     axios: 'axios'
   });
   ```

3. **Advanced error handling**:
   ```javascript
   // Enhanced error options
   const loadModule = lazy('module', {
     retries: 3,
     retryDelay: 1000,
     onError: (error, attempt) => { /* handle */ }
   });
   ```

#### Migration Steps

1. **Update package name**:
   ```bash
   npm uninstall lazy-import
   npm install @phantasm0009/lazy-import
   ```

2. **Update imports**:
   ```javascript
   // Update all imports
   import lazy from '@phantasm0009/lazy-import';
   ```

3. **Add Static Bundle Helper** (optional but recommended):
   ```javascript
   // vite.config.js
   import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';

   export default defineConfig({
     plugins: [viteLazyImport()]
   });
   ```

4. **Leverage new features**:
   ```javascript
   // Use new multiple loading
   const loadUtils = lazy.all({
     lodash: 'lodash',
     moment: 'moment'
   });

   // Use enhanced error handling
   const loadModule = lazy('module', {
     retries: 3,
     onError: console.error
   });
   ```

## 📊 Performance Comparison

| Feature | Manual Import | React.lazy | @loadable | lazy-import |
|---------|---------------|------------|-----------|-------------|
| Caching | Manual | ❌ | ✅ | ✅ |
| Error Handling | Manual | ❌ | ❌ | ✅ |
| Retries | Manual | ❌ | ❌ | ✅ |
| TypeScript | Manual | Partial | Partial | ✅ |
| Preloading | Manual | ❌ | ✅ | ✅ |
| Universal Support | ✅ | React Only | React Only | ✅ |
| Build Optimization | Manual | ❌ | ❌ | ✅ (SBH) |
| Bundle Size | Varies | Small | Medium | Small |

## 🎯 Migration Checklist

- [ ] Install @phantasm0009/lazy-import
- [ ] Update import statements
- [ ] Replace manual caching logic
- [ ] Add error handling where needed
- [ ] Set up Static Bundle Helper
- [ ] Test lazy loading behavior
- [ ] Monitor performance improvements
- [ ] Update TypeScript types
- [ ] Add preloading where beneficial
- [ ] Remove old dependencies

## 💡 Migration Tips

1. **Gradual migration**: Migrate one module at a time
2. **Test thoroughly**: Ensure all lazy-loaded modules work correctly
3. **Monitor performance**: Compare before/after metrics
4. **Use TypeScript**: Take advantage of full type safety
5. **Enable SBH**: Get production optimizations
6. **Document changes**: Update team documentation

## 🆘 Migration Support

If you encounter issues during migration:

1. Check the [troubleshooting guide](./TUTORIAL.md#troubleshooting)
2. Review [examples](./examples/) for common patterns
3. Open an issue on [GitHub](https://github.com/phantasm0009/lazy-import)
4. Join our community discussions

---

**Migration complete! Enjoy faster, more efficient lazy loading! 🎉**
