import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductItem } from "./Layout";

interface HeaderProps {
  products: ProductItem[];
  services: ProductItem[];
  productCategories: string[];
  serviceCategories: string[];
  loading?: boolean;
}

const languages: { code: Language; nativeName: string; label: string; flag: string }[] = [
  { code: "uz", nativeName: 'O\'zbekcha', label: "O'zbekcha", flag: "https://flagcdn.com/w40/uz.png" },
  { code: "ru", nativeName: 'Русский', label: "Русский", flag: "https://flagcdn.com/w40/ru.png" },
  { code: "en", nativeName: 'English', label: "English", flag: "https://flagcdn.com/w40/gb.png" },
];

export function Header({ 
  products, 
  services, 
  productCategories,
  serviceCategories,
  loading = false 
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileLangDropdownOpen, setMobileLangDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredServiceCategory, setHoveredServiceCategory] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const productsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentLang = useMemo(
    () => languages.find(l => l.code === language) || languages[0],
    [language]
  );

  // CategoryId bo'yicha mahsulotlarni topish
  const getProductsByCategoryId = useCallback((categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId);
  }, [products]);

  const getServicesByCategoryId = useCallback((categoryId: string) => {
    return services.filter(s => s.categoryId === categoryId);
  }, [services]);

const truncateTitle = (title: string, maxLength: number = 10) => {
  if (!title) return '';
  return title.length > maxLength ? title.substring(0, maxLength) + "..." : title;
  };

  useEffect(() => {
    return () => {
      if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
      if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
      if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    };
  }, []);

  const scrollToFooter = useCallback(() => {
    const footer = document.getElementById('footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setMobileLangDropdownOpen(false);
      }
      if (productsRef.current && !productsRef.current.contains(event.target as Node)) {
        setProductsOpen(false);
        setHoveredCategory(null);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
        setHoveredServiceCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
    setMobileLangDropdownOpen(false);
    setProductsOpen(false);
    setServicesOpen(false);
    setHoveredCategory(null);
    setHoveredServiceCategory(null);
  }, [location.pathname, location.search]);

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

  // TUZATILGAN - categoryId ni topib yuborish
  const handleCategoryClick = useCallback((path: string, categoryName: string) => {
    // Category name bo'yicha categoryId ni topish
    const allProducts = path === '/products' ? products : services;
    const product = allProducts.find(p => p.category === categoryName);
    const categoryId = product?.categoryId || categoryName;
    
    console.log('Category clicked:', categoryName, 'ID:', categoryId);
    
    setProductsOpen(false);
    setServicesOpen(false);
    setMobileMenuOpen(false);
    setHoveredCategory(null);
    setHoveredServiceCategory(null);
    
    // Kategoriya ID sini yuborish
    navigate(`${path}?category=${categoryId}`);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  }, [navigate, products, services]);

  const handleProductClick = useCallback((productId: number, isService: boolean = false) => {
    setProductsOpen(false);
    setServicesOpen(false);
    setMobileMenuOpen(false);
    setHoveredCategory(null);
    setHoveredServiceCategory(null);
    navigate(isService ? `/services/${productId}` : `/products/${productId}`);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  }, [navigate]);

  const handleProductsMouseEnter = () => {
    if (productsTimeoutRef.current) clearTimeout(productsTimeoutRef.current);
    setProductsOpen(true);
    setServicesOpen(false);
  };

  const handleProductsMouseLeave = () => {
    productsTimeoutRef.current = setTimeout(() => {
      setProductsOpen(false);
      setHoveredCategory(null);
    }, 200);
  };

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) clearTimeout(servicesTimeoutRef.current);
    setServicesOpen(true);
    setProductsOpen(false);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
      setHoveredServiceCategory(null);
    }, 200);
  };

  const handleCategoryMouseEnter = (categoryName: string, isService: boolean = false) => {
    if (categoryTimeoutRef.current) clearTimeout(categoryTimeoutRef.current);
    if (isService) {
      setHoveredServiceCategory(categoryName);
    } else {
      setHoveredCategory(categoryName);
    }
  };

  const handleCategoryMouseLeave = (isService: boolean = false) => {
    categoryTimeoutRef.current = setTimeout(() => {
      if (isService) {
        setHoveredServiceCategory(null);
      } else {
        setHoveredCategory(null);
      }
    }, 200);
  };

  return (
    <nav 
      className={cn(
        "sticky top-0 z-50 bg-white border-b border-border w-full transition-shadow duration-300",
        isScrolled && "shadow-md"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
          <div className="h-full bg-primary w-1/2 animate-pulse"></div>
        </div>
      )}
      
      <div className="container-main">
        <div className="flex h-16 items-center justify-between">
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

          <ul 
            className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 list-none"
            role="menubar"
            aria-label="Primary navigation"
          >
            <li role="none">
              <Link
                to="/"
                role="menuitem"
                aria-current={location.pathname === "/" ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  location.pathname === "/" ? "text-white" : "text-gray-700 hover:text-[#2980C7]"
                )}
                style={location.pathname === "/" ? { backgroundColor: '#2980C7' } : {}}
              >
                <span className="relative">{t("nav.home")}</span>
              </Link>
            </li>

            <li role="none">
              <Link
                to="/about"
                role="menuitem"
                aria-current={location.pathname === "/about" ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  location.pathname === "/about" ? "text-white" : "text-gray-700 hover:text-[#2980C7]"
                )}
                style={location.pathname === "/about" ? { backgroundColor: '#2980C7' } : {}}
              >
                <span className="relative">{t("nav.about")}</span>
              </Link>
            </li>

            <li role="none" className="relative">
              <div 
                ref={productsRef}
                onMouseEnter={handleProductsMouseEnter}
                onMouseLeave={handleProductsMouseLeave}
              >
                <Link
                  to="/products"
                  onClick={() => {
                    setProductsOpen(false);
                    setHoveredCategory(null);
                  }}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-1",
                    location.pathname.startsWith("/products") ? "text-white bg-[#2980C7]" : "text-gray-700 hover:text-[#2980C7]"
                  )}
                >
                  <span className="relative">{t("nav.products")}</span>
                  <ChevronDown 
                    className={cn("h-4 w-4 transition-transform duration-300", productsOpen && "rotate-180")} 
                  />
                </Link>

