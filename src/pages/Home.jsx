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
    }, 7000);
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
    title: getContent('step1_title', language === 'he' ? "כותרת שלב 1" : "Step 1 Title"),
    desc: getContent('step1_desc', language === 'he' ? "תיאור שלב 1" : "Step 1 description"),
    time: getContent('step1_time', language === 'he' ? "זמן משוער" : "Estimated time")
  },
  {
    icon: BarChart3,
    title: getContent('step2_title', language === 'he' ? "כותרת שלב 2" : "Step 2 Title"),
    desc: getContent('step2_desc', language === 'he' ? "תיאור שלב 2" : "Step 2 description"),
    time: getContent('step2_time', language === 'he' ? "זמן משוער" : "Estimated time")
  },
  {
    icon: Rocket,
    title: getContent('step3_title', language === 'he' ? "כותרת שלב 3" : "Step 3 Title"),
    desc: getContent('step3_desc', language === 'he' ? "תיאור שלב 3" : "Step 3 description"),
    time: getContent('step3_time', language === 'he' ? "זמן משוער" : "Estimated time")
  }];


  const benefitsData = language === 'he' ? [
  {
    icon: Target,
    title: "כותרת יתרון 1",
    desc: "תיאור יתרון ראשון"
  },
  {
    icon: TrendingUp,
    title: "כותרת יתרון 2",
    desc: "תיאור יתרון שני"
  },
  {
    icon: Zap,
    title: "כותרת יתרון 3",
    desc: "תיאור יתרון שלישי"
  },
  {
    icon: Award,
    title: "כותרת יתרון 4",
    desc: "תיאור יתרון רביעי"
  }] :
  [
  {
    icon: Target,
    title: "Benefit Title 1",
    desc: "First benefit description"
  },
  {
    icon: TrendingUp,
    title: "Benefit Title 2",
    desc: "Second benefit description"
  },
  {
    icon: Zap,
    title: "Benefit Title 3",
    desc: "Third benefit description"
  },
  {
    icon: Award,
    title: "Benefit Title 4",
    desc: "Fourth benefit description"
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
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2574&auto=format&fit=crop"
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
                {language === 'he' ? 'מאות חברות ניסו' : 'Hundreds of companies tried'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="text-white">
                {language === 'he' ? 'V107' : 'V107'}
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                {language === 'he' ? '?מה הראיון לא גילה לכם על המועמד לתפקיד' : 'What didn\'t the interview reveal about the candidate?'}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              {language === 'he' ? 'דוח יכולות מקצועי על כל מועמד — לפני שמקבלים החלטה' : 'Professional capability report on every candidate — before making a decision'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
              <Link to={createPageUrl("Questionnaire")}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-base sm:text-xl px-6 py-4 sm:px-12 sm:py-7 rounded-2xl shadow-2xl shadow-amber-500/50 font-bold group relative overflow-hidden">

                  <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-xl">{language === 'he' ? 'התחילו לגייס נכון' : 'Start Recruiting Right'}</span>
                    {React.createElement(currentArrowIcon, { className: "w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" })}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-white/80">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>{language === 'he' ? 'בקשו פיילוט עכשיו — ללא התחייבות !' : 'Request a pilot now — no commitment!'}</span>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 mb-32 grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full flex flex-col justify-start items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-4 min-h-[5rem] flex items-center justify-center">{language === 'he' ? '0' : '0'}</div>
              <div className="text-sm text-gray-300">{language === 'he' ? 'סטטיסטיקה 1' : 'Statistic 1'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full flex flex-col justify-start items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-4 min-h-[5rem] flex items-center justify-center">{language === 'he' ? '0' : '0'}</div>
              <div className="text-sm text-gray-300">{language === 'he' ? 'סטטיסטיקה 2' : 'Statistic 2'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full flex flex-col justify-start items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-4 min-h-[5rem] flex items-center justify-center">{language === 'he' ? '0' : '0'}</div>
              <div className="text-sm text-gray-300">{language === 'he' ? 'סטטיסטיקה 3' : 'Statistic 3'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 h-full flex flex-col justify-start items-center text-center">
              <div className="text-4xl font-black text-amber-400 mb-4 min-h-[5rem] flex items-center justify-center">{language === 'he' ? '0' : '0'}</div>
              <div className="text-sm text-gray-300">{language === 'he' ? 'סטטיסטיקה 4' : 'Statistic 4'}</div>
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
                {language === 'he' ? 'כותרת סעיף' : 'Section Title'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {language === 'he' ? 'תת כותרת של הסעיף' : 'Section subtitle'}
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
                {language === 'he' ? 'כותרת סעיף' : 'Section Title'}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {language === 'he' ? 'תת כותרת' : 'Subtitle'}
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
              {language === 'he' ? 'תג' : 'Badge'}
            </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 text-white leading-tight">
              {language === 'he' ? 'כותרת' : 'Title'}
            </h2>
            <p className="text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto">
              {language === 'he' ? 'תיאור' : 'Description'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 mb-12">

            <p className="text-lg text-gray-200 leading-relaxed mb-8">
              {language === 'he' ? 'תיאור' : 'Description'}
            </p>

            <h3 className="text-2xl md:text-3xl font-bold mb-6 text-amber-400">
              {language === 'he' ? 'כותרת משנה' : 'Subheading'}
            </h3>
            <p className="text-gray-300 mb-6">
              {language === 'he' ? 'תיאור' : 'Description'}
            </p>

            <div className="space-y-4 mb-12">
              {[
              {
                icon: Target,
                title: language === 'he' ? 'כותרת פיצ׳ר 1' : 'Feature Title 1',
                desc: language === 'he' ? 'תיאור פיצ׳ר ראשון - מה הוא כולל ומה היתרונות' : 'Description of first feature - what it includes and benefits'
              },
              {
                icon: BarChart3,
                title: language === 'he' ? 'כותרת פיצ׳ר 2' : 'Feature Title 2',
                desc: language === 'he' ? 'תיאור פיצ׳ר שני - מה הוא כולל ומה היתרונות' : 'Description of second feature - what it includes and benefits'
              },
              {
                icon: TrendingUp,
                title: language === 'he' ? 'כותרת פיצ׳ר 3' : 'Feature Title 3',
                desc: language === 'he' ? 'תיאור פיצ׳ר שלישי - מה הוא כולל ומה היתרונות' : 'Description of third feature - what it includes and benefits'
              },
              {
                icon: CheckCircle,
                title: language === 'he' ? 'כותרת פיצ׳ר 4' : 'Feature Title 4',
                desc: language === 'he' ? 'תיאור פיצ׳ר רביעי - מה הוא כולל ומה היתרונות' : 'Description of fourth feature - what it includes and benefits'
              },
              {
                icon: BookOpen,
                title: language === 'he' ? 'כותרת פיצ׳ר 5' : 'Feature Title 5',
                desc: language === 'he' ? 'תיאור פיצ׳ר חמישי - מה הוא כולל ומה היתרונות' : 'Description of fifth feature - what it includes and benefits'
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
              {language === 'he' ? 'כותרת נוספת' : 'Additional Title'}
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {[
              { title: language === 'he' ? 'תרומה מקצועית 1' : 'Professional Contribution 1', desc: language === 'he' ? 'תיאור התרומה הראשונה' : 'Description of first contribution' },
              { title: language === 'he' ? 'תרומה מקצועית 2' : 'Professional Contribution 2', desc: language === 'he' ? 'תיאור התרומה השנייה' : 'Description of second contribution' },
              { title: language === 'he' ? 'תרומה מקצועית 3' : 'Professional Contribution 3', desc: language === 'he' ? 'תיאור התרומה השלישית' : 'Description of third contribution' }].
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
                {language === 'he' ? 'כותרת' : 'Title'}
              </h3>
              <p className="text-gray-200 leading-relaxed mb-4">
                {language === 'he' ? 'תיאור' : 'Description'}
              </p>
              <p className="text-gray-200 leading-relaxed mb-6">
                {language === 'he' ? 'פסקה נוספת' : 'Additional paragraph'}
              </p>
              <div className="flex items-center gap-2 text-white">
                <Rocket className="w-6 h-6 text-amber-400" />
                <p className="font-bold text-lg">
                  {language === 'he' ? 'טקסט מוטיבציה' : 'Motivational text'}
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
                  {language === 'he' ? 'כפתור פעולה' : 'Action Button'}
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
                {language === 'he' ? 'כותרת המלצות' : 'Testimonials Title'}
              </h2>
              <p className="text-xl text-gray-600">
                {language === 'he' ? 'תת כותרת' : 'Subtitle'}
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
                {language === 'he' ? 'כותרת סופית' : 'Final Title'}
              </h2>

              <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                {language === 'he' ? 'תיאור קריאה לפעולה' : 'Call to action description'}
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">{language === 'he' ? 'יתרון 1' : 'Benefit 1'}</h4>
                  <p className="text-gray-300 text-sm">{language === 'he' ? 'תיאור' : 'Description'}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">{language === 'he' ? 'יתרון 2' : 'Benefit 2'}</h4>
                  <p className="text-gray-300 text-sm">{language === 'he' ? 'תיאור' : 'Description'}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="font-bold text-white mb-2">{language === 'he' ? 'יתרון 3' : 'Benefit 3'}</h4>
                  <p className="text-gray-300 text-sm">{language === 'he' ? 'תיאור' : 'Description'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <Link to={createPageUrl("Questionnaire")}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl shadow-amber-500/50 font-black group">

                    <span className="flex items-center gap-3">
                      <Play className="w-7 h-7" />
                      {language === 'he' ? 'כפתור פעולה ראשי' : 'Main Action Button'}
                    </span>
                  </Button>
                </Link>
              </div>

              <p className="mt-8 text-sm text-gray-300">
                {language === 'he' ? '✓ טקסט אמון' : '✓ Trust text'}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{language === 'he' ? '0' : '0'}</h3>
              <p className="text-gray-600">{language === 'he' ? 'טקסט תג 1' : 'Badge text 1'}</p>
            </div>
            <div>
              <Award className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {language === 'he' ? '0' : '0'}
              </h3>
              <p className="text-gray-600">{language === 'he' ? 'טקסט תג 2' : 'Badge text 2'}</p>
            </div>
            <div>
              <Target className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{language === 'he' ? '0' : '0'}</h3>
              <p className="text-gray-600">{language === 'he' ? 'טקסט תג 3' : 'Badge text 3'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>);

}