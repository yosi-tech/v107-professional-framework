import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Testimonial.list('-created_date', 20)
      .then(setTestimonials)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-28 bg-white" dir="rtl">
        <div className="saas-container text-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) return null;

  return (
    <section className="py-28 bg-white" dir="rtl">
      <div className="saas-container">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary/50 font-semibold text-sm mb-4 block uppercase tracking-wider">
            מה אומרים עלינו
          </span>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            הסיפורים של <span className="text-gradient">המשתמשים שלנו</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            אלפי אנשים כבר גילו את הפוטנציאל שלהם דרך V107
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-border/60 p-7 shadow-sm hover:shadow-md hover:border-primary/15 transition-all duration-300 flex flex-col"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/85 text-sm leading-relaxed flex-1 mb-6">
                "{t.quote_he}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-sm">
                  {t.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.title_he}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}