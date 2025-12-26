import { useState } from "react";
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

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    if (imagePath.startsWith('/')) {
      return `${apiUrl}${imagePath}`;
    }
    
    return `${apiUrl}/${imagePath}`;
  };

  const handleImageError = (serviceId: number, imageUrl: string) => {
    console.error(`Rasm yuklanmadi:`, { serviceId, attemptedUrl: imageUrl });
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  const displayServices = apiServices.slice(0, 4);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                {t("services.badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {t("services.title")}
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                {t("services.subtitle")}
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
              >
                <Link to="/services" className="flex items-center justify-center gap-2">
                  {t("services.viewAll")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>

        {displayServices.length === 0 && !isLoading ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-muted-foreground text-base sm:text-lg">
              {t("services.noServices")}
            </p>
          </div>
        ) : (
          <StaggerContainer 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" 
            staggerDelay={0.1}
          >
            {displayServices.map((service) => {
              const imageUrl = getImageUrl(service.image);
              
              return (
                <StaggerItem key={service.id}>
                  <Link to={`/services/${service.id}`}>
                    <motion.div
                      className="group relative h-full bg-card rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-border"
                      whileHover={{ y: -8 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="relative h-48 sm:h-52 overflow-hidden bg-muted">
                        {imageErrors[service.id] ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/80">
                            <ImageOff className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">Rasm yuklanmadi</span>
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
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-all duration-500" />
                          </>
                        )}
                      </div>

                      <div className="p-4 sm:p-5">
                        <h3 className="font-bold text-lg sm:text-xl text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                          {service.short_description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm">
                          <span className="group-hover:translate-x-1 transition-transform duration-300">
                            {t("services.more")}
                          </span>
                          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>

                      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500" />
                    </motion.div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </section>
  );
}