import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function KPIsSection({ kpis, language }) {
  if (!kpis || kpis.length === 0) return null;

  const isHebrew = language === 'he';

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-green-50">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7" />
          </div>
          {isHebrew ? '📈 מדדי ביצוע מוצעים (KPIs)' : '📈 Proposed KPIs'}
        </CardTitle>
        <p className="text-white/90 mt-2 text-lg">
          {isHebrew 
            ? 'מדדים מדידים למעקב אחר ההתקדמות שלך'
            : 'Measurable metrics to track your progress'
          }
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-6">
          {kpis.map((kpi, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-2xl transition-all hover:scale-[1.02] bg-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-3 leading-tight text-lg">
                      {kpi.metric}
                    </h4>
                    <div className="bg-green-50 rounded-lg p-3 border-2 border-green-200">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700 font-semibold">
                          {isHebrew ? 'יעד:' : 'Target:'}
                        </span>
                      </div>
                      <p className="text-green-900 font-black text-lg mt-1">
                        {kpi.target}
                      </p>
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