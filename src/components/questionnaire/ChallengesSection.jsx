import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, DollarSign, Home, X, BarChart } from "lucide-react";

export default function ChallengesSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const currentArray = data[field] || [];
    const newArray = [...currentArray];
    newArray[index] = value;
    onChange({ [field]: newArray });
  };

  const addArrayItem = (field) => {
    const currentArray = data[field] || [];
    onChange({ [field]: [...currentArray, ""] });
  };

  const challengeFields = [
    { key: "professional_weaknesses", title: "51. אילו חולשות/חסרים מקצועיים אתה מזהה בעצמך?", icon: AlertTriangle },
    { key: "time_limitations", title: "52. אילו מגבלות זמן קיימות לך?", icon: Clock },
    { key: "financial_limitations", title: "53. אילו מגבלות כלכליות קיימות לך?", icon: DollarSign },
    { key: "family_limitations", title: "54. אילו מגבלות משפחתיות/אישיות קיימות?", icon: Home },
    { key: "past_failures", title: "55. ניסיון קודם שלא צלח – מה למדת ממנו?", icon: X },
    { key: "failed_fields", title: "56. האם יש תחום שבו נכשלת/ויתרת?", icon: X },
    { key: "habits_to_change", title: "57. אילו הרגלים אישיים היית רוצה לשנות כדי להצליח?", icon: AlertTriangle },
    { key: "progress_barriers", title: "58. מה מונע ממך כיום להתקדם מהר יותר?", icon: AlertTriangle },
    { key: "external_obstacles", title: "59. אילו גורמים חיצוניים עלולים לעכב אותך?", icon: AlertTriangle }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ו. אתגרים ומגבלות</h2>
        <p className="text-gray-600">עזור לנו להבין את האתגרים והמגבלות שלך</p>
      </div>

      {challengeFields.map((field) => (
        <Card key={field.key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <field.icon className="w-5 h-5 text-amber-600" />
              {field.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data[field.key] || [""]).map((item, index) => (
              <Textarea
                key={index}
                value={item}
                onChange={(e) => handleArrayChange(field.key, index, e.target.value)}
                placeholder="הכנס תשובה..."
                className="mt-2 min-h-[80px]"
                rows={3}
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(field.key)}
              className="text-amber-600 hover:text-amber-700 text-sm mt-3"
            >
              + הוסף עוד
            </button>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5 text-amber-600" />
            60. עד כמה אתה נוטה לדחות משימות?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 justify-center">
            <span className="text-sm text-gray-500">1 (בכלל לא)</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange("procrastination_tendency", value)}
                  className={`w-12 h-12 rounded-full border-2 transition-colors ${
                    data.procrastination_tendency === value
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'border-gray-300 hover:border-amber-400'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">(מאוד נוטה) 5</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}