{productsOpen && productCategories.length > 0 && (
  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl min-w-[240px] max-w-[280px] z-[70]">
    <div 
      className="flex flex-col gap-1 p-2 max-h-[450px] overflow-y-auto hide-scrollbar"
      style={{ 
        overflowX: 'visible'
      }}
    >
      {productCategories.map((categoryName, index) => {
        const product = products.find(p => p.category === categoryName);
        const categoryId = product?.categoryId || categoryName;
        const productsInCategory = getProductsByCategoryId(categoryId);
        const hasProducts = productsInCategory.length > 0;
        
        return (
          <div key={index} className="relative group">
            <button
              onClick={() => handleCategoryClick('/products', categoryName)}
              onMouseEnter={() => handleCategoryMouseEnter(categoryName, false)}
              onMouseLeave={() => handleCategoryMouseLeave(false)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-left",
                hoveredCategory === categoryName ? "bg-[#2980C7] text-white" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <span>{truncateTitle(categoryName, 25)}</span>
              {hasProducts && <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />}
            </button>
          </div>
        );
      })}
    </div>

    {/* Nested dropdown */}
    {hoveredCategory && productCategories.map((categoryName, index) => {
      const product = products.find(p => p.category === categoryName);
      const categoryId = product?.categoryId || categoryName;
      const productsInCategory = getProductsByCategoryId(categoryId);
      const hasProducts = productsInCategory.length > 0;

      if (hoveredCategory !== categoryName || !hasProducts) return null;

      return (
        <div
          key={`nested-${index}`}
          className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100]"
          style={{
            marginTop: `${8 + index * 45}px`
          }}
          onMouseEnter={() => handleCategoryMouseEnter(categoryName, false)}
          onMouseLeave={() => handleCategoryMouseLeave(false)}
        >
          <div 
            className={cn(
              "flex flex-col gap-1 p-3",
              productsInCategory.length > 8 && "hide-scrollbar overflow-y-auto"
            )}
            style={{ 
              maxHeight: '460px',
              minWidth: '280px'
            }}
          >
            {productsInCategory.map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                className="w-full px-3 py-2.5 text-sm text-gray-700 hover:text-white hover:bg-[#2980C7] rounded-lg transition-all duration-200 text-left font-medium"
              >
                {truncateTitle(product.title, 20)}
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
)}
              </div>
            </li>

<li role="none" className="relative">
  <div 
    ref={servicesRef}
    onMouseEnter={handleServicesMouseEnter}
    onMouseLeave={handleServicesMouseLeave}
  >
    <Link
      to="/services"
      onClick={() => {
        setServicesOpen(false);
        setHoveredServiceCategory(null);
      }}
      className={cn(
        "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1",
        location.pathname.startsWith("/services") ? "text-white bg-[#2980C7]" : "text-gray-700 hover:text-[#2980C7]"
      )}
    >
      <span>{t("nav.services")}</span>
      <ChevronDown className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} />
    </Link>

{servicesOpen && serviceCategories.length > 0 && (
  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl min-w-[240px] max-w-[280px] z-[70]">
    <div 
      className="flex flex-col gap-1 p-2 max-h-[450px] overflow-y-auto hide-scrollbar"
      style={{ 
        overflowX: 'visible'
      }}
    >
      {serviceCategories.map((categoryName, index) => {
        const service = services.find(s => s.category === categoryName);
        const categoryId = service?.categoryId || categoryName;
        const servicesInCategory = getServicesByCategoryId(categoryId);
        const hasServices = servicesInCategory.length > 0;

        return (
          <div key={index} className="relative group">
            <button
              onClick={() => handleCategoryClick('/services', categoryName)}
              onMouseEnter={() => handleCategoryMouseEnter(categoryName, true)}
              onMouseLeave={() => handleCategoryMouseLeave(true)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-left",
                hoveredServiceCategory === categoryName ? "bg-[#2980C7] text-white" : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <span>{truncateTitle(categoryName, 25)}</span>
              {hasServices && <ChevronRight className="h-4 w-4 ml-2 flex-shrink-0" />}
            </button>
          </div>
        );
      })}
    </div>

    {/* Nested dropdown */}
    {hoveredServiceCategory && serviceCategories.map((categoryName, index) => {
      const service = services.find(s => s.category === categoryName);
      const categoryId = service?.categoryId || categoryName;
      const servicesInCategory = getServicesByCategoryId(categoryId);
      const hasServices = servicesInCategory.length > 0;

      if (hoveredServiceCategory !== categoryName || !hasServices) return null;

      return (
        <div
          key={`nested-service-${index}`}
          className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-[100]"
          style={{
            marginTop: `${8 + index * 45}px`
          }}
          onMouseEnter={() => handleCategoryMouseEnter(categoryName, true)}
          onMouseLeave={() => handleCategoryMouseLeave(true)}
        >
          <div 
            className={cn(
              "flex flex-col gap-1 p-3",
              servicesInCategory.length > 8 && "hide-scrollbar overflow-y-auto"
            )}
            style={{ 
              maxHeight: '460px',
              minWidth: '200px'
            }}
          >
            {servicesInCategory.map((service) => (
              <button
                key={service.id}
                onClick={() => handleProductClick(service.id, true)}
                className="w-full px-3 py-2.5 text-sm text-gray-700 hover:text-white hover:bg-[#2980C7] rounded-lg transition-all duration-200 text-left font-medium"
              >
                {truncateTitle(service.title, 15)}
              </button>
            ))}
          </div>
        </div>
      );
    })}
  </div>
)}
  </div>
</li>

            <li role="none">
              <Link
                to="/contact"
                role="menuitem"
                aria-current={location.pathname === "/contact" ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  location.pathname === "/contact" ? "text-white" : "text-gray-700 hover:text-[#2980C7]"
                )}
                style={location.pathname === "/contact" ? { backgroundColor: '#2980C7' } : {}}
              >
                <span className="relative">{t("nav.contact")}</span>
              </Link>
            </li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative z-[60]" ref={dropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                onKeyDown={(e) => e.key === 'Escape' && setLangDropdownOpen(false)}
                aria-expanded={langDropdownOpen}
                aria-haspopup="true"
                aria-label={`Select language. Current: ${currentLang.nativeName}`}
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
                <span className="text-sm font-medium">{currentLang.nativeName}</span>
                <ChevronDown 
                  className={cn("h-3 w-3 transition-transform duration-300", langDropdownOpen && "rotate-180")} 
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
                        aria-label={`Switch to ${lang.nativeName}`}
                        aria-current={language === lang.code ? "true" : undefined}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary",
                          language === lang.code ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
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
                        <span className="text-xs sm:text-sm font-medium">{lang.nativeName}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-3">
            <div className="relative z-[60]" ref={mobileDropdownRef}>
              <button
                onClick={() => setMobileLangDropdownOpen(!mobileLangDropdownOpen)}
                onKeyDown={(e) => e.key === 'Escape' && setMobileLangDropdownOpen(false)}
                aria-expanded={mobileLangDropdownOpen}
                aria-haspopup="true"
                aria-label={`Select language. Current: ${currentLang.label}`}
                className="flex items-center gap-2 bg-muted/50 hover:bg-muted border border-border rounded-lg px-2 py-1.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
                  className={cn("h-3 w-3 transition-transform duration-300", mobileLangDropdownOpen && "rotate-180")} 
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
                          language === lang.code ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
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
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0 }}
                    role="none"
                  >
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                      aria-current={location.pathname === "/" ? "page" : undefined}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        location.pathname === "/"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {t("nav.home")}
                    </Link>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    role="none"
                  >
                    <Link
                      to="/about"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                      aria-current={location.pathname === "/about" ? "page" : undefined}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        location.pathname === "/about"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {t("nav.about")}
                    </Link>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    role="none"
                  >
                    <Link
                      to="/products"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        location.pathname.startsWith("/products")
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {t("nav.products")}
                    </Link>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    role="none"
                  >
                    <Link
                      to="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        location.pathname.startsWith("/services")
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {t("nav.services")}
                    </Link>
                  </motion.li>

                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    role="none"
                  >
                    <Link
                      to="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      role="menuitem"
                      aria-current={location.pathname === "/contact" ? "page" : undefined}
                      className={cn(
                        "block px-4 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        location.pathname === "/contact"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {t("nav.contact")}
                    </Link>
                  </motion.li>
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

      <style>{`
        body {
          overflow-x: hidden;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </nav>
  );
}