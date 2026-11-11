import React from 'react';
import { Factory, Wrench, Cpu, ShieldCheck, ArrowRight, Settings, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      id: 'layout',
      title: 'Factory Layout & Workflow Engineering',
      icon: <Factory className="w-8 h-8 text-industrial-orange" />,
      description:
        'Complete 2D/3D plant layout design optimizing board movement between raw storage, CNC nesting, edgebanding, drilling, sanding, and assembly lines to eliminate material handling bottlenecks.',
      points: [
        'CAD plant layout with optimized forklift & conveyor corridors',
        'Pneumatic compressed air pipe sizing and pressure drop calculations',
        'Electrical transformer, voltage stabilizer & cable tray planning',
      ],
    },
    {
      id: 'commissioning',
      title: 'Machinery Installation & Optical Alignment',
      icon: <Wrench className="w-8 h-8 text-industrial-orange" />,
      description:
        'Turnkey mechanical and electrical erection by certified factory engineers. Complete optical leveling, squareness verification with dial gauges, and rigorous 72-hour trial cutting runs.',
      points: [
        'Vibration dampening and reinforced anchor foundation verification',
        'Precision guide rail squareness & gantry perpendicularity testing',
        'Safety interlocking, emergency cord and limit switch certification',
      ],
    },
    {
      id: 'training',
      title: 'CNC CAM Software & Operator Training',
      icon: <Cpu className="w-8 h-8 text-industrial-orange" />,
      description:
        'Empower your machine operators and production designers. Comprehensive hands-on instruction covering CAD to CAM post-processing, automatic toolpath nesting, and feed rate optimization.',
      points: [
        'Syntec, Siemens, and OSAI control interface mastery',
        'Tool library management, tooling wear compensation and collet care',
        'Preventive daily maintenance checklists and lubrication schedules',
      ],
    },
    {
      id: 'maintenance',
      title: 'Annual Maintenance Contracts (AMC) & Genuine Spares',
      icon: <Settings className="w-8 h-8 text-industrial-orange" />,
      description:
        'Prevent costly factory shutdowns with periodic scheduled inspections, spindle vibration diagnostics, inverter parameter checks, and immediate local spare parts dispatch.',
      points: [
        'Large Dhaka stock of original Italian/German spindles, inverters, and belts',
        'Diamond pre-milling cutters, scoring blades, and PCD nesting bits',
        '24/7 dedicated breakdown helpline with guaranteed engineer dispatch',
      ],
    },
  ];

  return (
    <div className="bg-surface-offwhite min-h-screen py-12 pb-24 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-industrial-orange">
            Comprehensive Technical Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
            Industrial Services & Engineering Solutions
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            From greenfield factory planning to operator instruction and spare parts supply,
            our engineering division supports your production machinery throughout its operational lifespan.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-xl border border-slate-border p-8 shadow-xs hover:border-industrial-orange/50 hover:shadow-card-hover transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-surface-offwhite border border-slate-border rounded-lg w-fit">
                  {srv.icon}
                </div>
                <h3 className="text-xl font-bold text-navy-900">{srv.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{srv.description}</p>
                <div className="pt-2 space-y-2">
                  {srv.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-charcoal-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-border">
                <Link
                  to="/request-quote"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-industrial-orange hover:text-industrial-orange-hover uppercase tracking-wider"
                >
                  <span>Request Service Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="bg-navy-950 text-white rounded-2xl p-8 sm:p-12 border border-navy-800 text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Need Onsite Engineering Assistance?</h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Contact our engineering desk directly for machine diagnostics, tooling recommendations, or layout planning.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="px-6 py-3 bg-industrial-orange hover:bg-industrial-orange-hover text-white text-xs font-semibold rounded-md shadow-md"
            >
              Contact Engineering Team
            </Link>
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 bg-navy-800 hover:bg-navy-700 text-slate-200 text-xs font-medium rounded-md border border-navy-700"
            >
              Instant WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;

