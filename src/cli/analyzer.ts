/**
 * CLI Analyzer for @phantasm0009/lazy-import
 * Analyzes code for lazy-import usage and provides optimization insights
 */

import fs from 'fs/promises';
import path from 'path';
import { LazyImportTransformer } from '../bundler/index';

interface AnalysisResult {
  file: string;
  totalLazyCalls: number;
  transformableCalls: number;
  skippedCalls: number;
  reasons: string[];
  potentialSavings: number; // estimated bundle size savings in bytes
  chunkInfo: {
    module: string;
    line: number;
    chunkName: string;
    hasOptions: boolean;
  }[];
}

interface AnalysisOptions {
  input: string;
  output?: string;
  recursive?: boolean;
  extensions?: string[];
  exclude?: string[];
  verbose?: boolean;
}

interface AnalyzerCliOptions {
  dir?: string;
  verbose?: boolean;
  extensions?: string[];
  exclude?: string[];
}

class LazyImportAnalyzer {
  private transformer: LazyImportTransformer;
  private options: AnalyzerCliOptions;
  
  constructor(options: AnalyzerCliOptions = {}) {
    this.options = options;
    this.transformer = new LazyImportTransformer({
      debug: !!options.verbose,
      stringLiteralsOnly: true
    });
  }
  
