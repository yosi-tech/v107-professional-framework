import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Users, TrendingUp, BarChart3, Star, Brain, SlidersHorizontal, CheckSquare } from "lucide-react";

export default function WorkStyleSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const textFields = [
    { key: "alone_vs_team", title: "61. אתה מעדיף לעבוד לבד או בצוות?", icon: Users },
    { key: "lead_vs_join", title: "62. אתה מעדיף להוביל או להשתלב במיזם קיים?", icon: Star },
    { key: "stress_handling", title: "65. איך אתה מתמודד עם מצבי לחץ?", icon: TrendingUp },
    { key: "decision_making", title: "66. איך אתה מקבל החלטות – מהר או אחרי מחשבה ארוכה?", icon: CheckSquare },
    { key: "creative_vs_analytical", title: "67. האם אתה יותר יצירתי או יותר אנליטי?", icon: Brain },
    { key: "vision_vs_execution", title: "68. האם אתה יותר איש חזון או איש ביצוע?", icon: SlidersHorizontal }
  ];

  const scaleFields = [
    { key: "organization_level", title: "63. עד כמה אתה מסודר/מאורגן?", icon: BarChart3 },
    { key: "risk_taking", title: "64. עד כמה אתה מוכן לקחת סיכונים?", icon: TrendingUp },
    { key: "managing_employees_importance", title: "69. עד כמה חשוב לך לנהל עובדים?", icon: Users },
    { key: "customer_facing_importance", title: "70. עד כמה חשוב לך לעבוד מול לקוחות?", icon: User }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ז. אופי וסגנון עבודה</h2>
        <p className="text-gray-600">ספר לנו על סגנון העבודה המועדף עליך</p>
      </div>

      {textFields.map(field => (
        <Card key={field.key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <field.icon className="w-5 h-5 text-blue-600" />
              {field.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={data[field.key] || ""}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder="הכנס תשובה..."
              className="mt-2 min-h-[80px]"
              rows={3}
            />
          </CardContent>
        </Card>
      ))}

      {scaleFields.map(field => (
        <Card key={field.key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <field.icon className="w-5 h-5 text-blue-600" />
              {field.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 justify-center">
              <span className="text-sm text-gray-500">1 (מעט)</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleInputChange(field.key, value)}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      data[field.key] === value
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <span className="text-sm text-gray-500">(הרבה) 5</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}