"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Tv,
  Smartphone,
  Monitor,
  Globe,
  Shield,
  Zap,
  Star,
  Film,
  Clock,
  Check,
} from "lucide-react";
import Footer from "../components/Footer/Footer";
import Header from "../components/header/header";
import PopularMoviesSection from "../components/PopularMoviesSection/PopularMoviesSection";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const router = useRouter();
  const t = useTranslations("Index");

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: t("featureCompletelyFree"),
      description: t("featureCompletelyFreeDesc"),
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t("featureNoAds"),
      description: t("featureNoAdsDesc"),
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: t("featurePremiumQuality"),
      description: t("featurePremiumQualityDesc"),
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: t("featureDownloadWatch"),
      description: t("featureDownloadWatchDesc"),
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("featureGlobalAccess"),
      description: t("featureGlobalAccessDesc"),
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: t("feature4KQuality"),
      description: t("feature4KQualityDesc"),
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header router={router} />
      <HeroSection router={router} />
      <InfoSection />
      <FeaturesSection features={features} />
      <PopularMoviesSection />

      <DeviceCompatibilitySection />

      <FinalCTASection router={router} />

      <Footer />
    </div>
  );
}

function HeroSection({ router }: { router: ReturnType<typeof useRouter> }) {
  const t = useTranslations("Index");

  return (
    <section className="relative pt-24 pb-16 px-6">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/imdb_top_250.jpeg"
          alt="Movie Collage"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-800/80 to-slate-900/90 z-10" />
      </div>

      <div className="container mx-auto relative z-20">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              {t.rich("title", {
                br: () => <br />,
                gradient: (chunks) => (
                  <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    {chunks}
                  </span>
                ),
              })}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              {t("heroSubtitle")}
              <br />
              <span className="text-orange-400 font-semibold">{t("benefitNoAds")}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
          >
            {[
              {
                text: t("benefitFree"),
                icon: <Shield className="w-5 h-5" />,
                color: "text-green-400",
              },
              {
                text: t("benefitNoAds"),
                icon: <Zap className="w-5 h-5" />,
                color: "text-blue-400",
              },
              {
                text: t("benefit4K"),
                icon: <Star className="w-5 h-5" />,
                color: "text-yellow-400",
              },
              {
                text: t("benefitInstant"),
                icon: <Clock className="w-5 h-5" />,
                color: "text-purple-400",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3"
              >
                <span className={benefit.color}>{benefit.icon}</span>
                <span className="text-gray-200 font-medium text-sm">
                  {benefit.text}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <p className="text-lg mb-6">
              {t("callToAction")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl"
            >
              {t("signUpFree")}
            </button>
            <button
              onClick={() => router.push("/login")}
              className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 backdrop-blur-sm"
            >
              {t("signIn")}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InfoSection() {
  const t = useTranslations("Index");
  return (
    <section className="py-20 px-6 bg-slate-950/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            {t("infoTitle")}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("infoDescription")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6">{t("howItWorks")}</h3>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: t("step1Title"),
                  desc: t("step1Desc"),
                  color: "bg-orange-500",
                },
                {
                  step: "2",
                  title: t("step2Title"),
                  desc: t("step2Desc"),
                  color: "bg-pink-500",
                },
                {
                  step: "3",
                  title: t("step3Title"),
                  desc: t("step3Desc"),
                  color: "bg-purple-500",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div
                    className={`text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm ${item.color}`}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Image
              src="/imk.jpeg"
              alt="Z-tube Interface"
              width={600}
              height={400}
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-pink-500/20 rounded-2xl" />
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">{t("whyChoose")}</h3>
          <p className="text-gray-300 text-lg">
            {t("whyChooseSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <WhyChooseCard
            icon={<Shield className="w-8 h-8 text-green-400" />}
            title={t("featureCompletelyFree")}
            desc={t("featureCompletelyFreeDesc")}
            bg="bg-slate-800/50"
            border="border-slate-700/50"
          />
          <WhyChooseCard
            icon={<Zap className="w-8 h-8 text-blue-400" />}
            title={t("featureNoAds")}
            desc={t("featureNoAdsDesc")}
            bg="bg-slate-800/50"
            border="border-slate-700/50"
          />
          <WhyChooseCard
            icon={<Star className="w-8 h-8 text-purple-400" />}
            title={t("featurePremiumQuality")}
            desc={t("featurePremiumQualityDesc")}
            bg="bg-slate-800/50"
            border="border-slate-700/50"
          />
        </div>
      </div>
    </section>
  );
}

function WhyChooseCard({
  icon,
  title,
  desc,
  bg,
  border,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  bg: string;
  border: string;
}) {
  return (
    <div className={`${bg} border ${border} rounded-2xl p-8 text-center`}>
      <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-bold mb-3">{title}</h4>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

function FeaturesSection({
  features,
}: {
  features: (typeof HomePage.prototype)["features"];
}) {
  const t = useTranslations("Index");
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            {t("featuresTitle")}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-orange-500/30 transition-all duration-300"
            >
              <div className="text-orange-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeviceCompatibilitySection() {
  const t = useTranslations("Index");
  return (
    <section className="py-20 px-6 bg-slate-950/50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            {t("devicesTitle")}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t("devicesSubtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {[
            {
              icon: <Monitor className="w-12 h-12" />,
              name: t("deviceComputer"),
              desc: t("deviceComputerDesc"),
            },
            {
              icon: <Smartphone className="w-12 h-12" />,
              name: t("deviceMobile"),
              desc: t("deviceMobileDesc"),
            },
          ].map((device: any, index: number) => (
            <div
              key={index}
              className="text-center bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="text-purple-400 mb-4 flex justify-center">
                {device.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{device.name}</h3>
              <p className="text-gray-400">{device.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTASection({ router }: { router: ReturnType<typeof useRouter> }) {
  const t = useTranslations("Index");
  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/50 rounded-3xl p-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            {t("finalCTATitle")}
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t("finalCTASubtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push("/register")}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 shadow-xl"
            >
              {t("createFreeAccount")}
            </button>
            <button
              onClick={() => router.push("/login")}
              className="border-2 border-white/30 text-white hover:bg-white/10 px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200"
            >
              {t("signIn")}
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                icon: <Check className="w-5 h-5" />,
                text: t("benefitNoCard"),
              },
              { icon: <Check className="w-5 h-5" />, text: t("benefitInstantAccess") },
              { icon: <Check className="w-5 h-5" />, text: t("benefitCancelAnytime") },
            ].map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-300"
              >
                <span className="text-green-400">{benefit.icon}</span>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
