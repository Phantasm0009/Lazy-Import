/**
 * Static Bundle Helper (SBH) Transformation Demo
 * 
 * This file demonstrates how the Static Bundle Helper transforms
 * lazy() calls into native import() statements at build time.
 * 
 * Run with: node dist/cli.js analyze examples/sbh-transformation-demo.js --verbose
 */

// Original lazy() calls - these will be transformed by SBH
const LazyComponent = lazy('./components/LazyComponent');
const LazyUtility = lazy('./utils/LazyUtility', { 
  chunkName: 'utility-chunk',
  retries: 3 
});

// Multiple imports with different configurations
const Chart = lazy('./components/Chart', { chunkName: 'charts' });
const DataTable = lazy('./components/DataTable', { chunkName: 'data-tables' });
const Modal = lazy('./components/Modal');

// These will be skipped by SBH (dynamic module paths)
const dynamicModule = (name) => lazy(`./modules/${name}`);
const templatedPath = (type) => lazy(`./components/${type}/index.js`);

// Mixed scenarios
const AuthModule = lazy('./auth/AuthModule', { 
  chunkName: 'auth',
  timeout: 5000 
});

const ReportsModule = lazy('./reports/ReportsModule');
const AdminPanel = lazy('./admin/AdminPanel', { 
  chunkName: 'admin-panel',
  retries: 2,
  timeout: 10000 
});

// Export for use
export {
  LazyComponent,
  LazyUtility,
  Chart,
  DataTable,
  Modal,
  AuthModule,
  ReportsModule,
  AdminPanel,
  dynamicModule,
  templatedPath
};

/**
 * Expected SBH transformations:
 * 
 * Before:
 * const LazyComponent = lazy('./components/LazyComponent');
 * 
 * After:
 * const LazyComponent = () => import('./components/LazyComponent');
 * 
 * Before:
 * const LazyUtility = lazy('./utils/LazyUtility', { 
 *   chunkName: 'utility-chunk',
 *   retries: 3 
 * });
 * 
 * After:
 * const LazyUtility = () => import(
 *   /* webpackChunkName: "utility-chunk" */ 
 *   './utils/LazyUtility'
 * ).then(m => __lazyImportHelper(m, { retries: 3 }));
 */
