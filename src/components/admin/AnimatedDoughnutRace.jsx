import React, { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AnimatedDoughnutRace({ title, question, responses, colors = null }) {
  const chartRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);

  // Count responses
  const counts = {};
  responses.forEach(r => {
    counts[r] = (counts[r] || 0) + 1;
  });

  const sortedData = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const labels = sortedData.map(([answer]) => answer);
  const data = sortedData.map(([, count]) => count);
  const total = responses.length;

  // Color palettes
  const defaultColors = [
    'rgba(59, 130, 246, 0.9)',   // Blue
    'rgba(168, 85, 247, 0.9)',   // Purple
    'rgba(236, 72, 153, 0.9)',   // Pink
    'rgba(251, 146, 60, 0.9)',   // Orange
    'rgba(34, 197, 94, 0.9)',    // Green
    'rgba(245, 158, 11, 0.9)',   // Amber
    'rgba(239, 68, 68, 0.9)',    // Red
    'rgba(14, 165, 233, 0.9)',   // Sky
  ];

  const hoverColors = [
    'rgba(59, 130, 246, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(251, 146, 60, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(14, 165, 233, 1)',
  ];

  const chartData = {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: colors || defaultColors,
      hoverBackgroundColor: colors || hoverColors,
      borderWidth: 3,
      borderColor: '#ffffff',
      hoverBorderWidth: 5,
      hoverBorderColor: '#ffffff',
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeOutQuart',
      onComplete: () => setAnimationComplete(true)
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} תשובות (${percentage}%)`;
          }
        }
      }
    },
    onHover: (event, activeElements) => {
      if (activeElements.length > 0) {
        event.native.target.style.cursor = 'pointer';
      } else {
        event.native.target.style.cursor = 'default';
      }
    },
    onClick: (event, activeElements) => {
      if (activeElements.length > 0) {
        const index = activeElements[0].index;
        setSelectedIndex(selectedIndex === index ? null : index);
      }
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardTitle className="text-right text-xl">{title}</CardTitle>
        {question && (
          <p className="text-sm text-gray-600 text-right mt-2">{question}</p>
        )}
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Chart */}
          <div className="relative">
            <div className="max-w-md mx-auto">
              <Doughnut ref={chartRef} data={chartData} options={options} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900">{total}</div>
                <div className="text-sm text-gray-500">תשובות</div>
              </div>
            </div>
          </div>

          {/* Interactive Legend */}
          <div className="space-y-3">
            {sortedData.map(([answer, count], index) => {
              const percentage = ((count / total) * 100).toFixed(1);
              const isSelected = selectedIndex === index;
              const bgColor = (colors || defaultColors)[index];
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedIndex(selectedIndex === index ? null : index)}
                  className={`
                    p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 transform
                    ${isSelected 
                      ? 'border-blue-500 shadow-lg scale-105 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md bg-white'
                    }
                  `}
                  style={{
                    animation: animationComplete ? `slideIn 0.5s ease-out ${index * 0.1}s both` : 'none'
                  }}
                >
                  <div className="flex items-start justify-between gap-3 flex-row-reverse">
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 mb-2 flex-row-reverse">
                        <Badge 
                          className="text-xs font-bold px-2 py-1"
                          style={{ 
                            backgroundColor: bgColor,
                            color: '#fff'
                          }}
                        >
                          #{index + 1}
                        </Badge>
                        <p className="font-semibold text-sm text-gray-900">{answer}</p>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                        <div
                          className="absolute top-0 right-0 h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: bgColor,
                            animation: animationComplete ? 'none' : `growBar 1.5s ease-out ${index * 0.1}s both`
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-900">{percentage}%</span>
                        <span className="text-gray-500">{count} מתוך {total}</span>
                      </div>
                    </div>

                    {/* Indicator circle */}
                    <div 
                      className={`w-6 h-6 rounded-full border-4 flex-shrink-0 transition-all duration-300 ${
                        isSelected ? 'scale-125' : ''
                      }`}
                      style={{ 
                        backgroundColor: bgColor,
                        borderColor: isSelected ? bgColor : 'transparent'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes growBar {
            from {
              width: 0;
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}