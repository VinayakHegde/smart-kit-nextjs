import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['coverage/*', 'public/*', 'dist/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['*.js', '*.cjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        __dirname: true,
        module: true,
        require: true,
        process: true,
        console: true,
        exports: true,
        Buffer: true,
        setImmediate: true,
        clearImmediate: true,
      },
    },
  },
];
