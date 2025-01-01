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
    if (!options.validFor || options.validFor === 0) {
      return await func();
    }

    const query = await unstable_cache(
      async () => {
        log(
          `Result of '${cacheKey.join()}' query will be cached for ${options.validFor} seconds.`,
        );
        return await func();
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
    tags.forEach((tag) => {
      log(`Revalidating tag: ${tag}`);
      revalidateTag(tag);
    });
  },
};

const log = (message: string) => {
  console.log(`[Cache] ${new Date().toISOString()} - ${message}`);
};
