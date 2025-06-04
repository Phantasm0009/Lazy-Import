/**
 * CLI Entry Point for @phantasm0009/lazy-import
 */

import { LazyImportAnalyzer, AnalyzerCliOptions } from './analyzer';

interface AnalyzerOptions extends AnalyzerCliOptions {}

function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'analyze':
    case 'analyse':
      runAnalyzer();
      return;
    case 'help':
    case '--help':
    case '-h':
      showHelp();
      return;
    case 'version':
    case '--version':
    case '-v':
      showVersion();
      return;
    default:
      if (!command) {
        showHelp();
        return;
      } else {
        console.error(`Unknown command: ${command}`);
        console.error('Run "lazy-import help" for usage information.');
        process.exit(1);
      }
  }
}

function runAnalyzer() {
  const args = process.argv.slice(3);
  const options: AnalyzerOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--dir':
      case '-d':
        options.dir = args[++i];
        break;
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      case '--extensions':
      case '-e':
        options.extensions = args[++i].split(',');
        break;
      case '--exclude':
        options.exclude = args[++i].split(',');
        break;
    }
  }
    const analyzer = new LazyImportAnalyzer(options);
  analyzer.analyze().then(results => {
    analyzer.printReport(results);
  }).catch((error: unknown) => {
    console.error('Analysis failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}

function showHelp() {
  console.log(`
🚀 @phantasm0009/lazy-import CLI

Usage:
  lazy-import <command> [options]

Commands:
  analyze                 Analyze your codebase for lazy imports and show optimization opportunities
  help                    Show this help message
  version                 Show version information

Options for analyze:
  -d, --dir <path>        Directory to analyze (default: current directory)
  -e, --extensions <list> File extensions to scan (default: .js,.jsx,.ts,.tsx,.mjs)
  --exclude <list>        Directories to exclude (default: node_modules,dist,build,.git)
  -v, --verbose          Show detailed chunk mapping

Examples:
  lazy-import analyze
  lazy-import analyze --dir src --verbose
  lazy-import analyze --extensions .js,.ts --exclude node_modules,test

Static Bundle Helper:
  Add the appropriate plugin to your bundler configuration to enable
  automatic transformation of lazy() calls to native import() statements.

  See: https://github.com/phantasm0009/lazy-import#static-bundle-helper

Documentation: https://github.com/phantasm0009/lazy-import
`);
}

function showVersion() {
  try {
    const path = require('path');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = require(packageJsonPath);
    console.log(`@phantasm0009/lazy-import v${packageJson.version}`);
  } catch (error) {
    console.log(`@phantasm0009/lazy-import v1.0.0`);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
