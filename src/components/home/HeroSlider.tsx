import { useState, useEffect } from "react";
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
  const { language, t } = useLanguage();

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
        
        // Rasmlarni oldindan yuklash
        data.forEach((banner, index) => {
          const img = new Image();
          img.onload = () => {
            setImagesLoaded(prev => new Set(prev).add(index));
          };
          img.src = banner.image;
        });
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

  const handleButtonClick = () => {
    const link = slides[currentSlide]?.link;
    if (link && typeof link === 'string' && link.trim() !== '' && link !== 'null') {
      window.location.href = link;
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
  const isCurrentImageLoaded = imagesLoaded.has(currentSlide);

  return (
    <section className="relative overflow-hidden h-screen w-full bg-black -mt-16 pt-16">
      {/* All slides - hidden preload */}
      {slides.map((s, index) => (
        <img 
          key={`preload-${index}`}
          src={s.image} 
          alt=""
          className="hidden"
          loading="eager"
        />
      ))}

      {/* Current Slide */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background Image - TO'LIQ COVER, YUQORI SIFAT */}
        <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
          <img 
            src={slide.image} 
            alt={slide.title || 'Banner'}
            className="w-full h-full object-cover object-center"
            loading="eager"
            decoding="async"
            style={{
              opacity: isCurrentImageLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              imageRendering: '-webkit-optimize-contrast',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            } as React.CSSProperties}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.opacity = '1';
              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"%3E%3Crect fill="%23000000" width="1920" height="1080"/%3E%3C/svg%3E';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/40 to-black/40" />
        </div>

        {/* Content - har doim ko'rsatiladi */}
        <div className="absolute inset-0 w-full h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              {/* Title - faqat mavjud va null emas bo'lsa */}
              {slide.title && slide.title !== 'null' && (
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-2xl">
                  {slide.title}
                </h1>
              )}

              {/* Description - faqat mavjud va null emas bo'lsa */}
              {slide.description && slide.description !== 'null' && (
                <p className="text-xl md:text-2xl text-white/90 font-light leading-relaxed mb-8">
                  {slide.description}
                </p>
              )}

              {/* Button - faqat link mavjud, null emas va bo'sh emas bo'lsa */}
              {slide.link && 
               slide.link !== 'null' && 
               typeof slide.link === 'string' && 
               slide.link.trim() !== '' && (
                <Button
                  onClick={handleButtonClick}
                  size="lg"
                  className="bg-[#2D79C4]/40 hover:bg-[#2D79C4]/90 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-[#2D79C4]/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  {language === 'uz' ? 'Batafsil' : language === 'ru' ? 'Подробнее' : 'Learn More'}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-500 shadow-lg hover:scale-125 active:scale-95",
              index === currentSlide
                ? "w-10 bg-[#2D79C4]"
                : "w-2 bg-white/40 hover:bg-white/60"
            )}
          />
        ))}
      </div>
    </section>
  );
}