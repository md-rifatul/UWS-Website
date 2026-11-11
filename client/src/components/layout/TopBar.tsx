import React from 'react';
import { Phone, Mail, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const TopBar: React.FC = () => {
  const siteSettings = useSiteSettings();
  const rawWhatsApp = (siteSettings.whatsapp_number || '+8801700000000').replace(/[^0-9]/g, '');

  return (
    <div className="bg-navy-950 text-slate-300 text-xs border-b border-navy-800 w-full">
      <div className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 py-2 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Contact & Support (Dynamic from Admin Settings) */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          <a
            href={`tel:${siteSettings.support_phone || '+8801700000000'}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-industrial-orange" />
            <span className="font-medium">{siteSettings.support_phone || '+880 1700-000000'}</span>
          </a>
          <a
            href={`mailto:${siteSettings.support_email || 'info@woodtechsolutionbd.com'}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-industrial-orange" />
            <span>{siteSettings.support_email || 'info@woodtechsolutionbd.com'}</span>
          </a>
          {siteSettings.showroom_hours && (
            <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{siteSettings.showroom_hours}</span>
            </div>
          )}
        </div>

        {/* Right: Direct WhatsApp & Certification (Dynamic from Admin Settings) */}
        <div className="flex items-center gap-4 sm:gap-6">
          {siteSettings.partner_badge && (
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{siteSettings.partner_badge}</span>
            </div>
          )}
          <a
            href={`https://wa.me/${rawWhatsApp}?text=Hello%20WoodTech,%20I%20am%20inquiring%20about%20industrial%20machinery.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Quick Desk</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

