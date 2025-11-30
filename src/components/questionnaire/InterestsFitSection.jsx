import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign, Shield, Lightbulb, TrendingUp } from "lucide-react";

export default function InterestsFitSection({ data, onChange }) {
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

  const scaleFields = [
  { key: "social_mission_importance", title: "24. עד כמה חשוב לך תחום עם “שליחות/ערך חברתי”?", icon: Heart },
  { key: "income_potential_importance", title: "25. עד כמה חשוב לך תחום עם פוטנציאל הכנסה גבוה?", icon: DollarSign },
  { key: "stability_importance", title: "26. עד כמה חשוב לך תחום עם יציבות וביטחון?", icon: Shield }];


  const arrayFields = [
  { key: "preferred_fields", title: "21. באילו תחומים עסקיים היית רוצה לפעול?", icon: Lightbulb },
  { key: "less_interesting", title: "22. אילו תחומים פחות מעניינים אותך?", icon: Lightbulb },
  { key: "entrepreneurship_appeal", title: "23. מה הכי מושך אותך ביזמות/עצמאות?", icon: TrendingUp },
  { key: "hobbies", title: "27. מהם תחומי התחביבים שלך?", icon: Heart },
  { key: "investigated_fields", title: "28. האם יש תחום שבו כבר השקעת/בדקת אפשרויות?", icon: TrendingUp },
  { key: "growing_markets", title: "29. אילו שווקים/ענפים נראים לך בעלי צמיחה?", icon: TrendingUp },
  { key: "excluded_fields", title: "30. אילו תחומים היית שולל על הסף?", icon: Lightbulb }];


  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="bg-amber-400 mb-4 mx-auto w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center">
          <Lightbulb className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">ג. תחומי עניין והתאמה עסקית</h2>
        <p className="text-text-secondary">נבין יחד מה מעניין ומניע אותך.</p>
      </div>
      
      {arrayFields.map((field) =>
      <Card key={field.key} className="border-t-4 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <field.icon className="w-5 h-5 text-accent" />
              {field.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(data[field.key] || [""]).map((item, index) =>
          <Textarea
            key={index}
            value={item}
            onChange={(e) => handleArrayChange(field.key, index, e.target.value)}
            placeholder="התשובה שלך כאן..."
            className="mt-2 min-h-[80px]"
            rows={3} />

          )}
             <button
            type="button"
            onClick={() => addArrayItem(field.key)}
            className="text-accent hover:text-accent-dark text-sm mt-2 font-semibold">

              + הוסף עוד
            </button>
          </CardContent>
        </Card>
      )}

      {/* Scale Questions */}
      {scaleFields.map((field) =>
      <Card key={field.key} className="border-t-4 border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-text-primary">
              <field.icon className="w-5 h-5 text-accent" />
              {field.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 justify-center">
              <span className="text-sm text-text-secondary">1 (פחות)</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) =>
              <button
                key={value}
                type="button"
                onClick={() => handleInputChange(field.key, value)}
                className={`w-12 h-12 rounded-full border-2 transition-all duration-200 ${
                data[field.key] === value ?
                'bg-accent border-accent text-white scale-110 shadow-lg' :
                'border-slate-300 hover:border-accent'}`
                }>

                    {value}
                  </button>
              )}
              </div>
              <span className="text-sm text-text-secondary">(יותר) 5</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>);

}