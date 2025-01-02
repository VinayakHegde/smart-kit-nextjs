export const getValueLength = (
  value: ICache.CacheValue,
  options?: ICache.IMemoryCache.ValueOption,
) => {
  if (typeof value === 'string') {
    return value.length;
  } else if (options?.forceString) {
    return JSON.stringify(value).length;
  } else if (Array.isArray(value)) {
    return (options?.maxLength?.array ?? 0) * value.length;
  } else if (typeof value === 'number') {
    return 8;
  } else if (typeof value?.then === 'function') {
    return options?.maxLength?.buffer ?? 0;
  } else if (Buffer.isBuffer(value)) {
    return value.length;
  } else if (typeof value === 'object') {
    return (options?.maxLength?.object ?? 0) * Object.keys(value).length;
  } else if (typeof value === 'boolean') {
    return 8;
  }
  return 0;
};
