
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

  const maritalStatusOptions = ["Single", "Married", "Domestic partner", "Divorced", "Widowed", "Other"];
  const educationOptions = ["No degree", "Certificate/Courses", "Bachelor's", "Master's", "MBA", "PhD/Other"];
  const languageOptions = ["Hebrew", "English", "Russian", "Arabic", "French", "Spanish", "Other"];
  const fieldOptions = ["Operations", "B2B Sales", "B2C Sales", "Digital Marketing", "Finance/Pricing", "Product/UX", "Procurement/Logistics", "Customer Service", "Project Management", "Training/Implementation", "Legal/Contracts", "HR/Recruiting", "IT/Technology", "Strategy", "Data/BI", "Other"];

  return (
    <div className="space-y-8">
      <div className="text-center mb-10">
        <div className="bg-slate-800 mb-4 mx-auto w-16 h-16 border-2 border-slate-200 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">A. Personal details & background (1–10)</h2>
        <p className="text-text-secondary">Tell us a bit about yourself.</p>
      </div>

      <Card className="border-t-4 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <User className="w-5 h-5 text-accent" />
            Basic Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">1. Full name<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="full_name"
                value={data.full_name || ""}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                placeholder="John Doe"
                maxLength={200}
                required
              />
            </div>
            <div>
              <Label htmlFor="age">2. Age</Label>
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
                placeholder="e.g., 35"
                min={14}
                max={80}
              />
            </div>
          </div>
          
          <div>
            <Label>3. Marital status</Label>
            <RadioGroup
              value={data.marital_status}
              onValueChange={(value) => handleInputChange("marital_status", value)}
              className="flex flex-wrap gap-4 mt-2"
            >
              {maritalStatusOptions.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`marital_${option}`} />
                  <Label htmlFor={`marital_${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            {data.marital_status === "Other" && (
              <Input
                className="mt-2"
                placeholder="Please specify"
                value={data.marital_status_other || ""}
                onChange={(e) => handleInputChange("marital_status_other", e.target.value)}
                maxLength={200}
              />
            )}
          </div>
          
          <div>
             <Label>6. Languages (select all that apply)</Label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {languageOptions.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`lang_${option}`}
                    checked={(data.languages || []).includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange("languages", option, checked)}
                  />
                  <Label htmlFor={`lang_${option}`}>{option}</Label>
                </div>
              ))}
             </div>
             {(data.languages || []).includes("Other") && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
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
            Education and Training
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>4. Formal education (select all that apply)</Label>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {educationOptions.map(option => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`edu_${option}`}
                    checked={(data.formal_education || []).includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange("formal_education", option, checked)}
                  />
                  <Label htmlFor={`edu_${option}`}>{option}</Label>
                </div>
              ))}
             </div>
             {(data.formal_education || []).includes("PhD/Other") && (
                <Input
                  className="mt-2"
                  placeholder="Please specify"
                  value={data.formal_education_other || ""}
                  onChange={(e) => handleInputChange("formal_education_other", e.target.value)}
                  maxLength={200}
                />
              )}
          </div>

          <div>
            <Label htmlFor="professional_courses">5. Relevant courses or certifications</Label>
            <Input
              id="professional_courses"
              value={data.professional_courses || ""}
              onChange={(e) => handleInputChange("professional_courses", e.target.value)}
              placeholder="Course/Certification"
              maxLength={200}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-t-4 border-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-text-primary">
            <Briefcase className="w-5 h-5 text-accent" />
            Current Employment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
           <div>
            <Label>7. Current field of work (choose one)</Label>
            <Select onValueChange={(value) => handleInputChange("current_field", value)} value={data.current_field}>
                <SelectTrigger>
                  <SelectValue placeholder="Select field of work" />
                </SelectTrigger>
                <SelectContent>
                  {fieldOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
            </Select>
            {data.current_field === "Other" && (
              <Input
                className="mt-2"
                placeholder="Please specify"
                value={data.current_field_other || ""}
                onChange={(e) => handleInputChange("current_field_other", e.target.value)}
                maxLength={200}
              />
            )}
          </div>
          <div>
            <Label htmlFor="current_workplace">8. Current workplace or business (if any)</Label>
            <Input
              id="current_workplace"
              value={data.current_workplace || ""}
              onChange={(e) => handleInputChange("current_workplace", e.target.value)}
              placeholder="Company or business name"
              maxLength={200}
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="current_role">9. Current role/title</Label>
              <Input
                id="current_role"
                value={data.current_role || ""}
                onChange={(e) => handleInputChange("current_role", e.target.value)}
                placeholder="e.g., Product Manager"
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="years_experience">10. Total years of professional experience<span className="text-red-500 ml-1">*</span></Label>
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
                placeholder="Number of years"
                min={0}
                max={60}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
