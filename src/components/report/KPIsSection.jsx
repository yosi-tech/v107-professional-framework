import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function KPIsSection({ kpis, language }) {
  if (!kpis || kpis.length === 0) return null;

  const isHebrew = language === 'he';

  return (
    <Card className="mb-8 border-t-4 border-t-green-600">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-green-600" />
          {isHebrew ? 'מדדי ביצוע מוצעים (KPIs)' : 'Proposed KPIs'}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {isHebrew 
            ? 'מדדים מדידים למעקב אחר ההתקדמות שלך'
            : 'Measurable metrics to track your progress'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {kpis.map((kpi, index) => (
            <Card key={index} className="border-2 border-green-100 bg-gradient-to-br from-white to-green-50">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-2 leading-tight">
                      {kpi.metric}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600 font-medium">
                        {isHebrew ? 'יעד:' : 'Target:'}
                      </span>
                      <Badge className="bg-green-600 text-white">
                        {kpi.target}
                      </Badge>
                    </div>
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