import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { 
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Service {
  title: string;
  description: string;
  image: string;
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/services/${id}/`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Accept-Language': language,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data: Service = await response.json();
        setService(data);
        
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServiceDetail();
    }
  }, [id, language]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-screen">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">
            {language === 'uz' ? 'Yuklanmoqda...' : language === 'ru' ? 'Загрузка...' : 'Loading...'}
          </p>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-screen px-4 ">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {language === 'uz' ? 'Xizmat topilmadi' : language === 'ru' ? 'Услуга не найдена' : 'Service not found'}
          </h2>
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {language === 'uz' ? 'Orqaga' : language === 'ru' ? 'Назад' : 'Back'}
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white pt-16">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 mb-8">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>
              {language === 'uz' ? 'Xizmatlarga qaytish' : language === 'ru' ? 'Вернуться к услугам' : 'Back to services'}
            </span>
          </button>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Image */}
            <div className="relative">
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Right - Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  {service.title}
                </h1>
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b-2 border-primary">
                  {language === 'uz' ? 'Tavsif' : language === 'ru' ? 'Описание' : 'Description'}
                </h2>
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetail;