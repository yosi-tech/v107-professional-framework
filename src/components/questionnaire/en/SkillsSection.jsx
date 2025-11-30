
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function SkillsSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const skills = [
    { key: "financial_management", title: "71. Financial management basics (cash flow, statements)" },
    { key: "digital_marketing", title: "72. Digital marketing — campaigns, SEO/content, email/ESP & measurement" },
    { key: "sales", title: "73. Sales capabilities — outbound/field, CRM pipeline, closing" },
    { key: "legal_contracts", title: "74. Legal and contracts — basics" },
    { key: "technology", title: "75. Technology and IT" },
    { key: "operations_logistics", title: "76. Operations and logistics" },
    { key: "training_guidance", title: "77. Training and facilitation" },
    { key: "project_management", title: "78. Project management" },
    { key: "hr_recruitment", title: "79. HR and recruiting" },
    { key: "design_product", title: "80. Design and product" }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Wrench className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">H. Knowledge & complementary skills (71–80)</h2>
        <p className="text-gray-600">Rate all items 1–5 (N/A allowed)</p>
      </div>

      {skills.map((skill) => (
        <Card key={skill.key}>
          <CardHeader>
            <CardTitle className="text-base font-medium">{skill.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 justify-start">
              {[1, 2, 3, 4, 5, 'N/A'].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleInputChange(skill.key, String(value))}
                  className={`w-12 h-12 rounded-full border-2 transition-colors ${
                    data[skill.key] === String(value) 
                      ? 'bg-red-600 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
