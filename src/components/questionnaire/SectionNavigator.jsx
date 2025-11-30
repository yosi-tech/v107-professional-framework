import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Check } from "lucide-react";

export default function SectionNavigator({ 
  sections, 
  currentSection, 
  onSectionChange, 
  responses, 
  language, 
  t 
}) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getSectionProgress = (sectionId) => {
    const sectionData = responses[sectionId];
    if (!sectionData) return 0;
    
    // Count filled fields in the section
    const fields = Object.values(sectionData).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null && v !== undefined && v !== '');
      }
      return value !== null && value !== undefined && value !== '';
    });
    
    return fields.length > 0 ? 'started' : 'empty';
  };

  const sectionTitles = t('questionnaire.sections');

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('questionnaire.section_navigator_title')}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {isExpanded ? t('questionnaire.hide_sections') : t('questionnaire.show_sections')}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {sections.map((section, index) => {
              const progress = getSectionProgress(section.id);
              const isCurrent = index === currentSection;
              const isCompleted = progress === 'started';
              
              return (
                <Button
                  key={section.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onSectionChange(index)}
                  className={`justify-start text-xs p-3 h-auto transition-all duration-200 ${
                    isCurrent 
                      ? 'bg-accent border-accent text-white hover:bg-accent/90 hover:text-white' 
                      : isCompleted 
                        ? 'border-green-300 bg-green-50 hover:bg-green-100 text-gray-900 hover:text-gray-900' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  dir={language === 'he' ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold ${
                      isCurrent 
                        ? 'border-white bg-white text-accent' 
                        : isCompleted 
                          ? 'border-green-500 bg-green-500 text-white' 
                          : 'border-gray-300 bg-white text-gray-600'
                    }`}>
                      {isCompleted && !isCurrent ? <Check className="w-3 h-3" /> : index + 1}
                    </div>
                    <span className="flex-1 font-medium text-right">
                      {sectionTitles[index]?.title || `Section ${index + 1}`}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}