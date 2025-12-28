import { Layout } from "@/components/layout/Layout";
import { CheckCircle, Target, Eye, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect } from "react";

const About = () => {
  const { t, language } = useLanguage();

  const values = [
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
  ];

  // SEO meta ma'lumotlari
  const pageTitle = t("about.title");
  const pageDescription = t("about.subtitle");
  const siteName = "Ultra Tez"; // O'z kompaniya nomingizni kiriting
  const siteUrl = window.location.origin; // Avtomatik domen
  const currentUrl = `${siteUrl}/${language}/about`;
  const imageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80";

  // SEO meta taglarni dinamik yangilash
  useEffect(() => {
    // Title
    document.title = `${pageTitle} | ${siteName}`;

    // Basic meta tags
    updateMetaTag("description", pageDescription);
    updateMetaTag("keywords", "haqimizda, kompaniya, xizmatlar, professional, sifat, ishonch");

    // Canonical
    updateLinkTag("canonical", currentUrl);

    // Open Graph
    updateMetaProperty("og:type", "website");
    updateMetaProperty("og:url", currentUrl);
    updateMetaProperty("og:title", `${pageTitle} | ${siteName}`);
    updateMetaProperty("og:description", pageDescription);
    updateMetaProperty("og:image", imageUrl);
    updateMetaProperty("og:site_name", siteName);
    updateMetaProperty("og:locale", language === 'uz' ? 'uz_UZ' : language === 'ru' ? 'ru_RU' : 'en_US');

    // Twitter
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:url", currentUrl);
    updateMetaTag("twitter:title", `${pageTitle} | ${siteName}`);
    updateMetaTag("twitter:description", pageDescription);
    updateMetaTag("twitter:image", imageUrl);

    // Alternate languages
    updateLinkTag("alternate", `${siteUrl}/uz/about`, "uz");
    updateLinkTag("alternate", `${siteUrl}/ru/about`, "ru");
    updateLinkTag("alternate", `${siteUrl}/en/about`, "en");
    updateLinkTag("alternate", `${siteUrl}/uz/about`, "x-default");

    // Structured Data - Organization
    updateStructuredData("organization-schema", {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": siteUrl,
      "logo": `${siteUrl}/logo.png`,
      "description": pageDescription,
      "foundingDate": "2004",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "UZ"
      },
      "sameAs": [
        "https://facebook.com/yourpage",
        "https://instagram.com/yourpage",
        "https://linkedin.com/company/yourcompany"
      ]
    });

    // Structured Data - BreadcrumbList
    updateStructuredData("breadcrumb-schema", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Bosh sahifa",
          "item": siteUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": pageTitle,
          "item": currentUrl
        }
      ]
    });

    // Cleanup function
    return () => {
      // Reset title on unmount
      document.title = siteName;
    };
  }, [pageTitle, pageDescription, language, currentUrl, siteName, siteUrl, imageUrl]);

  // Helper functions
  const updateMetaTag = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("name", name);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const updateMetaProperty = (property: string, content: string) => {
    let element = document.querySelector(`meta[property="${property}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute("property", property);
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const updateLinkTag = (rel: string, href: string, hreflang?: string) => {
    const selector = hreflang 
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]`;
    
    let element = document.querySelector(selector) as HTMLLinkElement;
    if (!element) {
      element = document.createElement("link");
      element.setAttribute("rel", rel);
      if (hreflang) {
        element.setAttribute("hreflang", hreflang);
      }
      document.head.appendChild(element);
    }
    element.setAttribute("href", href);
  };

  const updateStructuredData = (id: string, data: Record<string, unknown>) => {
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = id;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              {t("about.title")}
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Company description */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <article>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {t("about.history.badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t("about.history.title")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("about.history.p1")}</p>
                <p>{t("about.history.p2")}</p>
                <p>{t("about.history.p3")}</p>
              </div>
            </article>
            <figure className="relative">
              <img
                src="/about_img.jpg"
                alt={`${t("about.title")} - kompaniya tarixi`}
                loading="lazy"
                width="600"
                height="400"
                className="rounded-2xl shadow-hero w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold" aria-label="20 yildan ortiq tajriba">10+</div>
                <div className="text-sm font-medium">{t("about.history.years")}</div>
              </div>
            </figure>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding" aria-labelledby="values-heading">
        <div className="container-main">
          <header className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
              {t("about.values.badge")}
            </span>
            <h2 id="values-heading" className="text-3xl md:text-4xl font-bold text-foreground">
              {t("about.values.title")}
            </h2>
          </header>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <article key={value.title} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl gradient-hero flex items-center justify-center" aria-hidden="true">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;