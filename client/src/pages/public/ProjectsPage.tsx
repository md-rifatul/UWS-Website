import React from 'react';
import { Factory, Calendar, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProjectsPage: React.FC = () => {
  const projects = [
    {
      title: 'Automated Modular Cabinet Production Line',
      client: 'Apex Woodcraft Industries Ltd.',
      location: 'Gazipur Industrial Zone',
      completed: '2025',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      description:
        'Turnkey supply and integration of 3 heavy-duty CNC nesting centers with automatic barcode labeling, high-speed PUR edgebanders, and 6-sided boring line with central dust collection.',
      specs: ['Daily Capacity: 450 Panels', 'Footprint: 18,000 sq ft', 'Power Grid: 380V 250kVA'],
    },
    {
      title: 'Solid Wood & Engineered Door Manufacturing Plant',
      client: 'Bengal Timber & Door Ltd.',
      location: 'Chittagong Heavy Industrial Park',
      completed: '2025',
      image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
      description:
        'Custom multi-daylight 120-Ton hot presses, heavy calibrating sanders, precision 5-axis door lock and hinge mortising CNC machines, and membrane vacuum skin presses.',
      specs: ['Daily Capacity: 300 Doors', 'Footprint: 25,000 sq ft', 'Turnkey Duration: 45 Days'],
    },
    {
      title: 'Commercial Office System Factory Automation',
      client: 'Navana Furnishings Division',
      location: 'Savar Manufacturing Corridor',
      completed: '2024',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      description:
        'Installation of computerized beam saw PS-330 with automatic infeed lifters, paired with zero-joint hot air laser edgebanders for high-end acoustic and melamine partition panels.',
      specs: ['Zero-Joint Edge Finishing', 'Waste Reduction: 14%', 'Central Cyclone Dust System'],
    },
  ];

  return (
    <div className="bg-surface-offwhite min-h-screen py-12 pb-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
            Turnkey Engineering Proven in the Field
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Factory Installations & Projects
          </h1>
          <p className="text-sm text-slate-600">
            A selection of state-of-the-art automated manufacturing lines commissioned across Bangladesh.
          </p>
        </div>

        {/* Projects Grid */}
        <div id="projects" className="grid grid-cols-1 md:grid-cols-3 gap-8 scroll-mt-28">
          {projects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-border overflow-hidden shadow-xs hover:border-industrial-orange/50 hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-charcoal-900 overflow-hidden">
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 right-3 text-[11px] font-bold bg-navy-950/80 text-white px-2.5 py-1 rounded-md">
                    {proj.completed}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-muted">
                    <MapPin className="w-3.5 h-3.5 text-industrial-orange" />
                    <span>{proj.location}</span>
                  </div>

                  <h3 className="font-bold text-base text-navy-900 leading-snug">{proj.title}</h3>
                  <p className="text-xs font-semibold text-industrial-orange">{proj.client}</p>

                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {proj.description}
                  </p>

                  <div className="pt-3 border-t border-slate-border space-y-1.5">
                    {proj.specs.map((sp, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-charcoal-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{sp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  to="/request-quote"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-surface-offwhite hover:bg-slate-light border border-slate-border text-navy-900 rounded-md text-xs font-semibold transition-colors"
                >
                  <span>Inquire for Similar Setup</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;

