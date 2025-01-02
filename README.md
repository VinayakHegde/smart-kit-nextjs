# smart-kit-nextjs

## Description

This is a package with useful utils for Next.js projects. Here are some of the features:

- **cache**: A simple cache system that wrapes next.js cache. (`unstable_cache` and `revalidateTag`). Here is an example:

```ts
import { cache } from '@vinayakhegde/smart-kit-nextjs/cache';

const data = await cache.execute(
  async () => {
    const response = await fetch('https://api.example.com/users');
    return await response.json();
  },
  ['example', 'users'],
  { validFor: 60, tags: ['users'] },
);

cache.revalidateByTag(['users']);
```
