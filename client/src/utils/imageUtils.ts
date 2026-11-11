import React from 'react';

// Production-ready SVG Data URI - guarantees high quality industrial branding even offline or behind firewalls
export const FALLBACK_MACHINERY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" fill="%23101D2C"><rect width="800" height="600" fill="%23101D2C"/><rect x="20" y="20" width="760" height="560" rx="12" fill="%231a293b" stroke="%23334155" stroke-width="2"/><circle cx="400" cy="270" r="110" stroke="%23F28C28" stroke-width="3" stroke-dasharray="8 6" fill="%23202A35"/><polygon points="400,200 470,320 330,320" stroke="%23F28C28" stroke-width="2.5" fill="none"/><circle cx="400" cy="270" r="30" fill="%23F28C28" opacity="0.8"/><text x="400" y="440" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="%23FFFFFF" text-anchor="middle" letter-spacing="2">WOODTECH MACHINERY</text><text x="400" y="475" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="%23F28C28" text-anchor="middle" letter-spacing="1.5">INDUSTRIAL CNC &amp; WOODWORKING SYSTEMS</text><line x1="280" y1="505" x2="520" y2="505" stroke="%23F28C28" stroke-width="2" stroke-linecap="round"/></svg>`;

// Crisp Clean Isolated Machine Illustrations (Green & White WTS Signature Style)
export const CNC_ROUTER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<rect x="70" y="220" width="460" height="90" rx="6" fill="%23F8FAFC" stroke="%23E2E8F0" stroke-width="4"/>
<rect x="70" y="240" width="460" height="14" fill="%2322C55E"/>
<line x1="100" y1="220" x2="100" y2="310" stroke="%23CBD5E1" stroke-width="3" stroke-dasharray="8 8"/>
<line x1="200" y1="220" x2="200" y2="310" stroke="%23CBD5E1" stroke-width="3" stroke-dasharray="8 8"/>
<line x1="300" y1="220" x2="300" y2="310" stroke="%23CBD5E1" stroke-width="3" stroke-dasharray="8 8"/>
<line x1="400" y1="220" x2="400" y2="310" stroke="%23CBD5E1" stroke-width="3" stroke-dasharray="8 8"/>
<line x1="500" y1="220" x2="500" y2="310" stroke="%23CBD5E1" stroke-width="3" stroke-dasharray="8 8"/>
<!-- Legs -->
<rect x="90" y="310" width="30" height="45" fill="%231E293B" rx="3"/>
<rect x="480" y="310" width="30" height="45" fill="%231E293B" rx="3"/>
<rect x="285" y="310" width="30" height="45" fill="%231E293B" rx="3"/>
<!-- Gantry Columns -->
<rect x="230" y="90" width="140" height="135" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4" rx="4"/>
<rect x="245" y="105" width="110" height="18" fill="%2322C55E" rx="2"/>
<text x="300" y="118" font-family="system-ui, sans-serif" font-size="11" font-weight="900" fill="%23FFFFFF" text-anchor="middle">WTS CNC</text>
<!-- Z-Axis Spindle Head -->
<rect x="270" y="130" width="60" height="85" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="3" rx="3"/>
<rect x="285" y="215" width="30" height="25" fill="%230F172A"/>
<polygon points="295,240 305,240 300,265" fill="%23F59E0B"/>
<!-- Cable Carrier Chain -->
<path d="M 120 280 Q 90 260 120 240 L 230 240" stroke="%231E293B" stroke-width="8" fill="none" stroke-linecap="round"/>
<!-- Safety light tower -->
<circle cx="245" cy="75" r="4" fill="%23EF4444"/>
<circle cx="245" cy="65" r="4" fill="%23F59E0B"/>
<circle cx="245" cy="55" r="4" fill="%2322C55E"/>
<line x1="245" y1="79" x2="245" y2="90" stroke="%2364748B" stroke-width="2"/>
</svg>`;

export const SURFACE_PLANER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Planer Bed (Long) -->
<polygon points="80,180 520,180 500,205 100,205" fill="%2322C55E" stroke="%2316A34A" stroke-width="3"/>
<rect x="120" y="205" width="360" height="120" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4" rx="4"/>
<!-- Base Accent -->
<rect x="120" y="240" width="360" height="12" fill="%2322C55E"/>
<!-- Stand feet -->
<rect x="140" y="325" width="40" height="25" fill="%231E293B" rx="3"/>
<rect x="420" y="325" width="40" height="25" fill="%231E293B" rx="3"/>
<!-- Fence & Guard -->
<rect x="240" y="145" width="120" height="35" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="3" rx="2"/>
<rect x="250" y="130" width="100" height="15" fill="%23F59E0B" rx="2"/>
<text x="300" y="280" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="%231E293B" text-anchor="middle">WTS SP-500H</text>
</svg>`;

