/**
 * Static Bundle Helper Usage Examples
 * Demonstrates before/after transformations and real-world scenarios
 */

// ============================================================================
// BEFORE: Runtime lazy loading (traditional approach)
// ============================================================================

import lazy from '@phantasm0009/lazy-import';

// These create runtime dynamic imports
const loadChart = lazy('echarts');
const loadLodash = lazy('lodash');
const loadDateFns = lazy('date-fns');

async function traditionalApproach() {
  // Runtime dynamic import - bundler doesn't know about these
  const chart = await loadChart();
  const _ = await loadLodash();
  const dateFns = await loadDateFns();
  
  console.log('Modules loaded at runtime');
}

// ============================================================================
// AFTER: Static Bundle Helper transformation
// ============================================================================

// When Static Bundle Helper is enabled, the above code transforms to:

/*
// Transform result (what bundler sees):
const loadChart = () => import(/* webpackChunkName: "echarts" */ 'echarts');
const loadLodash = () => import(/* webpackChunkName: "lodash" */ 'lodash');  
const loadDateFns = () => import(/* webpackChunkName: "date-fns" */ 'date-fns');

async function modernApproach() {
  // Native import() - bundler creates separate chunks automatically
  const chart = await loadChart();
  const _ = await loadLodash();
  const dateFns = await loadDateFns();
  
  console.log('Modules loaded with proper code splitting');
}
*/

// ============================================================================
// COMPLEX EXAMPLE: With Options Preservation
// ============================================================================

// Before transformation
const loadHeavyModule = lazy('heavy-computation-library', {
  retries: 3,
  retryDelay: 2000,
  onError: (error, attempt) => console.log(`Retry ${attempt}:`, error)
});

// After transformation (what bundler sees):
/*
const loadHeavyModule = __lazyImportHelper(
  () => import(/* webpackChunkName: "heavy-computation-library" */ 'heavy-computation-library'),
  {
    retries: 3,
    retryDelay: 2000,
    onError: (error, attempt) => console.log(`Retry ${attempt}:`, error)
  }
);
*/

// ============================================================================
// REACT COMPONENT EXAMPLE
// ============================================================================

import React, { useState, useEffect } from 'react';

function ChartComponent({ data }) {
  const [ChartLib, setChartLib] = useState(null);
  
  useEffect(() => {
    // Before SBH: Runtime loading
    // const loadChart = lazy('chart.js');
    
    // After SBH: Bundler-aware loading
    // const loadChart = () => import(/* webpackChunkName: "chart-js" */ 'chart.js');
    
    loadChart().then(setChartLib);
  }, []);
  
  if (!ChartLib) {
    return <div>Loading chart...</div>;
  }
  
  return <canvas ref={canvasRef} />;
}

// ============================================================================
// ADVANCED: Conditional Loading with Analysis
// ============================================================================

class FeatureLoader {
  static async loadAnalytics() {
    // Before: Runtime decision
    // const loadAnalytics = lazy('./analytics');
    
    // After: Bundler creates analytics.chunk.js
    // const loadAnalytics = () => import(/* webpackChunkName: "analytics" */ './analytics');
    
    if (window.location.search.includes('debug')) {
      return await loadAnalytics();
    }
    return null;
  }
  
  static async loadAdminTools() {
    // Before: Runtime dynamic
    // const loadAdmin = lazy('./admin-tools', { cache: false });
    
    // After: Helper preserves cache option
    /*
    const loadAdmin = __lazyImportHelper(
      () => import(/* webpackChunkName: "admin-tools" */ './admin-tools'),
      { cache: false }
    );
    */
    
    const user = await getCurrentUser();
    if (user.role === 'admin') {
      return await loadAdmin();
    }
    return null;
  }
}

// ============================================================================
// BUNDLE ANALYSIS COMPARISON
// ============================================================================

/*
BEFORE Static Bundle Helper:
├── main.bundle.js (2.3MB) - includes lazy-import runtime
├── vendor.bundle.js (800KB)
└── (No dynamic chunks - everything loads upfront)

AFTER Static Bundle Helper:
├── main.bundle.js (150KB) - minimal lazy-import helper
├── vendor.bundle.js (800KB)
├── echarts.chunk.js (680KB) - loaded on demand
├── lodash.chunk.js (320KB) - loaded on demand
├── date-fns.chunk.js (120KB) - loaded on demand
├── analytics.chunk.js (95KB) - loaded conditionally
└── admin-tools.chunk.js (240KB) - loaded for admins only

Benefits:
- 93% smaller initial bundle (150KB vs 2.3MB)
- Faster page load (0.3s vs 2.1s)
- Better caching (unchanged chunks stay cached)
- Prefetch hints for better UX
*/

// ============================================================================
// EDGE CASES HANDLED BY SBH
// ============================================================================

// 1. Dynamic paths (not transformed - fallback to runtime)
function loadUserModule(userId) {
  const dynamicLoader = lazy(`./users/${userId}`); // Stays as runtime loading
  return dynamicLoader();
}

// 2. Template literals with variables (not transformed)
function loadLocaleModule(locale) {
  const localeLoader = lazy(`./locales/${locale}.json`); // Stays as runtime loading
  return localeLoader();
}

// 3. Options only (transformed with helper)
const retryLoader = lazy('flaky-service', { retries: 5 }); // Uses __lazyImportHelper

// 4. Direct invocation (optimized away)
async function quickLoad() {
  // Before: lazy('module')()
  // After: direct import('module') - no wrapper function needed
  const module = await lazy('quick-module')();
  return module.doSomething();
}

export {
  traditionalApproach,
  ChartComponent,
  FeatureLoader
};
