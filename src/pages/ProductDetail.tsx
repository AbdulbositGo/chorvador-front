// ProductDetail.tsx - Performance optimized version with unified breadcrumb
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Image as ImageIcon, Video, Tag, Package, X, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";

interface ApiProduct {
  id: number;
  title: string;
  price: number | null;
  discount: number;
  real_price: number | null;
  has_discount: boolean;
  specs: Record<string, string> | string;
  short_description: string;
  description: string;
  images: string[];
  category: string;
  video: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const siteName = "Chorvador.uz";
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : "https://yourwebsite.com";

  // ✅ OPTIMIZATION 1: Memoized calculations
  const productData = useMemo(() => {
    if (!product) return null;

    const hasPrice = product.price !== null && product.price !== undefined;
    const hasValidDiscount = hasPrice && product.has_discount && product.discount > 0 && product.real_price !== null;
    
    const formattedPrice = hasPrice 
      ? new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'uz-UZ').format(product.price!)
      : null;
      
    const formattedRealPrice = hasValidDiscount && product.real_price !== null
      ? new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'uz-UZ').format(product.real_price)
      : null;
    
    const discountPercent = hasValidDiscount ? product.discount : 0;
    const currentImage = product.images && product.images.length > 0 ? product.images[currentImageIndex] : '';

    return {
      hasPrice,
      hasValidDiscount,
      formattedPrice,
      formattedRealPrice,
      discountPercent,
      currentImage
    };
  }, [product, currentImageIndex, language]);

  // ✅ OPTIMIZATION 2: Memoized video URL
  const videoData = useMemo(() => {
    if (!product?.video) return { videoUrl: null, isYouTube: false, hasVideo: false };

    const getEmbedUrl = (url: string): string | null => {
      if (!url) return null;
      
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/;
      const match = url.match(youtubeRegex);
      
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
      
      return url;
    };

    const videoUrl = getEmbedUrl(product.video);
    const isYouTube = product.video.includes('youtube.com') || product.video.includes('youtu.be');
    const hasVideo = videoUrl && !videoError;

    return { videoUrl, isYouTube, hasVideo };
  }, [product?.video, videoError]);

  // ✅ OPTIMIZATION 3: Memoized specs
  const specsData = useMemo(() => {
    if (!product?.specs) return { specsObject: null, hasSpecs: false };

    const getSpecsObject = (): Record<string, string> | null => {
      if (!product.specs) return null;
      
      if (typeof product.specs === 'string') {
        try {
          return JSON.parse(product.specs);
        } catch {
          return null;
        }
      }
      
      if (typeof product.specs === 'object' && product.specs !== null) {
        return product.specs;
      }
      
      return null;
    };

    const specsObject = getSpecsObject();
    const hasSpecs = specsObject && Object.keys(specsObject).length > 0;

    return { specsObject, hasSpecs };
  }, [product?.specs]);

  // ✅ OPTIMIZATION 4: Memoized SEO data
  const seoData = useMemo(() => {
    if (!product) return null;

    return {
      pageTitle: product.title,
      pageDescription: product.short_description || product.title,
      currentUrl: `${siteUrl}/${language}/products/${id}`,
      imageUrl: product.images?.[0] || ''
    };
  }, [product, language, siteUrl, id]);

  // ✅ OPTIMIZATION 5: Intersection Observer for lazy animations
  useEffect(() => {
    if (!product) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      document.querySelectorAll('.lazy-animate').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, [product]);

  // ✅ OPTIMIZATION 6: Image preload check
  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, [product, currentImageIndex]);

  // ✅ OPTIMIZATION 7: useCallback for handlers
  const handlePrevImage = useCallback(() => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
    setImageLoaded(false);
  }, [product]);

  const handleNextImage = useCallback(() => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
    setImageLoaded(false);
  }, [product]);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
    setShowVideo(false);
  }, []);

  const handleImageClick = useCallback(() => {
    setIsImageZoomed(true);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setIsImageZoomed(false);
  }, []);

  const handleZoomedPrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handlePrevImage();
  }, [handlePrevImage]);

  const handleZoomedNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleNextImage();
  }, [handleNextImage]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image';
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }

        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        const url = `${apiUrl}/products/${id}/`;
      
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': acceptLanguage,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }

        const data: ApiProduct = await response.json();
        setProduct(data);

      } catch (err) {
        console.error("ProductDetail Error:", err);
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, language]);


