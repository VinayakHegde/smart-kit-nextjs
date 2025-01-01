declare namespace ISmartKit {
  type CacheOptions = {
    /**
     * The revalidation interval in seconds.
     */
    validFor: number;
    tags?: string[];
  };
  type Cache = {
    /**
     * This function allows you to cache the result of a function call for a specific amount of time.
     * @param func that returns a promise
     * @param cacheKey an array of strings that uniquely identifies the cache
     * @param options configuration object
     */
    execute<T>(
      func: () => Promise<T>,
      cacheKey: string[],
      options: CacheOptions,
    ): Promise<T>;
    /**
     * This function allows you to purge cached data on-demand for a specific cache tag(s).
     * @param tags
     */
    revalidateByTag: (tags: string[]) => void;
  };
}