export const THICKNESS_PLANER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Upright Machine Body -->
<rect x="180" y="90" width="240" height="240" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4" rx="8"/>
<!-- Hood with Green Accent -->
<polygon points="250,50 350,50 380,90 220,90" fill="%2322C55E" stroke="%2316A34A" stroke-width="2"/>
<rect x="285" y="30" width="30" height="20" fill="%231E293B"/>
<!-- Feed Table Opening -->
<rect x="210" y="170" width="180" height="70" fill="%230F172A" rx="4"/>
<rect x="170" y="220" width="260" height="16" fill="%2394A3B8" stroke="%2364748B" stroke-width="2"/>
<!-- Hand Wheel -->
<circle cx="395" cy="190" r="22" stroke="%231E293B" stroke-width="5" fill="%23F1F5F9"/>
<line x1="395" y1="168" x2="395" y2="212" stroke="%231E293B" stroke-width="4"/>
<line x1="373" y1="190" x2="417" y2="190" stroke="%231E293B" stroke-width="4"/>
<!-- Base Plate -->
<rect x="170" y="330" width="260" height="25" fill="%231E293B" rx="3"/>
<rect x="200" y="260" width="200" height="45" fill="%23F8FAFC" stroke="%23E2E8F0" stroke-width="2"/>
<rect x="200" y="275" width="200" height="8" fill="%2322C55E"/>
<text x="300" y="300" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="%231E293B" text-anchor="middle">WTS TP-400B</text>
</svg>`;

export const SPINDLE_SHAPER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Cast Iron Table Top -->
<polygon points="120,165 480,165 450,195 150,195" fill="%2322C55E" stroke="%2316A34A" stroke-width="3"/>
<!-- Shaper Fence Hood -->
<rect x="230" y="105" width="140" height="60" fill="%23FFFFFF" stroke="%2394A3B8" stroke-width="3" rx="4"/>
<rect x="245" y="90" width="110" height="15" fill="%23F59E0B" rx="2"/>
<circle cx="300" cy="140" r="12" fill="%231E293B"/>
<!-- Stand Cabinet -->
<rect x="170" y="195" width="260" height="135" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4" rx="4"/>
<rect x="170" y="230" width="260" height="12" fill="%2322C55E"/>
<!-- Control Switch & Hand Wheel -->
<rect x="200" y="255" width="30" height="40" fill="%230F172A" rx="3"/>
<circle cx="215" cy="270" r="5" fill="%2322C55E"/>
<circle cx="215" cy="285" r="5" fill="%23EF4444"/>
<circle cx="370" cy="275" r="18" stroke="%231E293B" stroke-width="4" fill="%23F1F5F9"/>
<!-- Feet -->
<rect x="180" y="330" width="40" height="20" fill="%231E293B" rx="3"/>
<rect x="380" y="330" width="40" height="20" fill="%231E293B" rx="3"/>
<text x="300" y="300" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="%231E293B" text-anchor="middle">WTS SM-100</text>
</svg>`;

