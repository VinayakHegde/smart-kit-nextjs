# smart-kit-nextjs

## Description

This is a package with useful utils for Next.js projects. Here are some of the features:

- [api-cache](#api-cache)
- [cache-provider](#cache-provider)
- [security-headres](#security-headres)

---

### api-cache

**A simple cache system that wrapes next.js cache. (`unstable_cache` and `revalidateTag` and `'use cache'` directive).**

Here is an example:

```ts
import { apiCache } from '@vinayakhegde/smart-kit-nextjs/cache';

const data = await apiCache.execute(
  async () => {
    const response = await fetch('https://api.example.com/users');
    return await response.json();
  },
  { validFor: 60, cacheKeys: ['example', 'users'], tags: ['users'] },
);

apiCache.revalidateByTag(['users']);
```

---

### cache-provider

**A serverside cache provider that wraps `FileCache` and `MemoryCache` and provides a simple interface to use them.**

Here is an example:

```ts
import { CacheProvider } from '@vinayakhegde/smart-kit-nextjs/node/cache-provider';

// FileCache
const cacheProvider = CacheProvider.create({
  cacheDir: 'cache',
});

// MemoryCache
const cacheProvider = CacheProvider.create({
  timeToLive: 6000,
});

cashProvider.set('key', 'value');
const value = cashProvider.get('key');

cashProvider.delete('key');

cashProvider.clear();
```

Note: If client side caching is required, use `MemoryCache` instead.

---

### security-headres

**A simple utility to add security headers to the nextjs response.**

Here is an example

```ts
import {
  CSPWhitelist,
  securityHeaders,
} from '@vinayakhegde/smart-kit-nextjs/node/security-headers';
const cspWhitelist: CSPWhitelist = {
  images: ['images.com'],
  scripts: ['scripts.com'],
  iframe: ['iframe.com'],
  connect: ['connect.com'],
  styles: ['styles.com'],
  fonts: ['fonts.com'],
  reports: ['reports.com'],
  media: ['media.com'],
};
const headers = securityHeaders(cspWhitelist);
// next.config.js
const nextConfig = {
  // other next config,
  headers,
};
```

---
