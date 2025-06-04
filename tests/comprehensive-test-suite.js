#!/usr/bin/env node

/**
 * Comprehensive test suite for Static Bundle Helper
 * Runs integration tests, performance benchmarks, and edge case tests
 */

const fs = require('fs');
const path = require('path');
const { runIntegrationTests } = require('./integration-test');
const { runPerformanceBenchmark } = require('./performance-benchmark');
const { runEdgeCaseTests } = require('./edge-case-tests');

function log(message) {
  console.log(`[Test Suite] ${message}`);
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

async function runComprehensiveTests() {
  console.log('🚀 Static Bundle Helper - Comprehensive Test Suite');
  console.log('=' .repeat(60));
  
  const startTime = Date.now();
  const results = {};
  
  try {
    // 1. Edge Case Tests (fastest, run first)
    log('Running edge case tests...');
    const edgeStart = Date.now();
    results.edgeCases = runEdgeCaseTests();
    const edgeTime = Date.now() - edgeStart;
    
    const edgePassed = results.edgeCases.filter(r => r.passed).length;
    const edgeTotal = results.edgeCases.length;
    log(`✅ Edge cases completed: ${edgePassed}/${edgeTotal} passed (${formatDuration(edgeTime)})`);
    
    // 2. Integration Tests
    log('Running integration tests...');
    const integrationStart = Date.now();
    results.integration = await runIntegrationTests();
    const integrationTime = Date.now() - integrationStart;
    
    const integrationPassed = Object.values(results.integration).filter(r => !r.error).length;
    const integrationTotal = Object.keys(results.integration).length;
    log(`✅ Integration tests completed: ${integrationPassed}/${integrationTotal} bundlers passed (${formatDuration(integrationTime)})`);
    
    // 3. Performance Benchmark
    log('Running performance benchmark...');
    const perfStart = Date.now();
    results.performance = await runPerformanceBenchmark();
    const perfTime = Date.now() - perfStart;
    log(`✅ Performance benchmark completed (${formatDuration(perfTime)})`);
    
    const totalTime = Date.now() - startTime;
    
    // Generate comprehensive report
    const report = generateComprehensiveReport(results, {
      edgeTime,
      integrationTime,
      perfTime,
      totalTime
    });
    
    // Save comprehensive results
    const resultsDir = path.join(__dirname, 'results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = path.join(resultsDir, `comprehensive-report-${timestamp}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    const summaryFile = path.join(resultsDir, 'latest-summary.md');
    fs.writeFileSync(summaryFile, generateMarkdownSummary(report));
    
    // Print final summary
    printFinalSummary(report);
    
    log(`📄 Full report saved to: ${reportFile}`);
    log(`📄 Summary saved to: ${summaryFile}`);
    
    return report;
    
  } catch (error) {
    log(`❌ Test suite failed: ${error.message}`);
    throw error;
  }
}

function generateComprehensiveReport(results, timings) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      duration: timings.totalTime
    },
    timings,
    edgeCases: {
      total: results.edgeCases.length,
      passed: results.edgeCases.filter(r => r.passed).length,
      failed: results.edgeCases.filter(r => !r.passed).length,
      results: results.edgeCases
    },
    integration: {
      bundlers: Object.keys(results.integration),
      passed: Object.values(results.integration).filter(r => !r.error).length,
      failed: Object.values(results.integration).filter(r => r.error).length,
      results: results.integration
    },
    performance: results.performance
  };
  
  // Calculate totals
  report.summary.totalTests = report.edgeCases.total + report.integration.bundlers.length;
  report.summary.passedTests = report.edgeCases.passed + report.integration.passed;
  report.summary.failedTests = report.edgeCases.failed + report.integration.failed;
  
  return report;
}

