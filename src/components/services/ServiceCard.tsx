import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card 
        className="cursor-pointer hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col border-2 hover:border-primary/20"
        onClick={onClick}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/600x400/8b5cf6/ffffff?text=Service';
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
            
            {/* Category Badge - Floating on Image */}
            {service.categoryName && (
              <div className="absolute top-4 left-4">
                <span className="inline-block px-4 py-1.5 bg-white/95 backdrop-blur-sm text-primary text-xs font-semibold rounded-full shadow-lg">
                  {service.categoryName}
                </span>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6 flex-1 flex flex-col">
          {/* Title */}
          <CardTitle className="text-xl font-bold line-clamp-2 mb-3 group-hover:text-primary transition-colors">
            {service.title}
          </CardTitle>

          {/* Description */}
          <CardDescription className="line-clamp-3 text-muted-foreground leading-relaxed mb-4 flex-1">
            {service.short_description}
          </CardDescription>

          {/* Read More Link */}
          <div className="flex items-center gap-2 text-primary font-semibold text-sm pt-3 border-t group-hover:gap-4 transition-all">
            <span>{service.categoryName ? 'View Details' : 'Learn More'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};