/**
 * Cloudinary Direct Upload & Delete Service
 * Secure direct upload and deletion on Cloudinary CDN with SHA-1 signed authorization.
 */

async function sha1Hex(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function extractPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  const cleanUrl = url.split('?')[0];
  const match = cleanUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
  return match && match[1] ? match[1] : null;
}

export interface CloudinaryResponse {
  url: string;
  secureUrl: string;
  publicId: string;
  format?: string;
  width?: number;
  height?: number;
}

export const cloudinaryService = {
  extractPublicId(url: string): string | null {
    return extractPublicIdFromUrl(url);
  },

  async uploadImage(file: File, folder = 'uws-machinery'): Promise<CloudinaryResponse> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'vyt6u4eu';
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '537746434753267';
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'EOCiyW0YfEcyQdFSrzzAp38L10s';

    if (!file) {
      throw new Error('Please select an image file to upload.');
    }

    // 1. Client-side signature generation for direct Cloudinary REST API
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const strToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const signature = await sha1Hex(strToSign);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('folder', folder);
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return {
          url: data.secure_url || data.url,
          secureUrl: data.secure_url || data.url,
          publicId: data.public_id || '',
          format: data.format,
          width: data.width,
          height: data.height,
        };
      }

      const errorPayload = await response.json().catch(() => ({}));
      const message = errorPayload?.error?.message || `Cloudinary rejected upload (${response.status})`;
      throw new Error(message);
    } catch (err: any) {
      console.warn('Direct Cloudinary upload attempt failed, trying backend proxy:', err);

      // 2. Fallback to backend /api/v1/admin/upload-image if available
      try {
        const backendFormData = new FormData();
        backendFormData.append('file', file);
        const backendRes = await fetch(`/api/v1/admin/upload-image?folder=${encodeURIComponent(folder)}`, {
          method: 'POST',
          body: backendFormData,
        });

        if (backendRes.ok) {
          const bData = await backendRes.json();
          return {
            url: bData.secureUrl || bData.url,
            secureUrl: bData.secureUrl || bData.url,
            publicId: bData.publicId || '',
            format: bData.format,
            width: bData.width,
            height: bData.height,
          };
        }
      } catch {}

      throw new Error(err.message || 'Failed to upload image to Cloudinary.');
    }
  },

  async deleteImage(publicIdOrUrl: string): Promise<boolean> {
    if (!publicIdOrUrl) return false;
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.includes('http://') || publicIdOrUrl.includes('https://')) {
      const extracted = extractPublicIdFromUrl(publicIdOrUrl);
      if (!extracted) {
        // Not a recognized Cloudinary URL
        return false;
      }
      publicId = extracted;
    }

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'vyt6u4eu';
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY || '537746434753267';
    const apiSecret = import.meta.env.VITE_CLOUDINARY_API_SECRET || 'EOCiyW0YfEcyQdFSrzzAp38L10s';

    // 1. Direct Cloudinary REST destroy API call
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const strToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = await sha1Hex(strToSign);

      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Cloudinary image "${publicId}" deleted:`, data);
        return data.result === 'ok';
      }
    } catch (err) {
      console.warn('Direct Cloudinary destroy failed, trying backend proxy:', err);
    }

    // 2. Fallback to backend /api/v1/admin/delete-image if available
    try {
      const bRes = await fetch('/api/v1/admin/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });
      if (bRes.ok) {
        const bData = await bRes.json();
        return !!bData.success;
      }
    } catch {}

    return false;
  },
};
