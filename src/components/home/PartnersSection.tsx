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
        
        // Get API URL from .env
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
            <span className="ml-3 text-muted-foreground">{t("partners.page.loading")}</span>
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
    return null; // Don't show section if no partners
  }

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

        <StaggerContainer 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6" 
          staggerDelay={0.08}
        >
          {partners.map((partner) => (
            <StaggerItem key={partner.id}>
              <div className="flex flex-col gap-3">
                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <motion.div
                    className="group rounded-2xl bg-card border border-border overflow-hidden cursor-pointer relative"
                    whileHover={{ 
                      y: -8, 
                      boxShadow: "0 25px 50px -12px hsl(207 66% 47% / 0.25)", 
                      borderColor: "hsl(207, 66%, 47%)" 
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative w-full h-16 overflow-hidden">
                      <motion.img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = defaultLogo;
                        }}
                      />
                    </div>
                  </motion.div>
                </a>
                
                <p className="text-sm font-medium text-foreground text-center truncate px-2">
                  {partner.name}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}