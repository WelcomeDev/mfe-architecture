import { LibraryOptions, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import replace from '@rollup/plugin-replace';

export interface GetBuildConfigParams {
  lib?: LibraryOptions;
  name: string;
  peerDependencies?: Record<string, string>;
}

const defaultLib: LibraryOptions = {
  entry: {
    index: './src/index.ts',
  },
  formats: [ 'es', 'cjs' ],
};

export function getBuildConfig({ lib = defaultLib, name, peerDependencies = {} }: GetBuildConfigParams) {
  return ({
    mode: 'production',
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
      // нам не нужны никакие проверки на прод билд,
      // мы собираем библиотеку, поэтому все проверки не должны быть включены в банд.
      // Это значительно уменьшает размер библиотеки
      replace({
        preventAssignment: true,
        values: {
          // JSON.stringify is required for plugin to work properly.
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      // мы не можем использовать rootDir в tsconfig, потому что есть ts-файлы конфигурации для билда
      dts({
        outDir: './dist',
        entryRoot: 'src',
        logLevel: 'warn',
        declarationOnly: false,
        copyDtsFiles: true,
        strictOutput: true,
        insertTypesEntry: true,
      }),
    ],
    build: {
      outDir: 'dist',
      cssCodeSplit: true,
      cssMinify: true,
      minify: true,
      emptyOutDir: true,
      sourcemap: false,
      chunkSizeWarningLimit: 10,
      lib: {
        ...lib,
        name,
      },
      rollupOptions: {
        external: [ 'react', 'react-dom', 'react/jsx-runtime' ].concat(Object.keys(peerDependencies)),
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  } satisfies UserConfig);
}
