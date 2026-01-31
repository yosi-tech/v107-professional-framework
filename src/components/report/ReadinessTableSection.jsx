import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, Target } from "lucide-react";

export default function ReadinessTableSection({ domainScores, language }) {
  if (!domainScores || Object.keys(domainScores).length === 0) return null;

  const isHebrew = language === 'he';

  // Convert domain scores to readiness format
  const readinessData = Object.entries(domainScores)
    .sort((a, b) => b[1].score - a[1].score) // Sort by score descending
    .map(([key, data]) => {
      let readinessLevel = isHebrew ? 'ממוצע' : 'Average';
      let status = 'yellow';
      const score = data.score;
      
      // Determine band based on score thresholds (Top 10% / Top 50% / Bottom 30%)
      // Assuming score > 80 is roughly Top 10%
      // Assuming 60 < score <= 80 is Average/Top 50%
      // Assuming score <= 60 is Low/Bottom 30%
      
      if (score >= 80) {
        readinessLevel = isHebrew ? 'גבוה' : 'High'; // Was 'מעולה'
        status = 'green';
      } else if (score >= 60) {
        readinessLevel = isHebrew ? 'ממוצע' : 'Average';
        status = 'yellow';
      } else {
        readinessLevel = isHebrew ? 'נמוך' : 'Low'; // Was 'טעון שיפור'
        status = 'red';
      }

      return {
        domain: isHebrew ? (data.nameHe || key) : (data.nameEn || key),
        readiness: readinessLevel,
        status: status,
        score: score
      };
    });

  const getStatusIcon = (status) => {
    if (status === 'green') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === 'yellow') {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusColor = (status) => {
    if (status === 'green') {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'yellow') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Target className="w-7 h-7" />
          </div>
          {isHebrew ? '📊 טבלת מוכנות' : '📊 Readiness Table'}
        </CardTitle>
        <p className="text-white/90 mt-2 text-lg">
          {isHebrew 
            ? 'הערכת מוכנות בתחומים קריטיים'
            : 'Readiness Assessment in Critical Areas'
          }
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border-2 border-indigo-200 px-6 py-4 text-right font-bold text-indigo-900 text-lg">
                  {isHebrew ? 'תחום' : 'Domain'}
                </th>
                <th className="border-2 border-indigo-200 px-6 py-4 text-center font-bold text-indigo-900 text-lg">
                  {isHebrew ? 'דירוג' : 'Rating'}
                </th>
              </tr>
            </thead>
            <tbody>
              {readinessData.map((item, index) => (
                <tr 
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-indigo-50 transition-colors`}
                >
                  <td className="border-2 border-indigo-200 px-6 py-4 font-bold text-gray-900 text-lg">
                    {item.domain}
                  </td>
                  <td className="border-2 border-indigo-200 px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(item.status)}
                      <Badge className={`${getStatusColor(item.status)} text-base px-4 py-1 font-bold`}>
                        {item.readiness}
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}