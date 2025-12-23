import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Send, Twitter, Linkedin } from "lucide-react";
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

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/sharer.php?u=https://www.chorvador.uz/kontakty.html",
      icon: Facebook,
    },
    {
      name: "Twitter",
      href: "http://twitter.com/share?url=https://www.chorvador.uz/kontakty.html&text=Chorvador.uz",
      icon: Twitter,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/chorvadoruz?igsh=ZnV1a3NzbnRnb3hu",
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      href: "http://www.linkedin.com/shareArticle?mini=true&url=https://www.chorvador.uz/kontakty.html",
      icon: Linkedin,
    },
    {
      name: "Telegram",
      href: "https://t.me/chorvadoruz",
      icon: Send,
    },
  ];

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
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-white hover:text-secondary-foreground transition-all duration-300"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
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
                  href="tel:+998712266596"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  +998 71 226 65 96
                </a>
              </li>
              <li>
                <a
                  href="tel:+998974440016"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  +998 97 444 00 16
                </a>
              </li>
              <li>
                <a
                  href="mailto:chorvador@chorvador.uz"
                  className="flex items-center gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                >
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  chorvador@chorvador.uz
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps?ll=41.350498,69.264383&z=17&t=m&hl=uz&gl=US&mapclient=embed&cid=3984649803725302337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-primary-foreground/70 hover:text-white transition-colors"
                >
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>g.Toshkent, ul. Axmad Universitet 22</span>
                </a>
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