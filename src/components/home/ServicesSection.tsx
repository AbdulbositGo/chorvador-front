import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

// Dashboard API'dan keladigan struktura
interface DashboardResponse {
  products: ApiProduct[];
  services: ApiService[];
}

// API'dan keladigan product struktura (yangilangan)
interface ApiProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  short_description: string;
  has_discount: boolean;
  category: string;
}

// API'dan keladigan service struktura (yangilangan)
interface ApiService {
  id: number;
  title: string;
  short_description: string;
  image: string;
  category: string;
}

export function ServicesSection() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Rasm URL'ini to'g'ri formatga keltirish
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    const apiUrl = import.meta.env.VITE_API_URL;
    
    // Agar URL to'liq bo'lsa
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Agar nisbiy yo'l bo'lsa
    if (imagePath.startsWith('/')) {
      return `${apiUrl}${imagePath}`;
    }
    
    // Boshqa holatlarda
    return `${apiUrl}/${imagePath}`;
  };

  const handleImageError = (serviceId: number, imageUrl: string) => {
    console.error(`Rasm yuklanmadi:`, {
      serviceId,
      attemptedUrl: imageUrl
    });
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi. .env faylini tekshiring");
        }
        
        // Language kodini to'g'ri formatga o'tkazish
        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        
        const response = await fetch(`${apiUrl}/dashboard/`, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            "Accept-Language": acceptLanguage,
            "Content-Type": "application/json"
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const dashboardData: DashboardResponse = await response.json();
        
        const data: ApiService[] = dashboardData.services || [];
        
        if (!Array.isArray(data)) {
          throw new Error('Noto\'g\'ri ma\'lumot formati');
        }
        
        // Rasmlar URL'larini tekshirish
        data.forEach((service, index) => {
          const finalUrl = getImageUrl(service.image);
          console.log(`Service ${index + 1}:`, {
            id: service.id,
            title: service.title,
            originalImage: service.image,
            finalImageUrl: finalUrl
          });
        });
        
        setServices(data.slice(0, 4));
      } catch (err) {
        console.error('Xizmatlarni yuklashda xatolik:', err);
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik yuz berdi';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [language]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#2D79C4]/10 text-[#2D79C4] text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
              {t("services.badge")}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              {t("services.title")}
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {t("services.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-12 sm:py-16 lg:py-20">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-[#2D79C4]" />
            <span className="mt-3 text-sm sm:text-base lg:text-lg text-gray-600">
              {t("products.page.loading")}
            </span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center mx-4 sm:mx-0">
            <p className="text-red-600 font-semibold mb-2 text-base sm:text-lg">
              Xatolik yuz berdi
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              {error}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full sm:w-auto bg-[#2D79C4] hover:bg-[#2D79C4]/90"
            >
              Qayta urinish
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 sm:py-16 lg:py-20">
            <p className="text-gray-500 text-base sm:text-lg">
              Hozircha xizmatlar mavjud emas
            </p>
          </div>
        ) : (
          <StaggerContainer 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8" 
            staggerDelay={0.1}
          >
            {services.map((service) => {
              const imageUrl = getImageUrl(service.image);
              
              return (
                <StaggerItem key={service.id}>
                  <Link to={`/services/${service.id}`}>
                    <motion.div
                      className="group relative h-full bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500"
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Image Container */}
                      <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gray-100">
                        {imageErrors[service.id] ? (
                          // Rasm yuklanmasa, placeholder ko'rsatish
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <ImageOff className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500">Rasm yuklanmadi</span>
                          </div>
                        ) : (
                          <>
                            <motion.img
                              src={imageUrl}
                              alt={service.title}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(service.id, imageUrl)}
                              loading="lazy"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            
                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-[#2D79C4]/0 group-hover:bg-[#2D79C4]/20 transition-all duration-500" />
                          </>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 sm:p-5 lg:p-6">
                        <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-[#2D79C4] transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                          {service.short_description}
                        </p>
                        
                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-[#2D79C4] font-semibold text-xs sm:text-sm group/link">
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {t("services.more")}
                          </span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-[#2D79C4]/10 rounded-bl-full transform translate-x-8 sm:translate-x-10 -translate-y-8 sm:-translate-y-10 group-hover:translate-x-6 sm:group-hover:translate-x-8 group-hover:-translate-y-6 sm:group-hover:-translate-y-8 transition-transform duration-500" />
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        <ScrollReveal delay={0.4}>
          <div className="mt-10 sm:mt-12 lg:mt-16 text-center px-4">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto bg-[#2D79C4] hover:bg-[#2D79C4]/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/services" className="flex items-center justify-center gap-2">
                  {t("services.viewAll")}
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}