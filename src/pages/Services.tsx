import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // SEO metadata
  const pageTitle = t("services.page.title") || "Services";
  const pageDescription = t("services.page.subtitle") || "Professional services tailored to your needs";
  const siteName = "Your Company Name";

  // SEO meta taglarni dinamik o'zgartirish
  useEffect(() => {
    document.title = `${pageTitle} | ${siteName}`;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDescription);
    
    document.documentElement.lang = language;
  }, [pageTitle, pageDescription, language, siteName]);

  // Categories ni olish
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        
        // Agar service categories endpoint mavjud bo'lsa
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
          // Agar endpoint yo'q bo'lsa, default categories
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
        const response = await fetch(`${API_URL}/services/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const data: ApiResponse = await response.json();
        
        // Backend pagination formatida
        const servicesArray: Service[] = data.results || [];
        
        // Transform services
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

  return (
    <Layout>
      <section className="gradient-hero py-16">
        <div className="container-main">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {pageTitle}
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            {pageDescription}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {/* Search & Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={language === 'uz' ? 'Xizmatlarni qidiring...' : language === 'ru' ? 'Поиск услуг...' : 'Search services...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
                aria-label={language === 'uz' ? 'Xizmatlarni qidirish' : language === 'ru' ? 'Поиск услуг' : 'Search services'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  aria-label="Clear search"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              {language === 'uz' ? 'Filtrlar' : language === 'ru' ? 'Фильтры' : 'Filters'}
            </Button>
          </div>

          {/* Category Filters */}
          <nav 
            className={cn(
              "flex flex-wrap gap-2 mb-8",
              !showFilters && "hidden md:flex"
            )}
            aria-label="Service categories"
          >
            {categoriesLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {language === 'uz' ? 'Kategoriyalar yuklanmoqda...' : language === 'ru' ? 'Загрузка категорий...' : 'Loading categories...'}
                </span>
              </div>
            ) : (
              categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  aria-pressed={selectedCategory === category.id}
                  aria-label={`Filter by ${category.name}`}
                >
                  {category.name}
                </button>
              ))
            )}
          </nav>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-16" role="status">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center" role="alert">
              <p className="text-destructive font-medium mb-2">
                {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && (
            <p className="text-muted-foreground mb-6" role="status">
              {filteredServices.length} {language === 'uz' ? 'ta xizmat topildi' : language === 'ru' ? 'найдено услуг' : 'services found'}
            </p>
          )}

          {/* Services Grid */}
          {!loading && !error && (
            <>
              {filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <ServiceCard 
                      key={service.id} 
                      service={service}
                      onClick={() => navigate(`/services/${service.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    {language === 'uz' ? 'Hech narsa topilmadi' : language === 'ru' ? 'Ничего не найдено' : 'No services found'}
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