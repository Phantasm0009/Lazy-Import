import path from 'path';
import { WebpackLazyImportPlugin } from '@phantasm0009/lazy-import/bundler';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'development',
  entry: './src/sample.js',
  output: {
    path: path.resolve(__dirname, 'dist/webpack'),
    filename: 'bundle.js',
    library: 'TestLib',
    libraryTarget: 'umd'
  },
  plugins: [
    new WebpackLazyImportPlugin({
      chunkComment: true,
      preserveOptions: true,
      debug: true
    })
  ],
  externals: {
    '@phantasm0009/lazy-import': {
      commonjs: '@phantasm0009/lazy-import',
      commonjs2: '@phantasm0009/lazy-import',
      amd: '@phantasm0009/lazy-import',
      root: 'LazyImport'
    }
  }
};
