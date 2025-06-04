/**
 * Babel Plugin for @phantasm0009/lazy-import Static Bundle Helper
 * Transforms lazy() calls into native import() statements
 */

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
        
        if (!t.isStringLiteral(modulePathArg)) {
          state.skippedCount++;
          return;
        }
        
        const modulePath = modulePathArg.value;
        const chunkNameTemplate = options.chunkNameTemplate || '[name]';
        const chunkComment = options.chunkComment || false;
        const chunkName = generateChunkName(modulePath, chunkNameTemplate);
        
        state.transformCount++;
        
        // Simple replacement with direct import()
        const importCall = createImportCall(t, modulePath, chunkName, chunkComment);
        const arrowFunction = t.arrowFunctionExpression([], importCall);
        
        path.replaceWith(arrowFunction);
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
