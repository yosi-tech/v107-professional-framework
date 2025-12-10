import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Star } from "lucide-react";

export default function RecommendationsSection({ recommendations, language }) {
  if (!recommendations || recommendations.length === 0) return null;

  const isHebrew = language === 'he';

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-pink-50">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Lightbulb className="w-7 h-7" />
          </div>
          {isHebrew ? '💡 המלצות ממוקדות' : '💡 Focused Recommendations'}
        </CardTitle>
        <p className="text-white/90 mt-2 text-lg">
          {isHebrew 
            ? 'המלצות פרקטיות לסגירת הפערים הקריטיים'
            : 'Practical recommendations to close critical gaps'
          }
        </p>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-5">
          {recommendations.map((recommendation, index) => (
            <Card 
              key={index} 
              className="border-none shadow-lg hover:shadow-2xl transition-all hover:scale-[1.01] bg-white"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-gradient-to-r from-pink-600 to-rose-600 text-white mb-3 text-base px-4 py-1 shadow-md">
                      {isHebrew ? '⭐ המלצה' : '⭐ Recommendation'} #{index + 1}
                    </Badge>
                    <p className="text-gray-800 leading-relaxed text-xl font-medium">
                      {recommendation}
                    </p>
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