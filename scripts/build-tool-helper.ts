import { resolve } from 'path';
import packageJson from '../package.json';

export const alias = [
  {
    find: '@',
    replacement: resolve(__dirname, './src').replace(/[/\\]scripts/, ''),
  },
];

export const entry = Object.keys(packageJson.exports)
  .map((key) => key.replace('.', 'src') + '/index.ts')
  .reduce((acc, path) => {
    const name = path
      .replace(/src[/\\]/, '')
      .replace(/[/\\]index.ts/, '')
      .replace(/[/\\]scripts/, '');

    acc[name === 'index.ts' ? 'main' : name] = resolve(__dirname, path).replace(
      /[/\\]scripts/,
      '',
    );
    return acc;
  }, {});

export const fileName = (format, name) =>
  `${name === 'main' ? '' : name + '/'}index.${format}.js`;

export const libraryFormats = ['es', 'cjs'];

export const dtsOptions = {
  copyDtsFiles: true,
  exclude: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/{jest-helper,utils,request,endpoints}/*',
  ],
};
