/// <reference types="vitest" />

declare global {
  const vi: (typeof import('vitest'))['vi'];
  const describe: (typeof import('vitest'))['describe'];
  const test: (typeof import('vitest'))['test'];
  const it: (typeof import('vitest'))['it'];
  const expect: (typeof import('vitest'))['expect'];
  const beforeEach: (typeof import('vitest'))['beforeEach'];
  const afterEach: (typeof import('vitest'))['afterEach'];
  const beforeAll: (typeof import('vitest'))['beforeAll'];
  const afterAll: (typeof import('vitest'))['afterAll'];
}