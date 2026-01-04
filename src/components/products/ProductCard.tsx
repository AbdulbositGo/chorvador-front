import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number | null;
  image: string;
  badge?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  hidePrice?: boolean;
  showPrice?: boolean;
}

export function ProductCard({ product, hidePrice = false, showPrice = true }: ProductCardProps) {
  const { t } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };
  
  const getBadgeText = (badge?: string) => {
    if (!badge) return "";
    if (badge === "popular") return t("products.popular") || "Popular";
    if (badge === "new") return t("products.new") || "New";
    if (badge === "discount") return t("products.discount") || "Discount";
    return badge;
  };
  
  const getBadgeClass = (badge?: string) => {
    if (!badge) return "";
    if (badge === "popular") return "bg-primary text-primary-foreground";
    if (badge === "new") return "bg-secondary text-secondary-foreground";
    if (badge === "discount") return "bg-destructive text-destructive-foreground";
    return "bg-muted text-muted-foreground";
  };

  // Memoized calculations
  const shouldShowPrice = useMemo(
    () => !hidePrice && showPrice && product.price !== null,
    [hidePrice, showPrice, product.price]
  );

  const badgeInfo = useMemo(
    () => product.badge ? {
      text: getBadgeText(product.badge),
      className: getBadgeClass(product.badge)
    } : null,
    [product.badge, t]
  );

  return (
    <article
      className="group rounded-2xl bg-card border border-border overflow-hidden card-hover h-full flex flex-col"
      aria-labelledby={`product-${product.id}-title`}
    >
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 400 }}
        className="h-full flex flex-col"
      >
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {/* Placeholder */}
          {!imageLoaded && (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse"
              aria-hidden="true"
            />
          )}

          <motion.img
            src={product.image}
            alt={`${product.name} - ${product.category}`}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
            onLoad={() => setImageLoaded(true)}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Badge */}
          {badgeInfo && (
            <span
              className={cn(
                "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md",
                badgeInfo.className
              )}
              role="status"
              aria-label={`Product badge: ${badgeInfo.text}`}
            >
              {badgeInfo.text}
            </span>
          )}

          {/* Hover Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 gap-2"
            aria-hidden="true"
          >
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="hover:scale-110 transition-transform bg-primary/90 hover:bg-[rgba(5,134,214,0.52)] text-white"
              aria-label={`View details for ${product.name}`}
            >
              <Link to={`/products/${product.id}`}>
                <Eye className="w-4 h-4 mr-1" aria-hidden="true" />
                {t("products.view") || "View"}
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category */}
          <span 
            className="text-xs text-muted-foreground uppercase tracking-wide"
            aria-label={`Category: ${product.category}`}
          >
            {product.category}
          </span>

          {/* Title */}
          <Link 
            to={`/products/${product.id}`}
            className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            aria-label={`View ${product.name} details`}
          >
            <h3 
              id={`product-${product.id}-title`}
              className="font-heading font-semibold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors"
            >
              {product.name}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="mt-auto">
            {shouldShowPrice ? (
              <span 
                className="text-xl font-bold text-primary"
                aria-label={`Price: ${formatPrice(product.price!)}`}
              >
                {formatPrice(product.price!)}
              </span>
            ) : !hidePrice && showPrice && product.price === null ? (
              <span 
                className="text-sm text-muted-foreground font-medium"
                role="status"
              >
                {t("products.priceOnRequest") || "Narx so'raladi"}
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>
    </article>
  );
}