import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ChevronLeft, ChevronRight, Image, Video } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

interface ApiProduct {
  id: number;
  title: string;
  price: number;
  specs: Record<string, string> | string;
  description: string;
  images: string[];
  videos?: string[];
  category: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [mediaType, setMediaType] = useState<'images' | 'videos'>('images');

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;

      console.log('🚀 ProductDetail: Fetching product:', id);
      console.log('🌐 ProductDetail: Current language:', language);

      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi. .env faylini tekshiring");
        }

        const url = `${apiUrl}/products/${id}/`;
        console.log('📡 ProductDetail: Fetching from:', url);

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });

        console.log('📥 ProductDetail: Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }

        const data: ApiProduct = await response.json();
        console.log('✅ ProductDetail: Data received:', data);
        setProduct(data);

        // Agar videolar bo'lsa, default mediaType ni videos ga o'zgartirish
        if (data.videos && data.videos.length > 0) {
          setMediaType('videos');
        }

      } catch (err) {
        console.error("❌ ProductDetail: Error:", err);
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id, language]);

  const handlePrevMedia = () => {
    if (!product) return;
    if (mediaType === 'images') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    } else {
      setCurrentVideoIndex((prev) => 
        prev === 0 ? (product.videos?.length || 1) - 1 : prev - 1
      );
    }
  };

  const handleNextMedia = () => {
    if (!product) return;
    if (mediaType === 'images') {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentVideoIndex((prev) => 
        prev === (product.videos?.length || 1) - 1 ? 0 : prev + 1
      );
    }
  };

  const handleMediaTypeChange = (type: 'images' | 'videos') => {
    setMediaType(type);
    if (type === 'images') {
      setCurrentImageIndex(0);
    } else {
      setCurrentVideoIndex(0);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-main py-12 md:py-16">
          <div className="flex justify-center items-center min-h-[300px] md:min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin text-primary mx-auto mb-3" />
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
        <div className="container-main py-12 md:py-16 px-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 md:p-8 text-center max-w-2xl mx-auto">
            <p className="text-destructive font-medium mb-2 text-base md:text-lg">
              {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
            </p>
            <p className="text-sm md:text-base text-muted-foreground mb-4">
              {error || (language === 'uz' ? 'Mahsulot topilmadi' : language === 'ru' ? 'Продукт не найден' : 'Product not found')}
            </p>
            <Button onClick={() => navigate("/products")} variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("product.backToProducts")}
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const formattedPrice = new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'uz-UZ').format(product.price);
  const currentImage = product.images[currentImageIndex];
  const currentVideo = product.videos?.[currentVideoIndex];
  const hasVideos = product.videos && product.videos.length > 0;
  const hasImages = product.images && product.images.length > 0;

  // Specs ni tekshirish
  const hasSpecs = product.specs && 
    (typeof product.specs === 'string' || 
     (typeof product.specs === 'object' && Object.keys(product.specs).length > 0));

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-gradient-to-b from-muted/30 to-background py-4 md:py-8 border-b">
        <div className="container-main px-4">
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
            <span className="text-foreground font-medium truncate max-w-[150px] md:max-w-none">
              {product.title}
            </span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-6 md:py-12 lg:py-16">
        <div className="container-main px-4">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-16">
            {/* Media Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-3 md:space-y-4"
            >
              {/* Media Type Tabs */}
              {hasVideos && hasImages && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => handleMediaTypeChange('images')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      mediaType === 'images'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Image className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'uz' ? 'Rasmlar' : language === 'ru' ? 'Изображения' : 'Images'}
                    </span>
                  </button>
                  <button
                    onClick={() => handleMediaTypeChange('videos')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      mediaType === 'videos'
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span className="text-sm">
                      {language === 'uz' ? 'Videolar' : language === 'ru' ? 'Видео' : 'Videos'}
                    </span>
                  </button>
                </div>
              )}

              {/* Main Media Display */}
              <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-lg">
                <AnimatePresence mode="wait">
                  {mediaType === 'images' && hasImages ? (
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
                  ) : mediaType === 'videos' && hasVideos && currentVideo ? (
                    <motion.video
                      key={`video-${currentVideoIndex}`}
                      src={currentVideo}
                      controls
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        console.error('Video yuklashda xatolik:', e);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {language === 'uz' ? 'Media topilmadi' : language === 'ru' ? 'Медиа не найдено' : 'No media found'}
                    </div>
                  )}
                </AnimatePresence>
                
                {/* Counter Badge */}
                {((mediaType === 'images' && product.images.length > 1) || 
                  (mediaType === 'videos' && hasVideos && (product.videos?.length || 0) > 1)) && (
                  <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/70 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium">
                    {mediaType === 'images' 
                      ? `${currentImageIndex + 1} / ${product.images.length}`
                      : `${currentVideoIndex + 1} / ${product.videos?.length || 0}`
                    }
                  </div>
                )}
                
                {/* Navigation Arrows */}
                {((mediaType === 'images' && product.images.length > 1) || 
                  (mediaType === 'videos' && hasVideos && (product.videos?.length || 0) > 1)) && (
                  <>
                    <button
                      onClick={handlePrevMedia}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-1.5 md:p-2 shadow-lg transition-all duration-300 active:scale-95"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                    <button
                      onClick={handleNextMedia}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground rounded-full p-1.5 md:p-2 shadow-lg transition-all duration-300 active:scale-95"
                      aria-label="Next"
                    >
                      <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {mediaType === 'images' && product.images.length > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide p-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md md:rounded-lg overflow-hidden transition-all duration-300 ${
                        currentImageIndex === index 
                          ? 'ring-2 ring-primary ring-offset-2 scale-100' 
                          : 'ring-1 ring-border opacity-70 hover:opacity-100 active:scale-95'
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

              {/* Video Thumbnails */}
              {mediaType === 'videos' && hasVideos && (product.videos?.length || 0) > 1 && (
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {product.videos?.map((video, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentVideoIndex(index)}
                      className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-md md:rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center bg-muted ${
                        currentVideoIndex === index 
                          ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                          : 'ring-1 ring-border opacity-70 hover:opacity-100 active:scale-95'
                      }`}
                    >
                      <Video className="w-6 h-6 text-muted-foreground" />
                      <span className="absolute bottom-1 right-1 text-xs bg-black/70 text-white px-1 rounded">
                        {index + 1}
                      </span>
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
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-primary/10 text-primary text-xs md:text-sm font-medium">
                {product.category}
              </div>

              {/* Title & Price */}
              <div className="space-y-2 md:space-y-3">
                <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                  {product.title}
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
                    {formattedPrice}
                  </span>
                  <span className="text-lg md:text-xl text-muted-foreground">
                    {language === 'uz' ? 'so\'m' : language === 'ru' ? 'сум' : 'UZS'}
                  </span>
                </div>
              </div>

              {/* Specs */}
              {hasSpecs && (
                <div className="border-t pt-4 md:pt-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
                    {language === 'uz' ? 'Xususiyatlar' : language === 'ru' ? 'Характеристики' : 'Specifications'}
                  </h2>
                  {typeof product.specs === 'string' ? (
                    <div 
                      className="text-sm md:text-base text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: product.specs }}
                    />
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                      {Object.entries(product.specs).map(([key, value]) => {
                        const displayValue = typeof value === 'object' && value !== null 
                          ? JSON.stringify(value) 
                          : String(value || '');
                        
                        return (
                          <div 
                            key={key} 
                            className="grid grid-cols-[minmax(100px,auto)_1fr] gap-3 p-3 md:p-3.5 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <span className="text-xs md:text-sm font-medium text-muted-foreground capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-foreground break-words">
                              {displayValue}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </motion.div>
              {/* Description */}
              {product.description && (
                <div >
                  <h2 className="text-lg md:text-xl font-semibold mb-3 text-foreground">
                    {language === 'uz' ? 'Tavsif' : language === 'ru' ? 'Описание' : 'Description'}
                  </h2>
                  <div 
                    className="text-sm md:text-base text-muted-foreground leading-relaxed prose prose-sm"
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