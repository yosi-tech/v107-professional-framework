import React from "react";
import { Award } from "lucide-react";

export default function MemberCard({ userName, planName }) {
  return (
    <div className="mb-6">
      <div className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '1.6/1' }}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-[#FF8F00]/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#FF8F00]/5 rounded-full blur-2xl" />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#FF8F00] to-transparent opacity-60" />

        {/* Card content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6">
          
          {/* Top row: Logo + Badge */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tighter text-white">
                107<span className="text-[#FF8F00]">V</span>
              </span>
              <div className="h-5 w-[1px] bg-slate-600 mx-1" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-semibold">Member Card</span>
            </div>
            <div className="bg-[#FF8F00]/20 border border-[#FF8F00]/30 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#FF8F00]" />
              <span className="text-[10px] font-bold text-[#FF8F00] uppercase tracking-wider">PRO</span>
            </div>
          </div>

          {/* Middle: Plan name */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Plan</div>
            <div className="text-base font-bold text-white/90 leading-tight">
              {planName || 'V107 Professional'}
            </div>
          </div>

          {/* Bottom: Member info */}
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Member</div>
              <div className="text-sm font-semibold text-white/80">
                {userName || 'Full Name'}
              </div>
            </div>
            <div className="space-y-0.5 text-right">
              <div className="text-[10px] uppercase tracking-[0.15em] text-slate-500">Status</div>
              <div className="text-sm font-semibold text-[#FF8F00]">Active ✓</div>
            </div>
          </div>
        </div>

        {/* Bottom accent stripe */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF8F00] via-[#FF8F00]/60 to-transparent" />
      </div>
    </div>
  );
}