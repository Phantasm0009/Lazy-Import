/**
 * Babel Plugin for @phantasm0009/lazy-import Static Bundle Helper
 * Transforms lazy() calls into native import() statements
 */

import * as parser from '@babel/parser';
import { BundlerTransformOptions } from './index';

export interface BabelPluginOptions extends BundlerTransformOptions {
  importSpecifiers?: string[];
  moduleNames?: string[];
}

export default function lazyImportBabelPlugin(babel: any): any {
  const { types: t } = babel;
  
  return {
    name: 'lazy-import-static-bundle-helper',
    visitor: {
      Program: {
        enter(path: any, state: any) {
          const options: BabelPluginOptions = {
            chunkComment: true,
            preserveOptions: true,
            stringLiteralsOnly: true,
            chunkNameTemplate: '[name]',
            debug: false,
            importSpecifiers: ['lazy', 'default'],
            moduleNames: ['@phantasm0009/lazy-import', 'lazy-import'],
            ...state.opts
          };
          
          state.lazyImportOptions = options;
          state.lazyImportIdentifiers = new Set();
          state.transformCount = 0;
          state.skippedCount = 0;
          state.helperInjected = false;
        },
        exit(path: any, state: any) {
          if (state.lazyImportOptions.debug) {
            console.log(`[Babel SBH] Transformed ${state.transformCount} calls, skipped ${state.skippedCount}`);
          }
        }
      },
      
      ImportDeclaration(path: any, state: any) {
        const options = state.lazyImportOptions;
        const source = path.node.source.value;
        const moduleNames = options.moduleNames || [];
        const importSpecifiers = options.importSpecifiers || [];
        
        if (moduleNames.includes(source)) {
          path.node.specifiers.forEach((spec: any) => {
            if (t.isImportDefaultSpecifier(spec) && importSpecifiers.includes('default')) {
              state.lazyImportIdentifiers.add(spec.local.name);
            } else if (t.isImportSpecifier(spec) && spec.imported && importSpecifiers.includes(spec.imported.name)) {
              state.lazyImportIdentifiers.add(spec.local.name);
            }
          });
        }
      },
        CallExpression(path: any, state: any) {
        const options = state.lazyImportOptions;
        const { callee, arguments: args } = path.node;
        
        // Check if this is a lazy() call
        if (!t.isIdentifier(callee) || !state.lazyImportIdentifiers.has(callee.name)) {
          return;
        }
        
        if (args.length === 0 || args.length > 2) {
          state.skippedCount++;
          return;
        }
        
        const modulePathArg = args[0];
        
        // Only transform string literals if stringLiteralsOnly is true
        if (options.stringLiteralsOnly && !t.isStringLiteral(modulePathArg)) {
          if (options.debug) {
            console.log(`[Babel SBH] Skipping non-string-literal: ${path.toString()}`);
          }
          state.skippedCount++;
          return;
        }
        
        if (!t.isStringLiteral(modulePathArg)) {
          state.skippedCount++;
          return;
        }
        
        const modulePath = modulePathArg.value;
        const optionsArg = args[1];
        const chunkName = generateChunkName(modulePath, options.chunkNameTemplate);
        
        state.transformCount++;
        
        // Check if this is a direct invocation: await lazy('module')()
        const isDirectInvocation = isDirectlyInvoked(path);
        
        if (isDirectInvocation && !optionsArg) {
          // Optimize direct invocation without options to simple import()
          const importCall = createImportCall(t, modulePath, chunkName, options.chunkComment);
          path.parentPath.replaceWith(importCall);
          return;
        }
        
        if (optionsArg && options.preserveOptions) {
          // Generate helper call that preserves options
          const helperCall = createHelperCall(t, modulePath, chunkName, optionsArg, options.chunkComment, state);
          path.replaceWith(helperCall);
        } else {
          // Simple replacement with direct import()
          const importCall = createImportCall(t, modulePath, chunkName, options.chunkComment);
          const arrowFunction = t.arrowFunctionExpression([], importCall);
          path.replaceWith(arrowFunction);
        }
      }
    }
  };
}

function createImportCall(t: any, modulePath: string, chunkName: string, includeComment: boolean) {
  const args = [t.stringLiteral(modulePath)];
  
  if (includeComment) {
    // Add webpack chunk comment
    t.addComment(args[0], 'leading', ` webpackChunkName: "${chunkName}" `, false);
  }
  
  return t.callExpression(t.import(), args);
}

function generateChunkName(modulePath: string, template: string): string {
  const name = modulePath
    .replace(/^[.\/]+/, '') // Remove leading ./ or ../
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/[\/\\]/g, '-') // Replace path separators
    .replace(/[^a-zA-Z0-9-_]/g, ''); // Remove special chars
  
  return template.replace('[name]', name);
}

function isDirectlyInvoked(path: any): boolean {
  // Check if the lazy() call is immediately followed by () - e.g., lazy('module')()
  return path.parentPath && 
         path.parentPath.isCallExpression() && 
         path.parentPath.node.callee === path.node;
}

function createHelperCall(t: any, modulePath: string, chunkName: string, optionsArg: any, includeComment: boolean, state: any): any {
  // Inject helper if not already done
  if (!state.helperInjected) {
    injectHelper(t, state);
    state.helperInjected = true;
  }
  
  const importCall = createImportCall(t, modulePath, chunkName, includeComment);
  const importFunction = t.arrowFunctionExpression([], importCall);
  
  return t.callExpression(
    t.identifier('__lazyImportHelper'),
    [importFunction, optionsArg]
  );
}

function injectHelper(t: any, state: any): void {
  const program = state.file.path;
  
  // Use template for simpler helper injection
  const helperCode = `
function __lazyImportHelper(importFn, options = {}) {
  const { cache = true, retries = 0, retryDelay = 1000, onError } = options;
  let cachedPromise = null;
  
  const importWithRetry = async (attempt = 0) => {
    try {
      if (cache && cachedPromise) {
        return await cachedPromise;
      }
      
      const modulePromise = importFn();
      
      if (cache) {
        cachedPromise = modulePromise;
      }
      
      return await modulePromise;
    } catch (error) {
      const currentAttempt = attempt + 1;
      
      if (onError) {
        onError(error, currentAttempt);
      }
      
      if (currentAttempt <= retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return importWithRetry(currentAttempt);
      }
      
      throw error;
    }
  };
  
  const lazyFunction = () => importWithRetry();
  lazyFunction.preload = () => importWithRetry();
  lazyFunction.clearCache = () => { cachedPromise = null; };
  lazyFunction.isCached = () => cachedPromise !== null;
  
  return lazyFunction;
}`;  // Parse the helper code and inject it
  try {
    const helperAST = state.file.opts.parserOpts ? 
      parser.parse(helperCode, state.file.opts.parserOpts) :
      parser.parse(helperCode);
    
    // Add helper to the top of the file
    if ((helperAST as any).body && (helperAST as any).body[0]) {
      program.unshiftContainer('body', (helperAST as any).body[0]);
    }
  } catch (error) {
    console.warn('[Babel SBH] Failed to inject helper:', error);
    // Fallback: continue without helper injection
  }
}
