import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, Users, Briefcase, Home } from "lucide-react";

export default function ResourcesSection({ data, onChange }) {
  const handleInputChange = (field, value) => {
    onChange({ [field]: value });
  };

  const handleBooleanChange = (field, value) => {
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ד. משאבים זמינים</h2>
        <p className="text-gray-600">ספר לנו על המשאבים העומדים לרשותך</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            זמן והשקעה
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="weekly_time">31. זמן פנוי שבועי שתוכל להשקיע במיזם חדש:</Label>
            <Input
              id="weekly_time"
              value={data.weekly_time || ""}
              onChange={(e) => handleInputChange("weekly_time", e.target.value)}
              placeholder="מספר שעות בשבוע"
            />
          </div>

          <div>
            <Label htmlFor="available_capital">32. הון עצמי נזיל זמין להשקעה (טווח ₪):</Label>
            <Input
              id="available_capital"
              value={data.available_capital || ""}
              onChange={(e) => handleInputChange("available_capital", e.target.value)}
              placeholder="למשל: 50,000-100,000 ₪"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
            מימון ושותפויות
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>33. נכונות לגייס משקיע/שותף חיצוני:</Label>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => handleBooleanChange("external_investor_willingness", true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  data.external_investor_willingness === true
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                כן
              </button>
              <button
                type="button"
                onClick={() => handleBooleanChange("external_investor_willingness", false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  data.external_investor_willingness === false
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                לא
              </button>
            </div>
          </div>

          <div>
            <Label>37. נכונות לקחת הלוואה/מימון בנקאי:</Label>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => handleBooleanChange("loan_willingness", true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  data.loan_willingness === true
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                כן
              </button>
              <button
                type="button"
                onClick={() => handleBooleanChange("loan_willingness", false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  data.loan_willingness === false
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                לא
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="potential_partners">36. שותפים פוטנציאליים (אם יש):</Label>
            <Textarea
              id="potential_partners"
              value={data.potential_partners || ""}
              onChange={(e) => handleInputChange("potential_partners", e.target.value)}
              placeholder="תאר שותפים פוטנציאליים"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            תמיכה וקשרים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>34. קשרים עסקיים רלוונטיים (תחומים/ענפים):</Label>
            {(data.business_connections || [""]).map((connection, index) => (
              <Input
                key={index}
                value={connection}
                onChange={(e) => handleArrayChange("business_connections", index, e.target.value)}
                placeholder="תחום/ענף + תיאור הקשר"
                className="mt-2"
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("business_connections")}
              className="text-amber-600 hover:text-amber-700 text-sm mt-2"
            >
              + הוסף קשר
            </button>
          </div>

          <div>
            <Label htmlFor="family_support">35. תמיכה משפחתית/סביבתית בהקמת עסק:</Label>
            <Textarea
              id="family_support"
              value={data.family_support || ""}
              onChange={(e) => handleInputChange("family_support", e.target.value)}
              placeholder="תאר את רמת התמיכה הסביבתית"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-600" />
            משאבים פיזיים וטכנולוגיים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>38. זמינות לנסיעות/פגישות מחוץ לאזור מגוריך:</Label>
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => handleBooleanChange("travel_availability", true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  data.travel_availability === true
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                כן
              </button>
              <button
                type="button"
                onClick={() => handleBooleanChange("travel_availability", false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  data.travel_availability === false
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                לא
              </button>
            </div>
          </div>

          <div>
            <Label>39. ציוד/נכסים רלוונטיים (משרד, רכב, מחשבים וכו׳):</Label>
            {(data.relevant_assets || [""]).map((asset, index) => (
              <Input
                key={index}
                value={asset}
                onChange={(e) => handleArrayChange("relevant_assets", index, e.target.value)}
                placeholder="תאר ציוד או נכס רלוונטי"
                className="mt-2"
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("relevant_assets")}
              className="text-amber-600 hover:text-amber-700 text-sm mt-2"
            >
              + הוסף נכס
            </button>
          </div>

          <div>
            <Label htmlFor="tech_capability">40. יכולת טכנולוגית/דיגיטלית בסיסית:</Label>
            <Textarea
              id="tech_capability"
              value={data.tech_capability || ""}
              onChange={(e) => handleInputChange("tech_capability", e.target.value)}
              placeholder="תאר את היכולות הטכנולוגיות שלך"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}