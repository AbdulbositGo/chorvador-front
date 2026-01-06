// ServiceDetail.tsx - Image fixed version
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Phone, Mail, MapPin, Clock, Shield, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Helmet } from "react-helmet-async";

interface Service {
    id: number;
    title: string;
    short_description: string;
    description: string;
    image: string;
    category: string;
}

interface Benefit {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
}

const ServiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const siteName = "Chorvador.uz";
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : "https://yourwebsite.com";

    const seoData = useMemo(() => {
        if (!service) return null;
        return {
            pageTitle: service.title,
            pageDescription: service.short_description,
            currentUrl: `${siteUrl}/${language}/services/${id}`,
            imageUrl: service.image
        };
    }, [service, language, siteUrl, id]);

    const benefits: Benefit[] = useMemo(() => [
        {
            icon: Shield,
            title: language === 'uz' ? 'Sifat kafolati' : language === 'ru' ? 'Гарантия качества' : 'Quality Guarantee',
            description: language === 'uz' ? '100% sifatli xizmat' : language === 'ru' ? '100% качество' : '100% Quality'
        },
        {
            icon: Clock,
            title: language === 'uz' ? 'Tez bajarish' : language === 'ru' ? 'Быстрое выполнение' : 'Fast Delivery',
            description: language === 'uz' ? 'O\'z vaqtida topshirish' : language === 'ru' ? 'Своевременная доставка' : 'On-time delivery'
        },
        {
            icon: Award,
            title: language === 'uz' ? 'Professional jamoa' : language === 'ru' ? 'Профессиональная команда' : 'Professional Team',
            description: language === 'uz' ? 'Tajribali mutaxassislar' : language === 'ru' ? 'Опытные специалисты' : 'Expert specialists'
        }
    ], [language]);

    useEffect(() => {
        if (!service) return;
        
        if ('IntersectionObserver' in window) {
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

            document.querySelectorAll('.lazy-animate').forEach((el) => {
                observer.observe(el);
            });

            return () => observer.disconnect();
        }
    }, [service]);

    useEffect(() => {
        if (imgRef.current?.complete) {
            setImageLoaded(true);
        }
    }, [service]);

    const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.src = 'https://placehold.co/800x600/8b5cf6/ffffff?text=Service';
    }, []);

    useEffect(() => {
        const fetchServiceDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const apiUrl = import.meta.env.VITE_API_URL;

                if (!apiUrl) {
                    throw new Error("API URL topilmadi");
                }

                const url = `${apiUrl}/services/${id}/`;
                const response = await fetch(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Accept-Language': language,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP xatolik! Status: ${response.status}`);
                }

                const data: Service = await response.json();
                setService(data);

            } catch (err) {
                console.error("ServiceDetail Error:", err);
                const errorMessage = err instanceof Error ? err.message : 'Noma\'lum xatolik';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchServiceDetail();
    }, [id, language]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center pt-20">
                    <div className="text-center space-y-4">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                        <p className="text-muted-foreground">
                            {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
                        </p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !service) {
        return (
            <Layout>
                <div className="container-main py-16 px-4 mt-20">
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-destructive mb-2">
                            {language === 'uz' ? 'Xatolik yuz berdi' : language === 'ru' ? 'Произошла ошибка' : 'An error occurred'}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                            {error || (language === 'uz' ? 'Xizmat topilmadi' : language === 'ru' ? 'Услуга не найдена' : 'Service not found')}
                        </p>
                        <Button onClick={() => navigate("/services")} size="lg">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {language === 'uz' ? 'Xizmatlarga qaytish' : language === 'ru' ? 'Вернуться к услугам' : 'Back to services'}
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            {seoData && (
                <Helmet>
                    <html lang={language} />
                    <title>{seoData.pageTitle} | {siteName}</title>
                    <meta name="description" content={seoData.pageDescription} />
                    <link rel="canonical" href={seoData.currentUrl} />
                    
                    <meta property="og:title" content={`${seoData.pageTitle} | ${siteName}`} />
                    <meta property="og:description" content={seoData.pageDescription} />
                    <meta property="og:url" content={seoData.currentUrl} />
                    <meta property="og:type" content="article" />
                    <meta property="og:image" content={seoData.imageUrl} />
                    
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`${seoData.pageTitle} | ${siteName}`} />
                    <meta name="twitter:description" content={seoData.pageDescription} />
                    <meta name="twitter:image" content={seoData.imageUrl} />
                </Helmet>
            )}

            <style>{`
                .lazy-animate {
                    opacity: 0;
                    transition: opacity 0.7s ease-out, transform 0.7s ease-out;
                }

                .lazy-animate.animate-visible {
                    opacity: 1 !important;
                    transform: translateY(0) translateX(0) scale(1) !important;
                }

                .will-change-transform {
                    will-change: transform;
                    transform: translateZ(0);
                    backface-visibility: hidden;
                }

                body {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    text-rendering: optimizeLegibility;
                }

                img {
                    content-visibility: auto;
                }

                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation-duration: 0.01ms !important;
                        transition-duration: 0.01ms !important;
                    }
                }
            `}</style>

            {/* Hero Section with Image */}
            <section className="relative pt-20 md:pt-24">
                <div className="container-main px-4">
                    <div className="mb-6 lazy-animate translate-x-[-10px]">
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/services")}
                            className="hover:bg-muted"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}
                        </Button>
                    </div>

                    {/* Hero Content */}
                    <div className="grid lg:grid-cols-5 gap-8 pb-12">
                        {/* Left Content - 3 columns */}
                        <div className="lg:col-span-3 space-y-6 lazy-animate translate-y-5">
                            <div className="space-y-4">
                                <Badge className="px-4 py-1.5">
                                    {service.category}
                                </Badge>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    {service.title}
                                </h1>

                                <p className="text-xl text-muted-foreground leading-relaxed">
                                    {service.short_description}
                                </p>
                            </div>
                        </div>

                        {/* ✅ FIXED: Image container - o'lcham sozlanadi */}
                        <div className="lg:col-span-2 lazy-animate scale-95">
                            <div className="relative w-full pb-[85%] rounded-2xl overflow-hidden shadow-xl bg-muted">
                                {/* Placeholder */}
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 animate-pulse" />
                                )}
                                
                                <img
                                    ref={imgRef}
                                    src={service.image}
                                    alt={service.title}
                                    loading="eager"
                                    decoding="async"
                                    fetchPriority="high"
                                    className={`absolute top-0 left-0 w-full h-full object-cover will-change-transform transition-opacity duration-500 ${
                                        imageLoaded ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={handleImageError}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-8 bg-muted/30">
                <div className="container-main px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="lazy-animate translate-y-5"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 will-change-transform">
                                                <benefit.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">{benefit.title}</h3>
                                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Description - 2 columns */}
                        <div className="lg:col-span-2 lazy-animate translate-y-5">
                            <Card>
                                <CardContent className="p-8">
                                    <h2 className="text-2xl font-bold mb-6">
                                        {language === 'uz' ? 'Xizmat haqida' : language === 'ru' ? 'О услуге' : 'About Service'}
                                    </h2>
                                    <div
                                        className="prose prose-lg max-w-none text-muted-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-4 [&_ol]:list-decimal [&_ol]:ml-6 [&_strong]:font-bold [&_strong]:text-foreground [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-foreground"
                                        dangerouslySetInnerHTML={{ __html: service.description }}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Sidebar - 1 column */}
                        <div className="lg:col-span-1 lazy-animate translate-x-5">
                            <div className="sticky top-24 space-y-6">
                                <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-0">
                                    <CardContent className="p-6 space-y-5">
                                        <h3 className="text-xl font-bold">
                                            {language === 'uz' ? 'Bog\'laning' : language === 'ru' ? 'Свяжитесь с нами' : 'Contact Us'}
                                        </h3>

                                        <div className="space-y-3">
                                            <a
                                                href="tel:+998974440016"
                                                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                <Phone className="w-5 h-5" />
                                                <div className="flex-1">
                                                    <p className="text-xs opacity-90">
                                                        {language === 'uz' ? 'Telefon' : language === 'ru' ? 'Телефон' : 'Phone'}
                                                    </p>
                                                    <p className="font-semibold">+998 97 444 00 16</p>
                                                </div>
                                            </a>

                                            <a
                                                href="mailto:info@chorvador.uz"
                                                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                <Mail className="w-5 h-5" />
                                                <div className="flex-1">
                                                    <p className="text-xs opacity-90">{t("location.emailTitle")}</p>
                                                    <p className="font-semibold text-sm">info@chorvador.uz</p>
                                                </div>
                                            </a>

                                            <div className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                                                <MapPin className="w-5 h-5" />
                                                <div className="flex-1">
                                                    <p className="text-xs opacity-90">
                                                        {language === 'uz' ? 'Manzil' : language === 'ru' ? 'Адрес' : 'Address'}
                                                    </p>
                                                    <p className="font-semibold text-sm">Tashkent, Uzbekistan</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => navigate("/contact")}
                                            className="w-full bg-white text-primary hover:bg-white/90"
                                        >
                                            {language === 'uz' ? 'Buyurtma berish' : language === 'ru' ? 'Заказать' : 'Order Now'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default ServiceDetail;