import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  ArrowLeft,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Zap,
  BarChart3,
  FileText,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/components/i18n/useTranslation";
import { motion } from "framer-motion";

export default function Home() {
  const { t, language } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await base44.entities.Testimonial.list('-created_date');
        setTestimonials(data);
      } catch (e) {}
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen overflow-hidden" dir="rtl">
      <style>{`
        .hero-bg {
          background: radial-gradient(ellipse at center, #1a2a6c 0%, #0d1b4b 40%, #060d2e 100%);
          position: relative;
          overflow: hidden;
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.4;
        }
        .dark-section {
          background: linear-gradient(180deg, #0d1b4b 0%, #060d2e 100%);
        }
        .gold-text { color: #d4a843; }
        .gold-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          font-weight: 700;
          border: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(245,158,11,0.4);
        }
        .gold-btn:hover {
          background: linear-gradient(135deg, #d97706, #b45309);
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(245,158,11,0.5);
          color: white;
        }
        .stat-card {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
        }
        .step-card {
          background: white;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          transition: all 0.3s ease;
        }
        .step-card:hover {
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          transform: translateY(-4px);
        }
        .benefit-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          transition: all 0.3s ease;
        }
        .benefit-card:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(212,168,67,0.4);
        }
        .archetype-section {
          background: linear-gradient(135deg, #0d1b4b 0%, #1a2a6c 50%, #0d1b4b 100%);
          position: relative;
        }
        .archetype-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .cta-section {
          background: linear-gradient(135deg, #0d1b4b 0%, #1a2a6c 100%);
          position: relative;
        }
        .cta-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 35px 35px;
        }
        .orange-icon-bg {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 12px;
          padding: 10px;
          display: inline-flex;
        }
      `}</style>

      {/* ===== SECTION 1: HERO ===== */}
      <section className="hero-bg min-h-screen flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full"
            style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.4)' }}>
            <CheckCircle className="w-4 h-4 gold-text" />
            <span className="text-sm gold-text font-semibold">מבוסס על 5 שנות מחקר אינטנסיבי</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight text-white">
            מרגישים תקועים מקצועית...<br />
            <span className="gold-text">לא יודעים באיזה מקצוע לבחור ?</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            דיי לדחות | דאגי/י לעצמך ולעתידך - מלאו את השאלון ותופתעו מרמת הדוח האישי שתקבלו.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}>
            <Link to={createPageUrl("Questionnaire")}>
              <Button size="lg" className="gold-btn text-lg px-10 py-6 rounded-2xl">
                <Zap className="w-5 h-5 ml-2" />
                חקש והתחל את השאלון עכשיו
              </Button>
            </Link>
          </motion.div>

          {/* Trust line */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-sm text-blue-300">
            <CheckCircle className="w-4 h-4 inline ml-1" />
            חזרנו לצמוח! - בטוח קרא על דעת של ריבוי ומפרסמים
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {[
              { value: '4952', label: 'משתתפים פעילים' },
              { value: 'שאלון יכולות\nאמריקאי', label: 'תקן בינלאומי' },
              { value: '11', label: 'ממדי יכולות נמדדים' },
              { value: '5 ימים\nלקבלת הדו"ח', label: 'זמן אספקה' },
            ].map((stat, i) => (
              <div key={i} className="stat-card p-5 text-center">
                <div className="text-2xl md:text-3xl font-black text-white whitespace-pre-line leading-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-xs text-blue-300">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION 2: HOW IT WORKS ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">איך זה עובד?</h2>
            <p className="text-lg text-gray-600">3 צעדים פשוטים לקבלת הדוח המקצועי שלך</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                num: '1',
                title: 'מתחילים בתחילך!',
                desc: 'מלאו את השאלון בנוחות, בפרטיות ובקצב שלכם. כ-20 דקות שישנו את הכיוון המקצועי שלכם.',
                time: 'כ-20 דקות'
              },
              {
                icon: BarChart3,
                num: '2',
                title: 'קבלו ניתוח יכולות מקצועי, חשוב לדעת איך לחשתמר ולהגיע לפסגות הנחשקים',
                desc: 'האלגוריתם שלנו מנתח את התשובות שלכם על פני 11 ממדים ומייצר פרופיל ייחודי.',
                time: 'עד 5 ימים'
              },
              {
                icon: FileText,
                num: '3',
                title: 'קיבלו תוכנית פעולה מקצועית אישית שלך!',
                desc: 'דוח מפורט הכולל ניתוח יכולות, המלצות לכיוון מקצועי ותוכנית פעולה.',
                time: 'מיד בסיום'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}>
                <div className="step-card p-8 h-full relative">
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    {step.num}
                  </div>
                  <div className="orange-icon-bg mb-6 w-14 h-14 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3 leading-snug">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{step.desc}</p>
                  <div className="flex items-center gap-2 text-amber-600 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {step.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl("Questionnaire")}>
              <Button size="lg" className="gold-btn text-lg px-10 py-5 rounded-2xl">
                התחל עכשיו - חינם!
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: TESTIMONIALS ===== */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">מה אומרים עלינו</h2>
              <p className="text-gray-500">סיפורות הצלחה אמיתיות</p>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-3xl border border-gray-100 shadow-xl bg-white">
                <div className="p-12 md:p-16 text-center">
                  <div className="text-8xl text-amber-400 font-serif leading-none mb-6 opacity-30">99</div>
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
                    "{testimonials[currentSlide]?.quote_he}"
                  </p>
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonials[currentSlide]?.stars || 5)].map((_, i) => (
                      <Star key={i} className="w-6 h-6 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xl">
                      {testimonials[currentSlide]?.name?.charAt(0)}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{testimonials[currentSlide]?.name}</p>
                      <p className="text-gray-500 text-sm">{testimonials[currentSlide]?.title_he}</p>
                    </div>
                  </div>
                </div>
              </div>

              {testimonials.length > 1 && (
                <>
                  <button onClick={prevSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-lg">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <button onClick={nextSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center hover:bg-amber-600 transition-colors shadow-lg">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, i) => (
                      <button key={i} onClick={() => setCurrentSlide(i)}
                        className={`h-2 rounded-full transition-all ${i === currentSlide ? 'w-8 bg-amber-500' : 'w-2 bg-gray-300'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION 4: ARCHETYPE + V107 CONTRIBUTIONS ===== */}
      <section className="archetype-section py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Archetype */}
          <div className="text-center mb-16">
            <p className="text-amber-400 font-semibold mb-2 text-sm uppercase tracking-wider">הארכיטיפ שלכם (The Action Matrix)</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              גלה את מפת היכולות האמיתית שלך
            </h2>
            <p className="text-blue-200 max-w-2xl mx-auto leading-relaxed">
              הניתוח המקצועי שלנו יחשוף לכם תמונה שלמה, ממשית, אין דיאק אחד דומה בין הדוחות שמייצרים AI אנלרנטית.
              מוצאים בין פ- ס (פוטנציאל) מחזיק מפתח שיש לו אלטרנטיבה מהטקסטות, ויותר לנו לאמור לכם מה לעשות.
            </p>
          </div>

          {/* What's in the report */}
          <div className="mb-16">
            <h3 className="text-2xl font-black text-white text-center mb-8">מה כולל הדוח המקצועי האישי שלך?</h3>
            <p className="text-blue-300 text-center mb-8 text-sm">כולל גם ניתוח קצר לתיאשי - 1 מתוך 107 שאלות ו- 11 ממדים</p>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                { icon: Target, title: 'ניתוח מקצועי של הנקות וחסמים', desc: 'זיהוי חוזקות ופרמטרים חיניים המשפיעים על הביצועים והפוטנציאל' },
                { icon: TrendingUp, title: 'מפה קולינות מקצועיות ומיומנויות', desc: 'בניית תמונה כוללת של יכולות ליבה, כישורים נרכשים ותחומי שיפור פוטנציאליים' },
                { icon: BookOpen, title: 'ניתוח קוגניטיבי ואסטרטגי (Gap Analysis)', desc: 'זיהוי הפערים - הכל מסביר אותו - ומצביע על ההזדמנות הטמונה בהם' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="benefit-card p-6 flex items-start gap-4">
                  <div className="orange-icon-bg flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-blue-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* V107 Contributions */}
          <div className="border-t border-white/10 pt-16">
            <h3 className="text-2xl md:text-3xl font-black text-white text-center mb-10">
              התרומות המקצועיות של V107 עבורך:
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { num: '1', title: 'בהירות בהחלות', desc: 'השאלון מייצר תמונה מלאה שמאפשרת לכם לקבל החלטות מקצועיות מושכלות ובטוחות יותר' },
                { num: '2', title: 'שיחה אותנטית', desc: 'יש שפה משל V107 שמאפשר לנו לשוחח איתכם בשפה מקצועית שמתחילה מהנקודה האמיתית' },
                { num: '3', title: 'יישל מקצועי', desc: 'קבלת כלים לנהל את הצמיחה מהמקצועית בעצמכם ולהגיע לפסגות שאתם חולמים' },
              ].map((item, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="benefit-card p-8 text-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-xl mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    {item.num}
                  </div>
                  <h4 className="font-bold text-white mb-3 text-lg">{item.title}</h4>
                  <p className="text-blue-300 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* V107 BOOSTER */}
          <div className="mt-16 p-8 md:p-12 rounded-3xl text-center"
            style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)' }}>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-6">
              מעבר מידיעה לפעולה: אנדות מוצר על שלנו "V107-BOOSTER"
            </h3>
            <p className="text-blue-200 leading-relaxed max-w-3xl mx-auto mb-4">
              מחירם של 30 מחירים לכם פניות (30 לב לי ניתן לשמור את יחסינו, לשלוח לנו את ה-IMPRESSION, על לשנות לפי השאלון מנסח של ה-
              פנייה וכבר אחרי כן מוציאים את מכרם לנו מה לעשות.
            </p>
            <p className="text-blue-200 leading-relaxed max-w-3xl mx-auto">
              כל יום V107-BOOSTER שולח לך אחת משלוש פניות (30 לב לי ניתן לשמור את יחסינו, לשלוח לנו את ה-IMPRESSION
              מדי כשמנסה להוציא את המשימות המותאמות בדרך הראשון לצמיחה ולהצלחה מקצועית שלכם.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: BENEFITS - "אל תהססו" ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">
              אל תהססו, תשקיעו בעצמכם, תעשו את הצעד הבא, זה ממש למענכם !
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              מכל כיוון, מכל גיל, מכל מצב. רמה קצת לאמות ריבוי לבנות הקריירה המקצועית המייחד שלכם.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: 'זהות את הכיוון ותתמקן שיפור המקצועי שלך', desc: 'אנחנו מסייעים לכם לזהות את החוזקות שלכם ולהבין את ערוצי הצמיחה הפוטנציאלים' },
              { icon: TrendingUp, title: 'קבל הכוונה מעולה מרחוק', desc: 'קבל ליווי מקצועי ממוקד, כל מכשיר ובכל זמן' },
              { icon: Award, title: 'דוח פסיכומטרי ברמה בינלאומית', desc: 'הדוח שלנו משתמש בכלים פסיכומטריים מובילים - ממד ליממד ועל-פי 11 ממדים מוכחים' },
              { icon: Users, title: 'תמיכה מקצועית ומותאמת - ניקרת', desc: 'קבל אחת קישורית ממוקד לניהול קריירה, עם משוב אישי ותמיכה שוטפת' },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex gap-5 items-start">
                <div className="orange-icon-bg flex-shrink-0 w-14 h-14 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: TRUST BADGES ===== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 text-center">
            {[
              { icon: FileText, title: 'שאלון חדשני ממאסר אישותר - מוכרז להתחיל', desc: 'כל שאלה בנויה על מחקר מעמיק ואסטרטגיה קוגניטיבית מוכחת, המאפשרת ניתוח מדויק' },
              { icon: Users, title: 'נבנה ע"י צוות מומחים בינלאומי עם מאות שנות ניסיון', desc: 'הצוות שלנו מורכב ממומחים בינלאומיים' },
              { icon: Award, title: 'אלפי לקוחות מרוצים', desc: 'אלפי אנשים כבר עשו את השאלון וקיבלו תובנות חשובות שהשפיעו על הקריירה שלהם' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="orange-icon-bg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-black text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 7 & 8: FINAL CTA ===== */}
      <section className="cta-section py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center">

            <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-8 animate-pulse" />

            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              אל תהססו, תשקיעו בעצמכם, תעשו את הצעד הבא,<br />
              <span className="gold-text">זה ממש למענכם !</span>
            </h2>

            <p className="text-blue-200 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
              הגיע הזמן של 30 דקות שלכם, לחשוב לאמות ריבוי, לקבל לאמות תוצאות, קבל אחת 
              מהתוכניות המקצועיות הטובות ביותר לשיפור הקריירה המקצועית שלכם.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              {[
                { title: 'דיוק מקסימלי', desc: 'ממוצע גבוה של דיוק בזיהוי יכולות' },
                { title: 'תוצאות מקצועיות', desc: 'הכלת ממצאים פרופ מקצועיים' },
                { title: 'לא מקור', desc: 'ייחוד מקצועי לכל משתמש' },
              ].map((item, i) => (
                <div key={i} className="benefit-card p-6 text-center">
                  <h4 className="font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-blue-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>

            <Link to={createPageUrl("Questionnaire")}>
              <Button size="lg" className="gold-btn text-xl px-14 py-7 rounded-2xl">
                <Zap className="w-6 h-6 ml-2" />
                יילוי השאלון חינם, התחל עכשיו !
              </Button>
            </Link>

            <p className="mt-6 text-blue-400 text-sm">
              ✓ ללא עלות ראשונית / ניתן לשלם בהמשך
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}