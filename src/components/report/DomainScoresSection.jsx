import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DomainScoresSection({ domainScores, language }) {
  if (!domainScores || Object.keys(domainScores).length === 0) return null;

  const isHebrew = language === 'he';

  const chartData = Object.entries(domainScores).map(([key, data]) => ({
    name: data.name || key,
    score: Math.round(data.score || 0),
    band: data.band,
    red_flag: data.red_flag,
    yellow_flag: data.yellow_flag
  }));

  const getColor = (item) => {
    if (item.red_flag) return '#ef4444';
    if (item.yellow_flag) return '#f59e0b';
    if (item.band === 'high') return '#22c55e';
    if (item.band === 'mid') return '#3b82f6';
    return '#64748b';
  };

  const getFlagIcon = (item) => {
    if (item.red_flag) return '▲';
    return null;
  };

  return (
    <Card className="mb-8 border border-slate-200 shadow-sm bg-white" dir="rtl">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          {isHebrew ? 'מפת עוצמות (Strengths Map)' : 'Strengths Map'}
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">
          {isHebrew ? 'דו"ח מלא' : 'Full Report'}
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Left: Horizontal Bars */}
          <div className="flex-1 space-y-4 w-full">
            {chartData.map((domain, index) => {
              const color = getColor(domain);
              const flag = getFlagIcon(domain);
              return (
                <div key={index} className="flex items-center gap-3">
                  {/* Domain name */}
                  <div className="w-28 text-sm text-slate-700 font-medium text-right shrink-0 leading-tight">
                    {domain.name}
                  </div>
                  {/* Bar */}
                  <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${domain.score}%`, backgroundColor: color }}
                    />
                  </div>
                  {/* Score + flag */}
                  <div className="w-16 flex items-center gap-1 shrink-0">
                    <span className="text-sm font-bold text-slate-700">{domain.score}%</span>
                    {flag && (
                      <span className="text-xs text-amber-500 font-bold">{flag}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Pie Chart */}
          <div className="w-48 h-48 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="score"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(entry)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [`${value}%`, props.payload.name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}