const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return "";

  // 👉 SHORTS
  if (url.includes("/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
    // agar watch kerak bo‘lsa:
    // return `https://www.youtube.com/watch?v=${id}`;
  }

  // 👉 watch?v=ID
  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // 👉 youtu.be/ID
  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // 👉 already embed
  if (url.includes("/embed/")) {
    return url;
  }

  return "";
};



  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
          <div className="flex justify-center items-center min-h-[300px] md:min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-primary mx-auto mb-4" />
              <span className="text-sm md:text-base text-muted-foreground">
                {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product || !productData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 md:py-16">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg sm:rounded-xl p-6 md:p-8 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20 mb-4">
              <Package className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-semibold mb-2 text-base md:text-lg">
              {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
            </p>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              {error || (language === 'uz' ? 'Mahsulot topilmadi' : language === 'ru' ? 'Продукт не найден' : 'Product not found')}
            </p>
            <Button onClick={() => navigate("/products")} className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("product.backToProducts")}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const hasImages = product.images && product.images.length > 0;

  return (
    <Layout>
      {/* ✅ SEO */}
      {seoData && (
        <Helmet>
          <html lang={language} />
          <title>{seoData.pageTitle} | {siteName}</title>
          <meta name="description" content={seoData.pageDescription} />
          <link rel="canonical" href={seoData.currentUrl} />
          
          <meta property="og:title" content={`${seoData.pageTitle} | ${siteName}`} />
          <meta property="og:description" content={seoData.pageDescription} />
          <meta property="og:url" content={seoData.currentUrl} />
          <meta property="og:type" content="product" />
          <meta property="og:image" content={seoData.imageUrl} />
          
          {productData.hasPrice && (
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": product.title,
                "description": product.short_description,
                "image": product.images,
                "offers": {
                  "@type": "Offer",
                  "price": productData.hasValidDiscount ? product.real_price : product.price,
                  "priceCurrency": "UZS"
                }
              })}
            </script>
          )}
        </Helmet>
      )}

      {/* ✅ Performance styles */}
      <style>{`
        .lazy-animate {
          opacity: 0;
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }

        .lazy-animate.animate-visible {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }

        .will-change-transform {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        img, video, iframe {
          content-visibility: auto;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Zoomed Image Modal */}
      {isImageZoomed && hasImages && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={handleCloseZoom}>
          <button
            onClick={handleCloseZoom}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-8 h-8" />
          </button>

          <img
            key={`zoomed-${currentImageIndex}`}
            src={productData.currentImage}
            alt={`${product.title} - ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain will-change-transform"
            loading="lazy"
            onClick={(e) => e.stopPropagation()}
          />

          {product.images.length > 1 && (
            <>
              <button
                onClick={handleZoomedPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleZoomedNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full font-medium backdrop-blur-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </>
          )}
        </div>
      )}

      {/* ✅ UNIFIED BREADCRUMB - Professional style */}
      <section className="relative pt-20 md:pt-24 pb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-6 lazy-animate translate-x-[-10px]">
            <Button
              variant="ghost"
              onClick={() => navigate("/products")}
              className="hover:bg-muted transition-colors"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}
            </Button>
          </div>

          <nav className="flex items-center gap-2 text-sm text-muted-foreground lazy-animate translate-y-2">
            <button 
              onClick={() => navigate("/")}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              {t("nav.home")}
            </button>
            <span>/</span>
            <button 
              onClick={() => navigate("/products")}
              className="hover:text-primary transition-colors"
            >
              {t("nav.products")}
            </button>
            <span>/</span>
            <span className="text-foreground font-medium truncate max-w-[200px] md:max-w-none">
              {product.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="pb-12 md:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Media Gallery */}
            <div className="space-y-4 lazy-animate translate-x-[-10px]">
              {/* Media Type Tabs */}
              {videoData.hasVideo && hasImages && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowVideo(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      !showVideo
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>{language === 'uz' ? 'Rasmlar' : language === 'ru' ? 'Изображения' : 'Images'}</span>
                  </button>
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      showVideo
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>{language === 'uz' ? 'Video' : language === 'ru' ? 'Видео' : 'Video'}</span>
                  </button>
                </div>
              )}

              {/* Main Media Display */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-xl">
                {!showVideo && hasImages ? (
                  <div className={`w-full h-full transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                    <img
                      ref={imgRef}
                      key={`img-${currentImageIndex}`}
                      src={productData.currentImage}
                      alt={`${product.title} - ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300 will-change-transform"
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      onClick={handleImageClick}
                      onLoad={() => setImageLoaded(true)}
                      onError={handleImageError}
                    />
                  </div>
                ) : showVideo && videoData.hasVideo ? (
                  <div className="w-full h-full bg-black flex items-center justify-center">
{videoData.isYouTube ? (
  <iframe
    src={getYouTubeEmbedUrl(videoData.videoUrl || "")}
    className="w-full h-full"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
    title={product.title}
    loading="lazy"
    onError={handleVideoError}
  />
) : (
  <video
    key={videoData.videoUrl}
    controls
    controlsList="nodownload"
    playsInline
    className="w-full h-full"
    style={{ objectFit: "contain" }}
    onError={handleVideoError}
    preload="metadata"
  >
    <source src={videoData.videoUrl || ""} type="video/mp4" />
  </video>
)}

                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Package className="w-16 h-16 mx-auto mb-3 opacity-50" />
                      <p className="text-base">
                        {language === 'uz' ? 'Media topilmadi' : language === 'ru' ? 'Медиа не найдено' : 'No media found'}
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Navigation buttons */}
                {!showVideo && product.images.length > 1 && (
                  <>
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1.5 rounded-full font-medium backdrop-blur-sm">
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {!showVideo && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 p-2 scrollbar-hide">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => { setCurrentImageIndex(index); setImageLoaded(false); }}
                      className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
                        currentImageIndex === index 
                          ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                          : 'ring-1 ring-border opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        onError={handleImageError}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 lazy-animate translate-x-[10px]">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                <Tag className="w-4 h-4" />
                {product.category}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {product.title}
              </h1>

              {product.short_description && (
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Price */}
              {productData.hasPrice && (
                <div className="space-y-2 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
                  {productData.hasValidDiscount && productData.formattedRealPrice ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl text-muted-foreground line-through">
                          {productData.formattedPrice}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500 text-white text-sm font-bold">
                          -{productData.discountPercent}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl lg:text-5xl font-bold text-primary">
                          {productData.formattedRealPrice}
                        </span>
                        <span className="text-lg lg:text-xl text-muted-foreground">
                          {language === 'uz' ? 'so\'m' : language === 'ru' ? 'сум' : 'UZS'}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl lg:text-5xl font-bold text-primary">
                        {productData.formattedPrice}
                      </span>
                      <span className="text-lg lg:text-xl text-muted-foreground">
                        {language === 'uz' ? 'so\'m' : language === 'ru' ? 'сум' : 'UZS'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Specs */}
              {specsData.hasSpecs && specsData.specsObject && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {language === 'uz' ? 'Xususiyatlar' : language === 'ru' ? 'Характеристики' : 'Specifications'}
                  </h2>
                  <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                      {Object.entries(specsData.specsObject).map(([key, value], index) => (
                        <div
                          key={key}
                          className="flex items-center justify-between px-6 py-3 hover:bg-primary/5 transition-colors group lazy-animate translate-y-2"
                          style={{ transitionDelay: `${index * 30}ms` }}
                        >
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {key}
                          </span>
                          <span className="text-base font-semibold text-foreground text-right ml-4">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


            </div>
                          {/* Description */}
              {product.description && (
                <div className="pt-6">
                  <h2 className="text-xl font-bold mb-4 text-foreground">
                    {language === 'uz' ? 'Tavsif' : language === 'ru' ? 'Описание' : 'Description'}
                  </h2>
                  <div 
                    className="text-sm md:text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;