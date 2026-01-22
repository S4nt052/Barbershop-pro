import { uploadFile } from '@uploadcare/upload-client';
import { StorageProvider } from '../../domain/StorageProvider';

export class UploadcareStorageProvider implements StorageProvider {
  private publicKey: string;

  constructor() {
    this.publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY || '';
  }

  async uploadFile(file: Buffer | string | File | Blob, path: string = 'barbershop'): Promise<string> {
    const result = await uploadFile(file, {
      publicKey: this.publicKey,
      store: 'auto',
      fileName: path.split('/').pop(),
    });
    
    return result.cdnUrl || `https://ucarecdn.com/${result.uuid}/`;
  }

  async deleteFile(url: string): Promise<void> {
    /** 
     * Uploadcare deletion usually requires the REST API with a Secret Key.
     * For now, we'll focus on uploading and storing the URL.
     * Real deletion logic would use @uploadcare/rest-client.
     */
    console.log(`Deletion requested for: ${url} (Requires REST API config)`);
  }
}
