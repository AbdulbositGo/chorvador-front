import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Products = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories ni olish
  useEffect(() => {
    const fetchCategories = async () => {
      console.log("🏷️ Categories: Fetching categories");
      
      try {
        setCategoriesLoading(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const fullUrl = `${API_URL}/categories/`;
        
        console.log("📡 Categories: Request URL:", fullUrl);

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });
        
        console.log("📥 Categories: Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ Categories: Data received:", data);
        
        if (!Array.isArray(data)) {
          throw new Error("Categories data array formatida emas");
        }
        
        // "All" kategoriyasini qo'shish
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
        
        console.log("✨ Categories: Transformed:", allCategories);
        setCategories(allCategories);
        
      } catch (err) {
        console.error("❌ Categories: ERROR:", err);
        // Xato bo'lsa default categories ishlatamiz
        setCategories([
          { id: "all", name: language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All' },
          { id: "flower", name: language === 'uz' ? 'Gullar' : language === 'ru' ? 'Цветы' : 'Flowers' },
          { id: "texnika", name: language === 'uz' ? 'Texnika' : language === 'ru' ? 'Техника' : 'Equipment' },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [language]);

  // Products ni olish
  useEffect(() => {
    const fetchProducts = async () => {
      console.log("🚀 Products: useEffect ishga tushdi");
      console.log("🌐 Products: Current language:", language);
      
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = import.meta.env.VITE_API_URL;
        const fullUrl = `${API_URL}/products/`;
        
        console.log("📡 Products: So'rov yuborilmoqda:", fullUrl);

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });
        
        console.log("📥 Products: Response status:", response.status);
        console.log("📤 Products: Sent Accept-Language:", language);
        
        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("✅ Products: Data keldi:", data);
        
        // Backend pagination formatida bo'lishi mumkin
        let productsArray = [];
        if (data.results && Array.isArray(data.results)) {
          productsArray = data.results;
          console.log("📊 Products: Pagination format, results count:", productsArray.length);
        } else if (Array.isArray(data)) {
          productsArray = data;
          console.log("📊 Products: Array format, count:", productsArray.length);
        } else {
          throw new Error("Ma'lumot noto'g'ri formatda");
        }
        
        const transformedProducts = productsArray.map(product => ({
          id: product.id,
          name: product.title || product.name || '',
          category: product.category || 'all',
          categoryId: product.category ? product.category.toString() : 'all',
          price: parseFloat(product.price) || 0,
          image: product.image || '',
          description: product.description || '',
          discount: product.discount || false,
          is_featured: product.is_featured || false,
          is_banner: product.is_banner || false,
        }));
        
        console.log("✨ Products: Transform bo'ldi:", transformedProducts);
        setProducts(transformedProducts);
        
      } catch (err) {
        console.error("❌ Products: XATOLIK:", err);
        console.error("❌ Products: Xabar:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
        console.log("🏁 Products: Loading finished");
      }
    };

    fetchProducts();
  }, [language]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <section className="gradient-hero py-16 ">
        <div className="container-main">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t("products.page.title")}
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            {t("products.page.subtitle")}
          </p>
        </div>
      </section>

      <section className="section-padding ">
        <div className="container-main">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t("products.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              className="md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              {t("products.filters")}
            </Button>
          </div>

          <div className={cn(
            "flex flex-wrap gap-2 mb-8",
            !showFilters && "hidden md:flex"
          )}>
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
                >
                  {category.name}
                </button>
              ))
            )}
          </div>

          {loading && (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
              </span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
              <p className="text-destructive font-medium mb-2">
                {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
              </p>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-xs mt-2 text-muted-foreground">
                Console (F12) da ko'proq ma'lumot bor
              </p>
            </div>
          )}

          {!loading && !error && (
            <p className="text-muted-foreground mb-6">
              {filteredProducts.length} {t("products.found")}
            </p>
          )}

          {!loading && !error && (
            <>
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    {t("products.notFound")}
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