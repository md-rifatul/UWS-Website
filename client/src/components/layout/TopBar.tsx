import React from 'react';
import { Phone, Mail, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

export const TopBar: React.FC = () => {
  const siteSettings = useSiteSettings();
  const rawWhatsApp = (siteSettings.whatsapp_number || siteSettings.corporate_office_phone || '01912580072').replace(/[^0-9]/g, '');
  const normalizedWhatsApp = rawWhatsApp.startsWith('880') ? rawWhatsApp : rawWhatsApp.startsWith('0') ? `88${rawWhatsApp}` : `880${rawWhatsApp}`;
  const companyName = siteSettings.logo_title || 'Unique Wood Solution';

  return (
    <div className="bg-navy-950 text-slate-300 text-xs border-b border-navy-800 w-full">
      <div className="max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 py-2 flex flex-col md:flex-row justify-between items-center gap-2">
        {/* Left: Contact & Support (Dynamic from Admin Settings) */}
        <div className="flex items-center flex-wrap gap-4 sm:gap-6">
          <a
            href={`tel:${siteSettings.support_phone || siteSettings.head_office_phone || '01612429999'}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-industrial-orange" />
            <span className="font-medium">{siteSettings.support_phone || siteSettings.head_office_phone || '01612-429999'}</span>
          </a>
          <a
            href={`mailto:${siteSettings.support_email || siteSettings.head_office_email || 'info@uwsbd.com'}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-industrial-orange" />
            <span>{siteSettings.support_email || siteSettings.head_office_email || 'info@uwsbd.com'}</span>
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
            href={`https://wa.me/${normalizedWhatsApp}?text=${encodeURIComponent(`Hello ${companyName}, I am inquiring about industrial woodworking machinery.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Quick Desk ({siteSettings.whatsapp_number || siteSettings.corporate_office_phone || '01912-580072'})</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;

