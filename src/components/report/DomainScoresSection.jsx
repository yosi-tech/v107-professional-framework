import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function DomainScoresSection({ domainScores, language }) {
  if (!domainScores || Object.keys(domainScores).length === 0) return null;

  const isHebrew = language === 'he';

  // Prepare data for charts
  const chartData = Object.entries(domainScores).map(([key, data]) => ({
    name: data.name || key,
    score: Math.round(data.score || 0),
    band: data.band,
    red_flag: data.red_flag,
    yellow_flag: data.yellow_flag
  }));

  // Get color based on band and flags
  const getColor = (item) => {
    if (item.red_flag) return '#ef4444'; // red
    if (item.yellow_flag) return '#f59e0b'; // amber
    if (item.band === 'high') return '#22c55e'; // green
    if (item.band === 'mid') return '#3b82f6'; // blue
    return '#64748b'; // slate
  };

  return (
    <Card className="mb-8 border-none shadow-2xl bg-gradient-to-br from-slate-50 to-purple-50">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-3xl flex items-center gap-3 font-black">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <BarChart3 className="w-7 h-7" />
          </div>
          {isHebrew ? '📊 ציוני התחומים' : '📊 Domain Scores'}
        </CardTitle>
        <p className="text-white/90 mt-2">
          {isHebrew ? 'הערכה כמותית של 6 תחומי הליבה' : 'Quantitative Assessment of 6 Core Domains'}
        </p>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        {/* Radar Chart */}
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis 
                dataKey="name" 
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar 
                name={isHebrew ? 'ציון' : 'Score'} 
                dataKey="score" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={150}
                tick={{ fill: '#475569', fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {chartData.map((domain, index) => (
            <Card 
              key={index} 
              className={`border-none shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] ${
                domain.red_flag 
                  ? 'bg-gradient-to-br from-red-50 to-red-100' 
                  : domain.yellow_flag 
                  ? 'bg-gradient-to-br from-amber-50 to-amber-100'
                  : domain.band === 'high'
                  ? 'bg-gradient-to-br from-green-50 to-green-100'
                  : 'bg-gradient-to-br from-blue-50 to-blue-100'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-black text-xl text-gray-900 mb-3">
                      {domain.name}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {domain.red_flag && (
                        <Badge className="bg-red-600 text-white text-sm px-3 py-1 shadow-md">
                          🔴 {isHebrew ? 'דגל אדום' : 'Red Flag'}
                        </Badge>
                      )}
                      {domain.yellow_flag && !domain.red_flag && (
                        <Badge className="bg-amber-600 text-white text-sm px-3 py-1 shadow-md">
                          🟡 {isHebrew ? 'דגל צהוב' : 'Yellow Flag'}
                        </Badge>
                      )}
                      {!domain.red_flag && !domain.yellow_flag && (
                        <Badge className="bg-green-600 text-white text-sm px-3 py-1 shadow-md">
                          🟢 {isHebrew ? 'תקין' : 'Normal'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-6xl font-black mb-2 ${
                      domain.red_flag 
                        ? 'text-red-600' 
                        : domain.yellow_flag 
                        ? 'text-amber-600'
                        : domain.band === 'high'
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}>
                      {domain.score}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      {isHebrew ? 'מתוך 100' : 'out of 100'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}