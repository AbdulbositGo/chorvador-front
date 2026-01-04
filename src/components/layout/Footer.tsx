import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Twitter, Linkedin, ArrowUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useMemo, useCallback } from "react";

export function Footer() {
  const { t } = useLanguage();
  const [showScrollTop, setShowScrollTop] = useState(false);

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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const footerLinks = useMemo(() => ({
    company: [
      { name: t("footer.company.about") || "About", href: "/about" },
      { name: t("footer.company.services") || "Services", href: "/services" },
      { name: t("footer.company.products") || "Products", href: "/products" },
      { name: t("footer.company.contact") || "Contact", href: "/contact" },
    ],
    products: [
      { name: t("footer.products.livestock") || "Livestock", href: "/products?category=chorvachilik" },
    ],
    services: [
      { name: t("footer.services.technical") || "Technical Support", href: "/services" },
      { name: t("footer.services.consulting") || "Consulting", href: "/services" },
      { name: t("footer.services.delivery") || "Delivery", href: "/services" },
      { name: t("footer.services.warranty") || "Warranty", href: "/services" },
    ],
  }), [t]);

  const socialLinks = useMemo(() => [
    {
      name: "Facebook",
      href: "https://www.facebook.com/sharer.php?u=https://www.chorvador.uz/kontakty.html",
      icon: Facebook,
      ariaLabel: "Visit our Facebook page"
    },
    {
      name: "Twitter",
      href: "http://twitter.com/share?url=https://www.chorvador.uz/kontakty.html&text=Chorvador.uz",
      icon: Twitter,
      ariaLabel: "Follow us on Twitter"
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/chorvadoruz",
      icon: Instagram,
      ariaLabel: "Follow us on Instagram"
    },
    {
      name: "LinkedIn",
      href: "http://www.linkedin.com/shareArticle?mini=true&url=https://www.chorvador.uz/kontakty.html",
      icon: Linkedin,
      ariaLabel: "Connect on LinkedIn"
    },
    {
      name: "Telegram",
      href: "https://t.me/chorvadoruz",
      icon: Send,
      ariaLabel: "Join our Telegram channel"
    },
  ], []);

  return (
    <footer 
      id="footer" 
      className="bg-primary-dark text-primary-foreground relative"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark"
          aria-label="Scroll to top of page"
        >
          <ArrowUp className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      <div className="container-main py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link 
              to="/" 
              className="flex items-center gap-3 mb-6 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded-lg"
              aria-label="Chorvador home page"
            >
              <img 
                src="/chorvador_logo.png" 
                alt="Chorvador logo" 
                className="w-25 h-14 object-contain"
                width="100"
                height="56"
                loading="lazy"
              />
            </Link>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              {t("footer.description") || "Your trusted partner in agriculture"}
            </p>
            
            {/* Social Links */}
            <nav aria-label="Social media links">
              <ul className="flex gap-3 flex-wrap list-none">
                {socialLinks.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-white hover:text-secondary-foreground transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark"
                      aria-label={social.ariaLabel}
                    >
                      <social.icon className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Company Links */}
          <nav aria-labelledby="footer-company-heading">
            <h3 
              id="footer-company-heading"
              className="font-heading font-semibold text-lg mb-4"
            >
              {t("footer.company.title") || "Company"}
            </h3>
            <ul className="space-y-3 list-none">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Products Links */}
          <nav aria-labelledby="footer-products-heading">
            <h3 
              id="footer-products-heading"
              className="font-heading font-semibold text-lg mb-4"
            >
              {t("footer.products.title") || "Products"}
            </h3>
            <ul className="space-y-3 list-none">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <address 
            className="not-italic"
            aria-labelledby="footer-contact-heading"
          >
            <h3 
              id="footer-contact-heading"
              className="font-heading font-semibold text-lg mb-4"
            >
              {t("footer.contact.title") || "Contact"}
            </h3>
            <ul className="space-y-4 list-none">
              <li>
                <a
                  href="tel:+998974440016"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded"
                  aria-label="Call us at +998 97 444 00 16"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>+998 97 444 00 16</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@chorvador.uz"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded"
                  aria-label="Email us at info@chorvador.uz"
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

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            {t("footer.copyright") || "© 2024 Chorvador. All rights reserved."}
          </p>
          <nav aria-label="Legal links">
            <ul className="flex gap-6 text-sm list-none">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-primary-foreground/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded"
                >
                  {t("footer.privacy") || "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-primary-foreground/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-dark rounded"
                >
                  {t("footer.terms") || "Terms of Service"}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}