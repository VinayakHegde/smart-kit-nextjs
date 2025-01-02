import { EventEmitter } from 'events';
import { Provider } from '../interface';
import { CacheError } from './cache-error';
import { getValueLength } from './get-value-length';

/**
 * MemoryCache
 * @example
 * ```ts
 * import { MemoryCache } from '@vinayakhegde/smart-kit-nextjs/memory-cache';
 *
 * const cache = new MemoryCache(1000, {
 *   checkInterval: 600,
 * });
 */
export class MemoryCache extends EventEmitter implements Provider {
  private cache: Map<ICache.CacheKey, ICache.IMemoryCache.CacheData>;
  private options: ICache.IMemoryCache.Option;
  private stats: ICache.IMemoryCache.Stats;
  private validKeyTypes: string[];
  private checkTimeout: NodeJS.Timeout | null;
  private timeToLive: number;

  constructor(
    timeToLive: number = 0,
    options: ICache.IMemoryCache.Option = {},
  ) {
    super();
    this.cache = new Map();
    this.timeToLive = timeToLive;

    this.options = {
      valueOptions: {
        forceString: false,
        useClone: true,
        ...options.valueOptions,
        maxLength: {
          array: 40,
          object: 80,
          buffer: 80,
          ...options.valueOptions?.maxLength,
        },
      },
      checkInterval: options.checkInterval ?? 600,
      retainOnExpire: options.retainOnExpire ?? false,
      maxKeys: options.maxKeys ?? -1,
    };

    this.stats = {
      hits: 0,
      misses: 0,
      keys: 0,
      ksize: 0,
      vsize: 0,
    };

    this.validKeyTypes = ['string'];
    this.checkTimeout = null;

    this._checkData();
  }

  async get(key: ICache.CacheKey): Promise<ICache.CacheValue | undefined> {
    const err = this._isInvalidKey(key);
    if (err) throw err;

    const data = this.cache.get(key);
    if (data && (await this._check(key, data))) {
      this.stats.hits++;
      return await this._unwrap(data);
    }

    this.stats.misses++;
    return undefined;
  }

  async set(key: ICache.CacheKey, value: ICache.CacheValue) {
    const maxKeys = this.options.maxKeys ?? -1;
    if (maxKeys > -1 && this.stats.keys >= maxKeys) {
      CacheError.error = { type: 'ERROR_CACHEFULL' };
      throw CacheError.error;
    }

    if (this.options.valueOptions?.forceString && typeof value !== 'string') {
      value = JSON.stringify(value);
    }

    const err = this._isInvalidKey(key);
    if (err) throw err;

    const existent = this.cache.has(key);
    if (existent) {
      const oldData = this.cache.get(key)!;
      this.stats.vsize -= getValueLength(
        await this._unwrap(oldData, false),
        this.options.valueOptions,
      );
    }

    const wrappedValue = await this._wrap(value);
    this.cache.set(key, wrappedValue);
    this.stats.vsize += getValueLength(value, this.options.valueOptions);

    if (!existent) {
      this.stats.ksize += key.toString().length;
      this.stats.keys++;
    }

    this.emit('set', key, value);
  }

  async del(key: ICache.CacheKey) {
    const err = this._isInvalidKey(key);
    if (err) throw err;

    const data = this.cache.get(key);
    if (data) {
      this.stats.vsize -= getValueLength(
        await this._unwrap(data, false),
        this.options.valueOptions,
      );
      this.stats.ksize -= key.toString().length;
      this.stats.keys--;
      this.cache.delete(key);
      this.emit('del', key, data.v);
    }
  }

  async clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, keys: 0, ksize: 0, vsize: 0 };
    this._killCheckPeriod();
    this._checkData();
    this.emit('flush');
  }

  private _checkData() {
    for (const [key, value] of this.cache.entries()) {
      this._check(key, value);
    }

    if (this.options.checkInterval ?? 0 > 0) {
      this.checkTimeout = setTimeout(
        () => this._checkData(),
        (this.options.checkInterval ?? 0) * 1000,
      );
      this.checkTimeout.unref?.();
    }
  }

  private _killCheckPeriod() {
    if (this.checkTimeout) {
      clearTimeout(this.checkTimeout);
    }
  }

  private async _check(
    key: ICache.CacheKey,
    data: ICache.IMemoryCache.CacheData,
  ) {
    if (data.t !== 0 && data.t < Date.now()) {
      if (!this.options.retainOnExpire) {
        this.del(key);
      }
      this.emit('expired', key, await this._unwrap(data));
      return false;
    }
    return true;
  }

  private _isInvalidKey(key: ICache.CacheKey) {
    if (!this.validKeyTypes.includes(typeof key)) {
      CacheError.error = { type: 'ERROR_KEYTYPE' };
      return CacheError.error;
    }
    return null;
  }

  private async _wrap(value: ICache.CacheValue) {
    const now = Date.now();
    const livetime = this.timeToLive === 0 ? 0 : now + this.timeToLive * 1000;
    return {
      t: livetime,
      v: this.options.valueOptions?.useClone
        ? await this._unwrap({ v: value, t: livetime })
        : value,
    };
  }

  private async _unwrap(
    value: ICache.IMemoryCache.CacheData,
    asClone = true,
  ): Promise<ICache.CacheValue> {
    if (asClone) {
      const { default: clone } = await import('clone');
      return clone(value.v);
    }
    return value.v;
  }
}
