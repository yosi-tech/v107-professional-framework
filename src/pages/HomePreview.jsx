import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  FileText,
  BarChart3,
  Target,
  Zap,
  TrendingUp,
  Users,
  Clock,
  Award,
  Sparkles,
  Rocket,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  Quote,
  BookOpen } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/components/i18n/useTranslation";
import { motion } from "framer-motion";

export default function HomePreview() {
  const { t, language } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await base44.entities.Testimonial.list('-created_date');
        setTestimonials(data);
      } finally {
        setIsLoadingTestimonials(false);
      }
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

  const nextSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    if (testimonials.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const currentArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;

  const stepsData = [
  {
    icon: FileText,
    title: language === 'he' ? "שולחים לינק לשאלון מועמד" : "Send candidate questionnaire link",
    desc: language === 'he' ? "20 דקות מכל מכשיר" : "20 minutes from any device",
    time: language === 'he' ? "20 דקות" : "20 minutes"
  },
  {
    icon: BarChart3,
    title: language === 'he' ? "אלגוריתם העל שלנו מנתח" : "Our super algorithm analyzes",
    desc: language === 'he' ? "11 יכולות מקצועיות - הופכים לתמונת יכולות מלאה" : "11 professional capabilities",
    time: language === 'he' ? "תוך שעות" : "Within hours"
  },
  {
    icon: Rocket,
    title: language === 'he' ? "מקבלים דוח —\nמחליטים בביטחון" : "Receive report —\ndecide with confidence",
    desc: language === 'he' ? "גיוס מבוסס דאטה מליוני מועמדים" : "Data-driven recruitment",
    time: language === 'he' ? "24 שעות" : "24 hours"
  }];

  const benefitsData = language === 'he' ? [
  {
    icon: Target,
    title: "פרופיל יכולות מקצועי מפורט",
    desc: "מיפוי חוזקות ויכולות טעונות שיפור"
  },
  {
    icon: TrendingUp,
    title: "דוח סינון יכולות מהיר",
    desc: "24 שעות ממילוי השאלון"
  },
  {
    icon: Zap,
    title: "סטנדרט הערכה אחיד",
    desc: "כלי אובייקטיבי"
  },
  {
    icon: Award,
    title: 'דוח פערים',
    desc: "הפער בין קורות החיים ליכולות בפועל"
  }] :
  [
  {
    icon: Target,
    title: "Detailed Professional Profile",
    desc: "Mapping strengths and areas for improvement"
  },
  {
    icon: TrendingUp,
    title: "Fast Capability Screening",
    desc: "24 hours from questionnaire completion"
  },
  {
    icon: Zap,
    title: "Unified Assessment Standard",
    desc: "Objective tool"
  },
  {
    icon: Award,
    title: "Gap Report",
    desc: "The gap between CV and actual capabilities"
  }];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Updated CSS Variables for New Design */}
      <style>{`
        :root {
          --color-primary: #1a1a2e;
          --color-primary-dark: #0f0f1e;
          --color-secondary: #5a6a7a;
          --color-accent: #b8860b;
          --color-accent-light: #daa520;
          --color-accent-dark: #8b6914;
          --color-text-primary: #1a1a2e;
          --color-text-secondary: #4a5568;
          --color-text-muted: #9ca3af;
          --color-background: #fafbfc;
          --color-surface: #ffffff;
          --color-border: #e5e7eb;
        }
        
        * {
          font-family: 'Assistant', 'Noto Sans Hebrew', 'Rubik', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
        }
        
        .gradient-premium {
          background: linear-gradient(135deg, #b8860b 0%, #daa520 50%, #8b6914 100%);
        }
        
        .gradient-hero-new {
          background: linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #2d2d4a 100%);
        }
        
        .text-gradient-gold {
          background: linear-gradient(135deg, #daa520, #b8860b, #cd7f32);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .card-premium {
          background: white;
          border: 1px solid #e5e7eb;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-premium:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px -12px rgba(184, 134, 11, 0.25);
          border-color: #b8860b;
        }
        
        .btn-premium {
          background: linear-gradient(135deg, #b8860b, #daa520);
          box-shadow: 0 10px 30px -5px rgba(184, 134, 11, 0.3);
          transition: all 0.3s ease;
        }
        
        .btn-premium:hover {
          background: linear-gradient(135deg, #8b6914, #b8860b);
          box-shadow: 0 15px 40px -5px rgba(184, 134, 11, 0.5);
          transform: translateY(-2px);
        }
        
        .section-spacing {
          padding: 8rem 0;
        }
        
        @media (max-width: 768px) {
          .section-spacing {
            padding: 4rem 0;
          }
        }
      `}</style>

      {/* Hero Section - Premium Modern */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero-new">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          </div>
          
          {/* Premium Floating Elements */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-600/20 to-yellow-700/20 rounded-full blur-3xl"
            animate={{
              y: [0, -40, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }} />

          <motion.div
            className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-gradient-to-br from-yellow-600/20 to-amber-800/20 rounded-full blur-3xl"
            animate={{
              y: [0, 40, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }} />
        </div>

        <div className="px-4 text-center relative z-10 max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}>

            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-12 border border-white/20">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-base text-white/90 font-semibold">
                {language === 'he' ? 'פלטפורמת הערכה מקצועית מובילה' : 'Leading Professional Assessment Platform'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight tracking-tight">
              <span className="text-white">
                {language === 'he' ? 'V107' : 'V107'}
              </span>
              <br />
              <span className="text-gradient-gold">
                {language === 'he' ? 'מה הראיון לא גילה לכם על המועמד?' : 'What didn\'t the interview reveal?'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              {language === 'he' ? 'דוח יכולות מקצועי על כל מועמד — לפני שמקבלים החלטה' : 'Professional capability report on every candidate'}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
              <Link to={createPageUrl("Questionnaire")}>
                <Button
                  size="lg"
                  className="btn-premium text-white text-lg sm:text-2xl px-8 py-6 sm:px-16 sm:py-8 rounded-2xl font-bold group">
                  <span className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 sm:w-7 sm:h-7" />
                    <span>{language === 'he' ? 'התחילו פיילוט עכשיו' : 'Start Pilot Now'}</span>
                    {React.createElement(currentArrowIcon, { className: "w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform" })}
                  </span>
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center gap-3 text-base text-white/80">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>{language === 'he' ? 'גיוס נכון = חיסכון גדול' : 'Right recruitment = Big savings'}</span>
            </div>
          </motion.div>

          {/* Premium Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-24 mb-32 grid grid-cols-2 md:grid-cols-4 gap-8">

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 h-full flex flex-col justify-start items-center text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl font-black text-gradient-gold mb-6 min-h-[6rem] flex items-center justify-center">{language === 'he' ? '₪39' : '₪39'}</div>
              <div className="text-base text-gray-200 font-medium">{language === 'he' ? 'החל מ 39 ש"ח לדוח' : 'Starting from ₪39 per report'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 h-full flex flex-col justify-start items-center text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl font-black text-gradient-gold mb-6 min-h-[6rem] flex items-center justify-center">{language === 'he' ? '24' : '24'}</div>
              <div className="text-base text-gray-200 font-medium">{language === 'he' ? 'שעות והדוח אצלכם' : 'hours and the report is yours'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 h-full flex flex-col justify-start items-center text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl font-black text-gradient-gold mb-6 min-h-[6rem] flex items-center justify-center">{language === 'he' ? '11' : '11'}</div>
              <div className="text-base text-gray-200 font-medium">{language === 'he' ? 'תוצאות ל 11 יכולות מקצועיות' : 'Results for 11 professional capabilities'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 h-full flex flex-col justify-start items-center text-center hover:bg-white/15 transition-all duration-300">
              <div className="text-5xl font-black text-gradient-gold mb-6 min-h-[6rem] flex items-center justify-center">{language === 'he' ? '✓' : '✓'}</div>
              <div className="text-base text-gray-200 font-medium">{language === 'he' ? 'מתאים לכל סוגי החברות' : 'Suitable for all types of companies'}</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-10 h-16 border-2 border-white/40 rounded-full flex items-start justify-center p-3">
            <motion.div
              className="w-2 h-4 bg-white/80 rounded-full"
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* How It Works - Premium Clean */}
      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <h2 className="text-5xl md:text-6xl font-black mb-8 text-gray-900">
                {language === 'he' ? 'איך V107 עובד?' : 'How does V107 work?'}
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
                {language === 'he' ? 'שלושה שלבים פשוטים לגיוס מבוסס נתונים' : 'Three simple steps to data-driven recruitment'}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {stepsData.map((step, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex">
              <Card className="card-premium rounded-3xl shadow-xl flex-1 flex flex-col">
                <CardContent className="p-10 text-center flex-1 flex flex-col justify-between">
                  <div>
                    <div className="relative mb-8">
                      <div className="w-24 h-24 gradient-premium rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                        <step.icon className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-4 -right-4 bg-gray-900 text-white text-lg font-bold px-4 py-2 rounded-full shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-6 text-gray-900 whitespace-pre-line leading-relaxed">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6 text-lg">{step.desc}</p>
                  </div>

                  <div className="inline-flex items-center gap-3 bg-amber-50 px-6 py-3 rounded-full border border-amber-200">
                    <Clock className="w-5 h-5 text-amber-700" />
                    <span className="text-base font-semibold text-amber-900">{step.time}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            )}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-20">
            <Link to={createPageUrl("Questionnaire")}>
              <Button
                size="lg"
                className="btn-premium text-white text-xl px-14 py-8 rounded-2xl font-bold">
                <span className="flex items-center gap-3">
                  {language === 'he' ? 'התחילו פיילוט עכשיו' : 'Start Pilot Now'}
                  {React.createElement(currentArrowIcon, { className: "w-6 h-6" })}
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Premium Value */}
      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <h2 className="text-5xl md:text-6xl font-black mb-8 text-gray-900">
                {language === 'he' ? 'מנתונים להחלטות' : 'From Data to Decisions'}
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto font-light">
                {language === 'he' ? 'התמונה המלאה על כל מועמד' : 'The Complete Picture of Every Candidate'}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {benefitsData.map((benefit, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Card className="card-premium rounded-3xl shadow-xl h-full">
                <CardContent className="p-10">
                  <div className="flex items-start gap-8">
                    <div className="w-20 h-20 gradient-premium rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl">
                      <benefit.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{benefit.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Final CTA - Premium Powerful */}
      <section className="relative section-spacing px-4 sm:px-6 lg:px-8 overflow-hidden gradient-hero-new">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>

            <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-16 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-10">
                <Sparkles className="w-20 h-20 text-amber-400" />
              </div>

              <h2 className="text-5xl md:text-6xl font-black mb-10 text-white leading-tight">
                {language === 'he' ? 'המהפכה בניהול ההון האנושי\nהתחילה 🌸' : 'The HR Management Revolution\nHas Begun 🌸'}
              </h2>

              <p className="text-2xl text-gray-200 mb-14 max-w-3xl mx-auto leading-relaxed font-light">
                {language === 'he' ? 'הצטרפו לחברות וארגונים הובילים שכבר בחרו להפוך את V107 לכלי עבודה' : 'Join leading companies using V107'}
              </p>

              <div className="grid sm:grid-cols-3 gap-8 mb-14">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h4 className="font-bold text-white mb-3 text-xl">{language === 'he' ? 'התייעלות ודיוק' : 'Efficiency'}</h4>
                  <p className="text-gray-300">{language === 'he' ? 'התאמה מושלמת בין כישורי המועמד לדרישות התפקיד' : 'Perfect match'}</p>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h4 className="font-bold text-white mb-3 text-xl">{language === 'he' ? 'חיסכון בזמן ובמשאבים' : 'Time Savings'}</h4>
                  <p className="text-gray-300">{language === 'he' ? 'צמצום שעות עבודה יקרות' : 'Reduce expensive work hours'}</p>
                </div>
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <h4 className="font-bold text-white mb-3 text-xl">{language === 'he' ? 'בניית צוותים מנצחים' : 'Winning Teams'}</h4>
                  <p className="text-gray-300">{language === 'he' ? 'איתור העובדים המתאימים ביותר' : 'Find the best employees'}</p>
                </div>
              </div>

              <Link to={createPageUrl("Questionnaire")}>
                <Button
                  size="lg"
                  className="btn-premium text-white text-2xl px-16 py-8 rounded-2xl font-black">
                  <span className="flex items-center gap-4">
                    <Play className="w-7 h-7" />
                    {language === 'he' ? 'החלו בפיילוט עכשיו' : 'Start Pilot Now'}
                  </span>
                </Button>
              </Link>

              <p className="mt-10 text-lg text-gray-300">
                {language === 'he' ? '✓ ללא התחייבות, התחילו היום' : '✓ No commitment, start today'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <Users className="w-16 h-16 text-amber-700 mx-auto mb-6" />
              <p className="text-gray-700 font-semibold leading-relaxed text-lg">
                {language === 'he' ? 'נבנה ע"י צוות מומחים בינלאומי עם מאות שנות ניסיון' : 'Built by international experts'}
              </p>
            </div>
            <div>
              <Award className="w-16 h-16 text-amber-700 mx-auto mb-6" />
              <p className="text-gray-700 font-semibold leading-relaxed text-lg">
                {language === 'he' ? 'מערכת חדשנית המשפרת מאוד איתור מועמדים מתאימים' : 'Innovative system'}
              </p>
            </div>
            <div>
              <Target className="w-16 h-16 text-amber-700 mx-auto mb-6" />
              <p className="text-gray-700 font-semibold text-lg">{language === 'he' ? 'עשרות לקוחות מרוצים' : 'Dozens of satisfied customers'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}