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
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="h-full"
      aria-labelledby={`service-${service.id}-title`}
    >
      <Card 
        className="cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col border-2 hover:border-primary/20 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${service.title}`}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
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
              className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              width="600"
              height="375"
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
              <div className="absolute top-4 left-4">
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
        
        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <CardTitle 
            id={`service-${service.id}-title`}
            className="text-xl font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors"
          >
            {service.title}
          </CardTitle>

          {/* Description */}
          <CardDescription className="line-clamp-3 text-muted-foreground leading-relaxed mb-4 flex-1">
            {service.short_description}
          </CardDescription>

          {/* Read More Link */}
          <div 
            className="flex items-center gap-2 text-primary font-semibold text-sm pt-3 border-t group-hover:gap-4 transition-all"
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
      </Card>
    </motion.article>
  );
};