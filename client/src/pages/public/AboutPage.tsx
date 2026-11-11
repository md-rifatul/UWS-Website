import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Leaf,
  ArrowRight,
  HeartHandshake,
  MessageSquare,
  Award,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import useSiteSettings from '@/hooks/useSiteSettings';

export const AboutPage: React.FC = () => {
  const siteSettings = useSiteSettings();
  const rawWhatsApp = (siteSettings.whatsapp_number || siteSettings.corporate_office_phone || '01912580072').replace(/[^0-9]/g, '');
  const normalizedWhatsApp = rawWhatsApp.startsWith('880') ? rawWhatsApp : rawWhatsApp.startsWith('0') ? `88${rawWhatsApp}` : `880${rawWhatsApp}`;

  return (
    <div className="bg-surface-offwhite min-h-screen py-10 sm:py-16 pb-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 1. HERO BANNER: ABOUT US / ABOUT UNIQUE WOOD SOLUTION */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-industrial-orange text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Us &bull; Unique Wood Solution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-tight">
            More Than Craftsmen — <br />
            <span className="text-industrial-orange">We Are Storytellers</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto font-normal">
            At <strong>Unique Wood Solution</strong>, we are more than craftsmen; we are storytellers,
            weaving tales of passion, creativity, and expertise through the medium of wood.
            Established with a vision to redefine craftsmanship and innovation, our journey
            began with a profound love for the timeless beauty and versatility of wood.
          </p>
        </div>

        {/* 2. TWO-COLUMN FEATURE: OUR STORY & OUR PHILOSOPHY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Our Story */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-industrial-orange flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange block">
                Heritage & Dedication
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Our Story
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Driven by an unwavering commitment to excellence, <strong>Unique Wood Solution</strong> was
                founded with a simple yet ambitious goal: to create exceptional wooden pieces that inspire,
                captivate, and endure.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                What started as a humble workshop soon blossomed into a haven for artisans dedicated to
                pushing the boundaries of woodworking craftsmanship.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs font-semibold text-navy-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pushing boundaries of precision and artistic woodworking</span>
            </div>
          </div>

          {/* Card 2: Our Philosophy */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-navy-950 text-white flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                Tradition Meets Modernity
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                Our Philosophy
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                At the core of our ethos lies an amalgamation of tradition and innovation. We embrace age-old
                techniques passed down through generations, infusing them with modern design sensibilities.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Every creation is a harmonious blend of heritage and contemporary flair, meticulously crafted
                to exude elegance and functionality.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-3 text-xs font-semibold text-navy-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Harmonious blend of heritage craftsmanship &amp; contemporary flair</span>
            </div>
          </div>
        </div>

        {/* 3. THREE CORE PILLARS GRID */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Crafting Excellence With Purpose
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Meet Our Team */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs hover:border-industrial-orange/60 hover:shadow-lg transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-industrial-orange text-industrial-orange group-hover:text-white flex items-center justify-center transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy-950">
                Meet Our Team
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our team comprises passionate artisans and craftsmen whose expertise transcends mere skill.
                Their dedication and love for the craft breathe life into each creation, ensuring that every
                piece leaving our workshop is not just an object but a testament to our collective commitment
                to excellence.
              </p>
            </div>

            {/* Pillar 2: Crafting Experiences, One Piece at a Time */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs hover:border-industrial-orange/60 hover:shadow-lg transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-industrial-orange text-industrial-orange group-hover:text-white flex items-center justify-center transition-colors">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy-950">
                Crafting Experiences, One Piece at a Time
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We believe that our creations should resonate with your individuality. That’s why we collaborate
                closely with our clients, understanding their aspirations and preferences to craft bespoke
                solutions that reflect their unique personalities and tastes.
              </p>
            </div>

            {/* Pillar 3: Our Commitment to Sustainability */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 sm:p-8 shadow-xs hover:border-industrial-orange/60 hover:shadow-lg transition-all duration-300 space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-industrial-orange text-industrial-orange group-hover:text-white flex items-center justify-center transition-colors">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-navy-950">
                Our Commitment to Sustainability
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Preserving nature’s gifts is a responsibility we hold dear. We take pride in our eco-conscious
                approach, sourcing wood responsibly and implementing sustainable practices in our production
                processes. By choosing Unique Wood Solution, you’re not only investing in quality craftsmanship
                but also contributing to a greener, healthier planet.
              </p>
            </div>
          </div>
        </div>

        {/* 4. HERO CALLOUT: JOIN US IN CELEBRATING WOODWORK */}
        <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-xl border border-navy-800 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange block">
              An Invitation to Pure Artistry
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Join Us in Celebrating Woodwork
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Whether you’re seeking to transform your living space or searching for that one-of-a-kind statement
              piece, <strong>Unique Wood Solution</strong> invites you to embark on a journey where passion meets
              creativity, and every creation narrates its own story.
            </p>

            <blockquote className="p-4 sm:p-5 rounded-xl bg-white/5 border-l-4 border-industrial-orange text-sm sm:text-base text-slate-200 italic font-medium">
              &ldquo;Thank you for considering Unique Wood Solution – where craftsmanship, innovation,
              and dedication converge to redefine the artistry of woodworking.&rdquo;
            </blockquote>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-industrial-orange hover:bg-industrial-orange-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all hover:scale-102"
              >
                <span>Explore Our Machinery & Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition-all"
              >
                <span>Get in Touch</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 5. GET IN TOUCH SECTION */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm text-center max-w-4xl mx-auto space-y-6">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-industrial-orange flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
              Get in Touch
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              We’re thrilled to share our passion for woodworking with you. Contact us to explore our collection,
              discuss customizations, or simply share your ideas. Let’s collaborate to turn your vision into
              exquisitely crafted reality.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-950 hover:bg-industrial-orange text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
            >
              <span>Contact Our Specialists</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={`https://wa.me/${normalizedWhatsApp}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Direct Desk</span>
            </a>

            <Link
              to="/request-quote"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface-offwhite hover:bg-slate-100 text-navy-950 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 transition-all"
            >
              <span>Request Custom Quotation</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
