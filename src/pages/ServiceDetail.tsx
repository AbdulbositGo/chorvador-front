import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Service {
  title: string;
  description: string;
  image: string;
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      if (!id) return;

      console.log('🚀 ServiceDetail: Fetching service:', id);
      console.log('🌐 ServiceDetail: Current language:', language);

      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi. .env faylini tekshiring");
        }

        const url = `${apiUrl}/services/${id}/`;
        console.log('📡 ServiceDetail: Fetching from:', url);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });

        console.log('📥 ServiceDetail: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const data: Service = await response.json();
        console.log('✅ ServiceDetail: Data received:', data);
        setService(data);
        
      } catch (err) {
        console.error("❌ ServiceDetail: Error:", err);
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
        <div className="container-main py-12 md:py-16">
          <div className="flex justify-center items-center min-h-[300px] md:min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-primary mx-auto mb-3" />
              <span className="text-sm md:text-base text-muted-foreground">
                {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="container-main py-12 md:py-16 px-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 md:p-8 text-center max-w-2xl mx-auto">
            <p className="text-destructive font-medium mb-2 text-base md:text-lg">
              {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
            </p>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              {error || (language === 'uz' ? 'Xizmat topilmadi' : language === 'ru' ? 'Услуга не найдена' : 'Service not found')}
            </p>
            <Button onClick={() => navigate("/services")} variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'uz' ? 'Xizmatlarga qaytish' : language === 'ru' ? 'Вернуться к услугам' : 'Back to services'}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-4 md:py-8 border-b">
        <div className="container-main px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/services")}
            className="mb-3 md:mb-4 hover:bg-muted/50 transition-colors text-sm md:text-base"
            size="sm"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            {language === 'uz' ? 'Xizmatlarga qaytish' : language === 'ru' ? 'Вернуться к услугам' : 'Back to services'}
          </Button>
          <nav className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
            <button 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </button>
            <span className="text-muted-foreground">/</span>
            <button 
              onClick={() => navigate("/services")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.services")}
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[150px] md:max-w-none">
              {service.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Service Detail */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-main px-4">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16">
            {/* Image Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 md:space-y-4"
            >
              {/* Main Image Display */}
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-lg">
                <motion.img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image';
                  }}
                />
              </div>
            </motion.div>

            {/* Service Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              {/* Title */}
              <div className="space-y-2 md:space-y-3">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                  {service.title}
                </h1>
              </div>

              {/* Description */}
              <div className="border-t pt-4 md:pt-6">
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
                  {language === 'uz' ? 'Tavsif' : language === 'ru' ? 'Описание' : 'Description'}
                </h2>
                <div 
                  className="text-sm md:text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                >
                  <p className="whitespace-pre-line">{service.description}</p>
                </div>
              </div>

              {/* Contact Section */}
              <div className="border-t pt-4 md:pt-6">
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
                  {language === 'uz' ? 'Bog\'lanish' : language === 'ru' ? 'Связаться' : 'Contact'}
                </h2>
                <div className="space-y-3">
                  <a 
                    href="tel:+998901234567"
                    className="flex items-center gap-3 p-3 md:p-3.5 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {language === 'uz' ? 'Telefon' : language === 'ru' ? 'Телефон' : 'Phone'}
                      </p>
                      <p className="text-sm font-semibold text-foreground">+998 90 123 45 67</p>
                    </div>
                  </a>
                  <a 
                    href="mailto:info@example.com"
                    className="flex items-center gap-3 p-3 md:p-3.5 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {language === 'uz' ? 'Email' : language === 'ru' ? 'Эл. почта' : 'Email'}
                      </p>
                      <p className="text-sm font-semibold text-foreground">info@example.com</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <Button 
                  onClick={() => {
                    const footer = document.getElementById('footer');
                    if (footer) {
                      footer.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full"
                  size="lg"
                >
                  {language === 'uz' ? 'Buyurtma berish' : language === 'ru' ? 'Заказать' : 'Order Now'}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;