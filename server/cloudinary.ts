import { v2 as cloudinary } from 'cloudinary';

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET)
  );
}

export function getCloudinaryClient() {
  if (process.env.CLOUDINARY_URL) {
    cloudinary.config();
    return cloudinary;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    return cloudinary;
  }

  return null;
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  fileName?: string
): Promise<{ url: string; public_id: string; format?: string }> {
  const c = getCloudinaryClient();
  if (!c) {
    throw new Error('Cloudinary environment variables are not configured.');
  }

  return new Promise((resolve, reject) => {
    const stream = c.uploader.upload_stream(
      {
        folder: 'naz-export-products',
        resource_type: 'image',
        public_id: fileName
          ? `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-')}`
          : undefined,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(new Error('Cloudinary upload returned no result'));
        }
        resolve({
          url: result.secure_url || result.url,
          public_id: result.public_id,
          format: result.format,
        });
      }
    );

    stream.end(buffer);
  });
}
