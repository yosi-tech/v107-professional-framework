import React from "react";

export default function MemberCard({ userName, planName }) {
  return (
    <div className="mb-10">
      <div className="relative w-full max-w-md h-56 mx-auto bg-secondary rounded-3xl p-8 shadow-sm flex flex-col justify-between overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

        {/* Top row */}
        <div className="flex justify-between items-start relative z-10">
          <span className="text-slate-400 font-bold tracking-widest text-lg">v107 AI</span>
        </div>

        {/* Middle & Bottom */}
        <div className="space-y-4 relative z-10">
          <div className="text-2xl font-mono text-slate-400 tracking-widest"></div>
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-tighter text-slate-400">Name</div>
              <div className="text-sm font-semibold text-slate-600">
                {userName || 'FULL NAME'}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-tighter text-slate-400">Plan</div>
              <div className="text-sm font-semibold text-slate-600">
                {planName || 'V107 Professional'}
              </div>
            </div>
          </div>
        </div>

        {/* Orange accent line */}
        <div className="absolute bottom-0 right-0 w-32 h-1 bg-primary" />
      </div>
    </div>
  );
}