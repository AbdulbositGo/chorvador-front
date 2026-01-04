import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

interface ApiService {
  id: number;
  title: string;
  short_description: string;
  image: string;
  category: string;
}

interface ServicesSectionProps {
  services: ApiService[];
  isLoading: boolean;
}

export function ServicesSection({ services: apiServices, isLoading }: ServicesSectionProps) {
  const { t } = useLanguage();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  const getImageUrl = useCallback((imagePath: string) => {
    if (!imagePath) return '';
    
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return `${apiUrl}${imagePath}`;
    }
    
    return `${apiUrl}/${imagePath}`;
  }, []);

  const handleImageError = useCallback((serviceId: number, imageUrl: string) => {
    console.error(`Rasm yuklanmadi:`, { serviceId, attemptedUrl: imageUrl });
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  }, []);

  const handleImageLoad = useCallback((serviceId: number) => {
    setImagesLoaded((prev) => new Set(prev).add(serviceId));
  }, []);

  const displayServices = useMemo(() => 
    apiServices.slice(0, 4), 
    [apiServices]
  );

  return (
    <section 
      className="py-12 sm:py-16 lg:py-20 bg-background"
      aria-labelledby="services-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal>
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="flex-1">
              <span 
                className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
                role="status"
                aria-label="Services section"
              >
                {t("services.badge") || "Our Services"}
              </span>
              <h2 
                id="services-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight"
              >
                {t("services.title") || "What We Offer"}
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                {t("services.subtitle") || "Professional services tailored to your needs"}
              </p>
            </div>
            <motion.div 
              whileHover={{ x: 5 }} 
              transition={{ type: "spring", stiffness: 400 }}
              className="w-full md:w-auto"
            >
              <Button 
                asChild 
                variant="outline" 
                className="w-full md:w-auto group hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="View all services"
              >
                <Link to="/services" className="flex items-center justify-center gap-2">
                  {t("services.viewAll") || "View All"}
                  <ArrowRight 
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </motion.div>
          </header>
        </ScrollReveal>

        {isLoading && (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            role="status"
            aria-label="Loading services"
          >
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="bg-muted/50 rounded-xl aspect-[3/4] animate-pulse"
                aria-hidden="true"
              />
            ))}
            <span className="sr-only">Loading services...</span>
          </div>
        )}

        {!isLoading && displayServices.length === 0 && (
          <div 
            className="text-center py-12 sm:py-16"
            role="status"
            aria-live="polite"
          >
            <p className="text-muted-foreground text-base sm:text-lg">
              {t("index.services.noServices") || "No services available at the moment"}
            </p>
          </div>
        )}

        {!isLoading && displayServices.length > 0 && (
          <div role="list" aria-label="Featured services">
            <StaggerContainer 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" 
              staggerDelay={0.1}
            >
              {displayServices.map((service) => {
                const imageUrl = getImageUrl(service.image);
                const isLoaded = imagesLoaded.has(service.id);
                
                return (
                  <StaggerItem key={service.id}>
                    <article role="listitem">
                      <Link 
                        to={`/services/${service.id}`}
                        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-xl transition-shadow"
                        aria-label={`View details about ${service.title}`}
                      >
                        <motion.div
                          className="group relative h-full bg-card rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border"
                          whileHover={{ y: -8 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          {/* Image Section */}
                          <div className="relative h-48 sm:h-52 overflow-hidden bg-muted">
                            {imageErrors[service.id] ? (
                              <div 
                                className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/80"
                                role="img"
                                aria-label={`${service.title} - image unavailable`}
                              >
                                <ImageOff 
                                  className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-2" 
                                  aria-hidden="true"
                                />
                                <span className="text-xs text-muted-foreground">
                                  {t("services.imageError") || "Rasm yuklanmadi"}
                                </span>
                              </div>
                            ) : (
                              <>
                                {/* Placeholder */}
                                {!isLoaded && (
                                  <div 
                                    className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse"
                                    aria-hidden="true"
                                  />
                                )}

                                <motion.img
                                  src={imageUrl}
                                  alt={`${service.title} service illustration`}
                                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                                    isLoaded ? 'opacity-100' : 'opacity-0'
                                  }`}
                                  onError={() => handleImageError(service.id, imageUrl)}
                                  onLoad={() => handleImageLoad(service.id)}
                                  loading="lazy"
                                  decoding="async"
                                  width="400"
                                  height="300"
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.6 }}
                                />
                                <div 
                                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" 
                                  aria-hidden="true"
                                />
                                <div 
                                  className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500" 
                                  aria-hidden="true"
                                />
                              </>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="p-4 sm:p-5">
                            <h3 className="font-bold text-lg sm:text-xl text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                              {service.title}
                            </h3>
                            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                              {service.short_description}
                            </p>
                            
                            <div 
                              className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm"
                              aria-label="Learn more"
                            >
                              <span className="group-hover:translate-x-1 transition-transform duration-300">
                                {t("services.more") || "Learn more"}
                              </span>
                              <ArrowRight 
                                className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform duration-300" 
                                aria-hidden="true"
                              />
                            </div>
                          </div>

                          {/* Decorative Element */}
                          <div 
                            className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500" 
                            aria-hidden="true"
                          />
                        </motion.div>
                      </Link>
                    </article>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        )}
      </div>
    </section>
  );
}