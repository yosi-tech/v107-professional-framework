import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save, X } from "lucide-react";

export default function FullReportEditor({ data, onSave, onCancel }) {
  const [content, setContent] = useState(data || '');

  return (
    <Card className="border-2 border-indigo-300 bg-indigo-50">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ערוך דוח מלא (Markdown)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            ניתן להשתמש ב-Markdown לעיצוב הטקסט (כותרות, רשימות, טקסט מודגש וכו')
          </p>
        </div>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[600px] font-mono text-sm bg-white"
          placeholder="הכנס את הדוח המלא בפורמט Markdown..."
        />

        <div className="flex gap-3 mt-6">
          <Button 
            onClick={() => onSave(content)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 ml-2" />
            שמור שינויים
          </Button>
          <Button 
            onClick={onCancel}
            variant="outline"
          >
            <X className="w-4 h-4 ml-2" />
            ביטול
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}