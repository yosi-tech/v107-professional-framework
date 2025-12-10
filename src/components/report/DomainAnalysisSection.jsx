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
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-gray-50">
      <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-800 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <FileText className="w-7 h-7" />
          </div>
          {isHebrew ? '📝 ניתוח מפורט לפי תחומים' : '📝 Detailed Domain Analysis'}
        </CardTitle>
        <p className="text-white/90 mt-2 text-lg">
          {isHebrew ? 'הבנה עמוקה של כל תחום ותחום' : 'Deep understanding of each domain'}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-5">
          {analysisEntries.map((entry, index) => (
            <Card 
              key={index} 
              className="border-none shadow-lg hover:shadow-xl transition-all bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg flex-shrink-0 ${
                    entry.red_flag ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    entry.yellow_flag ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                    entry.band === 'high' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-2xl text-gray-900 mb-4">
                      {entry.domain}
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {entry.text}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}