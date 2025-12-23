import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
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

  const defaultLogo = "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop";

  if (loading) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-main">
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">{t("products.page.loading")}</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section-padding bg-muted/30">
        <div className="container-main">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive font-medium mb-2">Xatolik yuz berdi</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  // Duplicate partners for seamless infinite loop
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
              {t("partners.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("partners.title")}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              {t("partners.subtitle")}
            </p>
          </div>
        </ScrollReveal>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays with glow effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-r from-muted/30 via-muted/10 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-l from-muted/30 via-muted/10 to-transparent z-10 pointer-events-none" />
          
          {/* Desktop glow shadows */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 shadow-[inset_40px_0_60px_-20px_rgba(255,255,255,0.3)] dark:shadow-[inset_40px_0_60px_-20px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 shadow-[inset_-40px_0_60px_-20px_rgba(255,255,255,0.3)] dark:shadow-[inset_-40px_0_60px_-20px_rgba(0,0,0,0.5)] z-10 pointer-events-none" />
          
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
          >
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
              >
                <div className="flex flex-col gap-3">
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="rounded-2xl bg-card border border-border overflow-hidden cursor-pointer relative">
                      <div className="relative w-full h-16 overflow-hidden">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultLogo;
                          }}
                        />
                      </div>
                    </div>
                  </a>
                  
                  <p className="text-sm font-medium text-foreground text-center truncate px-2">
                    {partner.name}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}