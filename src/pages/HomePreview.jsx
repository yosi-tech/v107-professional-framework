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
  Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/components/i18n/useTranslation";
import { motion } from "framer-motion";

export default function HomePreview() {
  const { t, language } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);

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
    desc: language === 'he' ? "11 יכולות מקצועיות" : "11 professional capabilities",
    time: language === 'he' ? "תוך שעות" : "Within hours"
  },
  {
    icon: Rocket,
    title: language === 'he' ? "מקבלים דוח —\nמחליטים בביטחון" : "Receive report —\ndecide with confidence",
    desc: language === 'he' ? "גיוס מבוסס דאטה" : "Data-driven recruitment",
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
    desc: "CV vs actual capabilities gap"
  }];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Premium Design System */}
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
        
        .gradient-hero-premium {
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
          transform: translateY(-12px);
          box-shadow: 0 30px 60px -15px rgba(184, 134, 11, 0.3);
          border-color: #b8860b;
        }
        
        .btn-premium {
          background: linear-gradient(135deg, #b8860b, #daa520);
          box-shadow: 0 12px 35px -8px rgba(184, 134, 11, 0.4);
          transition: all 0.3s ease;
        }
        
        .btn-premium:hover {
          background: linear-gradient(135deg, #8b6914, #b8860b);
          box-shadow: 0 18px 50px -8px rgba(184, 134, 11, 0.6);
          transform: translateY(-3px);
        }
        
        .section-spacing {
          padding: 10rem 0;
        }
        
        @media (max-width: 768px) {
          .section-spacing {
            padding: 5rem 0;
          }
        }

        .floating-element {
          animation: float 8s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
      `}</style>

      {/* Hero Section - Ultra Premium */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero-premium">
        {/* Animated Background Grid */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          </div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-amber-600/20 to-yellow-700/20 rounded-full blur-3xl"
            animate={{
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }} />

          <motion.div
            className="absolute bottom-40 left-20 w-[550px] h-[550px] bg-gradient-to-br from-yellow-600/20 to-amber-800/20 rounded-full blur-3xl"
            animate={{
              y: [0, 50, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }} />

          <motion.div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-amber-500/15 to-yellow-600/15 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }} />
        </div>

        <div className="px-4 text-center relative z-10 max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-12 border border-white/20 shadow-xl">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-base text-white/90 font-semibold">
                {language === 'he' ? 'פלטפורמת הערכה מקצועית מובילה' : 'Leading Professional Assessment Platform'}
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
              <span className="text-white block mb-2">
                {language === 'he' ? 'V107' : 'V107'}
              </span>
              <span className="text-gradient-gold block">
                {language === 'he' ? 'מה הראיון לא גילה לכם' : 'What the interview didn\'t'}
              </span>
              <span className="text-gradient-gold block">
                {language === 'he' ? 'על המועמד?' : 'reveal about the candidate?'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              {language === 'he' 
                ? 'דוח יכולות מקצועי על כל מועמד — לפני שמקבלים החלטה' 
                : 'Professional capability report on every candidate — before making a decision'}
            </p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-16">
              <Link to={createPageUrl("Questionnaire")}>
                <Button
                  size="lg"
                  className="btn-premium text-white text-lg sm:text-2xl px-10 py-6 sm:px-16 sm:py-9 rounded-3xl font-bold group relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-3">
                    <Rocket className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform" />
                    <span>{language === 'he' ? 'התחילו פיילוט עכשיו' : 'Start Pilot Now'}</span>
                    {React.createElement(currentArrowIcon, { className: "w-6 h-6 sm:w-7 sm:h-7 group-hover:translate-x-1 transition-transform" })}
                  </span>
                </Button>
              </Link>
            </motion.div>

            {/* Trust Badge */}
            <div className="inline-flex items-center gap-3 text-base text-white/80">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>{language === 'he' ? 'גיוס נכון = חיסכון גדול' : 'Right recruitment = Big savings'}</span>
            </div>
          </motion.div>

          {/* Stats Bar - Premium Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-28 mb-32 grid grid-cols-2 md:grid-cols-4 gap-6">
            
            {[
              { value: '₪39', label: language === 'he' ? 'החל מ 39 ש"ח לדוח' : 'From ₪39 per report' },
              { value: '24', label: language === 'he' ? 'שעות והדוח אצלכם' : 'hours to report' },
              { value: '11', label: language === 'he' ? 'יכולות מקצועיות' : 'professional capabilities' },
              { value: '✓', label: language === 'he' ? 'מתאים לכל החברות' : 'For all companies' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 h-full flex flex-col justify-center items-center text-center hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer group">
                <div className="text-5xl md:text-6xl font-black text-gradient-gold mb-6 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-base text-gray-200 font-medium leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
          <div className="w-10 h-16 border-2 border-white/40 rounded-full flex items-start justify-center p-3">
            <motion.div
              className="w-2 h-4 bg-white/80 rounded-full"
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
          </div>
        </motion.div>
      </section>

      {/* How It Works - Clean Luxury */}
      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-gray-900 tracking-tight">
                {language === 'he' ? 'איך V107 עובד?' : 'How does V107 work?'}
              </h2>
              <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                {language === 'he' ? 'שלושה שלבים פשוטים לגיוס מבוסס נתונים' : 'Three simple steps to data-driven recruitment'}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {stepsData.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}>
                <Card className="card-premium rounded-[2rem] shadow-2xl h-full flex flex-col overflow-hidden">
                  <CardContent className="p-10 text-center flex-1 flex flex-col justify-between relative">
                    {/* Number Badge */}
                    <div className="absolute -top-5 -right-5 bg-gray-900 text-white text-xl font-black px-5 py-3 rounded-full shadow-2xl z-10">
                      {index + 1}
                    </div>

                    <div>
                      {/* Icon */}
                      <div className="relative mb-10">
                        <div className="w-28 h-28 gradient-premium rounded-[1.75rem] flex items-center justify-center mx-auto shadow-2xl transform hover:rotate-6 transition-transform duration-300">
                          <step.icon className="w-14 h-14 text-white" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 whitespace-pre-line leading-snug">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        {step.desc}
                      </p>
                    </div>

                    {/* Time Badge */}
                    <div className="inline-flex items-center gap-3 bg-amber-50 px-6 py-4 rounded-2xl border border-amber-200 mx-auto">
                      <Clock className="w-5 h-5 text-amber-700" />
                      <span className="text-base font-bold text-amber-900">{step.time}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-center mt-24">
            <Link to={createPageUrl("Questionnaire")}>
              <Button
                size="lg"
                className="btn-premium text-white text-xl px-16 py-8 rounded-3xl font-bold shadow-2xl">
                <span className="flex items-center gap-3">
                  {language === 'he' ? 'התחילו פיילוט עכשיו' : 'Start Pilot Now'}
                  {React.createElement(currentArrowIcon, { className: "w-6 h-6" })}
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Premium Grid */}
      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-gray-900 tracking-tight">
                {language === 'he' ? 'מנתונים להחלטות' : 'From Data to Decisions'}
              </h2>
              <p className="text-2xl md:text-3xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                {language === 'he' ? 'התמונה המלאה על כל מועמד' : 'The Complete Picture of Every Candidate'}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {benefitsData.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}>
                <Card className="card-premium rounded-[2rem] shadow-2xl h-full">
                  <CardContent className="p-10">
                    <div className="flex items-start gap-8">
                      <div className="w-24 h-24 gradient-premium rounded-[1.5rem] flex items-center justify-center flex-shrink-0 shadow-2xl">
                        <benefit.icon className="w-12 h-12 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold mb-5 text-gray-900 leading-snug">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-lg">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Optional */}
      {testimonials.length > 0 && (
        <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">
                {language === 'he' ? 'מה הלקוחות אומרים' : 'What Clients Say'}
              </h2>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[2rem]">
                <div className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: language === 'he' ? `translateX(${currentSlide * 100}%)` : `translateX(-${currentSlide * 100}%)` }}>
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id || index} className="w-full flex-shrink-0 px-4">
                      <Card className="mx-auto max-w-4xl border-2 border-gray-200 shadow-2xl rounded-[2rem]">
                        <CardContent className="p-12 text-center">
                          <Quote className="w-16 h-16 text-amber-500 mx-auto mb-6 opacity-30" />
                          <p className="text-2xl text-gray-700 mb-8 leading-relaxed font-medium">
                            "{language === 'he' ? testimonial.quote_he : testimonial.quote_en || testimonial.quote_he}"
                          </p>
                          <div className="flex items-center justify-center gap-2 mb-6">
                            {[...Array(testimonial.stars)].map((_, i) => (
                              <Star key={i} className="w-6 h-6 text-amber-500 fill-current" />
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div className={language === 'he' ? 'text-right' : 'text-left'}>
                              <p className="font-bold text-gray-900 text-xl">{testimonial.name}</p>
                              <p className="text-gray-600">{language === 'he' ? testimonial.title_he : testimonial.title_en || testimonial.title_he}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {testimonials.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-all duration-300 shadow-2xl z-10">
                    <ChevronRight className="w-7 h-7" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-all duration-300 shadow-2xl z-10">
                    <ChevronLeft className="w-7 h-7" />
                  </button>

                  <div className="flex justify-center mt-8 gap-3">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          currentSlide === index ? 'bg-amber-600 w-10' : 'bg-gray-300 hover:bg-gray-400'
                        }`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA - Premium Impact */}
      <section className="relative section-spacing px-4 sm:px-6 lg:px-8 overflow-hidden gradient-hero-premium">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>

            <div className="bg-white/10 backdrop-blur-xl rounded-[3rem] p-16 md:p-20 border border-white/20 shadow-2xl">
              <div className="flex items-center justify-center mb-12">
                <Sparkles className="w-24 h-24 text-amber-400 animate-pulse" />
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-12 text-white leading-tight tracking-tight">
                {language === 'he' ? 'המהפכה בניהול ההון האנושי\nהתחילה 🌸' : 'The HR Revolution\nHas Begun 🌸'}
              </h2>

              <p className="text-2xl md:text-3xl text-gray-200 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
                {language === 'he' 
                  ? 'הצטרפו לחברות וארגונים הובילים שכבר בחרו להפוך את V107 לכלי עבודה' 
                  : 'Join leading companies using V107 as their recruitment tool'}
              </p>

              <div className="grid sm:grid-cols-3 gap-8 mb-16">
                {[
                  { title: language === 'he' ? 'התייעלות ודיוק' : 'Efficiency', desc: language === 'he' ? 'התאמה מושלמת' : 'Perfect match' },
                  { title: language === 'he' ? 'חיסכון בזמן' : 'Time Savings', desc: language === 'he' ? 'צמצום שעות יקרות' : 'Reduce costs' },
                  { title: language === 'he' ? 'צוותים מנצחים' : 'Winning Teams', desc: language === 'he' ? 'העובדים המתאימים' : 'Best employees' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <h4 className="font-bold text-white mb-3 text-xl">{item.title}</h4>
                    <p className="text-gray-300 text-base">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              <Link to={createPageUrl("Questionnaire")}>
                <Button
                  size="lg"
                  className="btn-premium text-white text-2xl px-20 py-10 rounded-3xl font-black shadow-2xl">
                  <span className="flex items-center gap-4">
                    <Play className="w-8 h-8" />
                    {language === 'he' ? 'החלו בפיילוט עכשיו' : 'Start Pilot Now'}
                  </span>
                </Button>
              </Link>

              <p className="mt-12 text-lg text-gray-300">
                {language === 'he' ? '✓ ללא התחייבות, התחילו היום' : '✓ No commitment, start today'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges - Premium Footer */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              { icon: Users, text: language === 'he' ? 'נבנה ע"י צוות מומחים בינלאומי עם מאות שנות ניסיון' : 'Built by international experts' },
              { icon: Award, text: language === 'he' ? 'מערכת חדשנית המשפרת מאוד איתור מועמדים מתאימים' : 'Innovative assessment system' },
              { icon: Target, text: language === 'he' ? 'עשרות לקוחות מרוצים' : 'Dozens of satisfied customers' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}>
                <item.icon className="w-20 h-20 text-amber-700 mx-auto mb-8" />
                <p className="text-gray-700 font-semibold leading-relaxed text-lg">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}