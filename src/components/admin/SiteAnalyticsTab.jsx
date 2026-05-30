import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Users, Eye, Clock, RefreshCw, BarChart3 } from "lucide-react";
import { getAnalyticsTraffic } from "@/functions/getAnalyticsTraffic";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import DemographicsSection from "./DemographicsSection";

const CHANNEL_COLORS = {
  "Organic Search": "#22c55e",
  "Direct": "#3b82f6",
  "Paid Search": "#f59e0b",
  "Referral": "#8b5cf6",
  "Social": "#ec4899",
  "Email": "#06b6d4",
  "Display": "#f97316",
  "Unassigned": "#94a3b8",
  "Organic Social": "#a855f7",
  "Paid Social": "#e11d48",
  "(Other)": "#6b7280"
};

function getChannelColor(channel) {
  return CHANNEL_COLORS[channel] || "#6b7280";
}

export default function SiteAnalyticsTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalyticsTraffic({});
      setData(res.data);
    } catch (err) {
      setError(err.message || "שגיאה בטעינת נתונים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="mr-3 text-gray-600">טוען נתוני אנליטיקס...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">שגיאה בטעינת נתונים</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> נסה שוב
          </Button>
        </CardContent>
      </Card>
    );
  }

  const report = data?.report;
  const rows = report?.rows || [];

  if (rows.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">אין נתוני תנועה עדיין</h3>
          <p className="text-gray-600 mb-2">קוד ה-Google Analytics הותקן כעת באתר.</p>
          <p className="text-gray-500 text-sm">נתוני תנועה יתחילו להופיע כאן תוך 24-48 שעות.</p>
          <Button onClick={fetchData} variant="outline" className="gap-2 mt-4">
            <RefreshCw className="w-4 h-4" /> רענן
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Aggregate data by channel
  const channelMap = {};
  const monthMap = {};
  let totalSessions = 0, totalUsers = 0, totalPageViews = 0;

  rows.forEach(row => {
    const channel = row.dimensionValues[0].value;
    const month = row.dimensionValues[1].value;
    const sessions = parseInt(row.metricValues[0].value) || 0;
    const users = parseInt(row.metricValues[1].value) || 0;
    const newUsers = parseInt(row.metricValues[2].value) || 0;
    const pageViews = parseInt(row.metricValues[3].value) || 0;
    const avgDuration = parseFloat(row.metricValues[4].value) || 0;
    const bounceRate = parseFloat(row.metricValues[5].value) || 0;

    totalSessions += sessions;
    totalUsers += users;
    totalPageViews += pageViews;

    if (!channelMap[channel]) {
      channelMap[channel] = { channel, sessions: 0, users: 0, newUsers: 0, pageViews: 0, avgDuration: 0, bounceRate: 0, count: 0 };
    }
    channelMap[channel].sessions += sessions;
    channelMap[channel].users += users;
    channelMap[channel].newUsers += newUsers;
    channelMap[channel].pageViews += pageViews;
    channelMap[channel].avgDuration += avgDuration * sessions;
    channelMap[channel].bounceRate += bounceRate * sessions;
    channelMap[channel].count += sessions;

    if (!monthMap[month]) {
      monthMap[month] = { month, organic: 0, paid: 0, direct: 0, social: 0, other: 0, total: 0 };
    }
    const lowerChannel = channel.toLowerCase();
    if (lowerChannel.includes("organic search")) monthMap[month].organic += sessions;
    else if (lowerChannel.includes("paid")) monthMap[month].paid += sessions;
    else if (lowerChannel.includes("direct")) monthMap[month].direct += sessions;
    else if (lowerChannel.includes("social")) monthMap[month].social += sessions;
    else monthMap[month].other += sessions;
    monthMap[month].total += sessions;
  });

  // Finalize averages
  Object.values(channelMap).forEach(ch => {
    if (ch.count > 0) {
      ch.avgDuration = Math.round(ch.avgDuration / ch.count);
      ch.bounceRate = Math.round((ch.bounceRate / ch.count) * 100) / 100;
    }
  });

  const channelData = Object.values(channelMap).sort((a, b) => b.sessions - a.sessions);
  const monthData = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));

  const pieData = channelData.map(ch => ({
    name: ch.channel,
    value: ch.sessions,
    fill: getChannelColor(ch.channel)
  }));

  const organicTotal = channelData.filter(c => c.channel.toLowerCase().includes("organic")).reduce((s, c) => s + c.sessions, 0);
  const paidTotal = channelData.filter(c => c.channel.toLowerCase().includes("paid")).reduce((s, c) => s + c.sessions, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={fetchData} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" /> רענן נתונים
        </Button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">תנועת האתר — 90 ימים אחרונים</h2>
          <p className="text-sm text-gray-500">Property: {data?.propertyId}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
            <div className="text-xs text-gray-500">סשנים</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-5 h-5 text-green-500 mx-auto mb-1" />
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
            <div className="text-xs text-gray-500">משתמשים</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <div className="text-2xl font-bold">{totalPageViews.toLocaleString()}</div>
            <div className="text-xs text-gray-500">צפיות בדף</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-5 h-5 rounded-full bg-green-100 mx-auto mb-1 flex items-center justify-center text-xs font-bold text-green-700">O</div>
            <div className="text-2xl font-bold text-green-600">{organicTotal.toLocaleString()}</div>
            <div className="text-xs text-gray-500">אורגני</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="w-5 h-5 rounded-full bg-yellow-100 mx-auto mb-1 flex items-center justify-center text-xs font-bold text-yellow-700">P</div>
            <div className="text-2xl font-bold text-yellow-600">{paidTotal.toLocaleString()}</div>
            <div className="text-xs text-gray-500">בתשלום</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Channel Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-base">התפלגות תנועה לפי ערוץ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(val) => val.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right text-base">תנועה חודשית — אורגני vs בתשלום</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="organic" name="אורגני" fill="#22c55e" />
                <Bar dataKey="paid" name="בתשלום" fill="#f59e0b" />
                <Bar dataKey="direct" name="ישיר" fill="#3b82f6" />
                <Bar dataKey="social" name="חברתי" fill="#ec4899" />
                <Bar dataKey="other" name="אחר" fill="#94a3b8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Demographics & Geo */}
      <DemographicsSection
        genderReport={data?.genderReport}
        ageReport={data?.ageReport}
        geoReport={data?.geoReport}
      />

      {/* Channel Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right text-base">פירוט לפי ערוץ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" dir="rtl">
              <thead>
                <tr className="border-b">
                  <th className="text-right py-2 px-3 font-medium text-gray-700">ערוץ</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">סשנים</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">משתמשים</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">חדשים</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">צפיות</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">זמן ממוצע</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">Bounce</th>
                </tr>
              </thead>
              <tbody>
                {channelData.map((ch, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2 flex-row-reverse">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getChannelColor(ch.channel) }} />
                        <span className="font-medium">{ch.channel}</span>
                      </div>
                    </td>
                    <td className="text-center py-2 px-3">{ch.sessions.toLocaleString()}</td>
                    <td className="text-center py-2 px-3">{ch.users.toLocaleString()}</td>
                    <td className="text-center py-2 px-3">{ch.newUsers.toLocaleString()}</td>
                    <td className="text-center py-2 px-3">{ch.pageViews.toLocaleString()}</td>
                    <td className="text-center py-2 px-3">{Math.floor(ch.avgDuration / 60)}:{String(ch.avgDuration % 60).padStart(2, '0')}</td>
                    <td className="text-center py-2 px-3">
                      <Badge variant="outline" className={ch.bounceRate > 0.7 ? "text-red-600" : ch.bounceRate > 0.5 ? "text-yellow-600" : "text-green-600"}>
                        {(ch.bounceRate * 100).toFixed(1)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}