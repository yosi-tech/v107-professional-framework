import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Shield, User as UserIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatBot from "@/components/ai/ChatBot";
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
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
      
      <header className="bg-surface/80 backdrop-blur-lg border-b border-slate-200/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  V107
                </h1>
                <p className="text-xs text-slate-500">
                  {t('layout.header_subtitle')}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4 sm:gap-6">
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
              
              <Link to={createPageUrl("Questionnaire")}>
                  <Button className="gradient-accent text-white rounded-lg text-sm px-5 py-2.5">
                    {t('layout.start_questionnaire_btn')}
                  </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={toggleLanguage} className="bg-background text-slate-600 px-3 text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-9 rounded-md border-accent hover:bg-accent hover:text-white">
                {t('layout.lang_switcher')}
              </Button>
            </nav>

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
                    className={`text-sm font-semibold transition-colors flex items-center gap-2 px-4 py-2 rounded-lg ${location.pathname === createPageUrl("MyAccount") ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <UserIcon className="w-4 h-4" />
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
                
                <Link to={createPageUrl("Questionnaire")} onClick={() => setIsMobileMenuOpen(false)} className="px-4">
                  <Button className="gradient-accent text-white rounded-lg text-sm px-5 py-2.5 w-full">
                    {t('layout.start_questionnaire_btn')}
                  </Button>
                </Link>
                
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
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 gradient-accent rounded-lg flex items-center justify-center shadow-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl font-bold">V107</h3>
            </div>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto text-sm">
              {t('layout.footer_subtitle')}
            </p>
            <div className="flex justify-center gap-6 mb-6">
              <Link to={createPageUrl("TermsOfService")} className="text-sm text-slate-400 hover:text-white transition-colors">{t('layout.footer_terms')}</Link>
              <Link to={createPageUrl("PrivacyPolicy")} className="text-sm text-slate-400 hover:text-white transition-colors">{t('layout.footer_privacy')}</Link>
              <Link to={createPageUrl("CancellationPolicy")} className="text-sm text-slate-400 hover:text-white transition-colors">{t('layout.footer_cancellation')}</Link>
            </div>
            <div className="border-t border-slate-700 pt-6">
              <p className="text-xs text-slate-500">
                {t('layout.footer_copyright')}
              </p>
            </div>
          </div>
        </div>
      </footer>
      
      <ChatBot />
    </div>);

}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  );
}