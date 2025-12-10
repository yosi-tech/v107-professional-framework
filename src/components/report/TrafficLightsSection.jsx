import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Activity } from "lucide-react";

export default function TrafficLightsSection({ trafficLights, language }) {
  if (!trafficLights || trafficLights.length === 0) return null;

  const isHebrew = language === 'he';

  const getStatusConfig = (status) => {
    const configs = {
      green: { 
        color: 'bg-green-500', 
        icon: '🟢',
        label: isHebrew ? 'תקין' : 'Good',
        textColor: 'text-green-900',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      yellow: { 
        color: 'bg-yellow-500', 
        icon: '🟡',
        label: isHebrew ? 'זהירות' : 'Caution',
        textColor: 'text-yellow-900',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      },
      orange: { 
        color: 'bg-orange-500', 
        icon: '🟠',
        label: isHebrew ? 'דורש תשומת לב' : 'Needs Attention',
        textColor: 'text-orange-900',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      red: { 
        color: 'bg-red-500', 
        icon: '🔴',
        label: isHebrew ? 'קריטי' : 'Critical',
        textColor: 'text-red-900',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    };
    return configs[status] || configs.green;
  };

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-amber-50">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Activity className="w-7 h-7" />
          </div>
          {isHebrew ? '🚦 טבלת רמזורים' : '🚦 Traffic Lights'}
        </CardTitle>
        <p className="text-white/90 mt-2 text-lg">
          {isHebrew 
            ? 'סטטוס פריטים קריטיים בעסק שלך'
            : 'Status of Critical Items in Your Business'
          }
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-5">
          {trafficLights.map((item, index) => {
            const config = getStatusConfig(item.status);
            return (
              <Card 
                key={index} 
                className={`${config.bgColor} border-none shadow-lg hover:shadow-2xl transition-all hover:scale-[1.01]`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-5">
                    <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center text-3xl shadow-xl flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <h4 className={`font-black text-xl ${config.textColor}`}>
                          {item.item}
                        </h4>
                        <Badge className={`${config.color} text-white text-base px-4 py-1 shadow-md`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-semibold">
                        {isHebrew ? '📁 תחום:' : '📁 Domain:'} <span className="text-gray-900">{item.domain}</span>
                      </p>
                      <p className={`${config.textColor} leading-relaxed text-lg`}>
                        {item.note}
                      </p>
                    </div>
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