import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, GitCompare, BarChart3 } from 'lucide-react';
import ReportComparison from '@/components/analytics/ReportComparison';
import TrendsChart from '@/components/analytics/TrendsChart';

export default function AdminAnalytics() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [viewMode, setViewMode] = useState('comparison'); // comparison, trends
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      if (currentUser?.role !== 'admin') {
        window.location.href = '/';
        return;
      }
      
      const allReports = await base44.entities.GeneratedReport.list('-created_date');
      setReports(allReports);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReportSelect = (reportId) => {
    setSelectedReports(prev => {
      if (prev.includes(reportId)) {
        return prev.filter(id => id !== reportId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), reportId];
      }
      return [...prev, reportId];
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              ניתוח מתקדם של דוחות
            </CardTitle>
            <p className="text-gray-600 mt-2">
              השוואה בין דוחות, זיהוי מגמות, וניתוח דפוסים
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <Button
                onClick={() => setViewMode('comparison')}
                variant={viewMode === 'comparison' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <GitCompare className="w-4 h-4" />
                השוואת דוחות
              </Button>
              <Button
                onClick={() => setViewMode('trends')}
                variant={viewMode === 'trends' ? 'default' : 'outline'}
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                מגמות לאורך זמן
              </Button>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">בחר דוחות לניתוח (עד 3)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.slice(0, 20).map(report => (
                  <Card
                    key={report.id}
                    className={`cursor-pointer transition-all ${
                      selectedReports.includes(report.id)
                        ? 'border-blue-600 border-2 bg-blue-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => handleReportSelect(report.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{report.user_name}</p>
                          <p className="text-sm text-gray-600">{report.report_id}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(report.created_date).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                        {selectedReports.includes(report.id) && (
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {selectedReports.indexOf(report.id) + 1}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {selectedReports.length > 0 && (
          <div>
            {viewMode === 'comparison' && (
              <ReportComparison
                reportIds={selectedReports}
                reports={reports.filter(r => selectedReports.includes(r.id))}
              />
            )}
            
            {viewMode === 'trends' && (
              <TrendsChart
                reportIds={selectedReports}
                reports={reports.filter(r => selectedReports.includes(r.id))}
              />
            )}
          </div>
        )}
        
        {selectedReports.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                בחר דוחות מהרשימה למעלה כדי להתחיל ניתוח
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}