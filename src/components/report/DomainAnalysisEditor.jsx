import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save, X } from "lucide-react";

export default function DomainAnalysisEditor({ data, domainScores, onSave, onCancel }) {
  const [analysis, setAnalysis] = useState(data || {});

  // Get domains from domainScores
  const domains = domainScores ? Object.keys(domainScores) : [];

  const updateAnalysis = (domain, value) => {
    setAnalysis({ ...analysis, [domain]: value });
  };

  const getDomainColor = (domain) => {
    if (!domainScores || !domainScores[domain]) return 'blue';
    const { red_flag, yellow_flag, band } = domainScores[domain];
    if (red_flag) return 'red';
    if (yellow_flag) return 'orange';
    if (band === 'high') return 'green';
    return 'blue';
  };

  const getColorClass = (color) => {
    const classes = {
      red: 'bg-red-50 border-red-200',
      orange: 'bg-orange-50 border-orange-200',
      green: 'bg-green-50 border-green-200',
      blue: 'bg-blue-50 border-blue-200'
    };
    return classes[color] || 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-4">
      {domains.map((domain) => {
        const color = getDomainColor(domain);
        const domainName = domainScores[domain]?.name || domain;
        
        return (
          <Card key={domain} className={`p-4 ${getColorClass(color)}`}>
            <Label className="text-lg font-semibold mb-3 block">{domainName}</Label>
            <Textarea
              value={analysis[domain] || ''}
              onChange={(e) => updateAnalysis(domain, e.target.value)}
              placeholder={`ניתוח מפורט עבור ${domainName}...`}
              className="min-h-[120px] text-right bg-white"
              dir="rtl"
            />
          </Card>
        );
      })}

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={() => onSave(analysis)} className="flex items-center gap-2">
          <Save className="w-4 h-4 ml-2" />
          שמור
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="w-4 h-4 ml-2" />
          ביטול
        </Button>
      </div>
    </div>
  );
}