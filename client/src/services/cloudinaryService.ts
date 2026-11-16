import apiClient from './apiClient';

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
  bytes?: number;
}

/**
 * Backend-Driven Image Service
 * All uploads and deletions are routed through the ASP.NET Core backend API (/api/v1/admin/upload-image and /api/v1/admin/delete-image).
 * Zero Cloudinary API Secret is exposed in the frontend.
 */
export const cloudinaryService = {
  extractPublicId(url: string): string | null {
    return extractPublicIdFromUrl(url);
  },

  /**
   * Upload image securely via the ASP.NET Core backend API.
   * Backend validates file extension, file size, and handles Cloudinary authentication securely.
   */
  async uploadImage(file: File, folder = 'uws-machinery'): Promise<CloudinaryResponse> {
    if (!file) {
      throw new Error('Please select an image file to upload.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<CloudinaryResponse>(
        `/admin/upload-image?folder=${encodeURIComponent(folder)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data && (response.data.secureUrl || response.data.url)) {
        return {
          url: response.data.secureUrl || response.data.url,
          secureUrl: response.data.secureUrl || response.data.url,
          publicId: response.data.publicId || '',
          format: response.data.format,
          width: response.data.width,
          height: response.data.height,
          bytes: response.data.bytes,
        };
      }

      throw new Error('Upload succeeded but no image URL was returned by server.');
    } catch (err: any) {
      console.error('Backend image upload error:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      if (serverMsg) {
        throw new Error(serverMsg);
      }
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        throw new Error('Backend server is not running (http://localhost:5000). Please start the backend server to upload images.');
      }
      throw new Error(err.message || 'Failed to upload image via backend server.');
    }
  },

  /**
   * Delete image from Cloudinary securely via ASP.NET Core backend API.
   * Supports passing either the Cloudinary publicId or the full image URL.
   */
  async deleteImage(publicIdOrUrl: string): Promise<boolean> {
    if (!publicIdOrUrl) return false;

    try {
      const response = await apiClient.delete('/admin/delete-image', {
        params: { publicId: publicIdOrUrl },
      });
      return !!response.data?.success;
    } catch {
      // Fallback to POST in case DELETE with query params is restricted
      try {
        const postRes = await apiClient.post('/admin/delete-image', {
          publicId: publicIdOrUrl,
        });
        return !!postRes.data?.success;
      } catch (postErr) {
        console.warn('Backend image deletion failed:', postErr);
        return false;
      }
    }
  },
};
