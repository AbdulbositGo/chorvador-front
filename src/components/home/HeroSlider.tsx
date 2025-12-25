import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  title: string;
  description: string;
  image: string;
  link: string;
}

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/banners/`, {
          headers: {
            "Accept": "application/json",
            "Accept-Language": language
          }
        });

        if (!response.ok) throw new Error('Failed to fetch banners');
        
        const data: Banner[] = await response.json();
        setSlides(data);
      } catch (err) {
        console.error('Error fetching banners:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [language]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const handleSlideClick = () => {
    if (slides[currentSlide]?.link) {
      window.location.href = slides[currentSlide].link;
    }
  };

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-[#2D79C4]">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-[#2D79C4]">
        <p className="text-white text-lg">Bannerlar topilmadi</p>
      </section>
    );
  }

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden h-screen bg-black -mt-16 pt-16">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute inset-0 cursor-pointer"
          onClick={handleSlideClick}
        >
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </motion.div>

          {/* Content */}
          <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="max-w-3xl text-white"
            >
              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl"
              >
                {slide.title}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl md:text-2xl text-white/90 font-light leading-relaxed"
              >
                {slide.description}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

{/* Navigation Arrows */}
      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-lg text-white flex items-center justify-center hover:bg-[#2D79C4] hover:scale-110 transition-all duration-300 z-20 shadow-2xl"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-lg text-white flex items-center justify-center hover:bg-[#2D79C4] hover:scale-110 transition-all duration-300 z-20 shadow-2xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
      </button> */}
      
      {/* <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-lg text-white hidden md:flex items-center justify-center hover:bg-[#2D79C4] hover:scale-110 transition-all duration-300 z-20 shadow-2xl"
        aria-label="Next slide"
      >
        <ChevronRight className="w-7 h-7" />
      </button> */}

      {/* Progress Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-500 shadow-lg",
              index === currentSlide
                ? "w-10 bg-[#2D79C4]"
                : "w-2 bg-white/40 hover:bg-white/60"
            )}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </section>
  );
}