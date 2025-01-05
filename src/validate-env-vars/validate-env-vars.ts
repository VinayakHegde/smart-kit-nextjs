/**
 * Validates the presence of required environment variables.
 * Throws an error if any of the required environment variables are missing.
 * @param requiredEnvVars - An array of strings representing the names of the required environment variables.
 * @throws {Error} - If any of the required environment variables are missing.
 * @example
 *```ts
 * import { validateEnvVars } from '@vinayakhegde/smart-kit-nextjs/validate-env-vars';
 *
 * try {
 *   validateEnvVars(['VAR1', 'VAR2']);
 * } catch (error) {
 *   console.error(error.message);
 *   process.exit(1);
 * }
 * ```
 */
export const validateEnvVars = (requiredEnvVars: string[]): void => {
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    throw new Error(errorMessage);
  }

  console.log('All required environment variables are loaded.');
};
