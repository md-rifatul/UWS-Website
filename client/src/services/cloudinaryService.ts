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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

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

    const primaryUrl = `${API_BASE_URL}/admin/upload-image?folder=${encodeURIComponent(folder)}`;
    const directFallbackUrl = `http://127.0.0.1:5000/api/v1/admin/upload-image?folder=${encodeURIComponent(folder)}`;

    try {
      let response: Response;
      try {
        response = await fetch(primaryUrl, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        // If Vite proxy returns 500/502/504 because backend is down or proxy connection dropped, try direct backend URL
        if (!response.ok && (response.status === 500 || response.status === 502 || response.status === 504)) {
          try {
            const fallbackRes = await fetch(directFallbackUrl, {
              method: 'POST',
              body: formData,
              credentials: 'include',
            });
            if (fallbackRes.ok) {
              response = fallbackRes;
            }
          } catch {}
        }
      } catch (firstErr) {
        // Fallback to direct backend URL if proxy or relative request failed
        if (primaryUrl !== directFallbackUrl) {
          response = await fetch(directFallbackUrl, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
        } else {
          throw firstErr;
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (!data && (response.status === 500 || response.status === 502 || response.status === 504)) {
          throw new Error('Backend server is not running (http://localhost:5000). Please start the backend server to upload images.');
        }
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
          'Backend server is unreachable at http://localhost:5000. Please ensure the backend server is running.'
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

    const primaryUrl = `${API_BASE_URL}/admin/delete-image?publicId=${encodeURIComponent(publicIdOrUrl)}`;
    const directFallbackUrl = `http://127.0.0.1:5000/api/v1/admin/delete-image?publicId=${encodeURIComponent(publicIdOrUrl)}`;

    try {
      let response: Response;
      try {
        response = await fetch(primaryUrl, {
          method: 'DELETE',
          credentials: 'include',
        });
      } catch {
        response = await fetch(directFallbackUrl, {
          method: 'DELETE',
          credentials: 'include',
        });
      }

      if (response.ok) {
        const data = await response.json().catch(() => null);
        return !!data?.success;
      }
    } catch {}

    // Fallback to POST endpoint
    try {
      const postUrl = `${API_BASE_URL}/admin/delete-image`;
      const postRes = await fetch(postUrl, {
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
