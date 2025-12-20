import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Service {
  id: number;
  title: string;
  short_description: string;
  description: string;
  image: string;
  category: string;
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // SEO metadata
  useEffect(() => {
    if (service) {
      const pageTitle = service.title;
      const siteName = "Your Company Name";
      
      document.title = `${pageTitle} | ${siteName}`;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', service.short_description);
      
      document.documentElement.lang = language;
    }
  }, [service, language]);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }

        const url = `${apiUrl}/services/${id}/`;

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const data: Service = await response.json();
        setService(data);
        
      } catch (err) {
        console.error("ServiceDetail Error:", err);
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [id, language]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center pt-20">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">
              {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="container-main py-16 px-4 mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border-2 border-destructive/20 rounded-2xl p-8 text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-destructive mb-2">
              {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || (language === 'uz' ? 'Xizmat topilmadi' : language === 'ru' ? 'Услуга не найдена' : 'Service not found')}
            </p>
            <Button onClick={() => navigate("/services")} size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'uz' ? 'Xizmatlarga qaytish' : language === 'ru' ? 'Вернуться к услугам' : 'Back to services'}
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with Image */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] overflow-hidden pt-20 md:pt-24">
        {/* Background Image */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/1920x1080/8b5cf6/ffffff?text=Service';
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/90" />
        </motion.div>

        {/* Content Over Image */}
        <div className="relative h-full container-main px-4 flex flex-col justify-end pb-8 md:pb-12">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Button
              variant="secondary"
              onClick={() => navigate("/services")}
              className="backdrop-blur-sm bg-background/80 hover:bg-background/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}
            </Button>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4"
          >
            <Badge className="px-4 py-2 text-sm font-semibold backdrop-blur-sm bg-primary/90">
              {service.category}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold text-foreground mb-4 max-w-4xl"
          >
            {service.title}
          </motion.h1>

          {/* Short Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl"
          >
            {service.short_description}
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container-main px-4">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Description Section */}
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  {language === 'uz' ? 'Batafsil ma\'lumot' : language === 'ru' ? 'Подробная информация' : 'Detailed Information'}
                </h2>
                <div 
                  className="text-muted-foreground leading-relaxed space-y-4 [&_p]:text-base [&_p]:md:text-lg [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_strong]:font-bold [&_em]:italic [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />
              </div>

              {/* Features or Benefits (Optional) */}
              <div className="border-t pt-8">
                <h3 className="text-xl md:text-2xl font-bold mb-4">
                  {language === 'uz' ? 'Nima uchun bizni tanlaysiz?' : language === 'ru' ? 'Почему выбирают нас?' : 'Why Choose Us?'}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { icon: '✓', text: language === 'uz' ? 'Professional xizmat' : language === 'ru' ? 'Профессиональное обслуживание' : 'Professional Service' },
                    { icon: '✓', text: language === 'uz' ? 'Sifat kafolati' : language === 'ru' ? 'Гарантия качества' : 'Quality Guarantee' },
                    { icon: '✓', text: language === 'uz' ? 'Tez bajarish' : language === 'ru' ? 'Быстрое выполнение' : 'Fast Delivery' },
                    { icon: '✓', text: language === 'uz' ? 'Hamyonbop narxlar' : language === 'ru' ? 'Доступные цены' : 'Affordable Prices' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                      <span className="text-2xl text-primary">{item.icon}</span>
                      <span className="text-sm font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24 space-y-6">
                {/* Contact Card */}
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-6 md:p-8 space-y-6">
                  <h3 className="text-2xl font-bold">
                    {language === 'uz' ? 'Bog\'lanish' : language === 'ru' ? 'Связаться с нами' : 'Get in Touch'}
                  </h3>
                  
                  <p className="text-muted-foreground">
                    {language === 'uz' 
                      ? 'Savollaringiz bormi? Biz bilan bog\'laning!'
                      : language === 'ru'
                      ? 'Есть вопросы? Свяжитесь с нами!'
                      : 'Have questions? Contact us!'}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-4">
                    <a 
                      href="tel:+998901234567"
                      className="flex items-center gap-4 p-4 bg-background rounded-xl hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          {language === 'uz' ? 'Telefon' : language === 'ru' ? 'Телефон' : 'Phone'}
                        </p>
                        <p className="font-bold">+998 90 123 45 67</p>
                      </div>
                    </a>
                    
                    <a 
                      href="mailto:info@example.com"
                      className="flex items-center gap-4 p-4 bg-background rounded-xl hover:shadow-md transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          {language === 'uz' ? 'Email' : language === 'ru' ? 'Эл. почта' : 'Email'}
                        </p>
                        <p className="font-bold">info@example.com</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          {language === 'uz' ? 'Manzil' : language === 'ru' ? 'Адрес' : 'Address'}
                        </p>
                        <p className="font-bold text-sm">Tashkent, Uzbekistan</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    onClick={() => {
                      const footer = document.getElementById('footer');
                      if (footer) {
                        footer.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    {language === 'uz' ? 'Buyurtma berish' : language === 'ru' ? 'Заказать услугу' : 'Order Service'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;