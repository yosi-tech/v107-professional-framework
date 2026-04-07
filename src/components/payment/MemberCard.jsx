import React from "react";

export default function MemberCard({ userName, planName }) {
  return (
    <div className="mb-6">
      <div className="relative w-full max-w-md h-56 mx-auto bg-[#F3F4F6] rounded-2xl p-8 shadow-sm flex flex-col justify-between overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#FF8F00]/5 rounded-full blur-3xl"></div>
        
        {/* Top row */}
        <div className="flex justify-between items-start relative z-10">
          <span className="text-[#FF8F00] font-bold tracking-widest text-lg">v107</span>
          <div className="w-12 h-8 bg-slate-300/50 rounded-md" />
        </div>

        {/* Middle & Bottom */}
        <div className="space-y-4 relative z-10">
          <div className="text-2xl font-mono text-slate-400 tracking-[0.25em]">
            ••••  ••••  ••••  ••••
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">CARD HOLDER</div>
              <div className="text-sm font-semibold text-slate-600 uppercase">
                {userName || 'FULL NAME'}
              </div>
            </div>
            <div className="space-y-0.5 text-right">
              <div className="text-[10px] uppercase tracking-wider text-slate-400">EXPIRES</div>
              <div className="text-sm font-semibold text-slate-600">MM/YY</div>
            </div>
          </div>
        </div>

        {/* Orange accent line */}
        <div className="absolute bottom-0 right-0 w-32 h-1 bg-[#FF8F00]"></div>
      </div>
    </div>
  );
}