import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function ReadinessTableSection({ readinessData, language }) {
  if (!readinessData || readinessData.length === 0) return null;

  const isHebrew = language === 'he';

  const getStatusIcon = (status) => {
    if (status === 'green' || status === 'ready') {
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    }
    if (status === 'yellow' || status === 'partial') {
      return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusColor = (status) => {
    if (status === 'green' || status === 'ready') {
      return 'bg-green-100 text-green-800';
    }
    if (status === 'yellow' || status === 'partial') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = (status) => {
    if (status === 'green' || status === 'ready') {
      return isHebrew ? 'מוכן' : 'Ready';
    }
    if (status === 'yellow' || status === 'partial') {
      return isHebrew ? 'חלקי' : 'Partial';
    }
    return isHebrew ? 'לא מוכן' : 'Not Ready';
  };

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
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
                  {isHebrew ? 'סטטוס' : 'Status'}
                </th>
                <th className="border-2 border-indigo-200 px-6 py-4 text-right font-bold text-indigo-900 text-lg">
                  {isHebrew ? 'הערות' : 'Notes'}
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
                    {item.domain || item.area}
                  </td>
                  <td className="border-2 border-indigo-200 px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(item.status)}
                      <Badge className={`${getStatusColor(item.status)} text-base px-4 py-1`}>
                        {getStatusText(item.status)}
                      </Badge>
                    </div>
                  </td>
                  <td className="border-2 border-indigo-200 px-6 py-4 text-gray-700 text-base leading-relaxed">
                    {item.notes || item.comment || '-'}
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