import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, SlidersHorizontal, X, Loader2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";

interface Service {
  id: number;
  title: string;
  short_description: string;
  image: string;
  category?: string | CategoryObject;
  categoryId?: string;
  categoryName?: string;
}

interface Category {
  id: string;
  name: string;
}

interface CategoryObject {
  id: number | string;
  name: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

interface CacheItem<T> {
  value: T;
  timestamp: number;
}

// Optimized cache with better performance
const cache = {
  data: new Map<string, CacheItem<Category[]>>(),
  
  set<T extends Category[]>(key: string, value: T, ttl: number = 600000): void {
    this.data.set(key, {
      value,
      timestamp: Date.now() + ttl
    });
  },
  
  get<T extends Category[]>(key: string): T | null {
    const item = this.data.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.data.delete(key);
      return null;
    }
    
    return item.value as T;
  },
  
  clear(): void {
    this.data.clear();
  }
};

const Services = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL dan qiymatlarni olish
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const categoryFromUrl = searchParams.get("category") || "all";
  const searchFromUrl = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [showFilters, setShowFilters] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 8;

  // SEO metadata
  const siteName = "Chorvador.uz";
  const siteUrl = "https://yourwebsite.com";
  
  const pageTitle = t("services.page.title") || "Professional Services";
  const pageDescription = t("services.page.subtitle") || "Discover our comprehensive range of professional services tailored to meet your business needs and drive success.";
  const pageKeywords = language === 'uz' 
    ? "xizmatlar, professional xizmatlar, biznes xizmatlar, konsalting"
    : language === 'ru'
    ? "услуги, профессиональные услуги, бизнес услуги, консалтинг"
    : "services, professional services, business services, consulting, solutions";

  const currentUrl = `${siteUrl}/services${currentPage > 1 ? `?page=${currentPage}` : ''}`;
  const canonicalUrl = `${siteUrl}/services`;

  // URL ni yangilash
  const updateURL = useCallback((page: number, category: string, search: string) => {
    const params = new URLSearchParams();
    
    if (page > 1) params.set("page", page.toString());
    if (category !== "all") params.set("category", category);
    if (search.trim()) params.set("search", search.trim());
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // State o'zgarganda URL ni yangilash
  useEffect(() => {
    updateURL(currentPage, selectedCategory, searchQuery);
  }, [currentPage, selectedCategory, searchQuery, updateURL]);

  // Optimized image preloading with priority hints
  useEffect(() => {
    if (services.length > 0) {
      const preloadImages = (urls: string[]): void => {
        urls.slice(0, 4).forEach((url, index) => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = url;
          if (index === 0) link.setAttribute('fetchpriority', 'high');
          document.head.appendChild(link);
        });
      };

      const firstPageImages = services.slice(0, 4).map(s => s.image);
      preloadImages(firstPageImages);
    }
  }, [services]);

  // Categories ni olish (with cache)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        
        if (!API_URL) {
          throw new Error("API URL topilmadi");
        }

        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        const cacheKey = `service_categories_${acceptLanguage}`;
        
        // Check cache first
        const cachedData = cache.get<Category[]>(cacheKey);
        if (cachedData) {
          setCategories(cachedData);
          setCategoriesLoading(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/categories/?type=service`, {
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
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error("Categories data array formatida emas");
        }
        
        const allCategories: Category[] = [
          { 
            id: 'all', 
            name: language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All' 
          },
          ...data.map(cat => ({
            id: cat.id.toString(),
            name: cat.name
          }))
        ];
        
        // Cache the result
        cache.set(cacheKey, allCategories, 600000);
        setCategories(allCategories);
      } catch (err) {
        setCategories([
          { id: "all", name: language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All' },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  // Services ni olish (with backend pagination)
  useEffect(() => {
    if (categoriesLoading) return;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = import.meta.env.VITE_API_URL;
        
        if (!API_URL) {
          throw new Error("API URL topilmadi");
        }

        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        
        // Build URL with pagination and filters
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const url = `${API_URL}/services/?${params.toString()}`;

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
        
        const data: ApiResponse = await response.json();
        const servicesArray: Service[] = data.results || [];
        
        // Update total count for pagination
        setTotalCount(data.count || 0);
        
        if (!Array.isArray(servicesArray)) {
          throw new Error("Ma'lumot noto'g'ri formatda");
        }
        
        const transformedServices = servicesArray.map(service => {
          let categoryId = 'all';
          let categoryName = '';
          
          if (service.category) {
            if (typeof service.category === 'object' && service.category !== null) {
              const catObj = service.category as CategoryObject;
              categoryId = String(catObj.id);
              categoryName = catObj.name || '';
            } else if (typeof service.category === 'string') {
              categoryName = service.category;
              const foundCategory = categories.find(cat => 
                cat.name.toLowerCase() === (service.category as string).toLowerCase()
              );
              if (foundCategory && foundCategory.id !== 'all') {
                categoryId = String(foundCategory.id);
              } else {
                categoryId = service.category;
              }
            }
          }
          
          return {
            ...service,
            categoryId,
            categoryName,
            image: service.image?.startsWith('http') 
              ? service.image 
              : `${API_URL}${service.image}`
          };
        });
        
        setServices(transformedServices);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [language, categories, categoriesLoading, currentPage, selectedCategory, searchQuery]);

  const handleServiceClick = useCallback((serviceId: number) => {
    navigate(`/services/${serviceId}`);
  }, [navigate]);

  // Memoized pagination
  const { totalPages, startIndex, endIndex, currentServices } = useMemo(() => {
    const total = Math.ceil(totalCount / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    return {
      totalPages: total,
      startIndex: start,
      endIndex: end,
      currentServices: services
    };
  }, [totalCount, currentPage, itemsPerPage, services]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery, selectedCategory]);

  // Smooth scroll when changing pages
  useEffect(() => {
    const element = document.getElementById('services-grid');
    if (element && currentPage > 1) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Display categories
  const visibleCategories = useMemo(() => 
    showAllCategories ? categories : categories.slice(0, 6),
    [showAllCategories, categories]
  );

  // Enhanced structured data for SEO
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": totalCount,
    "itemListElement": currentServices.map((service, index) => ({
      "@type": "ListItem",
      "position": startIndex + index + 1,
      "item": {
        "@type": "Service",
        "@id": `${siteUrl}/services/${service.id}`,
        "name": service.title,
        "description": service.short_description,
        "image": service.image,
        "provider": {
          "@type": "Organization",
          "name": siteName
        }
      }
    }))
  }), [pageTitle, pageDescription, totalCount, currentServices, startIndex, siteUrl, siteName]);

  const breadcrumbData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": language === 'uz' ? 'Bosh sahifa' : language === 'ru' ? 'Главная' : 'Home',
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageTitle,
        "item": canonicalUrl
      }
    ]
  }), [language, siteUrl, pageTitle, canonicalUrl]);

  return (
    <Layout>
      <Helmet>
        {/* Basic Meta Tags */}
        <html lang={language} />
        <title>{pageTitle} | {siteName}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="uz" href={`${siteUrl}/uz/services`} />
        <link rel="alternate" hrefLang="ru" href={`${siteUrl}/ru/services`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en/services`} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:title" content={`${pageTitle} | ${siteName}`} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:locale" content={language === 'uz' ? 'uz_UZ' : language === 'ru' ? 'ru_RU' : 'en_US'} />
        {currentServices.length > 0 && (
          <meta property="og:image" content={currentServices[0].image} />
        )}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={pageTitle} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pageTitle} | ${siteName}`} />
        <meta name="twitter:description" content={pageDescription} />
        {currentServices.length > 0 && (
          <meta name="twitter:image" content={currentServices[0].image} />
        )}
        <meta name="twitter:image:alt" content={pageTitle} />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content={siteName} />
        <meta name="revisit-after" content="7 days" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Pagination Meta Tags */}
        {currentPage > 1 && (
          <link rel="prev" href={`${siteUrl}/services?page=${currentPage - 1}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${siteUrl}/services?page=${currentPage + 1}`} />
        )}
        
        {/* Resource Hints */}
        {import.meta.env.VITE_API_URL && (
          <>
            <link rel="dns-prefetch" href={new URL(import.meta.env.VITE_API_URL).origin} />
            <link rel="preconnect" href={new URL(import.meta.env.VITE_API_URL).origin} crossOrigin="anonymous" />
          </>
        )}
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbData)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-3 sm:mb-4 leading-tight">
              {pageTitle}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 leading-relaxed">
              {pageDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input
                placeholder={language === 'uz' ? 'Xizmatlarni qidiring...' : language === 'ru' ? 'Поиск услуг...' : 'Search services...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 h-11 sm:h-12 text-sm sm:text-base"
                aria-label={language === 'uz' ? 'Xizmatlarni qidirish' : language === 'ru' ? 'Поиск услуг' : 'Search services'}
                type="search"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 hover:bg-muted rounded-full p-1 transition-colors"
                  aria-label="Clear search"
                  type="button"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground" aria-hidden="true" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="sm:hidden h-11 font-medium"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
              aria-expanded={showFilters}
              type="button"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
              {language === 'uz' ? 'Filtrlar' : language === 'ru' ? 'Фильтры' : 'Filters'}
            </Button>
          </div>

          {/* Category Filters */}
          <nav 
            className={cn(
              "mb-6 sm:mb-8 transition-all duration-300",
              !showFilters && "hidden sm:block"
            )}
            aria-label="Service categories"
          >
            <div className="flex flex-wrap gap-2">
              {categoriesLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground py-2" role="status" aria-live="polite">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">
                    {language === 'uz' ? 'Kategoriyalar yuklanmoqda...' : language === 'ru' ? 'Загрузка категорий...' : 'Loading categories...'}
                  </span>
                </div>
              ) : (
                <>
                  {visibleCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFilters(false);
                      }}
                      className={cn(
                        "px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105"
                      )}
                      aria-pressed={selectedCategory === category.id}
                      aria-label={`Filter by ${category.name}`}
                      type="button"
                    >
                      {category.name}
                    </button>
                  ))}
                  {categories.length > 6 && (
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-muted/50 text-muted-foreground hover:bg-muted transition-all duration-300 border border-dashed border-muted-foreground/30 hover:scale-105 hover:border-solid"
                      aria-expanded={showAllCategories}
                      aria-label={showAllCategories ? 'Show less categories' : 'Show more categories'}
                      type="button"
                    >
                      {showAllCategories 
                        ? (language === 'uz' ? 'Kamroq' : language === 'ru' ? 'Меньше' : 'Less')
                        : `+ ${categories.length - 6} ${language === 'uz' ? 'ko\'proq' : language === 'ru' ? 'еще' : 'more'}`
                      }
                    </button>
                  )}
                </>
              )}
            </div>
          </nav>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col justify-center items-center py-16 sm:py-20 lg:py-24" role="status" aria-live="polite">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mb-4" aria-hidden="true" />
              <span className="text-sm sm:text-base text-muted-foreground">
                {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center" role="alert" aria-live="assertive">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/20 mb-4">
                <X className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" aria-hidden="true" />
              </div>
              <p className="text-destructive font-semibold mb-2 text-base sm:text-lg">
                {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
                type="button"
              >
                {language === 'uz' ? 'Qayta urinish' : language === 'ru' ? 'Попробовать снова' : 'Try again'}
              </Button>
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && totalCount > 0 && (
            <div id="services-grid" className="flex items-center gap-2 text-muted-foreground mb-4 sm:mb-6" role="status" aria-live="polite">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <p className="text-sm sm:text-base font-medium">
                {totalCount} {language === 'uz' ? 'ta xizmat topildi' : language === 'ru' ? 'найдено услуг' : 'services found'}
                {totalCount > itemsPerPage && (
                  <span className="text-muted-foreground/70 ml-2">
                    ({startIndex + 1}-{Math.min(endIndex, totalCount)} {language === 'uz' ? 'ko\'rsatilmoqda' : language === 'ru' ? 'показано' : 'shown'})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Services Grid */}
          {!loading && !error && (
            <>
              {currentServices.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" role="list">
                    {currentServices.map((service) => (
                      <article 
                        key={service.id}
                        onClick={() => handleServiceClick(service.id)}
                        className="cursor-pointer"
                        itemScope
                        itemType="https://schema.org/Service"
                        role="listitem"
                      >
                        <ServiceCard service={service} />
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav 
                      className="flex justify-center items-center gap-2 mt-8 sm:mt-12"
                      role="navigation"
                      aria-label="Pagination"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="h-9 sm:h-10 px-3 sm:px-4 transition-all duration-300 hover:scale-105"
                        aria-label="Previous page"
                        type="button"
                      >
                        {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Previous'}
                      </Button>
                      
                      <div className="flex gap-1 sm:gap-2" role="list">
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                          let page;
                          if (totalPages <= 7) {
                            page = i + 1;
                          } else if (currentPage <= 4) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            page = totalPages - 6 + i;
                          } else {
                            page = currentPage - 3 + i;
                          }
                          return page;
                        }).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "h-9 sm:h-10 w-9 sm:w-10 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-110",
                              currentPage === page
                                ? "bg-primary text-primary-foreground shadow-md scale-105"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                            aria-label={`Go to page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                            type="button"
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="h-9 sm:h-10 px-3 sm:px-4 transition-all duration-300 hover:scale-105"
                        aria-label="Next page"
                        type="button"
                      >
                        {language === 'uz' ? 'Keyingi' : language === 'ru' ? 'Далее' : 'Next'}
                      </Button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-16 sm:py-20 lg:py-24" role="status">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted mb-4 sm:mb-6">
                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-muted-foreground text-base sm:text-lg lg:text-xl font-medium mb-2">
                    {language === 'uz' ? 'Hech narsa topilmadi' : language === 'ru' ? 'Ничего не найдено' : 'No services found'}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                    {language === 'uz' 
                      ? 'Boshqa kategoriyani tanlang yoki qidiruvni o\'zgartiring' 
                      : language === 'ru' 
                      ? 'Выберите другую категорию или измените поиск'
                      : 'Try selecting a different category or changing your search'}
                  </p>
                  {(searchQuery || selectedCategory !== 'all') && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                      className="mt-4"
                      type="button"
                    >
                      {language === 'uz' ? 'Filtrlarni tozalash' : language === 'ru' ? 'Очистить фильтры' : 'Clear filters'}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;