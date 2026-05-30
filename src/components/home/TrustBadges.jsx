import React from "react";
import { ShieldCheck, Headphones, Award, Lock } from "lucide-react";

const badges = [
  { icon: Lock, label: "תשלום מאובטח" },
  { icon: ShieldCheck, label: "פרטיות מלאה" },
  { icon: Headphones, label: "שירות לקוחות זמין" },
  { icon: Award, label: "שביעות רצון מובטחת" },
];

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 mt-8">
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-500 text-sm">
          <b.icon className="w-5 h-5 text-[#FF8F00]" />
          <span className="font-medium">{b.label}</span>
        </div>
      ))}
    </div>
  );
}