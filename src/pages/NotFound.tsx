import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>{t("404.title")} - Chorvador.uz</title>
        <meta name="description" content={t("404.description")} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="flex min-h-screen items-center justify-center bg-muted px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-bold text-primary mb-4">
              {t("404.title")}
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              {t("404.subtitle")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("404.description")}
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            {t("404.home")}
          </Link>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>{location.pathname}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;