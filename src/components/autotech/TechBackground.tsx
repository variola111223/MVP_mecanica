"use client";

export function TechBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-steel via-carbon-gray to-deep-steel" />
      
      {/* Carbon fiber texture */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          )`
        }}
      />
      
      {/* Tech grid */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Cyan glow spots */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-electric-cyan/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cobalt-blue/5 rounded-full blur-[100px]" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-electric-cyan/20" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-electric-cyan/20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-electric-cyan/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-electric-cyan/20" />
    </div>
  );
}
