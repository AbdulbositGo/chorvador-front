import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Truck, Wrench, Headphones, ShieldCheck, Tractor, Leaf, ArrowRight, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface ServiceContent {
  icon?: keyof typeof iconMap;
  type?: 'delivery' | 'technical' | 'consulting' | 'warranty' | 'general';
  features?: string[];
  howItWorks?: { title: string; description: string }[];
  pricing?: { name: string; value: string }[];
  workingHours?: string;
  phone?: string;
  email?: string;
  location?: string;
  detailedDescription?: string;
  additionalInfo?: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  content?: string | ServiceContent;
  image?: string | null;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

interface TransformedService {
  id: number;
  title: string;
  description: string;
  image?: string | null;
  icon: keyof typeof iconMap;
  type: 'delivery' | 'technical' | 'consulting' | 'warranty' | 'general';
  features: string[];
}

const iconMap = {
  Truck,
  Wrench,
  Headphones,
  ShieldCheck,
  Tractor,
  Leaf,
} as const;

const Services = () => {
  const { t, language } = useLanguage();
  
  const [services, setServices] = useState<TransformedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [previousPage, setPreviousPage] = useState<string | null>(null);
  const [pageSize] = useState(9);

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const BASE_URL = 'http://37.60.239.125:8009';
    
    if (imagePath.startsWith('/')) {
      return `${BASE_URL}${imagePath}`;
    }
    
    return `${BASE_URL}/${imagePath}`;
  };

  const fetchServices = async (page: number = 1) => {
    console.log("🚀 Services: Fetching page", page);
    
    try {
      setLoading(true);
      setError(null);
      
      const API_URL = import.meta.env.VITE_API_URL;
      const fullUrl = `${API_URL}/services/?page=${page}`;
      
      console.log("📡 Services: Request URL:", fullUrl);
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Accept-Language': language,
        },
      });
      
      console.log("📥 Services: Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP xatolik! Status: ${response.status}`);
      }
      
      const data: PaginatedResponse = await response.json();
      console.log("✅ Services: Data keldi:", data);
      
      setTotalCount(data.count);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      
      const transformedServices: TransformedService[] = data.results.map((service, index) => {
        let parsedContent: ServiceContent = {};
        
        try {
          if (service.content) {
            parsedContent = typeof service.content === 'string' 
              ? JSON.parse(service.content) 
              : service.content;
          }
        } catch (e) {
          console.warn(`⚠️ Content parse xatolik #${index + 1}:`, e);
          parsedContent = {};
        }
        
        let icon: keyof typeof iconMap = 'Wrench';
        
        if (parsedContent && parsedContent.icon && parsedContent.icon in iconMap) {
          icon = parsedContent.icon;
        }
        
        const type: TransformedService['type'] = 
          (parsedContent && parsedContent.type) || 'general';
        
        const features = 
          (parsedContent && Array.isArray(parsedContent.features)) 
            ? parsedContent.features 
            : [];
        
        return {
          id: service.id || index,
          title: service.title || 'Noma\'lum xizmat',
          description: service.description || '',
          image: getImageUrl(service.image),
          icon,
          type,
          features,
        };
      });
      
      console.log("🎉 Barcha xizmatlar transform bo'ldi:", transformedServices);
      setServices(transformedServices);
      
    } catch (err) {
      console.error("❌ Services: XATOLIK:", err);
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(currentPage);
  }, [language, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Layout>
      {/* Hero Section - Contact Page Style */}
      <section className="relative py-12 md:py-20 bg-gradient-to-br from-[#2D79C4] via-[#2D79C4]/95 to-[#1e5a94] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container-main relative z-10 px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t("services.page.title")}
            </h1>
            <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed">
              {t("services.page.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container-main px-4 md:px-6">
          
          {/* Total Count Badge - Left Aligned */}
          {!loading && !error && (
            <div className="mb-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-2 h-2 rounded-full bg-[#2D79C4] animate-pulse" />
                <span className="text-sm font-medium text-gray-600">
                  {language === 'uz' ? 'Jami' : language === 'ru' ? 'Всего' : 'Total'}:
                </span>
                <span className="text-2xl font-bold text-[#2D79C4]">{totalCount}</span>
                <span className="text-sm font-medium text-gray-600">
                  {language === 'uz' ? 'ta xizmat' : language === 'ru' ? 'услуг' : 'services'}
                </span>
              </motion.div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#2D79C4] mb-4" />
              <span className="text-gray-600 text-lg font-medium">
                {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-red-600 font-semibold mb-2 text-lg">
                {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
              </p>
              <p className="text-sm text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-[#2D79C4] text-white rounded-lg hover:bg-[#2D79C4]/90 transition-colors font-medium"
              >
                {language === 'uz' ? 'Qayta urinish' : language === 'ru' ? 'Повторить' : 'Try again'}
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && services.length > 0 && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12"
              >
                {services.map((service, index) => {
                  const IconComponent = iconMap[service.icon];
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#2D79C4]/50 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {service.image && (
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          
                          <div className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                            <IconComponent className="w-6 h-6 text-[#2D79C4]" />
                          </div>
                        </div>
                      )}
                      
                      <div className="p-6">
                        {!service.image && (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2D79C4] to-[#1e5a94] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                        )}
                        
                        <h3 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2D79C4] transition-colors">
                          {service.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                          {service.description}
                        </p>
                        
                        {service.features && service.features.length > 0 && (
                          <ul className="space-y-2 mb-5">
                            {service.features.slice(0, 3).map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2D79C4] mt-1.5 flex-shrink-0" />
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        <Link
                          to={`/services/${service.id}`}
                          className="inline-flex items-center gap-2 text-[#2D79C4] font-semibold text-sm hover:gap-3 transition-all group/link"
                        >
                          {t("services.more")}
                          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    {language === 'uz' ? 'Sahifa' : language === 'ru' ? 'Страница' : 'Page'}{' '}
                    <span className="font-semibold text-[#2D79C4]">{currentPage}</span>
                    {' '}{language === 'uz' ? 'dan' : language === 'ru' ? 'из' : 'of'}{' '}
                    <span className="font-semibold">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!previousPage}
                      className={cn(
                        "p-2 rounded-lg border transition-all",
                        previousPage
                          ? "border-gray-300 hover:border-[#2D79C4] hover:bg-[#2D79C4]/5 text-gray-700"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={cn(
                                "w-10 h-10 rounded-lg font-medium transition-all",
                                page === currentPage
                                  ? "bg-[#2D79C4] text-white shadow-lg shadow-[#2D79C4]/30"
                                  : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                              )}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!nextPage}
                      className={cn(
                        "p-2 rounded-lg border transition-all",
                        nextPage
                          ? "border-gray-300 hover:border-[#2D79C4] hover:bg-[#2D79C4]/5 text-gray-700"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 hidden sm:block">
                    {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalCount)}{' '}
                    {language === 'uz' ? 'dan' : language === 'ru' ? 'из' : 'of'}{' '}
                    {totalCount}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && !error && services.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl">🔍</span>
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">
                {language === 'uz' ? 'Xizmatlar topilmadi' : language === 'ru' ? 'Услуги не найдены' : 'No services found'}
              </p>
              <p className="text-gray-400 text-sm">
                {language === 'uz' ? 'Keyinroq qayta urinib ko\'ring' : language === 'ru' ? 'Попробуйте позже' : 'Try again later'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;