import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

export function LocationSection() {
  const { t } = useLanguage();

  return (
    <section className="section-padding">
      <div className="container-main">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
              {t("location.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("location.title")}</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">{t("location.subtitle")}</p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          <ScrollReveal variant="fadeLeft">
            <motion.div className="rounded-2xl overflow-hidden h-[400px] shadow-lg" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1497.542603852809!2d69.26199674606329!3d41.35050164413911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d118e2bc4cf%3A0x374c51e289606a41!2sChorvador%20uz!5e0!3m2!1suz!2s!4v1766405927730!5m2!1suz!2s" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade" 
                title="Office Location"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </motion.div>
          </ScrollReveal>

          <ScrollReveal variant="fadeRight" delay={0.2}>
            <div className="flex flex-col justify-center h-full space-y-6">
              {[
                { 
                  icon: MapPin, 
                  title: t("location.addressTitle"), 
                  content: t("location.address"), 
                  href: "https://maps.app.goo.gl/7JiLiKwkkxvvT8vs5"
                }, 
                { 
                  icon: Phone, 
                  title: t("location.phoneTitle"), 
                  content: t("location.phone"), 
                  href: "tel:+998974440016" 
                }, 
                { 
                  icon: Mail, 
                  title: t("location.emailTitle"), 
                  content: t("location.email"), 
                  href: "mailto:info@chorvador.uz" 
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border group cursor-pointer" 
                  whileHover={{ x: 10, boxShadow: "0 10px 30px -10px hsl(207 66% 47% / 0.15)" }} 
                  transition={{ type: "spring", stiffness: 400 }}
                  onClick={() => item.href && window.open(item.href, '_self')}
                >
                  <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-muted-foreground group-hover:text-primary transition-colors">
                      {item.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              <motion.div className="pt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild size="lg" className="w-full btn-shine">
                  <Link to="/contact">{t("location.cta")}</Link>
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}