"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Leaf, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function About() {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section 
      className="py-12 px-4 md:px-6 bg-white"
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto bg-[#2D79C4] rounded-[2.5rem] overflow-hidden p-6 md:p-12 lg:p-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          {/* Left Column - Image with Overlay Card */}
          <div className="relative w-full lg:w-1/2 aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden group">
            {/* Placeholder background */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse" />
            )}
            
            <img
              src="https://images.ctfassets.net/ww1ie0z745y7/2jQScrJHTLky7NF8gy8U1c/8095e855650973caf96c14530d698d72/dairy-cow-in-a-field.jpg?fm=webp&w=800&q=80"
              srcSet="https://images.ctfassets.net/ww1ie0z745y7/2jQScrJHTLky7NF8gy8U1c/8095e855650973caf96c14530d698d72/dairy-cow-in-a-field.jpg?fm=webp&w=400&q=80 400w,
                      https://images.ctfassets.net/ww1ie0z745y7/2jQScrJHTLky7NF8gy8U1c/8095e855650973caf96c14530d698d72/dairy-cow-in-a-field.jpg?fm=webp&w=800&q=80 800w,
                      https://images.ctfassets.net/ww1ie0z745y7/2jQScrJHTLky7NF8gy8U1c/8095e855650973caf96c14530d698d72/dairy-cow-in-a-field.jpg?fm=webp&w=1200&q=80 1200w"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              alt={t("about1.imageAlt") || "Modern agriculture solutions with dairy farming technology"}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              width="800"
              height="1000"
            />
          </div>

          {/* Right Column - Content */}
          <div className="w-full lg:w-1/2 text-white">
            <div className="flex items-center gap-2 mb-6" role="status" aria-label="Feature badge">
              <Leaf className="h-5 w-5 text-white" aria-hidden="true" />
              <span className="text-white font-medium text-sm tracking-wide uppercase">
                {t("about1.badge") || "Shaping the future of smart agriculture!"}
              </span>
            </div>

            <h2 
              id="about-heading"
              className="text-2xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-8"
            >
              {t("about1.title") || "Smart Agriculture Solutions"}
            </h2>

            <p className="text-white/90 text-lg leading-relaxed mb-6 lg:mb-12 max-w-xl">
              {t("about1.subtitle") || "Innovative technology for modern farming"}
            </p>

            <nav aria-label="About sections">
              <ul className="space-y-6 list-none">
                <li>
                  <button
                    className="group cursor-pointer text-left w-full hover:translate-x-1 transition-transform"
                    aria-label="Learn about our introduction"
                  >
                    <h3 className="text-xl font-bold text-white transition-colors group-hover:text-white/90">
                      {t("about1.intro") || "Our Introduction"}
                    </h3>
                  </button>
                </li>
                <li>
                  <button
                    className="group cursor-pointer text-left w-full hover:translate-x-1 transition-transform"
                    aria-label="View current projects"
                  >
                    <h3 className="text-xl font-bold text-white/60 hover:text-white/80 transition-colors">
                      {t("about1.current") || "Current Projects"}
                    </h3>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}