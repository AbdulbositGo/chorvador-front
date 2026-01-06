import { useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { ServiceCard } from "@/components/services/ServiceCard";

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
  const navigate = useNavigate();

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

  const displayServices = useMemo(() => 
    apiServices.slice(0, 4).map(service => ({
      id: service.id,
      title: service.title,
      short_description: service.short_description,
      image: getImageUrl(service.image),
      categoryName: service.category
    })), 
    [apiServices, getImageUrl]
  );

  const handleServiceClick = useCallback((serviceId: number) => {
    navigate(`/services/${serviceId}`);
  }, [navigate]);

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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch"
            role="status"
            aria-label="Loading services"
          >
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="bg-muted/50 rounded-xl h-full min-h-[400px] animate-pulse"
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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-stretch" 
              staggerDelay={0.1}
            >
              {displayServices.map((service) => (
                <StaggerItem key={service.id}>
                  <ServiceCard 
                    service={service}
                    onClick={() => handleServiceClick(service.id)}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </section>
  );
}