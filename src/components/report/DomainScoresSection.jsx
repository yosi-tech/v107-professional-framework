import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="mb-8 border-t-4 border-t-purple-600">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          {isHebrew ? 'ציוני התחומים' : 'Domain Scores'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
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
        <div className="grid md:grid-cols-2 gap-4">
          {chartData.map((domain, index) => (
            <Card 
              key={index} 
              className={`border-r-4 ${
                domain.red_flag 
                  ? 'border-r-red-500 bg-red-50' 
                  : domain.yellow_flag 
                  ? 'border-r-amber-500 bg-amber-50'
                  : domain.band === 'high'
                  ? 'border-r-green-500 bg-green-50'
                  : 'border-r-blue-500 bg-blue-50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">
                      {domain.name}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {domain.red_flag && (
                        <Badge className="bg-red-600 text-white text-xs">
                          🔴 {isHebrew ? 'דגל אדום' : 'Red Flag'}
                        </Badge>
                      )}
                      {domain.yellow_flag && !domain.red_flag && (
                        <Badge className="bg-amber-600 text-white text-xs">
                          🟡 {isHebrew ? 'דגל צהוב' : 'Yellow Flag'}
                        </Badge>
                      )}
                      {!domain.red_flag && !domain.yellow_flag && (
                        <Badge className="bg-green-600 text-white text-xs">
                          🟢 {isHebrew ? 'תקין' : 'Normal'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-4xl font-black ${
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
                    <div className="text-xs text-gray-600 mt-1">
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