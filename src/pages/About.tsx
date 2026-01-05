import { Layout } from "@/components/layout/Layout";
import { CheckCircle, Target, Award, LucideIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useMemo, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";

interface Value {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface StructuredDataObject {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

const About = () => {
  const { t, language } = useLanguage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const siteName = "Chorvador.uz";
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : "https://yourwebsite.com";
  const imageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80";

  const seoData = useMemo(() => {
    const pageTitle = t("about.title");
    const pageDescription = t("about.subtitle");
    const currentUrl = `${siteUrl}/${language}/about`;
    const keywords = language === 'uz' 
      ? "haqimizda, kompaniya, xizmatlar, professional, sifat, ishonch"
      : language === 'ru'
      ? "о нас, компания, услуги, профессионал, качество, доверие"
      : "about us, company, services, professional, quality, trust";

    return { pageTitle, pageDescription, currentUrl, keywords };
  }, [  t, language, siteUrl]);

  // Memoized values
  const values: Value[] = useMemo(() => [
    {
      icon: CheckCircle,
      title: t("about.values.quality.title"),
      description: t("about.values.quality.desc"),
    },
    {
      icon: Target,
      title: t("about.values.reliability.title"),
      description: t("about.values.reliability.desc"),
    },
    {
      icon: Award,
      title: t("about.values.professionalism.title"),
      description: t("about.values.professionalism.desc"),
    },
  ], [t]);

  const structuredData = useMemo(() => ({
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "description": seoData.pageDescription,
      "foundingDate": "2004",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "UZ"
      }
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": language === 'uz' ? "Bosh sahifa" : "Home",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": seoData.pageTitle,
          "item": seoData.currentUrl
        }
      ]
    }
  }), [seoData, siteName, siteUrl, language]);

  // Optimized resource hints
  useEffect(() => {
    const addResourceHint = (rel: string, href: string, crossorigin?: boolean): void => {
      if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (crossorigin) link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      }
    };

    // Critical resource hints
    addResourceHint('dns-prefetch', 'https://fonts.googleapis.com');
    addResourceHint('dns-prefetch', 'https://images.unsplash.com');
    addResourceHint('preconnect', 'https://fonts.googleapis.com');
    addResourceHint('preconnect', 'https://fonts.gstatic.com', true);
    
    // Preload critical image with priority
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = '/about_img.jpg';
    link.fetchPriority = 'high';
    document.head.appendChild(link);

    return () => {
      link.remove();
    };
  }, []);

  // Lazy load animations only when visible
  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      document.querySelectorAll('.lazy-animate').forEach((el) => {
        observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, []);

  // Image optimization with native lazy loading
  useEffect(() => {
    if (imgRef.current?.complete) {
      setImageLoaded(true);
    }
  }, []);

  return (
    <Layout>
      <Helmet>
        {/* Basic Meta Tags */}
        <html lang={language} />
        <title>{seoData.pageTitle} | {siteName}</title>
        <meta name="description" content={seoData.pageDescription} />
        <meta name="keywords" content={seoData.keywords} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={seoData.currentUrl} />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="uz" href={`${siteUrl}/uz/about`} />
        <link rel="alternate" hrefLang="ru" href={`${siteUrl}/ru/about`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en/about`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}/uz/about`} />
        
        {/* Open Graph Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.currentUrl} />
        <meta property="og:title" content={`${seoData.pageTitle} | ${siteName}`} />
        <meta property="og:description" content={seoData.pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content={language === 'uz' ? 'uz_UZ' : language === 'ru' ? 'ru_RU' : 'en_US'} />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={seoData.currentUrl} />
        <meta name="twitter:title" content={`${seoData.pageTitle} | ${siteName}`} />
        <meta name="twitter:description" content={seoData.pageDescription} />
        <meta name="twitter:image" content={imageUrl} />
        
        {/* Additional SEO Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content={siteName} />
        <meta name="revisit-after" content="7 days" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData.organization)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(structuredData.breadcrumb)}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="gradient-hero py-12 sm:py-16 lg:py-12">
        <div className="container-main">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
              {seoData.pageTitle}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-primary-foreground/90 leading-relaxed">
              {seoData.pageDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <article className="lazy-animate opacity-0 translate-x-[-20px] transition-all duration-700">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {t("about.history.badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 sm:mb-6">
                {t("about.history.title")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("about.history.p1")}</p>
                <p>{t("about.history.p2")}</p>
                <p>{t("about.history.p3")}</p>
              </div>
            </article>
            
            <figure className="relative lazy-animate opacity-0 translate-x-[20px] transition-all duration-700">
              <div className={`transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <img
                  ref={imgRef}
                  src="/about_img.jpg"
                  alt={`${seoData.pageTitle} - ${language === 'uz' ? 'kompaniya tarixi' : language === 'ru' ? 'история компании' : 'company history'}`}
                  loading="eager"
                  decoding="async"
                  width="600"
                  height="400"
                  className="rounded-2xl shadow-hero w-full object-cover will-change-transform"
                  fetchPriority="high"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
              <div 
                className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-secondary text-secondary-foreground p-4 sm:p-6 rounded-2xl shadow-lg lazy-animate opacity-0"
                style={{ animationDelay: '300ms' }}
                aria-label={language === 'uz' ? '10 yildan ortiq tajriba' : language === 'ru' ? 'более 10 лет опыта' : 'over 10 years experience'}
              >
                <div className="text-3xl sm:text-4xl font-bold">18+</div>
                <div className="text-xs sm:text-sm font-medium">{t("about.history.years")}</div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-muted/30" aria-labelledby="values-heading">
        <div className="container-main">
          <header className="text-center mb-8 sm:mb-12 lazy-animate opacity-0 translate-y-[-15px] transition-all duration-700">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
              {t("about.values.badge")}
            </span>
            <h2 id="values-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              {t("about.values.title")}
            </h2>
          </header>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <article 
                key={value.title} 
                className="text-center p-6 bg-background rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 lazy-animate opacity-0 translate-y-[20px]"
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-5 rounded-2xl gradient-hero flex items-center justify-center transform hover:scale-110 transition-transform duration-300" 
                  aria-hidden="true"
                >
                  <value.icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        /* Performance optimization styles */
        .lazy-animate.animate-visible {
          opacity: 1 !important;
          transform: translateY(0) translateX(0) !important;
        }

        .will-change-transform {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* GPU acceleration for animations */
        .gradient-hero,
        .lazy-animate,
        img {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        /* Optimize font rendering */
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* Content visibility for better performance */
        img {
          content-visibility: auto;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </Layout>
  );
};

export default About;