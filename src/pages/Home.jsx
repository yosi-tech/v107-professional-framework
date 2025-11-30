import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, ArrowRight, BarChart3, Target, Lightbulb, Shield, Star, Users, Award, Briefcase, TrendingUp, CheckCircle, FileText, Clock, Quote, UserCircle, HelpCircle, Map, DollarSign, BrainCircuit, Rocket, ChevronLeft, ChevronRight, Phone, Mail, MessageSquare, Loader2, ChevronDown, ChevronUp, X, Store, Code, Stethoscope, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Testimonial } from "@/entities/Testimonial";
import { useTranslation } from "@/components/i18n/useTranslation";
import ReportInfoModal from '@/components/home/ReportInfoModal';

const painPointIcons = {
  'חוסר ודאות לגבי הרעיון': HelpCircle,
  'תחושת הצפה וחוסר כיוון': Map,
  'פחד מהסיכון הכלכלי': DollarSign,
  'חוסר ביטחון ביכולות': BrainCircuit,
  'קושי לעבור משלב החלום לביצוע': Rocket,
  'צורך באימות חיצוני': Users,
  'Uncertainty about the idea': HelpCircle,
  'Feeling overwhelmed and directionless': Map,
  'Fear of financial risk': DollarSign,
  'Lack of confidence in abilities': BrainCircuit,
  'Difficulty moving from dream to execution': Rocket,
  'Need for external validation': Users
};

