import { Users, Package, Award, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { useMemo } from "react";

const stats = [
  { 
    icon: Users, 
    value: "1000+", 
    labelKey: "stats.customers",
    ariaLabel: "Over 1000 satisfied customers"
  },
  { 
    icon: Package, 
    value: "500+", 
    labelKey: "stats.products",
    ariaLabel: "More than 500 products available"
  },
  { 
    icon: Award, 
    value: "18", 
    labelKey: "stats.experience",
    ariaLabel: "Over 18 years of experience"
  },
  { 
    icon: MapPin, 
    value: "12", 
    labelKey: "stats.regions",
    ariaLabel: "Operating in 12 regions"
  },
];

export function StatsSection() {
  const { t } = useLanguage();

  const translatedStats = useMemo(() => 
    stats.map(stat => ({
      ...stat,
      label: t(stat.labelKey) || stat.ariaLabel
    })),
    [t]
  );

  return (
    // Paddinglar 30% oshirildi (py-1.5 -> py-2, md:py-3.5 -> py-4.5)
    <section 
      className="py-2 sm:py-2.5 md:py-4.5 gradient-hero relative overflow-hidden"
      aria-labelledby="stats-heading"
      role="region"
    >
      <h2 id="stats-heading" className="sr-only">Company Statistics</h2>

      {/* Orqa fon bezaklari ham kattalashtirildi */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-primary-foreground/20 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-main relative">
        <div role="list" aria-label="Company statistics">
          <StaggerContainer
            // Gap (masofa) 30% oshirildi
            className="grid grid-cols-4 gap-1.5 sm:gap-2 md:gap-4"
            staggerDelay={0.1}
          >
            {translatedStats.map((stat) => (
              <StaggerItem key={stat.labelKey}>
                <article role="listitem" aria-label={stat.ariaLabel}>
                  <motion.div
                    className="text-center text-primary-foreground group cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Ikonka konteyneri kattalashtirildi (w-7 -> w-9) */}
                    <motion.div
                      className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 mx-auto mb-1 sm:mb-1.5 rounded-md bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Ikonka o'zi kattalashtirildi */}
                      <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    </motion.div>

                    {/* Sonlar (Value) o'lchami kattalashtirildi (text-xl -> text-2xl) */}
                    <motion.div
                      className="text-base sm:text-lg md:text-2xl font-bold mb-0 leading-none"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>

                    {/* Matn (Label) o'lchami kattalashtirildi */}
                    <div className="text-[9px] sm:text-[10px] md:text-[13px] text-primary-foreground/80 font-medium leading-tight mt-0.5">
                      {stat.label}
                    </div>

                    <span className="sr-only">{stat.value} {stat.label}</span>
                  </motion.div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}