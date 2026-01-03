"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight } from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  return (
    <section className="py-12 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto bg-[#2D79C4] rounded-[2.5rem] overflow-hidden p-6 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
        {/* Left Column - Image with Overlay Card */}
        <div className="relative w-full lg:w-1/2 aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden group">
          <img
            src="https://images.ctfassets.net/ww1ie0z745y7/2jQScrJHTLky7NF8gy8U1c/8095e855650973caf96c14530d698d72/dairy-cow-in-a-field.jpg?fm=webp&w=1920&q=75"
            alt="Agriculture solutions"
            className="object-cover transition-transform duration-700 group-hover:scale-105 h-full"
          />
        </div>

        {/* Right Column - Content */}
        <div className="w-full lg:w-1/2 text-white">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="h-5 w-5 text-white" />
            <span className="text-white font-medium text-sm tracking-wide uppercase">
              {t("about1.badge") || "Shaping the future of smart agriculture!"}
            </span>
          </div>

          <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-8">
            {t("about1.title")}
          </h2>

          <p className="text-white/70 text-lg leading-relaxed mb-6 lg:mb-12 max-w-xl">
            {t("about1.subtitle")}
          </p>

          <div className="space-y-6">
            <div className="group cursor-pointer">
              <h4 className="text-xl font-bold text-white transition-colors">
                {t("about1.intro")}
              </h4>
            </div>
            <div className="group cursor-pointer">
              <h4 className="font-bold text-white/50 hover:text-white/70 transition-colors">
                {t("about1.current")}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
