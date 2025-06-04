import typescript from '@rollup/plugin-typescript';

const createConfig = (input, outputName) => ({
  input,
  output: [
    {
      file: `dist/${outputName}.js`,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: `dist/${outputName}.esm.js`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({ 
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist'
    })
  ],
  external: [
    '@babel/core',
    '@babel/types',
    'esbuild',
    'rollup',
    'vite',
    'webpack',
    'fs',
    'path',
    'glob'
  ]
});

export default [
  createConfig('src/index.ts', 'index'),
  createConfig('src/bundler/bundler.ts', 'bundler'),
  createConfig('src/bundler/babel.ts', 'babel'),
  createConfig('src/bundler/rollup.ts', 'rollup'),
  createConfig('src/bundler/vite.ts', 'vite'),
  createConfig('src/bundler/webpack.ts', 'webpack'),
  createConfig('src/bundler/esbuild.ts', 'esbuild'),
  {
    input: 'src/cli/index.ts',
    output: {
      file: 'dist/cli.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
      sourcemap: true,
    },
    plugins: [
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist'
      })
    ],
    external: [
      'fs',
      'fs/promises',
      'path',
      'glob'
    ]
  }
];
