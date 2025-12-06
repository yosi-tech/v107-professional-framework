import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Save, X } from "lucide-react";

export default function RecommendationsEditor({ data, onSave, onCancel }) {
  const [recommendations, setRecommendations] = useState(data || ['']);

  const addRecommendation = () => {
    setRecommendations([...recommendations, '']);
  };

  const removeRecommendation = (index) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const updateRecommendation = (index, value) => {
    const newRecs = [...recommendations];
    newRecs[index] = value;
    setRecommendations(newRecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button onClick={addRecommendation} size="sm" className="flex items-center gap-1">
          <Plus className="w-4 h-4" />
          הוסף המלצה
        </Button>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card key={index} className="p-4 bg-amber-50 border-amber-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900">המלצה #{index + 1}</span>
                {recommendations.length > 1 && (
                  <Button
                    onClick={() => removeRecommendation(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Textarea
                value={rec}
                onChange={(e) => updateRecommendation(index, e.target.value)}
                placeholder="המלצה פרקטית..."
                className="min-h-[80px] text-right bg-white"
                dir="rtl"
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={() => onSave(recommendations)} className="flex items-center gap-2">
          <Save className="w-4 h-4 ml-2" />
          שמור
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="w-4 h-4 ml-2" />
          ביטול
        </Button>
      </div>
    </div>
  );
}