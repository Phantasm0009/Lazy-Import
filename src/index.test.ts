/**
 * Integration tests for lazy-import using real Node.js modules
 */
import lazy from './index';

describe('lazy-import', () => {
  beforeEach(() => {
    // Clear any module cache between tests if needed
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should create a lazy import function', () => {
      const importModule = lazy('path'); // Node.js built-in module
      expect(typeof importModule).toBe('function');
    });

    it('should dynamically import a Node.js built-in module', async () => {
      const importPath = lazy('path');
      const pathModule = await importPath();
      
      // Test that we got the path module with expected functions
      expect(typeof pathModule.join).toBe('function');
      expect(typeof pathModule.resolve).toBe('function');
      expect(typeof pathModule.basename).toBe('function');
    });

    it('should handle modules with exports', async () => {
      const importModule = lazy('path');
      const result = await importModule();
      
      // Path module should have the expected structure
      expect(result).toBeDefined();
      expect(typeof result.join).toBe('function');
      expect(typeof result.dirname).toBe('function');
    });
  });

  describe('caching behavior', () => {
    it('should cache modules by default', async () => {
      const cachedImport = lazy('fs');
      
      // First call
      const firstResult = await cachedImport();
      
      // Second call should return the same instance
      const secondResult = await cachedImport();
      
      // Results should be identical objects (same reference)
      expect(firstResult).toBe(secondResult);
      expect(typeof firstResult.readFileSync).toBe('function');
    });
    
    it('should work with cache disabled flag', async () => {
      // With built-in modules, even without cache they return the same object
      // But we can verify the function works correctly
      const nonCachedImport = lazy('util', { cache: false });
      
      const firstResult = await nonCachedImport();
      const secondResult = await nonCachedImport();
      
      // Both should be defined and have expected functions
      expect(firstResult).toBeDefined();
      expect(secondResult).toBeDefined();
      expect(typeof firstResult.inspect).toBe('function');
      expect(typeof secondResult.inspect).toBe('function');
    });
  });

  describe('lazy.sync method', () => {
    it('should work like regular lazy', async () => {
      const syncImport = lazy.sync('path');
      const result = await syncImport();
      
      expect(typeof result.join).toBe('function');
      expect(typeof result.resolve).toBe('function');
    });
  });

  describe('lazy.preload method', () => {
    it('should preload a module', async () => {
      // Preload the module
      const preloadedModule = await lazy.preload('os');
      
      expect(preloadedModule).toBeDefined();
      expect(typeof preloadedModule.platform).toBe('function');
      expect(typeof preloadedModule.cpus).toBe('function');
      
      // Create a new importer for the same module
      const importModule = lazy('os');
      const loadedModule = await importModule();
      
      // Should be the same instance due to caching
      expect(preloadedModule).toBe(loadedModule);
    });
  });

  describe('lazy.all method', () => {
    it('should import multiple modules', async () => {
      interface ModuleMap {
        pathMod: any;
        osMod: any;
      }
      
      const multiImport = lazy.all<ModuleMap>({
        pathMod: 'path',
        osMod: 'os'
      });
      
      const result = await multiImport();
      
      // Check that we get the correct module structure
      expect(result.pathMod).toBeDefined();
      expect(typeof result.pathMod.join).toBe('function');
      
      expect(result.osMod).toBeDefined();
      expect(typeof result.osMod.platform).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should throw an error for non-existent modules', async () => {
      const importNonExistent = lazy('this-module-definitely-does-not-exist-12345');
      
      await expect(importNonExistent()).rejects.toThrow();
    });
  });

  describe('TypeScript support', () => {
    it('should work with typed imports', async () => {
      // Define an interface for better type checking
      interface PathModule {
        join: (...paths: string[]) => string;
        resolve: (...paths: string[]) => string;
        basename: (path: string, ext?: string) => string;
      }
      
      const importPath = lazy<PathModule>('path');
      const pathModule = await importPath();
      
      // These should work with proper typing
      const joined = pathModule.join('/', 'test', 'path');
      expect(typeof joined).toBe('string');
      // On Windows, path.join will use backslashes, so let's normalize
      const normalizedJoined = joined.replace(/\\/g, '/');
      expect(normalizedJoined).toBe('/test/path');
      
      const resolved = pathModule.resolve('./test');
      expect(typeof resolved).toBe('string');
      
      const basename = pathModule.basename('/path/to/file.txt');
      expect(basename).toBe('file.txt');
    });
  });

  describe('advanced features', () => {
    it('should handle multiple imports of the same module with different cache settings', async () => {
      // First with cache enabled
      const cachedImport = lazy('crypto', { cache: true });
      const cachedResult = await cachedImport();
      
      // Second with cache disabled
      const nonCachedImport = lazy('crypto', { cache: false });
      const nonCachedResult = await nonCachedImport();
      
      // Both should be defined and functional
      expect(cachedResult).toBeDefined();
      expect(nonCachedResult).toBeDefined();
      expect(typeof cachedResult.createHash).toBe('function');
      expect(typeof nonCachedResult.createHash).toBe('function');
    });

    it('should work with lazy.all and different module types', async () => {
      interface AllModules {
        path: any;
        fs: any;
        os: any;
        util: any;
      }

      const modules = lazy.all<AllModules>({
        path: 'path',
        fs: 'fs',
        os: 'os',
        util: 'util'
      });

      const result = await modules();

      expect(Object.keys(result)).toEqual(['path', 'fs', 'os', 'util']);
      expect(typeof result.path.join).toBe('function');
      expect(typeof result.fs.readFileSync).toBe('function');
      expect(typeof result.os.platform).toBe('function');
      expect(typeof result.util.inspect).toBe('function');
    });
  });
});
