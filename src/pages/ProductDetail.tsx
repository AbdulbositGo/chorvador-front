import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Image as ImageIcon, Video, Tag, Package, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  discount: number;
  real_price: number;
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

        if (!data.video && data.images && data.images.length > 0) {
          setShowVideo(false);
        }

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

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleVideoError = () => {
    setVideoError(true);
    setShowVideo(false);
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

  if (error || !product) {
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

  // Price va discount hisoblash
  const hasValidDiscount = product.has_discount && product.discount > 0;
  
  const formattedPrice = new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'uz-UZ').format(product.price);
  const formattedRealPrice = hasValidDiscount
    ? new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'uz-UZ').format(product.real_price)
    : null;
  
  const discountPercent = hasValidDiscount ? product.discount : 0;
  
  const currentImage = product.images && product.images.length > 0 ? product.images[currentImageIndex] : '';
  
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;
    
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    return url;
  };
  
  const videoUrl = product.video ? getEmbedUrl(product.video) : null;
  const isYouTube = product.video?.includes('youtube.com') || product.video?.includes('youtu.be');
  const hasVideo = videoUrl && !videoError;
  const hasImages = product.images && product.images.length > 0;
  
  // Specs ni object ga aylantirish
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

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-4 md:py-6 lg:py-8 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/products")}
            className="mb-3 md:mb-4 hover:bg-muted/50 transition-colors text-sm md:text-base"
            size="sm"
          >
            <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 mr-2" />
            {t("product.backToProducts")}
          </Button>
          <nav className="flex items-center gap-2 text-xs md:text-sm flex-wrap">
            <button 
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </button>
            <span className="text-muted-foreground">/</span>
            <button 
              onClick={() => navigate("/products")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              {t("nav.products")}
            </button>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[200px] md:max-w-none">
              {product.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-6 md:py-10 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 xl:gap-16">
            {/* Media Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 md:space-y-4"
            >
              {/* Media Type Tabs */}
              {hasVideo && hasImages && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setShowVideo(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      !showVideo
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {language === 'uz' ? 'Rasmlar' : language === 'ru' ? 'Изображения' : 'Images'}
                    </span>
                  </button>
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                      showVideo
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Video className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      {language === 'uz' ? 'Video' : language === 'ru' ? 'Видео' : 'Video'}
                    </span>
                  </button>
                </div>
              )}

              {/* Main Media Display */}
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-lg">
                <AnimatePresence mode="wait">
                  {!showVideo && hasImages ? (
                    <motion.img
                      key={`img-${currentImageIndex}`}
                      src={currentImage}
                      alt={`${product.title} - ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/800x800/e5e7eb/6b7280?text=No+Image';
                      }}
                    />
                  ) : showVideo && hasVideo ? (
                    <motion.div
                      key="video-container"
                      className="w-full h-full bg-black flex items-center justify-center"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isYouTube ? (
                        <iframe
                          src={videoUrl || ''}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={product.title}
                          onError={handleVideoError}
                        />
                      ) : (
                        <video
                          key={videoUrl}
                          controls
                          controlsList="nodownload"
                          playsInline
                          className="w-full h-full"
                          style={{ objectFit: 'contain' }}
                          onError={handleVideoError}
                          preload="auto"
                          autoPlay={false}
                        >
                          <source src={videoUrl || ''} type="video/mp4" />
                          {language === 'uz' 
                            ? 'Brauzeringiz video formatini qo\'llab-quvvatlamaydi'
                            : language === 'ru'
                            ? 'Ваш браузер не поддерживает этот формат видео'
                            : 'Your browser does not support the video format'
                          }
                        </video>
                      )}
                    </motion.div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Package className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 opacity-50" />
                        <p className="text-sm md:text-base">
                          {language === 'uz' ? 'Media topilmadi' : language === 'ru' ? 'Медиа не найдено' : 'No media found'}
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
                
                {/* Counter Badge */}
                {!showVideo && product.images.length > 1 && (
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/70 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium backdrop-blur-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {!showVideo && product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-1.5 md:p-2 shadow-lg transition-all duration-300 active:scale-95 hover:scale-110"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-1.5 md:p-2 shadow-lg transition-all duration-300 active:scale-95 hover:scale-110"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {!showVideo && product.images.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide pt-2 pl-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md md:rounded-lg overflow-hidden transition-all duration-300 ${
                        currentImageIndex === index 
                          ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                          : 'ring-1 ring-border opacity-70 hover:opacity-100 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/200x200/e5e7eb/6b7280?text=No+Image';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-semibold">
                <Tag className="w-3 h-3 md:w-4 md:h-4" />
                {product.category}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {product.title}
              </h1>

              {/* Short Description */}
              {product.short_description && (
                <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Price */}
              <div className="space-y-2 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4 md:p-6">
                {hasValidDiscount && formattedRealPrice ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="text-xl md:text-2xl text-muted-foreground line-through">
                        {formattedPrice}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-500 text-white text-xs md:text-sm font-bold">
                        -{discountPercent}%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                        {formattedRealPrice}
                      </span>
                      <span className="text-base md:text-lg lg:text-xl text-muted-foreground">
                        {language === 'uz' ? 'so\'m' : language === 'ru' ? 'сум' : 'UZS'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                      {formattedPrice}
                    </span>
                    <span className="text-base md:text-lg lg:text-xl text-muted-foreground">
                      {language === 'uz' ? 'so\'m' : language === 'ru' ? 'сум' : 'UZS'}
                    </span>
                  </div>
                )}
              </div>

              {/* Specs */}
              {hasSpecs && specsObject && (
                <div className="border-t pt-4 md:pt-6">
                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {language === 'uz' ? 'Xususiyatlar' : language === 'ru' ? 'Характеристики' : 'Specifications'}
                  </h2>
                  <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                      {Object.entries(specsObject).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="flex items-center justify-between px-4 md:px-6 py-3 hover:bg-primary/5 transition-colors group"
                        >
                          <span className="text-xs md:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                            {key}
                          </span>
                          <span className="text-sm md:text-base font-semibold text-foreground text-right ml-4">
                            {value}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}


            </motion.div>
                          {/* Description */}
              {product.description && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">
                    {language === 'uz' ? 'Tavsif' : language === 'ru' ? 'Описание' : 'Description'}
                  </h2>
                  <div 
                    className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none"
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