import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

interface ApiProduct {
  id: number;
  title: string;
  image: string;
  price: number | null;
  short_description: string;
  has_discount: boolean;
  category: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number | null;
  image: string;
  description: string;
  hasDiscount?: boolean;
}

interface FeaturedProductsProps {
  products: ApiProduct[];
  isLoading: boolean;
}

export function FeaturedProducts({ products: apiProducts, isLoading }: FeaturedProductsProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (apiProducts && apiProducts.length > 0) {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const featuredProducts: Product[] = apiProducts
        .slice(0, 6)
        .map(product => ({
          id: product.id.toString(),
          name: product.title,
          category: product.category,
          price: product.price, // null bo'lishi mumkin
          image: product.image.startsWith('http') 
            ? product.image 
            : `${apiUrl}${product.image}`,
          description: product.short_description,
          hasDiscount: product.has_discount
        }));

      setProducts(featuredProducts);
    }
  }, [apiProducts]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                {t("index.products.badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {t("index.products.title")}
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                {t("index.products.subtitle")}
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
                  {t("index.products.viewAll")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </ScrollReveal>

        {!isLoading && products.length > 0 && (
          <StaggerContainer 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
            staggerDelay={0.1}
          >
            {products.map((product) => (
              <StaggerItem key={product.id}>
                <div 
                  onClick={() => handleProductClick(product.id)} 
                  className="cursor-pointer h-full"
                >
                  <ProductCard 
                    product={product} 
                    showPrice={product.price !== null} 
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

        {!isLoading && products.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-muted-foreground text-base sm:text-lg">
              {t("index.products.noProducts")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}