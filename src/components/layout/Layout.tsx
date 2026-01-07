import { ReactNode, useEffect, useState } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export interface ProductItem {
  id: number;
  title: string;
  category: string;
  categoryId: string;
  image?: string;
  price?: number;
  short_description?: string;
  has_discount?: boolean;
}

interface LayoutProps {
  children: ReactNode;
}

interface ApiProductResponse {
  id: number;
  title: string;
  image?: string;
  price?: number;
  short_description?: string;
  has_discount?: boolean;
  category: string;
  category_id: number; // Backend dan kelgan category ID
}

interface ApiServiceResponse {
  id: number;
  title: string;
  short_description?: string;
  image?: string;
  category: string;
  category_id: number; // Backend dan kelgan category ID
}

export function Layout({ children }: LayoutProps) {
  const { language } = useLanguage();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [services, setServices] = useState<ProductItem[]>([]);
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL;
        
        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }

        const acceptLanguage = language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en';

        // Fetch products
        const productsResponse = await fetch(`${apiUrl}/products-list/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': acceptLanguage,
          },
        });

        // Fetch services
        const servicesResponse = await fetch(`${apiUrl}/services-list/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': acceptLanguage,
          },
        });

        if (!productsResponse.ok || !servicesResponse.ok) {
          throw new Error("Ma'lumotlarni yuklashda xatolik");
        }

        const productsData = await productsResponse.json() as ApiProductResponse[];
        const servicesData = await servicesResponse.json() as ApiServiceResponse[];

        // Transform products data - backend dan kelgan category_id ni ishlatamiz
        const transformedProducts: ProductItem[] = productsData.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          categoryId: item.category_id?.toString() || '', // Backend dan kelgan category_id
          image: item.image,
          price: item.price,
          short_description: item.short_description,
          has_discount: item.has_discount,
        }));

        // Transform services data - backend dan kelgan category_id ni ishlatamiz
        const transformedServices: ProductItem[] = servicesData.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          categoryId: item.category_id?.toString() || '', // Backend dan kelgan category_id
          image: item.image,
          short_description: item.short_description,
        }));

        // Extract unique categories
        const uniqueProductCategories = Array.from(
          new Set(transformedProducts.map(p => p.category).filter(Boolean))
        );

        const uniqueServiceCategories = Array.from(
          new Set(transformedServices.map(s => s.category).filter(Boolean))
        );

        setProducts(transformedProducts);
        setServices(transformedServices);
        setProductCategories(uniqueProductCategories);
        setServiceCategories(uniqueServiceCategories);

        console.log('Layout products loaded:', transformedProducts.length);
        console.log('Layout services loaded:', transformedServices.length);

      } catch (error) {
        console.error('Layout data fetch error:', error);
        setProducts([]);
        setServices([]);
        setProductCategories([]);
        setServiceCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        products={products}
        services={services}
        productCategories={productCategories}
        serviceCategories={serviceCategories}
        loading={loading}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer 
        products={products}
        services={services}
        loading={loading}
      />
    </div>
  );
}