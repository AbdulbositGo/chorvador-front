import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

export function Layout({ 
  children, 
  title,
  description,
  keywords,
  image = "/og-image2.png"
}: LayoutProps) {
  const { language } = useLanguage();

  // Default metadata - til bo'yicha
  const defaultMetadata = {
    uz: {
      title: "Chorvador.uz - Qishloq xo'jaligi mahsulotlari va texnikalari",
      description: "O'zbekistonda qishloq xo'jaligi mahsulotlari, chorvachilik asbob-uskunalari, urug'lar, o'g'itlar va sugorish tizimlari. Eng yaxshi narxlar va sifatli xizmat.",
      keywords: "qishloq xo'jaligi, chorvachilik, urug'lar, o'g'itlar, sugorish, qishloq xo'jaligi texnikasi, chorvador, fermer, O'zbekiston",
    },
    ru: {
      title: "Chorvador.uz - Сельскохозяйственная продукция и техника",
      description: "Сельскохозяйственная продукция в Узбекистане, оборудование для животноводства, семена, удобрения и системы орошения. Лучшие цены и качественный сервис.",
      keywords: "сельское хозяйство, животноводство, семена, удобрения, орошение, сельхозтехника, фермер, Узбекистан",
    },
    en: {
      title: "Chorvador.uz - Agricultural Products and Equipment",
      description: "Agricultural products in Uzbekistan, livestock equipment, seeds, fertilizers and irrigation systems. Best prices and quality service.",
      keywords: "agriculture, livestock, seeds, fertilizers, irrigation, agricultural equipment, farmer, Uzbekistan",
    }
  };

  const currentLang = defaultMetadata[language as keyof typeof defaultMetadata] || defaultMetadata.uz;
  const pageTitle = title ? `${title} | Chorvador.uz` : currentLang.title;
  const pageDescription = description || currentLang.description;
  const pageKeywords = keywords || currentLang.keywords;

  useEffect(() => {
    // Document title
    document.title = pageTitle;

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

    // Basic meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', pageKeywords);
    updateMetaTag('author', 'Chorvador.uz');
    
    // Open Graph tags
    updateMetaTag('og:title', pageTitle, true);
    updateMetaTag('og:description', pageDescription, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'Chorvador.uz', true);
    updateMetaTag('og:locale', language === 'uz' ? 'uz_UZ' : language === 'ru' ? 'ru_RU' : 'en_US', true);
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', image);

    // Additional SEO
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('language', language);

    // HTML lang attribute
    document.documentElement.lang = language;

  }, [pageTitle, pageDescription, pageKeywords, language, image]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}