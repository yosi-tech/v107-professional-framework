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
    <Card className="mb-8 border-t-4 border-t-amber-600">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Activity className="w-8 h-8 text-amber-600" />
          {isHebrew ? 'טבלת רמזורים' : 'Traffic Lights'}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {isHebrew 
            ? 'סטטוס פריטים קריטיים בעסק שלך'
            : 'Status of Critical Items in Your Business'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trafficLights.map((item, index) => {
            const config = getStatusConfig(item.status);
            return (
              <Card 
                key={index} 
                className={`${config.bgColor} border-2 ${config.borderColor}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${config.color} rounded-full flex items-center justify-center text-2xl flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-bold text-lg ${config.textColor}`}>
                          {item.item}
                        </h4>
                        <Badge className={`${config.color} text-white`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-semibold">{isHebrew ? 'תחום:' : 'Domain:'}</span> {item.domain}
                      </p>
                      <p className={`${config.textColor} leading-relaxed`}>
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