import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Calendar, Target, CheckCircle } from "lucide-react";

export default function ActionPlanSection({ actionPlan, language }) {
  if (!actionPlan) return null;

  const isHebrew = language === 'he';

  const sections = [
    {
      key: 'quick_wins',
      title: isHebrew ? 'Quick Wins (0-30 יום)' : 'Quick Wins (0-30 days)',
      icon: Zap,
      color: 'amber',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-500',
      iconBg: 'bg-amber-600',
      items: actionPlan.quick_wins || []
    },
    {
      key: 'months_1_3',
      title: isHebrew ? 'חודשים 1-3' : 'Months 1-3',
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconBg: 'bg-blue-600',
      items: actionPlan.months_1_3 || []
    },
    {
      key: 'months_4_6',
      title: isHebrew ? 'חודשים 4-6' : 'Months 4-6',
      icon: Target,
      color: 'purple',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      iconBg: 'bg-purple-600',
      items: actionPlan.months_4_6 || []
    }
  ];

  return (
    <Card className="mb-8 border-t-4 border-t-indigo-600">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <CheckCircle className="w-8 h-8 text-indigo-600" />
          {isHebrew ? 'תכנית פעולה מפורטת' : 'Detailed Action Plan'}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {isHebrew 
            ? 'צעדים ספציפיים ליישום בחודשים הקרובים'
            : 'Specific steps to implement in the coming months'
          }
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <div key={section.key}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 ${section.iconBg} rounded-lg flex items-center justify-center`}>
                <section.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
            </div>
            <div className="space-y-3">
              {section.items.map((item, index) => (
                <Card 
                  key={index} 
                  className={`${section.bgColor} border-2 ${section.borderColor}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Badge className={`${section.iconBg} text-white text-base px-3 py-1 flex-shrink-0`}>
                        {index + 1}
                      </Badge>
                      <p className="text-gray-800 leading-relaxed flex-1">{item}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}