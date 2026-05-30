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
    <div className="flex flex-wrap justify-center gap-5 mt-8">
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-2 text-muted-foreground text-sm">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
            <b.icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{b.label}</span>
        </div>
      ))}
    </div>
  );
}