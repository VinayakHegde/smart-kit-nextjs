import {
  revalidateTag,
  unstable_cache as nextCache,
  unstable_cacheLife as nextCacheLife,
  unstable_cacheTag as nextCacheTag,
} from 'next/cache';

/**
 * This object provides a set of functions to cache data and revalidate it on-demand.
 * @example
 * ```ts
 * import { apiCache, ReadyMadeCacheProfile } from '@vinayakhegde/smart-kit-nextjs/cache';
 *
 * // Option: 1
 * const data = await apiCache.execute(
 *  async (...args) => {
 *   console.log('Executing function with args:', args);
 *   const response = await fetch('https://api.example.com/users');
 *   return await response.json();
 *  },
 *  { interval: 60, cacheKeys: ['example', 'users'], tags: ['users'] }
 * );
 *
 * // Option: 2 - works only when 'experimental.dynamicIO' is enabled in next.config.js
 * const data = await apiCache.execute(
 *   async (...args) => {
 *    console.log('Executing function with args:', args);
 *    const response = await fetch('https://api.example.com/users');
 *    return await response.json();
 *   },
 *   { cacheLife: ReadyMadeCacheProfile.minutes }
 *   // or { cacheLife: { stale: 300, revalidate: 60, expire: 3600 } }
 *   // or { cacheLife: 'custom-defined-in-next.config' }
 *   // or { cacheTag: 'users' }
 * );
 *
 * // next.config.js
 * const nextConfig = {
 *   // other next config,
 *   experimental: {
 *     dynamicIO: true,
 *   },
 * };
 *
 * apiCache.revalidateByTag(['users']);
 * ```
 */
export const apiCache: ICache.IApiCache.ApiCache = {
  execute: async <T>(
    func: (...args: unknown[]) => Promise<T>,
    options: ICache.IApiCache.Option,
  ): Promise<T> => {
    if ('cacheLife' in options) {
      return await apiCacheLife<T>(func, options.cacheLife);
    }

    if ('cacheTag' in options) {
      return await apiCacheTag<T>(func, options.cacheTag);
    }

    const { validFor, cacheKeys, tags } = options;
    if (!validFor || validFor < 1 || !cacheKeys?.length) {
      return await func({
        cacheKeys,
        tags,
        strategy: ['no-cache'],
      });
    }

    const query = await nextCache(
      async () => {
        try {
          log(
            `Result of '${cacheKeys.join()}' query will be cached for ${validFor} seconds.`,
          );
          return await func({
            cacheKeys,
            tags,
            strategy: ['cache-first'],
          });
        } catch (error) {
          log(`Error caching result for '${cacheKeys.join()}': ${error}`);
          throw error;
        }
      },
      cacheKeys,
      {
        tags: ['*'].concat(tags || []),
        revalidate: validFor,
      },
    );

    const result = await query();
    log(`Result of ${cacheKeys.join()} query returned from cache`);
    return result;
  },
  revalidateByTag: (tags: ICache.CacheKey[]) => {
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

export const ReadyMadeCacheProfile = {
  default: 'default',
  days: 'days',
  hours: 'hours',
  max: 'max',
  minutes: 'minutes',
  seconds: 'seconds',
  weeks: 'weeks',
} as const;

const cacheProfiles = Object.values(ReadyMadeCacheProfile);

const apiCacheLife = async <T>(
  func: Parameters<typeof apiCache.execute<T>>[0],
  cacheLife: ICache.IApiCache.CacheLife,
) => {
  'use cache';
  if (typeof cacheLife === 'object') {
    const { stale, revalidate, expire } = cacheLife;
    nextCacheLife({ stale, revalidate, expire });
  } else if (
    cacheLife &&
    (typeof cacheLife === 'string' || cacheProfiles.includes(cacheLife))
  ) {
    nextCacheLife(cacheLife);
  }

  return await func({
    cacheKeys: cacheLife,
    tags: null,
    strategy: ['cache-life'],
  });
};

const apiCacheTag = async <T>(
  func: Parameters<typeof apiCache.execute<T>>[0],
  cacheTag: ICache.CacheKey,
) => {
  'use cache';
  nextCacheTag(cacheTag);
  return await func({
    cacheKeys: cacheTag,
    tags: [cacheTag],
    strategy: ['cache-tag'],
  });
};
