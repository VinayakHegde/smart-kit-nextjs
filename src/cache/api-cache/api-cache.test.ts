import { apiCache } from './api-cache';
import { revalidateTag, unstable_cache } from 'next/cache';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
});

test('should execute the function when validFor is 0', async () => {
  const func = vi.fn().mockResolvedValue('result');
  const cacheKeys = ['key'];
  const options = { validFor: 0 };

  const result = await apiCache.execute(func, { cacheKeys, ...options });

  expect(func).toHaveBeenCalled();
  expect(result).toBe('result');
});

test('should cache and return the result when validFor is greater than 0', async () => {
  const func = vi.fn().mockResolvedValue('result');
  const cacheKeys = ['key'];
  const options = { validFor: 10 };

  (unstable_cache as typeof vi.mock).mockImplementation(
    async (fn: Promise<void>) => fn,
  );

  const result = await apiCache.execute(func, { cacheKeys, ...options });

  expect(unstable_cache).toHaveBeenCalledWith(
    expect.any(Function),
    cacheKeys,
    expect.objectContaining({
      tags: ['*'],
      revalidate: options.validFor,
    }),
  );
  expect(func).toHaveBeenCalled();
  expect(result).toBe('result');
});

test('should revalidate each tag', () => {
  const tags = ['tag1', 'tag2'];

  apiCache.revalidateByTag(tags);

  expect(revalidateTag).toHaveBeenCalledTimes(2);
  expect(revalidateTag).toHaveBeenCalledWith('tag1');
  expect(revalidateTag).toHaveBeenCalledWith('tag2');
});
