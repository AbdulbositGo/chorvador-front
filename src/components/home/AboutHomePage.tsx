import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
<div className="min-h-[80vh] bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-20">
        {/* Hero Section with Image */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2D79C4' }}>
                  {t('about1.title')}
                </h1>
                <div className="w-24 h-1.5 rounded-full mb-6" style={{ backgroundColor: '#2D79C4' }}></div>
              </div>
              
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-semibold" style={{ color: '#2D79C4' }}>Chorvador.uz</span> - {t('about1.intro')}
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('about1.current')}
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  {t('about1.dealer')}
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl opacity-20 blur-2xl" style={{ backgroundColor: '#2D79C4' }}></div>
                <img 
                  src="/about_img.jpg" 
                  alt="Chorvador.uz Logo" 
                  className="relative w-full max-w-md rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}