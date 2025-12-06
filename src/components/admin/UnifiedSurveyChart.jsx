import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedDoughnutRace from './AnimatedDoughnutRace';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const surveyQuestions = [
  {
    id: 'q1',
    title: 'שאלה 1: מה הסיבה העיקרית שבחרת שלא לרכוש עכשיו?',
    question: 'ניתוח התפלגות הסיבות לאי-רכישה',
    colors: [
      'rgba(239, 68, 68, 0.9)',
      'rgba(251, 146, 60, 0.9)',
      'rgba(245, 158, 11, 0.9)',
      'rgba(59, 130, 246, 0.9)',
      'rgba(168, 85, 247, 0.9)'
    ]
  },
  {
    id: 'q2',
    title: 'שאלה 2: באיזה מחיר היית שוקל/ת לרכוש?',
    question: 'ניתוח נקודת המחיר האופטימלית',
    colors: [
      'rgba(34, 197, 94, 0.9)',
      'rgba(16, 185, 129, 0.9)',
      'rgba(20, 184, 166, 0.9)',
      'rgba(6, 182, 212, 0.9)',
      'rgba(14, 165, 233, 0.9)'
    ]
  },
  {
    id: 'q3',
    title: 'שאלה 3: מה היה יכול לשכנע אותך לרכוש?',
    question: 'גורמי השכנוע המרכזיים',
    colors: [
      'rgba(168, 85, 247, 0.9)',
      'rgba(147, 51, 234, 0.9)',
      'rgba(126, 34, 206, 0.9)',
      'rgba(109, 40, 217, 0.9)',
      'rgba(91, 33, 182, 0.9)'
    ]
  }
];

export default function UnifiedSurveyChart({ surveyResponses }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const responses = surveyResponses.map(s => s.responses?.[currentQuestion.id]).filter(Boolean);
  
  const goToNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % surveyQuestions.length);
  };
  
  const goToPrev = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + surveyQuestions.length) % surveyQuestions.length);
  };

  if (surveyResponses.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-500">אין תוצאות סקר להצגה</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Question Selector */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              className="flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 text-center">
              <CardTitle className="text-lg">{currentQuestion.title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{currentQuestion.question}</p>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Question indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {surveyQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentQuestionIndex 
                    ? 'w-8 bg-blue-600' 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Chart Display */}
      <AnimatedDoughnutRace
        key={currentQuestion.id}
        title={currentQuestion.title}
        question={currentQuestion.question}
        responses={responses}
        colors={currentQuestion.colors}
      />
    </div>
  );
}