import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const GENDER_LABELS = {
  male: "גברים",
  female: "נשים",
  "(not set)": "לא ידוע"
};

const GENDER_COLORS = {
  male: "#3b82f6",
  female: "#ec4899",
  "(not set)": "#94a3b8"
};

const AGE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

function parseRows(report, dimCount = 1) {
  const rows = report?.rows || [];
  return rows.map(row => ({
    dimensions: row.dimensionValues.map(d => d.value),
    users: parseInt(row.metricValues[0]?.value) || 0,
    sessions: parseInt(row.metricValues[1]?.value) || 0
  }));
}

export default function DemographicsSection({ genderReport, ageReport, geoReport }) {
  const genderRows = parseRows(genderReport);
  const ageRows = parseRows(ageReport);
  const geoRows = parseRows(geoReport);

  const genderData = genderRows.map(r => ({
    name: GENDER_LABELS[r.dimensions[0]] || r.dimensions[0],
    value: r.users,
    fill: GENDER_COLORS[r.dimensions[0]] || "#6b7280"
  }));

  const ageData = ageRows
    .filter(r => r.dimensions[0] !== "(not set)")
    .sort((a, b) => a.dimensions[0].localeCompare(b.dimensions[0]))
    .map(r => ({
      name: r.dimensions[0],
      users: r.users,
      sessions: r.sessions
    }));

  // Group geo by country
  const countryMap = {};
  const cityList = [];
  geoRows.forEach(r => {
    const country = r.dimensions[0];
    const city = r.dimensions[1];
    if (!countryMap[country]) countryMap[country] = { country, users: 0, sessions: 0 };
    countryMap[country].users += r.users;
    countryMap[country].sessions += r.sessions;
    if (city && city !== "(not set)") {
      cityList.push({ city, country, users: r.users, sessions: r.sessions });
    }
  });
  const countryData = Object.values(countryMap).sort((a, b) => b.sessions - a.sessions);
  const topCities = cityList.sort((a, b) => b.sessions - a.sessions).slice(0, 15);

  const hasGender = genderData.length > 0;
  const hasAge = ageData.length > 0;
  const hasGeo = countryData.length > 0;

  if (!hasGender && !hasAge && !hasGeo) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">נתוני דמוגרפיה וגאוגרפיה יופיעו כאן כשיצטברו.</p>
          <p className="text-xs text-gray-400 mt-1">יש להפעיל "Google Signals" ב-GA4 לקבלת נתוני מגדר וגיל.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800 text-right">דמוגרפיה וגאוגרפיה</h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gender */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-base">מגדר</CardTitle>
          </CardHeader>
          <CardContent>
            {hasGender ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {genderData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip formatter={(val) => val.toLocaleString()} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {genderData.map((g, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.fill }} />
                      <span>{g.name}: {g.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center text-sm py-8">אין נתוני מגדר</p>
            )}
          </CardContent>
        </Card>

        {/* Age */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-base">קבוצות גיל</CardTitle>
          </CardHeader>
          <CardContent>
            {hasAge ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={ageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={60} />
                  <Tooltip />
                  <Bar dataKey="users" name="משתמשים" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                    {ageData.map((_, i) => <Cell key={i} fill={AGE_COLORS[i % AGE_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center text-sm py-8">אין נתוני גיל</p>
            )}
          </CardContent>
        </Card>

        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-base">מדינות מובילות</CardTitle>
          </CardHeader>
          <CardContent>
            {hasGeo ? (
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {countryData.slice(0, 10).map((c, i) => {
                  const maxSessions = countryData[0].sessions;
                  const pct = Math.round((c.sessions / maxSessions) * 100);
                  return (
                    <div key={i} className="flex items-center gap-2 flex-row-reverse">
                      <span className="text-sm font-medium w-24 text-right truncate">{c.country}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-600 w-16 text-left">{c.sessions.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center text-sm py-8">אין נתוני מיקום</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Cities Table */}
      {topCities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-base">ערים מובילות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir="rtl">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2 px-3 font-medium text-gray-700">#</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">עיר</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-700">מדינה</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-700">משתמשים</th>
                    <th className="text-center py-2 px-3 font-medium text-gray-700">סשנים</th>
                  </tr>
                </thead>
                <tbody>
                  {topCities.map((c, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 text-gray-400">{i + 1}</td>
                      <td className="py-2 px-3 font-medium">{c.city}</td>
                      <td className="py-2 px-3 text-gray-600">{c.country}</td>
                      <td className="text-center py-2 px-3">{c.users.toLocaleString()}</td>
                      <td className="text-center py-2 px-3">
                        <Badge variant="outline">{c.sessions.toLocaleString()}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}