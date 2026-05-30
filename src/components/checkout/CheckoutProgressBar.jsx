import React from "react";
import { Check } from "lucide-react";

const steps = [
  { key: "questionnaire", label: "מילוי שאלון" },
  { key: "choose", label: "בחירת חבילה" },
  { key: "payment", label: "תשלום" },
  { key: "done", label: "סיום" },
];

export default function CheckoutProgressBar({ currentStep }) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10" dir="rtl">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isCurrent
                      ? "bg-primary text-white ring-4 ring-primary/20"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isCurrent
                      ? "text-primary font-bold"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-1 h-0.5 -mt-5">
                  <div
                    className={`h-full rounded-full transition-all ${
                      i < currentIndex ? "bg-primary" : "bg-border"
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}