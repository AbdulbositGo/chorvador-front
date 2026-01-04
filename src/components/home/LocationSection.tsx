import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { useState } from "react";

export function LocationSection() {
  const { t } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);

  const contactItems = [
    { 
      icon: MapPin, 
      title: t("location.addressTitle") || "Address", 
      content: t("location.address") || "Tashkent, Uzbekistan", 
      href: "https://maps.app.goo.gl/7JiLiKwkkxvvT8vs5",
      ariaLabel: "View our location on Google Maps"
    }, 
    { 
      icon: Phone, 
      title: t("location.phoneTitle") || "Phone", 
      content: t("location.phone") || "+998 97 444 00 16", 
      href: "tel:+998974440016",
      ariaLabel: "Call us at +998 97 444 00 16"
    }, 
    { 
      icon: Mail, 
      title: t("location.emailTitle") || "Email", 
      content: t("location.email") || "info@chorvador.uz", 
      href: "mailto:info@chorvador.uz",
      ariaLabel: "Send us an email"
    }
  ];

  const handleContactClick = (href: string) => {
    if (href.startsWith('mailto:') || href.startsWith('tel:')) {
      window.location.href = href;
    } else {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  const handleContactKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleContactClick(href);
    }
  };

  return (
    <section 
      className="section-padding"
      aria-labelledby="location-heading"
    >
      <div className="container-main">
        <ScrollReveal>
          <header className="text-center mb-12">
            <span 
              className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3"
              role="status"
              aria-label="Location section"
            >
              {t("location.badge") || "Location"}
            </span>
            <h2 
              id="location-heading"
              className="text-3xl md:text-4xl font-bold text-foreground"
            >
              {t("location.title") || "Visit Our Office"}
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              {t("location.subtitle") || "Find us at our convenient location"}
            </p>
          </header>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <ScrollReveal variant="fadeLeft">
            <motion.div 
              className="rounded-2xl overflow-hidden h-[400px] shadow-lg relative" 
              whileHover={{ scale: 1.02 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Placeholder */}
              {!mapLoaded && (
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="text-center">
                    <MapPin className="w-12 h-12 mx-auto text-primary mb-2 animate-pulse" />
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              )}

              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1497.542603852809!2d69.26199674606329!3d41.35050164413911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d118e2bc4cf%3A0x374c51e289606a41!2sChorvador%20uz!5e0!3m2!1suz!2s!4v1766405927730!5m2!1suz!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" 
                title="Chorvador office location in Tashkent, Uzbekistan"
                aria-label="Interactive map showing Chorvador office location"
                onLoad={() => setMapLoaded(true)}
                className={mapLoaded ? 'opacity-100' : 'opacity-0'}
              />
            </motion.div>
          </ScrollReveal>

          {/* Contact Information */}
          <ScrollReveal variant="fadeRight" delay={0.2}>
            <div className="flex flex-col justify-center h-full space-y-6">
              <nav aria-label="Contact information">
                <ul className="space-y-6 list-none">
                  {contactItems.map((item, i) => (
                    <li key={i}>
                      <motion.article
                        className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border group cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 transition-shadow" 
                        whileHover={{ x: 10, boxShadow: "0 10px 30px -10px hsl(207 66% 47% / 0.15)" }} 
                        transition={{ type: "spring", stiffness: 400 }}
                        onClick={() => handleContactClick(item.href)}
                        onKeyDown={(e) => handleContactKeyDown(e, item.href)}
                        tabIndex={0}
                        role="button"
                        aria-label={item.ariaLabel}
                      >
                        <div 
                          className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                          aria-hidden="true"
                        >
                          <item.icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground mb-1">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground group-hover:text-primary transition-colors break-words">
                            {item.content}
                          </p>
                        </div>
                      </motion.article>
                    </li>
                  ))}
                </ul>
              </nav>

              <motion.div 
                className="pt-4" 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full btn-shine"
                  aria-label="Go to contact page"
                >
                  <Link to="/contact">
                    {t("location.cta") || "Contact Us"}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}