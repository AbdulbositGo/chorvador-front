import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

// Dashboard API'dan keladigan struktura
interface DashboardResponse {
  products: ApiProduct[];
  services: ApiService[];
}

// API'dan keladigan product struktura
interface ApiProduct {
  id: number;
  title: string;
  price: number;
  image: string;
  discount?: boolean;
  category?: string;
}

interface ApiService {
  id: number;
  title: string;
  description: string;
  image: string;
}

// Ichki ishlatish uchun struktura
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
}

export function FeaturedProducts() {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        console.log('=== START FETCHING DASHBOARD ===');
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        console.log('1. API URL:', apiUrl);
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi. .env faylini tekshiring");
        }
        
        // Language kodini to'g'ri formatga o'tkazish
        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        
        console.log('2. Language:', language);
        console.log('3. Accept-Language header:', acceptLanguage);
        console.log('4. Full URL:', `${apiUrl}/dashboard/`);
        
        const response = await fetch(`${apiUrl}/dashboard/`, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            "Accept-Language": acceptLanguage,
            "Content-Type": "application/json"
          }
        });
        
        console.log('5. Response status:', response.status);
        console.log('6. Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', errorText);
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const rawData: DashboardResponse = await response.json();
        console.log('7. RAW DATA:', rawData);
        
        // Products arrayni olish
        const data: ApiProduct[] = rawData.products || [];
        console.log('8. Products data:', data);
        console.log('9. Total products:', data.length);
        
        if (!Array.isArray(data)) {
          console.error('Products is not an array:', data);
          throw new Error('Noto\'g\'ri ma\'lumot formati');
        }
        
        // Barcha mahsulotlarni log qilish
        console.log('10. All products:', data.map(p => ({
          id: p.id,
          title: p.title,
          discount: p.discount
        })));
        
        // Discount bor mahsulotlarni yoki birinchi 6 tasini olish
        const featuredProducts: Product[] = data
          .slice(0, 6)
          .map(product => ({
            id: product.id.toString(),
            name: product.title,
            category: product.category || "Umumiy",
            price: product.price,
            image: product.image.startsWith('http') 
              ? product.image 
              : `${apiUrl}${product.image}`,
            description: "", // API'da description yo'q
          }));
        
        console.log('11. Featured products:', featuredProducts);
        console.log('12. Featured products count:', featuredProducts.length);
        console.log('=== SETTING PRODUCTS TO STATE ===');
        setProducts(featuredProducts);
        console.log('=== END FETCHING ===');
        
      } catch (err) {
        console.error("!!! ERROR !!!", err);
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
        setError(errorMessage);
      } finally {
        console.log('=== SETTING LOADING FALSE ===');
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [language]);

  return (
    <section className="section-padding" >
      <div className="container-main">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
                {t("products.badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t("products.title")}
              </h2>
              <p className="mt-3 text-muted-foreground max-w-2xl">
                {t("products.subtitle")}
              </p>
            </div>
            <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
              <Button asChild variant="outline" className="self-start md:self-auto group">
                <Link to="/products" className="flex items-center gap-2">
                  {t("products.viewAll")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">{t("products.page.loading")}</span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive font-medium mb-2">Xatolik yuz berdi</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.1}>
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              Hozircha featured mahsulotlar mavjud emas
            </p>
          </div>
        )}
      </div>
    </section>
  );
}