/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "uz" | "ru" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  uz: {
    // SEO Meta
    "meta.home.title":
      "Chorvador.uz - Qishloq xo'jaligi mahsulotlari | Traktor, Urug', O'g'it",
    "meta.home.description":
      "O'zbekistonda qishloq xo'jaligi texnikasi, urug'lar, o'g'itlar va chorvachilik mahsulotlarining ishonchli yetkazib beruvchisi. 18 yildan ziyod tajriba.",
    "meta.about.title": "Biz haqimizda - Chorvador.uz | 18 Yildan Ziyod Tajriba",
    "meta.about.description":
      "Chorvador.uz 2004-yildan beri O'zbekiston fermerlariga xizmat qiladi. Sifatli mahsulotlar va professional xizmat.",
    "meta.products.title":
      "Mahsulotlar - Chorvador.uz | Traktor, Urug', O'g'it",
    "meta.products.description":
      "Qishloq xo'jaligi texnikasi, urug'lar, o'g'itlar, chorvachilik uskunalari. 500+ mahsulot turlari.",
    "meta.services.title":
      "Xizmatlar - Chorvador.uz | Yetkazib berish, Texnik xizmat",
    "meta.services.description":
      "Yetkazib berish, texnik xizmat, maslahat, kafolat xizmatlari. Fermerlar uchun to'liq qo'llab-quvvatlash.",
    "meta.contact.title": "Bog'lanish - Chorvador.uz | Aloqa Ma'lumotlari",
    "meta.contact.description":
      "Chorvador.uz bilan bog'laning. Toshkent, g.Toshkent, ul. Axmad Universitet 22. Tel:  +998 97 444 00 16",

    "nav.home": "Bosh sahifa",
    "nav.about": "Biz haqimizda",
    "nav.products": "Mahsulotlar",
    "nav.services": "Xizmatlar",
    "nav.contact": "Aloqa",
    "nav.login": "Kirish",
    "nav.order": "Buyurtma berish",
    "nav.workHours": "Ish vaqti: 09:00 - 18:00",

    "common.loading": "Yuklanmoqda",
    "common.error": "Xatolik",
    "common.errorOccurred": "Xatolik yuz berdi",
    "common.tryAgain": "Qayta urinish",
    "common.home": "Bosh sahifa",

    "seo.home.title": "Chorvadon - Chorvachilik Mahsulotlari va Xizmatlari",
    "seo.home.description":
      "Chorvadon - chorvachilik uchun yuqori sifatli mahsulotlar va professional xizmatlar. Yem-xashak, dori-darmonlar, asbob-uskunalar va ko'proq.",
    "seo.home.keywords":
      "chorvachilik, yem-xashak, dori-darmonlar, chorva mollari, qo'y, sigir, tovuq, Toshkent, O'zbekiston",

    "index.products.badge": "Mahsulotlar",
    "index.products.title": "Premium Mahsulotlar",
    "index.products.subtitle":
      "Chorvachilik uchun yuqori sifatli mahsulotlar keng assortimenti",
    "index.products.viewAll": "Barcha mahsulotlarni ko'rish",
    "index.products.noProducts": "Hozircha mahsulotlar mavjud emas",
    "index.products.loading": "Yuklanmoqda",

    "index.services.badge": "Xizmatlar",
    "index.services.title": "Professional Xizmatlarimiz",
    "index.services.subtitle":
      "Chorvachilik sohasida kompleks yechimlar va texnik qo'llab-quvvatlash",
    "index.services.viewAll": "Barcha xizmatlarni ko'rish",
    "index.services.more": "Batafsil",
    "index.services.noServices": "Hozircha xizmatlar mavjud emas",

    "hero.slide1.title": "Qishloq xo'jaligining ishonchli hamkori",
    "hero.slide1.subtitle": "Eng sifatli texnika va uskunalar",
    "hero.slide1.description":
      "18 yildan ziyod tajriba va 1000+ mamnun mijozlar bilan O'zbekiston fermerlariga xizmat qilamiz",
    "hero.slide1.cta": "Mahsulotlarni ko'rish",
    "hero.slide2.title": "Yuqori sifatli urug'lar",
    "hero.slide2.subtitle": "Hosildorlikni oshiring",
    "hero.slide2.description":
      "Import va mahalliy ishlab chiqarilgan sertifikatlangan urug'lar kolleksiyasi",
    "hero.slide2.cta": "Urug'larni ko'rish",
    "hero.slide3.title": "Chorvachilik mahsulotlari",
    "hero.slide3.subtitle": "Hayvonlaringiz uchun eng yaxshisi",
    "hero.slide3.description":
      "Veterinariya preparatlari, ozuqa qo'shimchalari va chorvachilik uskunalari",
    "hero.slide3.cta": "Batafsil",
    "hero.slide4.title": "O'g'itlar va himoya vositalari",
    "hero.slide4.subtitle": "Ekinlaringizni himoyalang",
    "hero.slide4.description":
      "Mineral va organik o'g'itlar, o'simliklarni himoya qilish vositalari",
    "hero.slide4.cta": "Ko'proq bilish",
    "hero.contact": "Bog'lanish",

    "stats.customers": "Mamnun mijozlar",
    "stats.products": "Mahsulot turlari",
    "stats.experience": "Yildan ziyod tajriba",
    "stats.regions": "Viloyatlarga xizmat",

    "products.badge": "Mahsulotlar",
    "products.title": "Tanlangan mahsulotlar",
    "products.subtitle":
      "Eng ko'p sotilayotgan va tavsiya etilgan mahsulotlarimiz bilan tanishing",
    "products.viewAll": "Barcha mahsulotlar",
    "products.popular": "Mashhur",
    "products.new": "Yangi",
    "products.discount": "Chegirma",
    "products.view": "Ko'rish",
    "products.addToCart": "Savatga",
    "products.page.title": "Mahsulotlar",
    "products.page.subtitle":
      "Qishloq xo'jaligi va chorvachilik uchun zarur bo'lgan barcha mahsulotlar bir joyda",
    "products.search": "Mahsulot qidirish...",
    "products.filters": "Filtrlar",
    "products.found": "ta mahsulot topildi",
    "products.notFound":
      "Hech narsa topilmadi. Boshqa kalit so'z bilan qidirib ko'ring.",
    "products.categories.all": "Barchasi",
    "products.categories.texnika": "Qishloq xo'jaligi texnikasi",
    "products.categories.uruglar": "Urug'lar",
    "products.categories.ogitlar": "O'g'itlar",
    "products.categories.chorvachilik": "Chorvachilik",
    "products.categories.sugorish": "Sug'orish uskunalari",

    "product.backToProducts": "Mahsulotlarga qaytish",
    "product.price": "so'm",
    "product.addToCart": "Savatga qo'shish",
    "product.callUs": "Qo'ng'iroq qilish",
    "product.warranty": "Rasmiy kafolat",
    "product.freeDelivery": "Bepul yetkazib berish",
    "product.installment": "Muddatli to'lov imkoniyati",
    "product.specifications": "Texnik xususiyatlar",
    "product.video": "Video ko'rsatma",
    "product.similar": "O'xshash mahsulotlar",
    "products.page.loading": "Yuklanmoqda...",

    "about1.title": "Biz haqimizda",
    "about1.subtitle":
      "2008 yildan buyon chorvachilik texnologiyalari sohasida faoliyat yuritamiz.",
    "about1.intro":
      "Chorvador.uz - bu korxonamizning rasman ro'yxatdan o'tgan brendi bo'lib, o'z faoliyatini 2008 yilda xorijdan mobil sigir sog'ish apparatlarini import qilish va ularga texnik xizmat ko'rsatish bilan boshlagan.",
    "about1.current":
      "Hozirgi kunda chorvachilik majmualarini loyihalashdan boshlab, sut ishlab chiqarish bilan bog'liq barcha asbob-uskuna va jihozlarni taklif etadi.",
    "about1.dealer":
      "Korxona dunyoning yetakchi bir qancha sut ishlab chiqarish va uni qayta ishlash bilan bog'liq barcha jarayon uskunalarni ishlab chiqaruvchi kompaniyalarining O'zbekistondagi rasmiy dileri va hamkori hisoblanadi.",
    "about1.badge": "Professional chorvachilik uskunalari",
    "about1.stats.years": "YILLIK",
    "about1.stats.clients": "MIJOZLAR",
    "about1.stats.quality": "SIFAT",
    "about1.official": "RASMIY DILER",

    "services.badge": "Xizmatlar",
    "services.title": "Bizning xizmatlarimiz",
    "services.subtitle":
      "Fermerlar va qishloq xo'jaligi sohasida faoliyat yurituvchilar uchun keng qamrovli xizmatlar",
    "services.viewAll": "Barcha xizmatlar",
    "services.more": "Batafsil",
    "services.page.title": "Xizmatlar",
    "services.page.subtitle":
      "Fermerlar va qishloq xo'jaligi sohasida faoliyat yurituvchilar uchun keng qamrovli xizmatlar",
    "services.types.all": "Barchasi",
    "services.types.delivery": "Yetkazib berish",
    "services.types.technical": "Texnik xizmat",
    "services.types.consulting": "Maslahat",
    "services.types.warranty": "Kafolat",
    "services.delivery.title": "Yetkazib berish xizmati",
    "services.delivery.desc":
      "O'zbekiston bo'ylab tez va ishonchli yetkazib berish. Katta buyurtmalar uchun bepul yetkazib berish xizmati.",
    "services.delivery.feature1": "1-3 kun ichida yetkazib berish",
    "services.delivery.feature2": "Katta buyurtmalar uchun bepul",
    "services.delivery.feature3": "Onlayn kuzatish",
    "services.technical.title": "Texnik xizmat ko'rsatish",
    "services.technical.desc":
      "Qishloq xo'jaligi texnikasi va uskunalariga professional texnik xizmat ko'rsatish va ta'mirlash.",
    "services.technical.feature1": "Tajribali mutaxassislar",
    "services.technical.feature2": "Asl ehtiyot qismlar",
    "services.technical.feature3": "Tezkor xizmat",
    "services.consultation.title": "Maslahat xizmati",
    "services.consultation.desc":
      "Fermerlar uchun bepul maslahat xizmati. Mahsulot tanlash va qo'llashda yordam.",
    "services.consultation.feature1": "Bepul maslahat",
    "services.consultation.feature2": "Tajribali agronomlar",
    "services.consultation.feature3": "24/7 qo'llab-quvvatlash",
    "services.warranty.title": "Kafolat xizmati",
    "services.warranty.desc":
      "Barcha mahsulotlarga kafolat. Muammoli mahsulotlarni almashtirish yoki ta'mirlash.",
    "services.warranty.feature1": "12 oylik kafolat",
    "services.warranty.feature2": "Bepul almashtirish",
    "services.warranty.feature3": "Tezkor javob",
    "services.rental.title": "Texnikani ijaraga berish",
    "services.rental.desc":
      "Qishloq xo'jaligi texnikasini mavsumiy ijaraga berish xizmati.",
    "services.rental.feature1": "Qulay narxlar",
    "services.rental.feature2": "Turli texnika",
    "services.rental.feature3": "Operator bilan",
    "services.analysis.title": "Agrokimyoviy tahlil",
    "services.analysis.desc":
      "Tuproq va o'simliklar tahlili. Samarali o'g'it va himoya vositalarini tanlashda yordam.",
    "services.analysis.feature1": "Laboratoriya tahlili",
    "services.analysis.feature2": "Tavsiyalar",
    "services.analysis.feature3": "Bepul namuna olish",

    "about.title": "Biz haqimizda",
    "about.subtitle":
      "Chorvador.uz — O'zbekiston bo'ylab qishloq xo'jaligi va chorvachilik mahsulotlarining ishonchli yetkazib beruvchisi",
    "about.history.badge": "Kompaniya tarixi",
    "about.history.title": "18 yildan ziyod tajriba va ishonch",
    "about.history.p1":
      "Oilaviy korxona brendi bo'lib, o'z faoliyatini 2008 yilda xorijdan mobil sigir sog'ish apparatlarini import qilish va ularga texnik xizmat ko'rsatish bilan boshlagan.",
    "about.history.p2":
      "Hozirgi kunda chorvachilik majmualarini loyihalashdan boshlab, sut ishlab chiqarish bilan bog'liq barcha asbob-uskuna va jihozlarni taklif etadi.",
    "about.history.p3":
      "Korxona dunyoning yetakchi bir qancha sut ishlab chiqarish va uni qayta ishlash bilan bog'liq barcha jarayon uskunalarni ishlab chiqaruvchi kompaniyalarining O'zbekistondagi rasmiy dileri va hamkori hisoblanadi.",
    "about.history.years": "Yildan ziyod tajriba",
    "about.mission.title": "Bizning missiyamiz",
    "about.mission.desc":
      "O'zbekiston fermerlarini eng sifatli qishloq xo'jaligi mahsulotlari va zamonaviy texnologiyalar bilan ta'minlash, ularga professional maslahat va xizmatlar ko'rsatish orqali mamlakatimiz qishloq xo'jaligining barqaror rivojlanishiga hissa qo'shish.",
    "about.vision.title": "Bizning ko'zlagan maqsadimiz",
    "about.vision.desc":
      "O'zbekiston va Markaziy Osiyo mintaqasida qishloq xo'jaligi mahsulotlari sohasida yetakchi kompaniyaga aylanish, innovatsion yechimlar va yuqori sifatli xizmatlar bilan mijozlarimizning ishonchini qozonish.",
    "about.values.badge": "Qadriyatlarimiz",
    "about.values.title": "Bizning qadriyatlarimiz",
    "about.values.quality.title": "Sifat",
    "about.values.quality.desc":
      "Faqat sertifikatlangan va yuqori sifatli mahsulotlarni taqdim etamiz",
    "about.values.reliability.title": "Ishonchlilik",
    "about.values.reliability.desc":
      "18 yildan ziyod tajriba va minglab mamnun mijozlar",
    "about.values.professionalism.title": "Professionallik",
    "about.values.professionalism.desc":
      "Malakali mutaxassislar jamoasi va professional xizmat ko'rsatish",

    "contact.title": "Bog'lanish",
    "contact.subtitle":
      "Savollaringiz bormi? Biz bilan bog'laning va mutaxassislarimiz sizga yordam beradi",
    "contact.form.title": "Xabar yuborish",
    "contact.form.name": "Ismingiz",
    "contact.form.namePlaceholder": "Ismingizni kiriting",
    "contact.form.phone": "Telefon raqam",
    "contact.form.phonePlaceholder": "+998 97 444 00 16",
    "contact.form.message": "Xabar",
    "contact.form.messagePlaceholder": "Xabaringizni yozing...",
    "contact.form.submit": "Xabar yuborish",
    "contact.form.submitting": "Yuborilmoqda...",
    "contact.form.success": "Xabar yuborildi!",
    "contact.form.successDesc": "Tez orada siz bilan bog'lanamiz.",
    "contact.info.title": "Aloqa ma'lumotlari",
    "contact.info.subtitle":
      "Bizning ofisimizga tashrif buyurishingiz yoki quyidagi ma'lumotlar orqali biz bilan bog'lanishingiz mumkin.",
    "contact.address.title": "Manzil",
    "contact.address.value":
      "Ahmad Donish ko'chasi, 22 UY, 100057, Toshkent, Oʻzbekiston",
    "contact.phone.title": "Telefon",
    "contact.email.title": "Elektron pochta",
    "contact.hours.title": "Ish vaqti",
    "contact.hours.value":
      "Dushanba - Shanba: 09:00 - 18:00\nYakshanba: Dam olish kuni",
    viewDetails: "Batafsil ko'rish",
    learnMore: "Ko'proq o'rganish",

    "404.title": "404",
    "404.subtitle": "Kechirasiz! Sahifa topilmadi",
    "404.description":
      "Siz qidirayotgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.",
    "404.home": "Bosh sahifaga qaytish",

    "partners.badge": "Hamkorlar",
    "partners.title": "Hamkor kompaniyalar",
    "partners.subtitle":
      "Dunyo va mahalliy yetakchi kompaniyalar bilan hamkorlik qilamiz",

    "location.badge": "Manzil",
    "location.title": "Bizning manzilimiz",
    "location.subtitle": "Bizning ofisimizga tashrif buyuring yoki bog'laning",
    "location.address":
      "Ahmad Donish ko'chasi, 22 UY, 100057, Toshkent, Oʻzbekiston",
    "location.phone": "+998 97 444 00 16",
    "location.email": "info@chorvador.uz",
    "location.cta": "Bog'lanish",
    "location.addressTitle": "Manzil",
    "location.phoneTitle": "Telefon",
    "location.emailTitle": "Email",

    "footer.description":
      "O'zbekiston bo'ylab qishloq xo'jaligi va chorvachilik mahsulotlarining ishonchli yetkazib beruvchisi.",
    "footer.company.title": "Kompaniya",
    "footer.company.about": "Biz haqimizda",
    "footer.company.services": "Xizmatlar",
    "footer.company.products": "Mahsulotlar",
    "footer.company.contact": "Aloqa",
    "footer.products.title": "Mahsulotlar",
    "footer.products.machinery": "Qishloq xo'jaligi texnikasi",
    "footer.products.livestock": "Chorvachilik mahsulotlari",
    "footer.products.fertilizers": "O'g'itlar va kimyoviy moddalar",
    "footer.products.seeds": "Urug'lar",
    "footer.services.title": "Xizmatlar",
    "footer.services.technical": "Texnik xizmat ko'rsatish",
    "footer.services.consulting": "Maslahat xizmatlari",
    "footer.services.delivery": "Yetkazib berish",
    "footer.services.warranty": "Kafolat xizmati",
    "footer.contact.title": "Aloqa",
    "footer.contact.address":
      "Ahmad Donish ko'chasi, 22 UY, 100057, Toshkent, Oʻzbekiston",
    "footer.copyright": " Chorvador.uz. Barcha huquqlar himoyalangan.",
    "footer.privacy": "Maxfiylik siyosati",
    "footer.terms": "Foydalanish shartlari",

    "index.noProducts": "Hozircha mahsulotlar mavjud emas",
  },
  ru: {
    "meta.home.title":
      "Chorvador.uz - Сельхозпродукция | Трактор, Семена, Удобрения",
    "meta.home.description":
      "Надежный поставщик сельскохозяйственной техники, семян и удобрений в Узбекистане. Более 18 лет опыта.",
    "meta.about.title": "О нас - Chorvador.uz | Более 18 лет опыта",
    "meta.about.description":
      "Chorvador.uz обслуживает фермеров Узбекистана с 2004 года. Качественная продукция и профессиональный сервис.",
    "meta.products.title":
      "Продукция - Chorvador.uz | Трактор, Семена, Удобрения",
    "meta.products.description":
      "Сельхозтехника, семена, удобрения, оборудование для животноводства. 500+ видов продукции.",
    "meta.services.title": "Услуги - Chorvador.uz | Доставка, Техобслуживание",
    "meta.services.description":
      "Доставка, техобслуживание, консультации, гарантия. Полная поддержка фермеров.",
    "meta.contact.title": "Контакты - Chorvador.uz | Связаться с Нами",
    "meta.contact.description":
      "Свяжитесь с Chorvador.uz. Ташкент, Чиланзар. Тел: +998 97 444 00 16",

    "nav.home": "Главная",
    "nav.about": "О нас",
    "nav.products": "Продукты",
    "nav.services": "Услуги",
    "nav.contact": "Контакты",
    "nav.login": "Войти",
    "nav.order": "Заказать",
    "nav.workHours": "Рабочее время: 09:00 - 18:00",

    "hero.slide1.title": "Надёжный партнёр сельского хозяйства",
    "hero.slide1.subtitle": "Качественная техника и оборудование",
    "hero.slide1.description":
      "Более 18 лет опыта и более 1000 довольных клиентов. Мы обслуживаем фермеров Узбекистана",
    "hero.slide1.cta": "Смотреть продукты",
    "hero.slide2.title": "Высококачественные семена",
    "hero.slide2.subtitle": "Повысьте урожайность",
    "hero.slide2.description":
      "Коллекция сертифицированных импортных и местных семян",
    "hero.slide2.cta": "Смотреть семена",
    "hero.slide3.title": "Продукция для животноводства",
    "hero.slide3.subtitle": "Лучшее для ваших животных",
    "hero.slide3.description":
      "Ветеринарные препараты, кормовые добавки и оборудование",
    "hero.slide3.cta": "Подробнее",
    "hero.slide4.title": "Удобрения и средства защиты",
    "hero.slide4.subtitle": "Защитите свои посевы",
    "hero.slide4.description":
      "Минеральные и органические удобрения, средства защиты растений",
    "hero.slide4.cta": "Узнать больше",
    "hero.contact": "Связаться",

    "common.loading": "Загрузка",
    "common.error": "Ошибка",
    "common.errorOccurred": "Произошла ошибка",
    "common.tryAgain": "Попробовать снова",
    "common.home": "Главная",

    "seo.home.title": "Chorvadon - Животноводческие Товары и Услуги",
    "seo.home.description":
      "Chorvadon - высококачественные товары и профессиональные услуги для животноводства. Корма, лекарства, оборудование и многое другое.",
    "seo.home.keywords":
      "животноводство, корма, лекарства, скот, овцы, коровы, куры, Ташкент, Узбекистан",

    "index.products.badge": "Продукция",
    "index.products.title": "Премиум Продукция",
    "index.products.subtitle":
      "Широкий ассортимент высококачественной продукции для животноводства",
    "index.products.viewAll": "Посмотреть все продукты",
    "index.products.noProducts": "Продукты пока недоступны",
    "index.products.loading": "Загрузка",

    "index.services.badge": "Услуги",
    "index.services.title": "Наши Профессиональные Услуги",
    "index.services.subtitle":
      "Комплексные решения и техническая поддержка в животноводстве",
    "index.services.viewAll": "Посмотреть все услуги",
    "index.services.more": "Подробнее",
    "index.services.noServices": "Услуги пока недоступны",

    "stats.customers": "Довольных клиентов",
    "stats.products": "Видов продукции",
    "stats.experience": "Более года опыта",
    "stats.regions": "Регионов обслуживания",

    "products.badge": "Продукты",
    "products.title": "Избранные продукты",
    "products.subtitle":
      "Ознакомьтесь с нашими самыми продаваемыми и рекомендуемыми товарами",
    "products.viewAll": "Все продукты",
    "products.popular": "Популярное",
    "products.new": "Новинка",
    "products.discount": "Скидка",
    "products.view": "Смотреть",
    "products.addToCart": "В корзину",
    "products.page.title": "Продукты",
    "products.page.subtitle":
      "Вся необходимая продукция для сельского хозяйства и животноводства в одном месте",
    "products.search": "Поиск продукта...",
    "products.filters": "Фильтры",
    "products.found": "продуктов найдено",
    "products.notFound": "Ничего не найдено. Попробуйте другой запрос.",
    "products.categories.all": "Все",
    "products.categories.texnika": "Сельхозтехника",
    "products.categories.uruglar": "Семена",
    "products.categories.ogitlar": "Удобрения",
    "products.categories.chorvachilik": "Животноводство",
    "products.categories.sugorish": "Оросительное оборудование",

    "product.backToProducts": "Вернуться к продуктам",
    "product.price": "сум",
    "product.addToCart": "В корзину",
    "product.callUs": "Позвонить",
    "product.warranty": "Официальная гарантия",
    "product.freeDelivery": "Бесплатная доставка",
    "product.installment": "Рассрочка",
    "product.specifications": "Технические характеристики",
    "product.video": "Видео инструкция",
    "product.similar": "Похожие товары",
    "products.page.loading": "Загрузка...",

    "about1.title": "О нас",
    "about1.subtitle": "С 2008 года мы работаем в сфере технологий животноводства.",
    "about1.intro":
      "Chorvador.uz — это официально зарегистрированный бренд нашей компании, которая начала свою деятельность в 2008 году с импорта из-за границы мобильных аппаратов для доения коров и обслуживания их технического состояния.",
    "about1.current":
      "В настоящее время он предлагает все оборудование и устройства, связанные с производством молока, начиная с проектирования животноводческих комплексов.",
    "about1.dealer":
      "Предприятие является официальным дилером и партнером в Узбекистане нескольких ведущих мировых компаний-производителей оборудования для всех технологических процессов, связанных с производством и переработкой молока.",
    "about1.badge": "Профессиональное оборудование для животноводства",
    "about1.stats.years": "ЛЕТ ОПЫТА",
    "about1.stats.clients": "КЛИЕНТЫ",
    "about1.stats.quality": "КАЧЕСТВО",
    "about1.official": "ОФИЦИАЛЬНЫЙ ДИЛЕР",

    "services.badge": "Услуги",
    "services.title": "Наши услуги",
    "services.subtitle":
      "Комплексные услуги для фермеров и работников сельского хозяйства",
    "services.viewAll": "Все услуги",
    "services.more": "Подробнее",
    "services.page.title": "Услуги",
    "services.page.subtitle":
      "Комплексные услуги для фермеров и работников сельского хозяйства",
    "services.types.all": "Все",
    "services.types.delivery": "Доставка",
    "services.types.technical": "Техобслуживание",
    "services.types.consulting": "Консультации",
    "services.types.warranty": "Гарантия",
    "services.delivery.title": "Служба доставки",
    "services.delivery.desc":
      "Быстрая и надёжная доставка по всему Узбекистану. Бесплатная доставка для крупных заказов.",
    "services.delivery.feature1": "Доставка за 1-3 дня",
    "services.delivery.feature2": "Бесплатно для крупных заказов",
    "services.delivery.feature3": "Онлайн отслеживание",
    "services.technical.title": "Техническое обслуживание",
    "services.technical.desc":
      "Профессиональное техническое обслуживание и ремонт сельхозтехники и оборудования.",
    "services.technical.feature1": "Опытные специалисты",
    "services.technical.feature2": "Оригинальные запчасти",
    "services.technical.feature3": "Быстрый сервис",
    "services.consultation.title": "Консультационная служба",
    "services.consultation.desc":
      "Бесплатные консультации для фермеров. Помощь в выборе и применении продукции.",
    "services.consultation.feature1": "Бесплатные консультации",
    "services.consultation.feature2": "Опытные агрономы",
    "services.consultation.feature3": "Поддержка 24/7",
    "services.warranty.title": "Гарантийный сервис",
    "services.warranty.desc":
      "Гарантия на всю продукцию. Замена или ремонт проблемных товаров.",
    "services.warranty.feature1": "Гарантия 12 месяцев",
    "services.warranty.feature2": "Бесплатная замена",
    "services.warranty.feature3": "Быстрый отклик",
    "services.rental.title": "Аренда техники",
    "services.rental.desc": "Сезонная аренда сельскохозяйственной техники.",
    "services.rental.feature1": "Доступные цены",
    "services.rental.feature2": "Разная техника",
    "services.rental.feature3": "С оператором",
    "services.analysis.title": "Агрохимический анализ",
    "services.analysis.desc":
      "Анализ почвы и растений. Помощь в выборе эффективных удобрений и средств защиты.",
    "services.analysis.feature1": "Лабораторный анализ",
    "services.analysis.feature2": "Рекомендации",
    "services.analysis.feature3": "Бесплатный отбор проб",

    "about.title": "О нас",
    "about.subtitle":
      "Chorvador.uz — надёжный поставщик сельскохозяйственной и животноводческой продукции по всему Узбекистану",

    "about.history.badge": "История компании",
    "about.history.title": "Более 18 лет опыта и доверия",
    "about.history.p1":
      "Семейный бренд предприятия, начавший свою деятельность в 2008 году с импорта мобильных доильных аппаратов из-за рубежа и предоставления технического обслуживания для них.",
    "about.history.p2":
      "В настоящее время предлагает все оборудование и устройства, связанные с производством молока, начиная с проектирования животноводческих комплексов.",
    "about.history.p3":
      "Предприятие является официальным дилером и партнером в Узбекистане нескольких ведущих мировых компаний-производителей оборудования для всех технологических процессов, связанных с производством и переработкой молока.",
    "about.history.years": "Более года опыта",

    "about.mission.title": "Наша миссия",
    "about.mission.desc":
      "Обеспечение фермеров Узбекистана высококачественной сельскохозяйственной продукцией и современными технологиями, предоставляя профессиональные консультации и услуги для устойчивого развития аграрного сектора страны.",

    "about.vision.title": "Наше видение",
    "about.vision.desc":
      "Стать ведущей компанией в сфере сельскохозяйственной продукции в Узбекистане и Центральной Азии, завоёвывая доверие клиентов за счёт инновационных решений и высокого уровня сервиса.",

    "about.values.badge": "Наши ценности",
    "about.values.title": "Наши ценности",

    "about.values.quality.title": "Качество",
    "about.values.quality.desc":
      "Мы предлагаем только сертифицированную и высококачественную продукцию",

    "about.values.reliability.title": "Надёжность",
    "about.values.reliability.desc":
      "Более 18 лет опыта и тысячи довольных клиентов",

    "about.values.professionalism.title": "Профессионализм",
    "about.values.professionalism.desc":
      "Команда квалифицированных специалистов и профессиональный подход к обслуживанию",

    "contact.title": "Контакты",
    "contact.subtitle":
      "Есть вопросы? Свяжитесь с нами, и наши специалисты вам помогут",
    "contact.form.title": "Отправить сообщение",
    "contact.form.name": "Ваше имя",
    "contact.form.namePlaceholder": "Введите ваше имя",
    "contact.form.phone": "Телефон",
    "contact.form.phonePlaceholder": "+998 97 444 00 16",
    "contact.form.message": "Сообщение",
    "contact.form.messagePlaceholder": "Напишите ваше сообщение...",
    "contact.form.submit": "Отправить сообщение",
    "contact.form.submitting": "Отправка...",
    "contact.form.success": "Сообщение отправлено!",
    "contact.form.successDesc": "Мы свяжемся с вами в ближайшее время.",
    "contact.info.title": "Контактная информация",
    "contact.info.subtitle":
      "Вы можете посетить наш офис или связаться с нами следующими способами.",
    "contact.address.title": "Адрес",
    "contact.address.value":
      "ул. Ахмад Дониш, 22 ДОМ, 100057, Tashkent, Oʻzbekiston",
    "contact.phone.title": "Телефон",
    "contact.email.title": "Эл. почта",
    "contact.hours.title": "Рабочее время",
    "contact.hours.value":
      "Понедельник - Суббота: 09:00 - 18:00\nВоскресенье: Выходной",
    viewDetails: "Подробнее",
    learnMore: "Узнать больше",

    "404.title": "404",
    "404.subtitle": "Извините! Страница не найдена",
    "404.description":
      "Страница, которую вы ищете, не существует или была перемещена.",
    "404.home": "Вернуться на главную",

    "partners.badge": "Партнёры",
    "partners.title": "Компании-партнёры",
    "partners.subtitle":
      "Сотрудничаем с ведущими мировыми и местными компаниями",

    "location.badge": "Адрес",
    "location.title": "Наш адрес",
    "location.subtitle": "Посетите наш офис или свяжитесь с нами",
    "location.address":
      "ул. Ахмад Дониш, 22 ДОМ, 100057, Tashkent, Oʻzbekiston",
    "location.phone": "+998 97 444 00 16",
    "location.email": "info@chorvador.uz",
    "location.cta": "Связаться",
    "location.addressTitle": "Адрес",
    "location.phoneTitle": "Телефон",
    "location.emailTitle": "Электронная почта",

    "footer.description":
      "Надежный поставщик сельскохозяйственной и животноводческой продукции по всему Узбекистану.",
    "footer.company.title": "Компания",
    "footer.company.about": "О нас",
    "footer.company.services": "Услуги",
    "footer.company.products": "Продукция",
    "footer.company.contact": "Контакты",
    "footer.products.title": "Продукция",
    "footer.products.machinery": "Сельскохозяйственная техника",
    "footer.products.livestock": "Животноводческая продукция",
    "footer.products.fertilizers": "Удобрения и химические вещества",
    "footer.products.seeds": "Семена",
    "footer.services.title": "Услуги",
    "footer.services.technical": "Техническое обслуживание",
    "footer.services.consulting": "Консультационные услуги",
    "footer.services.delivery": "Доставка",
    "footer.services.warranty": "Гарантийное обслуживание",
    "footer.contact.title": "Контакты",
    "footer.contact.address":
      "ул. Ахмад Дониш, 22 ДОМ, 100057, Tashkent, Oʻzbekiston",
    "footer.copyright": " Chorvador.uz. Все права защищены.",
    "footer.privacy": "Политика конфиденциальности",
    "footer.terms": "Условия использования",

    "index.noProducts": "Продукты пока недоступны",
  },
  en: {
    "meta.home.title":
      "Chorvador.uz - Agricultural Products | Tractor, Seeds, Fertilizers",
    "meta.home.description":
      "A reliable supplier of agricultural machinery, seeds, and fertilizers in Uzbekistan. Over 18 years of experience.",
    "meta.about.title": "About Us - Chorvador.uz | Over 18 Years Experience",
    "meta.about.description":
      "Chorvador.uz has been serving Uzbekistan farmers since 2004. Quality products and professional service.",
    "meta.products.title":
      "Products - Chorvador.uz | Tractor, Seeds, Fertilizers",
    "meta.products.description":
      "Agricultural machinery, seeds, fertilizers, livestock equipment. 500+ product types.",
    "meta.services.title":
      "Services - Chorvador.uz | Delivery, Technical Service",
    "meta.services.description":
      "Delivery, technical service, consultation, warranty services. Full support for farmers.",
    "meta.contact.title": "Contact - Chorvador.uz | Get in Touch",
    "meta.contact.description":
      "Contact Chorvador.uz. Tashkent, Chilanzar. Tel: +998 97 444 00 16",

    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.products": "Products",
    "nav.services": "Services",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.order": "Order Now",
    "nav.workHours": "Working hours: 09:00 - 18:00",

    "hero.slide1.title": "Reliable Partner in Agriculture",
    "hero.slide1.subtitle": "Quality Equipment & Machinery",
    "hero.slide1.description":
      "Over 18 years of experience serving farmers in Uzbekistan and 1000+ satisfied customers",
    "hero.slide1.cta": "View Products",
    "hero.slide2.title": "High Quality Seeds",
    "hero.slide2.subtitle": "Increase Your Yield",
    "hero.slide2.description":
      "Collection of certified imported and locally produced seeds",
    "hero.slide2.cta": "View Seeds",
    "hero.slide3.title": "Livestock Products",
    "hero.slide3.subtitle": "Best for Your Animals",
    "hero.slide3.description":
      "Veterinary preparations, feed additives and livestock equipment",
    "hero.slide3.cta": "Learn More",
    "hero.slide4.title": "Fertilizers & Protection",
    "hero.slide4.subtitle": "Protect Your Crops",
    "hero.slide4.description":
      "Mineral and organic fertilizers, plant protection products",
    "hero.slide4.cta": "Learn More",
    "hero.contact": "Contact Us",

    "stats.customers": "Happy Customers",
    "stats.products": "Product Types",
    "stats.experience": "More than a year of experience",
    "stats.regions": "Regions Served",

    "common.loading": "Loading",
    "common.error": "Error",
    "common.errorOccurred": "An error occurred",
    "common.tryAgain": "Try again",
    "common.home": "Home",

    "seo.home.title": "Chorvadon - Livestock Products and Services",
    "seo.home.description":
      "Chorvadon - high-quality products and professional services for livestock farming. Feed, medicines, equipment and more.",
    "seo.home.keywords":
      "livestock, animal feed, veterinary medicines, cattle, sheep, cows, chickens, Tashkent, Uzbekistan",

    "index.products.badge": "Products",
    "index.products.title": "Premium Products",
    "index.products.subtitle":
      "Wide range of high-quality products for livestock farming",
    "index.products.viewAll": "View all products",
    "index.products.noProducts": "No products available yet",
    "index.products.loading": "Loading",

    "index.services.badge": "Services",
    "index.services.title": "Our Professional Services",
    "index.services.subtitle":
      "Comprehensive solutions and technical support in livestock farming",
    "index.services.viewAll": "View all services",
    "index.services.more": "Learn more",
    "index.services.noServices": "No services available yet",

    "products.badge": "Products",
    "products.title": "Featured Products",
    "products.subtitle": "Explore our best-selling and recommended products",
    "products.viewAll": "All Products",
    "products.popular": "Popular",
    "products.new": "New",
    "products.discount": "Sale",
    "products.view": "View",
    "products.addToCart": "Add to Cart",
    "products.page.title": "Products",
    "products.page.subtitle":
      "All necessary products for agriculture and livestock in one place",
    "products.search": "Search products...",
    "products.filters": "Filters",
    "products.found": "products found",
    "products.notFound": "Nothing found. Try a different search term.",
    "products.categories.all": "All",
    "products.categories.texnika": "Agricultural Machinery",
    "products.categories.uruglar": "Seeds",
    "products.categories.ogitlar": "Fertilizers",
    "products.categories.chorvachilik": "Livestock",
    "products.categories.sugorish": "Irrigation Equipment",

    "product.backToProducts": "Back to Products",
    "product.price": "sum",
    "product.addToCart": "Add to Cart",
    "product.callUs": "Call Us",
    "product.warranty": "Official Warranty",
    "product.freeDelivery": "Free Delivery",
    "product.installment": "Installment Available",
    "product.specifications": "Technical Specifications",
    "product.video": "Video Guide",
    "product.similar": "Similar Products",
    "products.page.loading": "Loading...",

    "services.badge": "Services",
    "services.title": "Our Services",
    "services.subtitle":
      "Comprehensive services for farmers and agricultural workers",
    "services.viewAll": "All Services",
    "services.more": "Learn More",
    "services.page.title": "Services",
    "services.page.subtitle":
      "Comprehensive services for farmers and agricultural workers",
    "services.types.all": "All",
    "services.types.delivery": "Delivery",
    "services.types.technical": "Technical",
    "services.types.consulting": "Consultation",
    "services.types.warranty": "Warranty",
    "services.delivery.title": "Delivery Service",
    "services.delivery.desc":
      "Fast and reliable delivery across Uzbekistan. Free delivery for large orders.",
    "services.delivery.feature1": "1-3 day delivery",
    "services.delivery.feature2": "Free for large orders",
    "services.delivery.feature3": "Online tracking",
    "services.technical.title": "Technical Service",
    "services.technical.desc":
      "Professional technical service and repair of agricultural machinery and equipment.",
    "services.technical.feature1": "Experienced specialists",
    "services.technical.feature2": "Original spare parts",
    "services.technical.feature3": "Fast service",
    "services.consultation.title": "Consultation Service",
    "services.consultation.desc":
      "Free consultation service for farmers. Help in product selection and application.",
    "services.consultation.feature1": "Free consultation",
    "services.consultation.feature2": "Experienced agronomists",
    "services.consultation.feature3": "24/7 support",
    "services.warranty.title": "Warranty Service",
    "services.warranty.desc":
      "Warranty on all products. Replacement or repair of problematic items.",
    "services.warranty.feature1": "12-month warranty",
    "services.warranty.feature2": "Free replacement",
    "services.warranty.feature3": "Quick response",
    "services.rental.title": "Equipment Rental",
    "services.rental.desc": "Seasonal rental of agricultural machinery.",
    "services.rental.feature1": "Affordable prices",
    "services.rental.feature2": "Various equipment",
    "services.rental.feature3": "With operator",
    "services.analysis.title": "Agrochemical Analysis",
    "services.analysis.desc":
      "Soil and plant analysis. Help in selecting effective fertilizers and protection products.",
    "services.analysis.feature1": "Laboratory analysis",
    "services.analysis.feature2": "Recommendations",
    "services.analysis.feature3": "Free sampling",

    "about1.title": "About Us",
    "about1.subtitle": "We have been operating in the field of livestock technologies since 2008.",
    "about1.intro":
      "Chorvador.uz is the officially registered brand of our company, which began its activities in 2008 by importing mobile cow milking machines from abroad and providing technical services for them.",
    "about1.current":
      "Nowadays, it offers everything from designing livestock complexes to all the equipment and tools related to milk production.",
    "about1.dealer":
      "The company is an official dealer and partner in Uzbekistan of several leading global manufacturers of equipment for all technological processes related to milk production and processing.",
    "about1.badge": "Professional livestock equipment",
    "about1.stats.years": "YEARS",
    "about1.stats.clients": "CLIENTS",
    "about1.stats.quality": "QUALITY",
    "about1.official": "OFFICIAL DEALER",

    "about.title": "About Us",
    "about.subtitle":
      "Chorvador.uz is a trusted supplier of agricultural and livestock products across Uzbekistan",

    "about.history.badge": "Company History",
    "about.history.title": "Over 18 Years of Experience and Trust",
    "about.history.p1":
      "Is a family business brand that started its activities in 2008 by importing mobile milking machines from abroad and providing technical service for them.",
    "about.history.p2":
      "Currently offers all equipment and devices related to milk production, starting from the design of livestock complexes.",
    "about.history.p3":
      "The company is an official dealer and partner in Uzbekistan of several leading global manufacturers of equipment for all technological processes related to milk production and processing.",
    "about.history.years": "More than a year of experience",

    "about.mission.title": "Our Mission",
    "about.mission.desc":
      "To support farmers in Uzbekistan by providing high-quality agricultural products and modern technologies, along with professional consulting and services that contribute to sustainable agricultural development.",

    "about.vision.title": "Our Vision",
    "about.vision.desc":
      "To become a leading agricultural products company in Uzbekistan and Central Asia by earning customer trust through innovation and high-quality service.",

    "about.values.badge": "Our Values",
    "about.values.title": "Our Values",

    "about.values.quality.title": "Quality",
    "about.values.quality.desc":
      "We provide only certified and high-quality products",

    "about.values.reliability.title": "Reliability",
    "about.values.reliability.desc":
      "Over 18 years of experience and thousands of satisfied clients",

    "about.values.professionalism.title": "Professionalism",
    "about.values.professionalism.desc":
      "A team of qualified specialists delivering professional services",

    "contact.title": "Contact",
    "contact.subtitle":
      "Have questions? Contact us and our specialists will help you",
    "contact.form.title": "Send Message",
    "contact.form.name": "Your Name",
    "contact.form.namePlaceholder": "Enter your name",
    "contact.form.phone": "Phone Number",
    "contact.form.phonePlaceholder": "+998 97 444 00 16",
    "contact.form.message": "Message",
    "contact.form.messagePlaceholder": "Write your message...",
    "contact.form.submit": "Send Message",
    "contact.form.submitting": "Sending...",
    "contact.form.success": "Message sent!",
    "contact.form.successDesc": "We will contact you soon.",
    "contact.info.title": "Contact Information",
    "contact.info.subtitle":
      "You can visit our office or contact us through the following information.",
    "contact.address.title": "Address",
    "contact.address.value":
      "Ahmad Donish Street, 22 Home, 100057, Tashkent, Uzbekistan",
    "contact.phone.title": "Phone",
    "contact.email.title": "Email",
    "contact.hours.title": "Working Hours",
    "contact.hours.value": "Monday - Saturday: 09:00 - 18:00\nSunday: Closed",
    viewDetails: "View Details",
    learnMore: "Learn More",

    "404.title": "404",
    "404.subtitle": "Sorry! Page not found",
    "404.description":
      "The page you are looking for doesn't exist or has been moved.",
    "404.home": "Return to Home",

    "partners.badge": "Partners",
    "partners.title": "Partner Companies",
    "partners.subtitle": "We work with leading global and local companies",

    "location.badge": "Location",
    "location.title": "Our Location",
    "location.subtitle": "Visit our office or get in touch",
    "location.address":
      "Ahmad Donish Street, 22 Home, 100057, Tashkent, Uzbekistan",
    "location.phone": "+998 97 444 00 16",
    "location.email": "info@chorvador.uz",
    "location.cta": "Contact Us",
    "location.addressTitle": "Address",
    "location.phoneTitle": "Phone",
    "location.emailTitle": "Email",

    "footer.description":
      "A reliable supplier of agricultural and livestock products across Uzbekistan.",
    "footer.company.title": "Company",
    "footer.company.about": "About Us",
    "footer.company.services": "Services",
    "footer.company.products": "Products",
    "footer.company.contact": "Contact",
    "footer.products.title": "Products",
    "footer.products.machinery": "Agricultural Machinery",
    "footer.products.livestock": "Livestock Products",
    "footer.products.fertilizers": "Fertilizers and Chemicals",
    "footer.products.seeds": "Seeds",
    "footer.services.title": "Services",
    "footer.services.technical": "Technical Support",
    "footer.services.consulting": "Consulting Services",
    "footer.services.delivery": "Delivery",
    "footer.services.warranty": "Warranty Service",
    "footer.contact.title": "Contact",
    "footer.contact.address":
      "Ahmad Donish Street, 22 Home, 100057, Tashkent, Uzbekistan",
    "footer.copyright": " Chorvador.uz. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",

    "index.noProducts": "No products available yet",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved as Language) || "uz";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
