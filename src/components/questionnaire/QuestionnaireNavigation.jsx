import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

export default function QuestionnaireNavigation({ 
  currentSection, 
  totalSections, 
  onPrevious, 
  onNext, 
  onSubmit, 
  isSubmitting, 
  language, 
  t 
}) {
  const isLastSection = currentSection === totalSections - 1;
  const isFirstSection = currentSection === 0;

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstSection}
        className="flex items-center gap-2">
        {language === 'he' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
        {t('questionnaire.prev_button')}
      </Button>

      <div className="flex gap-3">
        {isLastSection ? (
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gradient-accent text-white flex items-center gap-2">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {isSubmitting ? t('questionnaire.submitting_button') : t('questionnaire.submit_button')}
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="gradient-primary text-white flex items-center gap-2">
            {t('questionnaire.next_button')}
            {language === 'he' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        )}
      </div>
    </div>
  );
}