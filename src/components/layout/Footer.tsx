import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Twitter, Linkedin, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useMemo, useCallback } from "react";

// Kategoriya interfeysi
interface Category {
  id: number;
  name: string;
  slug: string;
}

export function Footer() {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Kategoriyalar uchun state

  // API dan kategoriyalarni yuklab olish
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/categories/`);
        if (response.ok) {
          const data = await response.json();
          // Agar pagination bo'lsa data.results, bo'lmasa data ning o'zi
          const categoryList = Array.isArray(data) ? data : (data.results || []);
          setCategories(categoryList.slice(0, 5)); // Faqat birinchi 5 tasini olish
        }
      } catch (error) {
        console.error("Error fetching categories for footer:", error);
      }
    };

    fetchCategories();
  }, []);

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
      { name: t("footer.company.contact") || "Contact", href: "/contact" },
    ],
    // Endi bu qism dinamik kategoriyalar bilan to'ldiriladi (pastda ko'ring)
    services: [
      { name: t("footer.services.technical") || "Technical Support", href: "/services" },
      { name: t("footer.services.consulting") || "Consulting", href: "/services" },
      { name: t("footer.services.delivery") || "Delivery", href: "/services" },
      { name: t("footer.services.warranty") || "Warranty", href: "/services" },
    ],
  }), [t]);

  const socialLinks = useMemo(() => [
    { name: "Facebook", href: "https://facebook.com/chorvadoruz", icon: Facebook, ariaLabel: "Facebook" },
    { name: "Twitter", href: "https://twitter.com/chorvadoruz", icon: Twitter, ariaLabel: "Twitter" },
    { name: "Instagram", href: "https://instagram.com/chorvadoruz", icon: Instagram, ariaLabel: "Instagram" },
    { name: "LinkedIn", href: "https://linkedin.com/company/chorvadoruz", icon: Linkedin, ariaLabel: "LinkedIn" },
    { name: "Telegram", href: "https://t.me/Chorvadortr", icon: Send, ariaLabel: "Telegram" },
  ], []);

  return (
    <footer id="footer" className="bg-primary-dark text-primary-foreground relative" role="contentinfo">
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg z-50">
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      <div className="container-main py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand qismi... */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src="/chorvador_logo.png" alt="Logo" className="w-25 h-14 object-contain" />
            </Link>
            <p className="text-primary-foreground/80 mb-6">{t("footer.description")}</p>
            <ul className="flex gap-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <a href={social.href} target="_blank" className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-white hover:text-primary-dark transition-all">
                    <social.icon className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <nav>
            <h3 className="font-heading font-semibold text-lg mb-4">{t("footer.company.title") || "Company"}</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-primary-foreground/70 hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Dinamik Mahsulot Kategoriyalari */}
          <nav aria-labelledby="footer-products-heading">
            <h3 id="footer-products-heading" className="font-heading font-semibold text-lg mb-4">
              {t("footer.products.title") || "Products"}
            </h3>
            <ul className="space-y-3 list-none">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={`/products?category=${category.id}`}
                      className="text-primary-foreground/70 hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                // Ma'lumot yuklanguncha yoki xato bo'lsa default link
                <li>
                  <Link to="/products" className="text-primary-foreground/70 hover:text-white transition-colors">
                    {t("footer.products.all") || "All Products"}
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Contact qismi... */}
          <address className="not-italic">
            <h3 className="font-heading font-semibold text-lg mb-4">{t("footer.contact.title") || "Contact"}</h3>
            <ul className="space-y-4">
              <li>
                <a href="tel:+998974440016" className="flex items-center gap-3 text-primary-foreground/70 hover:text-white">
                  <Phone className="h-5 w-5" /> <span>+998 97 444 00 16</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@chorvador.uz" className="flex items-center gap-3 text-primary-foreground/70 hover:text-white">
                  <Mail className="h-5 w-5" /> <span>info@chorvador.uz</span>
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
        
        {/* Pastki qism... */}
      </div>
    </footer>
  );
}