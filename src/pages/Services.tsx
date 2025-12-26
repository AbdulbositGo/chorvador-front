import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const Services = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // SEO metadata
  const siteName = "Your Company Name";
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

  // Categories ni olish
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        
        const response = await fetch(`${API_URL}/categories/?type=service`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (Array.isArray(data)) {
            const allCategories = [
              { 
                id: 'all', 
                name: language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All' 
              },
              ...data.map(cat => ({
                id: cat.id.toString(),
                name: cat.name
              }))
            ];
            setCategories(allCategories);
          }
        } else {
          setCategories([
            { id: "all", name: language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All' },
          ]);
        }
      } catch (err) {
        console.error("Categories ERROR:", err);
        setCategories([
          { id: "all", name: language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All' },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  // Services ni olish
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

        let allServices: Service[] = [];
        let nextUrl: string | null = `${API_URL}/services/`;
        
        while (nextUrl) {
          const response = await fetch(nextUrl, {
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
          
          allServices = [...allServices, ...servicesArray];
          nextUrl = data.next;
        }
        
        console.log(`✅ Jami ${allServices.length} ta xizmat yuklandi`);
        
        if (!Array.isArray(allServices)) {
          throw new Error("Ma'lumot noto'g'ri formatda");
        }
        
        const transformedServices = allServices.map(service => {
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
        console.error("Services ERROR:", err);
        setError(err instanceof Error ? err.message : 'Noma\'lum xatolik');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [language, categories, categoriesLoading]);

  // Filter funksiyasi
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesCategory = false;
    
    if (selectedCategory === "all") {
      matchesCategory = true;
    } else {
      const selectedCat = categories.find(cat => cat.id === selectedCategory);
      
      if (selectedCat) {
        matchesCategory = 
          service.categoryId === selectedCategory || 
          service.categoryId === selectedCat.name ||
          service.categoryName === selectedCat.name ||
          (typeof service.category === 'string' && service.category === selectedCat.name);
      }
    }
    
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery, selectedCategory]);

  // Smooth scroll to top when changing pages
  useEffect(() => {
    const element = document.getElementById('services-grid');
    if (element && currentPage > 1) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Display categories
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 6);

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "description": pageDescription,
    "numberOfItems": filteredServices.length,
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
  };

  const breadcrumbData = {
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
  };

  return (
    <Layout>
      <Helmet>
        {/* Basic Meta Tags */}
        <html lang={language} />
        <title>{pageTitle} | {siteName}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        
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
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pageTitle} | ${siteName}`} />
        <meta name="twitter:description" content={pageDescription} />
        {currentServices.length > 0 && (
          <meta name="twitter:image" content={currentServices[0].image} />
        )}
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content={siteName} />
        <meta name="revisit-after" content="7 days" />
        
        {/* Pagination Meta Tags */}
        {currentPage > 1 && (
          <link rel="prev" href={`${siteUrl}/services?page=${currentPage - 1}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${siteUrl}/services?page=${currentPage + 1}`} />
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
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
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
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={language === 'uz' ? 'Xizmatlarni qidiring...' : language === 'ru' ? 'Поиск услуг...' : 'Search services...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300"
                aria-label={language === 'uz' ? 'Xizmatlarni qidirish' : language === 'ru' ? 'Поиск услуг' : 'Search services'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 hover:bg-muted rounded-full p-1 transition-colors animate-in fade-in zoom-in duration-200"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="sm:hidden h-11 font-medium"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
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
                <div className="flex items-center gap-2 text-muted-foreground py-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-xs sm:text-sm">
                    {language === 'uz' ? 'Kategoriyalar yuklanmoqda...' : language === 'ru' ? 'Загрузка категорий...' : 'Loading categories...'}
                  </span>
                </div>
              ) : (
                <>
                  {visibleCategories.map((category, index) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowFilters(false);
                      }}
                      className={cn(
                        "px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
                        selectedCategory === category.id
                          ? "bg-primary text-primary-foreground shadow-md scale-105"
                          : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      aria-pressed={selectedCategory === category.id}
                      aria-label={`Filter by ${category.name}`}
                    >
                      {category.name}
                    </button>
                  ))}
                  {categories.length > 6 && (
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-muted/50 text-muted-foreground hover:bg-muted transition-all duration-300 border border-dashed border-muted-foreground/30 hover:scale-105 hover:border-solid animate-in fade-in slide-in-from-bottom-2"
                      style={{ animationDelay: `${visibleCategories.length * 50}ms` }}
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
            <div className="flex flex-col justify-center items-center py-16 sm:py-20 lg:py-24 animate-in fade-in zoom-in duration-500" role="status">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-primary mb-4" />
              <span className="text-sm sm:text-base text-muted-foreground animate-pulse">
                {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500" role="alert">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-destructive/20 mb-4 animate-in zoom-in duration-300">
                <X className="w-6 h-6 sm:w-8 sm:h-8 text-destructive" />
              </div>
              <p className="text-destructive font-semibold mb-2 text-base sm:text-lg">
                {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                {language === 'uz' ? 'Qayta urinish' : language === 'ru' ? 'Попробовать снова' : 'Try again'}
              </Button>
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && filteredServices.length > 0 && (
            <div id="services-grid" className="flex items-center gap-2 text-muted-foreground mb-4 sm:mb-6 animate-in fade-in slide-in-from-left duration-500" role="status">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
              <p className="text-sm sm:text-base font-medium">
                {filteredServices.length} {language === 'uz' ? 'ta xizmat topildi' : language === 'ru' ? 'найдено услуг' : 'services found'}
                {filteredServices.length > itemsPerPage && (
                  <span className="text-muted-foreground/70 ml-2">
                    ({startIndex + 1}-{Math.min(endIndex, filteredServices.length)} {language === 'uz' ? 'ko\'rsatilmoqda' : language === 'ru' ? 'показано' : 'shown'})
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {currentServices.map((service, index) => (
                      <article 
                        key={service.id}
                        className="cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-500"
                        style={{ animationDelay: `${index * 75}ms` }}
                        itemScope
                        itemType="https://schema.org/Service"
                      >
                        <ServiceCard 
                          service={service}
                          onClick={() => navigate(`/services/${service.id}`)}
                        />
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {filteredServices.length > itemsPerPage && (
                    <nav 
                      className="flex justify-center items-center gap-2 mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-3 duration-500"
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
                      >
                        {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Previous'}
                      </Button>
                      
                      <div className="flex gap-1 sm:gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={cn(
                              "h-9 sm:h-10 w-9 sm:w-10 rounded-md text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-110",
                              currentPage === page
                                ? "bg-primary text-primary-foreground shadow-md scale-105"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
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
                      >
                        {language === 'uz' ? 'Keyingi' : language === 'ru' ? 'Далее' : 'Next'}
                      </Button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-16 sm:py-20 lg:py-24 animate-in fade-in zoom-in duration-500">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted mb-4 sm:mb-6">
                    <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
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