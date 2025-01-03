import { resolve } from 'path';
import packageJson from '../package.json';

export const alias = {
  '@': resolve(__dirname, './src').replace(/[/\\]scripts/, ''),
  events: 'rollup-plugin-node-polyfills/polyfills/events',
  path: 'rollup-plugin-node-polyfills/polyfills/path',
};

function convertMapping(input: Record<string, { types: string }>) {
  const output = {};

  for (const [key, value] of Object.entries(input)) {
    const formattedKey = key.replace('./', '');
    const srcPath = value.types
      .replace('./dist/', 'src/')
      .replace('.d.ts', '.ts');

    output[srcPath === 'src/index.ts' ? 'main' : formattedKey] = resolve(
      __dirname,
      srcPath,
    ).replace(/[/\\]scripts/, '');
  }

  console.log(output);
  return output;
}
export const entry = convertMapping(packageJson.exports);

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