  async analyzeProject(options: AnalysisOptions): Promise<AnalysisResult[]> {
    const files = await this.findFiles(options.input, options);
    const results: AnalysisResult[] = [];
    
    for (const file of files) {
      try {
        const result = await this.analyzeFile(file);
        if (result.totalLazyCalls > 0) {
          results.push(result);
        }      } catch (error: unknown) {
        if (options.verbose) {
          console.warn(`Failed to analyze ${file}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    
    return results;
  }
    async analyze(inputPath?: string): Promise<AnalysisResult[]> {
    const analysisOptions: AnalysisOptions = {
      input: inputPath || this.options.dir || process.cwd(),
      recursive: true,
      verbose: this.options.verbose,
      extensions: this.options.extensions,
      exclude: this.options.exclude
    };
    
    return this.analyzeProject(analysisOptions);
  }
  
  printReport(results: AnalysisResult[]): void {
    const report = this.generateReport(results, { input: '', recursive: true });
    console.log(report);
  }
  
  private async analyzeFile(filePath: string): Promise<AnalysisResult> {
    const content = await fs.readFile(filePath, 'utf8');
    const lazyCalls = this.countLazyCalls(content);
    
    const transformResult = this.transformer.transform(content, filePath);
      const result: AnalysisResult = {
      file: filePath,
      totalLazyCalls: lazyCalls.total,
      transformableCalls: transformResult.transformCount,
      skippedCalls: transformResult.skippedCount,
      reasons: lazyCalls.skipReasons,
      potentialSavings: this.estimateSavings(transformResult.transformCount),
      chunkInfo: this.extractChunkInfo(content, filePath)
    };
    
    return result;
  }
  
  private countLazyCalls(content: string): { total: number; skipReasons: string[] } {
    const lazyCallRegex = /lazy\s*\(/g;
    const matches = content.match(lazyCallRegex) || [];
    const skipReasons: string[] = [];
    
    // Analyze reasons for non-transformable calls
    const dynamicCallRegex = /lazy\s*\(\s*[^'"`]/g;
    const dynamicMatches = content.match(dynamicCallRegex) || [];
    
    if (dynamicMatches.length > 0) {
      skipReasons.push(`${dynamicMatches.length} dynamic module path(s)`);
    }
    
    const templateLiteralRegex = /lazy\s*\(\s*`[^`]*\$\{[^}]*\}[^`]*`/g;
    const templateMatches = content.match(templateLiteralRegex) || [];
    
    if (templateMatches.length > 0) {
      skipReasons.push(`${templateMatches.length} template literal(s) with variables`);
    }
    
    return {
      total: matches.length,
      skipReasons
    };
  }
    private estimateSavings(transformCount: number): number {
    // Rough estimate: each transformed call saves ~2KB of lazy-import runtime
    // and enables better code splitting (estimated 10KB average per dynamic import)
    return transformCount * (2000 + 10000);
  }

  private extractChunkInfo(content: string, _filePath: string): AnalysisResult['chunkInfo'] {
    const chunkInfo: AnalysisResult['chunkInfo'] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lazyCallMatch = line.match(/lazy\s*\(\s*['"`]([^'"`]+)['"`](?:\s*,\s*({[^}]*}))?/);
      
      if (lazyCallMatch) {
        const modulePath = lazyCallMatch[1];
        const hasOptions = !!lazyCallMatch[2];
        
        // Extract potential chunk name from options or generate from module path
        let chunkName = path.basename(modulePath, path.extname(modulePath));
        if (hasOptions && lazyCallMatch[2]) {
          const chunkNameMatch = lazyCallMatch[2].match(/chunkName:\s*['"`]([^'"`]+)['"`]/);
          if (chunkNameMatch) {
            chunkName = chunkNameMatch[1];
          }
        }
        
        chunkInfo.push({
          module: modulePath,
          line: i + 1,
          chunkName,
          hasOptions
        });
      }
    }
    
    return chunkInfo;
  }
  
  private async findFiles(inputPath: string, options: AnalysisOptions): Promise<string[]> {
    const stats = await fs.stat(inputPath);
    const extensions = options.extensions || ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte'];
    const exclude = options.exclude || ['node_modules', '.git', 'dist', 'build'];
    
    if (stats.isFile()) {
      return [inputPath];
    }
    
    const files: string[] = [];
    
    const scanDirectory = async (dir: string) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          if (options.recursive !== false && !exclude.some(pattern => entry.name.includes(pattern))) {
            await scanDirectory(fullPath);
          }
        } else if (entry.isFile()) {
          if (extensions.some(ext => entry.name.endsWith(ext))) {
            files.push(fullPath);
          }
        }
      }
    };
    
    await scanDirectory(inputPath);
    return files;
  }
  
  generateReport(results: AnalysisResult[], options: AnalysisOptions): string {
    const totalFiles = results.length;
    const totalLazyCalls = results.reduce((sum, r) => sum + r.totalLazyCalls, 0);
    const totalTransformable = results.reduce((sum, r) => sum + r.transformableCalls, 0);
    const totalSkipped = results.reduce((sum, r) => sum + r.skippedCalls, 0);
    const totalSavings = results.reduce((sum, r) => sum + r.potentialSavings, 0);
    
    let report = `
📦 Lazy Import Analysis Report
=============================

📊 Summary:
  Files analyzed: ${totalFiles}
  Total lazy() calls: ${totalLazyCalls}
  Transformable calls: ${totalTransformable} (${((totalTransformable / totalLazyCalls) * 100).toFixed(1)}%)
  Skipped calls: ${totalSkipped}
  Estimated bundle savings: ${this.formatBytes(totalSavings)}

`;
    
    if (totalTransformable > 0) {
      report += `✅ Recommendation: Use Static Bundle Helper to enable better code splitting!\n\n`;
    }
    
    if (options.verbose) {
      report += `📁 File Details:\n`;
      report += `${'─'.repeat(80)}\n`;
      
      for (const result of results) {
        const relativePath = path.relative(process.cwd(), result.file);
        report += `📄 ${relativePath}\n`;
        report += `   Lazy calls: ${result.totalLazyCalls} | Transformable: ${result.transformableCalls} | Skipped: ${result.skippedCalls}\n`;
        
        if (result.reasons.length > 0) {
          report += `   Skip reasons: ${result.reasons.join(', ')}\n`;
        }
        
        if (result.potentialSavings > 0) {
          report += `   Potential savings: ${this.formatBytes(result.potentialSavings)}\n`;
        }
        
        report += `\n`;
      }
    }
    
    if (totalTransformable > 0) {
      report += this.generateSetupInstructions();
    }
    
    return report;
  }
  
  private generateSetupInstructions(): string {
    return `
🚀 Getting Started with Static Bundle Helper:

1️⃣ Rollup:
   import { rollupLazyImport } from '@phantasm0009/lazy-import/bundler';
   
   export default {
     plugins: [rollupLazyImport()]
   };

2️⃣ Vite:
   import { viteLazyImport } from '@phantasm0009/lazy-import/bundler';
   
   export default defineConfig({
     plugins: [viteLazyImport()]
   });

3️⃣ Webpack:
   const { WebpackLazyImportPlugin } = require('@phantasm0009/lazy-import/bundler');
   
   module.exports = {
     plugins: [new WebpackLazyImportPlugin()]
   };

4️⃣ Babel:
   {
     "plugins": [["@phantasm0009/lazy-import/babel"]]
   }

📚 Learn more: https://github.com/Phantasm0009/lazy-import#static-bundle-helper
`;
  }
  
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;  }
}

export { LazyImportAnalyzer, AnalyzerCliOptions };
