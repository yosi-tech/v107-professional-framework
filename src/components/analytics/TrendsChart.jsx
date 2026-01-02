import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TrendsChart({ reports }) {
  const [selectedDomain, setSelectedDomain] = useState('execution');
  
  if (!reports || reports.length === 0) return null;
  
  const domains = {
    execution: 'ביצוע',
    digital: 'דיגיטל',
    finance: 'פיננסים',
    marketing: 'שיווק',
    management: 'ניהול',
    vision: 'חזון'
  };
  
  // מיון דוחות לפי תאריך
  const sortedReports = [...reports].sort((a, b) => 
    new Date(a.created_date) - new Date(b.created_date)
  );
  
  // הכנת נתונים לגרף קווי
  const trendData = sortedReports.map((report, idx) => ({
    index: idx + 1,
    date: new Date(report.created_date).toLocaleDateString('he-IL'),
    name: report.user_name,
    score: report.domain_scores?.[selectedDomain]?.score || 0
  }));
  
  // חישוב ממוצע
  const averageScore = trendData.reduce((sum, item) => sum + item.score, 0) / trendData.length;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">מגמות לאורך זמן</CardTitle>
            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(domains).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">ציון ממוצע בתחום {domains[selectedDomain]}:</p>
            <p className="text-3xl font-bold text-blue-600">{averageScore.toFixed(1)}</p>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded shadow-lg">
                        <p className="font-semibold">{payload[0].payload.name}</p>
                        <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
                        <p className="text-lg font-bold text-blue-600">
                          {payload[0].value.toFixed(1)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                name={`ציון ${domains[selectedDomain]}`}
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">פרטי דוחות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedReports.map((report, idx) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-semibold">{report.user_name}</p>
                  <p className="text-sm text-gray-600">{report.report_id}</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">
                    {new Date(report.created_date).toLocaleDateString('he-IL')}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {report.domain_scores?.[selectedDomain]?.score?.toFixed(1) || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}