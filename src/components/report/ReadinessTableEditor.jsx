import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReadinessTableEditor({ data, onSave, onCancel }) {
  const [domainScores, setDomainScores] = useState(data || {});

  const handleScoreChange = (domain, field, value) => {
    setDomainScores(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        [field]: field === 'score' ? Number(value) : value
      }
    }));
  };

  const handleBandChange = (domain, band) => {
    setDomainScores(prev => ({
      ...prev,
      [domain]: {
        ...prev[domain],
        band: band
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>עריכת טבלת מוכנות</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(domainScores).map(([key, domainData]) => (
          <Card key={key} className="p-4 bg-slate-50">
            <div className="space-y-3">
              <h4 className="font-bold text-lg">{domainData.name || key}</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">ציון</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={domainData.score || 0}
                    onChange={(e) => handleScoreChange(key, 'score', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">רמה</label>
                  <Select
                    value={domainData.band || 'mid'}
                    onValueChange={(value) => handleBandChange(key, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">גבוה</SelectItem>
                      <SelectItem value="mid">בינוני</SelectItem>
                      <SelectItem value="low">נמוך</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        <div className="flex gap-3 pt-4">
          <Button onClick={() => onSave(domainScores)} className="bg-green-600 hover:bg-green-700">
            שמור
          </Button>
          <Button onClick={onCancel} variant="outline">
            ביטול
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}