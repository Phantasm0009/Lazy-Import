/**
 * Webpack Configuration Example with Static Bundle Helper
 */

const { WebpackLazyImportPlugin } = require('@phantasm0009/lazy-import/bundler');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  
  output: {
    path: __dirname + '/dist',
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      },
      
      // Alternative: Use the loader approach
      // {
      //   test: /\.tsx?$/,
      //   use: [
      //     {
      //       loader: '@phantasm0009/lazy-import/bundler/webpack-loader',
      //       options: {
      //         debug: true,
      //         chunkComment: true
      //       }
      //     },
      //     'ts-loader'
      //   ],
      //   exclude: /node_modules/
      // }
    ]
  },
  
  plugins: [
    // Add the lazy-import plugin
    new WebpackLazyImportPlugin({
      debug: true,
      chunkComment: true,
      preserveOptions: true,
      productionOnly: false
    }),
    
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  
  devServer: {
    port: 3000,
    hot: true
  }
};
