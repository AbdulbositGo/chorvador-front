import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const navigation = [
  { key: "nav.home", href: "/" },
  { key: "nav.about", href: "/about" },
  { key: "nav.products", href: "/products" },
  { key: "nav.services", href: "/services" },
  { key: "nav.contact", href: "/contact" },
];

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "uz", label: "O'zbekcha", flag: "https://flagcdn.com/w40/uz.png" },
  { code: "ru", label: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/gb.png" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = useMemo(
    () => languages.find(l => l.code === language) || languages[0],
    [language]
  );

  const scrollToFooter = useCallback(() => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  }, []);

  // Handle scroll for shadow effect - optimized with RAF
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setMobileLangDropdownOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Keyboard navigation for dropdowns
  const handleLanguageKeyDown = useCallback((e: React.KeyboardEvent, langCode: Language) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setLanguage(langCode);
      setLangDropdownOpen(false);
      setMobileLangDropdownOpen(false);
    } else if (e.key === 'Escape') {
      setLangDropdownOpen(false);
      setMobileLangDropdownOpen(false);
    }
  }, [setLanguage]);

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 bg-white border-b border-border w-full transition-shadow duration-300",
        isScrolled && "shadow-md"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-main">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            aria-label="Chorvador home page"
          >
            <motion.img
              src="/chorvador_logo.png"
              alt="Chorvador logo"
              className="h-10 sm:h-12 w-auto object-contain"
              width="120"
              height="48"
              loading="eager"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            />
          </Link>

          {/* Desktop navigation - centered */}
          <ul 
            className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 list-none"
            role="menubar"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <li key={item.key} role="none">
                <Link
                  to={item.href}
                  role="menuitem"
                  aria-current={location.pathname === item.href ? "page" : undefined}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <span className="relative">{t(item.key)}</span>
                  {location.pathname === item.href && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right side - Language Dropdown + Contact Button */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Dropdown - Desktop */}
            <div className="relative z-[60]" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                onKeyDown={(e) => e.key === 'Escape' && setLangDropdownOpen(false)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                aria-label={`Select language. Current: ${currentLang.label}`}
                className="flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border rounded-lg px-3 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img 
                  src={currentLang.flag} 
                  alt="" 
                  className="w-5 h-4 object-cover rounded-sm"
                  width="20"
                  height="16"
                  loading="lazy"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium" aria-hidden="true">
                  {currentLang.code.toUpperCase()}
                </span>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    langDropdownOpen && "rotate-180"
                  )} 
                  aria-hidden="true"
                />
              </button>
              
              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    role="menu"
                    aria-label="Language options"
                    className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-xl min-w-[160px] overflow-hidden z-[70]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        onKeyDown={(e) => handleLanguageKeyDown(e, lang.code)}
                        role="menuitem"
                        aria-label={`Switch to ${lang.label}`}
                        aria-current={language === lang.code ? "true" : undefined}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                          language === lang.code 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <img 
                          src={lang.flag} 
                          alt="" 
                          className="w-6 h-4 object-cover rounded-sm"
                          width="24"
                          height="16"
                          loading="lazy"
                          aria-hidden="true"
                        />
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Button */}
            <Button 
              onClick={scrollToFooter} 
              size="sm"
              aria-label="Scroll to contact section"
            >
              {t("nav.contact")}
            </Button>
          </div>

          {/* Mobile/Tablet controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Language Dropdown */}
            <div className="relative z-[60]" ref={mobileDropdownRef}>
              <button
                onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
                onKeyDown={(e) => e.key === 'Escape' && setMobileLangDropdownOpen(false)}
                aria-expanded={mobileLangDropdownOpen}
                aria-haspopup="true"
                aria-label={`Select language. Current: ${currentLang.label}`}
                className="flex items-center gap-1 bg-muted/50 hover:bg-muted border border-border rounded-lg px-2 py-1.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <img 
                  src={currentLang.flag} 
                  alt="" 
                  className="w-5 h-4 object-cover rounded-sm"
                  width="20"
                  height="16"
                  loading="lazy"
                  aria-hidden="true"
                />
                <ChevronDown 
                  className={cn(
                    "h-3 w-3 transition-transform duration-300",
                    mobileLangDropdownOpen && "rotate-180"
                  )} 
                  aria-hidden="true"
                />
              </button>
              
              <AnimatePresence>
                {mobileLangDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    role="menu"
                    aria-label="Language options"
                    className="absolute right-0 top-full mt-2 bg-card border border-border rounded-lg shadow-xl min-w-[140px] overflow-hidden z-[70]"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setMobileLangDropdownOpen(false);
                        }}
                        onKeyDown={(e) => handleLanguageKeyDown(e, lang.code)}
                        role="menuitem"
                        aria-label={`Switch to ${lang.label}`}
                        aria-current={language === lang.code ? "true" : undefined}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                          language === lang.code 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <img 
                          src={lang.flag} 
                          alt="" 
                          className="w-5 h-4 object-cover rounded-sm"
                          width="20"
                          height="16"
                          loading="lazy"
                          aria-hidden="true"
                        />
                        <span className="text-xs sm:text-sm">{lang.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Mobile menu button */}
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile/Tablet menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-border"
              role="menu"
              aria-label="Mobile navigation"
            >
              <nav className="py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <ul className="flex flex-col gap-2 list-none">
                  {navigation.map((item, index) => (
                    <motion.li
                      key={item.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      role="none"
                    >
                      <Link
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        role="menuitem"
                        aria-current={location.pathname === item.href ? "page" : undefined}
                        className={cn(
                          "block px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                          location.pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                      >
                        {t(item.key)}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <motion.div 
                  className="mt-4 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    className="w-full" 
                    onClick={scrollToFooter}
                    aria-label="Scroll to contact section"
                  >
                    {t("nav.contact")}
                  </Button>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}