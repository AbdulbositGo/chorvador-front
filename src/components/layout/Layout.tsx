import { ReactNode, useEffect, useMemo } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
}

// Static metadata - komponent tashqarida
const defaultMetadata = {
  uz: {
    title: "Chorvador.uz - Chorvachilik uskunalari va jihozlari",
    description: "O'zbekistonda qishloq xo'jaligi mahsulotlari, chorvachilik asbob-uskunalari, urug'lar, o'g'itlar va sugorish tizimlari. Eng yaxshi narxlar va sifatli xizmat.",
    keywords: "qishloq xo'jaligi, chorvachilik, urug'lar, o'g'itlar, sugorish, qishloq xo'jaligi texnikasi, chorvador, fermer, O'zbekiston",
  },
  ru: {
    title: "Chorvador.uz - Сельскохозяйственное оборудование и принадлежности",
    description: "Сельскохозяйственная продукция в Узбекистане, оборудование для животноводства, семена, удобрения и системы орошения. Лучшие цены и качественный сервис.",
    keywords: "сельское хозяйство, животноводство, семена, удобрения, орошение, сельхозтехника, фермер, Узбекистан",
  },
  en: {
    title: "Chorvador.uz - Livestock equipment and tools",
    description: "Agricultural products in Uzbekistan, livestock equipment, seeds, fertilizers and irrigation systems. Best prices and quality service.",
    keywords: "agriculture, livestock, seeds, fertilizers, irrigation, agricultural equipment, farmer, Uzbekistan",
  }
} as const;

// Locale mapping
const localeMap = {
  uz: 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_US'
} as const;

export function Layout({ 
  children, 
  title,
  description,
  keywords,
  image = "/og-image2.png",
  canonical
}: LayoutProps) {
  const { language } = useLanguage();

  // Memoized metadata
  const metadata = useMemo(() => {
    const currentLang = defaultMetadata[language as keyof typeof defaultMetadata] || defaultMetadata.uz;
    const pageTitle = title ? `${title} | Chorvador.uz` : currentLang.title;
    const pageDescription = description || currentLang.description;
    const pageKeywords = keywords || currentLang.keywords;
    const locale = localeMap[language as keyof typeof localeMap] || localeMap.uz;

    return {
      title: pageTitle,
      description: pageDescription,
      keywords: pageKeywords,
      locale,
      image: image.startsWith('http') ? image : `${window.location.origin}${image}`,
      url: canonical || window.location.href
    };
  }, [language, title, description, keywords, image, canonical]);

  useEffect(() => {
    // Document title
    document.title = metadata.title;

    // HTML attributes
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'uz' || language === 'ru' ? 'ltr' : 'ltr';

    // Meta tags ni yangilash yoki yaratish
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Canonical link
    const updateCanonicalLink = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      
      link.href = url;
    };

    // Basic meta tags
    updateMetaTag('description', metadata.description);
    updateMetaTag('keywords', metadata.keywords);
    updateMetaTag('author', 'Chorvador.uz');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('theme-color', '#2D79C4');
    
    // Open Graph tags
    updateMetaTag('og:title', metadata.title, true);
    updateMetaTag('og:description', metadata.description, true);
    updateMetaTag('og:image', metadata.image, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', metadata.title, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', metadata.url, true);
    updateMetaTag('og:site_name', 'Chorvador.uz', true);
    updateMetaTag('og:locale', metadata.locale, true);
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', metadata.title);
    updateMetaTag('twitter:description', metadata.description);
    updateMetaTag('twitter:image', metadata.image);
    updateMetaTag('twitter:image:alt', metadata.title);

    // Additional SEO
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('language', language);
    updateMetaTag('revisit-after', '7 days');
    updateMetaTag('rating', 'general');

    // Canonical URL
    updateCanonicalLink(metadata.url);

    // Alternate language links
    const updateAlternateLinks = () => {
      // Remove existing alternate links
      document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());

      // Add new alternate links
      const languages = ['uz', 'ru', 'en'];
      languages.forEach(lang => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = lang;
        link.href = `${window.location.origin}${window.location.pathname}?lang=${lang}`;
        document.head.appendChild(link);
      });

      // Add x-default
      const defaultLink = document.createElement('link');
      defaultLink.rel = 'alternate';
      defaultLink.hreflang = 'x-default';
      defaultLink.href = `${window.location.origin}${window.location.pathname}`;
      document.head.appendChild(defaultLink);
    };

    updateAlternateLinks();

  }, [metadata, language]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link - accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      <Header />
      
      <main 
        id="main-content"
        className="flex-1"
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
      
      <Footer />
    </div>
  );
}