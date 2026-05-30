import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "תוך כמה זמן מקבלים את הדו״ח?",
    a: "דו״ח רגיל מוכן תוך עד 7 ימי עבודה. דו״ח מואץ מוכן תוך 3 ימי עבודה. מיד לאחר ההפקה תקבלו הודעה למייל עם קישור לצפייה."
  },
  {
    q: "מה בדיוק כולל הדו״ח?",
    a: "הדו״ח כולל ניתוח מעמיק של 11 ממדים מקצועיים, פרופיל יכולות אישי, גרפים והשוואות, המלצות מותאמות אישית ותוכנית פעולה מעשית."
  },
  {
    q: "האם אפשר לקבל החזר?",
    a: "אנו מציעים אחריות שביעות רצון. אם אינכם מרוצים מהדו״ח, ניתן לפנות אלינו תוך 14 יום ונבחן את הפנייה."
  },
  {
    q: "האם המידע שלי מאובטח?",
    a: "בהחלט. כל הנתונים מוצפנים ומאובטחים. אנו מחויבים לפרטיות מלאה ולא משתפים מידע אישי עם צדדים שלישיים."
  },
  {
    q: "האם יש תמיכה אם יש לי שאלות?",
    a: "כן! צוות השירות שלנו זמין ותוכלו לפנות אלינו בכל שאלה דרך עמוד ״צור קשר״ באתר."
  },
  {
    q: "מי עומד מאחורי V107?",
    a: "V107 פותחה על ידי צוות מומחים בתחום פיתוח קריירה ומשאבי אנוש, בשילוב טכנולוגיה מתקדמת ושיטות מוכחות מהעולם המקצועי."
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-background" dir="rtl">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-14">
          <span className="text-primary font-semibold text-sm tracking-wide mb-3 block">שאלות ותשובות</span>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 text-foreground">שאלות נפוצות</h2>
          <p className="text-muted-foreground text-lg">כל מה שצריך לדעת לפני שמתחילים</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-white rounded-2xl border border-border px-6 shadow-sm">
              <AccordionTrigger className="text-right font-semibold text-foreground hover:no-underline py-5 text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}