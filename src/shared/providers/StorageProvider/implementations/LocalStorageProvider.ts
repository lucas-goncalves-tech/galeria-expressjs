import { writeFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import fs from 'node:fs';
import { IStorageProvider } from '../IStorageProvider';

export class LocalStorageProvider implements IStorageProvider {
  private readonly storageLocation = process.env.STORAGE_LOCATION;
  private readonly storageDir: string;
  constructor() {
    if (!this.storageLocation) {
      throw new Error('env STORAGE_LOCATION não foi definida!');
    }
    this.storageDir = path.resolve(this.storageLocation);

    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async save(fileBuffer: Buffer, filename: string) {
    const filePath = path.resolve(this.storageDir, filename);
    await writeFile(filePath, fileBuffer);

    return filename;
  }

  async delete(filename: string) {
    const filePath = path.resolve(this.storageDir, filename);
    await unlink(filePath);
  }
}
