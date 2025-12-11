import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, TrendingUp, AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react";

export default function DomainAnalysisSection({ domainAnalysis, domainScores, language }) {
  if (!domainAnalysis || Object.keys(domainAnalysis).length === 0) return null;

  const isHebrew = language === 'he';

  // Combine analysis with scores for better display
  const analysisEntries = Object.entries(domainAnalysis).map(([key, text]) => {
    const scoreData = domainScores && domainScores[key];
    return {
      domain: key,
      domainName: scoreData?.name || key,
      text,
      score: scoreData?.score || 0,
      band: scoreData?.band || 'mid',
      red_flag: scoreData?.red_flag || false,
      yellow_flag: scoreData?.yellow_flag || false
    };
  });

  const getDomainIcon = (entry) => {
    if (entry.red_flag) return <AlertTriangle className="w-7 h-7" />;
    if (entry.yellow_flag) return <TrendingUp className="w-7 h-7" />;
    if (entry.band === 'high') return <CheckCircle2 className="w-7 h-7" />;
    return <BarChart3 className="w-7 h-7" />;
  };

  const getStatusBadge = (entry) => {
    if (entry.red_flag) {
      return <Badge className="bg-red-600 text-white text-sm px-4 py-1 shadow-md">🔴 {isHebrew ? 'דורש תשומת לב מיידית' : 'Requires Immediate Attention'}</Badge>;
    }
    if (entry.yellow_flag) {
      return <Badge className="bg-amber-600 text-white text-sm px-4 py-1 shadow-md">🟡 {isHebrew ? 'דורש שיפור' : 'Needs Improvement'}</Badge>;
    }
    if (entry.band === 'high') {
      return <Badge className="bg-green-600 text-white text-sm px-4 py-1 shadow-md">🟢 {isHebrew ? 'מצוין' : 'Excellent'}</Badge>;
    }
    return <Badge className="bg-blue-600 text-white text-sm px-4 py-1 shadow-md">⚪ {isHebrew ? 'ממוצע' : 'Average'}</Badge>;
  };

  // Split text into paragraphs for better readability
  const formatText = (text) => {
    if (!text) return [];
    
    // Split by double newlines first, then by single newlines, then by numbered lists
    const paragraphs = text
      .split(/\n\n+/)
      .flatMap(p => p.split(/\n(?=\d+\.|•|-)/).filter(s => s.trim()));
    
    return paragraphs.map(p => p.trim()).filter(p => p.length > 0);
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
          {isHebrew ? 'הבנה עמוקה של כל תחום ותחום עם ניתוח איכותי וכמותי' : 'Deep understanding of each domain with qualitative and quantitative analysis'}
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {analysisEntries.map((entry, index) => {
            const paragraphs = formatText(entry.text);
            
            return (
              <Card 
                key={index} 
                className={`border-2 shadow-xl hover:shadow-2xl transition-all overflow-hidden ${
                  entry.red_flag ? 'border-red-400 bg-gradient-to-br from-red-50 to-white' :
                  entry.yellow_flag ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-white' :
                  entry.band === 'high' ? 'border-green-400 bg-gradient-to-br from-green-50 to-white' :
                  'border-blue-400 bg-gradient-to-br from-blue-50 to-white'
                }`}
              >
                <CardHeader className={`pb-4 ${
                  entry.red_flag ? 'bg-gradient-to-r from-red-100 to-red-50' :
                  entry.yellow_flag ? 'bg-gradient-to-r from-amber-100 to-amber-50' :
                  entry.band === 'high' ? 'bg-gradient-to-r from-green-100 to-green-50' :
                  'bg-gradient-to-r from-blue-100 to-blue-50'
                }`}>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0 ${
                        entry.red_flag ? 'bg-gradient-to-br from-red-500 to-red-600' :
                        entry.yellow_flag ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                        entry.band === 'high' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                        'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        {getDomainIcon(entry)}
                      </div>
                      <div>
                        <h4 className="font-black text-2xl text-gray-900 mb-2">
                          {entry.domainName}
                        </h4>
                        <div className="flex items-center gap-3 flex-wrap">
                          {getStatusBadge(entry)}
                          <Badge variant="outline" className="text-lg px-4 py-1 font-bold">
                            {entry.score}/100
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 bg-white">
                  <div className="space-y-4">
                    {paragraphs.map((paragraph, pIndex) => {
                      // Check if it's a list item
                      const isListItem = /^(\d+\.|•|-)\s/.test(paragraph);
                      
                      if (isListItem) {
                        return (
                          <div key={pIndex} className="flex items-start gap-3 pr-4">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              entry.red_flag ? 'bg-red-500' :
                              entry.yellow_flag ? 'bg-amber-500' :
                              entry.band === 'high' ? 'bg-green-500' :
                              'bg-blue-500'
                            }`}></div>
                            <p className="text-gray-700 leading-relaxed text-lg flex-1">
                              {paragraph.replace(/^(\d+\.|•|-)\s*/, '')}
                            </p>
                          </div>
                        );
                      }
                      
                      return (
                        <p key={pIndex} className="text-gray-700 leading-relaxed text-lg">
                          {paragraph}
                        </p>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}