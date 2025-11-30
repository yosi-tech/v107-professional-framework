
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap, Briefcase } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PersonalInfoSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };
  
  const handleCheckboxChange = (field, item, isChecked) => {
    const currentArray = data[field] || [];
    const newArray = isChecked
      ? [...currentArray, item]
      : currentArray.filter((i) => i !== item);
    onChange({ [field]: newArray });
  };

  const maritalStatusOptions = ["רווק/ה", "נשוי/ה", "בזוגיות", "גרוש/ה", "אלמן/ה", "אחר"];
  const educationOptions = ["ללא תואר", "תעודה/קורסים", "תואר ראשון", "תואר שני", "MBA", "דוקטורט/אחר"];
  const languageOptions = ["עברית", "אנגלית", "רוסית", "ערבית", "צרפתית", "ספרדית", "אחרת"];
  const fieldOptions = ["תפעול", "מכירות B2B", "מכירות B2C", "שיווק דיגיטלי", "פיננסים/תמחור", "מוצר/חווית משתמש", "רכש/לוגיסטיקה", "שירות לקוחות", "ניהול פרויקטים", "הדרכה/הטמעה", "משפט/חוזים", "משאבי אנוש/גיוס", "IT/טכנולוגיה", "אסטרטגיה", "דאטה/BI", "אחר"];

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="bg-slate-800 mb-4 mx-auto w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">א. פרטים אישיים ורקע</h2>
        <p className="text-text-secondary">ספר לנו קצת עליך.</p>
      </div>

      <Card className="border-t-4 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <User className="w-5 h-5 text-accent" />
            פרטים בסיסיים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">1. שם מלא<span className="text-red-500 mr-1">*</span></Label>
              <Input
                id="full_name"
                value={data.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="ישראל ישראלי"
                maxLength={200}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">2. גיל</Label>
              <Input
                id="age"
                type="number"
                value={data.age || ""}
                onChange={(e) => {
                  const age = parseInt(e.target.value, 10);
                  if (isNaN(age) || (age >= 14 && age <= 80)) {
                    handleInputChange("age", e.target.value);
                  }
                }}
                placeholder="לדוגמה: 35"
                min={14}
                max={80}
              />
            </div>
          </div>
          
          <div>
            <Label>3. מצב משפחתי</Label>
            <RadioGroup
              value={data.marital_status}
              onValueChange={(value) => handleInputChange("marital_status", value)}
              className="flex flex-wrap gap-4 mt-2"
            >
              {maritalStatusOptions.map(option => (
                <div key={option} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={option} id={`marital_${option}`} />
                  <Label htmlFor={`marital_${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {data.marital_status === "אחר" && (
              <Input
                className="mt-2"
                placeholder="פרט"
                value={data.marital_status_other || ""}
                onChange={(e) => handleInputChange("marital_status_other", e.target.value)}
                maxLength={200}
              />
            )}
          </div>
          
          <div>
             <Label>6. שפות בהן אתה שולט</Label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {languageOptions.map(option => (
                <div key={option} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`lang_${option}`}
                    checked={(data.languages || []).includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange("languages", option, checked)}
                  />
                  <Label htmlFor={`lang_${option}`}>{option}</Label>
                </div>
              ))}
             </div>
             {(data.languages || []).includes("אחרת") && (
                <Input
                  className="mt-2"
                  placeholder="פרט"
                  value={data.languages_other || ""}
                  onChange={(e) => handleInputChange("languages_other", e.target.value)}
                  maxLength={200}
                />
              )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <GraduationCap className="w-5 h-5 text-accent" />
            השכלה והכשרה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>4. השכלה פורמלית</Label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {educationOptions.map(option => (
                <div key={option} className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id={`edu_${option}`}
                    checked={(data.formal_education || []).includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange("formal_education", option, checked)}
                  />
                  <Label htmlFor={`edu_${option}`}>{option}</Label>
                </div>
              ))}
             </div>
             {(data.formal_education || []).includes("דוקטורט/אחר") && (
                <Input
                  className="mt-2"
                  placeholder="פרט"
                  value={data.formal_education_other || ""}
                  onChange={(e) => handleInputChange("formal_education_other", e.target.value)}
                  maxLength={200}
                />
              )}
          </div>

          <div>
            <Label htmlFor="professional_courses">5. קורסים/הכשרות מקצועיות רלוונטיות</Label>
            <Input
              id="professional_courses"
              value={data.professional_courses || ""}
              onChange={(e) => handleInputChange("professional_courses", e.target.value)}
              placeholder="קורס/הכשרה"
              maxLength={200}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <Briefcase className="w-5 h-5 text-accent" />
            תעסוקה נוכחית
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Label>7. תחום עיסוק נוכחי</Label>
            <Select onValueChange={(value) => handleInputChange("current_field", value)} value={data.current_field}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תחום עיסוק" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
            </Select>
            {data.current_field === "אחר" && (
              <Input
                className="mt-2"
                placeholder="פרט"
                value={data.current_field_other || ""}
                onChange={(e) => handleInputChange("current_field_other", e.target.value)}
                maxLength={200}
              />
            )}
          </div>
          <div>
            <Label htmlFor="current_workplace">8. מקום עבודה/עסק נוכחי (אם קיים)</Label>
            <Input
              id="current_workplace"
              value={data.current_workplace || ""}
              onChange={(e) => handleInputChange("current_workplace", e.target.value)}
              placeholder="שם החברה או העסק"
              maxLength={200}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_role">9. תפקיד נוכחי</Label>
              <Input
                id="current_role"
                value={data.current_role || ""}
                onChange={(e) => handleInputChange("current_role", e.target.value)}
                placeholder="לדוגמה: מנהל/ת מוצר"
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="years_experience">10. שנות ניסיון מקצועי מצטבר</Label>
              <Input
                id="years_experience"
                type="number"
                value={data.years_experience || ""}
                onChange={(e) => {
                  const years = parseInt(e.target.value, 10);
                  if (isNaN(years) || (years >= 0 && years <= 60)) {
                    handleInputChange("years_experience", e.target.value);
                  }
                }}
                placeholder="מספר שנים"
                min={0}
                max={60}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