export default function Home() {
  const { t, language } = useTranslation();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isReportInfoOpen, setIsReportInfoOpen] = useState(false);

  const painPoints = t('home.pain_points');
  const faqData = t('home.faq_items');
  
  const featuresData = [
    { icon: BarChart3, key: "data_driven_methodology", color: "bg-blue-500" },
    { icon: Target, key: "proven_reference_metrics", color: "bg-green-500" },
    { icon: Lightbulb, key: "experienced_expert_team", color: "bg-amber-500" }
  ];

  const howItWorksData = [
    { step: "1", icon: FileText, key: "professional_measurement" },
    { step: "2", icon: BarChart3, key: "processing_and_comparison" },
    { step: "3", icon: Award, key: "expert_report" }
  ];

  const premiumFeaturesData = [
    { icon: BarChart3, key: "detailed_graphic_analysis" },
    { icon: Target, key: "go_caution_no_go_recommendation" },
    { icon: Lightbulb, key: "strength_and_improvement_identification" },
    { icon: TrendingUp, key: "delivered_within_7_10_days" }
  ];

  const aboutUsCards = [
    { icon: Users, key: "team_lead", delay: '0s', color: "bg-blue-500" },
    { icon: Award, key: "adaptation_experts", delay: '0.2s', color: "bg-green-500" },
    { icon: Shield, key: "professional_standards", delay: '0.4s', color: "bg-amber-500" }
  ];

  const portfolioItemsHe = [
    {
      icon: Briefcase,
      title: "הקמת משרד עורכי דין",
      description: "בידול תפריט, תמחור לפי ערך, צמיחה מדודה."
    },
    {
      icon: UserCheck,
      title: "מעבר משכירים לעצמאים",
      description: "כל התהליך: יזמות, תוכניות עסקיות ופיננסיות, מיצוב, הצעת ערך, תמחור."
    },
    {
      icon: Store,
      title: "חנויות נישה קמעונאיות",
      description: "תיכנון, ניהול, מלאי רזה, 40% פריטים מניבים, שיפור תזרים."
    },
    {
      icon: Code,
      title: "מוצרי תוכנה צעירים",
      description: "MVP, ערוץ רכישה אחד ממוקד, KPI פשוט."
    },
    {
      icon: Stethoscope,
      title: "קליניקות פרטיות",
      description: "רפואה, שיניים - מסלול לקוח, SLA שירות, לוחות תורים."
    }
  ];

  const portfolioItemsEn = [
    {
      icon: Briefcase,
      title: "Law Firm Establishment",
      description: "Service differentiation, value-based pricing, measured growth."
    },
    {
      icon: UserCheck,
      title: "Employee to Freelancer Transition",
      description: "Complete process: entrepreneurship, business & financial plans, positioning, value proposition, pricing."
    },
    {
      icon: Store,
      title: "Niche Retail Stores",
      description: "Planning, management, lean inventory, 40% revenue items, cash flow improvement."
    },
    {
      icon: Code,
      title: "Early-Stage Software Products",
      description: "MVP, focused single acquisition channel, simple KPIs."
    },
    {
      icon: Stethoscope,
      title: "Private Clinics",
      description: "Medical, dental - customer journey, service SLA, appointment scheduling."
    }
  ];

  const portfolioItems = language === 'he' ? portfolioItemsHe : portfolioItemsEn;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data = await Testimonial.list('-created_date');
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
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

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      alert(t('home.contact_submit_validation'));
      return;
    }

    setIsSubmitting(true);
    try {
      const newInquiry = await base44.entities.ContactInquiry.create({
        name: contactForm.name,
        email: contactForm.email,
        phone: contactForm.phone,
        message: contactForm.message,
      });

      const { getSupportConfirmationEmailTemplate } = await import('@/components/email/SupportConfirmationTemplate');
      const ticketId = `TKT-${newInquiry.id.substring(0, 8).toUpperCase()}`;
      const date = new Date().toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US');
      
      const emailTemplate = getSupportConfirmationEmailTemplate(
        contactForm.name,
        ticketId,
        date,
        language
      );

      await base44.integrations.Core.SendEmail({
        to: contactForm.email,
        subject: emailTemplate.subject,
        body: emailTemplate.html
      });

      alert(t('home.contact_submit_success', { name: contactForm.name }));
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      alert(t('home.contact_submit_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToPremiumSection = () => {
    const premiumSection = document.getElementById('premium');
    if (premiumSection) {
      premiumSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const currentArrowIcon = language === 'he' ? ArrowLeft : ArrowRight;
  const currentArrowMargin = language === 'he' ? 'ml-3' : 'mr-3';

  return (
    <div className={`min-h-screen relative overflow-hidden bg-background ${language === 'he' ? 'rtl' : 'ltr'}`}>
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center" data-section id="hero">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-amber-900"></div>
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-400/20 rounded-full blur-xl float-animation opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-lg float-animation opacity-50" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-6xl mx-auto text-center text-white z-10">
          <div className="space-y-6 stagger-animation">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="text-white">{t('home.hero_title')}</span>
            </h1>
            <h2 className="text-lg md:text-xl font-medium text-amber-200">
              {t('home.hero_subtitle')}
            </h2>
            <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-gray-200">
              {t('home.hero_description')}
            </p>
          </div>

          <div className="mt-12 bg-black/30 backdrop-blur-lg p-6 rounded-2xl max-w-4xl mx-auto stagger-animation border border-white/10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <h3 className="text-2xl font-bold text-white">{t('home.free_questionnaire_title')}</h3>
            </div>
            <p className="text-gray-300 text-lg mb-6">
              {t('home.free_questionnaire_desc')}
            </p>
            <div className="bg-amber-900/30 rounded-xl p-4 border border-amber-500/30 mb-4">
              <p className="text-amber-200 font-semibold text-lg">
                {t('home.premium_box_title')}<br />
                <span className="text-base text-white">{t('home.premium_box_desc')}</span>
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setIsReportInfoOpen(true)}
                className="text-amber-200 hover:text-amber-100 underline text-sm transition-colors"
              >
                {t('home.report_info_button')}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8 stagger-animation">
            <Link to={createPageUrl("Questionnaire")}>
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-10 py-5 rounded-lg morph-button hover-lift font-bold">
                {t('home.start_btn')}
              </Button>
            </Link>

            <Button
              variant="outline"
              size="lg"
              onClick={scrollToPremiumSection}
              className="bg-background text-slate-900 px-8 py-5 text-lg font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-11 border-white/50 hover:bg-white/10 hover:border-white rounded-lg morph-button">
              <FileText className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
              {t('home.premium_info_btn')}
            </Button>
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter ${visibleSections.has('pain') ? 'in-view' : ''}`} data-section id="pain">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('home.pain_points_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('home.pain_points_subtitle')}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {painPoints.map((point, index) => {
              const Icon = painPointIcons[point.iconKey] || HelpCircle;
              return (
                <div key={point.id || index} className="p-6 rounded-xl stagger-animation hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-gray-900">{point.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 section-enter ${visibleSections.has('features') ? 'in-view' : ''}`} data-section id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('home.features_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">{t('home.features_subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card key={feature.key} className="interactive-card stagger-animation border-t-4 border-t-amber-500 hover-lift" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{t(`home.features.${feature.key}.title`)}</h3>
                  <p className="text-gray-600 leading-relaxed">{t(`home.features.${feature.key}.desc`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter ${visibleSections.has('how') ? 'in-view' : ''}`} data-section id="how">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('home.how_it_works_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('home.how_it_works_subtitle')}
            </p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-l from-amber-200 via-amber-400 to-amber-600"></div>
            <div className="grid md:grid-cols-3 gap-12">
              {howItWorksData.map((item, index) => (
                <div key={item.step} className="text-center stagger-animation" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg z-10 relative hover-lift">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{t(`home.how_it_works.${item.key}.title`)}</h3>
                  <p className="text-gray-600">{t(`home.how_it_works.${item.key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 section-enter ${visibleSections.has('portfolio') ? 'in-view' : ''}`} data-section id="portfolio">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {language === 'he' ? 'ניסיון מוכח בשטח' : 'Proven Field Experience'}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'he'
                ? 'ליווינו עשרות יזמים ועסקים בקטגוריות מגוונות: שירותים מקצועיים, קמעונאות, מסעדנות, בריאות, חינוך, תעשייה, תיירות, תוכנה וסייבר, אי-קומרס ועוד.'
                : 'We have guided dozens of entrepreneurs and businesses across diverse categories: professional services, retail, restaurants, healthcare, education, industry, tourism, software & cyber, e-commerce, and more.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 stagger-animation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-gray-900 to-blue-900 section-enter ${visibleSections.has('premium') ? 'in-view' : ''}`} data-section id="premium">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-6xl mx-auto relative z-10 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.premium_report_title')}</h2>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto">
              {t('home.premium_report_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {premiumFeaturesData.map((item, index) => (
                <div key={item.key} className="flex items-start gap-4 stagger-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">{t(`home.premium_report_features.${item.key}.title`)}</h4>
                    <p className="text-gray-300 text-sm">{t(`home.premium_report_features.${item.key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl hover-lift">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold mb-2 text-white">{t('home.premium_report_card_title')}</CardTitle>
                  <div className="text-4xl font-bold text-amber-400">{t('home.premium_report_price')}</div>
                  <p className="text-gray-300 text-sm">{t('home.premium_report_price_desc')}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-500/30 mb-6 text-center">
                    <p className="text-amber-200 font-medium">
                      <Star className="w-4 h-4 inline-block ml-1" />
                      {t('home.premium_report_star_message')}
                    </p>
                  </div>

                  <div className="mb-4">
                    <button
                      onClick={() => setIsReportInfoOpen(true)}
                      className="text-amber-200 hover:text-amber-100 underline text-sm transition-colors"
                    >
                      {t('home.report_info_button')}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mt-4">
                    {t('home.premium_report_note')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter ${visibleSections.has('faq') ? 'in-view' : ''}`} data-section id="faq">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('home.faq_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.faq_subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <Card key={index} className="border border-gray-200 hover:border-amber-500 transition-colors">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full p-6 ${language === 'he' ? 'text-right' : 'text-left'} flex items-center justify-between hover:bg-gray-50 transition-colors`}
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className={`w-5 h-5 text-amber-600 flex-shrink-0 ${language === 'he' ? 'mr-4' : 'ml-4'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 ${language === 'he' ? 'mr-4' : 'ml-4'}`} />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl("Questionnaire")}>
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white text-lg px-10 py-6 rounded-lg morph-button font-bold hover-lift">
                {t('home.start_free_questionnaire_button')}
                {React.createElement(currentArrowIcon, { className: `w-6 h-6 ${currentArrowMargin}` })}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 section-enter ${visibleSections.has('about') ? 'in-view' : ''}`} data-section id="about">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('home.about_us_title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('home.about_us_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {aboutUsCards.map((card) => (
              <Card key={card.key} className="interactive-card stagger-animation border-t-4 border-t-amber-500 hover-lift" style={{ animationDelay: card.delay }}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{t(`home.about_us.${card.key}.title`)}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {t(`home.about_us.${card.key}.desc`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{t('home.about_us_methodology_title')}</h3>
              <p className="text-gray-600 leading-relaxed max-w-4xl mx-auto">
                {t('home.about_us_methodology_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter ${visibleSections.has('testimonials') ? 'in-view' : ''}`} data-section id="testimonials">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('home.testimonials_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.testimonials_subtitle')}
            </p>
          </div>

          {isLoadingTestimonials ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
          ) : testimonials.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id || index} className="w-full flex-shrink-0 px-4">
                      <Card className="mx-auto max-w-3xl hover-lift border-t-4 border-amber-500 shadow-lg">
                        <CardContent className="p-8 text-center">
                          <div className="flex items-center justify-center gap-1 mb-6">
                            {[...Array(testimonial.stars)].map((_, i) => (
                              <Star key={i} className="w-6 h-6 text-amber-500 fill-current" />
                            ))}
                          </div>

                          <Quote className="w-10 h-10 text-amber-500 mx-auto mb-6" />

                          <p className="text-gray-700 mb-8 leading-relaxed italic text-xl font-medium">
                            "{testimonial.quote}"
                          </p>

                          <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-200">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                              {testimonial.name.charAt(0)}
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                              <p className="text-gray-600">{testimonial.title}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white text-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-xl z-10"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white text-gray-800 rounded-full flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all duration-300 shadow-xl z-10"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              <div className="flex justify-center mt-8 gap-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-amber-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  {t('home.testimonials_slide_indicator', { current: currentSlide + 1, total: testimonials.length })}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">{t('home.no_testimonials')}</p>
          )}
        </div>
      </section>

      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 section-enter ${visibleSections.has('contact') ? 'in-view' : ''}`} data-section id="contact">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {t('home.contact_title')}
            </h2>
            <p className="text-lg text-gray-600">
              {t('home.contact_subtitle')}
            </p>
          </div>

          <Card className="border-t-4 border-amber-500 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.contact_form.name_label')}</label>
                    <Input
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder={t('home.contact_form.name_placeholder')}
                      required
                      className="border-gray-300 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.contact_form.email_label')}</label>
                    <Input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder={t('home.contact_form.email_placeholder')}
                      required
                      className="border-gray-300 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.contact_form.phone_label')}</label>
                  <Input
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder={t('home.contact_form.phone_placeholder')}
                    className="border-gray-300 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('home.contact_form.message_label')}</label>
                  <Textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder={t('home.contact_form.message_placeholder')}
                    rows={4}
                    className="border-gray-300 focus:border-amber-500"
                  />
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 morph-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MessageSquare className={`w-5 h-5 ${language === 'he' ? 'ml-2' : 'mr-2'}`} />
                    )}
                    {isSubmitting ? t('home.contact_form.submit_button_sending') : t('home.contact_form.submit_button_text')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('home.cta_title')}
          </h2>
          <p className="text-xl text-gray-200 mb-6">
            {t('home.cta_description_1')}
          </p>
          <p className="text-sm text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('home.cta_description_2')}
          </p>
          <Link to={createPageUrl("Questionnaire")}>
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white text-xl px-12 py-6 rounded-lg morph-button font-bold hover-lift">
              {t('home.cta_button')}
              {React.createElement(currentArrowIcon, { className: `w-6 h-6 ${currentArrowMargin}` })}
            </Button>
          </Link>
        </div>
      </section>

      <ReportInfoModal
        isOpen={isReportInfoOpen}
        onClose={() => setIsReportInfoOpen(false)}
      />
    </div>
  );
}