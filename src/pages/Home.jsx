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

export default function Home() {
  const { t, language } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [content, setContent] = useState({});
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [items, data] = await Promise.all([
          base44.entities.ContentItem.filter({ page: 'home' }),
          base44.entities.Testimonial.list('-created_date')
        ]);
        
        const contentMap = {};
        items.forEach((item) => {
          contentMap[item.content_key] = language === 'he' ? item.content_he : item.content_en;
        });
        setContent(contentMap);
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoadingContent(false);
        setIsLoadingTestimonials(false);
      }
    };
    fetchAllData();
  }, [language]);

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

  const getContent = (key, fallback = '') => content[key] || fallback;

  const stepsData = [
  {
    icon: FileText,
    title: getContent('step1_title', language === 'he' ? "ענה על 107 שאלות חכמות" : "Answer 107 Smart Questions"),
    desc: getContent('step1_desc', language === 'he' ? "שאלון מבוסס מחקר שנבנה במשך 5 שנים. 10-15 דקות בלבד." : "Research-based questionnaire built over 5 years. Just 10-15 minutes."),
    time: getContent('step1_time', language === 'he' ? "10 דקות" : "10 minutes")
  },
  {
    icon: BarChart3,
    title: getContent('step2_title', language === 'he' ? "קבל ניתוח מקיף ומדויק" : "Get Comprehensive Analysis"),
    desc: getContent('step2_desc', language === 'he' ? "בינה מלאכותית + בקרה אנושית של מומחים בינלאומיים." : "AI + human oversight by international experts."),
    time: getContent('step2_time', language === 'he' ? "עד 7 ימים" : "Up to 7 days")
  },
  {
    icon: Rocket,
    title: getContent('step3_title', language === 'he' ? "צא לדרך עם תוכנית פעולה" : "Launch with Action Plan"),
    desc: getContent('step3_desc', language === 'he' ? "תובנות מותאמות אישית, KPIs ברורים, ותכנית פעולה ל-6 חודשים." : "Personalized insights, clear KPIs, and 6-month action plan."),
    time: getContent('step3_time', language === 'he' ? "מיידי" : "Immediate")
  }];


  const benefitsData = language === 'he' ? [
  {
    icon: Target,
    title: "זהה את נקודות החוזקה שלך",
    desc: "גלה את היכולות המקצועיות המובילות שלך וכיצד למנף אותן להצלחה."
  },
  {
    icon: TrendingUp,
    title: "קבל תוכנית פעולה מדויקת",
    desc: "תכנית מפורטת ל-6 חודשים עם Quick Wins ויעדים ברורים."
  },
  {
    icon: Zap,
    title: "הימנע מטעויות יקרות",
    desc: "זיהוי מוקדי סיכון קריטיים והמלצות למניעת כישלונות."
  },
  {
    icon: Award,
    title: "דוח מקצועי ברמה בינלאומית",
    desc: "מבוסס על ניסיון של אלפי אנשים ברחבי העולם."
  }] :
  [
  {
    icon: Target,
    title: "Identify Your Strengths",
    desc: "Discover your leading professional abilities and how to leverage them."
  },
  {
    icon: TrendingUp,
    title: "Get Precise Action Plan",
    desc: "Detailed 6-month plan with Quick Wins and clear targets."
  },
  {
    icon: Zap,
    title: "Avoid Costly Mistakes",
    desc: "Identify critical risk areas and recommendations to prevent failures."
  },
  {
    icon: Award,
    title: "International-Level Report",
    desc: "Based on experience from thousands of people worldwide."
  }];


  const statsData = language === 'he' ? [
  { number: "5,000+", label: "יזמים השתמשו בשאלון" },
  { number: "107", label: "נקודות מידע" },
  { number: "11", label: "ממדים קריטיים" },
  { number: "7", label: "ימים לקבלת דוח" }] :
  [
  { number: "5,000+", label: "Entrepreneurs Used" },
  { number: "107", label: "Data Points" },
  { number: "11", label: "Critical Dimensions" },
  { number: "7", label: "Days to Report" }];


  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">{language === 'he' ? 'טוען...' : 'Loading...'}</div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section - Modern & Dynamic */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={getContent('hero_background_image', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2574&auto=format&fit=crop')}
            alt="Entrepreneurs collaborating"
            className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-800/95"></div>
        </div>
        
        {/* Animated Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          </div>
          
          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 right-20 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }} />

          <motion.div
            className="absolute bottom-40 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }} />

        </div>

        <div className="px-4 text-center relative z-10 max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }} className="my-2">

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-white/90 font-medium">
                {getContent('hero_badge_text', language === 'he' ? 'מבוסס על 5 שנות מחקר ופיתוח' : 'Based on 5 Years of Research')}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">
                {getContent('hero_title_part1', language === 'he' ? 'פתח את מלוא' : 'Unlock Your Full')}
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                {getContent('hero_title_part2', language === 'he' ? 'הפוטנציאל המקצועי שלך' : 'Professional Potential')}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {getContent('hero_subtitle', language === 'he' ?
              'קבל דוח אישי מבוסס AI שיגלה את החוזקות שלך, יזהה מוקדי שיפור, ויספק לך תוכנית פעולה מדויקת להצלחה עסקית.' :
              'Get an AI-powered personal report that reveals your strengths, identifies improvement areas, and provides a precise action plan for business success.'
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
              <Link to={createPageUrl("Questionnaire")}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-base sm:text-xl px-6 py-4 sm:px-12 sm:py-7 rounded-2xl shadow-2xl shadow-amber-500/50 font-bold group relative overflow-hidden">

                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-xl">{getContent('hero_cta_button', language === 'he' ? 'התחל את השאלון עכשיו!' : 'Start Questionnaire Now!')}</span>
                    {React.createElement(currentArrowIcon, { className: "w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" })}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>{getContent('hero_trust_text', language === 'he' ? 'חינם לחלוטין · ללא התחייבות · 10 דקות בלבד' : 'Completely Free · No Commitment · Just 10 Minutes')}</span>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 mb-32 grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">{getContent('stat1_number', '5,000+')}</div>
              <div className="text-sm text-gray-300">{getContent('stat1_label', language === 'he' ? 'אנשים השתמשו בשאלון' : 'People Used')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">{getContent('stat2_number', '107')}</div>
              <div className="text-sm text-gray-300">{getContent('stat2_label', language === 'he' ? 'נקודות מידה' : 'Data Points')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">{getContent('stat3_number', '11')}</div>
              <div className="text-sm text-gray-300">{getContent('stat3_label', language === 'he' ? 'ממדים קריטיים' : 'Critical Dimensions')}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 min-h-[140px] flex flex-col justify-center items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-2">{getContent('stat4_number', '7')}</div>
              <div className="text-sm text-gray-300">{getContent('stat4_label', language === 'he' ? 'ימים לקבלת דוח' : 'Days to Report')}</div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}>

          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-3 bg-white rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }} />

          </div>
        </motion.div>
      </section>

      {/* How It Works - Clean & Simple */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop"
            alt="Business planning"
            className="w-full h-full object-cover" />

        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>

              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                {getContent('how_it_works_title', language === 'he' ? 'איך זה עובד?' : 'How Does It Work?')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {getContent('how_it_works_subtitle', language === 'he' ?
                '3 שלבים פשוטים לקבלת הדוח המקצועי שלך' :
                '3 Simple Steps to Your Professional Report'
                )}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stepsData.map((step, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex">

                <div className="relative group flex-1 flex">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl transform group-hover:scale-105 transition-transform duration-300 opacity-0 group-hover:opacity-10"></div>

                  <Card className="relative border-2 border-gray-100 hover:border-amber-400 transition-all duration-300 rounded-3xl shadow-lg hover:shadow-2xl flex-1 flex flex-col">
                    <CardContent className="p-8 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <div className="relative mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                            <step.icon className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute -top-3 -right-3 bg-slate-900 text-white text-sm font-bold px-3 py-1 rounded-full">
                            {index + 1}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{step.desc}</p>
                      </div>

                      <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-900">{step.time}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>

          {/* CTA after steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16">

            <Link to={createPageUrl("Questionnaire")}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl px-12 py-7 rounded-2xl shadow-xl font-bold group">

                <span className="flex items-center gap-3">
                  {language === 'he' ? 'התחל עכשיו - חינם!' : 'Start Now - Free!'}
                  {React.createElement(currentArrowIcon, { className: "w-6 h-6 group-hover:translate-x-1 transition-transform" })}
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits - Value Props */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <img
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop"
            alt="Team success"
            className="w-full h-full object-cover" />

        </div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>

              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                {getContent('section_title', language === 'he' ? 'למה דווקא V107?' : 'Why V107?')}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {getContent('section_subtitle', language === 'he' ?
                'הכלי המקצועי ביותר לאבחון יזמי בישראל' :
                'The Most Professional Entrepreneurial Assessment Tool in Israel'
                )}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
            { icon: Target, titleKey: 'benefit1_title', descKey: 'benefit1_description' },
            { icon: TrendingUp, titleKey: 'benefit2_title', descKey: 'benefit2_description' },
            { icon: Zap, titleKey: 'benefit3_title', descKey: 'benefit3_description' },
            { icon: Award, titleKey: 'benefit4_title', descKey: 'benefit4_description' }].
            map((benefit, index) =>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}>

                <Card className="border-2 border-gray-100 hover:border-amber-400 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-2xl h-full group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                        <benefit.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{getContent(benefit.titleKey, benefitsData[index]?.title || '')}</h3>
                        <p className="text-gray-600 leading-relaxed">{getContent(benefit.descKey, benefitsData[index]?.desc || '')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* About V107 Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16">

            <div className="inline-block mb-4">
              <span className="bg-amber-500/20 text-amber-300 px-4 py-2 rounded-full text-sm font-semibold">
                אודות V107
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white leading-tight">
              גלה את מפת היכולות האמיתית שלך
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              בעולם המקצועי המודרני, ידע הוא כוח, אך דיוק הוא ההבדל בין דריכה במקום לפריצת דרך.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 mb-12">

            <p className="text-lg text-gray-200 leading-relaxed mb-8">
              דו"ח V107 הינו פיתוח משולב וייחודי של צוות מומחים בתחומי האסטרטגיה והניהול, הפועל לצד אלגוריתם AI חדשני שפיתחנו במיוחד למטרה זו. השילוב בין ניסיון מקצועי עתיר שנים לבין בינה מלאכותית מתקדמת, מאפשר לנו להפיק עבורך אבחון אסטרטגי שאין שני לו בשוק.
            </p>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-amber-400">
              מה כולל הדו"ח האישי שלך?
            </h3>
            <p className="text-gray-300 mb-6">
              עם סיום השאלון, המערכת תייצר ותעביר לידיעתך ניתוח פרימיום בתוך עד 5 ימי עסקים.
            </p>

            <div className="space-y-4 mb-12">
              {[
              {
                icon: Target,
                title: 'אבחון חוזקות וחסמים',
                desc: 'זיהוי מוקדי העוצמה שלך לצד החסמים המבניים המעכבים את צמיחתך המקצועית.'
              },
              {
                icon: BarChart3,
                title: 'מפת יכולות ויזואלית',
                desc: 'תמונת מצב גרפית נקייה ומקצועית המציגה את רמת המיומנות שלך ב-6 צירי כוח מרכזיים: ניהול, פיננסים, שיווק, דיגיטל, ביצוע וחזון.'
              },
              {
                icon: TrendingUp,
                title: 'ניתוח פערים אסטרטגי (Gap Analysis)',
                desc: 'הבנה עמוקה של הקשר בין היכולות שלך – כיצד חיזוק חולשה ספציפית ימנף את החוזקות הקיימות שלך ויכפיל את האימפקט המקצועי שלך.'
              },
              {
                icon: CheckCircle,
                title: 'פרוטוקול פעולה (The Action Matrix)',
                desc: 'צעדים מעשיים לביצוע מיידי (Quick Wins) לצד "מרשם" עבודה המותאמת אישית לפרופיל שלך.'
              },
              {
                icon: BookOpen,
                title: 'ספריית משאבי פרימיום',
                desc: 'הפניות ממוקדות למקורות ידע מהשורה הראשונה בעולם – קורסים אקדמיים, ספרות ניהול מתקדמת וכלים טכנולוגיים מובילים.'
              }].
              map((item, index) =>
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">

                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              )}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-amber-400">
              התרומות המקצועיות של V107 עבורך:
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
              { title: 'בהירות ניהולית', desc: 'הפסקת ה"רעש" והתמקדות במוקדים שבאמת מייצרים צמיחה בקריירה או בעסק שלך.' },
              { title: 'שפה אסטרטגית', desc: 'שיפור היכולת לקבל החלטות מבוססות נתונים וגיבוש חזון מקצועי חד וממוקד.' },
              { title: 'ייעול מערכתי', desc: 'קבלת כלים להפחתת עומס תפעולי ומעבר לניהול אסטרטגי חכם.' }].
              map((item, index) =>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-white/5 p-6 rounded-2xl border border-white/10 text-right">

                  <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center mb-4 mr-auto">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <h4 className="font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              )}
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl p-8 border border-amber-400/30">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-amber-400">
                מעבר מידיעה לפעולה: אודות מוצר העל שלנו "V107-BOOSTER"
              </h3>
              <p className="text-gray-200 leading-relaxed mb-4">
                ניסיוננו מראה כי רבים מסתפקים בקריאת הדו"ח (שלב הידיעה), אך אלו שעברו ליישום בפועל של המסקנות, הם אלו שהשיגו יעדים טובים יותר.
              </p>
              <p className="text-gray-200 leading-relaxed mb-6">
                בדיוק עבורכם פיתחנו את מוצר העל שלנו: <span className="font-bold text-amber-300">V107-BOOSTER</span>. זהו כלי עבודה יומי עוצמתי המלווה אותך במשך 7 ימים עם משימות יומיות-קצרות וממוקדות, במטרה להפוך את מסקנות הדו"ח לדרך חיים ניהולית ולתוצאות מוחשיות בשטח.
              </p>
              <div className="flex items-center gap-2 text-white">
                <Rocket className="w-6 h-6 text-amber-400" />
                <p className="font-bold text-lg">
                  לכן, אל תסתפק בידיעה של מי שאתה – גלה מה אתה באמת יכול להיות.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center">

            <Link to={createPageUrl("Questionnaire")}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm px-5 py-3 rounded-lg shadow-lg font-bold">

                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  מלא את השאלון עכשיו!
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Social Proof - Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>

              <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900">
                {language === 'he' ? 'מה אומרים עלינו' : 'What People Say'}
              </h2>
              <p className="text-xl text-gray-600">
                {language === 'he' ? 'סיפורי הצלחה מהשטח' : 'Success Stories from the Field'}
              </p>
            </motion.div>
          </div>

          {isLoadingTestimonials ?
          <div className="flex justify-center items-center h-64">
              <div className="text-gray-400">{language === 'he' ? 'טוען...' : 'Loading...'}</div>
            </div> :
          testimonials.length > 0 ?
          <div className="relative">
              <div className="overflow-hidden rounded-3xl">
                <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: language === 'he' ? `translateX(${currentSlide * 100}%)` : `translateX(-${currentSlide * 100}%)` }}>

                  {testimonials.map((testimonial, index) =>
                <div key={testimonial.id || index} className="w-full flex-shrink-0 px-3 sm:px-4">
                      <Card className="mx-auto max-w-4xl border-2 border-gray-100 shadow-2xl rounded-2xl sm:rounded-3xl">
                        <CardContent className="p-8 sm:p-12 text-center">
                          <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-amber-500 mx-auto mb-4 sm:mb-6 opacity-20" />

                          <p className="text-lg sm:text-2xl text-gray-700 mb-6 sm:mb-8 leading-relaxed font-medium min-h-[80px] sm:min-h-0">
                            "{language === 'he' ? testimonial.quote_he : testimonial.quote_en || testimonial.quote_he}"
                          </p>

                          <div className="flex items-center justify-center gap-1 mb-4 sm:mb-6">
                            {[...Array(testimonial.stars)].map((_, i) =>
                        <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 fill-current" />
                        )}
                          </div>

                          <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-lg">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div className={language === 'he' ? 'text-right' : 'text-left'}>
                              <p className="font-bold text-gray-900 text-base sm:text-xl">{testimonial.name}</p>
                              <p className="text-gray-600 text-sm sm:text-base">{language === 'he' ? testimonial.title_he : testimonial.title_en || testimonial.title_he}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                )}
                </div>
              </div>

              {testimonials.length > 1 &&
            <>
                  <button
                    onClick={prevSlide}
                    className="absolute right-0 sm:right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-amber-500 text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition-all duration-300 shadow-xl z-10">

                    <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute left-0 sm:left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-14 sm:h-14 bg-amber-500 text-white rounded-full flex items-center justify-center hover:bg-amber-600 transition-all duration-300 shadow-xl z-10">

                    <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7" />
                  </button>

                  <div className="flex justify-center mt-8 gap-3">
                    {testimonials.map((_, index) =>
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? 'bg-amber-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`
                  } />

                )}
                  </div>
                </>
            }
            </div> :

          <div className="text-center py-12">
              <p className="text-gray-500">{language === 'he' ? 'אין עדויות להצגה' : 'No testimonials available'}</p>
            </div>
          }
        </div>
      </section>

      {/* Final CTA - Strong & Compelling */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6" />

              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
                {getContent('section_title', language === 'he' ?
                'מוכן לקחת את הצעד הבא?' :
                'Ready to Take the Next Step?'
                )}
              </h2>

              <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                {getContent('section_description', language === 'he' ?
                'השקעה של 10 דקות עכשיו יכולה לחסוך לך שנים של ניסוי וטעייה. קבל את הדוח האישי שלך והתחל לבנות את העסק המצליח שלך.' :
                '10 minutes now can save you years of trial and error. Get your personal report and start building your successful business.'
                )}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link to={createPageUrl("Questionnaire")}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl shadow-amber-500/50 font-black group">

                    <span className="flex items-center gap-3">
                      <Play className="w-7 h-7" />
                      {getContent('cta_button_text', language === 'he' ? 'התחל עכשיו - חינם!' : 'Start Now - Free!')}
                    </span>
                  </Button>
                </Link>
              </div>

              <p className="mt-8 text-sm text-gray-300">
                {language === 'he' ?
                '✓ ללא כרטיס אשראי  ✓ ללא התחייבות  ✓ תוצאות מיידיות' :
                '✓ No Credit Card  ✓ No Commitment  ✓ Immediate Results'
                }
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{getContent('badge1_number', '5,000+')}</h3>
              <p className="text-gray-600">{getContent('badge1_text', language === 'he' ? 'יזמים השתמשו בשאלון' : 'Entrepreneurs Used')}</p>
            </div>
            <div>
              <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {getContent('badge2_number', language === 'he' ? '5 שנים' : '5 Years')}
              </h3>
              <p className="text-gray-600">{getContent('badge2_text', language === 'he' ? 'של מחקר ופיתוח' : 'Research & Development')}</p>
            </div>
            <div>
              <Target className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{getContent('badge3_number', '107')}</h3>
              <p className="text-gray-600">{getContent('badge3_text', language === 'he' ? 'נקודות מידה קריטיות' : 'Critical Data Points')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>);

}