export const CIRCULAR_SAW_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Sliding Table Arm (Angle) -->
<polygon points="90,285 240,210 260,225 110,300" fill="%2322C55E" stroke="%2316A34A" stroke-width="3"/>
<!-- Main Table Top -->
<polygon points="180,180 510,180 480,210 210,210" fill="%2322C55E" stroke="%2316A34A" stroke-width="3"/>
<!-- Saw Blade Guard (Orange) -->
<path d="M 330 180 Q 345 130 365 130 L 365 180 Z" fill="%23EF4444" stroke="%23DC2626" stroke-width="2"/>
<!-- Machine Body Cabinet -->
<rect x="210" y="210" width="270" height="120" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4" rx="4"/>
<rect x="210" y="240" width="270" height="12" fill="%2322C55E"/>
<!-- Tilt Handwheel -->
<circle cx="345" cy="285" r="20" stroke="%231E293B" stroke-width="4" fill="%23F1F5F9"/>
<!-- Cabinet Base -->
<rect x="220" y="330" width="50" height="20" fill="%231E293B" rx="3"/>
<rect x="410" y="330" width="50" height="20" fill="%231E293B" rx="3"/>
<text x="345" y="260" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="%231E293B" text-anchor="middle">WTS CIRCULAR SAW</text>
</svg>`;

export const EDGE_BANDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Edgebander Long Chassis -->
<rect x="80" y="190" width="440" height="130" rx="8" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/>
<rect x="80" y="220" width="440" height="16" fill="%2322C55E"/>
<!-- Top Acrylic Sound Enclosure Hood -->
<rect x="130" y="130" width="340" height="60" rx="4" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="3"/>
<line x1="200" y1="130" x2="200" y2="190" stroke="%23CBD5E1" stroke-width="2"/>
<line x1="280" y1="130" x2="280" y2="190" stroke="%23CBD5E1" stroke-width="2"/>
<line x1="360" y1="130" x2="360" y2="190" stroke="%23CBD5E1" stroke-width="2"/>
<!-- Tape Reel Disc on Left -->
<circle cx="115" cy="140" r="32" fill="%23F8FAFC" stroke="%231E293B" stroke-width="4"/>
<circle cx="115" cy="140" r="16" fill="%23F59E0B"/>
<!-- Touchscreen Console -->
<rect x="420" y="90" width="45" height="35" rx="3" fill="%230F172A" stroke="%2322C55E" stroke-width="2"/>
<line x1="442" y1="125" x2="442" y2="140" stroke="%2364748B" stroke-width="4"/>
<!-- Machine Feet -->
<rect x="110" y="320" width="40" height="25" rx="3" fill="%231E293B"/>
<rect x="280" y="320" width="40" height="25" rx="3" fill="%231E293B"/>
<rect x="450" y="320" width="40" height="25" rx="3" fill="%231E293B"/>
<text x="300" y="275" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="%231E293B" text-anchor="middle">WTS EDGE-BAND</text>
</svg>`;

export const PANEL_SAW_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Sliding Table Beam -->
<rect x="60" y="200" width="220" height="35" rx="4" fill="%23E2E8F0" stroke="%2394A3B8" stroke-width="3"/>
<rect x="60" y="210" width="220" height="8" fill="%2322C55E"/>
<!-- Fixed Cast Iron Table -->
<rect x="280" y="200" width="250" height="35" rx="4" fill="%23CBD5E1" stroke="%2394A3B8" stroke-width="3"/>
<!-- Overhead Suction Guard & Hood -->
<path d="M 330 200 L 330 110 L 410 110 L 410 160" stroke="%23F59E0B" stroke-width="6" fill="none" stroke-linecap="round"/>
<rect x="305" y="160" width="50" height="35" rx="4" fill="%23EF4444"/>
<!-- Machine Base Cabinet -->
<rect x="180" y="235" width="280" height="105" rx="6" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/>
<rect x="180" y="260" width="280" height="14" fill="%2322C55E"/>
<!-- Crosscut Fence & Mitre Stop -->
<line x1="80" y1="160" x2="250" y2="200" stroke="%231E293B" stroke-width="5" stroke-linecap="round"/>
<!-- Base Feet -->
<rect x="200" y="340" width="40" height="20" rx="3" fill="%231E293B"/>
<rect x="400" y="340" width="40" height="20" rx="3" fill="%231E293B"/>
<text x="320" y="305" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="%231E293B" text-anchor="middle">WTS PANEL SAW</text>
</svg>`;

export const BORING_MACHINE_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- CNC Boring Gantry Frame -->
<rect x="140" y="90" width="320" height="130" rx="6" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/>
<rect x="140" y="115" width="320" height="16" fill="%2322C55E"/>
<!-- Vertical Drill Bank Head -->
<rect x="250" y="130" width="100" height="60" rx="4" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="3"/>
<line x1="265" y1="190" x2="265" y2="215" stroke="%231E293B" stroke-width="4"/>
<line x1="285" y1="190" x2="285" y2="215" stroke="%231E293B" stroke-width="4"/>
<line x1="305" y1="190" x2="305" y2="215" stroke="%231E293B" stroke-width="4"/>
<line x1="325" y1="190" x2="325" y2="215" stroke="%231E293B" stroke-width="4"/>
<!-- Infeed Air Floating Table -->
<rect x="90" y="220" width="420" height="85" rx="6" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/>
<circle cx="150" cy="250" r="5" fill="%2394A3B8"/>
<circle cx="210" cy="250" r="5" fill="%2394A3B8"/>
<circle cx="390" cy="250" r="5" fill="%2394A3B8"/>
<circle cx="450" cy="250" r="5" fill="%2394A3B8"/>
<!-- Legs -->
<rect x="120" y="305" width="40" height="35" rx="3" fill="%231E293B"/>
<rect x="440" y="305" width="40" height="35" rx="3" fill="%231E293B"/>
<text x="300" y="275" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="%231E293B" text-anchor="middle">WTS CNC BORING</text>
</svg>`;

