import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

// Phone validation patterns for top 10 countries
const PHONE_PATTERNS = {
  UZ: { pattern: /^(\+998|998)?\s*\d{2}\s*\d{3}\s*\d{2}\s*\d{2}$/, format: '+998 XX XXX XX XX' },
  US: { pattern: /^(\+1|1)?\s*\(?\d{3}\)?\s*\d{3}\s*\d{4}$/, format: '+1 (XXX) XXX-XXXX' },
  CN: { pattern: /^(\+86|86)?\s*1\d{10}$/, format: '+86 1XX XXXX XXXX' },
  IN: { pattern: /^(\+91|91)?\s*[6-9]\d{9}$/, format: '+91 XXXXX XXXXX' },
  RU: { pattern: /^(\+7|7|8)?\s*\(?\d{3}\)?\s*\d{3}\s*\d{2}\s*\d{2}$/, format: '+7 (XXX) XXX-XX-XX' },
  BR: { pattern: /^(\+55|55)?\s*\(?\d{2}\)?\s*9?\d{4}\s*\d{4}$/, format: '+55 (XX) 9XXXX-XXXX' },
  GB: { pattern: /^(\+44|44)?\s*\d{4}\s*\d{6}$/, format: '+44 XXXX XXXXXX' },
  TR: { pattern: /^(\+90|90)?\s*\(?\d{3}\)?\s*\d{3}\s*\d{2}\s*\d{2}$/, format: '+90 (XXX) XXX XX XX' },
  DE: { pattern: /^(\+49|49)?\s*\d{3,4}\s*\d{7,8}$/, format: '+49 XXX XXXXXXXX' },
  KZ: { pattern: /^(\+7|7)?\s*\(?\d{3}\)?\s*\d{3}\s*\d{2}\s*\d{2}$/, format: '+7 (XXX) XXX-XX-XX' }
};

const detectCountry = (phone: string): string | null => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('998')) return 'UZ';
  if (cleaned.startsWith('1')) return 'US';
  if (cleaned.startsWith('86')) return 'CN';
  if (cleaned.startsWith('91')) return 'IN';
  if (cleaned.startsWith('7')) return 'RU';
  if (cleaned.startsWith('55')) return 'BR';
  if (cleaned.startsWith('44')) return 'GB';
  if (cleaned.startsWith('90')) return 'TR';
  if (cleaned.startsWith('49')) return 'DE';
  
  return null;
};

const formatPhoneNumber = (phone: string, country: string | null): string => {
  if (!country || !PHONE_PATTERNS[country]) return phone;
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (country === 'UZ') {
    const match = cleaned.match(/^(998)?(\d{2})(\d{3})(\d{2})(\d{2})$/);
    if (match) return `+998 ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
  } else if (country === 'US') {
    const match = cleaned.match(/^(1)?(\d{3})(\d{3})(\d{4})$/);
    if (match) return `+1 (${match[2]}) ${match[3]}-${match[4]}`;
  } else if (country === 'CN') {
    const match = cleaned.match(/^(86)?(1\d{2})(\d{4})(\d{4})$/);
    if (match) return `+86 ${match[2]} ${match[3]} ${match[4]}`;
  } else if (country === 'IN') {
    const match = cleaned.match(/^(91)?([6-9]\d{4})(\d{5})$/);
    if (match) return `+91 ${match[2]} ${match[3]}`;
  } else if (country === 'RU' || country === 'KZ') {
    const match = cleaned.match(/^(7)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) return `+7 (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
  } else if (country === 'BR') {
    const match = cleaned.match(/^(55)?(\d{2})(9?\d{4})(\d{4})$/);
    if (match) return `+55 (${match[2]}) ${match[3]}-${match[4]}`;
  } else if (country === 'GB') {
    const match = cleaned.match(/^(44)?(\d{4})(\d{6})$/);
    if (match) return `+44 ${match[2]} ${match[3]}`;
  } else if (country === 'TR') {
    const match = cleaned.match(/^(90)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) return `+90 (${match[2]}) ${match[3]} ${match[4]} ${match[5]}`;
  } else if (country === 'DE') {
    const match = cleaned.match(/^(49)?(\d{3,4})(\d{7,8})$/);
    if (match) return `+49 ${match[2]} ${match[3]}`;
  }
  
  return phone;
};

const validatePhone = (phone: string): boolean => {
  const country = detectCountry(phone);
  if (!country || !PHONE_PATTERNS[country]) return false;
  
  const cleaned = phone.replace(/\D/g, '');
  return PHONE_PATTERNS[country].pattern.test(phone) || PHONE_PATTERNS[country].pattern.test(cleaned);
};

interface PhoneNumber {
  value: string;
  link: string;
}

interface ContactItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value?: string;
  link?: string;
  isPhoneGrid?: boolean;
}

