import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExecutiveSummarySection({ executiveSummary, language }) {
  if (!executiveSummary) return null;

  const isHebrew = language === 'he';
  
  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-blue-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Target className="w-7 h-7" />
          </div>
          {isHebrew ? 'תקציר מנהלים' : 'Executive Summary'}
        </CardTitle>
        <p className="text-white/90 mt-2">
          {isHebrew ? 'הנקודות המרכזיות מהניתוח שלך' : 'Key Points from Your Analysis'}
        </p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* חוזקות */}
        {executiveSummary.top_strengths && executiveSummary.top_strengths.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                {isHebrew ? '💪 חוזקות מרכזיות' : '💪 Core Strengths'}
              </h3>
            </div>
            <div className="space-y-4">
              {executiveSummary.top_strengths.map((strength, index) => (
                <div 
                  key={index} 
                  className="bg-white border-2 border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 leading-relaxed flex-1 text-lg">{strength}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* מוקדי שיפור */}
        {executiveSummary.improvement_areas && executiveSummary.improvement_areas.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">
                {isHebrew ? '🎯 מוקדי שיפור דחופים' : '🎯 Urgent Improvement Areas'}
              </h3>
            </div>
            <div className="space-y-4">
              {executiveSummary.improvement_areas.map((area, index) => (
                <div 
                  key={index} 
                  className="bg-white border-2 border-orange-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-800 leading-relaxed flex-1 text-lg">{area}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* מסקנה */}
        {executiveSummary.conclusion && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-5"></div>
            <Card className="border-2 border-blue-300 shadow-xl">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl flex-shrink-0">
                    💡
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {isHebrew ? 'המסקנה שלנו' : 'Our Conclusion'}
                    </h3>
                    <p className="text-gray-800 leading-relaxed text-xl font-medium">
                      {executiveSummary.conclusion}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}