export const WIDE_BELT_SANDER_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Upright Sander Cabinet -->
<rect x="170" y="70" width="260" height="260" rx="10" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/>
<rect x="170" y="105" width="260" height="16" fill="%2322C55E"/>
<!-- Top Sanding Belt Roller Windows -->
<rect x="200" y="130" width="95" height="100" rx="6" fill="%23F8FAFC" stroke="%23CBD5E1" stroke-width="3"/>
<circle cx="247" cy="155" r="14" fill="%231E293B"/>
<circle cx="247" cy="205" r="14" fill="%23F59E0B"/>
<rect x="305" y="130" width="95" height="100" rx="6" fill="%23F8FAFC" stroke="%23CBD5E1" stroke-width="3"/>
<circle cx="352" cy="155" r="14" fill="%231E293B"/>
<circle cx="352" cy="205" r="14" fill="%23F59E0B"/>
<!-- Conveyor Infeed Bed -->
<rect x="140" y="240" width="320" height="35" rx="4" fill="%231E293B"/>
<rect x="150" y="248" width="300" height="18" fill="%2364748B" rx="2"/>
<!-- Base Plinth -->
<rect x="160" y="330" width="280" height="25" rx="3" fill="%231E293B"/>
<text x="300" y="305" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="%231E293B" text-anchor="middle">WTS BELT SANDER</text>
</svg>`;

export const HYDRAULIC_PRESS_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Four Heavy Steel Columns -->
<rect x="150" y="60" width="25" height="280" rx="4" fill="%2364748B"/>
<rect x="425" y="60" width="25" height="280" rx="4" fill="%2364748B"/>
<!-- Top Hydraulic Cylinder Crossbeam -->
<rect x="130" y="60" width="340" height="45" rx="6" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/>
<rect x="130" y="80" width="340" height="12" fill="%2322C55E"/>
<!-- Dual Hydraulic Piston Rams -->
<rect x="230" y="105" width="35" height="45" fill="%2394A3B8"/>
<rect x="335" y="105" width="35" height="45" fill="%2394A3B8"/>
<!-- Upper Moving Platen -->
<rect x="170" y="150" width="260" height="30" rx="4" fill="%231E293B"/>
<!-- Lower Pressing Platen -->
<rect x="170" y="240" width="260" height="35" rx="4" fill="%231E293B"/>
<line x1="170" y1="257" x2="430" y2="257" stroke="%23F59E0B" stroke-width="3"/>
<!-- Bottom Solid Base Bed -->
<rect x="130" y="275" width="340" height="65" rx="6" fill="%23FFFFFF" stroke="%23E2E8F0" stroke-width="4"/>
<rect x="130" y="300" width="340" height="12" fill="%2322C55E"/>
<text x="300" y="325" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="%231E293B" text-anchor="middle">WTS HOT PRESS</text>
</svg>`;

