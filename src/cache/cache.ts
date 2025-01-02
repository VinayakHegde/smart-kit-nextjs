import { revalidateTag, unstable_cache } from 'next/cache';

/**
 * This object provides a set of functions to cache data and revalidate it on-demand.
 * @example
 * ```ts
 * import { cache } from '@vinayakhegde/smart-kit-nextjs/cache';
 *
 * const data = await cache.execute(
 *  async () => {
 *   const response = await fetch('https://api.example.com/users');
 *   return await response.json();
 *  },
 *  ['example', 'users'],
 *  { interval: 60, tags: ['users'] }
 * );
 *
 * cache.revalidateByTag(['users']);
 * ```
 */
export const cache: ISmartKit.Cache = {
  execute: async <T>(
    func: () => Promise<T>,
    cacheKey: string[],
    options: ISmartKit.CacheOptions,
  ): Promise<T> => {
    if (!options.validFor || options.validFor < 1 || !cacheKey?.length) {
      return await func();
    }

    const query = await unstable_cache(
      async () => {
        try {
          log(
            `Result of '${cacheKey.join()}' query will be cached for ${options.validFor} seconds.`,
          );
          return await func();
        } catch (error) {
          log(`Error caching result for '${cacheKey.join()}': ${error}`);
          throw error;
        }
      },
      cacheKey,
      {
        tags: ['*'].concat(options.tags || []),
        revalidate: options.validFor,
      },
    );

    const result = await query();
    log(`Result of ${cacheKey.join()} query returned from cache`);
    return result;
  },
  revalidateByTag: (tags: string[]) => {
    if (!tags?.length) {
      throw new Error('Tags array cannot be empty');
    }
    tags.forEach((tag) => {
      if (typeof tag !== 'string' || !tag) {
        throw new Error('Invalid tag value');
      }
      log(`Revalidating tag: ${tag}`);
      revalidateTag(tag);
    });
  },
};

const log = (message: string) => {
  console.log(`[Cache] ${new Date().toISOString()} - ${message}`);
};
