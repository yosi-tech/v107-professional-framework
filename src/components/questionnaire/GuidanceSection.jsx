import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, MessageCircle, Star, Users, Target, Lightbulb, TrendingUp, Briefcase } from "lucide-react";

export default function GuidanceSection({ data, onChange }) {
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

  const arrayFields = [
    { key: "helpful_guidance_areas", title: "81. באילו תחומים היית חושב שליווי מקצועי יכול לתרום לך?", icon: Target },
    { key: "less_relevant_guidance", title: "82. באילו תחומים לדעתך ליווי חיצוני פחות רלוונטי עבורך?", icon: MessageCircle },
    { key: "guidance_expectations", title: "83. אם היית נעזר בליווי – מה היית מצפה לקבל ממנו?", icon: Star },
    { key: "preferred_guidance_format", title: "84. באיזה אופן היית מעדיף לקבל ליווי מקצועי (מפגשים, דיגיטלי, שיחות וידאו וכו׳)?", icon: MessageCircle },
    { key: "self_responsibility_areas", title: "86. אילו תחומים היית מעדיף להשאיר לאחריותך בלבד?", icon: UserCheck },
    { key: "mentoring_capability", title: "87. אם היית נדרש ללוות יזם או עסק אחר – מה היית יכול להעניק כ'מלווה מומחה'?", icon: Users },
    { key: "expertise_areas", title: "88. מהם תחומי הידע או הניסיון שלך שיכולים לשמש אותך כמדריך/מלווה אחרים?", icon: Lightbulb },
    { key: "initial_income_expectations", title: "89. מהן ציפיות ההכנסה הראשוניות שלך מהמיזם?", icon: TrendingUp },
    { key: "vision_3_5_years", title: "90. מהו החזון שלך למיזם בעוד 3-5 שנים?", icon: TrendingUp },
    { key: "target_customers", title: "91. איזה סוג של לקוחות תרצה/י לשרת?", icon: Users },
    { key: "foreseen_challenges", title: "92. מהם האתגרים הגדולים ביותר שאתה/את צופה בפיתוח העסק?", icon: Target },
    { key: "role_after_1y", title: "93. מה תפקידך בחברה לאחר שנה?", icon: Briefcase },
    { key: "success_definition_1y", title: "94. מה ייחשב 'הצלחה גדולה' בעוד שנה?", icon: Star },
    { key: "main_competitors", title: "95. מי לדעתך המתחרים העיקריים שלך?", icon: Users },
    { key: "competitive_advantage", title: "96. מה היתרון התחרותי העיקרי שלך?", icon: Star },
    { key: "success_metrics", title: "97. איך תמדוד/י את הצלחת העסק?", icon: TrendingUp },
    { key: "change_in_business_world", title: "98. מה היית משנה בעולם העסקים היום?", icon: Lightbulb },
    { key: "business_model", title: "99. איזה מודל עסקי אתה/את מתכנן/ת?", icon: Briefcase },
    { key: "customer_channels", title: "100. אילו ערוצים תשתמש/י כדי להגיע ללקוחות?", icon: MessageCircle }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserCheck className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ט. עמדות כלפי ליווי מקצועי</h2>
        <p className="text-gray-600">ספר לנו על הציפיות שלך מליווי מקצועי</p>
      </div>

      {arrayFields.map((field) => (
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            85. עד כמה חשוב לך שהליווי יהיה קבוע מול אדם יחיד, לעומת רשת מומחים מתחלפת?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 justify-center">
            <span className="text-sm text-gray-500">1 (רשת מומחים)</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange("consistent_vs_network_importance", value)}
                  className={`w-12 h-12 rounded-full border-2 transition-colors ${
                    data.consistent_vs_network_importance === value
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : 'border-gray-300 hover:border-amber-400'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <span className="text-sm text-gray-500">(מלווה קבוע) 5</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}