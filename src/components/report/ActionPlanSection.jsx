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
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-indigo-50">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <CheckCircle className="w-7 h-7" />
          </div>
          {isHebrew ? '✅ תכנית פעולה מפורטת' : '✅ Detailed Action Plan'}
        </CardTitle>
        <p className="text-white/90 mt-2 text-lg">
          {isHebrew 
            ? 'צעדים ספציפיים ליישום בחודשים הקרובים'
            : 'Specific steps to implement in the coming months'
          }
        </p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {sections.map((section, sectionIndex) => (
          <div key={section.key}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 ${section.iconBg} rounded-2xl flex items-center justify-center shadow-xl`}>
                <section.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">{section.title}</h3>
            </div>
            <div className="space-y-4">
              {section.items.map((item, index) => (
                <Card 
                  key={index} 
                  className="bg-white border-none shadow-lg hover:shadow-xl transition-all hover:scale-[1.01]"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${section.iconBg} text-white rounded-xl flex items-center justify-center font-black text-xl shadow-md flex-shrink-0`}>
                        {index + 1}
                      </div>
                      <p className="text-gray-800 leading-relaxed flex-1 text-lg">{item}</p>
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