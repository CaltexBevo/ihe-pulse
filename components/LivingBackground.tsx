'use client';

export default function LivingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-[#0d0d1a] to-dark" />

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/4 -left-32 h-96 w-96 rounded-full opacity-20 blur-[100px] animate-float"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }}
      />
      <div
        className="absolute top-2/3 -right-32 h-96 w-96 rounded-full opacity-15 blur-[100px] animate-float"
        style={{
          background: 'radial-gradient(circle, #c850c0, transparent)',
          animationDelay: '-3s',
        }}
      />
      <div
        className="absolute -bottom-16 left-1/3 h-64 w-64 rounded-full opacity-10 blur-[80px] animate-float"
        style={{
          background: 'radial-gradient(circle, #00d4ff, transparent)',
          animationDelay: '-1.5s',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjciIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIxIi8+PC9zdmc+')]" />
    </div>
  );
}
