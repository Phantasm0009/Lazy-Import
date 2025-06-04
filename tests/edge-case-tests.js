#!/usr/bin/env node

/**
 * Edge case testing for Static Bundle Helper
 * Tests complex scenarios and error handling
 */

const fs = require('fs');
const path = require('path');
const { LazyImportTransformer } = require('../dist/bundler');

function log(message) {
  console.log(`[Edge Case Test] ${message}`);
}

const testCases = [  {
    name: 'Nested lazy calls',
    input: `
function createNestedLoader(moduleName) {
  return lazy(lazy(moduleName).toString());
}
`,
    expectedTransforms: 0 // Should not transform dynamic nested calls
  },
  
  {
    name: 'Conditional lazy imports',
    input: `
const moduleLoader = process.env.NODE_ENV === 'production' 
  ? lazy('prod-module')
  : lazy('dev-module');
`,
    expectedTransforms: 2 // Both should transform
  },
  
  {
    name: 'Template literal modules',
    input: `
const version = '1.0';
const loader = lazy(\`module-v\${version}\`);
`,
    expectedTransforms: 0 // Should not transform template literals
  },
  
  {
    name: 'Complex options object',
    input: `
const complexLoader = lazy('complex-module', {
  retries: Math.max(3, process.env.RETRIES || 1),
  timeout: 5000,
  onError: (error) => console.log('Failed:', error),
  cache: true,
  preload: false
});
`,
    expectedTransforms: 1 // Should transform and preserve complex options
  },
  
  {
    name: 'Function expression in lazy call',
    input: `
const dynamicLoader = (function() {
  return lazy('dynamic-function-module');
})();
`,
    expectedTransforms: 1 // Should transform
  },
  
  {
    name: 'Arrow function with lazy',
    input: `
const arrowLoader = () => lazy('arrow-module');
const result = arrowLoader();
`,
    expectedTransforms: 1 // Should transform
  },
  
  {
    name: 'Mixed static and dynamic imports',
    input: `
import staticModule from 'static-module';
const lazyLoader = lazy('lazy-module');
const dynamicLoader = lazy(getDynamicModuleName());
`,
    expectedTransforms: 1 // Only static lazy call should transform
  },
  
  {
    name: 'Async/await patterns',
    input: `
async function loadModules() {
  const [mod1, mod2] = await Promise.all([
    lazy('module1')(),
    lazy('module2')()
  ]);
  return { mod1, mod2 };
}
`,
    expectedTransforms: 2 // Both should transform to direct imports
  },
  
  {
    name: 'Object method lazy calls',
    input: `
const moduleManager = {
  loadUtils: lazy('utils'),
  loadHelpers: lazy('helpers'),
  loadDynamic(name) {
    return lazy(name);
  }
};
`,
    expectedTransforms: 2 // Only static calls should transform
  },
  
  {
    name: 'Destructuring with lazy',
    input: `
const { load1, load2 } = {
  load1: lazy('module1'),
  load2: lazy('module2')
};
`,
    expectedTransforms: 2 // Both should transform
  },
  
  {
    name: 'Class method lazy calls',
    input: `
class ModuleLoader {
  constructor() {
    this.staticLoader = lazy('static-module');
  }
  
  loadDynamic(moduleName) {
    return lazy(moduleName);
  }
  
  static loadStatic() {
    return lazy('class-static-module');
  }
}
`,
    expectedTransforms: 2 // Static calls should transform
  },
  
  {
    name: 'Immediately invoked lazy calls',
    input: `
const result1 = await lazy('immediate1')();
const result2 = lazy('immediate2')();
const result3 = (await lazy('immediate3')()).default;
`,
    expectedTransforms: 3 // All should transform to direct imports
  },
  
  {
    name: 'Try-catch with lazy',
    input: `
try {
  const module = await lazy('risky-module')();
  return module.process();
} catch (error) {
  const fallback = await lazy('fallback-module')();
  return fallback.process();
}
`,
    expectedTransforms: 2 // Both should transform
  },
  
  {
    name: 'Ternary operator with lazy',
    input: `
const loader = isAdvanced 
  ? lazy('advanced-module') 
  : lazy('basic-module');
`,
    expectedTransforms: 2 // Both should transform
  },
  
  {
    name: 'Lazy in array',
    input: `
const loaders = [
  lazy('module1'),
  lazy('module2'),
  lazy(dynamicName)
];
`,
    expectedTransforms: 2 // Only static calls should transform
  }
];

function runEdgeCaseTests() {
  log('Starting edge case tests...');
  
  const transformer = new LazyImportTransformer({
    chunkComment: true,
    preserveOptions: true,
    debug: true
  });
  
  const results = [];
  let passedTests = 0;
  
  for (const testCase of testCases) {
    try {
      const result = transformer.transform(testCase.input, `test-${testCase.name}.js`);
      
      const passed = result.transformCount === testCase.expectedTransforms;
      if (passed) passedTests++;
      
      results.push({
        name: testCase.name,
        passed,
        expected: testCase.expectedTransforms,
        actual: result.transformCount,
        output: result.code,
        helpers: result.helpers
      });
      
      const status = passed ? '✅' : '❌';
      log(`${status} ${testCase.name}: ${result.transformCount}/${testCase.expectedTransforms} transforms`);
      
    } catch (error) {
      results.push({
        name: testCase.name,
        passed: false,
        error: error.message
      });
      
      log(`❌ ${testCase.name}: Error - ${error.message}`);
    }
  }
  
  // Save detailed results
  const resultsDir = path.join(__dirname, 'edge-cases', 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const resultFile = path.join(resultsDir, 'edge-case-results.json');
  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
  
  // Print summary
  console.log('\n📊 Edge Case Test Summary:');
  console.log('=' .repeat(50));
  console.log(`✅ Passed: ${passedTests}/${testCases.length}`);
  console.log(`❌ Failed: ${testCases.length - passedTests}/${testCases.length}`);
  console.log(`📄 Results saved to: ${resultFile}`);
  
  if (passedTests === testCases.length) {
    console.log('\n🎉 All edge case tests passed!');
  } else {
    console.log('\n⚠️  Some edge case tests failed. Check the results for details.');
  }
  
  return results;
}

if (require.main === module) {
  runEdgeCaseTests();
}

module.exports = { runEdgeCaseTests, testCases };
