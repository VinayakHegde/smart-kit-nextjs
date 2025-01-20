import { ZodObject, infer as Infer } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
type ZodSchema = ZodObject<Any>;

/**
 * A simple configuration store that allows adding and retrieving configuration
 * based on a provided schema.
 * The configuration is read-only.
 * The configuration is validated against the provided schema.
 * The configuration is added only once for a given schema.
 * The configuration can be replaced if the `bReplaceIfExist` flag is set to `true`.
 * @example
 * ```ts
 * import { z } from 'zod';
 * import { ConfigStore } from '@vinayakhegde/smart-kit-nextjs/config-store';
 *
 * const awesomeSchema = z.object({
 *  apiBasePath: z.string(),
 *  clientId: z.string(),
 *  xFactor: z.object({
 *   x: z.boolean(),
 *   y: z.string(),
 *   z: z.tuple([z.number(), z.number()]),
 *  }),
 * });
 *
 * ConfigStore.add(awesomeSchema, {
 *   apiBasePath: '/api',
 *   clientId: '1234',
 *   xFactor: {
 *     x: true,
 *     y: 'y',
 *     z: [1, 2],
 *   },
 * });
 */
export class ConfigStore {
  private static configMap: Map<ZodSchema, Readonly<Any>> = new Map();

  /**
   * Add a configuration after validating against the provided schema.
   */
  static add<Schema extends ZodSchema>(
    schema: Schema,
    config: Infer<Schema>,
    bReplaceIfExist = false,
  ): { add: typeof ConfigStore.add } {
    const configuration = Object.freeze(schema.parse(config));
    if (ConfigStore.configMap.has(schema) && !bReplaceIfExist) {
      throw new Error('Configuration for the provided schema already exists.');
    }

    ConfigStore.configMap.set(schema, configuration);

    return {
      add: ConfigStore.add,
    };
  }

  /**
   * Retrieve the configuration of the specified schema type.
   * The returned configuration is read-only.
   */
  static get<Schema extends ZodSchema>(
    schema: Schema,
  ): Readonly<Infer<Schema>> {
    const config = ConfigStore.configMap.get(schema);

    if (!config) {
      throw new Error(
        'Configuration for the provided schema has not been added.',
      );
    }

    return config as Readonly<Infer<Schema>>;
  }
}
