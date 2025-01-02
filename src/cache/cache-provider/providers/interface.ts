export interface Provider {
  set(key: string, value: ICache.CacheValue): Promise<void>;
  get(key: string): Promise<ICache.CacheValue | null>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}
