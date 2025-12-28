import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Contact = () => {
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    text: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // SEO Metadata
  useEffect(() => {
    const pageTitle = language === 'uz' 
      ? 'Bog\'lanish | Chorvador' 
      : language === 'ru' 
      ? 'Контакты | Chorvador' 
      : 'Contact | Chorvador';
    
    const pageDescription = language === 'uz'
      ? 'Biz bilan bog\'laning. Savollaringiz bormi? Biz sizga yordam berishga tayyormiz.'
      : language === 'ru'
      ? 'Свяжитесь с нами. Есть вопросы? Мы готовы помочь вам.'
      : 'Contact us. Have questions? We are ready to help you.';

    document.title = pageTitle;
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', pageDescription);
    
    document.documentElement.lang = language;
  }, [language]);

  const validatePhone = (number: string) => {
    const digitsOnly = number.replace(/\D/g, "");
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      toast.error(
        language === 'uz' 
          ? "Iltimos, telefon raqamini to'g'ri formatda kiriting" 
          : language === 'ru'
          ? "Пожалуйста, введите номер телефона в правильном формате"
          : "Please enter phone number in correct format",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${API_URL}/send/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Server error");

      toast.success(
        language === 'uz'
          ? "Xabaringiz muvaffaqiyatli yuborildi!"
          : language === 'ru'
          ? "Ваше сообщение успешно отправлено!"
          : "Your message has been sent successfully!",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      setFormData({ full_name: "", phone: "", text: "" });
    } catch (error) {
      toast.error(
        language === 'uz'
          ? "Xabar yuborishda xatolik yuz berdi"
          : language === 'ru'
          ? "Произошла ошибка при отправке сообщения"
          : "An error occurred while sending the message",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneNumbers = [
    { value: "+998 91 192-07-55", link: "tel:+998911920755" },
    { value: "+998 97 444 00 16", link: "tel:+998974440016" },
    { value: "+998 94 647 10 03", link: "tel:+998946471003" },
  ];

  const contactInfo = [
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
      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-20">
        <div className="container-main px-4 md:px-6">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-base md:text-lg text-primary-foreground/90 max-w-2xl leading-relaxed">
            {t("contact.subtitle")}
          </p>
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
                
                <form onSubmit={handleSubmit} className="space-y-5">
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
                    <Input
                      required
                      type="tel"
                      placeholder="+998 97 444 00 16"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 bg-background border-border focus:ring-1 focus:ring-primary transition-all"
                    />
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
                    type="submit"
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
                </form>
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
                  <motion.div 
                    key={idx} 
                    className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border group cursor-default"
                    whileHover={{ 
                      x: 10, 
                      boxShadow: "0 10px 30px -10px hsl(207 66% 47% / 0.15)" 
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-12 h-12 rounded-xl gradient-hero flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      {item.isPhoneGrid ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                          {phoneNumbers.map((phone, phoneIdx) => (
                            <a
                              key={phoneIdx}
                              href={phone.link}
                              className="flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:text-white transition-all p-3 rounded-lg border border-border hover:border-[#2D79C4] hover:bg-[#2D79C4] hover:shadow-md"
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
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

          {/* Map Section */}
          <div className="mt-16 md:mt-24">
            <motion.div 
              className="rounded-3xl overflow-hidden shadow-lg border border-border relative w-full h-[350px] md:h-[500px]"
              whileHover={{ scale: 1.02 }} 
              transition={{ type: "spring", stiffness: 300 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1497.542603852809!2d69.26199674606329!3d41.35050164413911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8d118e2bc4cf%3A0x374c51e289606a41!2sChorvador%20uz!5e0!3m2!1suz!2s!4v1766405927730!5m2!1suz!2s"
                className="w-full h-full border-0"
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;