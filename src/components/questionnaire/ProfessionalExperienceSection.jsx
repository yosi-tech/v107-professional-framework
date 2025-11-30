import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Target, Users, TrendingUp } from "lucide-react";

export default function ProfessionalExperienceSection({ data, onChange }) {
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

  const experienceFields = [
    { key: "main_experience_areas", title: "11. מהם שלושת תחומי הניסיון העיקריים שלך?", icon: Target },
    { key: "professional_skills", title: "12. אילו מיומנויות מקצועיות בולטות אצלך?", icon: Award },
    { key: "tools_technologies", title: "13. אילו כלים/טכנולוגיות אתה יודע להפעיל היטב?", icon: TrendingUp },
    { key: "achievements", title: "14. הישגים מקצועיים מרכזיים שחשוב לך לציין:", icon: Award },
    { key: "team_work_experience", title: "15. עבודה עם צוותים/עובדים – ספר בקצרה:", icon: Users },
    { key: "entrepreneurship_experience", title: "16. ניסיון ביזמות/ניהול עסק קודם:", icon: Target },
    { key: "budget_management", title: "17. ניסיון בניהול תקציבים/כספים:", icon: TrendingUp },
    { key: "marketing_sales", title: "18. ניסיון בשיווק/מכירות:", icon: Target },
    { key: "operations_service", title: "19. ניסיון בתפעול/שירות לקוחות:", icon: Users },
    { key: "product_development", title: "20. ניסיון בפיתוח מוצר/שירות:", icon: Award }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ב. ניסיון מקצועי וכישורים</h2>
        <p className="text-gray-600">תאר את הניסיון המקצועי והכישורים שלך</p>
      </div>

      {experienceFields.map((field) => (
        <Card key={field.key} className="bg-white text-gray-900 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <field.icon className="w-5 h-5 text-yellow-400" />
              {field.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data[field.key] || [""]).map((item, index) => (
              <Textarea
                key={index}
                value={item}
                onChange={(e) => handleArrayChange(field.key, index, e.target.value)}
                placeholder={`תאר כאן...`}
                className="mt-2 min-h-[80px] bg-white text-gray-900 border-gray-300 placeholder:text-gray-400"
                rows={3}
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayItem(field.key)}
              className="text-yellow-500 hover:text-yellow-600 text-sm mt-3"
            >
              + הוסף עוד
            </button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}