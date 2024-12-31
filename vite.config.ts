import { defineConfig, LibraryFormats } from 'vite';
import dts from 'vite-plugin-dts';
import {
  alias,
  entry,
  fileName,
  libraryFormats,
  dtsOptions,
} from './scripts/build-tool-helper';

export default defineConfig({
  resolve: {
    alias,
  },
  build: {
    minify: true,
    reportCompressedSize: true,
    lib: {
      entry,
      fileName,
      formats: libraryFormats as LibraryFormats[],
    },
  },
  plugins: [dts(dtsOptions)],
});
