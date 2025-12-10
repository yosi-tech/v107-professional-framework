import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Star } from "lucide-react";

export default function RecommendationsSection({ recommendations, language }) {
  if (!recommendations || recommendations.length === 0) return null;

  const isHebrew = language === 'he';

  return (
    <Card className="mb-8 border-t-4 border-t-pink-600">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-pink-600" />
          {isHebrew ? 'המלצות ממוקדות' : 'Focused Recommendations'}
        </CardTitle>
        <p className="text-gray-600 mt-2">
          {isHebrew 
            ? 'המלצות פרקטיות לסגירת הפערים הקריטיים'
            : 'Practical recommendations to close critical gaps'
          }
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <Card 
              key={index} 
              className="border-2 border-pink-100 bg-gradient-to-br from-white to-pink-50 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-pink-600 text-white mb-2">
                      {isHebrew ? 'המלצה' : 'Recommendation'} #{index + 1}
                    </Badge>
                    <p className="text-gray-800 leading-relaxed text-lg">
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