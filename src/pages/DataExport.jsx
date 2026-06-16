import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, CheckCircle, Database } from "lucide-react";

const ENTITIES = [
  "User", "Article", "Testimonial", "Product", "Coupon", "SiteSettings",
  "ContentItem", "EmailTemplate", "SimulatedPurchase", "ContactInquiry",
  "SurveyResponse", "PaymentOrder", "QuestionnaireResponse",
  "GeneratedReport", "OnlineCoachingSubscription", "BoosterTask", "EmailLog"
];

async function fetchAll(entityName) {
  const records = [];
  let skip = 0;
  while (true) {
    const batch = await base44.entities[entityName].filter({}, "-created_date", 50, skip);
    records.push(...batch);
    if (batch.length < 50) break;
    skip += 50;
    if (skip > 5000) break;
  }
  return records;
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DataExport() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [exporting, setExporting] = useState({});
  const [exported, setExported] = useState({});
  const [schemas, setSchemas] = useState({});

  useEffect(() => {
    const init = async () => {
      const user = await base44.auth.me();
      if (!user || user.role !== "admin") {
        setIsLoading(false);
        return;
      }
      setIsAdmin(true);

      const c = {};
      const s = {};
      for (const name of ENTITIES) {
        try {
          const schema = await base44.entities[name].schema();
          s[name] = schema;
          const records = await fetchAll(name);
          c[name] = records.length;
        } catch (e) {
          c[name] = "error";
        }
      }
      setCounts(c);
      setSchemas(s);
      setIsLoading(false);
    };
    init();
  }, []);

  const handleExportEntity = async (name) => {
    setExporting(prev => ({ ...prev, [name]: true }));
    const records = await fetchAll(name);
    downloadJSON({ entity: name, schema: schemas[name], count: records.length, records }, `v107_${name}.json`);
    setExported(prev => ({ ...prev, [name]: true }));
    setExporting(prev => ({ ...prev, [name]: false }));
  };

  const handleExportAllSchemas = () => {
    downloadJSON(schemas, "v107_ALL_SCHEMAS.json");
  };

  const handleExportAll = async () => {
    setExporting(prev => ({ ...prev, _all: true }));
    const fullExport = {};
    for (const name of ENTITIES) {
      const records = await fetchAll(name);
      fullExport[name] = {
        schema: schemas[name],
        count: records.length,
        records
      };
    }
    downloadJSON(fullExport, "v107_FULL_EXPORT.json");
    setExporting(prev => ({ ...prev, _all: false }));
    setExported(prev => ({ ...prev, _all: true }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="mr-3 text-lg">טוען נתונים...</span>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">גישה מוגבלת — אדמין בלבד</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Database className="w-8 h-8 text-primary" />
              ייצוא נתוני המערכת
            </h1>
            <p className="text-gray-600 mt-1">הורד את כל הנתונים והסכמות כ-JSON</p>
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          <Card className="border-2 border-primary">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">ייצוא מלא — כל הנתונים + סכמות</h2>
                <p className="text-gray-600 text-sm">קובץ JSON אחד עם הכל (עלול לקחת כמה שניות)</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleExportAllSchemas}>
                  <Download className="w-4 h-4 ml-2" />
                  סכמות בלבד
                </Button>
                <Button onClick={handleExportAll} disabled={exporting._all}>
                  {exporting._all ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : exported._all ? (
                    <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                  ) : (
                    <Download className="w-4 h-4 ml-2" />
                  )}
                  {exporting._all ? "מייצא..." : "ייצוא מלא"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-bold mb-4">ייצוא לפי ישות</h2>
        <div className="grid gap-3">
          {ENTITIES.map(name => (
            <Card key={name}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{name}</span>
                  <Badge variant="secondary">{counts[name] ?? "..."} רשומות</Badge>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExportEntity(name)}
                  disabled={exporting[name]}
                >
                  {exporting[name] ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : exported[name] ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}