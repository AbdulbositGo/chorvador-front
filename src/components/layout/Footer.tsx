import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Twitter, Linkedin, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useMemo, useCallback } from "react";
import type { ProductItem } from "./Layout";

interface FooterProps {
  products: ProductItem[];
  services: ProductItem[];
  loading?: boolean;
}

export function Footer({ products, services, loading = false }: FooterProps) {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const truncateTitle = (title: string, maxLength: number = 24) => {
    return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const footerLinks = useMemo(() => ({
    company: [
      { name: t("footer.company.about") || "About", href: "/about" },
      { name: t("footer.company.services") || "Services", href: "/services" },
      { name: t("footer.company.products") || "Products", href: "/products" },
      { name: t("footer.company.contact") || "Contact", href: "#footer" },
    ],
  }), [t]);

  const socialLinks = useMemo(() => [
    { name: "Facebook", href: "https://facebook.com/chorvadoruz", icon: Facebook, ariaLabel: "Facebook" },
    { name: "Instagram", href: "https://instagram.com/chorvadoruz", icon: Instagram, ariaLabel: "Instagram" },
    { name: "Telegram", href: "https://t.me/Chorvadortr", icon: Send, ariaLabel: "Telegram" },
  ], []);

  // Birinchi 5 ta mahsulotni olish
  const displayProducts = useMemo(() => products.slice(0, 5), [products]);

  return (
    <footer id="footer" className="bg-primary-dark text-primary-foreground relative" role="contentinfo">
      {showScrollTop && (
        <button 
          onClick={scrollToTop} 
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg z-50 hover:bg-primary/90 transition-colors"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div className="container-main py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand qismi */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/chorvador_logo.png" alt="Chorvador.uz Logo" className="w-25 h-14 object-contain" />
            </Link>
            <p className="text-primary-foreground/80 mb-6">{t("footer.description")}</p>
            <ul className="flex gap-3" role="list">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a 
                    href={social.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-white hover:text-primary-dark transition-all"
                    aria-label={social.ariaLabel}
                  >
                    <social.icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <nav aria-labelledby="footer-company-heading">
            <h3 id="footer-company-heading" className="font-heading font-semibold text-lg mb-4">
              {t("footer.company.title") || "Company"}
            </h3>
            <ul className="space-y-3" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith('#') ? (
                    <button
                      onClick={() => {
                        const footer = document.getElementById('footer');
                        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-primary-foreground/70 hover:text-white transition-colors"
                    >
                      {link.name}
                    </button>
                  ) : (
                    <Link 
                      to={link.href} 
                      className="text-primary-foreground/70 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Dinamik Mahsulot Titlelar (birinchi 5 ta) */}
          <nav aria-labelledby="footer-products-heading">
            <h3 id="footer-products-heading" className="font-heading font-semibold text-lg mb-4">
              {t("footer.products.title") || "Products"}
            </h3>
            <ul className="space-y-3 list-none" role="list">
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <li key={i}>
                      <div className="h-5 bg-primary-foreground/10 rounded animate-pulse w-3/4"></div>
                    </li>
                  ))}
                </>
              ) : displayProducts.length > 0 ? (
                displayProducts.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/products/${product.id}`}
                      className="text-primary-foreground/70 hover:text-white transition-colors block"
                      title={product.title}
                    >
                      {truncateTitle(product.title)}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link 
                    to="/products" 
                    className="text-primary-foreground/70 hover:text-white transition-colors"
                  >
                    {t("footer.products.all") || "All Products"}
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Contact qismi */}
          <address className="not-italic">
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t("footer.contact.title") || "Contact"}
            </h3>
            <ul className="space-y-4" role="list">
              <li>
                <a 
                  href="tel:+998974440016" 
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                  aria-label="Phone number"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>+998 97 444 00 16</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@chorvador.uz" 
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                  aria-label="Email address"
                >
                  <Mail className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>info@chorvador.uz</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps?ll=41.350498,69.264383&z=17&t=m&hl=uz&gl=US&mapclient=embed&cid=3984649803725302337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-primary-foreground/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded"
                  aria-label="View our location on Google Maps"
                >
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{t("footer.contact.address") || "Tashkent, Uzbekistan"}</span>
                </a>
              </li>
            </ul>
          </address>
        </div>
        
        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()}{t("footer.copyright") || "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}