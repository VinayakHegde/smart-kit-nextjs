export const CacheError = {
  ERRORS: {
    ERROR_NOTFOUND: (type: string) => `Key \`${type}\` not found`,
    ERROR_CACHEFULL: () => 'Cache max keys amount exceeded',
    ERROR_KEYTYPE: (type: string) =>
      `The key argument has to be of type \`string\` or \`number\`. Found: \`${type}\``,
    ERROR_KEYSTYPE: () => 'The keys argument has to be an array.',
    ERROR_TTLTYPE: () => 'The ttl argument has to be a number.',
  },
  type: '',
  get error() {
    const err = new Error();
    err.name = this.type;
    err.message =
      this.ERRORS[this.type as keyof typeof this.ERRORS]?.(this.type) ?? '-';
    return err as Error & { type: string };
  },
  set error(data: ICache.IMemoryCache.CacheErrorData) {
    this.type = data.type;
  },
};

CacheError.error = { type: 'ERROR_NOTFOUND' };
