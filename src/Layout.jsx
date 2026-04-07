import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Shield, User as UserIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { LanguageProvider } from "@/components/i18n/LanguageContext";
import { useTranslation } from "@/components/i18n/useTranslation";
import { LanguageContext } from "@/components/i18n/LanguageContext";
import { base44 } from "@/api/base44Client";

function AppLayout({ children }) {
  const location = useLocation();
  const { language, setLanguage } = useContext(LanguageContext);
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasUnpaidReport, setHasUnpaidReport] = useState(false);
  const [unpaidReportId, setUnpaidReportId] = useState(null);
  const [hasAbandonedQuestionnaire, setHasAbandonedQuestionnaire] = useState(false);

  // Initialize GTM
  useEffect(() => {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    // Add GTM script to head
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-N68LLCXP');
    `;
    document.head.insertBefore(gtmScript, document.head.firstChild);

    // Add noscript iframe to body
    const noscript = document.createElement('noscript');
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=GTM-N68LLCXP';
    iframe.height = '0';
    iframe.width = '0';
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }, []);

  // Initialize Accessibility Widget (EqualWeb/Nagich)
  useEffect(() => {
    window.interdeal = {
      get sitekey() { return "f2598de0436f0d3058ec35949030669f" },
      get domains() {
        return {
          "js": "https://cdn.nagich.co.il/",
          "acc": "https://access.nagich.co.il/"
        }
      },
      "Position": "left",
      "Menulang": "he",
      "draggable": true,
      "btnStyle": {
        "vPosition": ["80%", "80%"],
        "margin": ["0", "0"],
        "scale": ["0.5", "0.5"],
        "color": {
          "main": "#243669",
          "second": "#ffffff"
        },
        "icon": {
          "outline": true,
          "outlineColor": "#beac7b",
          "type": 11,
          "shape": "circle"
        }
      }
    };

    const coreCall = document.createElement('script');
    coreCall.src = window.interdeal.domains.js + 'core/5.2.0/accessibility.js';
    coreCall.defer = true;
    coreCall.integrity = 'sha512-fHF4rKIzByr1XeM6stpnVdiHrJUOZsKN2/Pm0jikdTQ9uZddgq15F92kUptMnyYmjIVNKeMIa67HRFnBNTOXsQ==';
    coreCall.crossOrigin = 'anonymous';
    coreCall.setAttribute('data-cfasync', true);
    document.body.appendChild(coreCall);
  }, []);



  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // בדוק אם יש שאלון שהושלם
        try {
          const responses = await base44.entities.QuestionnaireResponse.filter(
            { created_by: currentUser.email, status: 'completed' },
            '-updated_date',
            1
          );
          
          if (responses.length > 0) {
            // בדוק אם יש תשלום מוצלח עבור השאלון הזה
            try {
              const paidOrders = await base44.entities.PaymentOrder.filter(
                { 
                  user_email: currentUser.email,
                  questionnaire_response_id: responses[0].id,
                  status: 'paid'
                },
                '-created_date',
                1
              );
              
              const hasPaidForThisQuestionnaire = paidOrders.length > 0;
              
              if (!hasPaidForThisQuestionnaire) {
                setHasUnpaidReport(true);
                setUnpaidReportId(responses[0].id);
              }
            } catch (e) {
              // אם אין PaymentOrder, בדוק את הדגלים ביוזר
              const hasPurchased = currentUser.has_purchased_full_report || currentUser.has_purchased_answers_download;
              if (!hasPurchased) {
                setHasUnpaidReport(true);
                setUnpaidReportId(responses[0].id);
              }
            }
          }
        } catch (e) {
          // No completed questionnaires found
        }

        // בדוק אם יש שאלון נזנח או בתהליך
        try {
          const responses = await base44.entities.QuestionnaireResponse.filter(
            { created_by: currentUser.email },
            '-updated_date',
            1
          );
          if (responses.length > 0 && (responses[0].status === 'in_progress' || responses[0].status === 'abandoned')) {
            setHasAbandonedQuestionnaire(true);
          }
        } catch (e) {
          // No in-progress questionnaires found
        }
      } catch (error) {
        // User not logged in or other error
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadUser();
  }, []);



  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-100" dir={language === 'he' ? 'rtl' : 'ltr'}>

      <style>{`
        :root {
          --color-primary: #1a202c; /* Dark Charcoal */
          --color-primary-dark: #000000; /* Black */
          --color-secondary: #718096; /* Slate Gray */
          --color-accent: #d69e2e; /* Rich Gold */
          --color-accent-light: #f6e05e; /* Light Gold */
          --color-text-primary: #1a202c; /* Dark Charcoal */
          --color-text-secondary: #4a5568; /* Gray */
          --color-text-muted: #a0aec0; /* Light Gray */
          --color-background: #f7fafc; /* Very Light Gray */
          --color-surface: #ffffff; /* White */
          --color-border: #e2e8f0; /* Light Gray Border */
          --color-success: #38a169;
          --color-warning: #dd6b20;
          --color-error: #e53e3e;
        }
        
        * {
          font-family: 'Assistant', 'Noto Sans Hebrew', 'Rubik', -apple-system, BlinkMacSystemFont, system-ui, sans-serif !important;
        }
        
        body {
          background-color: var(--color-background);
          color: var(--color-text-primary);
        }

        .gradient-primary {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        }
        
        .gradient-accent {
          background: linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent) 100%);
        }
        
        .gradient-hero {
          background: linear-gradient(135deg, #2d3748 0%, #1a202c 50%, #000000 100%);
          background-size: 200% 200%;
          animation: gradientFlow 10s ease infinite;
        }

        .animated-gradient-text {
          background: linear-gradient(45deg, #1a202c, #4a5568, #d69e2e, #1a202c);
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientText 5s ease infinite;
        }

        .glass-dark {
          background: rgba(26, 32, 44, 0.8);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
        }
        
        .interactive-card {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          transition: all 0.3s ease;
        }
        
        .interactive-card:hover {
          border-color: var(--color-accent);
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05);
        }

        .morph-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .morph-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          transition: all 0.4s ease;
          transform: translate(-50%, -50%);
          border-radius: 50%;
        }

        .morph-button:hover::before {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
        }

        /* Enhanced Animations */
        html { scroll-behavior: smooth; }
        
        @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes gradientFlow { 0%, 100% { background-position: 0% 0%; } 50% { background-position: 100% 100%; } }
        @keyframes gradientText { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        
        .float-animation { animation: float 6s ease-in-out infinite; }
        .glass { background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(8px); border: 1px solid rgba(255, 255, 255, 0.15); }
        .stagger-animation { opacity: 0; transform: translateY(20px); animation: staggerIn 0.5s ease-out forwards; }
        @keyframes staggerIn { to { opacity: 1; transform: translateY(0); } }
        
        .pulse-glow:hover::before { 
          content: ''; 
          position: absolute; 
          top: 0; 
          left: -100%; 
          width: 100%; 
          height: 100%; 
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); 
          animation: pulseAnim 1s; 
        }
        @keyframes pulseAnim { 0% { left: -100%; } 100% { left: 100%; } }
        
        .section-enter {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .section-enter.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        .neon-glow {
          text-shadow: 0 0 8px rgba(214, 158, 46, 0.6);
        }
        
        /* Custom Carousel Styles */
        .testimonial-carousel {
          overflow: hidden;
          position: relative;
        }
        
        .testimonial-track {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }
        
        .testimonial-slide {
          min-width: 100%;
          flex-shrink: 0;
        }
        
        @media (min-width: 768px) {
          .testimonial-slide {
            min-width: 50%;
          }
        }
        
        @media (min-width: 1024px) {
          .testimonial-slide {
            min-width: 33.333333%;
          }
        }
        
        .carousel-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(26, 32, 44, 0.8);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .carousel-nav:hover {
          background: rgba(214, 158, 46, 0.9);
          transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-nav.prev {
          right: 10px;
        }
        
        .carousel-nav.next {
          left: 10px;
        }
        
        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }
        
        .carousel-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #e2e8f0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .carousel-dot.active {
          background: #d69e2e;
          transform: scale(1.2);
        }
      `}</style>
      
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl transition-all duration-300">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="text-2xl font-black tracking-tighter text-slate-900 flex items-center">
              107<span className="text-[#FF8F00]">V</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-8 items-center">
            <Link
              to={createPageUrl("Home")}
              className={`font-bold tracking-tight transition-colors ${location.pathname === createPageUrl("Home") ? 'text-[#FF8F00] border-b-2 border-[#FF8F00]' : 'text-slate-600 hover:text-[#FF8F00]'}`}
            >
              {t('layout.nav_home')}
            </Link>
            <Link
              to={createPageUrl("Articles")}
              className={`font-bold tracking-tight transition-colors ${location.pathname.startsWith(createPageUrl("Articles")) || location.pathname.startsWith(createPageUrl("ArticleDetails")) ? 'text-[#FF8F00] border-b-2 border-[#FF8F00]' : 'text-slate-600 hover:text-[#FF8F00]'}`}
            >
              {t('layout.nav_articles')}
            </Link>
            <Link
              to={createPageUrl("About")}
              className={`font-bold tracking-tight transition-colors ${location.pathname === createPageUrl("About") ? 'text-[#FF8F00] border-b-2 border-[#FF8F00]' : 'text-slate-600 hover:text-[#FF8F00]'}`}
            >
              {language === 'he' ? 'אודות' : 'About'}
            </Link>

            {!isLoadingUser && user && (
              <Link
                to={createPageUrl("MyAccount")}
                className={`font-bold tracking-tight transition-colors flex items-center gap-1 ${location.pathname === createPageUrl("MyAccount") ? 'text-[#FF8F00] border-b-2 border-[#FF8F00]' : 'text-slate-600 hover:text-[#FF8F00]'}`}
              >
                <UserIcon className="w-4 h-4" />
                {language === 'he' ? 'האזור שלי' : 'My Account'}
              </Link>
            )}

            {!isLoadingUser && isAdmin && (
              <Link
                to={createPageUrl("AdminReports")}
                className={`font-bold tracking-tight transition-colors flex items-center gap-1 ${location.pathname === createPageUrl("AdminReports") ? 'text-[#FF8F00] border-b-2 border-[#FF8F00]' : 'text-slate-600 hover:text-[#FF8F00]'}`}
              >
                <Shield className="w-4 h-4" />
                {language === 'he' ? 'אדמין' : 'Admin'}
              </Link>
            )}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden lg:flex gap-4 items-center">
            <Link to={createPageUrl("Questionnaire")}>
              <button className="bg-[#FF8F00] text-white px-6 py-2.5 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-200">
                {hasAbandonedQuestionnaire
                  ? (language === 'he' ? 'המשך שאלון' : 'Continue Questionnaire')
                  : t('layout.start_questionnaire_btn')
                }
              </button>
            </Link>

            {!isLoadingUser && !user && (
              <button
                onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="text-slate-600 font-semibold hover:bg-slate-50 px-4 py-2 rounded-full transition-all"
              >
                {language === 'he' ? 'התחבר' : 'Login'}
              </button>
            )}

            {!isLoadingUser && user && (
              <button
                onClick={() => base44.auth.logout(createPageUrl('Home'))}
                className="text-slate-600 font-semibold hover:bg-slate-50 px-4 py-2 rounded-full transition-all"
              >
                {language === 'he' ? 'התנתק' : 'Logout'}
              </button>
            )}
          </div>

          {/* Mobile Quick Actions */}
          <div className="lg:hidden flex items-center gap-2">
            {!isLoadingUser && user && hasAbandonedQuestionnaire && (
              <Link to={createPageUrl("Questionnaire")}>
                <button className="bg-[#FF8F00] text-white text-xs px-3 py-1.5 rounded-full font-bold">
                  {language === 'he' ? 'המשך' : 'Continue'}
                </button>
              </Link>
            )}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="bg-slate-100/50 h-[1px] w-full"></div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 py-4">
            <nav className="flex flex-col gap-2 px-8">
              <Link
                to={createPageUrl("Home")}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-bold tracking-tight py-2 px-3 rounded-lg transition-colors ${location.pathname === createPageUrl("Home") ? 'text-[#FF8F00] bg-orange-50' : 'text-slate-600 hover:text-[#FF8F00] hover:bg-slate-50'}`}
              >
                {t('layout.nav_home')}
              </Link>
              <Link
                to={createPageUrl("Articles")}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-bold tracking-tight py-2 px-3 rounded-lg transition-colors ${location.pathname.startsWith(createPageUrl("Articles")) ? 'text-[#FF8F00] bg-orange-50' : 'text-slate-600 hover:text-[#FF8F00] hover:bg-slate-50'}`}
              >
                {t('layout.nav_articles')}
              </Link>
              <Link
                to={createPageUrl("About")}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-bold tracking-tight py-2 px-3 rounded-lg transition-colors ${location.pathname === createPageUrl("About") ? 'text-[#FF8F00] bg-orange-50' : 'text-slate-600 hover:text-[#FF8F00] hover:bg-slate-50'}`}
              >
                {language === 'he' ? 'אודות' : 'About'}
              </Link>

              {!isLoadingUser && user && (
                <Link
                  to={createPageUrl("MyAccount")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-bold tracking-tight py-2 px-3 rounded-lg transition-colors ${location.pathname === createPageUrl("MyAccount") ? 'text-[#FF8F00] bg-orange-50' : 'text-slate-600 hover:text-[#FF8F00] hover:bg-slate-50'}`}
                >
                  {language === 'he' ? 'האזור שלי' : 'My Account'}
                </Link>
              )}

              {!isLoadingUser && isAdmin && (
                <Link
                  to={createPageUrl("AdminReports")}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`font-bold tracking-tight flex items-center gap-2 py-2 px-3 rounded-lg transition-colors ${location.pathname === createPageUrl("AdminReports") ? 'text-[#FF8F00] bg-orange-50' : 'text-slate-600 hover:text-[#FF8F00] hover:bg-slate-50'}`}
                >
                  <Shield className="w-4 h-4" />
                  {language === 'he' ? 'אדמין' : 'Admin'}
                </Link>
              )}

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <Link to={createPageUrl("Questionnaire")} onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="w-full bg-[#FF8F00] text-white py-2.5 rounded-full font-bold transition-all">
                    {hasAbandonedQuestionnaire
                      ? (language === 'he' ? 'המשך שאלון' : 'Continue Questionnaire')
                      : t('layout.start_questionnaire_btn')
                    }
                  </button>
                </Link>

                {!isLoadingUser && !user && (
                  <button
                    onClick={() => { base44.auth.redirectToLogin(window.location.href); setIsMobileMenuOpen(false); }}
                    className="w-full text-slate-600 font-semibold hover:bg-slate-50 py-2 rounded-full transition-all border border-slate-200"
                  >
                    {language === 'he' ? 'התחבר' : 'Login'}
                  </button>
                )}

                {!isLoadingUser && user && (
                  <button
                    onClick={() => { base44.auth.logout(createPageUrl('Home')); setIsMobileMenuOpen(false); }}
                    className="w-full text-slate-600 font-semibold hover:bg-slate-50 py-2 rounded-full transition-all border border-slate-200"
                  >
                    {language === 'he' ? 'התנתק' : 'Logout'}
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>



      <main className="flex-1 relative z-10 pt-[73px]">
        {children}
      </main>
      
      <footer className="bg-slate-50 border-t border-slate-200 w-full py-12">
        <div className="max-w-7xl mx-auto px-12">
          {/* Main footer row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-xl font-bold tracking-tighter text-slate-900 flex items-center">
                107<span className="text-[#FF8F00]">V</span>
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="flex flex-wrap gap-6 justify-center">
              <Link to={createPageUrl("Home")} className="text-slate-500 text-sm transition-colors hover:text-[#FF8F00]">
                {t('layout.nav_home')}
              </Link>
              <Link to={createPageUrl("About")} className="text-slate-500 text-sm transition-colors hover:text-[#FF8F00]">
                {t('layout.nav_about')}
              </Link>
              <Link to={createPageUrl("Articles")} className="text-slate-500 text-sm transition-colors hover:text-[#FF8F00]">
                {t('layout.nav_articles')}
              </Link>
              <Link to={createPageUrl("TermsOfService")} className="text-slate-500 text-sm transition-colors hover:text-[#FF8F00]">
                {t('layout.footer_terms')}
              </Link>
              <Link to={createPageUrl("PrivacyPolicy")} className="text-slate-500 text-sm transition-colors hover:text-[#FF8F00]">
                {language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}
              </Link>
              <Link to={createPageUrl("AccessibilityStatement")} className="text-slate-500 text-sm transition-colors hover:text-[#FF8F00]">
                {language === 'he' ? 'נגישות' : 'Accessibility'}
              </Link>
              <Link to="/Contact" className="text-slate-500 text-sm transition-colors hover:text-[#FF8F00]">
                {language === 'he' ? 'צור קשר' : 'Contact Us'}
              </Link>
            </nav>


            {/* Copyright */}
            <div className="text-slate-500 text-sm">
              © 2026 v107. {language === 'he' ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
            </div>
          </div>

          {/* Newsletter + Contact */}
          <div className="border-t border-slate-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 max-w-sm">
                <h4 className="text-slate-700 font-semibold mb-3 text-sm">{t('layout.footer_newsletter')}</h4>
                <p className="text-slate-500 text-xs mb-3">{t('layout.footer_newsletter_desc')}</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  if (!email) return;
                  try {
                    await base44.entities.ContactInquiry.create({
                      name: 'Newsletter Subscriber',
                      email: email,
                      message: 'Newsletter subscription request',
                      source: 'newsletter_footer'
                    });
                    alert(t('layout.footer_newsletter_success'));
                    e.target.reset();
                  } catch (error) {
                    console.error('Newsletter subscription error:', error);
                  }
                }} className="flex gap-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder={t('layout.footer_newsletter_placeholder')}
                    required
                    className="bg-white border-slate-300 text-slate-700 placeholder:text-slate-400 text-sm"
                  />
                  <button type="submit" className="bg-[#FF8F00] text-white px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap hover:scale-105 transition-all">
                    {t('layout.footer_newsletter_button')}
                  </button>
                </form>
              </div>

              <div className="text-slate-500 text-sm space-y-1 text-start md:text-end">
                <p>{language === 'he' ? 'צריך עזרה?' : 'Need help?'}</p>
                <Link to="/Contact" className="text-[#FF8F00] hover:underline font-medium">
                  {language === 'he' ? 'צרו קשר כאן' : 'Contact us here'}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 select-none">
              V107™ Professional Framework | © 2026 V107 Global Strategist | Registered Intellectual Property
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'he' ? 'האתר נבנה על ידי ' : 'Website built by '}
              <a href="https://roeielba.com/" target="_blank" rel="noopener noreferrer" className="text-[#FF8F00] hover:underline">
                {language === 'he' ? 'רועי אלבה' : 'Roei Elba'}
              </a>
            </p>
          </div>
        </div>
      </footer>
      </div>);

}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  );
}