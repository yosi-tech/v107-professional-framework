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
      {/* Ultra Modern B2B Design System */}
      <style>{`
        :root {
          --color-primary: #0f172a;
          --color-primary-light: #1e293b;
          --color-secondary: #334155;
          --color-accent: #06b6d4;
          --color-accent-light: #22d3ee;
          --color-accent-dark: #0891b2;
          --color-purple: #8b5cf6;
          --color-purple-light: #a78bfa;
          --color-text-primary: #0f172a;
          --color-text-secondary: #475569;
          --color-text-muted: #94a3b8;
        }
        
        * {
          font-family: 'Inter', 'Assistant', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
        }
        
        .gradient-cyber {
          background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%);
        }
        
        .gradient-hero-cyber {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%);
        }
        
        .text-gradient-cyber {
          background: linear-gradient(135deg, #22d3ee, #06b6d4, #8b5cf6);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
          background-size: 200% 200%;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(6, 182, 212, 0.5);
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 40px 80px -20px rgba(6, 182, 212, 0.4);
        }
        
        .btn-cyber {
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          box-shadow: 0 0 30px rgba(6, 182, 212, 0.5), 0 0 60px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .btn-cyber::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s;
        }
        
        .btn-cyber:hover::before {
          left: 100%;
        }
        
        .btn-cyber:hover {
          box-shadow: 0 0 40px rgba(6, 182, 212, 0.8), 0 0 80px rgba(139, 92, 246, 0.5);
          transform: translateY(-4px) scale(1.05);
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

      {/* Hero Section - Cyber Tech */}
      <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero-cyber">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3lhbiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          </div>
          
          {/* Glowing Orbs - Cyan & Purple */}
          <motion.div
            className="absolute top-20 right-20 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full blur-3xl"
            animate={{
              y: [0, -80, 0],
              x: [0, 50, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }} />

          <motion.div
            className="absolute bottom-20 left-20 w-[700px] h-[700px] bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl"
            animate={{
              y: [0, 80, 0],
              x: [0, -50, 0],
              scale: [1, 1.4, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }} />

          <motion.div
            className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.35, 1],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }} />
        </div>

        {/* Split Hero Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-right lg:text-right">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 glass-card px-6 py-3 rounded-full mb-8">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="text-sm text-cyan-100 font-bold uppercase tracking-wider">
                {language === 'he' ? 'טכנולוגיית AI מתקדמת' : 'Advanced AI Technology'}
              </span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-8 leading-[1.05]">
              <span className="text-white block mb-3">
                {language === 'he' ? 'V107' : 'V107'}
              </span>
              <span className="text-gradient-cyber block">
                {language === 'he' ? 'גלה את הפוטנציאל' : 'Discover The'}
              </span>
              <span className="text-gradient-cyber block">
                {language === 'he' ? 'האמיתי של המועמד' : 'True Potential'}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
              {language === 'he' 
                ? 'פלטפורמת אבחון AI שמנתחת 11 יכולות מקצועיות ומספקת דוח מקיף תוך 24 שעות' 
                : 'AI diagnostic platform analyzing 11 professional capabilities with comprehensive report in 24 hours'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mb-12">
              <Link to={createPageUrl("Questionnaire")}>
                <Button
                  size="lg"
                  className="btn-cyber text-white text-lg px-12 py-7 rounded-2xl font-bold group w-full sm:w-auto">
                  <span className="relative z-10 flex items-center gap-3 justify-center">
                    <Rocket className="w-6 h-6" />
                    <span>{language === 'he' ? 'התחל פיילוט' : 'Start Pilot'}</span>
                  </span>
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="glass-card text-white text-lg px-12 py-7 rounded-2xl font-bold border-cyan-500/50 hover:border-cyan-400 w-full sm:w-auto">
                <span className="flex items-center gap-3 justify-center">
                  <Play className="w-5 h-5" />
                  <span>{language === 'he' ? 'צפה בדמו' : 'Watch Demo'}</span>
                </span>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>{language === 'he' ? 'ללא התחייבות' : 'No commitment'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>{language === 'he' ? 'תוצאות תוך 24 שעות' : '24h results'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400" />
                <span>{language === 'he' ? 'דיוק 95%+' : '95%+ accuracy'}</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="hidden lg:block">
            <div className="relative">
              {/* Floating Cards Mockup */}
              <div className="relative w-full h-[600px]">
                {[
                  { top: '10%', right: '20%', delay: 0, color: 'from-cyan-500 to-blue-600' },
                  { top: '35%', right: '40%', delay: 0.2, color: 'from-purple-500 to-pink-600' },
                  { top: '60%', right: '10%', delay: 0.4, color: 'from-cyan-400 to-purple-500' }
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: card.delay }}
                    className="absolute glass-card p-6 rounded-3xl"
                    style={{ top: card.top, right: card.right }}>
                    <div className={`w-48 h-32 bg-gradient-to-br ${card.color} rounded-2xl mb-4 flex items-center justify-center`}>
                      <BarChart3 className="w-12 h-12 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-white/20 rounded-full w-3/4"></div>
                      <div className="h-3 bg-white/20 rounded-full w-1/2"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar - Cyber Style */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="absolute bottom-10 left-0 right-0 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Target, value: '₪39', label: language === 'he' ? 'מחיר התחלתי' : 'Starting price' },
              { icon: Clock, value: '24h', label: language === 'he' ? 'זמן אספקה' : 'Delivery time' },
              { icon: BarChart3, value: '11', label: language === 'he' ? 'יכולות' : 'capabilities' },
              { icon: Users, value: '500+', label: language === 'he' ? 'חברות' : 'companies' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                className="glass-card p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300 cursor-pointer group">
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3 group-hover:text-purple-400 transition-colors" />
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

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

      {/* How It Works - Modern Tech */}
      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
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
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.15 }}
                style={{ perspective: '1000px' }}>
                <div className="relative group h-full">
                  {/* Glow Effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[2.5rem] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                  
                  <Card className="relative bg-white border-2 border-gray-100 rounded-[2rem] shadow-2xl h-full flex flex-col overflow-hidden transform group-hover:border-cyan-400 transition-all duration-500">
                    <CardContent className="p-10 text-center flex-1 flex flex-col justify-between">
                      {/* Number Badge - Cyber Style */}
                      <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl z-10 group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>

                      <div>
                        {/* Icon - 3D Effect */}
                        <div className="relative mb-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                          <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                            <step.icon className="w-16 h-16 text-white" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-black mb-6 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent whitespace-pre-line leading-snug">
                          {step.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed mb-8 text-lg font-medium">
                          {step.desc}
                        </p>
                      </div>

                      {/* Time Badge - Modern */}
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-50 to-purple-50 px-6 py-4 rounded-2xl border border-cyan-200 mx-auto group-hover:border-cyan-400 transition-colors">
                        <Clock className="w-5 h-5 text-cyan-600" />
                        <span className="text-base font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">{step.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
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
                className="btn-cyber text-white text-xl px-16 py-8 rounded-3xl font-bold shadow-2xl">
                <span className="relative z-10 flex items-center gap-3">
                  {language === 'he' ? 'התחילו פיילוט עכשיו' : 'Start Pilot Now'}
                  {React.createElement(currentArrowIcon, { className: "w-6 h-6" })}
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Asymmetric Grid */}
      <section className="section-spacing px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3lhbiIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}>
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 text-white tracking-tight">
                {language === 'he' ? 'מנתונים להחלטות' : 'From Data to Decisions'}
              </h2>
              <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
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
                <div className="glass-card rounded-[2rem] p-10 h-full group hover:scale-105 transition-all duration-500">
                  <div className="flex items-start gap-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                        <benefit.icon className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-black mb-5 text-white leading-snug">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        {benefit.desc}
                      </p>
                    </div>
                  </div>
                </div>
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

      {/* Final CTA - Cyber Impact */}
      <section className="relative section-spacing px-4 sm:px-6 lg:px-8 overflow-hidden gradient-hero-cyber">
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
                  className="btn-cyber text-white text-2xl px-20 py-10 rounded-3xl font-black shadow-2xl">
                  <span className="relative z-10 flex items-center gap-4">
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

      {/* Trust Badges - Modern Footer */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white border-t border-slate-200">
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
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-2xl opacity-30"></div>
                  <item.icon className="relative w-20 h-20 text-cyan-600 mx-auto" />
                </div>
                <p className="text-slate-700 font-bold leading-relaxed text-lg">
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