import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

interface DashboardResponse {
  products: ApiProduct[];
  services: ApiService[];
}

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: boolean;
  category?: string;
}

interface ApiService {
  id: number;
  title: string;
  description: string;
  image: string;
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
    
    // Agar URL to'liq bo'lsa (http:// yoki https:// bilan boshlansa)
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Backend base URL (api so'zisiz)
    const BASE_URL = 'http://37.60.239.125:8009';
    
    // Agar nisbiy yo'l bo'lsa
    if (imagePath.startsWith('/')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    // Boshqa holatlarda
    return `${BASE_URL}/${imagePath}`;
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
        const API_URL = import.meta.env.VITE_API_URL || 'http://37.60.239.125:8009/api';
        
        console.log('Fetching from:', `${API_URL}/dashboard/`);
        
        const response = await fetch(`${API_URL}/dashboard/`, {
          headers: {
            "Accept": "application/json",
            "Accept-Language": language
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server xatolik qaytardi: ${response.status} ${response.statusText}`);
        }
        
        const dashboardData: DashboardResponse = await response.json();
        console.log('Dashboard data:', dashboardData);
        
        const data: ApiService[] = dashboardData.services || [];
        
        if (!Array.isArray(data)) {
          throw new Error('Serverdan noto\'g\'ri format keldi');
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
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#2D79C4]/10 text-[#2D79C4] text-sm font-semibold mb-4">
              {t("services.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t("services.title")}
            </h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-lg">
              {t("services.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#2D79C4]" />
            <span className="ml-3 text-gray-600 text-lg">{t("products.page.loading")}</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 font-semibold mb-2 text-lg">Xatolik yuz berdi</p>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-[#2D79C4] hover:bg-[#2D79C4]/90"
            >
              Qayta urinish
            </Button>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Hozircha xizmatlar mavjud emas</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={0.1}>
            {services.map((service) => {
              const imageUrl = getImageUrl(service.image);
              
              return (
                <StaggerItem key={service.id}>
                  <Link to={`/services/${service.id}`}>
                    <motion.div
                      className="group relative h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500"
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {/* Image Container */}
                      <div className="relative h-56 overflow-hidden bg-gray-100">
                        {imageErrors[service.id] ? (
                          // Rasm yuklanmasa, placeholder ko'rsatish
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                            <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
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
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2D79C4] transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {service.description}
                        </p>
                        
                        {/* Read More Link */}
                        <div className="flex items-center gap-2 text-[#2D79C4] font-semibold text-sm group/link">
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {t("services.more")}
                          </span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-[#2D79C4]/10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        <ScrollReveal delay={0.4}>
          <div className="mt-16 text-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-[#2D79C4] hover:bg-[#2D79C4]/90 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/services">
                  {t("services.viewAll")}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}