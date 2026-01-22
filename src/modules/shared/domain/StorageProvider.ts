export interface StorageProvider {
  uploadFile(file: Buffer | string, path: string): Promise<string>;
  deleteFile(url: string): Promise<void>;
}
