import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useCallback } from "react";

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    short_description: string;
    image: string;
    categoryName?: string;
  };
  onClick?: () => void;
}

export const ServiceCard = ({ service, onClick }: ServiceCardProps) => {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/600x400/8b5cf6/ffffff?text=Service';
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card 
        className="cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full border-2 hover:border-primary/20 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${service.title}`}
      >
        <div className="flex flex-col h-full">
          <CardHeader className="p-0 flex-shrink-0">
            {/* Kvadrat shakl */}
            <div className="relative w-full h-0 pb-[85%] overflow-hidden bg-muted">
              {/* Placeholder */}
              {!imageLoaded && !imageError && (
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 animate-pulse"
                  aria-hidden="true"
                />
              )}

              <img
                src={service.image}
                alt={`${service.title} service illustration`}
                className={`absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                decoding="async"
                width="600"
                height="600"
                onLoad={() => setImageLoaded(true)}
                onError={handleImageError}
              />

              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" 
                aria-hidden="true"
              />
              
              {/* Category Badge */}
              {service.categoryName && (
                <div className="absolute top-4 left-4 z-10">
                  <span 
                    className="inline-block px-4 py-1.5 bg-white/95 backdrop-blur-sm text-primary text-xs font-semibold rounded-full shadow-lg"
                    role="status"
                    aria-label={`Category: ${service.categoryName}`}
                  >
                    {service.categoryName}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-5 flex flex-col flex-1">
            {/* Title - FIXED HEIGHT */}
            <div className="h-14 mb-3 overflow-hidden">
              <CardTitle 
                id={`service-${service.id}-title`}
                className="text-lg font-bold line-clamp-2 group-hover:text-primary transition-colors leading-7"
              >
                {service.title}
              </CardTitle>
            </div>

            {/* Description - FIXED HEIGHT, 2 qator */}
            <div className="h-12 mb-4 overflow-hidden">
              <CardDescription className="line-clamp-2 text-muted-foreground leading-6 text-sm">
                {service.short_description}
              </CardDescription>
            </div>

            {/* Read More Link - always at bottom */}
            <div 
              className="flex items-center gap-2 text-primary font-semibold text-sm pt-3 border-t group-hover:gap-4 transition-all mt-auto"
              aria-hidden="true"
            >
              <span>
                {service.categoryName 
                  ? (t('viewDetails') || 'View Details')
                  : (t('learnMore') || 'Learn More')
                }
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>

            {/* Screen reader text */}
            <span className="sr-only">
              Click to view {service.title} details
            </span>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};