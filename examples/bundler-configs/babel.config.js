/**
 * Babel Configuration Example with Static Bundle Helper
 * Use this configuration with Jest, Webpack, or any Babel-based build process
 */

module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '14',
        browsers: ['> 1%', 'not dead']
      }
    }],
    '@babel/preset-typescript',
    '@babel/preset-react' // Add if using React
  ],
  
  plugins: [
    // Add the lazy-import Static Bundle Helper
    ['@phantasm0009/lazy-import/babel', {
      // Add webpack chunk comments for better chunk naming
      chunkComment: true,
      
      // Preserve options object for runtime (retries, onError, etc.)
      preserveOptions: true,
      
      // Only transform string literals, leave dynamic imports untouched
      stringLiteralsOnly: true,
      
      // Custom chunk name template (default: "[name]")
      chunkNameTemplate: '[name]-lazy',
      
      // Enable debug logging in development
      debug: process.env.NODE_ENV === 'development',
      
      // Specify which import specifiers to transform
      importSpecifiers: ['lazy', 'default'],
      
      // Specify which module names to look for
      moduleNames: ['@phantasm0009/lazy-import', 'lazy-import']
    }]
  ]
};

// Example package.json scripts:
/*
{
  "scripts": {
    "build": "babel src --out-dir dist --extensions .ts,.tsx",
    "test": "jest",
    "dev": "babel src --out-dir dist --watch",
    "analyze": "npx lazy-import analyze"
  }
}
*/
