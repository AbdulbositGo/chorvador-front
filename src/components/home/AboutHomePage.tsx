import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#4E8EC3] rounded-full mix-blend-multiply filter blur-[100px] animate-[blob_7s_infinite]"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#6ba3d4] rounded-full mix-blend-multiply filter blur-[100px] animate-[blob_7s_infinite_2s]"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#3d7aaa] rounded-full mix-blend-multiply filter blur-[100px] animate-[blob_7s_infinite_4s]"></div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        
  <div className="mb-12 text-left">
    {/* Badge */}
    <span className="inline-block px-4 py-1.5 rounded-full bg-[#4E8EC3]/10 text-[#4E8EC3] text-sm font-semibold mb-3 uppercase tracking-wide">
      {t("about1.badge")}
    </span>

    {/* Title */}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
      {t("about1.title")}
    </h2>

    {/* Subtitle */}
    <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">
      {t("about1.subtitle")}
    </p>
  </div>



        {/* Content Layout */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* Image Side */}
          <div className="order-2 lg:order-1">
            <div className="relative group">
              {/* Holographic Border Effect */}
              <div className="absolute -inset-[2px] bg-gradient-to-r from-[#4E8EC3] via-[#6ba3d4] to-[#3d7aaa] rounded-2xl opacity-75 group-hover:opacity-100 blur-sm transition-all duration-500"></div>
              
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-xl">
                <div className="relative h-[280px] md:h-[340px] lg:h-[440px]">
<img
  src="/about_img.jpg"
  alt="Chorvador.uz"
  className="
    w-full
    h-[220px]
    sm:h-[260px]
    md:h-[320px]
    lg:h-[380px]
    xl:h-[420px]
    object-cover
    mx-auto
    rounded-2xl
    group-hover:scale-105
    transition-transform
    duration-700
  "
/>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#4E8EC3]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white/30 backdrop-blur-sm border border-[#4E8EC3]/30 rounded-xl p-3 text-center shadow-lg">
                      <div className="text-xl font-black text-[#4E8EC3]">10+</div>
                      <div className="text-[10px] text-gray-600 mt-0.5 font-medium">{t('about1.stats.years') || 'YILLIK'}</div>
                    </div>
                    <div className="bg-white/30 backdrop-blur-sm border border-[#4E8EC3]/30 rounded-xl p-3 text-center shadow-lg">
                      <div className="text-xl font-black text-[#4E8EC3]">1K+</div>
                      <div className="text-[10px] text-gray-600 mt-0.5 font-medium">{t('about1.stats.clients') || 'MIJOZLAR'}</div>
                    </div>
                    <div className="bg-white/30 backdrop-blur-sm border border-[#4E8EC3]/30 rounded-xl p-3 text-center shadow-lg">
                      <div className="text-xl font-black text-[#4E8EC3]">100%</div>
                      <div className="text-[10px] text-gray-600 mt-0.5 font-medium">{t('about1.stats.quality') || 'SIFAT'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 space-y-5">
            
            {/* Card 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4E8EC3]/20 to-transparent rounded-2xl transform group-hover:scale-105 transition-transform duration-500 blur-xl"></div>
              <div className="relative bg-white/80 backdrop-blur-2xl border-2 border-[#4E8EC3]/20 rounded-2xl p-5 hover:border-[#4E8EC3]/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#4E8EC3] to-[#3d7aaa] rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[#4E8EC3] mb-2">Chorvador.uz</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {t('about1.intro')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative bg-white/80 backdrop-blur-2xl border-2 border-[#4E8EC3]/20 rounded-2xl p-5 hover:border-[#4E8EC3]/50 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="absolute top-3 right-3 w-16 h-16 bg-[#4E8EC3]/5 rounded-full blur-xl"></div>
              <div className="relative flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-9 h-9 border-2 border-[#4E8EC3]/50 rounded-lg flex items-center justify-center">
                    <div className="w-4 h-4 bg-[#4E8EC3] rounded"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed pt-1.5">
                  {t('about1.current')}
                </p>
              </div>
            </div>

            {/* Card 3 - Featured */}
            <div className="relative group overflow-hidden rounded-2xl shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4E8EC3] via-[#5a9bcc] to-[#3d7aaa]"></div>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white/90 text-xs font-semibold">{t('about1.official') || 'RASMIY DILER'}</span>
                </div>
                <p className="text-white text-sm leading-relaxed font-medium">
                  {t('about1.dealer')}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>  
    </div>
  );
}