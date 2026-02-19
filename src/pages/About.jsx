import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Calendar, 
  Award, 
  Shield,
  Briefcase,
  BarChart3,
  DollarSign,
  UserCheck,
  BookOpen,
  Clock,
  Handshake,
  Store,
  Utensils,
  GraduationCap,
  Stethoscope,
  Plane,
  Code,
  ShoppingCart
} from "lucide-react";
import { useTranslation } from "@/components/i18n/useTranslation";
import { base44 } from "@/api/base44Client";

export default function About() {
  const { t, language } = useTranslation();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [content, setContent] = useState({});
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const items = await base44.entities.ContentItem.filter({ page: 'about' });
        const contentMap = {};
        items.forEach(item => {
          contentMap[item.content_key] = language === 'he' ? item.content_he : item.content_en;
        });
        setContent(contentMap);
      } catch (error) {
        console.error("Failed to fetch content:", error);
      } finally {
        setIsLoadingContent(false);
      }
    };
    fetchContent();
  }, [language]);

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

  const categoriesHe = [
    { icon: Briefcase, name: "שירותים מקצועיים" },
    { icon: Store, name: "קמעונאות" },
    { icon: Utensils, name: "מסעדנות ומזון" },
    { icon: Stethoscope, name: "בריאות ורווחה" },
    { icon: GraduationCap, name: "חינוך והדרכה" },
    { icon: Building2, name: "תעשייה קלה ומלאכה" },
    { icon: Plane, name: "תיירות ואירוח" },
    { icon: Code, name: "תוכנה/סייבר/פינטק" },
    { icon: ShoppingCart, name: "אי-קומרס" }
  ];

  const categoriesEn = [
    { icon: Briefcase, name: "Professional Services" },
    { icon: Store, name: "Retail" },
    { icon: Utensils, name: "Restaurants & Food" },
    { icon: Stethoscope, name: "Health & Wellness" },
    { icon: GraduationCap, name: "Education & Training" },
    { icon: Building2, name: "Light Industry & Crafts" },
    { icon: Plane, name: "Tourism & Hospitality" },
    { icon: Code, name: "Software/Cyber/Fintech" },
    { icon: ShoppingCart, name: "E-commerce" }
  ];

  const portfolioHe = [
    {
      title: "הקמת משרד עורכי דין",
      description: "בידול תפריט, תמחור לפי ערך, צמיחה מדודה.",
      icon: Briefcase
    },
    {
      title: "מעבר משכירים לעצמאים",
      description: "כל התהליך: יזמות, תוכניות עסקיות ופיננסיות, מיצוב, הצעת ערך, תמחור.",
      icon: UserCheck
    },
    {
      title: "חנויות נישה קמעונאיות",
      description: "תיכנון, ניהול, מלאי רזה, 40% פריטים מניבים, שיפור תזרים.",
      icon: Store
    },
    {
      title: "מוצרי תוכנה צעירים",
      description: "MVP, ערוץ רכישה אחד ממוקד, KPI פשוט.",
      icon: Code
    },
    {
      title: "קליניקות פרטיות",
      description: "רפואה, שיניים - מסלול לקוח, SLA שירות, לוחות תורים.",
      icon: Stethoscope
    }
  ];

  const portfolioEn = [
    {
      title: "Law Firm Establishment",
      description: "Service differentiation, value-based pricing, measured growth.",
      icon: Briefcase
    },
    {
      title: "Transition from Employee to Freelancer",
      description: "Complete process: entrepreneurship, business & financial plans, positioning, value proposition, pricing.",
      icon: UserCheck
    },
    {
      title: "Niche Retail Stores",
      description: "Planning, management, lean inventory, 40% revenue-generating items, cash flow improvement.",
      icon: Store
    },
    {
      title: "Early-Stage Software Products",
      description: "MVP, focused single acquisition channel, simple KPIs.",
      icon: Code
    },
    {
      title: "Private Clinics",
      description: "Medical, dental - customer journey, service SLA, appointment scheduling.",
      icon: Stethoscope
    }
  ];

  const categories = language === 'he' ? categoriesHe : categoriesEn;
  const portfolio = language === 'he' ? portfolioHe : portfolioEn;

  const getContent = (key, fallback = '') => content[key] || fallback;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Building2 className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {language === 'he' ? 'אודות' : 'About'}
          </h1>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            {language === 'he' ? 'תיאור החברה' : 'Company description'}
          </p>
        </div>
      </section>

      {/* About Yossi Alon */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter ${visibleSections.has('yossi') ? 'in-view' : ''}`} data-section id="yossi">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68beedf299352a857559c5a4/ce9ac8251_.jpg"
                alt={getContent('yossi_image_alt', language === 'he' ? 'יוסי אלון – יועץ ליזמים (AVENTURA 107)' : 'Yossi Alon – Business Consultant (AVENTURA 107)')}
                className="w-48 h-48 rounded-full mx-auto object-cover shadow-2xl border-4 border-amber-500"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                {language === 'he' ? 'שם המייסד' : 'Founder Name'}
              </h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                {language === 'he' ? 'פסקה ראשונה על הרקע המקצועי' : 'First paragraph about professional background'}
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                {language === 'he' ? 'פסקה שנייה על תחומי התמחות' : 'Second paragraph about expertise areas'}
              </p>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                <p className="text-gray-800 font-semibold">
                  {language === 'he' ? 'כותרת גישה מקצועית' : 'Professional Approach'}
                </p>
                <p className="text-gray-700 mt-2">
                  {language === 'he' ? 'סלוגן' : 'Slogan'}
                </p>
                <p className="text-gray-600 mt-3 text-sm">
                  {language === 'he' ? 'תיאור' : 'Description'}
                </p>
                <p className="text-gray-800 font-semibold mt-4">
                  {language === 'he' ? 'צור קשר:' : 'Contact:'}
                </p>
                <div className="space-y-1">
                  <p>
                    <a href="mailto:support@v107.co.il" className="text-amber-600 hover:text-amber-700 font-medium">
                      support@v107.co.il
                    </a>
                  </p>
                  <p>
                    <a href="tel:0552134848" className="text-amber-600 hover:text-amber-700 font-medium">
                      055-2134848
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 section-enter ${visibleSections.has('categories') ? 'in-view' : ''}`} data-section id="categories">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {language === 'he' ? 'כותרת סעיף' : 'Section Title'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'he' ? 'תת כותרת' : 'Subtitle'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-amber-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <category.icon className="w-12 h-12 mx-auto mb-4 text-amber-600" />
                  <p className="font-semibold text-gray-900">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className={`py-20 px-4 sm:px-6 lg:px-8 bg-white section-enter ${visibleSections.has('portfolio') ? 'in-view' : ''}`} data-section id="portfolio">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {language === 'he' ? 'כותרת סעיף' : 'Section Title'}
            </h2>
            <p className="text-lg text-gray-600">
              {language === 'he' ? 'תת כותרת' : 'Subtitle'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolio.map((item, index) => (
              <Card 
                key={index} 
                className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}