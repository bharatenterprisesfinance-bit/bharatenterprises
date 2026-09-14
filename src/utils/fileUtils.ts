import { UploadDocFile } from '../types';

/**
 * Formats byte size into human readable string (KB / MB)
 */
export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 KB';
  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${Math.round(kb)} KB`;
  }
  return `${(kb / 1024).toFixed(1)} MB`;
};

/**
 * Validates document file size (defaults to 12MB limit)
 */
export const validateFileSize = (file: File, maxMb = 12): { valid: boolean; error?: string } => {
  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size exceeds ${maxMb}MB limit. Please upload a smaller file.`,
    };
  }
  return { valid: true };
};

/**
 * Optimizes and converts any uploaded document (image or PDF) into a base64 UploadDocFile.
 * For images, automatically resizes oversized mobile camera photos (down to max 1600px)
 * to ensure fast uploads to Google Drive and avoid Apps Script payload limits.
 */
export const processFileForUpload = async (file: File): Promise<UploadDocFile> => {
  return new Promise((resolve, reject) => {
    // If image, compress and downscale if oversized
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const img = new Image();

        img.onload = () => {
          try {
            const maxDimension = 1600;
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = Math.round((height * maxDimension) / width);
                width = maxDimension;
              } else {
                width = Math.round((width * maxDimension) / height);
                height = maxDimension;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
              const estimatedBytes = Math.round((compressedBase64.length * 3) / 4);

              resolve({
                name: file.name.replace(/\.[^/.]+$/, '.jpg'),
                mimeType: 'image/jpeg',
                base64: compressedBase64,
                size: estimatedBytes,
              });
              return;
            }

            // Canvas context unavailable fallback
            resolve({
              name: file.name,
              mimeType: file.type || 'image/jpeg',
              base64: result,
              size: file.size,
            });
          } catch {
            resolve({
              name: file.name,
              mimeType: file.type || 'image/jpeg',
              base64: result,
              size: file.size,
            });
          }
        };

        img.onerror = () => {
          // If Image parsing fails, return raw base64
          resolve({
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            base64: result,
            size: file.size,
          });
        };

        img.src = result;
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    } else {
      // PDF or other documents: read directly
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          name: file.name,
          mimeType: file.type || 'application/pdf',
          base64: reader.result as string,
          size: file.size,
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    }
  });
};
