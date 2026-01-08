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
          console.log('No completed questionnaires found');
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
          console.log('No in-progress questionnaires found');
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

  useEffect(() => {
    // Google Tag Manager
    const script = document.createElement('script');
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N68LLCXP');`;
    document.head.appendChild(script);

    // Facebook Domain Verification
    const fbMeta = document.createElement('meta');
    fbMeta.name = 'facebook-domain-verification';
    fbMeta.content = 'tveby14q8yq1a5y44dkkk1tsx84np6';
    document.head.appendChild(fbMeta);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-100" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <noscript>
        <iframe 
          src="https://www.googletagmanager.com/ns.html?id=GTM-N68LLCXP"
          height="0" 
          width="0" 
          style={{display:'none', visibility:'hidden'}}
        />
      </noscript>
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
      
      <header className="bg-surface/80 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68beedf299352a857559c5a4/89471dac6_IMG_8646.jpg" 
                alt="V107 Logo" 
                className="w-12 h-12 rounded-lg shadow-lg object-cover"
              />
              <div>
                <h1 className="text-sm font-bold text-[#b8a46e] tracking-wider">
                  PROFESSIONAL FRAMEWORK
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation - completely hidden on mobile */}
            <div className="hidden lg:flex items-center gap-4 sm:gap-6">
              <Link to={createPageUrl("Home")} className={`text-sm font-semibold transition-colors ${location.pathname === createPageUrl("Home") ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                {t('layout.nav_home')}
              </Link>
              <Link to={createPageUrl("Articles")} className={`text-sm font-semibold transition-colors ${location.pathname.startsWith(createPageUrl("Articles")) || location.pathname.startsWith(createPageUrl("ArticleDetails")) ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                {t('layout.nav_articles')}
              </Link>
              <Link to={createPageUrl("About")} className={`text-sm font-semibold transition-colors ${location.pathname === createPageUrl("About") ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                {t('layout.nav_about')}
              </Link>
              
              {!isLoadingUser && user && (
                <Link to={createPageUrl("MyAccount")} className={`text-sm font-semibold transition-colors flex items-center gap-1 ${location.pathname === createPageUrl("MyAccount") ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                  <UserIcon className="w-4 h-4" />
                  {language === 'he' ? 'האזור שלי' : 'My Account'}
                </Link>
              )}

              {!isLoadingUser && isAdmin && (
                <Link to={createPageUrl("AdminReports")} className={`text-sm font-semibold transition-colors flex items-center gap-1 ${location.pathname === createPageUrl("AdminReports") ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>
                  <Shield className="w-4 h-4" />
                  {language === 'he' ? 'אדמין' : 'Admin'}
                </Link>
              )}
              
              {hasUnpaidReport ? (
                <Link to={createPageUrl(`Completion?responseId=${unpaidReportId}`)}>
                  <Button className="text-white rounded-lg text-sm px-5 py-2.5 font-bold animate-pulse" style={{ background: 'linear-gradient(to right, #b8a46e, #d4af37)' }}>
                    {language === 'he' ? '🎯 רכישת דוח' : '🎯 Purchase Report'}
                  </Button>
                </Link>
              ) : (
                <Link to={createPageUrl("Questionnaire")}>
                  <Button className="gradient-accent text-white rounded-lg text-sm px-5 py-2.5">
                    {hasAbandonedQuestionnaire 
                      ? (language === 'he' ? 'המשך שאלון' : 'Continue Questionnaire')
                      : t('layout.start_questionnaire_btn')
                    }
                  </Button>
                </Link>
              )}
              
              {!isLoadingUser && !user && (
                <Button variant="outline" size="sm" onClick={() => base44.auth.redirectToLogin(window.location.href)} className="bg-background text-slate-600 px-3 text-sm font-medium">
                  {language === 'he' ? 'התחבר' : 'Login'}
                </Button>
              )}
              
              {!isLoadingUser && user && (
                <Button variant="outline" size="sm" onClick={() => base44.auth.logout(createPageUrl('Home'))} className="bg-background text-slate-600 px-3 text-sm font-medium">
                  {language === 'he' ? 'התנתק' : 'Logout'}
                </Button>
              )}
              
              <Button variant="outline" size="sm" onClick={toggleLanguage} className="bg-background text-slate-600 px-3 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-9 rounded-md border-accent hover:bg-accent hover:text-white">
                {t('layout.lang_switcher')}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-700" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700" />
              )}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-slate-200 py-4">
              <nav className="flex flex-col gap-4">
                <Link 
                  to={createPageUrl("Home")} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${location.pathname === createPageUrl("Home") ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {t('layout.nav_home')}
                </Link>
                <Link 
                  to={createPageUrl("Articles")} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${location.pathname.startsWith(createPageUrl("Articles")) ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {t('layout.nav_articles')}
                </Link>
                <Link 
                  to={createPageUrl("About")} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${location.pathname === createPageUrl("About") ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {t('layout.nav_about')}
                </Link>
                
                {!isLoadingUser && user && (
                  <Link 
                    to={createPageUrl("MyAccount")} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-semibold transition-colors px-4 py-2 rounded-lg ${location.pathname === createPageUrl("MyAccount") ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {language === 'he' ? 'האזור שלי' : 'My Account'}
                  </Link>
                )}

                {!isLoadingUser && isAdmin && (
                  <Link 
                    to={createPageUrl("AdminReports")} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-sm font-semibold transition-colors flex items-center gap-2 px-4 py-2 rounded-lg ${location.pathname === createPageUrl("AdminReports") ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <Shield className="w-4 h-4" />
                    {language === 'he' ? 'אדמין' : 'Admin'}
                  </Link>
                )}
                
                {hasUnpaidReport ? (
                  <Link to={createPageUrl(`Completion?responseId=${unpaidReportId}`)} onClick={() => setIsMobileMenuOpen(false)} className="px-4">
                    <Button className="text-white rounded-lg text-sm px-5 py-2.5 w-full font-bold" style={{ background: 'linear-gradient(to right, #b8a46e, #d4af37)' }}>
                      {language === 'he' ? '🎯 רכישת דוח' : '🎯 Purchase Report'}
                    </Button>
                  </Link>
                ) : (
                  <Link to={createPageUrl("Questionnaire")} onClick={() => setIsMobileMenuOpen(false)} className="px-4">
                    <Button className="gradient-accent text-white rounded-lg text-sm px-5 py-2.5 w-full">
                      {hasAbandonedQuestionnaire 
                        ? (language === 'he' ? 'המשך שאלון' : 'Continue Questionnaire')
                        : t('layout.start_questionnaire_btn')
                      }
                    </Button>
                  </Link>
                )}
                
                {!isLoadingUser && !user && (
                  <div className="px-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        base44.auth.redirectToLogin(window.location.href);
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full"
                    >
                      {language === 'he' ? 'התחבר' : 'Login'}
                    </Button>
                  </div>
                )}
                
                {!isLoadingUser && user && (
                  <div className="px-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        base44.auth.logout(createPageUrl('Home'));
                        setIsMobileMenuOpen(false);
                      }} 
                      className="w-full"
                    >
                      {language === 'he' ? 'התנתק' : 'Logout'}
                    </Button>
                  </div>
                )}
                
                <div className="px-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      toggleLanguage();
                      setIsMobileMenuOpen(false);
                    }} 
                    className="w-full"
                  >
                    {t('layout.lang_switcher')}
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Banner for unpaid report */}
      {!isLoadingUser && hasUnpaidReport && (
        <div className="py-4 px-4 sm:px-6 lg:px-8 shadow-lg" style={{ background: 'linear-gradient(to right, #b8a46e, #d4af37)' }}>
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-right">
              <span className="text-2xl">🎯</span>
              <span className="font-bold text-lg text-white">
                {language === 'he' ? 'נותר לך רק לרכוש את הדוח המקצועי שלך!' : 'Only one step left - Purchase your professional report!'}
              </span>
            </div>
            <Link to={createPageUrl(`Completion?responseId=${unpaidReportId}`)}>
              <Button className="bg-white hover:bg-gray-100 font-bold px-8 py-3 rounded-lg shadow-lg" style={{ color: '#b8a46e' }}>
                {language === 'he' ? 'לרכישת הדוח' : 'Purchase Report'}
              </Button>
            </Link>
          </div>
        </div>
      )}

      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      <footer className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68beedf299352a857559c5a4/89471dac6_IMG_8646.jpg" 
                  alt="V107 Logo" 
                  className="w-10 h-10 rounded-lg shadow-lg object-cover"
                />
                <h3 className="text-sm font-bold text-[#b8a46e] tracking-wider">PROFESSIONAL FRAMEWORK</h3>
              </div>
            </div>

            {/* Quick Links - Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t('layout.footer_company')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link to={createPageUrl("Home")} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t('layout.nav_home')}
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("About")} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t('layout.nav_about')}
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("Articles")} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t('layout.nav_articles')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links - Resources */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t('layout.footer_resources')}</h4>
              <ul className="space-y-3">
                <li>
                  <Link to={createPageUrl("Questionnaire")} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t('layout.nav_questionnaire')}
                  </Link>
                </li>
                <li>
                  <Link to={createPageUrl("TermsOfService")} className="text-slate-400 hover:text-white transition-colors text-sm">
                    {t('layout.footer_terms')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t('layout.footer_newsletter')}</h4>
              <p className="text-slate-400 text-sm mb-4">
                {t('layout.footer_newsletter_desc')}
              </p>
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
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-accent"
                />
                <Button type="submit" className="gradient-accent px-6 whitespace-nowrap">
                  {t('layout.footer_newsletter_button')}
                </Button>
              </form>
              <div className="text-slate-400 text-sm mt-4 space-y-1">
                <p>{language === 'he' ? 'צריך עזרה?' : 'Need help?'}</p>
                <p>
                  <a href="mailto:support@v107.co.il" className="text-amber-400 hover:text-amber-300">
                    support@v107.co.il
                  </a>
                </p>
                <p>
                  <a href="tel:0552134848" className="text-amber-400 hover:text-amber-300">
                    055-2134848
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700 pt-8 text-center">
            <p className="text-xs text-slate-400 leading-relaxed max-w-4xl mx-auto">
              {language === 'he' 
                ? 'V107 | PROFESSIONAL FRAMEWORK © כל הזכויות שמורות ל-V107. חל איסור מוחלט על העתקה, צילום, הפצה או שימוש מסחרי בשם הפעילות, הסלוגן, תכני השאלון, הדו"ח והבוסטר. הפרת זכויות אלו תגרור הליכים משפטיים ודרישה לפיצויים גבוהים כחוק.'
                : 'V107 | PROFESSIONAL FRAMEWORK © All rights reserved to V107. Unauthorized copying, photographing, distribution, or commercial use of the business name, slogan, questionnaire content, report, and booster is strictly prohibited. Violation of these rights will result in legal proceedings and demands for high compensation as required by law.'}
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