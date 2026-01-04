import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ApiPartner {
  id: number;
  name: string;
  logo: string;
  link: string;
}

export function PartnersSection() {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<ApiPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }

        const response = await fetch(`${apiUrl}/partners/`);
        
        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const data: ApiPartner[] = await response.json();
        setPartners(data);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Duplicate partners for seamless infinite loop - useMemo bilan
  const duplicatedPartners = useMemo(() => {
    if (partners.length === 0) return [];
    return [...partners, ...partners, ...partners];
  }, [partners]);

  const defaultLogo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop";

  const handleImageLoad = (partnerId: number) => {
    setImagesLoaded((prev) => new Set(prev).add(partnerId));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, partnerId: number) => {
    const target = e.target as HTMLImageElement;
    target.src = defaultLogo;
    handleImageLoad(partnerId);
  };

  if (loading) {
    return (
      <section 
        className="section-padding bg-muted/30"
        role="status"
        aria-label="Loading partners"
      >
        <div className="container-main">
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
            <span className="ml-3 text-muted-foreground">
              {t("products.page.loading") || "Loading..."}
            </span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section 
        className="section-padding bg-muted/30"
        role="alert"
        aria-live="polite"
      >
        <div className="container-main">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive font-medium mb-2">
              {t("error.title") || "Xatolik yuz berdi"}
            </p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  return (
    <section 
      className="section-padding bg-muted/30"
      aria-labelledby="partners-heading"
    >
      <div className="container-main">
        <ScrollReveal>
          <header className="text-center mb-12">
            <span 
              className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3"
              role="status"
              aria-label="Partners section"
            >
              {t("partners.badge") || "Our Partners"}
            </span>
            <h2 
              id="partners-heading"
              className="text-3xl md:text-4xl font-bold text-foreground"
            >
              {t("partners.title") || "Trusted Partners"}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              {t("partners.subtitle") || "Working with industry leaders"}
            </p>
          </header>
        </ScrollReveal>

        {/* Carousel Container */}
        <div 
          className="relative overflow-hidden"
          role="region"
          aria-label="Partners carousel"
        >
          {/* Gradient overlays with glow effect */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-r from-muted/30 via-muted/10 to-transparent z-10 pointer-events-none" 
            aria-hidden="true"
          />
          <div 
            className="absolute right-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-l from-muted/30 via-muted/10 to-transparent z-10 pointer-events-none" 
            aria-hidden="true"
          />
          
          {/* Desktop glow shadows */}
          <div 
            className="hidden md:block absolute left-0 top-0 bottom-0 w-24 shadow-[inset_40px_0_60px_-20px_rgba(255,255,255,0.3)] dark:shadow-[inset_40px_0_60px_-20px_rgba(0,0,0,0.5)] z-10 pointer-events-none" 
            aria-hidden="true"
          />
          <div 
            className="hidden md:block absolute right-0 top-0 bottom-0 w-24 shadow-[inset_-40px_0_60px_-20px_rgba(255,255,255,0.3)] dark:shadow-[inset_-40px_0_60px_-20px_rgba(0,0,0,0.5)] z-10 pointer-events-none" 
            aria-hidden="true"
          />
          
          <motion.div
            className="flex gap-4 md:gap-6"
            animate={{
              x: ["0%", "-33.333%"],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: partners.length * 2.5,
                ease: "linear",
              },
            }}
            role="list"
            aria-label="Partner logos"
          >
            {duplicatedPartners.map((partner, index) => {
              const uniqueKey = `${partner.id}-${index}`;
              const isLoaded = imagesLoaded.has(partner.id);
              
              return (
                <article
                  key={uniqueKey}
                  className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
                  role="listitem"
                >
                  <div className="flex flex-col gap-3">
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl transition-shadow"
                      aria-label={`Visit ${partner.name} website`}
                    >
                      <div className="rounded-2xl bg-card border border-border overflow-hidden cursor-pointer relative hover:border-primary/50 transition-colors">
                        {/* Placeholder */}
                        {!isLoaded && (
                          <div 
                            className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse"
                            aria-hidden="true"
                          />
                        )}
                        
                        <div className="relative w-full h-16 overflow-hidden">
                          <img
                            src={partner.logo}
                            alt={`${partner.name} logo`}
                            className={`w-full h-full object-contain p-2 transition-opacity duration-300 ${
                              isLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading="lazy"
                            decoding="async"
                            width="180"
                            height="64"
                            onLoad={() => handleImageLoad(partner.id)}
                            onError={(e) => handleImageError(e, partner.id)}
                          />
                        </div>
                      </div>
                    </a>
                    
                    <p 
                      className="text-sm font-medium text-foreground text-center truncate px-2"
                      title={partner.name}
                    >
                      {partner.name}
                    </p>
                  </div>
                </article>
              );
            })}
          </motion.div>
        </div>

        {/* Screen reader announcement */}
        <div className="sr-only" role="status" aria-live="polite">
          Showing {partners.length} trusted partners
        </div>
      </div>
    </section>
  );
}