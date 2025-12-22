import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pt-10">
        {/* Hero Section with Image */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl shadow-xl overflow-hidden mb-16 border border-blue-100">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div className="order-2 md:order-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#2D79C4' }}>
                  {t('about.title')}
                </h1>
                <div className="w-24 h-1.5 rounded-full mb-6" style={{ backgroundColor: '#2D79C4' }}></div>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <span className="font-semibold" style={{ color: '#2D79C4' }}>Chorvador.uz</span> - oilaviy korxona brendi bo'lib, o'z faoliyatini <span className="font-semibold">2008 yilda</span> xorijdan mobil sigir sog'ish apparatlarini import qilish va ularga texnik xizmat ko'rsatish bilan boshlagan.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Hozirgi kunda chorvachilik majmualarini loyihalashdan boshlab, sut ishlab chiqarish bilan bog'liq barcha asbob-uskuna va jihozlarni taklif etadi.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Korxona dunyoning yetakchi bir qancha sut ishlab chiqarish va uni qayta ishlash bilan bog'liq barcha jarayon uskunalarni ishlab chiqaruvchi kompaniyalarining <span className="font-semibold" style={{ color: '#2D79C4' }}>O'zbekistondagi rasmiy dileri va hamkori</span> hisoblanadi.
                </p>
              </div>
            </div>
            
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl opacity-20 blur-2xl" style={{ backgroundColor: '#2D79C4' }}></div>
                <img 
                  src="/about_img.jpg" 
                  alt="Chorvador.uz Logo" 
                  className="relative w-full max-w-md rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300 border-4 border-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}