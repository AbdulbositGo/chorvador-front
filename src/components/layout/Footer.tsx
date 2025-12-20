import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Send } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    company: [
      { name: t("footer.company.about"), href: "/about" },
      { name: t("footer.company.services"), href: "/services" },
      { name: t("footer.company.products"), href: "/products" },
      { name: t("footer.company.contact"), href: "/contact" },
    ],
    products: [
      { name: t("footer.products.machinery"), href: "/products?category=texnika" },
      { name: t("footer.products.livestock"), href: "/products?category=chorvachilik" },
      { name: t("footer.products.fertilizers"), href: "/products?category=ogitlar" },
      { name: t("footer.products.seeds"), href: "/products?category=uruglar" },
    ],
    services: [
      { name: t("footer.services.technical"), href: "/services" },
      { name: t("footer.services.consulting"), href: "/services" },
      { name: t("footer.services.delivery"), href: "/services" },
      { name: t("footer.services.warranty"), href: "/services" },
    ],
  };

  return (
    <footer id="footer" className="bg-primary-dark text-primary-foreground">
      <div className="container-main py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="/chorvador_logo.png" 
                alt="Chorvador.uz Logo" 
                className="w-25 h-14 object-contain"
              />
            </Link>
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              {t("footer.description")}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-white hover:text-secondary-foreground transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-white hover:text-secondary-foreground transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-white hover:text-secondary-foreground transition-all duration-300"
                aria-label="Telegram"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t("footer.company.title")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t("footer.products.title")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">
              {t("footer.contact.title")}
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+998901234567"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  +998 90 123 45 67
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@chorvador.uz"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  info@chorvador.uz
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-primary-foreground/70">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  {t("footer.contact.address")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            {t("footer.copyright")}
          </p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="text-primary-foreground/60 hover:text-white transition-colors">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms" className="text-primary-foreground/60 hover:text-white transition-colors">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}