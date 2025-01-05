import { validateEnvVars } from './validate-env-vars';

beforeEach(() => {
  vi.resetModules();
});

test('should throw an error when multiple required environment variables are missing', () => {
  expect(() => {
    validateEnvVars(['VAR1', 'VAR2']);
  }).toThrowError('Missing required environment variables: VAR1, VAR2');
});

test('should throw an error when a required environment variable is missing', () => {
  process.env.VAR1 = 'value1';

  expect(() => {
    validateEnvVars(['VAR1', 'VAR2']);
  }).toThrowError('Missing required environment variables: VAR2');
});

test('should not throw an error when all required environment variables are present', () => {
  process.env.VAR1 = 'value1';
  process.env.VAR2 = 'value2';

  expect(() => {
    validateEnvVars(['VAR1', 'VAR2']);
  }).not.toThrow();
});
