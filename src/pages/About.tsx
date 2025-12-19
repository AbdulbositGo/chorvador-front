import { Layout } from "@/components/layout/Layout";
import { CheckCircle, Target, Eye, Award } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: CheckCircle,
      title: t("about.values.quality.title"),
      description: t("about.values.quality.desc"),
    },
    {
      icon: Target,
      title: t("about.values.reliability.title"),
      description: t("about.values.reliability.desc"),
    },
    {
      icon: Award,
      title: t("about.values.professionalism.title"),
      description: t("about.values.professionalism.desc"),
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-20">
        <div className="container-main">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              {t("about.title")}
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {t("about.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Company description */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                {t("about.history.badge")}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                {t("about.history.title")}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>{t("about.history.p1")}</p>
                <p>{t("about.history.p2")}</p>
                <p>{t("about.history.p3")}</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&q=80"
                alt={t("about.title")}
                className="rounded-2xl shadow-hero w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground p-6 rounded-2xl shadow-lg">
                <div className="text-4xl font-bold">20+</div>
                <div className="text-sm font-medium">{t("about.history.years")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-muted/30">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-2xl p-8 border border-border card-hover">
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t("about.mission.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.mission.desc")}
              </p>
            </div>
            <div className="bg-card rounded-2xl p-8 border border-border card-hover">
              <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t("about.vision.title")}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {t("about.vision.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-main">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
              {t("about.values.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t("about.values.title")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl gradient-hero flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;