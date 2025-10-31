export interface IStorageProvider {
  save(fileBuffer: Buffer, filename: string): Promise<string>;
  delete(filename: string): Promise<void>;
}
