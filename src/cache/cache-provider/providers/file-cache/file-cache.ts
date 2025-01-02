import { Provider } from '../interface';
import fs from 'fs/promises';
import path from 'path';

export class FileCache implements Provider {
  private cacheDir: string;

  constructor(cacheDir: string) {
    if (cacheDir.startsWith('../') || cacheDir.startsWith('./')) {
      console.log('Relative path is taken care of by the cache provider');
    }

    this.cacheDir = `./.file-cache-${cacheDir.replace('../', '').replace('./', '')}`;
  }

  private async getFilePath(key: string): Promise<string> {
    return path.join(this.cacheDir, `${key}.json`);
  }

  async set(key: string, value: string): Promise<void> {
    const filePath = await this.getFilePath(key);
    await fs.mkdir(this.cacheDir, { recursive: true });
    await fs.writeFile(filePath, value, 'utf-8');
  }

  async get(key: string): Promise<string | null> {
    try {
      const filePath = await this.getFilePath(key);
      return await fs.readFile(filePath, 'utf-8');
    } catch {
      return null;
    }
  }

  async del(key: string): Promise<void> {
    const filePath = await this.getFilePath(key);
    await fs.unlink(filePath).catch(() => {});
  }

  async clear(): Promise<void> {
    await fs.rmdir(this.cacheDir, { recursive: true });
  }
}
