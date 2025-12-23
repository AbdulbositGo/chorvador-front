import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  hidePrice?: boolean;
}

export function ProductCard({ product, hidePrice = false }: ProductCardProps) {
  const { t } = useLanguage();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
  };
  
  const getBadgeText = (badge?: string) => {
    if (!badge) return "";
    if (badge === "popular") return t("products.popular");
    if (badge === "new") return t("products.new");
    if (badge === "discount") return t("products.discount");
    return badge;
  };
  
  const getBadgeClass = (badge?: string) => {
    if (!badge) return "";
    if (badge === "popular") return "bg-primary text-primary-foreground";
    if (badge === "new") return "bg-secondary text-secondary-foreground";
    if (badge === "discount") return "bg-destructive text-destructive-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <motion.div
      className="group rounded-2xl bg-card border border-border overflow-hidden card-hover h-full flex flex-col "
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        {product.badge && (
          <span
            className={cn(
              "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold",
              getBadgeClass(product.badge)
            )}
          >
            {getBadgeText(product.badge)}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4 gap-2">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="hover:scale-110 transition-transform bg-primary/90 hover:bg-[rgba(5,134,214,0.52)] text-white"
          >
            <Link to={`/products/${product.id}`}>
              <Eye className="w-4 h-4 mr-1" />
              {t("products.view")}
            </Link>
          </Button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {product.category}
        </span>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-heading font-semibold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {!hidePrice && (
          <div className="mt-auto">
            <span className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}