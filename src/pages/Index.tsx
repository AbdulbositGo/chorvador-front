import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { HeroSlider } from "@/components/home/HeroSlider";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ServicesSection } from "@/components/home/ServicesSection";
import { StatsSection } from "@/components/home/StatsSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { LocationSection } from "@/components/home/LocationSection";
import About from "@/components/home/AboutHomePage";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

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

const Index = () => {
  const { language, t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          throw new Error("API URL topilmadi");
        }

        const acceptLanguage =
          language === "uz" ? "uz" : language === "ru" ? "ru" : "en";

        const response = await fetch(`${apiUrl}/dashboard/`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Accept-Language": acceptLanguage,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP xatolik! Status: ${response.status}`);
        }

        const data: DashboardResponse = await response.json();
        setDashboardData(data);
      } catch (err) {
        console.error("Dashboard ma'lumotlarini yuklashda xatolik:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Noma'lum xatolik";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [language]);

  return (
    <>
      <Helmet>
        <html lang={language} />
        <title>
          {loading ? `${t("loading")} | Chorvador` : t("seo.home.title")}
        </title>
        <meta name="description" content={t("seo.home.description")} />
        <meta name="keywords" content={t("seo.home.keywords")} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("seo.home.title")} />
        <meta property="og:description" content={t("seo.home.description")} />
        <meta
          property="og:image"
          content="https://chorvador.uz/og-image2.png"
        />

        {/* SEO */}
        <meta name="robots" content={loading ? "noindex, nofollow" : "index, follow"} />
        <meta name="author" content="Chorvador" />
      </Helmet>

      <Layout>
        {loading ? (
          <div className="flex flex-col justify-center items-center min-h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <span className="mt-4 text-lg text-muted-foreground">
              {t("products.page.loading")}
            </span>
          </div>
        ) : (
          <>
            <HeroSlider />
            <StatsSection />
            <About />
            <FeaturedProducts
              products={dashboardData?.products || []}
              isLoading={false}
            />
            <ServicesSection
              services={dashboardData?.services || []}
              isLoading={false}
            />
            <PartnersSection />
            <LocationSection />
          </>
        )}
      </Layout>
    </>
  );
};

export default Index;