function generateMarkdownSummary(report) {
  const date = new Date(report.timestamp).toLocaleString();
  
  return `# Static Bundle Helper - Test Summary

**Generated:** ${date}  
**Duration:** ${formatDuration(report.summary.duration)}

## 📊 Overall Results

- **Total Tests:** ${report.summary.totalTests}
- **Passed:** ${report.summary.passedTests} ✅
- **Failed:** ${report.summary.failedTests} ❌
- **Success Rate:** ${((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1)}%

## 🧪 Edge Case Tests

| Test | Status | Expected | Actual |
|------|--------|----------|--------|
${report.edgeCases.results.map(r => 
  `| ${r.name} | ${r.passed ? '✅' : '❌'} | ${r.expected || 'N/A'} | ${r.actual || 'Error'} |`
).join('\n')}

**Summary:** ${report.edgeCases.passed}/${report.edgeCases.total} passed

## 🔧 Integration Tests

| Bundler | Status | Transformations | Options | Chunks |
|---------|--------|----------------|---------|---------|
${Object.entries(report.integration.results).map(([bundler, result]) => {
  if (result.error) {
    return `| ${bundler.toUpperCase()} | ❌ | Error | Error | Error |`;
  }
  return `| ${bundler.toUpperCase()} | ✅ | ${result.transformCount}/${result.originalLazyCalls} | ${result.preservedOptions} | ${result.chunkComments} |`;
}).join('\n')}

**Summary:** ${report.integration.passed}/${report.integration.bundlers.length} bundlers passed

## ⚡ Performance Benchmark

- **Build Time Impact:** ${report.performance.comparison.buildTimeChange.toFixed(2)}%
- **Bundle Size Change:** ${report.performance.comparison.bundleSizeChange.toFixed(2)}%
- **Additional Chunks:** ${report.performance.comparison.chunksCreated}

### Detailed Metrics

| Metric | Without SBH | With SBH | Change |
|--------|-------------|----------|---------|
| Build Time | ${formatDuration(report.performance.withoutSBH.buildTime)} | ${formatDuration(report.performance.withSBH.buildTime)} | ${report.performance.comparison.buildTimeChange.toFixed(2)}% |
| Bundle Size | ${Math.round(report.performance.withoutSBH.bundleSize / 1024)}KB | ${Math.round(report.performance.withSBH.bundleSize / 1024)}KB | ${report.performance.comparison.bundleSizeChange.toFixed(2)}% |
| Chunks | ${report.performance.withoutSBH.chunks} | ${report.performance.withSBH.chunks} | +${report.performance.comparison.chunksCreated} |

## 🎯 Conclusion

${report.summary.passedTests === report.summary.totalTests ? 
  '🎉 **All tests passed!** The Static Bundle Helper is working correctly across all scenarios.' :
  `⚠️ **${report.summary.failedTests} test(s) failed.** Review the detailed results above.`}
`;
}

function printFinalSummary(report) {
  console.log('\n🎯 Final Test Summary:');
  console.log('=' .repeat(60));
  
  console.log(`📊 Overall Results:`);
  console.log(`   • Total tests: ${report.summary.totalTests}`);
  console.log(`   • Passed: ${report.summary.passedTests} ✅`);
  console.log(`   • Failed: ${report.summary.failedTests} ❌`);
  console.log(`   • Success rate: ${((report.summary.passedTests / report.summary.totalTests) * 100).toFixed(1)}%`);
  console.log(`   • Duration: ${formatDuration(report.summary.duration)}`);
  
  console.log(`\n🧪 Edge Cases: ${report.edgeCases.passed}/${report.edgeCases.total} passed`);
  console.log(`🔧 Integration: ${report.integration.passed}/${report.integration.bundlers.length} bundlers passed`);
  console.log(`⚡ Performance: ${report.performance.comparison.buildTimeChange.toFixed(2)}% build time change`);
  
  if (report.summary.passedTests === report.summary.totalTests) {
    console.log('\n🎉 All tests passed! Static Bundle Helper is fully functional.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the detailed results for more information.');
  }
}

if (require.main === module) {
  runComprehensiveTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runComprehensiveTests };