interface ContactInfoCardProps {
  item: ContactItem;
  index: number;
  phoneNumbers: PhoneNumber[];
}

// Memoized ContactInfoCard component
const ContactInfoCard = memo(({ item, index, phoneNumbers }: ContactInfoCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border group cursor-default lazy-animate opacity-0 translate-y-5 hover:translate-x-2 transition-all duration-300"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform will-change-transform">
        <item.icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground mb-1">
          {item.title}
        </h3>
        {item.isPhoneGrid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {phoneNumbers.map((phone: PhoneNumber, phoneIdx: number) => (
              <a
                key={phoneIdx}
                href={phone.link}
                className="flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:text-white transition-all p-3 rounded-lg border border-border hover:border-primary hover:bg-primary hover:shadow-md"
              >
                <Phone className="w-4 h-4" />
                {phone.value}
              </a>
            ))}
          </div>
        ) : item.link ? (
          <a 
            href={item.link} 
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            {item.value}
          </a>
        ) : (
          <p className="text-muted-foreground whitespace-pre-line">
            {item.value}
          </p>
        )}
      </div>
    </div>
  );
});

ContactInfoCard.displayName = 'ContactInfoCard';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    text: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const siteName = "Chorvador.uz";
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : "https://yourwebsite.com";

  // Memoized SEO data
  const seoData = {
    pageTitle: language === 'uz' 
      ? 'Bog\'lanish' 
      : language === 'ru' 
      ? 'Контакты' 
      : 'Contact',
    pageDescription: language === 'uz'
      ? 'Biz bilan bog\'laning. Savollaringiz bormi? Biz sizga yordam berishga tayyormiz.'
      : language === 'ru'
      ? 'Свяжитесь с нами. Есть вопросы? Мы готовы помочь вам.'
      : 'Contact us. Have questions? We are ready to help you.',
    currentUrl: `${siteUrl}/${language}/contact`
  };

  // Lazy load map with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !mapLoaded) {
            setMapLoaded(true);
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    return () => observer.disconnect();
  }, [mapLoaded]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const country = detectCountry(value);
    
    setDetectedCountry(country);
    
    if (value.length > 3) {
      const isValid = validatePhone(value);
      setPhoneValid(isValid);
    } else {
      setPhoneValid(null);
    }
    
    setFormData({ ...formData, phone: value });
  };

  const handlePhoneBlur = () => {
    if (formData.phone && detectedCountry) {
      const formatted = formatPhoneNumber(formData.phone, detectedCountry);
      setFormData({ ...formData, phone: formatted });
    }
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error(
        language === 'uz' 
          ? "Iltimos, ismingizni kiriting" 
          : language === 'ru'
          ? "Пожалуйста, введите ваше имя"
          : "Please enter your name",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error(
        language === 'uz' 
          ? "Telefon raqamini to'g'ri formatda kiriting" 
          : language === 'ru'
          ? "Введите номер телефона в правильном формате"
          : "Please enter phone number in correct format",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    if (!formData.text.trim()) {
      toast.error(
        language === 'uz' 
          ? "Iltimos, xabar matnini kiriting" 
          : language === 'ru'
          ? "Пожалуйста, введите текст сообщения"
          : "Please enter message text",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    setIsSubmitting(true);

    const API_URL = import.meta.env.VITE_API_URL || "";
    fetch(`${API_URL}/send/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) throw new Error("Server error");
        return response.json();
      })
      .then(() => {
        toast.success(
          language === 'uz'
            ? "Xabaringiz muvaffaqiyatli yuborildi!"
            : language === 'ru'
            ? "Ваше сообщение успешно отправлено!"
            : "Your message has been sent successfully!",
          { position: "top-right", autoClose: 5000 }
        );
        setFormData({ full_name: "", phone: "", text: "" });
        setPhoneValid(null);
        setDetectedCountry(null);
      })
      .catch(() => {
        toast.error(
          language === 'uz'
            ? "Xabar yuborishda xatolik yuz berdi"
            : language === 'ru'
            ? "Произошла ошибка при отправке сообщения"
            : "An error occurred while sending the message",
          { position: "top-right", autoClose: 4000 }
        );
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [formData, language]);

  const phoneNumbers: PhoneNumber[] = [
    { value: "+998 91 192-07-55", link: "tel:+998911920755" },
    { value: "+998 97 444 00 16", link: "tel:+998974440016" },
    { value: "+998 97 157 16 98", link: "tel:+998971571698" },
    { value: "+998 94 647 10 03", link: "tel:+998946471003" },
  ];

  const contactInfo: ContactItem[] = [
    { 
      icon: MapPin, 
      title: t("contact.address.title"), 
      value: t("contact.address.value") 
    },
    { 
      icon: Phone, 
      title: t("contact.phone.title"), 
      isPhoneGrid: true
    },
    { 
      icon: Mail, 
      title: t("contact.email.title"), 
      value: "info@chorvador.uz", 
      link: "mailto:info@chorvador.uz" 
    },
    { 
      icon: Clock, 
      title: t("contact.hours.title"), 
      value: t("contact.hours.value") 
    },
  ];

  return (
    <Layout>
      <Helmet>
        <html lang={language} />
        <title>{seoData.pageTitle} | {siteName}</title>
        <meta name="description" content={seoData.pageDescription} />
        <link rel="canonical" href={seoData.currentUrl} />
        
        {/* Alternate Languages */}
        <link rel="alternate" hrefLang="uz" href={`${siteUrl}/uz/contact`} />
        <link rel="alternate" hrefLang="ru" href={`${siteUrl}/ru/contact`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}/en/contact`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${seoData.pageTitle} | ${siteName}`} />
        <meta property="og:description" content={seoData.pageDescription} />
        <meta property="og:url" content={seoData.currentUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/80 py-6 sm:py-8 lg:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
              {t("contact.title")}
            </h1>
            <p className="text-base sm:text-lg text-primary-foreground/90 leading-relaxed line-clamp-2 min-h-[3.5rem]">
              {t("contact.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container-main px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            
            {/* Contact Form */}
            <div className="order-1 lg:order-1">
              <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  {t("contact.form.title")}
                </h2>
                
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("contact.form.name")} *
                    </label>
                    <Input
                      required
                      placeholder={t("contact.form.namePlaceholder")}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className="h-12 bg-background border-border focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("contact.form.phone")} *
                    </label>
                    <div className="relative">
                      <Input
                        required
                        type="tel"
                        placeholder="+998 97 444 00 16"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onBlur={handlePhoneBlur}
                        className={`h-12 bg-background border-border focus:ring-1 transition-all pr-10 ${
                          phoneValid === true ? 'border-green-500 focus:ring-green-500' : 
                          phoneValid === false ? 'border-red-500 focus:ring-red-500' : 
                          'focus:ring-primary'
                        }`}
                      />
                      {phoneValid !== null && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {phoneValid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {detectedCountry && (
                      <p className="text-xs text-muted-foreground">
                        {language === 'uz' ? 'Format:' : language === 'ru' ? 'Формат:' : 'Format:'} {PHONE_PATTERNS[detectedCountry]?.format}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t("contact.form.message")} *
                    </label>
                    <Textarea
                      required
                      placeholder={t("contact.form.messagePlaceholder")}
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      className="min-h-[150px] bg-background border-border focus:ring-1 focus:ring-primary transition-all resize-none"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    size="lg"
                    className="w-full h-12 font-bold active:scale-[0.98] transition-transform shadow-sm"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        {t("contact.form.submit")}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="order-2 lg:order-2 flex flex-col h-full">
              <div className="lg:pl-6 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                  {t("contact.info.title")}
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                  {t("contact.info.subtitle")}
                </p>
              </div>

              <div className="grid gap-4 md:gap-6 lg:pl-6 flex-1">
                {contactInfo.map((item, idx) => (
                  <ContactInfoCard 
                    key={idx}
                    item={item}
                    index={idx}
                    phoneNumbers={phoneNumbers}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Map Section - Lazy Loaded */}
          <div className="mt-16 md:mt-24" ref={mapRef}>
            <div className="rounded-3xl overflow-hidden shadow-lg border border-border relative w-full h-[350px] md:h-[500px] hover:shadow-xl transition-shadow duration-300">
              {mapLoaded ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1497.542603852809!2d69.26199674606329!3d41.35050164413911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d118e2bc4cf%3A0x374c51e289606a41!2sChorvador%20uz!5e0!3m2!1suz!2s!4v1766405927730!5m2!1suz!2s"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .lazy-animate.animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .will-change-transform {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .gradient-hero,
        .lazy-animate {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }

        input, textarea {
          will-change: auto;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </Layout>
  );
};

export default Contact;