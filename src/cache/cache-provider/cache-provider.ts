import { Provider } from './providers/interface';
import { FileCache } from './providers/file-cache';
import { MemoryCache } from './providers/memory-cache';

export type CacheConfig =
  | {
      cacheDir: string;
    }
  | {
      timeToLive: number;
      options?: ICache.IMemoryCache.Option;
    };

/**
 * Cache provider factory
 * @param config Cache configuration
 * @returns Cache provider
 * @throws Invalid cache configuration
 * @example
 * ```ts
 * import { CacheProvider } from '@vinayakhegde/smart-kit-nextjs/node/cache-provider';
 *
 * // File cache
 * const cache = CacheProvider.create({
 *   cacheDir: 'cache',
 * });
 *
 * // Memory cache
 * const cache = CacheProvider.create({
 *   timeToLive: 1000,
 * });
 *```
 */
export class CacheProvider {
  static create(config: CacheConfig): Provider {
    if ('cacheDir' in config) {
      return new FileCache(config.cacheDir);
    }
    if ('timeToLive' in config) {
      return new MemoryCache(config.timeToLive, config.options);
    }
    throw new Error('Invalid cache configuration');
  }
}
