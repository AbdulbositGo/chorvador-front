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
    // Paddinglar 30% ga kamaytirildi (py-2 -> py-1.5, md:py-5 -> md:py-3.5)
    <section 
      className="py-1.5 sm:py-2 md:py-3.5 gradient-hero relative overflow-hidden"
      aria-labelledby="stats-heading"
      role="region"
    >
      <h2 id="stats-heading" className="sr-only">Company Statistics</h2>

      {/* Orqa fon bezaklari ham kichraytirildi */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <motion.div
          className="absolute top-0 left-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary-foreground/20 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-main relative">
        <div role="list" aria-label="Company statistics">
          <StaggerContainer
            // Gap (masofa) 30% ga qisqartirildi
            className="grid grid-cols-4 gap-1 sm:gap-1.5 md:gap-3"
            staggerDelay={0.1}
          >
            {translatedStats.map((stat) => (
              <StaggerItem key={stat.labelKey}>
                <article role="listitem" aria-label={stat.ariaLabel}>
                  <motion.div
                    className="text-center text-primary-foreground group cursor-default"
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Ikonka konteyneri kichraytirildi (w-9 -> w-7) */}
                    <motion.div
                      className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 mx-auto mb-0.5 sm:mb-1 rounded-md bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* Ikonka o'zi kichraytirildi */}
                      <stat.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
                    </motion.div>

                    {/* Sonlar (Value) o'lchami kichraytirildi (text-2xl -> text-xl) */}
                    <motion.div
                      className="text-sm sm:text-base md:text-xl font-bold mb-0 leading-none"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      {stat.value}
                    </motion.div>

                    {/* Matn (Label) o'lchami kichraytirildi */}
                    <div className="text-[7px] sm:text-[8px] md:text-[10px] text-primary-foreground/80 font-medium leading-tight mt-0.5">
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