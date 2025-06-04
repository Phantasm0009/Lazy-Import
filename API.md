# API Reference - @phantasm0009/lazy-import 📚

Complete API reference for all methods, options, and TypeScript interfaces.

## 📋 Table of Contents

1. [Core API](#core-api)
2. [Configuration Options](#configuration-options)
3. [TypeScript Interfaces](#typescript-interfaces)
4. [Static Bundle Helper API](#static-bundle-helper-api)
5. [Error Types](#error-types)
6. [Utility Methods](#utility-methods)

## 🔧 Core API

### `lazy(modulePath, options?)`

Creates a lazy loader function for the specified module.

```typescript
function lazy<T = any>(
  modulePath: string, 
  options?: LazyImportOptions
): LazyImportFunction<T>
```

**Parameters:**
- `modulePath` (string): Path to the module to import
- `options` (LazyImportOptions, optional): Configuration options

**Returns:** `LazyImportFunction<T>` - A function that loads the module when called

**Example:**
```javascript
import lazy from '@phantasm0009/lazy-import';

const loadLodash = lazy('lodash');
const lodash = await loadLodash();
```

### `lazy.all(moduleMap, options?)`

Creates a loader for multiple modules that can be imported simultaneously.

```typescript
function all<T extends Record<string, string>>(
  moduleMap: T,
  options?: LazyImportOptions
): LazyImportFunction<{ [K in keyof T]: any }>
```

**Parameters:**
- `moduleMap` (object): Object mapping names to module paths
- `options` (LazyImportOptions, optional): Configuration options

**Returns:** `LazyImportFunction` - A function that loads all modules when called

**Example:**
```javascript
const loadUtils = lazy.all({
  lodash: 'lodash',
  moment: 'moment',
  axios: 'axios'
});

const { lodash, moment, axios } = await loadUtils();
```

### `lazy.typed<T>(modulePath, options?)`

Creates a typed lazy loader with full TypeScript inference.

```typescript
function typed<T>(
  modulePath: string, 
  options?: LazyImportOptions
): LazyImportFunction<T>
```

**Parameters:**
- `T` (type): TypeScript type for the module
- `modulePath` (string): Path to the module to import
- `options` (LazyImportOptions, optional): Configuration options

**Returns:** `LazyImportFunction<T>` - A typed function that loads the module

**Example:**
```typescript
interface LodashModule {
  default: any;
  map: Function;
  filter: Function;
}

const loadLodash = lazy.typed<LodashModule>('lodash');
const lodash = await loadLodash(); // Fully typed
```

### `lazy.preload(modulePath, options?)`

Preloads a module without using it immediately.

```typescript
function preload(
  modulePath: string, 
  options?: LazyImportOptions
): Promise<void>
```

**Parameters:**
- `modulePath` (string): Path to the module to preload
- `options` (LazyImportOptions, optional): Configuration options

**Returns:** `Promise<void>` - Resolves when preloading completes

**Example:**
```javascript
// Start preloading
await lazy.preload('heavy-module');

// Later, use it instantly (already cached)
const module = await lazy('heavy-module')();
```

### `lazy.clearAllCache()`

Clears all cached modules globally.

```typescript
function clearAllCache(): void
```

**Example:**
```javascript
lazy.clearAllCache();
```

## ⚙️ Configuration Options

### `LazyImportOptions`

Configuration object for customizing lazy import behavior.

```typescript
interface LazyImportOptions {
  cache?: boolean;
  retries?: number;
  retryDelay?: number;
  onError?: (error: Error, attempt: number) => void;
}
```

#### `cache` (boolean)
- **Default:** `true`
- **Description:** Whether to cache the loaded module for subsequent calls
- **Example:**
  ```javascript
  const loader = lazy('module', { cache: false }); // Fresh instance each time
  ```

#### `retries` (number)
- **Default:** `0`
- **Description:** Number of retry attempts on import failure
- **Example:**
  ```javascript
  const loader = lazy('unreliable-module', { retries: 3 });
  ```

#### `retryDelay` (number)
- **Default:** `1000`
- **Description:** Delay in milliseconds between retry attempts
- **Example:**
  ```javascript
  const loader = lazy('module', { 
    retries: 3, 
    retryDelay: 500 // 500ms between retries
  });
  ```

#### `onError` (function)
- **Default:** `undefined`
- **Description:** Custom error handler called on each failed attempt
- **Signature:** `(error: Error, attempt: number) => void`
- **Example:**
  ```javascript
  const loader = lazy('module', {
    retries: 2,
    onError: (error, attempt) => {
      console.log(`Attempt ${attempt} failed:`, error.message);
    }
  });
  ```

## 🏷️ TypeScript Interfaces

### `LazyImportFunction<T>`

The function returned by `lazy()` calls.

```typescript
interface LazyImportFunction<T = any> {
  (): Promise<T>;
  preload(): Promise<void>;
  clearCache(): void;
  isCached(): boolean;
}
```

#### Methods

##### `()` - Load Module
- **Returns:** `Promise<T>` - The loaded module
- **Description:** Loads and returns the module

##### `preload()`
- **Returns:** `Promise<void>` - Resolves when preloading completes
- **Description:** Preloads the module without returning it

##### `clearCache()`
- **Returns:** `void`
- **Description:** Clears the cached module for this loader

##### `isCached()`
- **Returns:** `boolean` - Whether the module is currently cached
- **Description:** Checks if the module is in cache

**Example:**
```typescript
const loadModule = lazy('module');

// Load module
const module = await loadModule();

// Preload module
await loadModule.preload();

// Check cache status
if (loadModule.isCached()) {
  console.log('Module is cached');
}

// Clear cache
loadModule.clearCache();
```

### `LazyImportError`

Error type for lazy import failures.

```typescript
class LazyImportError extends Error {
  constructor(
    public modulePath: string,
    public originalError: Error,
    public attempt: number
  ) {
    super(`Failed to import '${modulePath}' after ${attempt} attempt(s): ${originalError.message}`);
    this.name = 'LazyImportError';
  }
}
```

**Properties:**
- `modulePath` (string): The module path that failed to load
- `originalError` (Error): The original import error
- `attempt` (number): The attempt number when the error occurred

## 🚀 Static Bundle Helper API

### Bundler Plugins

#### Vite Plugin

```typescript
import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';

interface ViteLazyImportOptions {
  chunkComment?: boolean;
  preserveOptions?: boolean;
  stringLiteralsOnly?: boolean;
  chunkNameTemplate?: string;
  debug?: boolean;
  importSpecifiers?: string[];
  moduleNames?: string[];
}

function viteLazyImport(options?: ViteLazyImportOptions): Plugin
```

#### Rollup Plugin

```typescript
import { rollupLazyImport } from '@phantasm0009/lazy-import/bundler';

function rollupLazyImport(options?: RollupLazyImportOptions): Plugin
```

#### Webpack Plugin

```typescript
import { WebpackLazyImportPlugin } from '@phantasm0009/lazy-import/bundler';

class WebpackLazyImportPlugin {
  constructor(options?: WebpackLazyImportOptions)
  apply(compiler: Compiler): void
}
```

#### Babel Plugin

```typescript
import { babelLazyImport } from '@phantasm0009/lazy-import/bundler';

function babelLazyImport(options?: BabelLazyImportOptions): PluginObj
```

#### esbuild Plugin

```typescript
import { esbuildLazyImport } from '@phantasm0009/lazy-import/bundler';

function esbuildLazyImport(options?: EsbuildLazyImportOptions): Plugin
```

### SBH Configuration Options

#### `chunkComment` (boolean)
- **Default:** `true`
- **Description:** Add webpack chunk name comments to generated imports

#### `preserveOptions` (boolean)
- **Default:** `false`
- **Description:** Preserve lazy-import runtime for development

#### `stringLiteralsOnly` (boolean)
- **Default:** `false`
- **Description:** Only transform string literal module paths

#### `chunkNameTemplate` (string)
- **Default:** `'[name]-lazy-[hash]'`
- **Description:** Template for generated chunk names

#### `debug` (boolean)
- **Default:** `false`
- **Description:** Enable debug logging during transformation

#### `importSpecifiers` (string[])
- **Default:** `['lazy', 'default']`
- **Description:** Import specifiers to transform

#### `moduleNames` (string[])
- **Default:** `['@phantasm0009/lazy-import', 'lazy-import']`
- **Description:** Module names to recognize for transformation

**Example Configuration:**
```javascript
// vite.config.js
import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';

export default defineConfig({
  plugins: [
    viteLazyImport({
      chunkComment: true,
      preserveOptions: process.env.NODE_ENV === 'development',
      chunkNameTemplate: '[name]-lazy-[hash:8]',
      debug: false
    })
  ]
});
```

## ❌ Error Types

### `LazyImportError`

Primary error type for lazy import failures.

```typescript
class LazyImportError extends Error {
  name: 'LazyImportError';
  modulePath: string;
  originalError: Error;
  attempt: number;
}
```

### `ModuleNotFoundError`

Thrown when a module cannot be resolved.

```typescript
class ModuleNotFoundError extends LazyImportError {
  name: 'ModuleNotFoundError';
}
```

### `ImportRetryExhaustedError`

Thrown when all retry attempts are exhausted.

```typescript
class ImportRetryExhaustedError extends LazyImportError {
  name: 'ImportRetryExhaustedError';
  totalAttempts: number;
}
```

## 🛠️ Utility Methods

### Cache Management

#### Global Cache Operations

```typescript
// Clear all cached modules
lazy.clearAllCache(): void

// Get cache statistics (if available)
lazy.getCacheStats?(): CacheStats
```

#### Individual Cache Operations

```typescript
const loader = lazy('module');

// Check cache status
loader.isCached(): boolean

// Clear specific cache
loader.clearCache(): void
```

### Development Utilities

#### Debug Mode

```javascript
// Enable debug logging (if supported)
const loader = lazy('module', { debug: true });
```

#### Performance Monitoring

```javascript
// Custom performance tracking
const loader = lazy('module', {
  onError: (error, attempt) => {
    // Log to analytics service
    analytics.track('lazy_import_error', {
      module: 'module',
      attempt,
      error: error.message
    });
  }
});
```

## 📝 Usage Examples

### Basic Usage

```typescript
import lazy from '@phantasm0009/lazy-import';

// Simple lazy loading
const loadLodash = lazy('lodash');
const lodash = await loadLodash();

// With options
const loadModule = lazy('module', {
  cache: true,
  retries: 3,
  retryDelay: 500
});
```

### Advanced Usage

```typescript
// Multiple modules
const loadUtils = lazy.all({
  lodash: 'lodash',
  moment: 'moment'
});

// Typed loading
interface MyModule {
  default: any;
  helper: Function;
}

const loadTyped = lazy.typed<MyModule>('my-module');

// Preloading
await lazy.preload('heavy-module');
const heavy = await lazy('heavy-module')(); // Instant
```

### Error Handling

```typescript
const loader = lazy('risky-module', {
  retries: 3,
  retryDelay: 1000,
  onError: (error, attempt) => {
    console.warn(`Load attempt ${attempt} failed:`, error.message);
  }
});

try {
  const module = await loader();
} catch (error) {
  if (error instanceof LazyImportError) {
    console.error(`Failed to load ${error.modulePath}`);
  }
}
```

## 🔗 Related APIs

- [Main README](./README.md) - Complete package documentation
- [Tutorial](./TUTORIAL.md) - Step-by-step learning guide
- [Migration Guide](./MIGRATION.md) - Upgrading from other solutions
- [Examples](./examples/) - Practical usage examples

---

**For more information, visit the [GitHub repository](https://github.com/phantasm0009/lazy-import) or check out the [npm package](https://www.npmjs.com/package/@phantasm0009/lazy-import).**
