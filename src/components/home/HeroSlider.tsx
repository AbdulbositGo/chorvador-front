import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

interface Banner {
  title?: string | null;
  description?: string | null;
  image: string;
  link?: string | null;
}

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const { language, t } = useLanguage();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/banners/`, {
          headers: {
            Accept: "application/json",
            "Accept-Language": language,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch banners");

        const data: Banner[] = await response.json();
        setSlides(data);

        // Rasmlarni oldindan yuklash
        data.forEach((banner, index) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded((prev) => new Set(prev).add(index));
          };
          img.src = banner.image;
        });
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [language]);

  // Auto-play timer
  useEffect(() => {
    if (slides.length === 0 || isPaused) return;
    
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, isPaused]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    // Timer reset qilish
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handleButtonClick = useCallback(() => {
    const link = slides[currentSlide]?.link;
    if (
      link &&
      typeof link === "string" &&
      link.trim() !== "" &&
      link !== "null"
    ) {
      window.location.href = link;
    }
  }, [slides, currentSlide]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  }, [goToPrevious, goToNext]);

  if (loading) {
    return (
      <section 
        className="relative h-[400px] sm:h-[500px] md:h-screen flex items-center justify-center bg-[#2D79C4]"
        role="status"
        aria-label="Loading banners"
      >
        <Loader2 className="w-12 h-12 animate-spin text-white" aria-hidden="true" />
        <span className="sr-only">Loading banners...</span>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section 
        className="relative h-[400px] sm:h-[500px] md:h-screen flex items-center justify-center bg-[#2D79C4]"
        role="status"
        aria-live="polite"
      >
        <p className="text-white text-lg">
          {language === "uz" ? "Bannerlar topilmadi" : "No banners found"}
        </p>
      </section>
    );
  }

  const slide = slides[currentSlide];
  const isCurrentImageLoaded = imagesLoaded.has(currentSlide);
  const hasValidLink = slide.link && slide.link !== "null" && typeof slide.link === "string" && slide.link.trim() !== "";
  const hasContent = (slide.title && slide.title !== "null") || (slide.description && slide.description !== "null");

  return (
    <section 
      className="relative w-full min-h-[360px] h-[40vh] sm:h-[436px] lg:h-[calc(100vh-64px)] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Featured banners"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={0}
    >
      {/* Preload slides - faqat keyingi slide */}
      {slides[0] && (
        <link
          rel="preload"
          as="image"
          href={slides[0].image}
        />
      )}
      {slides[1] && (
        <link
          rel="preload"
          as="image"
          href={slides[1].image}
        />
      )}

      {/* Current Slide */}
      <div 
        className="absolute w-full h-full"
        role="group"
        aria-roledescription="slide"
        aria-label={`Slide ${currentSlide + 1} of ${slides.length}`}
      >
        {/* Background Image */}
        <img
          src={slide.image}
          alt={slide.title || `Banner ${currentSlide + 1}`}
          className="absolute w-full h-[102%] object-cover object-center transition-opacity duration-300"
          style={{ opacity: isCurrentImageLoaded ? 1 : 0 }}
          loading={currentSlide === 0 ? "eager" : "lazy"}
          decoding="async"
          width="1920"
          height="1080"
        />

        {/* Placeholder uchun gradient */}
        {!isCurrentImageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse" aria-hidden="true" />
        )}

        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60 md:bg-gradient-to-r md:from-black/60 md:via-black/40 md:to-transparent" 
          aria-hidden="true"
        />

        {/* Content */}
        <div className="absolute inset-0 flex items-center pt-14 sm:pt-16 md:pt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl sm:max-w-2xl text-white">
              {/* Title */}
              {slide.title && slide.title !== "null" && (
                <h1
                  className="
                    text-2xl
                    sm:text-2xl
                    md:text-3xl
                    lg:text-4xl
                    xl:text-5xl
                    font-bold
                    leading-snug
                    mb-2 sm:mb-3 md:mb-4
                    drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]
                  "
                >
                  {slide.title}
                </h1>
              )}

              {/* Description */}
              {slide.description && slide.description !== "null" && (
                <p
                  className="
                    text-xs
                    sm:text-sm
                    md:text-base
                    lg:text-lg
                    font-light
                    leading-relaxed
                    mb-3 sm:mb-4 md:mb-6
                    line-clamp-3 sm:line-clamp-none
                    drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]
                  "
                >
                  {slide.description}
                </p>
              )}

              {/* Button */}
              {hasValidLink && hasContent && (
                <Button
                  onClick={handleButtonClick}
                  size="sm"
                  className="
                    bg-[#2D79C4]/70 hover:bg-[#2D79C4]
                    text-white font-semibold
                    px-4 py-2 sm:px-5 sm:py-3 md:px-6 md:py-4
                    text-xs sm:text-sm md:text-base
                    rounded-md sm:rounded-lg
                    shadow-xl
                    transition-all duration-300
                    hover:scale-105 active:scale-95
                    group
                  "
                  aria-label={`Learn more about ${slide.title || 'this offer'}`}
                >
                  {language === "uz"
                    ? "Batafsil"
                    : language === "ru"
                    ? "Подробнее"
                    : "Learn More"}
                  <ArrowRight 
                    className="ml-1.5 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" 
                    aria-hidden="true"
                  />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>



      {/* Progress Dots */}
      {slides.length > 1 && (
        <nav 
          className="absolute bottom-3 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 md:gap-3 z-20"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              role="tab"
              aria-selected={index === currentSlide}
              aria-label={`Go to slide ${index + 1}`}
              aria-controls={`slide-${index}`}
              className={cn(
                "h-1.5 sm:h-2 rounded-full transition-all duration-500 shadow-lg active:scale-95 focus:outline-none focus:ring-1 focus:ring-white/90 ",
                index === currentSlide
                  ? "w-6 sm:w-8 md:w-10 bg-[#2D79C4] "
                  : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </nav>
      )}

      {/* Slide counter for screen readers */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {slides.length}
        {isPaused && " - Paused"}
      </div>
    </section>
  );
}