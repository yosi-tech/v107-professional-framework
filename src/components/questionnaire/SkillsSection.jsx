import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Check, X } from "lucide-react";

export default function SkillsSection({ data, onChange }) {
  const handleBooleanChange = (field, value) => {
    onChange({ [field]: value });
  };

  const skills = [
    { key: "financial_management", title: "71. ידע בניהול פיננסי בסיסי (תקציב, דוחות)" },
    { key: "digital_marketing", title: "72. ידע בשיווק דיגיטלי (פייסבוק, אינסטגרם, גוגל)" },
    { key: "sales", title: "73. ידע במכירות (טלפוניות/שטח)" },
    { key: "legal_contracts", title: "74. ידע במשפטים/חוזים" },
    { key: "technology", title: "75. ידע בטכנולוגיה/מחשבים" },
    { key: "operations_logistics", title: "76. ידע בתפעול/לוגיסטיקה" },
    { key: "training_guidance", title: "77. ידע בהדרכה/הנחיה" },
    { key: "project_management", title: "78. ידע בניהול פרויקטים" },
    { key: "hr_recruitment", title: "79. ידע במשאבי אנוש/גיוס" },
    { key: "design_product", title: "80. ידע בעיצוב/מוצר" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ח. ידע וכישורים משלימים</h2>
        <p className="text-gray-600">סמן "כן" או "לא" עבור כל אחד מהתחומים הבאים</p>
      </div>

      <Card>
        <CardContent className="p-6 divide-y divide-gray-200">
          {skills.map((skill, index) => (
            <div key={skill.key} className={`py-4 ${index === 0 ? 'pt-0' : ''} ${index === skills.length - 1 ? 'pb-0' : ''}`}>
              <div className="flex items-center justify-between">
                <span className="text-gray-800 font-medium">{skill.title}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleBooleanChange(skill.key, true)}
                    className={`flex items-center justify-center w-20 h-10 rounded-lg transition-colors ${
                      data[skill.key] === true 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                    }`}
                  >
                    <Check className="w-5 h-5 mr-1" /> כן
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBooleanChange(skill.key, false)}
                    className={`flex items-center justify-center w-20 h-10 rounded-lg transition-colors ${
                      data[skill.key] === false 
                        ? 'bg-gray-700 text-white shadow-md' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <X className="w-5 h-5 mr-1" /> לא
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}