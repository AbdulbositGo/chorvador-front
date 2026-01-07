import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, SlidersHorizontal, X, Loader2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApiProduct[];
}

interface ApiProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  short_description: string;
  has_discount: boolean;
  category: string;
  category_id: number;
}

interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  categoryName: string;
  price: number;
  image: string;
  description: string;
  hasDiscount: boolean;
}

interface ApiCategory {
  id: number;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

const Products = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const categoryFromUrl = searchParams.get("category") || "all";
  const searchFromUrl = searchParams.get("search") || "";
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    const newCategory = searchParams.get("category") || "all";
    const newSearch = searchParams.get("search") || "";
    const newPage = parseInt(searchParams.get("page") || "1", 10);
    
    setSelectedCategory(newCategory);
    setSearchQuery(newSearch);
    setCurrentPage(newPage);
  }, [searchParams]);

  useEffect(() => {
    const pageTitle = language === 'uz' 
      ? 'Mahsulotlar | Chorvador.uz'
      : language === 'ru' 
      ? 'Продукты | Chorvador.uz'
      : 'Products | Chorvador.uz';
    
    document.title = pageTitle;
  }, [language]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }

        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        
        const response = await fetch(`${apiUrl}/categories/?type=product`, {
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
        
        const data = await response.json() as ApiCategory[];
        
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
        
        setCategories(allCategories);
        
        console.log('Categories loaded:', allCategories);
      } catch (err) {
        console.error('Categories fetch error:', err);
        setCategories([
          { id: "all", name: language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All' },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }

        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        
        if (selectedCategory !== 'all') {
          params.append('category', selectedCategory);
        }
        
        if (searchQuery.trim()) {
          params.append('search', searchQuery.trim());
        }

        const url = `${apiUrl}/products/?${params.toString()}`;
        
        console.log('Fetching products from:', url);
        console.log('Selected Category ID:', selectedCategory);

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
        
        const data = await response.json() as ProductsResponse;
        const productsArray: ApiProduct[] = data.results || [];
        
        setTotalCount(data.count || 0);
        
        if (!Array.isArray(productsArray)) {
          throw new Error("Ma'lumot noto'g'ri formatda");
        }

        const transformedProducts: Product[] = productsArray.map(product => {
          return {
            id: product.id.toString(),
            name: product.title,
            category: product.category || '',
            categoryId: product.category_id?.toString() || 'all',
            categoryName: product.category || '',
            price: product.price,
            image: product.image.startsWith('http') 
              ? product.image 
              : `${apiUrl}${product.image}`,
            description: product.short_description,
            hasDiscount: product.has_discount,
          };
        });
        
        setProducts(transformedProducts);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
        console.error('Products fetch error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (!categoriesLoading) {
      fetchProducts();
    }
  }, [language, categoriesLoading, categories, currentPage, selectedCategory, searchQuery]);

  const handleProductClick = useCallback((productId: string) => {
    navigate(`/products/${productId}`);
  }, [navigate]);

  const handleCategoryChange = useCallback((categoryId: string) => {
    console.log('Category changed to ID:', categoryId);
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setShowFilters(false);
    
    const params = new URLSearchParams();
    if (categoryId !== "all") {
      params.set("category", categoryId);
    }
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    
    const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Navigating to:', newUrl);
    navigate(newUrl, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchQuery, navigate]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    
    const params = new URLSearchParams();
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (value.trim()) {
      params.set("search", value.trim());
    }
    
    const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
    navigate(newUrl, { replace: true });
  }, [selectedCategory, navigate]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
    const params = new URLSearchParams();
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (page > 1) {
      params.set("page", page.toString());
    }
    
    const newUrl = `/products${params.toString() ? '?' + params.toString() : ''}`;
    navigate(newUrl, { replace: true });
    
    const element = document.getElementById('products-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedCategory, searchQuery, navigate]);

  const { totalPages, startIndex, endIndex } = useMemo(() => {
    const total = Math.ceil(totalCount / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    return {
      totalPages: total,
      startIndex: start,
      endIndex: end,
    };
  }, [totalCount, currentPage, itemsPerPage]);

  const visibleCategories = useMemo(() => 
    showAllCategories ? categories : categories.slice(0, 6),
    [showAllCategories, categories]
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 py-6 sm:py-8 lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              {t("products.page.title")}
            </h1>
            <p className="text-base sm:text-lg text-primary-foreground/90 leading-relaxed line-clamp-2 min-h-[3.5rem]">
              {t("products.page.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Search & Filter Toggle - OPTIMIZED */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
              <Input
                placeholder={t("products.search")}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 sm:pl-12 pr-10 sm:pr-12 h-11 sm:h-12 text-sm sm:text-base"
                aria-label={t("products.search")}
                type="text"
                autoComplete="off"
              />
              {searchQuery && (
                <Button
                  onClick={() => handleSearchChange("")}
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted rounded-full transition-colors"
                  aria-label="Clear search"
                  type="button"
                >
                  <X className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              className="sm:hidden h-11 font-medium"
              onClick={() => setShowFilters(!showFilters)}
              aria-label={t("products.filters")}
              aria-expanded={showFilters}
              type="button"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
              {t("products.filters")}
            </Button>
          </div>

          {/* Categories Filter */}
          <nav 
            className={cn(
              "mb-6 sm:mb-8 transition-all duration-300",
              !showFilters && "hidden sm:block"
            )}
            aria-label="Product categories"
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
                      onClick={() => handleCategoryChange(category.id)}
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
            <div id="products-grid" className="flex items-center gap-2 text-muted-foreground mb-4 sm:mb-6" role="status" aria-live="polite">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
              <p className="text-sm sm:text-base font-medium">
                {totalCount} {t("products.found")}
                {totalCount > itemsPerPage && (
                  <span className="text-muted-foreground/70 ml-2">
                    ({startIndex + 1}-{Math.min(endIndex, totalCount)} {language === 'uz' ? 'ko\'rsatilmoqda' : language === 'ru' ? 'показано' : 'shown'})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && (
            <>
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" role="list">
                    {products.map((product) => (
                      <article 
                        key={product.id} 
                        onClick={() => handleProductClick(product.id)}
                        className="cursor-pointer"
                        role="listitem"
                      >
                        <ProductCard 
                          product={product} 
                          hidePrice={product.price === null || product.price === 0}
                        />
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav 
                      className="flex justify-center items-center gap-2 mt-8 sm:mt-12"
                      aria-label="Pagination"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                            onClick={() => handlePageChange(page)}
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
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
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
                    <Package className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <p className="text-muted-foreground text-base sm:text-lg lg:text-xl font-medium mb-2">
                    {t("products.notFound")}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {language === 'uz' 
                      ? 'Boshqa kategoriyani tanlang yoki qidiruvni o\'zgartiring' 
                      : language === 'ru' 
                      ? 'Выберите другую категорию или измените поиск'
                      : 'Try selecting a different category or changing your search'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;