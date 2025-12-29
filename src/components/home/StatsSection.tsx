import { Users, Package, Award, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

const stats = [
  { icon: Users, value: "1000+", labelKey: "stats.customers" },
  { icon: Package, value: "500+", labelKey: "stats.products" },
  { icon: Award, value: "10+", labelKey: "stats.experience" },
  { icon: MapPin, value: "12", labelKey: "stats.regions" },
];

export function StatsSection() {
  const { t } = useLanguage();

  return (
    <section className="py-5 gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-0 left-0 w-24 h-24 rounded-full bg-primary-foreground/20 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-primary-foreground/20 translate-x-1/3 translate-y-1/3"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-main relative">
        <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" staggerDelay={0.15}>
          {stats.map((stat) => (
            <StaggerItem key={stat.labelKey}>
              <motion.div
                className="text-center text-primary-foreground group cursor-default"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.div 
                  className="w-8 h-8 md:w-9 md:h-9 mx-auto mb-1.5 md:mb-2 rounded-lg bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-primary-foreground/20 transition-colors duration-300"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
                <motion.div 
                  className="text-xl md:text-2xl font-bold mb-0.5"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-[10px] md:text-xs text-primary-foreground/80 font-medium">{t(stat.labelKey)}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}