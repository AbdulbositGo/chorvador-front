import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL || "https://api.example.com";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface CategoryObject {
  id: number;
  name?: string;
}

interface Product {
  id: number;
  title: string;
  category: number | CategoryObject;
  category_id?: number;
}

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
  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [serviceCategories, setServiceCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [hoveredCategoryId, setHoveredCategoryId] = useState<number | null>(null);
  const [hoveredServiceCategoryId, setHoveredServiceCategoryId] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const currentLang = useMemo(
    () => languages.find(l => l.code === language) || languages[0],
    [language]
  );

  useEffect(() => {
    const fetchData = async () => {
      const acceptLanguage = language; 

      try {
        const headers = {
          'Accept-Language': acceptLanguage,
          'Content-Type': 'application/json'
        };

        const [productsRes, servicesRes, allProductsRes, allServicesRes] = await Promise.all([
          fetch(`${apiUrl}/categories/?type=product`, { headers }),
          fetch(`${apiUrl}/categories/?type=service`, { headers }),
          fetch(`${apiUrl}/products/`, { headers }),
          fetch(`${apiUrl}/services/`, { headers })
        ]);
        
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setProductCategories(Array.isArray(productsData) ? productsData : []);
        }
        
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServiceCategories(Array.isArray(servicesData) ? servicesData : []);
        }

        if (allProductsRes.ok) {
          const allProducts = await allProductsRes.json();
          const productsArray = Array.isArray(allProducts) ? allProducts : (allProducts.results || []);
          setProducts(productsArray);
        }

        if (allServicesRes.ok) {
          const allServicesData = await allServicesRes.json();
          const servicesArray = Array.isArray(allServicesData) ? allServicesData : (allServicesData.results || []);
          setServices(servicesArray);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, [language]);

  const getProductsByCategory = useCallback((categoryId: number) => {
    const categoryName = productCategories.find(c => c.id === categoryId)?.name;
    
    if (!categoryName) return [];

    return products.filter(product => {
      const pCat = product.category;
      if (typeof pCat === 'string') {
        return pCat === categoryName;
      }
      if (typeof pCat === 'object' && pCat !== null) {
        return (pCat as CategoryObject).id === categoryId || pCat.name === categoryName;
      }
      return false;
    });
  }, [products, productCategories]);

  const getServicesByCategory = useCallback((categoryId: number) => {
    const categoryObject = serviceCategories.find(c => c.id === categoryId);
    if (!categoryObject) return [];

    const categoryName = categoryObject.name;

    return services.filter(service => {
      const sCat = service.category;
      
      if (typeof sCat === 'string') {
        return sCat === categoryName;
      }
      
      if (typeof sCat === 'object' && sCat !== null) {
        const catObj = sCat as CategoryObject;
        return catObj.id === categoryId || catObj.name === categoryName;
      }

      if (typeof sCat === 'number') {
        return sCat === categoryId;
      }

      return service.category_id === categoryId;
    });
  }, [services, serviceCategories]);

  const scrollToFooter = useCallback(() => {
    const footer = document.getElementById('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
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
        setHoveredCategoryId(null);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
        setHoveredServiceCategoryId(null);
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
    setMobileProductsOpen(false);
    setMobileServicesOpen(false);
    setHoveredCategoryId(null);
    setHoveredServiceCategoryId(null);
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

  const handleCategoryClick = useCallback((path: string, categoryId: number) => {
    setProductsOpen(false);
    setServicesOpen(false);
    setMobileProductsOpen(false);
    setMobileServicesOpen(false);
    setMobileMenuOpen(false);
    setHoveredCategoryId(null);
    setHoveredServiceCategoryId(null);
    navigate(`${path}?category=${categoryId}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, [navigate]);

  // Title ni 30 belgidan keyin qirqish
  const truncateTitle = (title: string) => {
    return title.length > 25 ? title.substring(0, 25) + "..." : title;
  };

  const handleProductClick = useCallback((productId: number, isService: boolean = false) => {
    setProductsOpen(false);
    setServicesOpen(false);
    setMobileProductsOpen(false);
    setMobileServicesOpen(false);
    setMobileMenuOpen(false);
    setHoveredCategoryId(null);
    setHoveredServiceCategoryId(null);
    navigate(isService ? `/services/${productId}` : `/products/${productId}`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, [navigate]);

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
                  location.pathname === "/"
                    ? "text-white"
                    : "text-gray-700 hover:text-[#2980C7]"
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
                  location.pathname === "/about"
                    ? "text-white"
                    : "text-gray-700 hover:text-[#2980C7]"
                )}
                style={location.pathname === "/about" ? { backgroundColor: '#2980C7' } : {}}
              >
                <span className="relative">{t("nav.about")}</span>
              </Link>
            </li>

            {/* Products Dropdown - Desktop */}
            <li role="none" className="relative">
              <div 
                ref={productsRef}
                onMouseEnter={() => {
                  setProductsOpen(true);
                  setServicesOpen(false);
                }}
                onMouseLeave={() => {
                  setProductsOpen(false);
                  setHoveredCategoryId(null);
                }}
              >
                <Link
                  to="/products"
                  onClick={() => {
                    setProductsOpen(false);
                    setHoveredCategoryId(null);
                  }}
                  aria-expanded={productsOpen}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center gap-1",
                    location.pathname.startsWith("/products")
                      ? "text-white"
                      : "text-gray-700 hover:text-[#2980C7]"
                  )}
                  style={location.pathname.startsWith("/products") ? { backgroundColor: '#2980C7' } : {}}
                >
                  <span className="relative">{t("nav.products")}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      productsOpen && "rotate-180"
                    )} 
                    aria-hidden="true"
                  />
                </Link>

                <AnimatePresence>
                  {productsOpen && productCategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="absolute top-full mt-2 z-[70] flex gap-3"
                      style={{ 
                        left: '-40%',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {/* Kategoriyalar - Alohida karta */}
                      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[300px] max-w-[350px]">
                        <div className="flex flex-col gap-2">
                          {productCategories.map((category) => {
                            const productsInCategory = getProductsByCategory(category.id);
                            const hasProducts = productsInCategory.length > 0;
                            
                            return (
                              <button
                                key={category.id}
                                onClick={() => handleCategoryClick('/products', category.id)}
                                onMouseEnter={() => setHoveredCategoryId(category.id)}
                                className="w-full group relative px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 border border-transparent flex items-center justify-between"
                                style={{
                                  backgroundColor: hoveredCategoryId === category.id ? '#2980C7' : 'transparent',
                                  color: hoveredCategoryId === category.id ? 'white' : '#374151'
                                }}
                              >
                                <span className="relative z-10 block flex-1 text-left">{category.name}</span>
                                {hasProducts && (
                                  <ChevronRight 
                                    className="h-4 w-4 ml-2 flex-shrink-0" 
                                    style={{
                                      color: hoveredCategoryId === category.id ? 'white' : '#9ca3af'
                                    }}
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mahsulotlar ro'yxati - Alohida karta */}
                      <AnimatePresence>
                        {hoveredCategoryId && getProductsByCategory(hoveredCategoryId).length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-[280px] max-w-[400px] max-h-[150px] min-h-[100px]"
                            onMouseEnter={() => setHoveredCategoryId(hoveredCategoryId)}
                          >
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                              {productCategories.find(c => c.id === hoveredCategoryId)?.name}
                            </h3>
                            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
                              {getProductsByCategory(hoveredCategoryId).map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleProductClick(product.id)}
                                  className="w-full px-3 py-2.5 text-sm text-gray-700 hover:text-white hover:bg-[#2980C7] rounded-lg transition-all duration-200 text-left font-medium"
                                >
                                  {truncateTitle(product.title)}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>

            {/* Services Dropdown - Desktop */}
            <li role="none" className="relative">
              <div 
                ref={servicesRef}
                onMouseEnter={() => {
                  setServicesOpen(true);
                  setProductsOpen(false);
                }}
                onMouseLeave={() => {
                  setServicesOpen(false);
                  setHoveredServiceCategoryId(null);
                }}
                className="py-2"
              >
                <Link
                  to="/services"
                  onClick={() => {
                    setServicesOpen(false);
                    setHoveredServiceCategoryId(null);
                  }}
                  aria-expanded={servicesOpen}
                  className={cn(
                    "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-1",
                    location.pathname.startsWith("/services")
                      ? "text-white bg-[#2980C7]"
                      : "text-gray-700 hover:text-[#2980C7]"
                  )}
                >
                  <span>{t("nav.services")}</span>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-300",
                      servicesOpen && "rotate-180"
                    )} 
                  />
                </Link>

                <AnimatePresence>
                  {servicesOpen && serviceCategories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 z-[70] flex gap-3"
                      style={{ transform: 'translateX(-20%)' }}
                    >
                      {/* Kategoriyalar - Alohida karta */}
                      <div className="bg-white border border-gray-200 rounded-xl shadow-2xl p-3 min-w-[200px] max-w-[250px] h-[110px]">
                        <div className="flex flex-col gap-1">
                          {serviceCategories.map((category) => (
                            <button
                              key={category.id}
                              onMouseEnter={() => setHoveredServiceCategoryId(category.id)}
                              onClick={() => handleCategoryClick('/services', category.id)}
                              className={cn(
                                "w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                hoveredServiceCategoryId === category.id 
                                  ? "bg-[#2980C7] text-white" 
                                  : "text-gray-700 hover:bg-gray-100"
                              )}
                            >
                              <span className="truncate mr-2">{category.name}</span>
                              <ChevronRight className={cn(
                                "h-4 w-4 flex-shrink-0 transition-transform",
                                hoveredServiceCategoryId === category.id ? "translate-x-1" : "text-gray-400"
                              )} />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Xizmatlar ro'yxati - Alohida karta */}
                      <AnimatePresence mode="wait">
                        {hoveredServiceCategoryId && (
                          <motion.div
                            key={hoveredServiceCategoryId}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="bg-white border border-gray-200 rounded-xl shadow-2xl p-3 min-w-[240px] max-w-[320px]"
                          >
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">
                              {serviceCategories.find(c => c.id === hoveredServiceCategoryId)?.name}
                            </h3>
                            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto">
                              {getServicesByCategory(hoveredServiceCategoryId).length > 0 ? (
                                getServicesByCategory(hoveredServiceCategoryId).map((service) => (
                                  <button
                                    key={service.id}
                                    onClick={() => handleProductClick(service.id, true)}
                                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-white hover:bg-[#2980C7] rounded-lg transition-all duration-200 text-left whitespace-normal leading-tight"
                                  >
                                    {truncateTitle(service.title)}
                                  </button>
                                ))
                              ) : (
                                <div className="px-4 py-3 text-xs text-gray-400 italic">
                                  {t("no_items_found")}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>

            <li role="none">
              <Link
                to="/contact"
                role="menuitem"
                aria-current={location.pathname === "/contact" ? "page" : undefined}
                className={cn(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  location.pathname === "/contact"
                    ? "text-white"
                    : "text-gray-700 hover:text-[#2980C7]"
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

            <Button 
              onClick={scrollToFooter} 
              size="sm"
              aria-label="Scroll to contact section"
            >
              {t("nav.contact")}
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-2">
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

        {/* Mobile Menu */}
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

                  {/* Mobile Products - Oddiy menyu sifatida */}
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

                  {/* Mobile Services - Oddiy menyu sifatida */}
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
    </nav>
  );
}