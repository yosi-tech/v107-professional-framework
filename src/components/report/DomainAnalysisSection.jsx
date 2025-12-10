import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function DomainAnalysisSection({ domainAnalysis, domainScores, language }) {
  if (!domainAnalysis || Object.keys(domainAnalysis).length === 0) return null;

  const isHebrew = language === 'he';

  // Combine analysis with scores for better display
  const analysisEntries = Object.entries(domainAnalysis).map(([key, text]) => {
    const scoreData = domainScores && domainScores[key];
    return {
      domain: key,
      text,
      score: scoreData?.score || 0,
      band: scoreData?.band || 'mid',
      red_flag: scoreData?.red_flag || false,
      yellow_flag: scoreData?.yellow_flag || false
    };
  });

  const getBandColor = (entry) => {
    if (entry.red_flag) return 'border-red-500 bg-red-50';
    if (entry.yellow_flag) return 'border-amber-500 bg-amber-50';
    if (entry.band === 'high') return 'border-green-500 bg-green-50';
    if (entry.band === 'mid') return 'border-blue-500 bg-blue-50';
    return 'border-gray-500 bg-gray-50';
  };

  return (
    <Card className="mb-8 border-t-4 border-t-slate-600">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <FileText className="w-8 h-8 text-slate-600" />
          {isHebrew ? 'ניתוח מפורט לפי תחומים' : 'Detailed Domain Analysis'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {analysisEntries.map((entry, index) => (
            <Card 
              key={index} 
              className={`border-r-4 ${getBandColor(entry)}`}
            >
              <CardContent className="p-5">
                <h4 className="font-bold text-xl text-gray-900 mb-3">
                  {entry.domain}
                </h4>
                <p className="text-gray-700 leading-relaxed text-base">
                  {entry.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}