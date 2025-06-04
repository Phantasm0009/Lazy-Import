// Sample test file for SBH integration testing
import lazy from '@phantasm0009/lazy-import';

// Basic lazy imports that should be transformed
const loadLodash = lazy('lodash');
const loadMoment = lazy('moment');

// Lazy imports with options (should preserve options)
const loadChartWithOptions = lazy('chart.js', {
  retries: 3,
  retryDelay: 1000,
  timeout: 5000
});

// Dynamic imports that should NOT be transformed
function dynamicImport(moduleName) {
  return lazy(moduleName);
}

// Direct invocation pattern
async function loadAndUse() {
  const lodash = await lazy('lodash')();
  const moment = await lazy('moment')();
  
  return {
    lodash: lodash.defaults,
    moment: moment.format
  };
}

// Multiple modules
async function loadMultiple() {
  const modules = await lazy.all({
    lodash: 'lodash',
    moment: 'moment',
    chart: 'chart.js'
  });
  
  return modules;
}

export { loadLodash, loadMoment, loadChartWithOptions, loadAndUse, loadMultiple };
