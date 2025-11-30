import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, FileText, ArrowLeft, BarChart2 } from "lucide-react";

const sampleImages = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

export default function SampleReport() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart2 className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-600 uppercase">התוצר הסופי</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              הצצה לדו"ח ונטורה-107 שלך
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              בסיום הניתוח, תקבל דו"ח מקיף הכולל ניתוח גרפי של הפרופיל האישי והמקצועי שלך, זיהוי חוזקות, מיפוי חסמים, המלצות לתחומים עסקיים מתאימים, ותוכנית פעולה מותאמת אישית שתעזור לך לצאת לדרך.
            </p>
            <a 
              href="/sample-report.pdf" // Placeholder link
              download
              className="inline-block"
            >
              <Button size="lg">
                <Download className="w-5 h-5 ml-2" />
                הורד דו"ח לדוגמה (PDF)
              </Button>
            </a>
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[450px]">
            <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden shadow-lg">
              <img src={sampleImages[0]} alt="Sample Report 1" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-lg">
              <img src={sampleImages[1]} alt="Sample Report 2" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden shadow-lg">
              <img src={sampleImages[2]} alt="Sample Report 3" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}