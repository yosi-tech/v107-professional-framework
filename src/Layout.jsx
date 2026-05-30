import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Menu, X } from "lucide-react";

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
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Initialize GTM
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    const gtmScript = document.createElement('script');
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-N68LLCXP');
    `;
    document.head.insertBefore(gtmScript, document.head.firstChild);
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

  // Initialize Accessibility Widget
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
        "color": { "main": "#4F46E5", "second": "#ffffff" },
        "icon": { "outline": true, "outlineColor": "#818CF8", "type": 11, "shape": "circle" }
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
        try {
          const responses = await base44.entities.QuestionnaireResponse.filter(
            { created_by: currentUser.email, status: 'completed' }, '-updated_date', 1
          );
          if (responses.length > 0) {
            try {
              const paidOrders = await base44.entities.PaymentOrder.filter(
                { user_email: currentUser.email, questionnaire_response_id: responses[0].id, status: 'paid' }, '-created_date', 1
              );
              if (paidOrders.length === 0) {
                setHasUnpaidReport(true);
                setUnpaidReportId(responses[0].id);
              }
            } catch (e) {
              const hasPurchased = currentUser.has_purchased_full_report || currentUser.has_purchased_answers_download;
              if (!hasPurchased) {
                setHasUnpaidReport(true);
                setUnpaidReportId(responses[0].id);
              }
            }
          }
        } catch (e) {}
        try {
          const responses = await base44.entities.QuestionnaireResponse.filter(
            { created_by: currentUser.email }, '-updated_date', 1
          );
          if (responses.length > 0 && (responses[0].status === 'in_progress' || responses[0].status === 'abandoned')) {
            setHasAbandonedQuestionnaire(true);
          }
        } catch (e) {}
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    loadUser();
  }, []);

  const isAdmin = user && user.role === 'admin';

  const navLinks = [
    { to: createPageUrl("Home"), label: t('layout.nav_home'), active: location.pathname === createPageUrl("Home") },
    { to: createPageUrl("Articles"), label: t('layout.nav_articles'), active: location.pathname.startsWith(createPageUrl("Articles")) || location.pathname.startsWith(createPageUrl("ArticleDetails")) },
    { to: createPageUrl("About"), label: language === 'he' ? 'איך זה עובד?' : 'How it works?', active: location.pathname === createPageUrl("About") },
  ];

  if (!isLoadingUser && user) {
    navLinks.push({ to: createPageUrl("MyAccount"), label: language === 'he' ? 'האזור שלי' : 'My Account', active: location.pathname === createPageUrl("MyAccount") });
  }

  return (
    <div className="min-h-screen bg-background font-heebo" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/60 backdrop-blur-md'}`}>
        <div className="flex items-center w-full px-6 lg:px-10 py-3.5 max-w-7xl mx-auto">
          {/* Mobile Hamburger */}
          <div className="lg:hidden flex items-center gap-2 order-first">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-secondary transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
          </div>

          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0">
            <span className="text-2xl font-black tracking-tighter text-foreground flex items-center">
              107<span className="text-primary">V</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${link.active ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                {link.label}
              </Link>
            ))}
            {!isLoadingUser && isAdmin && (
              <Link
                to={createPageUrl("AdminReports")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${location.pathname === createPageUrl("AdminReports") ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground hover:bg-secondary'}`}
              >
                <Shield className="w-3.5 h-3.5" />
                {language === 'he' ? 'אדמין' : 'Admin'}
              </Link>
            )}
          </nav>

          {/* Action buttons */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link to={createPageUrl("Questionnaire")}>
              <button className="bg-accent text-accent-foreground py-2.5 px-6 rounded-xl text-sm font-semibold transition-all hover:opacity-90 hover:shadow-lg hover:shadow-accent/25">
                {hasAbandonedQuestionnaire
                  ? (language === 'he' ? 'המשך שאלון' : 'Continue Questionnaire')
                  : (language === 'he' ? 'התחל מיפוי אישי' : 'Start Assessment')
                }
              </button>
            </Link>
            {!isLoadingUser && !user && (
              <button
                onClick={() => base44.auth.redirectToLogin(window.location.href)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                {language === 'he' ? 'התחבר' : 'Login'}
              </button>
            )}
            {!isLoadingUser && user && (
              <button
                onClick={() => base44.auth.logout(createPageUrl('Home'))}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                {language === 'he' ? 'התנתק' : 'Logout'}
              </button>
            )}
          </div>

          {/* Mobile CTA */}
          <div className="lg:hidden flex items-center gap-2 mr-auto">
            <Link to={createPageUrl("Questionnaire")}>
              <button className="bg-accent text-accent-foreground text-xs px-4 py-2 rounded-lg font-semibold">
                {hasAbandonedQuestionnaire ? (language === 'he' ? 'המשך' : 'Continue') : (language === 'he' ? 'התחל' : 'Start')}
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-border px-6 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}
                className={`font-medium py-2.5 px-3 rounded-lg text-sm ${link.active ? 'text-primary bg-primary/5' : 'text-foreground'}`}>
                {link.label}
              </Link>
            ))}
            {!isLoadingUser && isAdmin && (
              <Link to={createPageUrl("AdminReports")} onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium text-foreground py-2.5 px-3 rounded-lg text-sm flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />{language === 'he' ? 'אדמין' : 'Admin'}
              </Link>
            )}
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-border">
              <Link to={createPageUrl("Questionnaire")} onClick={() => setIsMobileMenuOpen(false)}>
                <button className="w-full bg-accent text-accent-foreground py-2.5 rounded-xl text-sm font-semibold">
                  {hasAbandonedQuestionnaire ? (language === 'he' ? 'המשך שאלון' : 'Continue') : (language === 'he' ? 'התחל מיפוי אישי' : 'Start Assessment')}
                </button>
              </Link>
              {!isLoadingUser && !user && (
                <button onClick={() => { base44.auth.redirectToLogin(window.location.href); setIsMobileMenuOpen(false); }}
                  className="w-full text-sm font-medium text-muted-foreground border border-border py-2 rounded-xl">
                  {language === 'he' ? 'התחבר' : 'Login'}
                </button>
              )}
              {!isLoadingUser && user && (
                <button onClick={() => { base44.auth.logout(createPageUrl('Home')); setIsMobileMenuOpen(false); }}
                  className="w-full text-sm font-medium text-muted-foreground border border-border py-2 rounded-xl">
                  {language === 'he' ? 'התנתק' : 'Logout'}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 relative pt-[60px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-white/70 w-full py-16 pb-24 xl:pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <span className="text-xl font-black tracking-tighter text-white flex items-center">
                107<span className="text-primary">V</span>
              </span>
            </Link>
            <nav className="flex flex-wrap gap-6 justify-center">
              <Link to={createPageUrl("Home")} className="text-sm transition-colors hover:text-white">{t('layout.nav_home')}</Link>
              <Link to={createPageUrl("About")} className="text-sm transition-colors hover:text-white">{t('layout.nav_about')}</Link>
              <Link to={createPageUrl("Articles")} className="text-sm transition-colors hover:text-white">{t('layout.nav_articles')}</Link>
              <Link to={createPageUrl("TermsOfService")} className="text-sm transition-colors hover:text-white">{t('layout.footer_terms')}</Link>
              <Link to={createPageUrl("PrivacyPolicy")} className="text-sm transition-colors hover:text-white">{language === 'he' ? 'מדיניות פרטיות' : 'Privacy Policy'}</Link>
              <Link to={createPageUrl("AccessibilityStatement")} className="text-sm transition-colors hover:text-white">{language === 'he' ? 'נגישות' : 'Accessibility'}</Link>
              <Link to="/Contact" className="text-sm transition-colors hover:text-white">{language === 'he' ? 'צור קשר' : 'Contact Us'}</Link>
            </nav>
            <div className="text-sm">
              © 2026 v107. {language === 'he' ? 'כל הזכויות שמורות.' : 'All rights reserved.'}
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 max-w-sm">
                <h4 className="text-white font-semibold mb-3 text-sm">{t('layout.footer_newsletter')}</h4>
                <p className="text-xs mb-3 text-white/50">{t('layout.footer_newsletter_desc')}</p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const email = e.target.email.value;
                  if (!email) return;
                  try {
                    await base44.entities.ContactInquiry.create({
                      name: 'Newsletter Subscriber', email: email,
                      message: 'Newsletter subscription request', source: 'newsletter_footer'
                    });
                    alert(t('layout.footer_newsletter_success'));
                    e.target.reset();
                  } catch (error) {
                    console.error('Newsletter subscription error:', error);
                  }
                }} className="flex gap-2">
                  <input
                    type="email" name="email"
                    placeholder={t('layout.footer_newsletter_placeholder')}
                    required
                    className="flex-1 bg-white/10 border border-white/10 text-white placeholder:text-white/30 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button type="submit" className="bg-accent text-white px-5 py-2 rounded-lg font-semibold text-sm whitespace-nowrap hover:opacity-90 transition-all">
                    {t('layout.footer_newsletter_button')}
                  </button>
                </form>
              </div>
              <div className="text-sm space-y-1 text-start md:text-end">
                <p className="text-white/50">{language === 'he' ? 'צריך עזרה?' : 'Need help?'}</p>
                <Link to="/Contact" className="text-primary hover:underline font-medium">
                  {language === 'he' ? 'צרו קשר כאן' : 'Contact us here'}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-white/30 select-none">
              V107™ Professional Framework | © 2026 V107 Global Strategist | Registered Intellectual Property
            </p>
            <p className="text-xs text-white/30 mt-1">
              {language === 'he' ? 'האתר נבנה על ידי צוות פיתוח V107' : 'Website built by V107 development team'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      <AppLayout>{children}</AppLayout>
    </LanguageProvider>
  );
}