import { writeFile, unlink, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";

export interface ImageStorageService {
  upload(file: File, variantId: string): Promise<string>;
  delete(url: string): Promise<void>;
}

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

class LocalImageStorage implements ImageStorageService {
  async upload(file: File, variantId: string): Promise<string> {
    await mkdir(join(UPLOADS_DIR, variantId), { recursive: true });

    const ext = file.name.split(".").pop() ?? "jpg";
    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(join(UPLOADS_DIR, variantId, filename), buffer);

    return `/uploads/${variantId}/${filename}`;
  }

  async delete(url: string): Promise<void> {
    const filePath = join(process.cwd(), "public", url);
    await unlink(filePath).catch(() => {});
  }
}

let storageInstance: ImageStorageService | null = null;

export function getImageStorage(): ImageStorageService {
  if (!storageInstance) {
    storageInstance = new LocalImageStorage();
  }
  return storageInstance;
}

export async function uploadImages(
  files: File[],
  variantId: string
): Promise<string[]> {
  const storage = getImageStorage();
  const urls = await Promise.all(
    files.map((file) => storage.upload(file, variantId))
  );
  return urls;
}

export async function deleteImage(url: string): Promise<void> {
  const storage = getImageStorage();
  await storage.delete(url);
}
