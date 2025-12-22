import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, Phone, Mail, MapPin, Check, Clock, Shield, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface Service {
    id: number;
    title: string;
    short_description: string;
    description: string;
    image: string;
    category: string;
}

const ServiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (service) {
            const pageTitle = service.title;
            const siteName = "Your Company Name";
            document.title = `${pageTitle} | ${siteName}`;

            let metaDescription = document.querySelector('meta[name="description"]');
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', service.short_description);
            document.documentElement.lang = language;
        }
    }, [service, language]);

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
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center max-w-2xl mx-auto"
                    >
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
                    </motion.div>
                </div>
            </Layout>
        );
    }

    const benefits = [
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
    ];

    return (
        <Layout>
            {/* Hero Section with Image */}
            <section className="relative pt-20 md:pt-24">
                <div className="container-main px-4">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/services")}
                            className="hover:bg-muted"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}
                        </Button>
                    </motion.div>

                    {/* Hero Content */}
                    <div className="grid lg:grid-cols-5 gap-8 pb-12">
                        {/* Left Content - 3 columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-3 space-y-6"
                        >
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


                        </motion.div>

                        {/* Right Image - 2 columns */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = 'https://placehold.co/800x600/8b5cf6/ffffff?text=Service';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-8 bg-muted/30">
                <div className="container-main px-4">
                    <div className="grid md:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <benefit.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">{benefit.title}</h3>
                                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Description - 2 columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2"
                        >
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
                        </motion.div>

                        {/* Contact Sidebar - 1 column */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-24 space-y-6">
                                {/* Contact Card */}
                                <Card className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-0">
                                    <CardContent className="p-6 space-y-5">
                                        <h3 className="text-xl font-bold">
                                            {language === 'uz' ? 'Bog\'laning' : language === 'ru' ? 'Свяжитесь с нами' : 'Contact Us'}
                                        </h3>

                                        <div className="space-y-3">
                                            <a
                                                href="tel:+998901234567"
                                                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                <Phone className="w-5 h-5" />
                                                <div className="flex-1">
                                                    <p className="text-xs opacity-90">
                                                        {language === 'uz' ? 'Telefon' : language === 'ru' ? 'Телефон' : 'Phone'}
                                                    </p>
                                                    <p className="font-semibold">+998 90 123 45 67</p>
                                                </div>
                                            </a>

                                            <a
                                                href="mailto:info@example.com"
                                                className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors"
                                            >
                                                <Mail className="w-5 h-5" />
                                                <div className="flex-1">
                                                    <p className="text-xs opacity-90">Email</p>
                                                    <p className="font-semibold text-sm">info@example.com</p>
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
                                {/* Why Choose Us */}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default ServiceDetail;