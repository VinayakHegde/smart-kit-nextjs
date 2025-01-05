/**
 * Loads required environment variables from an RC file (Node.js only).
 * @param rcFilePath - Path to the RC file.
 * @returns An array of required environment variable names.
 * @throws If the RC file cannot be read.
 * @example
 * ```ts
 * import { loadEnvVarsFromRcFile } from '@vinayakhegde/smart-kit-nextjs/validate-env-vars';
 *
 * try {
 *  const requiredEnvVars = loadEnvVarsFromRcFile('.envrc');
 *  console.log(requiredEnvVars);
 * } catch (error) {
 *  console.error(error.message);
 *  process.exit(1);
 * }
 */
export const loadEnvVarsFromRcFile = async (rcFilePath: string) => {
  if (typeof window !== 'undefined') {
    throw new Error(
      'loadRequiredEnvVars can only be used in a Node.js environment.',
    );
  }

  try {
    const fs = await import('fs').then((module) => module.default);
    const fileContent = fs.readFileSync(rcFilePath, 'utf-8');
    return fileContent
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
  } catch (error) {
    throw new Error(`Failed to load RC file: ${(error as Error).message}`);
  }
};
