import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function ReportComparison({ reports }) {
  if (!reports || reports.length === 0) return null;
  
  // הכנת נתונים להשוואת ציוני תחומים
  const domainComparisonData = [];
  const domains = ['execution', 'digital', 'finance', 'marketing', 'management', 'vision'];
  const domainNames = {
    execution: 'ביצוע',
    digital: 'דיגיטל',
    finance: 'פיננסים',
    marketing: 'שיווק',
    management: 'ניהול',
    vision: 'חזון'
  };
  
  domains.forEach(domain => {
    const dataPoint = { domain: domainNames[domain] };
    reports.forEach((report, idx) => {
      const score = report.domain_scores?.[domain]?.score || 0;
      dataPoint[`report${idx + 1}`] = score;
      dataPoint[`name${idx + 1}`] = report.user_name;
    });
    domainComparisonData.push(dataPoint);
  });
  
  // נתונים לגרף רדאר
  const radarData = domainComparisonData.map(d => ({
    domain: d.domain,
    ...reports.reduce((acc, report, idx) => {
      acc[report.user_name] = d[`report${idx + 1}`];
      return acc;
    }, {})
  }));
  
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">השוואת ציוני תחומים</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={domainComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="domain" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {reports.map((report, idx) => (
                <Bar
                  key={report.id}
                  dataKey={`report${idx + 1}`}
                  name={report.user_name}
                  fill={colors[idx % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">תצוגת רדאר - השוואה כוללת</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" />
              <PolarRadiusAxis domain={[0, 100]} />
              {reports.map((report, idx) => (
                <Radar
                  key={report.id}
                  name={report.user_name}
                  dataKey={report.user_name}
                  stroke={colors[idx % colors.length]}
                  fill={colors[idx % colors.length]}
                  fillOpacity={0.3}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">פירוט מסלולים מומלצים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report, idx) => (
              <Card key={report.id} className="bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">{report.user_name}</h3>
                    <Badge style={{ backgroundColor: colors[idx % colors.length] }}>
                      {idx + 1}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">מסלול מומלץ:</p>
                      <p className="font-semibold">{report.recommended_booster_track || 'לא צוין'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">ארכיטיפ:</p>
                      <p className="font-semibold">{report.archetype || 'לא צוין'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">תאריך:</p>
                      <p className="text-sm">{new Date(report.created_date).toLocaleDateString('he-IL')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}