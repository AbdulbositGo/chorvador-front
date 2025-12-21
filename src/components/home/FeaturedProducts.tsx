import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

interface DashboardResponse {
  products: ApiProduct[];
  services: ApiService[];
}

interface ApiProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  short_description: string;
  has_discount: boolean;
  category: string;
}

interface ApiService {
  id: number;
  title: string;
  short_description: string;
  image: string;
  category: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  hasDiscount?: boolean;
}

export function FeaturedProducts() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }
        
        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';
        
        const response = await fetch(`${apiUrl}/dashboard/`, {
          method: 'GET',
          headers: {
            "Accept": "application/json",
            "Accept-Language": acceptLanguage,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }
        
        const rawData: DashboardResponse = await response.json();
        const data: ApiProduct[] = rawData.products || [];
        
        if (!Array.isArray(data)) {
          throw new Error('Noto\'g\'ri ma\'lumot formati');
        }
              
        const featuredProducts: Product[] = data
          .slice(0, 6)
          .map(product => ({
            id: product.id.toString(),
            name: product.title,
            category: product.category,
            price: product.price,
            image: product.image.startsWith('http') 
              ? product.image 
              : `${apiUrl}${product.image}`,
            description: product.short_description,
            hasDiscount: product.has_discount
          }));

        setProducts(featuredProducts);
        
      } catch (err) {
        console.error("ERROR:", err);
        const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [language]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                {t("products.badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {t("products.title")}
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                {t("products.subtitle")}
              </p>
            </div>
            <motion.div 
              whileHover={{ x: 5 }} 
              transition={{ type: "spring", stiffness: 400 }}
              className="w-full md:w-auto"
            >
              <Button 
                asChild 
                variant="outline" 
                className="w-full md:w-auto group hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Link to="/products" className="flex items-center justify-center gap-2">
                  {t("products.viewAll")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>

        {loading && (
          <div className="flex flex-col justify-center items-center py-12 sm:py-16">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-primary" />
            <span className="mt-3 text-sm sm:text-base text-muted-foreground">
              {t("products.page.loading")}
            </span>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 sm:p-6 text-center">
            <p className="text-destructive font-medium mb-2 text-sm sm:text-base">
              Xatolik yuz berdi
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm sm:text-base"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <StaggerContainer 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
            staggerDelay={0.1}
          >
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <div onClick={() => handleProductClick(product.id)} className="cursor-pointer">
                  <ProductCard product={product} />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-muted-foreground text-base sm:text-lg">
              Hozircha featured mahsulotlar mavjud emas
            </p>
          </div>
        )}
      </div>
    </section>
  );
}