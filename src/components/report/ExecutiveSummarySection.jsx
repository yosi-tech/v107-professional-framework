import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ExecutiveSummarySection({ executiveSummary, language }) {
  if (!executiveSummary) return null;

  const isHebrew = language === 'he';
  
  return (
    <Card className="mb-8 border-t-4 border-t-blue-600">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Target className="w-8 h-8 text-blue-600" />
          {isHebrew ? 'תקציר מנהלים' : 'Executive Summary'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* חוזקות */}
        {executiveSummary.top_strengths && executiveSummary.top_strengths.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              {isHebrew ? 'חוזקות מרכזיות' : 'Core Strengths'}
            </h3>
            <div className="space-y-3">
              {executiveSummary.top_strengths.map((strength, index) => (
                <div 
                  key={index} 
                  className="bg-green-50 border-r-4 border-green-500 p-4 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-600 text-white text-lg px-3 py-1 flex-shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-gray-800 leading-relaxed flex-1">{strength}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* מוקדי שיפור */}
        {executiveSummary.improvement_areas && executiveSummary.improvement_areas.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              {isHebrew ? 'מוקדי שיפור דחופים' : 'Urgent Improvement Areas'}
            </h3>
            <div className="space-y-3">
              {executiveSummary.improvement_areas.map((area, index) => (
                <div 
                  key={index} 
                  className="bg-orange-50 border-r-4 border-orange-500 p-4 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Badge className="bg-orange-600 text-white text-lg px-3 py-1 flex-shrink-0">
                      {index + 1}
                    </Badge>
                    <p className="text-gray-800 leading-relaxed flex-1">{area}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* מסקנה */}
        {executiveSummary.conclusion && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-3 text-blue-900">
              {isHebrew ? 'מסקנה' : 'Conclusion'}
            </h3>
            <p className="text-gray-800 leading-relaxed text-lg">
              {executiveSummary.conclusion}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}