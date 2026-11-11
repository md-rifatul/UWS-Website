import { useState, useEffect } from 'react';
import { catalogService, DEFAULT_SITE_SETTINGS, SiteSettingsMap } from '@/services/catalogService';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsMap>(() => {
    const stored = localStorage.getItem('wts_site_settings');
    if (stored) {
      try {
        return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(stored) };
      } catch {
        // fallback to default
      }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  useEffect(() => {
    let isMounted = true;

    // Fetch live settings from backend API
    catalogService.getSiteSettings().then((res) => {
      if (isMounted) {
        setSettings(res);
      }
    });

    // Listen for real-time updates from Admin Settings Page
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<SiteSettingsMap>;
      if (customEvent.detail) {
        setSettings({ ...DEFAULT_SITE_SETTINGS, ...customEvent.detail });
      }
    };

    window.addEventListener('wts-settings-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('wts-settings-updated', handleUpdate);
    };
  }, []);

  return settings;
}

export default useSiteSettings;

