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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

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

    const uploadUrl = `${API_BASE_URL}/admin/upload-image?folder=${encodeURIComponent(folder)}`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMsg =
          data?.message ||
          data?.error ||
          data?.title ||
          (data?.errors ? Object.values(data.errors).flat().join(', ') : null) ||
          `Server returned status ${response.status}`;
        throw new Error(errorMsg);
      }

      if (data && (data.secureUrl || data.url)) {
        return {
          url: data.secureUrl || data.url,
          secureUrl: data.secureUrl || data.url,
          publicId: data.publicId || '',
          format: data.format,
          width: data.width,
          height: data.height,
          bytes: data.bytes,
        };
      }

      throw new Error('Upload succeeded but no image URL was returned by server.');
    } catch (err: any) {
      console.error('Backend image upload error:', err);
      if (
        err.name === 'TypeError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError')
      ) {
        throw new Error(
          'Backend server is not running or unreachable at http://localhost:5000. Please start the backend server to upload images.'
        );
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

    const deleteUrl = `${API_BASE_URL}/admin/delete-image?publicId=${encodeURIComponent(publicIdOrUrl)}`;

    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json().catch(() => null);
        return !!data?.success;
      }
    } catch {}

    // Fallback to POST endpoint
    try {
      const postRes = await fetch(`${API_BASE_URL}/admin/delete-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: publicIdOrUrl }),
        credentials: 'include',
      });
      if (postRes.ok) {
        const data = await postRes.json().catch(() => null);
        return !!data?.success;
      }
    } catch (postErr) {
      console.warn('Backend image deletion failed:', postErr);
      return false;
    }

    return false;
  },
};