export const DUST_EXTRACTION_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Motor & Blower Impeller Housing -->
<circle cx="300" cy="90" r="38" fill="%2322C55E" stroke="%2316A34A" stroke-width="4"/>
<rect x="270" y="70" width="60" height="40" fill="%230F172A" rx="4"/>
<!-- Top Filter Bags -->
<rect x="180" y="125" width="105" height="110" rx="6" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="3"/>
<line x1="200" y1="125" x2="200" y2="235" stroke="%23CBD5E1" stroke-width="2"/>
<line x1="230" y1="125" x2="230" y2="235" stroke="%23CBD5E1" stroke-width="2"/>
<line x1="260" y1="125" x2="260" y2="235" stroke="%23CBD5E1" stroke-width="2"/>
<rect x="315" y="125" width="105" height="110" rx="6" fill="%23F1F5F9" stroke="%2394A3B8" stroke-width="3"/>
<line x1="335" y1="125" x2="335" y2="235" stroke="%23CBD5E1" stroke-width="2"/>
<line x1="365" y1="125" x2="365" y2="235" stroke="%23CBD5E1" stroke-width="2"/>
<line x1="395" y1="125" x2="395" y2="235" stroke="%23CBD5E1" stroke-width="2"/>
<!-- Lower Collection Waste Drums -->
<rect x="180" y="245" width="105" height="85" rx="6" fill="%231E293B"/>
<rect x="315" y="245" width="105" height="85" rx="6" fill="%231E293B"/>
<!-- Duct Inlets -->
<path d="M 220 90 L 150 90 L 150 140" stroke="%2364748B" stroke-width="10" fill="none" stroke-linecap="round"/>
<rect x="160" y="335" width="280" height="15" rx="3" fill="%2322C55E"/>
<text x="300" y="310" font-family="system-ui, sans-serif" font-size="12" font-weight="900" fill="%23FFFFFF" text-anchor="middle">WTS DUST COLLECTOR</text>
</svg>`;

export const DIAMOND_TOOLING_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- Diamond Saw Blade Circle -->
<circle cx="240" cy="200" r="95" fill="%23E2E8F0" stroke="%2364748B" stroke-width="6"/>
<circle cx="240" cy="200" r="30" fill="%23FFFFFF" stroke="%231E293B" stroke-width="4"/>
<!-- Laser Expansion Slots -->
<line x1="240" y1="125" x2="240" y2="155" stroke="%230F172A" stroke-width="3"/>
<line x1="240" y1="245" x2="240" y2="275" stroke="%230F172A" stroke-width="3"/>
<line x1="165" y1="200" x2="195" y2="200" stroke="%230F172A" stroke-width="3"/>
<line x1="285" y1="200" x2="315" y2="200" stroke="%230F172A" stroke-width="3"/>
<!-- Carbide / PCD Teeth Around Edge -->
<circle cx="240" cy="100" r="5" fill="%23F59E0B"/>
<circle cx="340" cy="200" r="5" fill="%23F59E0B"/>
<circle cx="240" cy="300" r="5" fill="%23F59E0B"/>
<circle cx="140" cy="200" r="5" fill="%23F59E0B"/>
<!-- Spiral Cutter Head Cylinder on Right -->
<rect x="360" y="120" width="85" height="160" rx="8" fill="%231E293B" stroke="%2322C55E" stroke-width="4"/>
<line x1="380" y1="140" x2="425" y2="160" stroke="%23F59E0B" stroke-width="4"/>
<line x1="380" y1="180" x2="425" y2="200" stroke="%23F59E0B" stroke-width="4"/>
<line x1="380" y1="220" x2="425" y2="240" stroke="%23F59E0B" stroke-width="4"/>
<text x="300" y="340" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="%231E293B" text-anchor="middle">WTS PCD TOOLS &amp; CUTTERS</text>
</svg>`;

export const ALL_MACHINERY_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
<rect width="600" height="400" fill="%23FFFFFF"/>
<!-- High Tech Industry Hub Icon -->
<circle cx="300" cy="200" r="95" fill="%23F8FAFC" stroke="%23E2E8F0" stroke-width="6"/>
<!-- Central Precision Gear -->
<circle cx="300" cy="200" r="50" fill="%2322C55E" stroke="%2316A34A" stroke-width="4"/>
<circle cx="300" cy="200" r="22" fill="%23FFFFFF"/>
<!-- Satellite Industrial Hubs -->
<circle cx="205" cy="150" r="24" fill="%230F172A"/>
<circle cx="395" cy="150" r="24" fill="%230F172A"/>
<circle cx="205" cy="250" r="24" fill="%23F59E0B"/>
<circle cx="395" cy="250" r="24" fill="%23F59E0B"/>
<line x1="225" y1="165" x2="265" y2="185" stroke="%2394A3B8" stroke-width="3"/>
<line x1="375" y1="165" x2="335" y2="185" stroke="%2394A3B8" stroke-width="3"/>
<line x1="225" y1="235" x2="265" y2="215" stroke="%2394A3B8" stroke-width="3"/>
<line x1="375" y1="235" x2="335" y2="215" stroke="%2394A3B8" stroke-width="3"/>
<text x="300" y="340" font-family="system-ui, sans-serif" font-size="13" font-weight="900" fill="%231E293B" text-anchor="middle">ALL MACHINERY (30+ LINES)</text>
</svg>`;

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied) return;
  img.dataset.fallbackApplied = 'true';
  img.src = FALLBACK_MACHINERY_SVG;
};
