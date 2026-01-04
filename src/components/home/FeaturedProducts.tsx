import { useState, useEffect, useMemo } from "react";
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

  // useMemo bilan optimizatsiya - har safar qayta hisoblash kerak emas
  const products = useMemo(() => {
    if (!apiProducts || apiProducts.length === 0) return [];
    
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    return apiProducts
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
  }, [apiProducts]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  // Keyboard accessibility uchun
  const handleKeyDown = (e: React.KeyboardEvent, productId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleProductClick(productId);
    }
  };

  return (
    <section 
      className="py-12 sm:py-16 lg:py-12 bg-background"
      aria-labelledby="featured-products-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ScrollReveal>
          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="flex-1">
              <span 
                className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-2 sm:mb-3"
                role="status"
                aria-label="Featured section"
              >
                {t("index.products.badge") || "Featured Products"}
              </span>
              <h2 
                id="featured-products-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight"
              >
                {t("index.products.title") || "Our Products"}
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl">
                {t("index.products.subtitle") || "Discover our range of quality products"}
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
                aria-label="View all products"
              >
                <Link 
                  to="/products" 
                  className="flex items-center justify-center gap-2"
                >
                  {t("index.products.viewAll") || "View All"}
                  <ArrowRight 
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </motion.div>
          </header>
        </ScrollReveal>

        {isLoading && (
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            role="status"
            aria-label="Loading products"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-muted/50 rounded-lg aspect-[3/4] animate-pulse"
                aria-hidden="true"
              />
            ))}
            <span className="sr-only">Loading products...</span>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div role="list" aria-label="Featured products">
            <StaggerContainer 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" 
              staggerDelay={0.1}
            >
              {products.map((product) => (
                <StaggerItem key={product.id}>
                  <article
                    onClick={() => handleProductClick(product.id)}
                    onKeyDown={(e) => handleKeyDown(e, product.id)}
                    className="cursor-pointer h-full focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-lg transition-shadow"
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                  >
                    <ProductCard 
                      product={product} 
                      showPrice={product.price !== null} 
                    />
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}

        {!isLoading && products.length === 0 && (
          <div 
            className="text-center py-12 sm:py-16"
            role="status"
            aria-live="polite"
          >
            <p className="text-muted-foreground text-base sm:text-lg">
              {t("index.products.noProducts") || "No products available at the moment"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}