/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace ICache {
  namespace IApiCache {
    type CacheLife =
      | string
      | 'default'
      | 'days'
      | 'hours'
      | 'max'
      | 'minutes'
      | 'seconds'
      | 'weeks'
      | {
          stale?: number;
          revalidate?: number;
          expire?: number;
        };

    type CacheLifeOption = {
      cacheLife: CacheLife;
    };
    type Option =
      | {
          /**
           * an array of strings that uniquely identifies the cache
           */
          cacheKeys: CacheKey[];
          /**
           * The revalidation interval in seconds.
           */
          validFor: number | false;
          tags?: string[];
        }
      | CacheLifeOption;
    type ApiCache = {
      /**
       * This function allows you to cache the result of a function call for a specific amount of time.
       * @param func that returns a promise
       * @param options configuration object
       */
      execute<T>(func: () => Promise<T>, options: Option): Promise<T>;
      /**
       * This function allows you to purge cached data on-demand for a specific cache tag(s).
       * @param tags
       */
      revalidateByTag: (tags: CacheKey[]) => void;
    };
  }

  type CacheValue = any;
  type CacheKey = string;
  namespace IMemoryCache {
    type ValueOption = {
      forceString?: boolean;
      useClone?: boolean;
      maxLength?: {
        array?: number;
        object?: number;
        buffer?: number;
      };
    };

    type Option = {
      valueOptions?: ValueOptions;
      checkInterval?: number;
      retainOnExpire?: boolean;
      maxKeys?: number;
    };

    type Stats = {
      hits: number;
      misses: number;
      keys: number;
      ksize: number;
      vsize: number;
    };

    type CacheErrorData = {
      type: string;
    };

    type CacheData = {
      t: number;
      v: CacheValue;
    };
  }
}
