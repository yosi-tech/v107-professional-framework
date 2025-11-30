import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Calendar, TrendingUp, Star, AlertCircle } from "lucide-react";

export default function GoalsSection({ data, onChange }) {
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

  const goalFields = [
    { key: "business_goals_12m", title: "41. מהן המטרות העסקיות שלך ל-12 החודשים הקרובים?", icon: Target },
    { key: "personal_goals_12m", title: "42. מהן המטרות האישיות שלך ל-12 חודשים?", icon: Star },
    { key: "growth_vision_3_5y", title: "45. יעד גידול לטווח 3–5 שנים (חזון):", icon: TrendingUp },
    { key: "goals_90_days", title: "46. מהם 3 הדברים שתרצה שיקרו תוך 90 יום?", icon: Calendar },
    { key: "success_definition", title: "47. מה בעיניך ייחשב “הצלחה גדולה” בעוד שנה?", icon: Star },
    { key: "biggest_fear", title: "48. מהו החשש הכי גדול שלך מהקמת עסק?", icon: AlertCircle },
    { key: "essential_conditions", title: "49. מהם 2–3 תנאים הכרחיים מבחינתך לכניסה לעסק חדש?", icon: Target },
    { key: "helpful_traits", title: "50. מהן התכונות האישיות שלך שעוזרות לך להצליח?", icon: Star }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ה. מטרות ויעדים</h2>
        <p className="text-gray-600">ספר לנו על המטרות והיעדים שלך</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-500">
            <TrendingUp className="w-5 h-5" />
            יעדים כלכליים ואיזון
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="monthly_income_target">43. יעד הכנסה חודשי נטו שתרצה להגיע אליו (₪):</Label>
            <Input
              id="monthly_income_target"
              value={data.monthly_income_target || ""}
              onChange={(e) => handleInputChange("monthly_income_target", e.target.value)}
              placeholder="סכום ב-₪"
            />
          </div>

          <div>
            <Label htmlFor="work_life_balance_target">44. יעד זמן חופשי/איזון בית-עבודה:</Label>
            <Textarea
              id="work_life_balance_target"
              value={data.work_life_balance_target || ""}
              onChange={(e) => handleInputChange("work_life_balance_target", e.target.value)}
              placeholder="תאר את היעד שלך לאיזון חיים-עבודה"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {goalFields.map((field) => (
        <Card key={field.key}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <field.icon className="w-5 h-5 text-amber-500" />
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
              className="text-amber-500 hover:text-amber-600 text-sm mt-3"
            >
              + הוסף עוד
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}